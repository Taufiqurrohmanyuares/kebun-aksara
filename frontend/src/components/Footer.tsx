import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--color-forest)]/15 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <Link href="/" aria-label="Beranda Kebun Aksara" className="inline-flex items-center min-h-[48px]">
            <Logo size={36} />
          </Link>
          <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] max-w-[65ch]">
            Kebun Aksara © 2026. Platform edukasi literasi dan numerasi ramah anak.
          </p>
        </div>

        <nav aria-label="Tautan informasi" className="flex flex-wrap items-center gap-6">
          <Link
            href="/privasi"
            className="min-h-[48px] inline-flex items-center text-[18px] font-bold text-[var(--color-forest)] underline underline-offset-4 decoration-2"
          >
            Kebijakan privasi
          </Link>
          <Link
            href="/kontak"
            className="min-h-[48px] inline-flex items-center text-[18px] font-bold text-[var(--color-forest)] underline underline-offset-4 decoration-2"
          >
            Kontak
          </Link>
        </nav>
      </div>
    </footer>
  );
}