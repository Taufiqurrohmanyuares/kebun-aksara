from django.db import models
from apps.users.models import ChildProfile


class DailyActivityLog(models.Model):
    class Status(models.TextChoices):
        COMPLETED = "COMPLETED", "Selesai Belajar"
        REST_DAY_USED = "REST_DAY_USED", "Hari Libur Mingguan"
        SLEEPING = "SLEEPING", "Kebun Tidur Sebentar"

    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name="activity_logs")
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    minutes_spent = models.PositiveSmallIntegerField(default=0)
    questions_answered = models.PositiveSmallIntegerField(default=0)

    class Meta:
        unique_together = ("child", "date")
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.child.name} - {self.date} ({self.status})"


class ParentGoalAndMission(models.Model):
    class MissionType(models.TextChoices):
        WEEKLY_FAMILY_MISSION = "WEEKLY_FAMILY_MISSION", "Misi Keluarga Mingguan"
        REAL_WORLD_REWARD = "REAL_WORLD_REWARD", "Hadiah Dunia Nyata"

    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name="parent_missions")
    mission_type = models.CharField(max_length=25, choices=MissionType.choices)
    title = models.CharField(max_length=160)
    target_stars = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.child.name}: {self.title}"


class ParentCheerMessage(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name="cheer_messages")
    sticker_code = models.CharField(max_length=50, default="bintang_emas")
    message_text = models.CharField(max_length=200)
    is_seen_by_child = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)