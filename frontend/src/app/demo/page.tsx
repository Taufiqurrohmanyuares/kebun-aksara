"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import KikoMascot from "@/components/illustrations/KikoMascot";

export default function DemoSessionPage() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_DEMO !== "true") {
      router.replace("/masuk");
      return;
    }

    // Bersihkan kredensial nyata apa pun dan buat sesi demo terisolasi (tanpa akses admin)
    localStorage.removeItem("ka_access_token");
    localStorage.setItem("ka_demo_mode", "true");
    localStorage.setItem("ka_user_role", "PARENT");
    localStorage.setItem("ka_user_name", "Keluarga Tamu");
    localStorage.setItem("ka_active_child_id", "demo-child");

    const demoState = {
      child: {
        id: 0,
        name: "Arka (Demo)",
        stars_balance: 12,
        current_level: 1,
      },
      completed_node_ids: [1],
      today_minutes_spent: 2,
    };
    sessionStorage.setItem("ka_demo_state", JSON.stringify(demoState));

    const timer = setTimeout(() => {
      router.replace("/child/map");
    }, 650);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6 text-center gap-4">
      <KikoMascot className="w-24 h-28" animateEar={true} />
      <h1 className="text-2xl font-bold text-[var(--color-forest)]">
        Menyiapkan kebun latihan sementara...
      </h1>
      <p className="text-base text-[var(--color-ink)] max-w-md">
        Mode demo menggunakan data contoh yang otomatis diatur ulang saat tab ditutup.
      </p>
    </div>
  );
}