import { readFile } from "fs/promises";
import { parseArgs } from "node:util";
import { retrieve } from "@/lib/retrieve";
import { MIN_SCORE, TOP_K } from "@/lib/consts";

type Case = { question: string; expectedSource: string | null };

const { values } = parseArgs({
  options: {
    minScore: { type: "string" },
    topK: { type: "string" },
  },
});
const minScore = values.minScore ? Number(values.minScore) : MIN_SCORE;
const topK = values.topK ? Number(values.topK) : TOP_K;

async function main() {
  const cases: Case[] = JSON.parse(await readFile("data/eval.json", "utf8"));
  let passed = 0;

  for (const c of cases) {
    const hits = await retrieve(c.question, { minScore, topK });
    const [best] = await retrieve(c.question, { minScore: 0, topK: 1 });

    const sources = hits.map((h) => h.source);
    const ok =
      c.expectedSource === null
        ? hits.length === 0
        : sources.includes(c.expectedSource);

    if (ok) {
      passed++;
    }
    console.log(
      `${ok ? "OK  " : "FAIL"} ${c.question}\n` +
        `     → ${hits.map((h) => `${h.source} (${h.score.toFixed(2)})`).join(", ") || "brak"}\n` +
        `     best: ${best?.source} (${best?.score.toFixed(2)})`,
    );
  }

  console.log(`\nminScore=${minScore} topK=${topK}`);
  console.log(
    `Hit rate: ${passed}/${cases.length} (${Math.round((passed / cases.length) * 100)}%)`,
  );
}

main();
