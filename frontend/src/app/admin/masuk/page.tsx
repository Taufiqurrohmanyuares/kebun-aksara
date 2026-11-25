"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import api from "@/lib/api";

export default function AdminMasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login/", {
        email: email.trim(),
        password,
      });
      const { access, user } = res.data.data;

      if (user.role !== "CURRICULUM_ADMIN") {
        setError("Akun ini tidak memiliki hak akses pengelola kurikulum.");
        return;
      }

      localStorage.removeItem("ka_demo_mode");
      localStorage.setItem("ka_access_token", access);
      localStorage.setItem("ka_user_role", user.role);
      localStorage.setItem("ka_user_name", user.full_name);
      router.push("/admin-studio");
    } catch {
      setError("Email atau kata sandi belum cocok. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--color-bg)]">
      <div
        className="w-full max-w-md bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 sm:p-8"
        style={{
          borderRadius: "var(--radius-panel)",
          boxShadow: "var(--shadow-panel)",
        }}
      >
        <div className="mb-5">
          <Logo size={36} />
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-forest)]">
          Masuk Pengelola Kurikulum
        </h1>
        <p className="text-base text-[var(--color-ink)] mt-1 mb-6">
          Area internal penyusunan materi dan titik petualangan Kebun Aksara.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-base font-bold text-[var(--color-forest)] mb-1"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-paper)] text-[18px] placeholder:text-[#6B7A72]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-base font-bold text-[var(--color-forest)] mb-1"
            >
              Kata sandi
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi kamu"
                className="w-full min-h-[48px] pl-4 pr-24 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-paper)] text-[18px] placeholder:text-[#6B7A72]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[36px] px-2.5 rounded-lg text-sm font-bold text-[var(--color-forest)] cursor-pointer"
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm font-bold text-[#8A2C2C]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "var(--color-sun)",
              boxShadow: "var(--shadow-sun)",
            }}
            className="w-full min-h-[52px] mt-2 rounded-full font-bold text-[18px] text-[var(--color-ink)] cursor-pointer"
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}