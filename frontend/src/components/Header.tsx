"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-forest)]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" aria-label="Beranda Kebun Aksara" className="min-h-[48px] inline-flex items-center">
          <Logo size={40} />
        </Link>

        {/* Navigasi Desktop */}
        <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-7">
          <a
            href="#dunia"
            className="text-[18px] text-[var(--color-ink)] hover:text-[var(--color-forest)] py-2"
          >
            Dunia belajar
          </a>
          <a
            href="#metode"
            className="text-[18px] text-[var(--color-ink)] hover:text-[var(--color-forest)] py-2"
          >
            Cara Kiko mengajar
          </a>
          <a
            href="#orang-tua"
            className="text-[18px] text-[var(--color-ink)] hover:text-[var(--color-forest)] py-2"
          >
            Untuk orang tua
          </a>
        </nav>

        {/* Aksi Desktop */}
        <div className="hidden sm:flex items-center gap-5">
          <Link
            href="/masuk"
            className="text-[18px] font-bold text-[var(--color-forest)] hover:underline min-h-[48px] inline-flex items-center px-2"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            style={{
              backgroundColor: "var(--color-sun)",
              boxShadow: "var(--shadow-sun)",
            }}
            className="min-h-[48px] px-6 rounded-full inline-flex items-center justify-center font-bold text-[18px] text-[var(--color-ink)] active:translate-y-[2px] transition-transform"
          >
            Mulai gratis
          </Link>
        </div>

        {/* Tombol Menu Mobile Sederhana */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="lg:hidden min-h-[48px] min-w-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] text-[var(--color-forest)] font-bold text-base inline-flex items-center justify-center"
        >
          {menuOpen ? "Tutup" : "Menu"}
        </button>
      </div>

      {/* Panel Menu Mobile */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi seluler"
          className="lg:hidden px-4 sm:px-6 pb-6 pt-2 bg-[var(--color-bg)] border-b-2 border-[var(--color-forest)]/20 flex flex-col gap-2"
        >
          <a
            href="#dunia"
            onClick={() => setMenuOpen(false)}
            className="min-h-[48px] flex items-center text-[18px] text-[var(--color-ink)]"
          >
            Dunia belajar
          </a>
          <a
            href="#metode"
            onClick={() => setMenuOpen(false)}
            className="min-h-[48px] flex items-center text-[18px] text-[var(--color-ink)]"
          >
            Cara Kiko mengajar
          </a>
          <a
            href="#orang-tua"
            onClick={() => setMenuOpen(false)}
            className="min-h-[48px] flex items-center text-[18px] text-[var(--color-ink)]"
          >
            Untuk orang tua
          </a>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/masuk"
              onClick={() => setMenuOpen(false)}
              className="min-h-[48px] px-4 inline-flex items-center font-bold text-[18px] text-[var(--color-forest)]"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              onClick={() => setMenuOpen(false)}
              style={{
                backgroundColor: "var(--color-sun)",
                boxShadow: "var(--shadow-sun)",
              }}
              className="min-h-[48px] px-6 rounded-full inline-flex items-center justify-center font-bold text-[18px] text-[var(--color-ink)]"
            >
              Mulai gratis
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}