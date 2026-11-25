"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import KikoMascot from "@/components/illustrations/KikoMascot";
import { SmallStarMark } from "@/components/illustrations/DuckIllustration";
import ChildQuizModal from "@/components/child/ChildQuizModal";
import ChildGardenAlbumModal from "@/components/child/ChildGardenAlbumModal";
import ParentPinGateModal from "@/components/child/ParentPinGateModal";
import api from "@/lib/api";
import type { LearningNode } from "@/types/api";

const WORLD_CONFIG: Record<
  string,
  { title: string; bg: string; shadow: string; subtitle: string }
> = {
  HUTAN_HURUF: {
    title: "Hutan Huruf",
    bg: "var(--color-leaf)",
    shadow: "0 6px 0 var(--color-leaf-deep)",
    subtitle: "Kenali huruf A sampai Z",
  },
  BUKIT_ANGKA: {
    title: "Bukit Angka",
    bg: "var(--color-sun)",
    shadow: "0 6px 0 var(--color-sun-deep)",
    subtitle: "Hitung buah 1 sampai 20",
  },
  SUNGAI_KATA: {
    title: "Sungai Kata",
    bg: "var(--color-river)",
    shadow: "0 6px 0 var(--color-river-deep)",
    subtitle: "Rangkai suku kata",
  },
  GUA_TAMBAH: {
    title: "Gua Tambah",
    bg: "var(--color-earth)",
    shadow: "0 6px 0 var(--color-earth-deep)",
    subtitle: "Kumpulkan kristal hitung",
  },
};

