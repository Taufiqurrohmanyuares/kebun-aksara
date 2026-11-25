"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { SmallStarMark } from "@/components/illustrations/DuckIllustration";
import api from "@/lib/api";

interface StudentSummary {
  id: number;
  name: string;
  current_level: number;
  stars_balance: number;
  completed_nodes: number;
}

interface ClassroomItem {
  id: number;
  name: string;
  invite_code: string;
  students: StudentSummary[];
}

export default function TeacherClassroomPage() {
  const router = useRouter();
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchClassrooms = useCallback(async () => {
    const token = localStorage.getItem("ka_access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setError("");
      const res = await api.get("/teacher/classrooms/");
      setClassrooms(res.data.data || []);
    } catch {
      setError("Gagal memuat data ruang kelas. Pastikan Anda masuk dengan akun Guru PAUD/TK.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreating(true);
    try {
      await api.post("/teacher/classrooms/", { name: newClassName.trim() });
      setNewClassName("");
      await fetchClassrooms();
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("ka_access_token");
    localStorage.removeItem("ka_user_role");
    localStorage.removeItem("ka_active_child_id");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <header className="bg-[var(--color-paper)] border-b-2 border-[var(--color-forest)]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-[72px] py-3 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="min-h-[48px] inline-flex items-center">
            <Logo size={36} />
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-forest)] text-sm font-bold text-[var(--color-forest)]">
              Ruang Guru PAUD/TK
            </span>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Panel Buat Ruang Kelas */}
        <section
          className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
        >
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-forest)]">
              Kelompok belajar kelas
            </h1>
            <p className="text-[18px] text-[var(--color-ink)] mt-1">
              Bagikan kode kelas kepada orang tua agar perkembangan anak di rumah dapat dipantau bersama.
            </p>
          </div>

          <form onSubmit={handleCreateClass} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Nama kelas baru (mis. TK Bintang)"
              className="min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base sm:w-64"
            />
            <button
              type="submit"
              disabled={creating}
              style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
              className="min-h-[48px] px-6 rounded-full font-bold text-base text-[var(--color-ink)] shrink-0 cursor-pointer active:translate-y-[2px] transition-transform"
            >
              {creating ? "Membuat..." : "Buat kelas"}
            </button>
          </form>
        </section>

        {error && (
          <div role="alert" className="p-4 rounded-2xl border-2 border-[#8A2C2C] bg-[#FDF2F2] text-[#6E1E1E] font-bold">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[18px] font-bold text-[var(--color-forest)]">Memuat daftar kelas...</p>
        ) : (
          <div className="space-y-6">
            {classrooms.map((cls) => (
              <section
                key={cls.id}
                className="bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 sm:p-7 space-y-5"
                style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[var(--color-forest)]/15">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-forest)]">{cls.name}</h2>
                    <p className="text-base text-[var(--color-ink)]">
                      Jumlah murid terhubung: <strong>{cls.students.length} anak</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-[var(--color-bg)] border-2 border-[var(--color-forest)]">
                      <span className="text-xs font-bold text-[var(--color-forest)] block">
                        Kode undangan orang tua
                      </span>
                      <span className="text-xl font-bold tracking-wider text-[var(--color-ink)]">
                        {cls.invite_code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(cls.invite_code)}
                      style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
                      className="min-h-[48px] px-5 rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer"
                    >
                      {copiedCode === cls.invite_code ? "Tersalin!" : "Salin kode"}
                    </button>
                  </div>
                </div>

                {cls.students.length === 0 ? (
                  <p className="text-[18px] text-[var(--color-ink)]">
                    Belum ada murid yang terhubung. Minta orang tua memasukkan kode{" "}
                    <strong>{cls.invite_code}</strong> di Dashboard Orang Tua.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cls.students.map((student) => (
                      <div
                        key={student.id}
                        className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4 rounded-2xl flex items-center justify-between gap-3"
                        style={{ boxShadow: "var(--shadow-small)" }}
                      >
                        <div>
                          <p className="text-lg font-bold text-[var(--color-forest)]">
                            {student.name}
                          </p>
                          <p className="text-sm text-[var(--color-ink)]">
                            Tahap {student.current_level} • {student.completed_nodes} titik selesai
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[var(--color-paper)] px-3 py-1.5 rounded-xl border-2 border-[var(--color-forest)]">
                          <SmallStarMark />
                          <span className="font-bold text-base text-[var(--color-ink)]">
                            {student.stars_balance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}