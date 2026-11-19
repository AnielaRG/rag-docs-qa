import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import type { Source } from "@/lib/types";
import { strings } from "@/lib/strings";

export function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    // return (
    //   <p className="mt-2 text-sm text-muted-foreground">
    //     {strings.sources.empty}
    //   </p>
    // );
    return null;
  }

  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer rounded text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {strings.sources.title(sources.length)}
      </summary>
      <ul className="mt-2 space-y-2">
        {sources.map((s) => (
          <li key={s.id} className="rounded border p-2">
            <details className="group">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-1">
                <Badge variant="secondary">[{s.n}]</Badge>
                <span className="font-medium">{s.source}</span>
                <span className="text-muted-foreground"> - {s.heading}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {strings.sources.score(s.score)}
                </span>
              </summary>
              <div className="mt-2 text-muted-foreground">
                <ReactMarkdown>{s.text}</ReactMarkdown>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </details>
  );
}
