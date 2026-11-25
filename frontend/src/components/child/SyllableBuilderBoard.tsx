"use client";

import { useState } from "react";

interface SyllableBuilderBoardProps {
  syllables: string[];
  disabled?: boolean;
  onWordBuilt: (builtWord: string) => void;
}

export default function SyllableBuilderBoard({
  syllables,
  disabled = false,
  onWordBuilt,
}: SyllableBuilderBoardProps) {
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);

  const handlePickSyllable = (idx: number) => {
    if (disabled || pickedIndices.includes(idx)) return;
    const nextPicked = [...pickedIndices, idx];
    setPickedIndices(nextPicked);

    // Jika seluruh suku kata sudah disusun, langsung laporkan kata yang terbentuk
    if (nextPicked.length === syllables.length) {
      const fullWord = nextPicked.map((i) => syllables[i]).join("");
      onWordBuilt(fullWord);
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setPickedIndices([]);
  };

  const currentWord = pickedIndices.map((i) => syllables[i]).join("");

  return (
    <div className="space-y-4">
      {/* Kotak tempat menyusun kata */}
      <div
        className="bg-[var(--color-bg)] border-[3px] border-[var(--color-forest)] p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center gap-3"
        style={{ boxShadow: "var(--shadow-small)" }}
      >
        <p className="text-sm font-bold text-[var(--color-forest)]">
          Susun suku kata di bawah agar Kiko bisa membaca:
        </p>

        <div className="flex items-center gap-2 min-h-[64px] px-4 py-2 bg-[var(--color-paper)] border-2 border-[var(--color-forest)]/30 rounded-xl">
          {syllables.map((_, slotIdx) => {
            const pickedIdx = pickedIndices[slotIdx];
            const hasSyllable = pickedIdx !== undefined;
            return (
              <div
                key={slotIdx}
                className={`min-w-[64px] h-[52px] px-3 rounded-xl border-2 border-dashed flex items-center justify-center font-bold text-2xl transition-all ${
                  hasSyllable
                    ? "bg-[var(--color-sun)] border-[var(--color-forest)] text-[var(--color-ink)] border-solid animate-scale-in"
                    : "bg-[var(--color-bg)] border-[var(--color-forest)]/40 text-[var(--color-ink)]/40"
                }`}
              >
                {hasSyllable ? syllables[pickedIdx] : "?"}
              </div>
            );
          })}
        </div>

        {pickedIndices.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-bold text-[var(--color-forest)] hover:underline cursor-pointer"
          >
            Ulangi susunan suku kata
          </button>
        )}
      </div>

      {/* Pilihan kartu suku kata yang bisa diklik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {syllables.map((syl, idx) => {
          const isUsed = pickedIndices.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isUsed}
              onClick={() => handlePickSyllable(idx)}
              style={{
                backgroundColor: isUsed ? "#E9ECE8" : "var(--color-paper)",
                boxShadow: isUsed ? "none" : "var(--shadow-small)",
              }}
              className={`min-h-[60px] px-4 rounded-2xl border-[3px] border-[var(--color-forest)] font-bold text-2xl text-[var(--color-ink)] transition-transform ${
                isUsed
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:-translate-y-[2px] active:translate-y-[2px]"
              }`}
            >
              {syl}
            </button>
          );
        })}
      </div>

      {currentWord && !disabled && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onWordBuilt(currentWord)}
            style={{ backgroundColor: "var(--color-leaf)", boxShadow: "var(--shadow-small)" }}
            className="min-h-[48px] px-6 rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
          >
            Kirim Kata &ldquo;{currentWord}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
}