export default function ChildMapPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<LearningNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<LearningNode | null>(null);
  const [showGarden, setShowGarden] = useState(false);
  const [showPinGate, setShowPinGate] = useState(false);

  const [minutesSpent, setMinutesSpent] = useState(0);
  const [gentleBreakMessage, setGentleBreakMessage] = useState("");
  const [parentCheers, setParentCheers] = useState<{ id: number; message_text: string }[]>([]);

  const loadChildWorld = useCallback(async () => {
    const token = localStorage.getItem("ka_access_token");
    const childId = localStorage.getItem("ka_active_child_id");
    if (!token || !childId) {
      router.push("/login");
      return;
    }

    try {
      const [mapRes, statusRes] = await Promise.all([
        api.get("/child/map/"),
        api.get("/child/status/"),
      ]);
      setNodes(mapRes.data.data || []);
      setMinutesSpent(statusRes.data.data.today_minutes_spent || 0);
      if (statusRes.data.data.should_rest_now) {
        setGentleBreakMessage("Kebunmu sudah senang hari ini, sampai besok ya!");
      }
      if (statusRes.data.data.parent_cheers?.length > 0) {
        setParentCheers(statusRes.data.data.parent_cheers);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadChildWorld();
  }, [loadChildWorld]);

  // Heartbeat lembut tiap 60 detik untuk memantau batas sesi 10 menit
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await api.post("/child/status/", { minutes: 1 });
        setMinutesSpent(res.data.data.minutes_spent);
        if (res.data.data.gentle_break_triggered) {
          setGentleBreakMessage(res.data.data.message);
        }
      } catch {
        // Abaikan jika offline sementara
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const groupedWorlds = ["HUTAN_HURUF", "BUKIT_ANGKA", "SUNGAI_KATA", "GUA_TAMBAH"].map(
    (areaKey) => ({
      areaKey,
      meta: WORLD_CONFIG[areaKey],
      items: nodes.filter((n) => n.area === areaKey),
    })
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
        <p className="text-[18px] font-bold text-[var(--color-forest)]">
          Kiko sedang membuka peta kebun...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Header Anak dengan tombol besar */}
      <header className="bg-[var(--color-paper)] border-b-2 border-[var(--color-forest)]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-[72px] py-3 flex flex-wrap items-center justify-between gap-3">
          <Logo size={36} />

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-forest)] text-base font-bold text-[var(--color-forest)]">
              Sesi hari ini: {minutesSpent} / 10 menit
            </span>

            <button
              type="button"
              onClick={() => setShowGarden(true)}
              style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
              className="min-h-[48px] px-5 rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
            >
              Kebun &amp; Stiker
            </button>

            <button
              type="button"
              onClick={() => setShowPinGate(true)}
              className="min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] text-base font-bold text-[var(--color-forest)] cursor-pointer"
            >
              Orang tua
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Sapaan Kiko & Pesan dari Orang Tua */}
        <section
          className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
        >
          <div className="flex items-center gap-4">
            <KikoMascot className="w-20 h-24 shrink-0" animateEar={true} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-forest)]">
                Halo! Mau berpetualang ke mana hari ini?
              </h1>
              <p className="text-[18px] text-[var(--color-ink)] mt-1">
                {gentleBreakMessage
                  ? gentleBreakMessage
                  : "Pilih salah satu titik petualangan di empat dunia belajar."}
              </p>
            </div>
          </div>
        </section>

        {/* Pesan Semangat dari Orang Tua jika ada */}
        {parentCheers.length > 0 && (
          <section
            aria-label="Pesan dari orang tua"
            className="bg-[var(--color-sun)] border-[3px] border-[var(--color-forest)] p-5 rounded-2xl flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-bold text-[var(--color-ink)]">
                Pesan titipan dari orang tua:
              </p>
              <p className="text-xl font-bold text-[var(--color-ink)] mt-0.5">
                &ldquo;{parentCheers[0].message_text}&rdquo;
              </p>
            </div>
            <button
              type="button"
              onClick={() => setParentCheers([])}
              className="min-h-[48px] px-4 rounded-xl bg-[var(--color-paper)] border-2 border-[var(--color-forest)] font-bold text-base text-[var(--color-forest)] shrink-0 cursor-pointer"
            >
              Terima kasih!
            </button>
          </section>
        )}

        {/* Peta 4 Dunia Belajar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupedWorlds.map(({ areaKey, meta, items }) => (
            <section
              key={areaKey}
              style={{
                backgroundColor: meta.bg,
                borderRadius: "28px 20px 26px 22px",
                boxShadow: meta.shadow,
              }}
              className="border-[3px] border-[var(--color-forest)] p-5 sm:p-6 flex flex-col justify-between gap-5"
            >
              <div
                className="bg-[var(--color-paper)] border-2 border-[var(--color-forest)] p-4"
                style={{ borderRadius: "18px", boxShadow: "var(--shadow-small)" }}
              >
                <h2 className="text-2xl font-bold text-[var(--color-forest)]">{meta.title}</h2>
                <p className="text-base text-[var(--color-ink)]">{meta.subtitle}</p>
              </div>

              <div className="space-y-3">
                {items.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNode(node)}
                    style={{ boxShadow: "var(--shadow-small)" }}
                    className="w-full min-h-[64px] bg-[var(--color-paper)] border-2 border-[var(--color-forest)] px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3 text-left cursor-pointer hover:-translate-y-[2px] active:translate-y-[2px] transition-transform"
                  >
                    <div>
                      <p className="text-lg font-bold text-[var(--color-forest)]">{node.title}</p>
                      <p className="text-sm text-[var(--color-ink)]">
                        {node.is_completed ? "Sudah dimainkan" : "Siap dimainkan"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <SmallStarMark />
                      <span className="font-bold text-base text-[var(--color-ink)]">
                        {node.is_completed ? node.stars_earned : node.reward_stars}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {activeNode && (
        <ChildQuizModal
          node={activeNode}
          onClose={() => setActiveNode(null)}
          onCompleted={loadChildWorld}
        />
      )}

      {showGarden && <ChildGardenAlbumModal onClose={() => setShowGarden(false)} />}

      {showPinGate && <ParentPinGateModal onClose={() => setShowPinGate(false)} />}
    </div>
  );
}
