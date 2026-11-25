"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import KikoMascot from "@/components/illustrations/KikoMascot";
import ParentOverviewCards from "@/components/parent/ParentOverviewCards";
import ParentMissionPanel from "@/components/parent/ParentMissionPanel";
import ParentChildSwitcher from "@/components/parent/ParentChildSwitcher";
import api from "@/lib/api";
import type { ParentDashboardData } from "@/types/api";

export default function ParentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<ParentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (overrideChildId?: number) => {
    const childId = overrideChildId
      ? String(overrideChildId)
      : localStorage.getItem("ka_active_child_id");
    const token = localStorage.getItem("ka_access_token");

    if (!token || !childId) {
      router.push("/login");
      return;
    }

    try {
      setError("");
      const res = await api.get(`/parent/dashboard/${childId}/`);
      setData(res.data.data);
    } catch {
      setError("Gagal memuat catatan belajar. Pastikan server Django menyala.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("ka_access_token");
    localStorage.removeItem("ka_user_role");
    localStorage.removeItem("ka_active_child_id");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
        <p className="text-[18px] font-bold text-[var(--color-forest)]">
          Menyiapkan catatan belajar...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 gap-4 text-center">
        <p className="text-[18px] font-bold text-[#6E1E1E]">{error || "Data tidak ditemukan."}</p>
        <Link
          href="/login"
          style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
          className="min-h-[48px] px-6 rounded-full inline-flex items-center font-bold text-[18px] text-[var(--color-ink)]"
        >
          Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <header className="bg-[var(--color-paper)] border-b-2 border-[var(--color-forest)]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-[72px] py-3 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="min-h-[48px] inline-flex items-center">
            <Logo size={36} />
          </Link>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/child/map"
              style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
              className="min-h-[48px] px-6 rounded-full inline-flex items-center justify-center font-bold text-[18px] text-[var(--color-ink)] active:translate-y-[2px] transition-transform"
            >
              Buka dunia belajar {data.child.name}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] text-base font-bold text-[var(--color-forest)] cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <ParentChildSwitcher
          activeChildId={data.child.id}
          onSwitchChild={async (newId) => {
            await fetchDashboard(newId);
          }}
        />

        <section
          className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div
              className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-2 shrink-0"
              style={{ borderRadius: "20px" }}
            >
              <KikoMascot className="w-16 h-20" animateEar={false} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-forest)]">
                Catatan belajar {data.child.name}
              </h1>
              <p className="text-[18px] text-[var(--color-ink)] mt-1">
                Tahap {data.child.current_level} • {data.child.stars_balance} bintang terkumpul •{" "}
                {data.stickers_summary.owned} dari {data.stickers_summary.total} stiker album
              </p>
            </div>
          </div>

          <div
            className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] px-5 py-3.5 w-full md:w-auto"
            style={{ borderRadius: "18px" }}
          >
            <p className="text-sm font-bold text-[var(--color-forest)]">Lama belajar hari ini</p>
            <p className="text-2xl font-bold text-[var(--color-ink)]">
              {data.streak.today_minutes_spent} / 10 menit
            </p>
            <p className="text-sm text-[var(--color-ink)] mt-0.5">
              {data.streak.is_garden_sleeping
                ? "Kebun sedang istirahat dengan tenang."
                : `Rantai bunga aktif: ${data.streak.flower_chain_count} hari`}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ParentOverviewCards data={data} />
          <ParentMissionPanel data={data} onRefresh={() => fetchDashboard()} />
        </div>
      </main>
    </div>
  );
}