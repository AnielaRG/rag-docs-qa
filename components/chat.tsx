"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sources } from "./sources";
import type { ChatMetadata } from "@/lib/types";
import { strings } from "@/lib/strings";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const examples = [
  strings.chat.exampleQuestion1,
  strings.chat.exampleQuestion2,
  strings.chat.exampleQuestion3,
  strings.chat.exampleQuestion4,
];

export function Chat() {
  const [input, setInput] = useState("");
  const [stoppedIds, setStoppedIds] = useState<Set<string>>(new Set());
  const { messages, sendMessage, status, error, stop, regenerate } =
    useChat<UIMessage<ChatMetadata>>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();

    if (!text || busy) {
      return;
    }
    sendMessage({ text });
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleStop = () => {
    stop();
    const last = messages.at(-1);
    if (last?.role === "assistant") {
      setStoppedIds((prev) => new Set(prev).add(last.id));
    }
  };

  const handleExample = (question: string) => {
    sendMessage({ text: question });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="mx-auto flex h-dvh w-full max-w-3xl flex-col gap-4 bg-muted/40 p-4">
      <header className="border-b py-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {strings.chat.title}
        </h1>
      </header>
      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-2 py-4 scrollbar-gutter-stable"
        role="log"
        aria-live="polite"
        aria-busy={status === "streaming"}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-end gap-2">
            {examples.map((question) => (
              <Button
                className="h-auto whitespace-normal py-2 text-right"
                key={question}
                variant="secondary"
                size="sm"
                onClick={() => handleExample(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <Card
            key={m.id}
            className={cn(
              "w-fit gap-2 rounded-2xl px-4 py-3 shadow-md ring-1 ring-foreground/15",
              m.role === "user"
                ? "ml-auto max-w-[80%] p-3 items-end"
                : "max-w-[90%] p-3",
            )}
          >
            <div className="space-y-2">
              {m.parts.map((p, i) =>
                p.type === "text" ? (
                  <ReactMarkdown key={i}>{p.text}</ReactMarkdown>
                ) : null,
              )}
            </div>
            {stoppedIds.has(m.id) && (
              <p className="text-sm text-muted-foreground">
                {strings.chat.stopped}
              </p>
            )}
            {m.role === "assistant" && m.metadata?.sources && (
              <Sources sources={m.metadata.sources} />
            )}
          </Card>
        ))}

        {status === "submitted" && (
          <p className="text-muted-foreground">{strings.chat.thinking}</p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded border border-destructive p-3 text-destructive"
          >
            {strings.chat.error + " "}
            <Button variant="link" onClick={() => regenerate()}>
              {strings.chat.buttonTryAgain}
            </Button>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <form className="flex gap-2 border-t py-4" onSubmit={handleSubmit}>
        <label htmlFor="question" className="sr-only">
          {strings.chat.question}
        </label>
        <Input
          className="h-11 border-foreground/20 bg-background shadow-sm focus-visible:border-foreground/40 focus-visible:ring-ring/50"
          id="question"
          value={input}
          onChange={handleInputChange}
          placeholder={strings.chat.placeholder}
          maxLength={500}
          disabled={busy}
        />
        {busy ? (
          <Button
            className="h-11"
            type="button"
            variant="outline"
            onClick={handleStop}
          >
            {strings.chat.stop}
          </Button>
        ) : (
          <Button className="h-11" type="submit" disabled={!input.trim()}>
            {strings.chat.send}
          </Button>
        )}
      </form>
    </main>
  );
}
