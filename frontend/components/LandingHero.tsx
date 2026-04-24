import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Bento } from "@/components/landing/Bento";
import { CTABand } from "@/components/landing/CTABand";
import { Footer } from "@/components/landing/Footer";

export default function LandingHero() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main>
        <Hero />
        <Bento />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
