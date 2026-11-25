"use client";

import { useState } from "react";
import KikoMascot from "./illustrations/KikoMascot";
import { DuckIllustration, SmallStarMark } from "./illustrations/DuckIllustration";

export default function Method() {
  const [step, setStep] = useState<"D_CHOSEN" | "B_CHOSEN">("D_CHOSEN");

  return (
    <section id="metode" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-[65ch] mb-10 sm:mb-12">
        <h2
          style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)" }}
          className="font-bold text-[var(--color-forest)] leading-[1.25]"
        >
          Salah itu bagian dari belajar
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Kiri: SATU contoh sesi sebagai mock dialog layar */}
        <div
          className="lg:col-span-7 bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-5 sm:p-7"
          style={{
            borderRadius: "var(--radius-panel)",
            boxShadow: "var(--shadow-panel)",
          }}
          aria-label="Contoh percakapan sesi belajar bersama Kiko"
        >
          {/* Area soal: Gambar bebek & pilihan huruf */}
          <div
            className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderRadius: "20px" }}
          >
            <div className="flex items-center gap-4">
              <DuckIllustration />
              <div>
                <p className="text-base font-bold text-[var(--color-forest)]">
                  Huruf depan kata bebek?
                </p>
                <p className="text-sm text-[var(--color-ink)] mt-0.5">
                  Ketuk huruf untuk melihat respons Kiko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("D_CHOSEN")}
                aria-pressed={step === "D_CHOSEN"}
                style={{
                  backgroundColor: step === "D_CHOSEN" ? "#E7ECE8" : "var(--color-paper)",
                  boxShadow: "var(--shadow-small)",
                }}
                className={`min-h-[52px] min-w-[56px] rounded-xl border-2 border-[var(--color-forest)] font-bold text-xl text-[var(--color-ink)] cursor-pointer transition-transform active:translate-y-[2px] ${
                  step === "D_CHOSEN" ? "ring-3 ring-[var(--color-forest)]" : ""
                }`}
              >
                D
              </button>

              <button
                type="button"
                onClick={() => setStep("B_CHOSEN")}
                aria-pressed={step === "B_CHOSEN"}
                style={{
                  backgroundColor: step === "B_CHOSEN" ? "var(--color-sun)" : "var(--color-paper)",
                  boxShadow: step === "B_CHOSEN" ? "var(--shadow-sun)" : "var(--shadow-small)",
                }}
                className={`min-h-[52px] min-w-[56px] rounded-xl border-2 border-[var(--color-forest)] font-bold text-xl text-[var(--color-ink)] cursor-pointer transition-transform active:translate-y-[2px] ${
                  step === "B_CHOSEN" ? "ring-3 ring-[var(--color-forest)]" : ""
                }`}
              >
                B
              </button>
            </div>
          </div>

          {/* Alur dialog layar */}
          <div className="mt-5 space-y-4">
            {/* Langkah 1: Anak memilih huruf D */}
            <div className="flex justify-end">
              <div
                className="bg-[#E8F1EB] border-2 border-[var(--color-forest)] px-4 py-2.5 max-w-xs"
                style={{ borderRadius: "16px 16px 4px 16px" }}
              >
                <p className="text-base text-[var(--color-ink)]">
                  Anak memilih huruf <strong className="font-bold">D</strong>
                </p>
              </div>
            </div>

            {/* Respons Kiko saat anak memilih D */}
            <div className="flex items-end gap-3">
              <KikoMascot className="w-16 h-20 shrink-0" animateEar={false} />
              <div
                className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] px-4 py-3 flex-1"
                style={{
                  borderRadius: "16px 16px 16px 4px",
                  boxShadow: "var(--shadow-small)",
                }}
              >
                <p className="text-[18px] leading-[1.5] text-[var(--color-ink)]">
                  &ldquo;Hampir! D dan B memang mirip. Dengarkan lagi: be-bek.&rdquo;
                </p>
              </div>
            </div>

            {/* Langkah 2: Anak memilih B -> muncul tanda bintang kecil */}
            {step === "B_CHOSEN" ? (
              <div className="pt-2 space-y-3">
                <div className="flex justify-end">
                  <div
                    className="bg-[#E8F1EB] border-2 border-[var(--color-forest)] px-4 py-2.5 max-w-xs"
                    style={{ borderRadius: "16px 16px 4px 16px" }}
                  >
                    <p className="text-base text-[var(--color-ink)]">
                      Anak memilih huruf <strong className="font-bold">B</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-2">
                  <SmallStarMark />
                  <p className="text-[18px] font-bold text-[var(--color-forest)]">
                    Benar, be-bek diawali huruf B.
                  </p>
                </div>
              </div>
            ) : (
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep("B_CHOSEN")}
                  className="min-h-[48px] px-4 text-base font-bold text-[var(--color-forest)] underline underline-offset-4 cursor-pointer"
                >
                  Lihat saat anak memilih huruf B
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Tiga pernyataan pendek */}
        <div className="lg:col-span-5 space-y-5 lg:pt-4">
          <ul className="space-y-5">
            <li
              className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5 flex items-start gap-3.5"
              style={{
                borderRadius: "20px 14px 20px 14px",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <span
                aria-hidden="true"
                className="w-3.5 h-3.5 rounded-full bg-[var(--color-leaf)] mt-2 shrink-0"
              />
              <p className="text-[18px] leading-[1.6] text-[var(--color-ink)]">
                Tidak ada skor merah.
              </p>
            </li>

            <li
              className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5 flex items-start gap-3.5"
              style={{
                borderRadius: "14px 20px 14px 20px",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <span
                aria-hidden="true"
                className="w-3.5 h-3.5 rounded-full bg-[var(--color-sun)] mt-2 shrink-0"
              />
              <p className="text-[18px] leading-[1.6] text-[var(--color-ink)]">
                Tidak ada streak yang hangus. Kalau libur sehari, kebun hanya istirahat.
              </p>
            </li>

            <li
              className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-5 flex items-start gap-3.5"
              style={{
                borderRadius: "20px 14px 20px 14px",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <span
                aria-hidden="true"
                className="w-3.5 h-3.5 rounded-full bg-[var(--color-river)] mt-2 shrink-0"
              />
              <p className="text-[18px] leading-[1.6] text-[var(--color-ink)]">
                Sesi berhenti di 10 menit. Kiko pamit: sampai besok.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}