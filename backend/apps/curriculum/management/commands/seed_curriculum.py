import os
from django.core.management.base import BaseCommand
from apps.users.models import User, ChildProfile, Classroom
from apps.curriculum.models import LearningNode
from apps.garden.models import CollectibleMaster


class Command(BaseCommand):
    help = "Mengisi kurikulum 4 dunia, stiker, dan membuat akun admin kurikulum via env/CLI"

    def add_arguments(self, parser):
        parser.add_argument("--admin-email", type=str, default=os.getenv("ADMIN_SEED_EMAIL", ""))
        parser.add_argument("--admin-password", type=str, default=os.getenv("ADMIN_SEED_PASSWORD", ""))

    def handle(self, *args, **options):
        admin_email = (options.get("admin_email") or "").strip().lower()
        admin_password = options.get("admin_password") or ""

        if admin_email and admin_password:
            admin_user, created = User.objects.get_or_create(
                email=admin_email,
                defaults={
                    "full_name": "Pengelola Kurikulum",
                    "role": User.Role.CURRICULUM_ADMIN,
                    "is_staff": True,
                },
            )
            admin_user.role = User.Role.CURRICULUM_ADMIN
            admin_user.is_staff = True
            admin_user.set_password(admin_password)
            admin_user.save()
            self.stdout.write(
                self.style.SUCCESS(f"Akun admin kurikulum siap untuk: {admin_email}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    "Lewati pembuatan admin (set ADMIN_SEED_EMAIL & ADMIN_SEED_PASSWORD atau --admin-email / --admin-password)."
                )
            )

        collectibles = [
            ("stiker_kupu_biru", "Kupu-Kupu Biru", "STICKER", "COMMON", "Taman Pagi"),
            ("stiker_apel_merah", "Pohon Apel Manis", "STICKER", "COMMON", "Kebun Buah"),
            ("stiker_kiko_topi", "Kiko Bertopi Jerami", "STICKER", "RARE", "Sahabat Kiko"),
            ("stiker_kristal_pelangi", "Kristal Pelangi Gua", "STICKER", "EPIC", "Harta Karun"),
            ("stiker_bebek_sungai", "Bebek Sungai Kata", "STICKER", "COMMON", "Tepi Sungai"),
            ("stiker_bunga_matahari", "Bunga Matahari Raksasa", "STICKER", "RARE", "Taman Pagi"),
        ]
        for code, name, cat, rarity, theme in collectibles:
            CollectibleMaster.objects.update_or_create(
                code=code,
                defaults={
                    "name": name,
                    "category": cat,
                    "rarity": rarity,
                    "album_theme": theme,
                    "asset_url": f"/assets/stickers/{code}.svg",
                },
            )

        nodes_data = [
            {
                "area": LearningNode.Area.HUTAN_HURUF,
                "order_index": 1,
                "title": "Daun Huruf Vokal A, I, U",
                "story_intro": "Dengarkan Kiko menyebutkan nama buah, lalu ketuk huruf depannya!",
                "is_boss_challenge": False,
                "reward_stars": 3,
                "content_payload": [
                    {
                        "item_key": "huruf_a",
                        "question_type": "CHOICE",
                        "prompt": "Kata 'apel' diawali dengan huruf apa?",
                        "speak_text": "A-pel. Kata apel diawali dengan huruf apa?",
                        "options": ["A", "O", "E", "U"],
                        "answer": "A",
                    },
                    {
                        "item_key": "huruf_i",
                        "question_type": "CHOICE",
                        "prompt": "Kata 'ikan' berenang di air. Huruf depannya adalah...",
                        "speak_text": "I-kan. Huruf depan kata ikan adalah?",
                        "options": ["U", "I", "A", "E"],
                        "answer": "I",
                    },
                    {
                        "item_key": "huruf_u",
                        "question_type": "CHOICE",
                        "prompt": "Hewan hijau 'ulat' diawali dengan huruf...",
                        "speak_text": "U-lat. Hewan ulat diawali dengan huruf apa?",
                        "options": ["O", "E", "U", "I"],
                        "answer": "U",
                    },
                ],
            },
            {
                "area": LearningNode.Area.HUTAN_HURUF,
                "order_index": 2,
                "title": "Telinga Tajam: B atau D?",
                "story_intro": "Huruf B dan D punya perut menghadap berbeda. Dengarkan bunyinya bersama Kiko!",
                "is_boss_challenge": False,
                "reward_stars": 3,
                "content_payload": [
                    {
                        "item_key": "huruf_b_bebek",
                        "question_type": "CHOICE",
                        "prompt": "Bunyi 'be-bek' diawali dengan huruf...",
                        "speak_text": "Be-bek. Huruf depan kata bebek adalah?",
                        "options": ["D", "B", "P", "R"],
                        "answer": "B",
                    },
                    {
                        "item_key": "huruf_d_daun",
                        "question_type": "CHOICE",
                        "prompt": "Bunyi 'da-un' diawali dengan huruf...",
                        "speak_text": "Da-un. Huruf depan kata daun adalah?",
                        "options": ["B", "P", "D", "G"],
                        "answer": "D",
                    },
                ],
            },
            {
                "area": LearningNode.Area.BUKIT_ANGKA,
                "order_index": 1,
                "title": "Panen Apel Merah 1 sampai 5",
                "story_intro": "Ketuk setiap buah apel di layar untuk menghitung jumlahnya bersama Kiko!",
                "is_boss_challenge": False,
                "reward_stars": 3,
                "content_payload": [
                    {
                        "item_key": "visual_apel_4",
                        "question_type": "VISUAL_COUNT",
                        "prompt": "Ketuk semua apel di bawah, lalu pilih jumlahnya!",
                        "speak_text": "Ayo ketuk semua buah apel, lalu pilih angkanya!",
                        "visual": {"item": "APPLE", "count": 4},
                        "options": ["3", "4", "5", "6"],
                        "answer": "4",
                    },
                    {
                        "item_key": "visual_jeruk_6",
                        "question_type": "VISUAL_COUNT",
                        "prompt": "Ada berapa buah jeruk manis di keranjang Kiko?",
                        "speak_text": "Hitung semua buah jeruk manis di keranjang Kiko!",
                        "visual": {"item": "ORANGE", "count": 6},
                        "options": ["5", "6", "7", "8"],
                        "answer": "6",
                    },
                ],
            },
            {
                "area": LearningNode.Area.SUNGAI_KATA,
                "order_index": 1,
                "title": "Rangkai Batu Kata: buku & batu",
                "story_intro": "Ketuk dua batu suku kata secara berurutan agar Kiko bisa melompat menyeberang!",
                "is_boss_challenge": False,
                "reward_stars": 4,
                "content_payload": [
                    {
                        "item_key": "syllable_buku",
                        "question_type": "SYLLABLE_BUILD",
                        "prompt": "Susun dua batu suku kata untuk membentuk kata: buku",
                        "speak_text": "Ayo susun batu suku kata menjadi kata bu-ku!",
                        "syllables": ["ku", "bu", "ba", "tu"],
                        "options": ["buku", "kubu", "batu", "baku"],
                        "answer": "buku",
                    },
                    {
                        "item_key": "syllable_batu",
                        "question_type": "SYLLABLE_BUILD",
                        "prompt": "Susun dua batu suku kata untuk membentuk kata: batu",
                        "speak_text": "Sekarang susun batu suku kata menjadi kata ba-tu!",
                        "syllables": ["tu", "ba", "sa", "ku"],
                        "options": ["batu", "tuba", "satu", "baku"],
                        "answer": "batu",
                    },
                ],
            },
            {
                "area": LearningNode.Area.GUA_TAMBAH,
                "order_index": 1,
                "title": "Gabungkan Kristal Cahaya",
                "story_intro": "Hitung seluruh kristal di dalam gua untuk menyalakan lentera Kiko!",
                "is_boss_challenge": False,
                "reward_stars": 3,
                "content_payload": [
                    {
                        "item_key": "visual_kristal_3",
                        "question_type": "VISUAL_COUNT",
                        "prompt": "2 kristal biru + 1 kristal kuning = ketuk semua lalu pilih jumlahnya!",
                        "speak_text": "Dua kristal ditambah satu kristal, ada berapa semuanya?",
                        "visual": {"item": "CRYSTAL", "count": 3},
                        "options": ["2", "3", "4", "5"],
                        "answer": "3",
                    },
                    {
                        "item_key": "visual_kristal_5",
                        "question_type": "VISUAL_COUNT",
                        "prompt": "3 kristal + 2 kristal = ketuk semua kristal lalu pilih angkanya!",
                        "speak_text": "Tiga kristal ditambah dua kristal, ada berapa semuanya?",
                        "visual": {"item": "CRYSTAL", "count": 5},
                        "options": ["4", "5", "6", "7"],
                        "answer": "5",
                    },
                ],
            },
        ]

        for node in nodes_data:
            LearningNode.objects.update_or_create(
                area=node["area"],
                order_index=node["order_index"],
                defaults={
                    "title": node["title"],
                    "story_intro": node["story_intro"],
                    "is_boss_challenge": node["is_boss_challenge"],
                    "reward_stars": node["reward_stars"],
                    "content_payload": node["content_payload"],
                },
            )

        self.stdout.write(self.style.SUCCESS("Kurikulum dan stiker Kebun Aksara berhasil diperbarui."))