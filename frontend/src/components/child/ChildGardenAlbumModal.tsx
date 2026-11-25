"use client";

import { useEffect, useState } from "react";
import KikoMascot from "@/components/illustrations/KikoMascot";
import { SmallStarMark } from "@/components/illustrations/DuckIllustration";
import GardenStickerSvg from "@/components/illustrations/GardenStickerSvg";
import api from "@/lib/api";

interface StickerItem {
  code: string;
  name: string;
  rarity: string;
  album_theme: string;
  is_unlocked: boolean;
  quantity: number;
}

interface PlacedItem {
  slot: number;
  code: string;
}

interface Props {
  onClose: () => void;
}

const WEATHER_THEMES = [
  { id: "SUNNY", label: "Cerah Pagi", bg: "#DFF0D8" },
  { id: "RAINY", label: "Gerimis Segar", bg: "#DCEEF8" },
  { id: "SUNSET", label: "Senja Hangat", bg: "#FDECC8" },
];

export default function ChildGardenAlbumModal({ onClose }: Props) {
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [plantHealth, setPlantHealth] = useState(100);
  const [isSleeping, setIsSleeping] = useState(false);
  const [starsBalance, setStarsBalance] = useState(0);
  const [weatherTheme, setWeatherTheme] = useState("SUNNY");
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedStickerCode, setSelectedStickerCode] = useState<string | null>(null);

  const [chestReward, setChestReward] = useState<{ name: string; is_new: boolean } | null>(null);
  const [openingChest, setOpeningChest] = useState(false);
  const [savingGarden, setSavingGarden] = useState(false);

  const loadData = async () => {
    const [gardenRes, albumRes] = await Promise.all([
      api.get("/child/garden/"),
      api.get("/child/album/"),
    ]);
    const garden = gardenRes.data.data.garden;
    setPlantHealth(garden.plant_health);
    setIsSleeping(garden.is_sleeping);
    setWeatherTheme(garden.weather_theme || "SUNNY");
    setPlacedItems(Array.isArray(garden.grid_layout) ? garden.grid_layout : []);
    setStarsBalance(gardenRes.data.data.stars_balance);
    setStickers(albumRes.data.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveGardenState = async (nextLayout: PlacedItem[], nextWeather: string) => {
    setSavingGarden(true);
    try {
      await api.patch("/child/garden/", {
        grid_layout: nextLayout,
        weather_theme: nextWeather,
      });
    } finally {
      setSavingGarden(false);
    }
  };

  const handleWeatherChange = async (themeId: string) => {
    setWeatherTheme(themeId);
    await saveGardenState(placedItems, themeId);
  };

  const handleSlotClick = async (slotIndex: number) => {
    const existing = placedItems.find((p) => p.slot === slotIndex);
    let nextLayout: PlacedItem[];

    if (selectedStickerCode) {
      const filtered = placedItems.filter((p) => p.slot !== slotIndex);
      nextLayout = [...filtered, { slot: slotIndex, code: selectedStickerCode }];
      setSelectedStickerCode(null);
    } else if (existing) {
      nextLayout = placedItems.filter((p) => p.slot !== slotIndex);
    } else {
      return;
    }

    setPlacedItems(nextLayout);
    await saveGardenState(nextLayout, weatherTheme);
  };

  const handleOpenChest = async () => {
    setOpeningChest(true);
    try {
      const res = await api.post("/child/open-chest/");
      setChestReward({
        name: res.data.data.item.name,
        is_new: res.data.data.is_new,
      });
      await loadData();
    } finally {
      setOpeningChest(false);
    }
  };

  const activeWeather =
    WEATHER_THEMES.find((w) => w.id === weatherTheme) || WEATHER_THEMES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kebun dan Album Stiker"
      className="fixed inset-0 z-50 bg-[#1B2B22]/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        className="w-full max-w-3xl bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-5 sm:p-8 max-h-[92svh] overflow-y-auto space-y-6"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-[var(--color-forest)]/15">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-forest)]">
              Kebun dan Album Stiker
            </h2>
            {savingGarden && (
              <p className="text-sm text-[var(--color-forest)]">Menyimpan tata kebun...</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] text-base font-bold text-[var(--color-forest)] cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* Lahan Kebun Interaktif */}
        <div
          style={{ backgroundColor: activeWeather.bg, borderRadius: "24px" }}
          className="border-[3px] border-[var(--color-forest)] p-5 space-y-5"
        >
          {/* Bar atas: Status Kebun & Pilihan Suasana */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <KikoMascot className="w-16 h-20 shrink-0" animateEar={true} />
              <div>
                <p className="text-lg font-bold text-[var(--color-forest)]">
                  {isSleeping
                    ? "Kebun sedang istirahat dengan tenang"
                    : `Kesegaran kebun: ${plantHealth}%`}
                </p>
                <p className="text-base text-[var(--color-ink)]">
                  Bintangmu: <strong>{starsBalance} bintang</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {WEATHER_THEMES.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleWeatherChange(w.id)}
                  className={`min-h-[44px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] text-sm font-bold cursor-pointer ${
                    weatherTheme === w.id
                      ? "bg-[var(--color-forest)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)] text-[var(--color-forest)]"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Petak Tanah Kebun */}
          <div>
            <p className="text-sm font-bold text-[var(--color-forest)] mb-2.5">
              {selectedStickerCode
                ? "Ketuk salah satu petak tanah di bawah untuk menaruh stikermu!"
                : "Ketuk stiker di album bawah lalu taruh di petak kebun (ketuk petak isi untuk mengambil):"}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                const placed = placedItems.find((p) => p.slot === slotIdx);
                const stickerInfo = placed
                  ? stickers.find((s) => s.code === placed.code)
                  : null;
                return (
                  <button
                    key={slotIdx}
                    type="button"
                    onClick={() => handleSlotClick(slotIdx)}
                    style={{
                      backgroundColor: placed ? "var(--color-paper)" : "#74B860",
                      boxShadow: "0 4px 0 var(--color-forest)",
                    }}
                    className={`min-h-[96px] p-3 rounded-2xl border-2 border-[var(--color-forest)] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-transform active:translate-y-[2px] ${
                      selectedStickerCode ? "ring-3 ring-[var(--color-sun)]" : ""
                    }`}
                  >
                    {placed ? (
                      <>
                        <GardenStickerSvg code={placed.code} className="w-11 h-11" />
                        <span className="text-xs font-bold text-[var(--color-ink)] text-center leading-tight">
                          {stickerInfo?.name || "Hiasan"}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-[var(--color-paper)]">
                        Petak {slotIdx + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Buka Kotak Kejutan */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-sm text-[var(--color-ink)]">
              Dapatkan stiker baru untuk menghias kebunmu!
            </p>
            <button
              type="button"
              onClick={handleOpenChest}
              disabled={openingChest}
              style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
              className="min-h-[48px] px-6 rounded-full font-bold text-base text-[var(--color-ink)] shrink-0 cursor-pointer active:translate-y-[2px] transition-transform"
            >
              {openingChest ? "Membuka..." : "Buka kotak kejutan"}
            </button>
          </div>
        </div>

        {chestReward && (
          <div
            role="status"
            className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4 rounded-2xl flex items-center gap-3"
          >
            <SmallStarMark />
            <p className="text-[18px] font-bold text-[var(--color-forest)]">
              Kamu mendapat {chestReward.name}!{" "}
              {chestReward.is_new ? "(Koleksi baru di album!)" : "(Koleksi bertambah!)"}
            </p>
          </div>
        )}

        {/* Koleksi Album Stiker yang Bisa Dipilih */}
        <div>
          <h3 className="text-xl font-bold text-[var(--color-forest)] mb-3">
            Koleksi stiker kebun (ketuk stiker untuk dipasang)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {stickers.map((st) => {
              const isPicked = selectedStickerCode === st.code;
              return (
                <button
                  key={st.code}
                  type="button"
                  disabled={!st.is_unlocked}
                  onClick={() =>
                    setSelectedStickerCode(isPicked ? null : st.code)
                  }
                  className={`p-4 border-2 border-[var(--color-forest)] rounded-2xl text-left flex items-center gap-3 transition-transform ${
                    st.is_unlocked
                      ? "bg-[var(--color-bg)] cursor-pointer hover:-translate-y-[2px]"
                      : "bg-[#E9ECE8] opacity-60 cursor-not-allowed"
                  } ${isPicked ? "ring-4 ring-[var(--color-sun)] bg-[var(--color-paper)]" : ""}`}
                  style={{ boxShadow: st.is_unlocked ? "var(--shadow-small)" : "none" }}
                >
                  <GardenStickerSvg code={st.code} className="w-11 h-11 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--color-forest)]">{st.album_theme}</p>
                    <p className="text-base font-bold text-[var(--color-ink)] leading-snug">
                      {st.name}
                    </p>
                    <p className="text-xs text-[var(--color-ink)] mt-0.5">
                      {st.is_unlocked ? `Dimiliki (${st.quantity})` : "Belum terbuka"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
