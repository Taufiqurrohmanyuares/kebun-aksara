from rest_framework import serializers
from .models import GardenState, ChildInventory


class GardenStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GardenState
        fields = ["weather_theme", "plant_health", "is_sleeping", "grid_layout", "updated_at"]


class ChildInventorySerializer(serializers.ModelSerializer):
    code = serializers.CharField(source="item.code")
    name = serializers.CharField(source="item.name")
    category = serializers.CharField(source="item.category")
    rarity = serializers.CharField(source="item.rarity")
    album_theme = serializers.CharField(source="item.album_theme")
    asset_url = serializers.CharField(source="item.asset_url")

    class Meta:
        model = ChildInventory
        fields = ["code", "name", "category", "rarity", "album_theme", "asset_url", "quantity"]