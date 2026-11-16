export const strings = {
  chat: {
    title: "Zapytaj o dokumentację z kartoteki",
    example: "Zadaj pytanie o dokumentację, np. „Jak zgłosić urlop?”",
    placeholder: "Twoje pytanie…",
    send: "Wyślij",
    stop: "Zatrzymaj",
    thinking: "Szukam w dokumentach...",
    error: "Coś poszło nie tak.",
    buttonTryAgain: "Spróbuj ponownie",
    question: "Pytanie",
  },
  sources: {
    title: (count: number) => `Źródła (${count})`,
    empty: "Brak pasujących fragmentów w dokumentach.",
    score: (score: number) => `score ${score}`,
  },
  api: {
    invalidJson: "Nieprawidłowy JSON",
    invalidRequest: "Nieprawidłowe żądanie",
    emptyQuestion: "Puste pytanie",
    questionTooLong: "Pytanie jest za długie",
    streamError: "Wystąpił błąd podczas generowania odpowiedzi.",
  },
} as const;
