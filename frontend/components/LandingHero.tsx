import Link from "next/link";

export default function LandingHero() {
  return (
    <section
      aria-label="Hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      {/* Background teal glow */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(0, 212, 170, 0.07)" }}
        aria-hidden="true"
      />
      {/* Secondary glow bottom-left for depth */}
      <div
        className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(0, 212, 170, 0.04)" }}
        aria-hidden="true"
      />
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--color-teal)" }}
        >
          Unlockd
        </span>
        <span
          className="hidden sm:block text-sm opacity-50"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--color-offwhite)" }}
        >
          AI-Powered Career Prep
        </span>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-20 sm:px-10 lg:px-16 max-w-5xl mx-auto w-full">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 self-start animate-fade-up"
          style={{ animationDelay: "0ms", animationFillMode: "both" }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "var(--color-teal)",
              borderColor: "rgba(0, 212, 170, 0.3)",
              backgroundColor: "rgba(0, 212, 170, 0.08)",
            }}
          >
            AI-Powered Career Prep
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-up"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            color: "var(--color-offwhite)",
            animationDelay: "80ms",
            animationFillMode: "both",
          }}
        >
          Stop applying{" "}
          <span style={{ color: "var(--color-teal)" }}>blindly.</span>
          <br />
          Start preparing
          <br />
          strategically.
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl max-w-xl mb-10 leading-relaxed opacity-70 animate-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "var(--color-offwhite)",
            animationDelay: "160ms",
            animationFillMode: "both",
          }}
        >
          Pick the roles you want. Paste your profile. Get a personalized skill
          roadmap that tells you exactly what to learn — and in what order.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "240ms", animationFillMode: "both" }}
        >
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              backgroundColor: "var(--color-teal)",
              color: "var(--color-navy)",
            }}
          >
            Find My Path →
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap gap-6 mt-14 animate-fade-up"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          {[
            { value: "8–12", label: "curated roles" },
            { value: "AI-powered", label: "gap analysis" },
            { value: "4-week", label: "roadmaps" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--color-amber)" }}
              >
                {stat.value}
              </span>
              <span
                className="text-sm opacity-50"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "var(--color-offwhite)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fade-up keyframes */}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
}
