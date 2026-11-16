import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { embedMany } from "ai";
import { chunkMarkDown, type Chunk } from "@/lib/chunk";
import { embeddingModel, EMBEDDING_MODEL_NAME } from "@/lib/models";

const DOCS_DIR = path.join(process.cwd(), "data/docs");
const OUT_FILE = path.join(process.cwd(), "data/index.json");
const BATCH = 50;

async function main() {
  const files = (await readdir(DOCS_DIR)).filter((f) => f.endsWith(".md"));
  const chunks: Chunk[] = [];

  for (const file of files) {
    const content = await readFile(path.join(DOCS_DIR, file), "utf8");
    chunks.push(...chunkMarkDown(file, content));
  }
  console.log(`${files.length} plikow -> ${chunks.length} fragmentow`);

  const embeddings: number[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const { embeddings: vectors } = await embedMany({
      model: embeddingModel,
      values: batch.map((c) => c.text),
    });
    embeddings.push(...vectors);
    console.log(
      `embeddingi(osadzenia): ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`,
    );

    const index = {
      model: EMBEDDING_MODEL_NAME,
      dimensions: embeddings[0]?.length ?? 0,
      createdAt: new Date().toISOString(),
      chunks: chunks.map((c, i) => ({ ...c, embedding: embeddings[i] })),
    };

    await writeFile(OUT_FILE, JSON.stringify(index));
    console.log(`Zapisano ${OUT_FILE}`);
  }
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
