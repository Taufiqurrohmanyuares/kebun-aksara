from datetime import timedelta
from django.utils import timezone
from apps.users.models import ChildProfile
from apps.engagement.models import DailyActivityLog


class StreakEvaluationService:
    @staticmethod
    def evaluate_and_get_streak(child: ChildProfile) -> dict:
        """
        Mengevaluasi rantai bunga harian dengan toleransi 1x Hari Libur per minggu
        dan mengubah status kebun menjadi 'sleeping' tanpa mereset skor jika terlewat lama.
        """
        today = timezone.localdate()
        yesterday = today - timedelta(days=1)
        two_days_ago = today - timedelta(days=2)

        logs = list(
            DailyActivityLog.objects.filter(child=child).order_by("-date")[:30]
        )
        log_by_date = {log.date: log for log in logs}

        # Cek apakah kemarin terlewat, tetapi 2 hari lalu aktif & jatah libur minggu ini belum dipakai
        week_start = today - timedelta(days=today.weekday())
        rest_days_this_week = DailyActivityLog.objects.filter(
            child=child,
            date__gte=week_start,
            status=DailyActivityLog.Status.REST_DAY_USED,
        ).count()

        if yesterday not in log_by_date and two_days_ago in log_by_date:
            if rest_days_this_week == 0:
                rest_log = DailyActivityLog.objects.create(
                    child=child,
                    date=yesterday,
                    status=DailyActivityLog.Status.REST_DAY_USED,
                )
                log_by_date[yesterday] = rest_log
                rest_days_this_week = 1

        # Hitung panjang rantai bunga mundur dari hari ini atau kemarin
        streak_count = 0
        cursor = today if today in log_by_date else yesterday

        while cursor in log_by_date and log_by_date[cursor].status in (
            DailyActivityLog.Status.COMPLETED,
            DailyActivityLog.Status.REST_DAY_USED,
        ):
            streak_count += 1
            cursor -= timedelta(days=1)

        # Jika rantai terputus > 2 hari dan hari ini belum main, set kebun tidur lembut
        is_garden_sleeping = streak_count == 0 and len(logs) > 0 and today not in log_by_date
        if is_garden_sleeping and not child.garden.is_sleeping:
            child.garden.is_sleeping = True
            child.garden.plant_health = max(60, child.garden.plant_health - 20)
            child.garden.save()

        return {
            "flower_chain_count": streak_count,
            "rest_day_available": rest_days_this_week == 0,
            "is_garden_sleeping": is_garden_sleeping,
            "today_minutes_spent": log_by_date[today].minutes_spent if today in log_by_date else 0,
            "should_rest_now": (log_by_date[today].minutes_spent >= 10) if today in log_by_date else False,
        }

    @staticmethod
    def record_heartbeat(child: ChildProfile, minutes_increment: int = 1) -> dict:
        """
        Dipanggil berkala dari layar anak untuk mencatat durasi belajar
        dan memicu istirahat lembut saat menyentuh 10 menit.
        """
        today = timezone.localdate()
        log, _ = DailyActivityLog.objects.get_or_create(
            child=child,
            date=today,
            defaults={"status": DailyActivityLog.Status.COMPLETED, "minutes_spent": 0},
        )
        log.status = DailyActivityLog.Status.COMPLETED
        log.minutes_spent += minutes_increment
        log.save()

        return {
            "minutes_spent": log.minutes_spent,
            "gentle_break_triggered": log.minutes_spent >= 10,
            "message": (
                "Kebunmu sudah senang hari ini, sampai besok ya!"
                if log.minutes_spent >= 10
                else ""
            ),
        }