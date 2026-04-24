export function Footer() {
  return (
    <footer
      className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10 flex items-center justify-between"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <p
        className="text-sm"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}
      >
        © 2026 Unlockd
      </p>

      <div className="flex items-center gap-2">
        {/* Green status dot with glow */}
        <span
          className="size-2 rounded-full"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 6px var(--accent)",
          }}
          aria-hidden="true"
        />
        <span
          className="text-sm"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}
        >
          All systems operational
        </span>
      </div>
    </footer>
  );
}
