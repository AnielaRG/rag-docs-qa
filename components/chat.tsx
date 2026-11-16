"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sources } from "./sources";
import type { Source, ChatMetadata } from "@/lib/types";
import { strings } from "@/lib/strings";

export function Chat() {
  const [input, setInput] = useState("");
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mx-auto flex h-dvh max-w-3xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">{strings.chat.title}</h1>
      <div
        className="flex-1 space-y-4 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-busy={status === "streaming"}
      >
        {messages.length === 0 && (
          <p className="text-muted-foreground">{strings.chat.example}</p>
        )}

        {messages.map((m) => (
          <Card
            key={m.id}
            className={
              m.role === "user" ? "ml-auto max-w-[80%] p-3" : "max-w-[90%] p-3"
            }
          >
            <p className="whitespace-pre-wrap">
              {m.parts.map((p, i) =>
                p.type === "text" ? <span key={i}>{p.text}</span> : null,
              )}
            </p>
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

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <label htmlFor="question" className="sr-only">
          {strings.chat.question}
        </label>
        <Input
          id="question"
          value={input}
          onChange={handleInputChange}
          placeholder={strings.chat.placeholder}
          maxLength={500}
          disabled={busy}
        />
        {busy ? (
          <Button type="button" variant="outline" onClick={() => stop()}>
            {strings.chat.stop}
          </Button>
        ) : (
          <Button type="submit" disabled={!input.trim()}>
            {strings.chat.stop}
          </Button>
        )}
      </form>
    </div>
  );
}
