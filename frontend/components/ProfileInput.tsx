"use client";

interface ProfileInputProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function ProfileInput({ value, onChange, error }: ProfileInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="profile-input"
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--text-dim)" }}
      >
        Your Profile
      </label>

      <textarea
        id="profile-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your resume, LinkedIn summary, or skills overview here..."
        className="w-full min-h-[200px] rounded-xl p-4 text-sm resize-y"
        style={{
          backgroundColor: "var(--bg-elev)",
          border: error ? "1px solid #ef4444" : "1px solid var(--border)",
          color: "var(--text)",
          fontFamily: "var(--font-manrope)",
          fontSize: "14px",
          outline: "none",
          caretColor: "var(--accent)",
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.border = "1px solid var(--accent)";
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.border = "1px solid var(--border)";
          }
        }}
        aria-describedby={error ? "profile-error" : "profile-hint"}
        aria-invalid={!!error}
      />

      {error ? (
        <p id="profile-error" className="text-xs" style={{ color: "#ef4444" }}>
          {error}
        </p>
      ) : (
        <p
          id="profile-hint"
          className="font-mono text-[12px]"
          style={{ color: "var(--text-dim)" }}
        >
          The more detail you provide, the more accurate your roadmap will be.
        </p>
      )}
    </div>
  );
}
