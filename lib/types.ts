export type Source = {
  id: string;
  n: number;
  source: string;
  heading: string;
  text: string;
  score: number;
};

export type ChatMetadata = { sources?: Source[] };
