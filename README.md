This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Known limitations

**Oversized paragraphs are not split.** The chunker splits documents on paragraph boundaries and merges paragraphs up to `maxChars` (default 1200) with a `overlapChars` (default 200) overlap. A single paragraph longer than `maxChars` becomes one oversized chunk. This is fine for the demo docs, where paragraphs are short, but long unbroken text (e.g. pasted logs or tables) could produce chunks that embed less precisely. A possible fix is a fallback that splits oversized paragraphs on sentence boundaries.

- **In-memory JSON index.** Embeddings are stored in `data/index.json` (~1–2 MB) and imported into the server bundle; retrieval is a brute-force cosine similarity over all chunks. This is fast enough for a few dozen chunks, but wouldn't scale to thousands of documents. The next step would be a vector database (e.g. Postgres + pgvector) with an approximate nearest-neighbour index.

## How retrieval works

`lib/retrieve.ts` embeds the question with the same model used for indexing, scores every chunk with cosine similarity, drops chunks below `minScore` (0.45), and returns the top `topK` (4) hits with their source file and section heading.

If the index was built with a different embedding model than the app uses, the module throws on import — mixing vectors from two models would silently produce meaningless scores.

## Retrieval sanity check

`scripts/search-test.ts` embeds a few test questions and prints the top 3 chunks
(source › heading, cosine score) from `data/index.json`.

| Question                                    | Top match                                    | Score |
| ------------------------------------------- | -------------------------------------------- | ----- |
| Ile dni wcześniej zgłosić tygodniowy urlop? | urlopy.md › Jak zgłosić urlop                | 0.707 |
| Czy mogę zrobić deploy w piątek?            | deploy.md › Okna wdrożeniowe                 | 0.667 |
| Zgubiłem laptopa, co robić?                 | sprzet-i-bezpieczenstwo.md › Zgubiony sprzęt | 0.591 |
| Od kiedy mogę mieć dyżur on-call?           | dyzury-i-incydenty.md › Kto pełni dyżury     | 0.609 |
| Jaka jest stolica Peru? _(off-topic)_       | praca-zdalna.md › Biura                      | 0.266 |
| Jak ugotować pierogi? _(off-topic)_         | onboarding.md › Pierwszy tydzień             | 0.289 |

Relevant top-1 matches score ≥ 0.59, off-topic questions ≤ 0.29.
Based on this gap, `minScore` is set to **0.45**. It also filters out weak, unrelated matches such as `urlopy.md › Zaległy urlop` (0.423) for the lost-laptop question.
Typos and missing Polish diacritics ("zglosic", "piatek") don't affect retrieval.

## Error handling

`app/api/chat/route.ts` separates client errors from server errors:

| Situation                                                                       | Status | Message shown to the user                       |
| ------------------------------------------------------------------------------- | ------ | ----------------------------------------------- |
| Invalid JSON, wrong body shape (validated with zod), empty or too long question | 400    | specific reason (e.g. "Pytanie jest za długie") |
| OpenAI rejects the API key (401/403)                                            | 503    | service temporarily unavailable                 |
| OpenAI rate limit (429)                                                         | 429    | too many requests, try again shortly            |
| Anything else                                                                   | 500    | generic server error                            |

- Upstream errors are **translated, not forwarded**: a 401 from OpenAI is a server
  misconfiguration, not an unauthenticated user, so the client gets 503.
- Full error details (including OpenAI's message) are logged server-side only;
  the browser never sees provider internals.
- Errors before streaming starts (e.g. while embedding the question) return an HTTP
  error response; errors during streaming are sent as an error event in the stream
  (`onError`), since the status code has already been sent.
- On the client, the error is shown with a retry button (`regenerate()` from `useChat`).
- All user-facing texts live in `lib/strings.ts`.

## Retrieval evaluation

`npm run eval` runs 15 questions from `data/eval.json` (12 answerable, 3 out-of-scope)
and checks whether the expected source file is among the retrieved chunks
(out-of-scope questions pass when nothing is retrieved). Parameters can be overridden:
`npm run eval -- --minScore 0.35 --topK 2`.

| minScore | topK  | maxChars | Hit rate  | Notes                                                    |
| -------- | ----- | -------- | --------- | -------------------------------------------------------- |
| **0.45** | **4** | **1200** | **15/15** | baseline (chosen)                                        |
| 0.35     | 4     | 1200     | 15/15     | lets in irrelevant chunks (0.37–0.44)                    |
| 0.55     | 2     | 1200     | 12/15     | drops correct answers scoring 0.53–0.55                  |
| 0.45     | 2     | 1200     | 15/15     | correct file always in top 2                             |
| 0.45     | 4     | 600      | 15/15     | more, smaller chunks; no gain                            |
| 0.45     | 4     | 2000     | 15/15     | identical to 1200 (sections are shorter than 1200 chars) |

The weakest correct top-1 match scores **0.53**; the strongest out-of-scope question
scores **0.29**. `minScore = 0.45` sits between them with margin on both sides.
`topK = 4` is kept (although 2 is enough for single questions) to leave room for
multi-part questions, which this eval set does not cover.
