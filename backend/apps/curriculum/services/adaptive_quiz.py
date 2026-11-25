import random
from datetime import timedelta
from django.utils import timezone
from apps.users.models import ChildProfile
from apps.curriculum.models import LearningNode, ChildItemMastery, ChildNodeProgress


class AdaptiveQuizService:
    @staticmethod
    def generate_session_questions(child: ChildProfile, node: LearningNode) -> list[dict]:
        """
        Menyusun daftar soal untuk sebuah node dengan menyisipkan kartu pengulangan
        (spaced repetition) dan menyesuaikan tingkat kesulitan jika anak sering salah.
        Mendukung 3 format soal (pilihan ganda, suku kata, hitung visual).
        """
        raw_items = list(node.content_payload or [])
        mastery_qs = ChildItemMastery.objects.filter(
            child=child, item_key__in=[item.get("item_key") for item in raw_items if "item_key" in item]
        )
        mastery_map = {m.item_key: m for m in mastery_qs}

        session_questions = []
        for item in raw_items:
            item_key = item.get("item_key", "")
            m = mastery_map.get(item_key)
            is_teach_kiko = bool(m and m.wrong_streak >= 2)
            options = list(item.get("options", []))
            answer = item.get("answer", "")

            # Jika anak salah >= 2x berturut-turut, sederhanakan opsi menjadi 2 pilihan & aktifkan mode "Ajari Kiko"
            if is_teach_kiko and len(options) > 2:
                distractors = [o for o in options if o != answer]
                chosen_distractor = random.choice(distractors) if distractors else options[0]
                options = [answer, chosen_distractor]
                random.shuffle(options)

            prompt = item.get("prompt", "")
            if is_teach_kiko:
                prompt = f"Kiko masih bingung nih! Bantu Kiko pilih jawaban untuk: {item.get('prompt', '')}"

            session_questions.append(
                {
                    "item_key": item_key,
                    "question_type": item.get("question_type", "CHOICE"),
                    "prompt": prompt,
                    "speak_text": item.get("speak_text", item.get("prompt", "")),
                    "options": options,
                    "answer": answer,
                    "syllables": item.get("syllables", []),
                    "visual": item.get("visual", None),
                    "mode": "TEACH_KIKO" if is_teach_kiko else "NORMAL",
                }
            )
        return session_questions

    # Alias untuk kompatibilitas kode lain
    build_session_questions = generate_session_questions

    @staticmethod
    def record_answer(child: ChildProfile, item_key: str, is_correct: bool) -> dict:
        """
        Memperbarui skor penguasaan item tanpa penalti negatif yang menghukum anak (Zero Punishment).
        """
        now = timezone.now()
        mastery, _ = ChildItemMastery.objects.get_or_create(child=child, item_key=item_key)
        mastery.total_attempts += 1

        if is_correct:
            mastery.wrong_streak = 0
            mastery.mastery_score = min(1.0, round(mastery.mastery_score + 0.15, 2))
            days_interval = 1 if mastery.mastery_score < 0.6 else (3 if mastery.mastery_score < 0.85 else 7)
            mastery.next_review_at = now + timedelta(days=days_interval)
            feedback = random.choice(
                [
                    "Hore! Kiko senang sekali jawabanmu benar!",
                    "Hebat! Telinga Kiko sampai goyang mendengar jawabanmu!",
                    "Tepat sekali! Kamu makin jago!",
                ]
            )
        else:
            mastery.wrong_streak += 1
            mastery.mastery_score = max(0.1, round(mastery.mastery_score - 0.1, 2))
            mastery.next_review_at = now + timedelta(minutes=15)
            feedback = random.choice(
                [
                    "Hampir! Yuk kita coba perhatikan lagi pelan-pelan.",
                    "Tidak apa-apa, Kiko tahu kamu sudah berusaha!",
                    "Yuk kita ulangi lagi bersama Kiko!",
                ]
            )

        mastery.save()

        return {
            "item_key": item_key,
            "is_correct": is_correct,
            "mastery_score": mastery.mastery_score,
            "simplify_next": mastery.wrong_streak >= 2,
            "mascot_feedback": feedback,
        }

    @staticmethod
    def complete_node(child: ChildProfile, node: LearningNode) -> dict:
        """
        Menyelesaikan satu titik petualangan, menambah bintang, dan menyegarkan kebun.
        """
        progress, created = ChildNodeProgress.objects.get_or_create(child=child, node=node)
        earned = node.reward_stars if not progress.is_completed else 1

        progress.is_completed = True
        progress.stars_earned = max(progress.stars_earned, earned)
        progress.completed_at = timezone.now()
        progress.save()

        child.stars_balance += earned
        child.current_level = max(child.current_level, (child.stars_balance // 15) + 1)
        child.save(update_fields=["stars_balance", "current_level"])

        if hasattr(child, "garden"):
            garden = child.garden
            garden.plant_health = 100
            garden.is_sleeping = False
            garden.save(update_fields=["plant_health", "is_sleeping"])

        return {
            "stars_earned": earned,
            "total_stars": child.stars_balance,
            "current_level": child.current_level,
            "garden_refreshed": True,
        }
