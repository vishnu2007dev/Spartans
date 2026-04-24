import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden py-28 md:py-36 lg:py-44"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Grid background */}
      <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 text-center">
        {/* Announcement pill */}
        <div
          className="animate-fade-up inline-flex items-center gap-2 mb-8"
          style={{ animationDelay: "0ms" }}
        >
          <Badge variant="default" className="text-[10px] px-1.5 py-0.5">NEW</Badge>
          <span
            className="text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            Roadmaps v2 with weekly check-ins
          </span>
          <ArrowRight
            className="size-3.5"
            style={{ color: "var(--text-dim)" }}
            aria-hidden="true"
          />
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up mx-auto max-w-4xl font-bold leading-[1.0] tracking-[-0.045em]"
          style={{
            fontSize: "clamp(44px, 7.5vw, 92px)",
            animationDelay: "60ms",
          }}
        >
          <span style={{ color: "var(--heading)" }}>Stop applying{" "}
            <em
              style={{ color: "var(--action)", fontStyle: "italic", fontWeight: 500 }}
            >
              blindly.
            </em>
          </span>
          <br />
          <span style={{ color: "var(--heading-sub)" }}>
            Start preparing strategically.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up mx-auto mt-7 max-w-[52ch] leading-relaxed"
          style={{
            fontSize: "18px",
            color: "var(--text-muted)",
            animationDelay: "120ms",
          }}
        >
          Pick the roles you want. Paste your profile. Get a personalized skill
          roadmap that tells you exactly what to learn — and in what order.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "180ms" }}
        >
          <Button size="lg" asChild>
            <Link href="/onboarding">
              Find my path <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
