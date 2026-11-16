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
Based on this gap, `minScore` is set to **0.45**. It also filters out weak,
unrelated matches such as `urlopy.md › Zaległy urlop` (0.423) for the lost-laptop question.
Typos and missing Polish diacritics ("zglosic", "piatek") don't affect retrieval.
