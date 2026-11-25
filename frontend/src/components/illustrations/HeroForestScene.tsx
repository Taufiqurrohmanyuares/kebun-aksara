"use client";

import { useState } from "react";
import KikoMascot from "./KikoMascot";

const TREE_LEAVES = [
  { letter: "A", cx: 105, cy: 108, bg: "#79C262", shadow: "#488A36" },
  { letter: "B", cx: 185, cy: 86, bg: "#F2B632", shadow: "#B88214" },
  { letter: "C", cx: 262, cy: 112, bg: "#79C262", shadow: "#488A36" },
];

export default function HeroForestScene() {
  const [selected, setSelected] = useState<string | null>(null);

  const isCorrect = selected === "B";

  return (
    <div
      className="w-full max-w-[520px] max-h-[min(70svh,560px)] mx-auto bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-3 sm:p-4 flex flex-col"
      style={{
        borderRadius: "var(--radius-panel)",
        boxShadow: "var(--shadow-panel)",
      }}
      aria-label="Contoh layar permainan Hutan Huruf bersama Kiko"
    >
      {/* Bar atas bingkai tablet */}
      <div className="flex items-center justify-between px-2 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-earth)]" />
          <span className="w-3 h-3 rounded-full bg-[var(--color-sun)]" />
          <span className="w-3 h-3 rounded-full bg-[var(--color-leaf)]" />
        </div>
        <span className="text-sm font-bold text-[var(--color-forest)]">
          Hutan Huruf
        </span>
      </div>

      {/* Layar adegan permainan */}
      <div
        className="relative flex-1 min-h-0 flex flex-col justify-between overflow-hidden bg-[#DFF0D8] border-2 border-[var(--color-forest)]"
        style={{ borderRadius: "20px" }}
      >
        {/* Papan instruksi atas */}
        <div className="px-3.5 pt-3 pb-1.5 flex items-center justify-between gap-2 shrink-0 z-10">
          <div
            className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] px-3.5 py-1.5"
            style={{
              borderRadius: "var(--radius-small)",
              boxShadow: "var(--shadow-small)",
            }}
          >
            <p className="text-base sm:text-lg font-bold text-[var(--color-forest)] leading-snug">
              {isCorrect ? "Benar! Itu huruf B." : "Ketuk huruf B"}
            </p>
            {selected && !isCorrect && (
              <p className="text-sm text-[var(--color-ink)] mt-0.5">
                Itu huruf {selected}. Coba ketuk huruf B.
              </p>
            )}
          </div>
        </div>

        {/* Adegan SVG potongan kertas: bukit, pohon berdaun huruf */}
        <div className="relative w-full aspect-[380/245] max-h-[min(46svh,340px)] mt-auto">
          <svg
            viewBox="0 0 380 260"
            preserveAspectRatio="xMidYMax slice"
            className="w-full h-full block"
            aria-hidden="true"
          >
            {/* Lapisan bukit belakang (paper-cut) */}
            <path
              d="M0 175 Q95 140 195 168 T380 155 L380 260 L0 260 Z"
              fill="#8CC776"
            />
            {/* Lapisan tanah/rumput depan */}
            <path
              d="M0 202 Q130 182 250 198 T380 190 L380 260 L0 260 Z"
              fill="#5FA84A"
            />

            {/* Batang pohon */}
            <path
              d="M166 210 L172 125 L198 125 L204 210 Z"
              fill="#8A5A3C"
            />
            <path
              d="M185 210 L185 125 L198 125 L204 210 Z"
              fill="#72482E"
            />

            {/* Tajuk pohon potongan kertas berlapis */}
            <circle cx="118" cy="112" r="46" fill="#3F782F" />
            <circle cx="248" cy="114" r="44" fill="#3F782F" />
            <circle cx="185" cy="86" r="56" fill="#4B8E39" />
            <circle cx="145" cy="106" r="40" fill="#5FA84A" />
            <circle cx="222" cy="108" r="38" fill="#5FA84A" />
          </svg>

          {/* Daun-daun interaktif berbentuk huruf */}
          {TREE_LEAVES.map((leaf) => {
            const active = selected === leaf.letter;
            return (
              <button
                key={leaf.letter}
                type="button"
                onClick={() => setSelected(leaf.letter)}
                aria-label={`Pilih huruf ${leaf.letter}`}
                style={{
                  left: `${(leaf.cx / 380) * 100}%`,
                  top: `${(leaf.cy / 260) * 100}%`,
                  backgroundColor: leaf.bg,
                  boxShadow: `0 4px 0 ${leaf.shadow}`,
                }}
                className={`-translate-x-1/2 -translate-y-1/2 absolute w-12 h-12 sm:w-13 sm:h-13 rounded-2xl text-[var(--color-ink)] font-bold text-xl sm:text-2xl flex items-center justify-center cursor-pointer transition-transform active:translate-y-[-45%] ${
                  active ? "ring-4 ring-[var(--color-forest)]" : ""
                }`}
              >
                {leaf.letter}
              </button>
            );
          })}

          {/* Kiko di sisi kiri bawah adegan */}
          <div className="absolute bottom-1 left-3 sm:left-5 pointer-events-none">
            <KikoMascot className="w-22 h-26 sm:w-26 sm:h-30" animateEar={true} />
          </div>
        </div>
      </div>
    </div>
  );
}