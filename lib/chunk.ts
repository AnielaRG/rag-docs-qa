import { MAX_CHARS } from "./consts";

export type Chunk = {
  id: string;
  source: string;
  heading: string;
  text: string;
};

type Options = {
  maxChars?: number;
  overlapChars?: number;
};

function splitBySections(markdown: string) {
  const lines = markdown.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let heading = "";
  let body: string[] = [];

  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.*)/);

    if (match) {
      if (body.join("".trim())) {
        sections.push({ heading, body: body.join("\n") });
      }
      heading = match[1].trim();
      body = [];
    } else {
      body.push(line);
    }
  }

  if (body.join("").trim()) {
    sections.push({ heading, body: body.join("\n") });
  }

  return sections;
}

export function chunkMarkDown(
  source: string,
  markdown: string,
  { maxChars = MAX_CHARS, overlapChars = 200 }: Options = {},
): Chunk[] {
  const chunks: Chunk[] = [];
  const sections = splitBySections(markdown);

  for (const { heading, body } of sections) {
    const paragraphs = body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    let current = "";

    const flush = () => {
      if (!current.trim()) {
        return;
      }
      chunks.push({
        id: `${source}#${chunks.length}`,
        source,
        heading,
        text: heading ? `${heading}\n\n${current.trim()}` : current.trim(),
      });
      current = current.slice(-overlapChars);
    };

    for (const p of paragraphs) {
      if (
        (current + "\n\n" + p).length > maxChars &&
        current.length > overlapChars
      ) {
        flush();
      }
      current = current ? `${current}\n\n${p}` : p;
    }
    flush();
  }

  return chunks;
}
