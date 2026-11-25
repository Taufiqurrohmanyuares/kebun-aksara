"use client";

import { useState } from "react";

const MASTERED_LETTERS = ["A", "B", "C", "E", "I", "M"];
const GUIDED_LETTERS = ["D", "P"];

export default function Parents() {
  const [missionDone, setMissionDone] = useState(false);

  return (
    <section id="orang-tua" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-[65ch] mb-10 sm:mb-12">
        <h2
          style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)" }}
          className="font-bold text-[var(--color-forest)] leading-[1.25]"
        >
          Kamu yang memegang kendali
        </h2>
        <p className="text-[18px] leading-[1.6] text-[var(--color-ink)] mt-3">
          Pilih misi mingguan dan hadiahnya sendiri. Anak belajar, orang tua tetap tahu progresnya.
        </p>
      </div>

      {/* Mock Dashboard Orang Tua dengan label "contoh tampilan" */}
      <div
        className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-5 sm:p-8"
        style={{
          borderRadius: "var(--radius-panel)",
          boxShadow: "var(--shadow-panel)",
        }}
        aria-label="Contoh tampilan dashboard orang tua"
      >
        {/* Bar atas mock dashboard */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b-2 border-[var(--color-forest)]/15">
          <div>
            <p className="text-xl font-bold text-[var(--color-forest)]">
              Catatan belajar Arka
            </p>
          </div>
          <span
            className="px-3.5 py-1.5 bg-[var(--color-bg)] border-2 border-[var(--color-forest)] text-sm font-bold text-[var(--color-forest)]"
            style={{ borderRadius: "var(--radius-small)" }}
          >
            contoh tampilan
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Lama belajar & Penguasaan huruf */}
          <div className="lg:col-span-7 space-y-5">
            {/* Lama belajar hari ini */}
            <div
              className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-5"
              style={{ borderRadius: "20px" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-base text-[var(--color-ink)]">
                  Lama belajar hari ini
                </span>
                <span className="text-2xl font-bold text-[var(--color-forest)]">
                  10 menit
                </span>
              </div>
              <div className="mt-3 h-4 w-full bg-[var(--color-paper)] border-2 border-[var(--color-forest)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-leaf)]"
                  style={{ width: "100%" }}
                  aria-label="Sesi 10 menit selesai"
                />
              </div>
              <p className="text-sm text-[var(--color-ink)] mt-2">
                Sesi harian sudah cukup. Kebun Arka sedang istirahat sampai besok.
              </p>
            </div>

            {/* Huruf dikuasai vs perlu ditemani */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-4"
                style={{
                  borderRadius: "18px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <h3 className="text-base font-bold text-[var(--color-forest)] mb-3">
                  Huruf yang sudah dikuasai
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MASTERED_LETTERS.map((letter) => (
                    <span
                      key={letter}
                      className="w-10 h-10 rounded-xl bg-[var(--color-leaf)] text-[var(--color-ink)] font-bold text-lg inline-flex items-center justify-center"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-4"
                style={{
                  borderRadius: "18px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <h3 className="text-base font-bold text-[var(--color-forest)] mb-3">
                  Huruf yang masih perlu ditemani
                </h3>
                <div className="flex flex-wrap gap-2">
                  {GUIDED_LETTERS.map((letter) => (
                    <span
                      key={letter}
                      className="w-10 h-10 rounded-xl bg-[var(--color-sun)] text-[var(--color-ink)] font-bold text-lg inline-flex items-center justify-center"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[var(--color-ink)] mt-2.5">
                  Kiko akan mengulang dua huruf ini pelan-pelan besok.
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pengaturan Misi Mingguan & Hadiah */}
          <div
            className="lg:col-span-5 bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-5 flex flex-col justify-between gap-5"
            style={{ borderRadius: "20px" }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-forest)]">
                Misi mingguan dan hadiah
              </h3>

              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-4"
                style={{ borderRadius: "var(--radius-small)" }}
              >
                <p className="text-sm text-[var(--color-forest)] font-bold">
                  Misi dari orang tua
                </p>
                <p className="text-[18px] text-[var(--color-ink)] mt-1">
                  Hitung 10 sendok makan bersama sebelum makan malam
                </p>
              </div>

              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-4"
                style={{ borderRadius: "var(--radius-small)" }}
              >
                <p className="text-sm text-[var(--color-forest)] font-bold">
                  Hadiah pilihan keluarga
                </p>
                <p className="text-[18px] text-[var(--color-ink)] mt-1">
                  Memilih cerita dongeng sebelum tidur
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMissionDone(!missionDone)}
              style={{
                backgroundColor: missionDone ? "var(--color-leaf)" : "var(--color-sun)",
                boxShadow: missionDone ? "0 4px 0 var(--color-leaf-deep)" : "var(--shadow-sun)",
              }}
              className="min-h-[48px] w-full px-5 rounded-full font-bold text-[18px] text-[var(--color-ink)] cursor-pointer transition-transform active:translate-y-[2px]"
            >
              {missionDone ? "Misi selesai, hadiah diberikan" : "Tandai misi selesai"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}