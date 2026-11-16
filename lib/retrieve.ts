import { embed } from "ai";
import index from "@/data/index.json";
import { embeddingModel, EMBEDDING_MODEL_NAME } from "./models";
import { cosineSimilarity } from "./similarity";

export type Hit = {
  id: string;
  source: string;
  heading: string;
  text: string;
  score: number;
};

type IndexedChunk = Omit<Hit, "score"> & { embedding: number[] };

const chunks = index.chunks as IndexedChunk[];

if (index.model !== EMBEDDING_MODEL_NAME) {
  throw new Error(
    `Indeks zbudowany modelem ${index.model}, a aplikacja uzywa ${EMBEDDING_MODEL_NAME}.
    Uruchom ponownie indeksowanie`,
  );
}

export async function retrieve(
  question: string,
  { topK = 4, minScore = 0.45 }: { topK?: number; minScore?: number } = {},
): Promise<Hit[]> {
  const { embedding } = await embed({ model: embeddingModel, value: question });

  return chunks
    .map(({ embedding: e, ...chunk }) => ({
      ...chunk,
      score: cosineSimilarity(embedding, e),
    }))
    .filter((hit) => hit.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
