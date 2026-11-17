import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  APICallError,
  RetryError,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { chatModel } from "@/lib/models";
import { retrieve } from "@/lib/retrieve";
import { buildSystemPrompt } from "@/lib/prompt";
import { Source } from "@/lib/types";
import { strings } from "@/lib/strings";
import { error } from "console";

export const maxDuration = 30;

const MAX_QUESTION_LENGTH = 500;

const bodySchema = z.object({
  messages: z
    .array(
      z.looseObject({
        id: z.string(),
        role: z.enum(["user", "assistant", "system"]),
        parts: z.array(z.looseObject({ type: z.string() })),
      }),
    )
    .min(1),
});

function lastUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) {
    return "";
  }
  return last.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
}

function describeError(error: unknown): { status: number; message: string } {
  console.error("[api/chat] ", error);

  const err = RetryError.isInstance(error) ? error.lastError : error;

  if (APICallError.isInstance(err)) {
    if (err.statusCode === 401 || err.statusCode === 403) {
      return {
        status: 503,
        message: strings.api.unavailable,
      };
    }
    if (err.statusCode === 429) {
      return {
        status: 429,
        message: strings.api.rateLimited,
      };
    }
  }
  return {
    status: 500,
    message: strings.api.serverError,
  };
}

function errorResponse(status: number, message: string) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; chatset=utf-8" },
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, strings.api.invalidJson);
  }

  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(400, strings.api.invalidRequest);
  }

  const messages = parsed.data.messages as UIMessage[];

  const question = lastUserText(messages);

  if (!question) {
    return errorResponse(400, strings.api.emptyQuestion);
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return errorResponse(400, strings.api.questionTooLong);
  }

  try {
    const hits = await retrieve(question);

    const result = streamText({
      model: chatModel,
      system: buildSystemPrompt(hits),
      messages: await convertToModelMessages(messages.slice(-6)),
      temperature: 0.2,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: (error) => describeError(error).message,
        messageMetadata: ({ part }) =>
          part.type === "start"
            ? {
                sources: hits.map(
                  (h, i): Source => ({
                    id: h.id,
                    n: i + 1,
                    source: h.source,
                    heading: h.heading,
                    text: h.text,
                    score: Number(h.score.toFixed(3)),
                  }),
                ),
              }
            : undefined,
      }),
    });
  } catch {
    const { status, message } = describeError(error);
    return errorResponse(status, message);
  }
}
