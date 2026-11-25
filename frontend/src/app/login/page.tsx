"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      router.replace("/daftar");
    } else {
      router.replace("/masuk");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)]">
      <p className="text-[18px] font-bold text-[var(--color-forest)]">
        Mengalihkan ke halaman masuk...
      </p>
    </div>
  );
}

export default function LegacyLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)]">
          <p className="text-[18px] font-bold text-[var(--color-forest)]">
            Mengalihkan ke halaman masuk...
          </p>
        </div>
      }
    >
      <LoginRedirectHandler />
    </Suspense>
  );
}
