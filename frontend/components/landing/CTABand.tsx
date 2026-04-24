import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABand() {
  return (
    <section
      aria-label="Call to action"
      className="relative overflow-hidden py-28"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Tighter grid background */}
      <div className="grid-bg-tight absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 text-center">
        <h2
          className="font-bold tracking-[-0.03em] mx-auto max-w-3xl"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "var(--heading)" }}
        >
          From blind applications to{" "}
          <em
            style={{ color: "var(--action)", fontStyle: "italic", fontWeight: 500 }}
          >
            strategic moves.
          </em>
        </h2>

        <p
          className="mt-5 mx-auto max-w-[44ch]"
          style={{ fontSize: "17px", color: "var(--text-muted)" }}
        >
          Start your first roadmap in under 2 minutes. Free to try.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
