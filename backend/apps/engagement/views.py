from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.users.models import ChildProfile
from apps.users.permissions import IsChildOwner
from apps.curriculum.models import LearningNode, ChildNodeProgress, ChildItemMastery
from apps.garden.models import ChildInventory, CollectibleMaster
from .models import DailyActivityLog, ParentGoalAndMission, ParentCheerMessage
from .serializers import ParentMissionSerializer, ParentCheerSerializer
from .services.streak_service import StreakEvaluationService


class ChildStreakAndHeartbeatView(APIView):
    permission_classes = [IsChildOwner]

    def get(self, request):
        streak_data = StreakEvaluationService.evaluate_and_get_streak(request.child_profile)
        unread_cheers = ParentCheerMessage.objects.filter(
            child=request.child_profile, is_seen_by_child=False
        )
        cheers_data = ParentCheerSerializer(unread_cheers, many=True).data
        unread_cheers.update(is_seen_by_child=True)

        return Response({
            "status": "success",
            "data": {**streak_data, "parent_cheers": cheers_data},
        })

    def post(self, request):
        minutes = int(request.data.get("minutes", 1))
        result = StreakEvaluationService.record_heartbeat(request.child_profile, minutes)
        return Response({"status": "success", "data": result})


class ParentDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id: int):
        child = get_object_or_404(ChildProfile, id=child_id, parent=request.user)
        streak_info = StreakEvaluationService.evaluate_and_get_streak(child)

        # Hitung progres per area untuk grid 2x2 Dashboard Orang Tua
        areas = ["HUTAN_HURUF", "BUKIT_ANGKA", "SUNGAI_KATA", "GUA_TAMBAH"]
        area_progress = []
        for area in areas:
            total = LearningNode.objects.filter(area=area).count()
            done = ChildNodeProgress.objects.filter(child=child, node__area=area, is_completed=True).count()
            pct = int((done / total) * 100) if total > 0 else 0
            area_progress.append({"area": area, "completed": done, "total": total, "percentage": pct})

        # Grafik aktivitas 7 hari terakhir
        today = timezone.localdate()
        last_7_days = []
        logs_map = {
            l.date: l for l in DailyActivityLog.objects.filter(
                child=child, date__gte=today - timedelta(days=6)
            )
        }
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            log = logs_map.get(d)
            last_7_days.append({
                "date": d.strftime("%d %b"),
                "minutes": log.minutes_spent if log else 0,
                "status": log.status if log else "NONE",
            })

        # Item yang perlu pengulangan (mastery rendah)
        review_items = list(
            ChildItemMastery.objects.filter(child=child, mastery_score__lt=0.6)
            .values("item_key", "mastery_score")[:5]
        )

        total_stickers = CollectibleMaster.objects.filter(category="STICKER").count()
        owned_stickers = ChildInventory.objects.filter(child=child, item__category="STICKER").count()

        missions = ParentMissionSerializer(child.parent_missions.all().order_by("is_completed", "-created_at"), many=True).data

        return Response({
            "status": "success",
            "data": {
                "child": {
                    "id": child.id,
                    "name": child.name,
                    "stars_balance": child.stars_balance,
                    "current_level": child.current_level,
                },
                "streak": streak_info,
                "area_progress": area_progress,
                "weekly_chart": last_7_days,
                "review_items": review_items,
                "stickers_summary": {"owned": owned_stickers, "total": total_stickers},
                "missions": missions,
            },
        })


class ParentMissionManageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id: int):
        child = get_object_or_404(ChildProfile, id=child_id, parent=request.user)
        serializer = ParentMissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(child=child)
        return Response({"status": "success", "data": serializer.data}, status=201)

    def patch(self, request, child_id: int, mission_id: int):
        mission = get_object_or_404(
            ParentGoalAndMission, id=mission_id, child_id=child_id, child__parent=request.user
        )
        mission.is_completed = True
        mission.completed_at = timezone.now()
        mission.save()
        return Response({"status": "success", "data": ParentMissionSerializer(mission).data})


class ParentSendCheerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id: int):
        child = get_object_or_404(ChildProfile, id=child_id, parent=request.user)
        serializer = ParentCheerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(child=child)
        return Response({"status": "success", "data": serializer.data}, status=201)