"use client";

import { useState } from "react";
import api from "@/lib/api";
import type { ParentDashboardData } from "@/types/api";

interface Props {
  data: ParentDashboardData;
  onRefresh: () => Promise<void>;
}

export default function ParentMissionPanel({ data, onRefresh }: Props) {
  const [missionType, setMissionType] = useState<"WEEKLY_FAMILY_MISSION" | "REAL_WORLD_REWARD">(
    "WEEKLY_FAMILY_MISSION"
  );
  const [missionTitle, setMissionTitle] = useState("");
  const [submittingMission, setSubmittingMission] = useState(false);

  const [cheerText, setCheerText] = useState("");
  const [cheerSent, setCheerSent] = useState(false);

  const handleAddMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle.trim()) return;
    setSubmittingMission(true);
    try {
      await api.post(`/parent/dashboard/${data.child.id}/missions/`, {
        mission_type: missionType,
        title: missionTitle.trim(),
        target_stars: missionType === "REAL_WORLD_REWARD" ? 20 : 5,
      });
      setMissionTitle("");
      await onRefresh();
    } finally {
      setSubmittingMission(false);
    }
  };

  const handleCompleteMission = async (missionId: number) => {
    await api.patch(`/parent/dashboard/${data.child.id}/missions/${missionId}/complete/`);
    await onRefresh();
  };

  const handleSendCheer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cheerText.trim()) return;
    await api.post(`/parent/dashboard/${data.child.id}/cheer/`, {
      sticker_code: "bintang_emas",
      message_text: cheerText.trim(),
    });
    setCheerText("");
    setCheerSent(true);
    setTimeout(() => setCheerSent(false), 3000);
  };

  return (
    <div className="lg:col-span-5 space-y-6">
      <section
        className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 space-y-5"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <h2 className="text-xl font-bold text-[var(--color-forest)]">
          Misi mingguan dan hadiah
        </h2>

        <form onSubmit={handleAddMission} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMissionType("WEEKLY_FAMILY_MISSION")}
              className={`min-h-[48px] px-3 rounded-xl border-2 border-[var(--color-forest)] text-sm font-bold cursor-pointer ${
                missionType === "WEEKLY_FAMILY_MISSION"
                  ? "bg-[var(--color-leaf)] text-[var(--color-ink)]"
                  : "bg-[var(--color-bg)] text-[var(--color-forest)]"
              }`}
            >
              Misi keluarga
            </button>
            <button
              type="button"
              onClick={() => setMissionType("REAL_WORLD_REWARD")}
              className={`min-h-[48px] px-3 rounded-xl border-2 border-[var(--color-forest)] text-sm font-bold cursor-pointer ${
                missionType === "REAL_WORLD_REWARD"
                  ? "bg-[var(--color-sun)] text-[var(--color-ink)]"
                  : "bg-[var(--color-bg)] text-[var(--color-forest)]"
              }`}
            >
              Hadiah nyata
            </button>
          </div>

          <input
            type="text"
            value={missionTitle}
            onChange={(e) => setMissionTitle(e.target.value)}
            placeholder={
              missionType === "WEEKLY_FAMILY_MISSION"
                ? "Contoh: Hitung 5 buah jeruk di dapur"
                : "Contoh: Baca dongeng pilihan sebelum tidur"
            }
            className="w-full min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
          />

          <button
            type="submit"
            disabled={submittingMission}
            style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
            className="w-full min-h-[48px] rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
          >
            {submittingMission ? "Menyimpan..." : "Tambah ke daftar"}
          </button>
        </form>

        <ul className="space-y-3 pt-2">
          {data.missions.map((m) => (
            <li
              key={m.id}
              className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4 flex items-center justify-between gap-3"
              style={{ borderRadius: "16px" }}
            >
              <div>
                <span className="text-xs font-bold text-[var(--color-forest)]">
                  {m.mission_type === "REAL_WORLD_REWARD" ? "Hadiah nyata" : "Misi keluarga"}
                </span>
                <p
                  className={`text-base font-bold ${
                    m.is_completed ? "line-through opacity-60" : "text-[var(--color-ink)]"
                  }`}
                >
                  {m.title}
                </p>
              </div>

              {!m.is_completed ? (
                <button
                  type="button"
                  onClick={() => handleCompleteMission(m.id)}
                  className="min-h-[48px] px-4 rounded-xl bg-[var(--color-paper)] border-2 border-[var(--color-forest)] text-sm font-bold text-[var(--color-forest)] shrink-0 cursor-pointer"
                >
                  Selesai
                </button>
              ) : (
                <span className="text-sm font-bold text-[var(--color-forest)] shrink-0">
                  Tercapai
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 space-y-4"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <h2 className="text-xl font-bold text-[var(--color-forest)]">
          Kirim pesan untuk {data.child.name}
        </h2>
        <p className="text-base text-[var(--color-ink)]">
          Pesan singkat ini akan dibacakan Kiko saat {data.child.name} membuka kebunnya.
        </p>

        <form onSubmit={handleSendCheer} className="space-y-3">
          <input
            type="text"
            value={cheerText}
            onChange={(e) => setCheerText(e.target.value)}
            placeholder="Contoh: Semangat belajar hari ini ya!"
            className="w-full min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
          />
          <button
            type="submit"
            style={{ backgroundColor: "var(--color-forest)", boxShadow: "var(--shadow-forest)" }}
            className="w-full min-h-[48px] rounded-full font-bold text-base text-[var(--color-paper)] cursor-pointer active:translate-y-[2px] transition-transform"
          >
            Kirim lewat Kiko
          </button>
        </form>

        {cheerSent && (
          <p role="status" className="text-base font-bold text-[var(--color-forest)]">
            Pesan sudah dititipkan ke Kiko.
          </p>
        )}
      </section>
    </div>
  );
}
