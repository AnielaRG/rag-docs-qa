import { openai } from "@ai-sdk/openai";

export const embeddingModel = openai.embedding("text-embedding-3-small");
export const EMBEDDING_MODEL_NAME = "text-embedding-3-small";

export const chatModel = openai("gpt-4o-mini");
