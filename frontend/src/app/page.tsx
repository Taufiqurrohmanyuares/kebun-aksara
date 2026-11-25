import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Worlds from "@/components/Worlds";
import Method from "@/components/Method";
import Parents from "@/components/Parents";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import PaperReveal from "@/components/PaperReveal";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-3 focus:rounded-full focus:bg-[var(--color-sun)] focus:text-[var(--color-ink)] focus:font-bold"
      >
        Langsung ke konten utama
      </a>

      <Header />

      <main id="konten-utama" className="flex-1">
        <Hero />
        <Worlds />
        <PaperReveal>
          <Method />
        </PaperReveal>
        <PaperReveal>
          <Parents />
        </PaperReveal>
        <PaperReveal>
          <FinalCta />
        </PaperReveal>
      </main>

      <Footer />
    </div>
  );
}