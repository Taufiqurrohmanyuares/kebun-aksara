import type { ParentDashboardData } from "@/types/api";

const AREA_META: Record<string, { label: string; color: string }> = {
  HUTAN_HURUF: { label: "Hutan Huruf", color: "var(--color-leaf)" },
  BUKIT_ANGKA: { label: "Bukit Angka", color: "var(--color-sun)" },
  SUNGAI_KATA: { label: "Sungai Kata", color: "var(--color-river)" },
  GUA_TAMBAH: { label: "Gua Tambah", color: "var(--color-earth)" },
};

interface Props {
  data: ParentDashboardData;
}

export default function ParentOverviewCards({ data }: Props) {
  return (
    <div className="lg:col-span-7 space-y-6">
      <section
        className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <h2 className="text-xl font-bold text-[var(--color-forest)] mb-4">
          Progres empat dunia belajar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.area_progress.map((item) => {
            const meta = AREA_META[item.area] || {
              label: item.area,
              color: "var(--color-leaf)",
            };
            return (
              <div
                key={item.area}
                className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4"
                style={{ borderRadius: "18px", boxShadow: "var(--shadow-small)" }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-[var(--color-forest)]">{meta.label}</span>
                  <span className="text-sm font-bold text-[var(--color-ink)]">
                    {item.completed}/{item.total} titik
                  </span>
                </div>
                <div className="h-3.5 w-full bg-[var(--color-paper)] border-2 border-[var(--color-forest)] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${item.percentage}%`, backgroundColor: meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <h2 className="text-xl font-bold text-[var(--color-forest)] mb-2">
          Bagian yang sedang ditemani Kiko
        </h2>
        {data.review_items.length === 0 ? (
          <p className="text-[18px] text-[var(--color-ink)]">
            Belum ada bagian yang sulit. Kiko akan mencatat otomatis jika ada huruf atau angka yang perlu diulang pelan-pelan.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5 mt-3">
            {data.review_items.map((rev) => (
              <span
                key={rev.item_key}
                className="px-4 py-2 rounded-xl bg-[var(--color-sun)] border-2 border-[var(--color-forest)] font-bold text-base text-[var(--color-ink)]"
              >
                {rev.item_key.replace("_", " ")}
              </span>
            ))}
          </div>
        )}
      </section>

      <section
        className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <h2 className="text-xl font-bold text-[var(--color-forest)] mb-4">
          Catatan sesi 7 hari terakhir
        </h2>
        <div className="grid grid-cols-7 gap-2 items-end pt-2">
          {data.weekly_chart.map((day) => {
            const barHeight = Math.max(16, Math.min(100, day.minutes * 10));
            return (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-[var(--color-ink)]">
                  {day.minutes}m
                </span>
                <div className="w-full h-24 bg-[var(--color-bg)] border-2 border-[var(--color-forest)] rounded-xl flex items-end p-1">
                  <div
                    className="w-full rounded-lg bg-[var(--color-leaf)]"
                    style={{ height: `${barHeight}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--color-ink)] text-center">{day.date}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
