"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import KikoMascot from "@/components/illustrations/KikoMascot";
import AuthIllustrationPanel from "./AuthIllustrationPanel";
import api from "@/lib/api";

interface AuthFormCardProps {
  mode: "login" | "register";
}

function isWeakPin(pin: string): boolean {
  if (!/^\d{4}$/.test(pin)) return true;
  if (/^(\d)\1{3}$/.test(pin)) return true;
  const digits = pin.split("").map(Number);
  const isAsc =
    digits[1] === digits[0] + 1 &&
    digits[2] === digits[1] + 1 &&
    digits[3] === digits[2] + 1;
  const isDesc =
    digits[1] === digits[0] - 1 &&
    digits[2] === digits[1] - 1 &&
    digits[3] === digits[2] - 1;
  return isAsc || isDesc;
}

export default function AuthFormCard({ mode }: AuthFormCardProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"PARENT" | "TEACHER">("PARENT");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [childNickname, setChildNickname] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    childNickname?: string;
    parentPin?: string;
    schoolName?: string;
    privacy?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

  const inputBaseClass =
    "w-full min-h-[48px] lg:min-h-[44px] rounded-xl border-2 border-[#1F4D3A] bg-[var(--color-paper)] text-[16px] text-[var(--color-ink)] placeholder:text-[#6B7A72] focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]";

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setForgotNotice(false);

    if (!email.trim()) {
      setErrors({ email: "Masukkan alamat email kamu terlebih dahulu." });
      return;
    }
    if (!password) {
      setErrors({ password: "Masukkan kata sandi kamu." });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login/", {
        email: email.trim(),
        password,
      });
      const { access, user, children } = res.data.data;

      localStorage.removeItem("ka_demo_mode");
      localStorage.setItem("ka_access_token", access);
      localStorage.setItem("ka_user_role", user.role);
      localStorage.setItem("ka_user_name", user.full_name);

      if (children && children.length > 0) {
        localStorage.setItem("ka_active_child_id", String(children[0].id));
      } else {
        localStorage.removeItem("ka_active_child_id");
      }

      if (user.role === "TEACHER") {
        router.push("/teacher/classroom");
      } else {
        router.push("/parent/dashboard");
      }
    } catch {
      setErrors({
        general: "Email atau kata sandi belum cocok. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nextErrors: typeof errors = {};
    if (!fullName.trim()) {
      nextErrors.fullName = "Nama lengkap wajib diisi.";
    }
    if (!email.trim() || !email.includes("@")) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    if (password.length < 8) {
      nextErrors.password = "Kata sandi minimal 8 karakter.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nextErrors: typeof errors = {};
    if (role === "PARENT") {
      if (!childNickname.trim()) {
        nextErrors.childNickname = "Nama panggilan anak wajib diisi.";
      }
      if (isWeakPin(parentPin)) {
        nextErrors.parentPin =
          "Gunakan 4 angka acak (tolak 0000, 1111, 1234, dan angka berurutan).";
      }
    } else if (!schoolName.trim()) {
      nextErrors.schoolName = "Nama sekolah atau PAUD wajib diisi.";
    }

    if (!agreedPrivacy) {
      nextErrors.privacy = "Centang persetujuan Kebijakan Privasi untuk melanjutkan.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register/", {
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        role,
        parent_pin: role === "PARENT" ? parentPin : "8492",
        child_name: role === "PARENT" ? childNickname.trim() : "",
        school_name: role === "TEACHER" ? schoolName.trim() : "",
      });

      const { access, user, children } = res.data.data;
      localStorage.removeItem("ka_demo_mode");
      localStorage.setItem("ka_access_token", access);
      localStorage.setItem("ka_user_role", user.role);
      localStorage.setItem("ka_user_name", user.full_name);

      if (children && children.length > 0) {
        localStorage.setItem("ka_active_child_id", String(children[0].id));
      } else {
        localStorage.removeItem("ka_active_child_id");
      }

      if (user.role === "TEACHER") {
        router.push("/teacher/classroom");
      } else {
        router.push("/parent/dashboard");
      }
    } catch {
      setErrors({
        general: "Pendaftaran belum berhasil. Periksa kembali data atau gunakan email lain.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-[1040px] lg:min-h-[560px] bg-[var(--color-paper)] border-2 border-[#1F4D3A] flex flex-col lg:flex-row"
      style={{
        borderRadius: "28px",
        boxShadow: "var(--shadow-panel)",
      }}
    >
      {/* Kolom Kiri (45% di desktop): Ilustrasi penuh tanpa celah */}
      <AuthIllustrationPanel
        speechText={
          isRegister ? "Hai! Aku Kiko, senang kenalan." : "Hai! Yuk lanjut belajar."
        }
      />

      {/* Kolom Kanan (55% di desktop): Form rata kiri, center vertikal, tanpa overflow internal */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-7 sm:px-10 lg:px-10 lg:py-8">
        {/* Header Mobile (< lg): Logo + Kiko kecil di atas judul */}
        <div className="flex lg:hidden items-center justify-between mb-3">
          <Logo size={34} />
          <KikoMascot className="h-[72px] w-auto" animateEar={false} reactToSpeech={false} />
        </div>

        {/* ============================================================== */}
        {/* MODE LOGIN (/masuk)                                            */}
        {/* ============================================================== */}
        {!isRegister && (
          <div className="w-full">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h1 className="text-3xl font-bold text-[#1F4D3A] leading-tight">Masuk</h1>
              <Link
                href="/"
                aria-label="Tutup dan kembali ke beranda"
                className="w-10 h-10 shrink-0 rounded-full border-2 border-[#1F4D3A] bg-[var(--color-paper)] hover:bg-[var(--color-bg)] text-[#1F4D3A] inline-flex items-center justify-center focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Link>
            </div>

            <p className="text-[16px] text-[var(--color-ink)] mb-5">
              Lanjutkan petualangan belajar bersama Kiko.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-bold text-[#1F4D3A] mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F4D3A] pointer-events-none">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className={`${inputBaseClass} pl-11 pr-4`}
                  />
                </div>
                {errors.email && (
                  <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-bold text-[#1F4D3A] mb-1"
                >
                  Kata sandi
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi kamu"
                    className={`${inputBaseClass} pl-4 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg text-[#1F4D3A] hover:bg-[var(--color-bg)] inline-flex items-center justify-center cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
                  >
                    {showPassword ? (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                    {errors.password}
                  </p>
                )}

                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => setForgotNotice((prev) => !prev)}
                    className="text-sm font-bold text-[#1F4D3A] underline underline-offset-4 cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632] rounded"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              </div>

              {forgotNotice && (
                <p
                  role="status"
                  className="text-sm text-[var(--color-ink)] bg-[var(--color-bg)] border-2 border-[#1F4D3A] px-3.5 py-2 rounded-xl"
                >
                  Hubungi tim bantuan lewat halaman{" "}
                  <Link href="/kontak" className="font-bold text-[#1F4D3A] underline">
                    Kontak
                  </Link>{" "}
                  untuk mengatur ulang kata sandi kamu.
                </p>
              )}

              {errors.general && (
                <p role="alert" className="text-sm font-bold text-[#8A1C1C]">
                  {errors.general}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#F2B632",
                    boxShadow: "var(--shadow-sun)",
                  }}
                  className="w-full min-h-[48px] lg:min-h-[44px] rounded-full font-bold text-[17px] text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform disabled:opacity-60 focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>
              </div>
            </form>

            <p className="text-center text-base text-[var(--color-ink)] mt-5">
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                className="font-bold text-[#1F4D3A] underline underline-offset-4 focus:outline-none focus:ring-[3px] focus:ring-[#F2B632] rounded"
              >
                Daftar gratis
              </Link>
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE DAFTAR (/daftar) - LANGKAH 1                              */}
        {/* ============================================================== */}
        {isRegister && step === 1 && (
          <div className="w-full">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-bold text-[#1F4D3A]">Langkah 1 dari 2</p>
                <h1 className="text-3xl font-bold text-[#1F4D3A] leading-tight mt-0.5">
                  Buat akun
                </h1>
              </div>

              <Link
                href="/"
                aria-label="Tutup dan kembali ke beranda"
                className="w-10 h-10 shrink-0 rounded-full border-2 border-[#1F4D3A] bg-[var(--color-paper)] hover:bg-[var(--color-bg)] text-[#1F4D3A] inline-flex items-center justify-center focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Link>
            </div>

            {/* Segmented Control Peran */}
            <div
              role="group"
              aria-label="Pilih peran pendaftar"
              className="grid grid-cols-2 p-1 rounded-2xl border-2 border-[#1F4D3A] bg-[var(--color-bg)] mb-3"
            >
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`min-h-[48px] lg:min-h-[44px] rounded-xl font-bold text-base cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632] ${
                  role === "PARENT"
                    ? "bg-[var(--color-paper)] text-[#1F4D3A] border border-[#1F4D3A]"
                    : "text-[#4A5A51]"
                }`}
              >
                Orang tua
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`min-h-[48px] lg:min-h-[44px] rounded-xl font-bold text-base cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632] ${
                  role === "TEACHER"
                    ? "bg-[var(--color-paper)] text-[#1F4D3A] border border-[#1F4D3A]"
                    : "text-[#4A5A51]"
                }`}
              >
                Guru PAUD/TK
              </button>
            </div>

            <form onSubmit={handleRegisterStep1Next} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="reg-fullname"
                  className="block text-sm font-bold text-[#1F4D3A] mb-1"
                >
                  Nama lengkap
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap kamu"
                  className={`${inputBaseClass} px-4`}
                />
                {errors.fullName && (
                  <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-bold text-[#1F4D3A] mb-1"
                >
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className={`${inputBaseClass} px-4`}
                />
                {errors.email && (
                  <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-sm font-bold text-[#1F4D3A] mb-1"
                >
                  Kata sandi (minimal 8 karakter)
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi kamu"
                    className={`${inputBaseClass} pl-4 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg text-[#1F4D3A] hover:bg-[var(--color-bg)] inline-flex items-center justify-center cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
                  >
                    {showPassword ? (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#F2B632",
                    boxShadow: "var(--shadow-sun)",
                  }}
                  className="w-full min-h-[48px] lg:min-h-[44px] rounded-full font-bold text-[17px] text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
                >
                  Lanjut
                </button>
              </div>
            </form>

            <p className="text-center text-base text-[var(--color-ink)] mt-5">
              Sudah punya akun?{" "}
              <Link
                href="/masuk"
                className="font-bold text-[#1F4D3A] underline underline-offset-4 focus:outline-none focus:ring-[3px] focus:ring-[#F2B632] rounded"
              >
                Masuk
              </Link>
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE DAFTAR (/daftar) - LANGKAH 2                              */}
        {/* ============================================================== */}
        {isRegister && step === 2 && (
          <div className="w-full">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-bold text-[#1F4D3A]">Langkah 2 dari 2</p>
                <h1 className="text-3xl font-bold text-[#1F4D3A] leading-tight mt-0.5">
                  {role === "PARENT" ? "Profil anak" : "Profil kelas"}
                </h1>
              </div>

              <Link
                href="/"
                aria-label="Tutup dan kembali ke beranda"
                className="w-10 h-10 shrink-0 rounded-full border-2 border-[#1F4D3A] bg-[var(--color-paper)] hover:bg-[var(--color-bg)] text-[#1F4D3A] inline-flex items-center justify-center focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Link>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3" noValidate>
              {role === "PARENT" ? (
                <>
                  <div>
                    <label
                      htmlFor="reg-child-name"
                      className="block text-sm font-bold text-[#1F4D3A] mb-1"
                    >
                      Nama panggilan anak
                    </label>
                    <input
                      id="reg-child-name"
                      type="text"
                      value={childNickname}
                      onChange={(e) => setChildNickname(e.target.value)}
                      placeholder="Mis. Arka"
                      className={`${inputBaseClass} px-4`}
                    />
                    {errors.childNickname && (
                      <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                        {errors.childNickname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-parent-pin"
                      className="block text-sm font-bold text-[#1F4D3A] mb-1"
                    >
                      PIN 4 digit
                    </label>
                    <input
                      id="reg-parent-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="off"
                      value={parentPin}
                      onChange={(e) => setParentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="4 angka"
                      className={`${inputBaseClass} px-4 tracking-widest`}
                    />
                    <p className="text-xs text-[#4A5A51] mt-1">
                      PIN ini mengunci halaman catatan orang tua agar tidak terbuka tidak sengaja oleh anak.
                    </p>
                    {errors.parentPin && (
                      <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                        {errors.parentPin}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label
                    htmlFor="reg-school-name"
                    className="block text-sm font-bold text-[#1F4D3A] mb-1"
                  >
                    Nama sekolah/PAUD
                  </label>
                  <input
                    id="reg-school-name"
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Mis. TK Melati Ceria"
                    className={`${inputBaseClass} px-4`}
                  />
                  {errors.schoolName && (
                    <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                      {errors.schoolName}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#1F4D3A] shrink-0 cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
                  />
                  <span className="text-sm leading-relaxed text-[var(--color-ink)]">
                    Saya orang tua/wali atau guru, dan setuju dengan{" "}
                    <Link
                      href="/privasi"
                      className="font-bold text-[#1F4D3A] underline underline-offset-4"
                    >
                      Kebijakan Privasi
                    </Link>
                    .
                  </span>
                </label>
                {errors.privacy && (
                  <p role="alert" className="text-sm font-bold text-[#8A1C1C] mt-1">
                    {errors.privacy}
                  </p>
                )}
              </div>

              {errors.general && (
                <p role="alert" className="text-sm font-bold text-[#8A1C1C]">
                  {errors.general}
                </p>
              )}

              <div className="pt-1 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#F2B632",
                    boxShadow: "var(--shadow-sun)",
                  }}
                  className="w-full min-h-[48px] lg:min-h-[44px] rounded-full font-bold text-[17px] text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform disabled:opacity-60 focus:outline-none focus:ring-[3px] focus:ring-[#F2B632]"
                >
                  {loading ? "Memproses..." : "Daftar dan mulai"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setStep(1);
                    }}
                    className="min-h-[48px] lg:min-h-[44px] px-4 font-bold text-base text-[#1F4D3A] underline underline-offset-4 cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#F2B632] rounded"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}