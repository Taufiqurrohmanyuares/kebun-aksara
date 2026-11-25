"use client";

import { useEffect, useState } from "react";
import KikoMascot from "@/components/illustrations/KikoMascot";
import { SmallStarMark } from "@/components/illustrations/DuckIllustration";
import VisualCountBoard from "./VisualCountBoard";
import SyllableBuilderBoard from "./SyllableBuilderBoard";
import { playKikoSound, speakIndonesian, stopSpeaking } from "@/lib/speech";
import api from "@/lib/api";
import type { LearningNode, QuizQuestion } from "@/types/api";

interface Props {
  node: LearningNode;
  onClose: () => void;
  onCompleted: () => Promise<void>;
}

export default function ChildQuizModal({ node, onClose, onCompleted }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [storyIntro, setStoryIntro] = useState(node.story_intro);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [completedResult, setCompletedResult] = useState<{
    stars_earned: number;
    total_stars: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get(`/child/node/${node.id}/session/`)
      .then((res) => {
        if (!active) return;
        const loaded: QuizQuestion[] = res.data.data.questions || [];
        setQuestions(loaded);
        setStoryIntro(res.data.data.node.story_intro || node.story_intro);
        if (loaded.length > 0) {
          speakIndonesian(loaded[0].speak_text || loaded[0].prompt, true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      stopSpeaking();
    };
  }, [node]);

  const currentQuestion = questions[currentIndex];

  const handleChooseOption = async (option: string) => {
    if (!currentQuestion || isCorrectAnswer) return;
    setSelectedOption(option);
    const correct = option === currentQuestion.answer;

    playKikoSound(correct ? "correct" : "retry");

    try {
      const res = await api.post("/child/submit-answer/", {
        item_key: currentQuestion.item_key,
        is_correct: correct,
      });
      const msg = res.data.data.mascot_feedback;
      setFeedback(msg);
      speakIndonesian(msg, false);
    } catch {
      const fallback = correct
        ? "Hore! Kiko senang sekali jawabanmu benar!"
        : "Hampir! Yuk kita coba perhatikan lagi pelan-pelan.";
      setFeedback(fallback);
      speakIndonesian(fallback, false);
    }

    if (correct) {
      setIsCorrectAnswer(true);
    }
  };

  const handleNextStep = async () => {
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setFeedback("");
      setIsCorrectAnswer(false);
      const nextQ = questions[nextIdx];
      if (nextQ) {
        speakIndonesian(nextQ.speak_text || nextQ.prompt, true);
      }
      return;
    }

    const res = await api.post(`/child/node/${node.id}/complete/`);
    setCompletedResult({
      stars_earned: res.data.data.stars_earned,
      total_stars: res.data.data.total_stars,
    });
    playKikoSound("celebrate");
    speakIndonesian("Hebat sekali! Kamu mendapatkan bintang baru untuk kebunmu!", false);
    await onCompleted();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Petualangan ${node.title}`}
      className="fixed inset-0 z-50 bg-[#1B2B22]/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        className="w-full max-w-2xl bg-[var(--color-paper)] border-[3px] border-[var(--color-forest)] p-5 sm:p-8 max-h-[92svh] overflow-y-auto"
        style={{ borderRadius: "var(--radius-panel)", boxShadow: "var(--shadow-panel)" }}
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-[var(--color-forest)]/15">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-forest)]">
            {node.title}
          </h2>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="min-h-[48px] px-4 rounded-xl border-2 border-[var(--color-forest)] text-base font-bold text-[var(--color-forest)] cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-[18px] font-bold text-[var(--color-forest)]">
              Kiko sedang menyiapkan permainan...
            </p>
          </div>
        ) : completedResult ? (
          <div className="py-8 text-center space-y-5">
            <div className="flex justify-center">
              <KikoMascot className="w-28 h-32" animateEar={true} />
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-forest)]">
              <SmallStarMark />
              <span className="text-xl font-bold text-[var(--color-forest)]">
                +{completedResult.stars_earned} bintang baru!
              </span>
            </div>
            <p className="text-[18px] text-[var(--color-ink)] max-w-md mx-auto">
              Hebat sekali! Kebunmu makin segar dan sekarang kamu punya {completedResult.total_stars} bintang.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
              className="min-h-[52px] px-8 rounded-full font-bold text-[18px] text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
            >
              Kembali ke peta
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="pt-5 space-y-5">
            <div className="flex items-center gap-2">
              {questions.map((q, idx) => (
                <div
                  key={q.item_key}
                  className={`h-3 flex-1 rounded-full border-2 border-[var(--color-forest)] ${
                    idx <= currentIndex ? "bg-[var(--color-leaf)]" : "bg-[var(--color-bg)]"
                  }`}
                />
              ))}
            </div>

            {currentIndex === 0 && !feedback && (
              <p className="text-base text-[var(--color-ink)] bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-3.5 rounded-2xl">
                {storyIntro}
              </p>
            )}

            {currentQuestion.mode === "TEACH_KIKO" && (
              <div className="px-4 py-2.5 rounded-xl bg-[var(--color-sun)] border-2 border-[var(--color-forest)] text-base font-bold text-[var(--color-ink)]">
                Mode Ajari Kiko: Pilihan disederhanakan agar mudah ditebak!
              </div>
            )}

            <div className="bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xl sm:text-2xl font-bold text-[var(--color-forest)] leading-snug">
                {currentQuestion.prompt}
              </p>
              <button
                type="button"
                onClick={() =>
                  speakIndonesian(currentQuestion.speak_text || currentQuestion.prompt, true)
                }
                style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
                className="min-h-[48px] px-4 rounded-full font-bold text-base text-[var(--color-ink)] shrink-0 cursor-pointer active:translate-y-[2px] transition-transform"
              >
                Dengarkan Kiko
              </button>
            </div>

            {currentQuestion.question_type === "VISUAL_COUNT" && currentQuestion.visual && (
              <VisualCountBoard
                key={currentQuestion.item_key}
                item={currentQuestion.visual.item}
                count={currentQuestion.visual.count}
              />
            )}

            {currentQuestion.question_type === "SYLLABLE_BUILD" &&
            currentQuestion.mode !== "TEACH_KIKO" &&
            currentQuestion.syllables &&
            currentQuestion.syllables.length > 0 ? (
              <SyllableBuilderBoard
                key={`${currentQuestion.item_key}-${feedback}`}
                syllables={currentQuestion.syllables}
                disabled={isCorrectAnswer}
                onWordBuilt={(builtWord: string) => handleChooseOption(builtWord)}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  const isRight = isCorrectAnswer && opt === currentQuestion.answer;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChooseOption(opt)}
                      style={{
                        backgroundColor: isRight
                          ? "var(--color-leaf)"
                          : isSelected
                          ? "var(--color-sun)"
                          : "var(--color-paper)",
                        boxShadow: isRight
                          ? "0 4px 0 var(--color-leaf-deep)"
                          : "var(--shadow-small)",
                      }}
                      className="min-h-[64px] px-4 rounded-2xl border-[3px] border-[var(--color-forest)] font-bold text-xl sm:text-2xl text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {feedback && (
              <div className="flex items-center gap-3.5 pt-1">
                <KikoMascot className="w-16 h-20 shrink-0" animateEar={true} />
                <div
                  className="flex-1 bg-[var(--color-bg)] border-2 border-[var(--color-forest)] p-4"
                  style={{ borderRadius: "18px 18px 18px 4px", boxShadow: "var(--shadow-small)" }}
                >
                  <p className="text-[18px] font-bold text-[var(--color-ink)]">{feedback}</p>
                </div>
              </div>
            )}

            {isCorrectAnswer && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={{ backgroundColor: "var(--color-sun)", boxShadow: "var(--shadow-sun)" }}
                  className="min-h-[52px] px-8 rounded-full font-bold text-[18px] text-[var(--color-ink)] cursor-pointer active:translate-y-[2px] transition-transform"
                >
                  {currentIndex + 1 < questions.length ? "Lanjut" : "Ambil bintang"}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}