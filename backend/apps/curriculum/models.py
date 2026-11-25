from django.db import models
from django.utils import timezone
from apps.users.models import ChildProfile


class AreaChoices(models.TextChoices):
    HUTAN_HURUF = "HUTAN_HURUF", "Hutan Huruf"
    BUKIT_ANGKA = "BUKIT_ANGKA", "Bukit Angka"
    SUNGAI_KATA = "SUNGAI_KATA", "Sungai Kata"
    GUA_TAMBAH = "GUA_TAMBAH", "Gua Tambah"


class LearningNode(models.Model):
    Area = AreaChoices
    area = models.CharField(max_length=20, choices=AreaChoices.choices)

    title = models.CharField(max_length=120)
    story_intro = models.TextField(blank=True)
    order_index = models.PositiveIntegerField(default=1)
    is_boss_challenge = models.BooleanField(default=False)
    reward_stars = models.PositiveSmallIntegerField(default=3)
    # Struktur JSON berisi array soal: [{"item_key": "HURUF_B", "prompt": "...", "options": [...], "answer": "B", "audio_url": "..."}]
    content_payload = models.JSONField(default=list)

    class Meta:
        ordering = ["area", "order_index"]
        unique_together = ("area", "order_index")

    def __str__(self) -> str:
        return f"[{self.get_area_display()}] #{self.order_index} - {self.title}"


class ChildNodeProgress(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name="node_progress")
    node = models.ForeignKey(LearningNode, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    stars_earned = models.PositiveSmallIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("child", "node")


class ChildItemMastery(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name="item_masteries")
    item_key = models.CharField(max_length=50, db_index=True)  # Contoh: "HURUF_A", "ANGKA_5"
    mastery_score = models.FloatField(default=0.5)  # Rentang 0.0 - 1.0
    wrong_streak = models.PositiveSmallIntegerField(default=0)
    total_attempts = models.PositiveIntegerField(default=0)
    next_review_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("child", "item_key")

    @property
    def consecutive_wrong(self):
        return self.wrong_streak

    @consecutive_wrong.setter
    def consecutive_wrong(self, val):
        self.wrong_streak = val

    @property
    def last_practiced_at(self):
        return self.updated_at

    @last_practiced_at.setter
    def last_practiced_at(self, val):
        pass

    def __str__(self) -> str:
        return f"{self.child.name} - {self.item_key} ({int(self.mastery_score * 100)}%)"


ItemMastery = ChildItemMastery
