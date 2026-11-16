import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { chatModel } from "@/lib/models";
import { retrieve } from "@/lib/retrieve";
import { buildSystemPrompt } from "@/lib/prompt";
import { Source } from "@/lib/types";

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

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Nieprawidlowy JSON", { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return new Response("Nieprawidlowe żądanie", { status: 400 });
  }

  const messages = parsed.data.messages as UIMessage[];

  const question = lastUserText(messages);

  if (!question) {
    return new Response("Puste pytanie", { status: 400 });
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return new Response("Pytanie jest za dlugie", { status: 400 });
  }

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
      onError: (error) => {
        console.error(error);
        return "Wystąpił błąd podczas generowania odpowiedzi.";
      },
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
}
