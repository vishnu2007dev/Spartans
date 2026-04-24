interface ResumeSuggestionsProps {
  suggestions: string[];
}

export function ResumeSuggestions({ suggestions }: ResumeSuggestionsProps) {
  return (
    <ol className="flex flex-col">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="flex items-start gap-4 py-4"
          style={{
            borderBottom:
              index < suggestions.length - 1
                ? "1px solid var(--border)"
                : undefined,
          }}
        >
          <span
            className="font-bold shrink-0 tabular-nums"
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              minWidth: 24,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {suggestion}
          </span>
        </li>
      ))}
    </ol>
  );
}
