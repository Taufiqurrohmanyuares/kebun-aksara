import Link from "next/link";
import PaperReveal from "./PaperReveal";

export default function FinalCta() {
  const showDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true";

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-24">
      <PaperReveal>
        <div
          className="bg-[var(--color-forest)] border-[3px] border-[var(--color-forest)] p-7 sm:p-11 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-7"
          style={{
            borderRadius: "var(--radius-panel)",
            boxShadow: "0 10px 0 #133124",
          }}
        >
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--color-paper)] leading-tight">
              Siap mencoba 10 menit pertama hari ini?
            </h2>
            <p className="text-[18px] leading-[1.6] text-[#DFECE4] mt-3">
              Buat profil anak dalam satu menit. Tidak perlu kartu pembayaran, dan orang tua bisa berhenti kapan saja.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/daftar"
              style={{
                backgroundColor: "var(--color-sun)",
                boxShadow: "var(--shadow-sun)",
              }}
              className="min-h-[54px] px-7 rounded-full inline-flex items-center justify-center font-bold text-[18px] text-[var(--color-ink)] hover:-translate-y-[2px] active:translate-y-[2px] transition-transform"
            >
              Buat akun gratis
            </Link>

            {showDemo && (
              <Link
                href="/demo"
                className="min-h-[52px] px-5 rounded-full border-2 border-[var(--color-paper)]/50 inline-flex items-center justify-center font-bold text-[18px] text-[var(--color-paper)] hover:border-[var(--color-paper)] transition-colors"
              >
                Coba demo
              </Link>
            )}
          </div>
        </div>
      </PaperReveal>
    </section>
  );
}