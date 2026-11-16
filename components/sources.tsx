import { Badge } from "@/components/ui/badge";
import type { Source } from "@/lib/types";
import { strings } from "@/lib/strings";

export function Sources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) {
    return (
      <p className="mt-2 text-sm text-muted-foreground">
        {strings.sources.empty}
      </p>
    );
  }

  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer text-muted-foreground">
        {strings.sources.title(sources.length)}
      </summary>
      <ul className="mt-2 space-y-2">
        {sources.map((s) => (
          <li key={s.id} className="rounded border p-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">[{s.n}]</Badge>
              <span className="font-medium">{s.source}</span>
              <span className="text-muted-foreground"> - {s.heading}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {strings.sources.score(s.score)}
              </span>
            </div>
            <p className="mt-1 line-clamp-3 text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}
