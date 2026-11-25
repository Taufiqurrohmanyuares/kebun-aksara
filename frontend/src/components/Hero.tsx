import Link from "next/link";
import HeroForestScene from "./illustrations/HeroForestScene";
import PaperReveal from "./PaperReveal";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-8 lg:min-h-[calc(100svh-72px)] lg:flex lg:items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[40px] items-center">
        <PaperReveal delay={40}>
          <h1 className="text-4xl sm:text-5xl xl:text-[3.5rem] leading-[1.1] text-balance font-bold text-[var(--color-forest)]">
            Membaca dan berhitung jadi petualangan 10 menit.
          </h1>

          <p className="mt-[20px] text-lg leading-[1.6] text-[var(--color-ink)] max-w-[52ch]">
            Kiko si kelinci menemani anak usia 4-8 tahun belajar huruf, angka, dan kata. Tanpa iklan, tanpa skor yang menghukum. Kalau anak salah, Kiko mengajak mencoba lagi.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-7">
            <Link
              href="/daftar"
              style={{
                backgroundColor: "var(--color-sun)",
                boxShadow: "var(--shadow-sun)",
              }}
              className="min-h-[52px] px-7 rounded-full inline-flex items-center justify-center font-bold text-[18px] text-[var(--color-ink)] hover:-translate-y-[2px] active:translate-y-[2px] transition-transform"
            >
              Coba 10 menit gratis
            </Link>

            <a
              href="#dunia"
              className="min-h-[48px] inline-flex items-center font-bold text-[18px] text-[var(--color-forest)] underline underline-offset-4 decoration-2"
            >
              Lihat empat dunia belajar
            </a>
          </div>
        </PaperReveal>

        <PaperReveal delay={180} className="w-full">
          <HeroForestScene />
        </PaperReveal>
      </div>
    </section>
  );
}