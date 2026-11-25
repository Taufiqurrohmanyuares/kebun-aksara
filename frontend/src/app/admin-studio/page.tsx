"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import api from "@/lib/api";

interface StudioNode {
  id: number;
  area: string;
  title: string;
  story_intro: string;
  order_index: number;
  reward_stars: number;
  questions_count: number;
}

const AREA_OPTIONS = [
  { value: "HUTAN_HURUF", label: "Hutan Huruf" },
  { value: "BUKIT_ANGKA", label: "Bukit Angka" },
  { value: "SUNGAI_KATA", label: "Sungai Kata" },
  { value: "GUA_TAMBAH", label: "Gua Tambah" },
];

export default function AdminStudioPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<StudioNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form tambah titik kurikulum & soal pertama
  const [area, setArea] = useState("HUTAN_HURUF");
  const [title, setTitle] = useState("");
  const [storyIntro, setStoryIntro] = useState("");
  const [rewardStars, setRewardStars] = useState(3);
  const [questionType, setQuestionType] = useState<"CHOICE" | "VISUAL_COUNT" | "SYLLABLE_BUILD">("CHOICE");
  const [promptText, setPromptText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [distractorText, setDistractorText] = useState("");
  const [visualItem, setVisualItem] = useState<"APPLE" | "ORANGE" | "CRYSTAL">("APPLE");
  const [visualCount, setVisualCount] = useState(4);
  const [syllablesInput, setSyllablesInput] = useState("ba, ju, ku, ti");
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const fetchNodes = useCallback(async () => {
    const token = localStorage.getItem("ka_access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setError("");
      const res = await api.get("/curriculum/studio/nodes/");
      setNodes(res.data.data || []);
    } catch {
      setError("Akses ditolak. Pastikan Anda masuk sebagai Admin Kurikulum.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !promptText.trim() || !answerText.trim()) return;
    setSaving(true);
    setSavedNotice(false);

    const distractors = distractorText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const options = Array.from(new Set([answerText.trim(), ...distractors]));
    while (options.length < 4) {
      options.push(`${answerText.trim()}${options.length}`);
    }

    const questionItem: Record<string, unknown> = {
      item_key: `custom_${Date.now()}`,
      question_type: questionType,
      prompt: promptText.trim(),
      speak_text: promptText.trim(),
      options: options.slice(0, 4),
      answer: answerText.trim(),
    };

    if (questionType === "VISUAL_COUNT") {
      questionItem.visual = { item: visualItem, count: Number(visualCount) };
    } else if (questionType === "SYLLABLE_BUILD") {
      questionItem.syllables = syllablesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    try {
      await api.post("/curriculum/studio/nodes/", {
        area,
        title: title.trim(),
        story_intro: storyIntro.trim(),
        reward_stars: Number(rewardStars),
        content_payload: [questionItem],
      });
      setTitle("");
      setStoryIntro("");
      setPromptText("");
      setAnswerText("");
      setDistractorText("");
      setSavedNotice(true);
      await fetchNodes();
    } finally {
      setSaving(false);
    }
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
            <span className="px-3.5 py-1.5 rounded-full bg-[var(--color-sun)] border-2 border-[var(--color-forest)] text-sm font-bold text-[var(--color-ink)]">
              Studio Kurikulum Admin
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
        {error && (
          <div role="alert" className="p-4 rounded-2xl border-2 border-[#8A2C2C] bg-[#FDF2F2] text-[#6E1E1E] font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri (5 kolom): Form Tambah Titik & Soal Baru */}
          <section
            className="lg:col-span-5 bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 space-y-4"
            style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
          >
            <h1 className="text-2xl font-bold text-[var(--color-forest)]">
              Tambah titik petualangan
            </h1>

            <form onSubmit={handleCreateNode} className="space-y-3.5">
              <div>
                <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                  Dunia belajar
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base font-bold"
                >
                  {AREA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                  Judul titik petualangan
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mengenal Huruf K dan L"
                  className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                  Cerita pembuka Kiko
                </label>
                <input
                  type="text"
                  value={storyIntro}
                  onChange={(e) => setStoryIntro(e.target.value)}
                  placeholder="Ayo bantu Kiko menemukan huruf tersembunyi!"
                  className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                    Format permainan
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) =>
                      setQuestionType(e.target.value as "CHOICE" | "VISUAL_COUNT" | "SYLLABLE_BUILD")
                    }
                    className="w-full min-h-[48px] px-3 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-sm font-bold"
                  >
                    <option value="CHOICE">Pilihan Kata/Huruf</option>
                    <option value="VISUAL_COUNT">Hitung Objek Visual</option>
                    <option value="SYLLABLE_BUILD">Susun Suku Kata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                    Hadiah bintang
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rewardStars}
                    onChange={(e) => setRewardStars(Number(e.target.value))}
                    className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
                  />
                </div>
              </div>

              {questionType === "VISUAL_COUNT" && (
                <div className="grid grid-cols-2 gap-3 bg-[var(--color-bg)] p-3 rounded-xl border-2 border-[var(--color-forest)]">
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-forest)] mb-1">
                      Jenis objek
                    </label>
                    <select
                      value={visualItem}
                      onChange={(e) => setVisualItem(e.target.value as "APPLE" | "ORANGE" | "CRYSTAL")}
                      className="w-full min-h-[44px] px-2.5 rounded-lg border-2 border-[var(--color-forest)] bg-[var(--color-paper)] text-sm font-bold"
                    >
                      <option value="APPLE">Apel Merah</option>
                      <option value="ORANGE">Jeruk Manis</option>
                      <option value="CRYSTAL">Kristal Gua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-forest)] mb-1">
                      Jumlah objek
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={visualCount}
                      onChange={(e) => setVisualCount(Number(e.target.value))}
                      className="w-full min-h-[44px] px-3 rounded-lg border-2 border-[var(--color-forest)] bg-[var(--color-paper)] text-sm font-bold"
                    />
                  </div>
                </div>
              )}

              {questionType === "SYLLABLE_BUILD" && (
                <div className="bg-[var(--color-bg)] p-3 rounded-xl border-2 border-[var(--color-forest)]">
                  <label className="block text-xs font-bold text-[var(--color-forest)] mb-1">
                    Batu suku kata (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={syllablesInput}
                    onChange={(e) => setSyllablesInput(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-lg border-2 border-[var(--color-forest)] bg-[var(--color-paper)] text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                  Teks pertanyaan Kiko
                </label>
                <input
                  type="text"
                  required
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Contoh: Huruf depan kata 'kucing' adalah..."
                  className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                    Jawaban benar
                  </label>
                  <input
                    type="text"
                    required
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="K"
                    className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--color-forest)] mb-1">
                    Pengecoh (koma)
                  </label>
                  <input
                    type="text"
                    value={distractorText}
                    onChange={(e) => setDistractorText(e.target.value)}
                    placeholder="C, G, T"
                    className="w-full min-h-[48px] px-3.5 rounded-xl border-2 border-[var(--color-forest)] bg-[var(--color-bg)] text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
                className="w-full min-h-[50px] rounded-full font-bold text-base text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
              >
                {saving ? "Menyimpan..." : "Terbitkan ke peta anak"}
              </button>

              {savedNotice && (
                <p role="status" className="text-sm font-bold text-[var(--color-forest)]">
                  Titik petualangan baru berhasil ditambahkan ke kurikulum!
                </p>
              )}
            </form>
          </section>

          {/* Kolom Kanan (7 kolom): Daftar Bank Soal Aktif */}
          <section
            className="lg:col-span-7 bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-6 space-y-4"
            style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--color-forest)]">
                Bank kurikulum aktif ({nodes.length} titik)
              </h2>
            </div>

            {loading ? (
              <p className="text-base">Memuat daftar kurikulum...</p>
            ) : (
              <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--color-forest)]">
                        {node.area.replace("_", " ")} • Urutan #{node.order_index}
                      </span>
                      <p className="text-lg font-bold text-[var(--color-ink)]">{node.title}</p>
                      <p className="text-sm text-[var(--color-ink)]">{node.story_intro}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-3 py-1 rounded-lg bg-[var(--color-paper)] border-2 border-[var(--color-forest)] text-xs font-bold text-[var(--color-forest)]">
                        {node.questions_count} soal • +{node.reward_stars} bintang
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}