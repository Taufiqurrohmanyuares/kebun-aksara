"use client";

interface VisualCountBoardProps {
  item: "APPLE" | "ORANGE" | "CRYSTAL" | string;
  count: number;
}

function ItemIcon({ type }: { type: string }) {
  switch (type) {
    case "APPLE":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm" aria-hidden="true">
          <rect x="29" y="8" width="6" height="12" rx="3" fill="#6B4226" />
          <path d="M33 12 C42 6 48 14 44 18 C38 18 34 16 33 12 Z" fill="#5FA84A" />
          <circle cx="24" cy="38" r="18" fill="#D6453A" />
          <circle cx="40" cy="38" r="18" fill="#D6453A" />
          <circle cx="28" cy="30" r="4" fill="#FF8A80" opacity="0.6" />
        </svg>
      );
    case "ORANGE":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm" aria-hidden="true">
          <circle cx="32" cy="36" r="20" fill="#E67E22" />
          <circle cx="26" cy="28" r="4" fill="#F39C12" opacity="0.7" />
          <path d="M32 16 C38 8 46 16 42 22 Z" fill="#5FA84A" />
          <rect x="30" y="14" width="4" height="6" rx="2" fill="#6B4226" />
        </svg>
      );
    case "CRYSTAL":
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm" aria-hidden="true">
          <polygon points="32,8 48,26 38,56 26,56 16,26" fill="#3E7CB1" />
          <polygon points="32,8 48,26 32,32" fill="#5A9AD0" />
          <polygon points="32,8 16,26 32,32" fill="#7DBAE8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm" aria-hidden="true">
          <circle cx="32" cy="34" r="18" fill="#F2B632" />
          <circle cx="32" cy="34" r="9" fill="#D99B1E" />
        </svg>
      );
  }
}

export default function VisualCountBoard({ item, count }: VisualCountBoardProps) {
  const safeCount = Math.max(1, Math.min(20, count));
  const itemsArray = Array.from({ length: safeCount }, (_, i) => i + 1);

  return (
    <section
      aria-label="Area hitung objek visual"
      className="bg-[var(--color-bg)] border-[3px] border-[var(--color-forest)] p-5 rounded-2xl space-y-3"
      style={{ boxShadow: "var(--shadow-small)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--color-forest)]">
          Hitung benda di bawah ini bersama Kiko:
        </p>
        <span className="px-3 py-1 rounded-full bg-[var(--color-paper)] border-2 border-[var(--color-forest)] text-xs font-bold text-[var(--color-ink)]">
          {safeCount} benda
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 py-2 bg-[var(--color-paper)] border-2 border-[var(--color-forest)]/25 rounded-xl p-4 min-h-[96px]">
        {itemsArray.map((num) => (
          <div
            key={num}
            className="flex flex-col items-center gap-1 animate-scale-in"
          >
            <ItemIcon type={item} />
            <span className="text-xs font-bold text-[var(--color-forest)] bg-[var(--color-bg)] border border-[var(--color-forest)]/40 rounded-full w-5 h-5 flex items-center justify-center">
              {num}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
