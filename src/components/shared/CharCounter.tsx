import { countChars } from "@/lib/char-counter.utils";
import "./char-counter.scss";

interface CharCounterProps {
  /** Current field value to count (replaces the Angular AbstractControl input). */
  value: string;
  max?: number;
  stripHtml?: boolean;
}

export function CharCounter({ value, max, stripHtml = false }: CharCounterProps) {
  const counts = countChars(typeof value === "string" ? value : "", stripHtml);

  return (
    <p className="char-counter" aria-live="polite">
      <span>{counts.withSpaces} with spaces</span>
      <span className="char-counter__sep" aria-hidden="true">·</span>
      <span>{counts.withoutSpaces} without spaces</span>
      {max != null && (
        <>
          <span className="char-counter__sep" aria-hidden="true">·</span>
          <span className="char-counter__max">max {max}</span>
        </>
      )}
    </p>
  );
}
