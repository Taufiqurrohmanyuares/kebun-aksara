"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Props {
  onClose: () => void;
}

export default function ParentPinGateModal({ onClose }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      await api.post("/parent/verify-pin/", { pin });
      router.push("/parent/dashboard");
    } catch {
      setError("PIN tidak cocok. Coba lagi (PIN demo: 1234).");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Masukkan PIN Orang Tua"
      className="fixed inset-0 z-50 bg-[#1B2B22]/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        className="w-full max-w-sm bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 space-y-4"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <h2 className="text-xl font-bold text-[var(--color-forest)]">
          Area khusus orang tua
        </h2>
        <p className="text-base text-[var(--color-ink)]">
          Masukkan 4 digit PIN orang tua untuk membuka catatan belajar.
        </p>

        {error && (
          <p role="alert" className="text-sm font-bold text-[#6E1E1E]">
            {error}
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full min-h-[52px] px-4 rounded-xl border-2 border-[var(--color-forest)] text-center text-2xl tracking-widest font-bold"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] rounded-full border-2 border-[var(--color-forest)] font-bold text-base text-[var(--color-forest)] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={checking}
              style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
              className="flex-1 min-h-[48px] rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer"
            >
              {checking ? "Memeriksa..." : "Buka"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
