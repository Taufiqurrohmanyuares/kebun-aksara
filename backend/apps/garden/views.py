from rest_framework.response import Response
from rest_framework.views import APIView
from apps.users.permissions import IsChildOwner
from .models import CollectibleMaster, ChildInventory
from .serializers import GardenStateSerializer, ChildInventorySerializer
from .services.reward_gacha import RewardGachaService


class ChildGardenView(APIView):
    permission_classes = [IsChildOwner]

    def get(self, request):
        child = request.child_profile
        inventory = ChildInventory.objects.filter(child=child).select_related("item")
        return Response({
            "status": "success",
            "data": {
                "garden": GardenStateSerializer(child.garden).data,
                "mascot_equipped": child.mascot_equipped,
                "stars_balance": child.stars_balance,
                "inventory": ChildInventorySerializer(inventory, many=True).data,
            },
        })

    def patch(self, request):
        child = request.child_profile
        garden = child.garden
        if "grid_layout" in request.data:
            garden.grid_layout = request.data["grid_layout"]
        if "weather_theme" in request.data:
            garden.weather_theme = request.data["weather_theme"]
        garden.save()

        if "mascot_equipped" in request.data:
            child.mascot_equipped = request.data["mascot_equipped"]
            child.save()

        return Response({"status": "success", "data": GardenStateSerializer(garden).data})


class OpenMysteryChestView(APIView):
    permission_classes = [IsChildOwner]

    def post(self, request):
        reward_data = RewardGachaService.open_mystery_box(request.child_profile)
        return Response({"status": "success", "data": reward_data})


class AlbumCatalogView(APIView):
    permission_classes = [IsChildOwner]

    def get(self, request):
        child = request.child_profile
        owned_map = {
            inv.item_id: inv.quantity
            for inv in ChildInventory.objects.filter(child=child)
        }
        stickers = CollectibleMaster.objects.filter(category=CollectibleMaster.Category.STICKER)
        catalog = [
            {
                "code": s.code,
                "name": s.name,
                "rarity": s.rarity,
                "album_theme": s.album_theme,
                "is_unlocked": s.id in owned_map,
                "quantity": owned_map.get(s.id, 0),
            }
            for s in stickers
        ]
        return Response({"status": "success", "data": catalog})