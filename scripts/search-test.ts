import { readFileSync } from "node:fs";
import { embed } from "ai";
import { cosineSimilarity } from "@/lib/similarity";
import { EMBEDDING_MODEL_NAME } from "@/lib/models";
import { openai } from "@ai-sdk/openai";

type IndexedChunk = {
  id: string;
  source: string;
  heading?: string;
  text: string;
  embedding: number[];
};

const model = openai.embedding(EMBEDDING_MODEL_NAME);

const questions = [
  "Ile dni wczesniej musze zglosic tygodniowy urlop?",
  "Czy mogę zrobić deploy w piatek?",
  "Zgubiłem laptop, co mam zrobić?",
  "Od kiedy mogę mieć dyur on-call?",
  "Jaka jest stolica Peru?",
  "Jak ugotować pierogi?",
];

async function main() {
  const { chunks: index }: { chunks: IndexedChunk[] } = JSON.parse(
    readFileSync("data/index.json", "utf8"),
  );

  for (const q of questions) {
    const { embedding } = await embed({ model, value: q });

    const top = index
      .map((c) => ({ ...c, score: cosineSimilarity(embedding, c.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log(`\n? ${q}`);
    for (const c of top) {
      console.log(`   ${c.score.toFixed(3)} ${c.source} > ${c.heading ?? "-"}`);
    }
  }
}

main();
