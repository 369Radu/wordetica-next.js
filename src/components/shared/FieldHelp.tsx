import "./field-help.scss";

interface FieldHelpProps {
  /** What this field is for and how to write it. */
  hint: string;
  /** Concrete example the author can adapt. */
  example: string;
  /** Optional short label shown above the hint (defaults to "What to write"). */
  tipLabel?: string;
  exampleLabel?: string;
}

export function FieldHelp({
  hint,
  example,
  tipLabel = "What to write",
  exampleLabel = "Example",
}: FieldHelpProps) {
  return (
    <span className="field-help">
      <button
        type="button"
        className="field-help__trigger"
        aria-label={tipLabel + ". " + hint}
      >
        <svg className="field-help__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10 9.2v4.2M10 6.4h.01"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span className="field-help__popover" role="tooltip">
        <span className="field-help__label">{tipLabel}</span>
        <p className="field-help__text">{hint}</p>
        <span className="field-help__label field-help__label--example">{exampleLabel}</span>
        <p className="field-help__example">{example}</p>
      </span>
    </span>
  );
}
