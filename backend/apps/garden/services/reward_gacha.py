import random
from django.db import transaction
from apps.users.models import ChildProfile
from apps.garden.models import CollectibleMaster, ChildInventory


class RewardGachaService:
    RARITY_WEIGHTS = {
        CollectibleMaster.Rarity.COMMON: 65,
        CollectibleMaster.Rarity.RARE: 27,
        CollectibleMaster.Rarity.EPIC: 8,
    }

    @staticmethod
    @transaction.atomic
    def open_mystery_box(child: ChildProfile) -> dict:
        """
        Membuka kotak hadiah kejutan dengan anti-frustration logic:
        memprioritaskan stiker/item yang belum dimiliki anak di album.
        """
        all_items = list(CollectibleMaster.objects.all())
        if not all_items:
            raise ValueError("Master data collectible kosong. Jalankan seed_curriculum terlebih dahulu.")

        owned_ids = set(
            ChildInventory.objects.filter(child=child).values_list("item_id", flat=True)
        )
        unowned_items = [item for item in all_items if item.id not in owned_ids]

        # 80% peluang memprioritaskan item baru jika masih ada yang belum dimiliki
        pool = unowned_items if (unowned_items and random.random() < 0.80) else all_items

        weights = [RewardGachaService.RARITY_WEIGHTS.get(item.rarity, 50) for item in pool]
        chosen_item: CollectibleMaster = random.choices(pool, weights=weights, k=1)[0]

        inventory_entry, created = ChildInventory.objects.get_or_create(
            child=child,
            item=chosen_item,
            defaults={"quantity": 1},
        )
        if not created:
            inventory_entry.quantity += 1
            inventory_entry.save()

        return {
            "is_new": created,
            "item": {
                "code": chosen_item.code,
                "name": chosen_item.name,
                "category": chosen_item.category,
                "rarity": chosen_item.rarity,
                "album_theme": chosen_item.album_theme,
                "asset_url": chosen_item.asset_url,
            },
            "total_owned_quantity": inventory_entry.quantity,
        }