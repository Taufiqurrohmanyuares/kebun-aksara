from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.users.models import ChildProfile


class WeatherChoices(models.TextChoices):
    PAGI = "PAGI", "Pagi Cerah"
    SORE = "SORE", "Sore Hangat"
    HUJAN_PELANGI = "HUJAN_PELANGI", "Hujan Pelangi"
    MUSIM_PANEN = "MUSIM_PANEN", "Musim Panen"


def default_garden_layout() -> list:
    return [
        {"uid": "starter_tree_1", "item_code": "tunas_aksara", "x": 180, "y": 240, "stage": 1}
    ]


class GardenState(models.Model):
    child = models.OneToOneField(ChildProfile, on_delete=models.CASCADE, related_name="garden")
    weather_theme = models.CharField(max_length=20, choices=WeatherChoices.choices, default=WeatherChoices.PAGI)
    plant_health = models.PositiveSmallIntegerField(default=100)  # 0-100, langsung pulih ke 100 saat main
    is_sleeping = models.BooleanField(default=False)
    grid_layout = models.JSONField(default=default_garden_layout)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Kebun {self.child.name}"


@receiver(post_save, sender=ChildProfile)
def create_child_garden(sender, instance: ChildProfile, created: bool, **kwargs):
    if created:
        GardenState.objects.create(child=instance)


class CollectibleMaster(models.Model):
    class Category(models.TextChoices):
        STICKER = "STICKER", "Stiker Album"
        GARDEN_DECOR = "GARDEN_DECOR", "Hiasan & Tanaman Kebun"
        MASCOT_ACC = "MASCOT_ACC", "Aksesori Kiko"
        ANIMAL = "ANIMAL", "Hewan Kebun"

    class Rarity(models.TextChoices):
        COMMON = "COMMON", "Biasa"
        RARE = "RARE", "Langka"
        EPIC = "EPIC", "Istimewa"

    class AlbumTheme(models.TextChoices):
        BUAH = "BUAH", "Buah-buahan"
        HEWAN = "HEWAN", "Hewan Lucu"
        KENDARAAN = "KENDARAAN", "Kendaraan"
        PROFESI = "PROFESI", "Profesi Hebat"

    code = models.CharField(max_length=60, unique=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices)
    rarity = models.CharField(max_length=15, choices=Rarity.choices, default=Rarity.COMMON)
    album_theme = models.CharField(max_length=20, choices=AlbumTheme.choices, null=True, blank=True)
    star_cost = models.PositiveIntegerField(default=0)  # 0 jika hanya didapat dari kotak hadiah
    asset_url = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return f"[{self.get_rarity_display()}] {self.name}"


class ChildInventory(models.Model):
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name="inventory")
    item = models.ForeignKey(CollectibleMaster, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("child", "item")