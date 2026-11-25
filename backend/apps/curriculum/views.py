from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.users.models import ChildProfile
from apps.users.permissions import IsCurriculumAdmin
from apps.curriculum.models import LearningNode, ChildNodeProgress
from apps.curriculum.services import AdaptiveQuizService


def get_active_child(request):
    child_id = request.query_params.get("child_id") or request.headers.get("X-Child-ID")
    if child_id:
        return ChildProfile.objects.filter(id=child_id, parent=request.user).first()
    return request.user.children.first()


class ChildMapView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        child = get_active_child(request)
        if not child:
            return Response({"status": "error", "message": "Profil anak tidak ditemukan."}, status=404)

        nodes = LearningNode.objects.all()
        progress_map = {
            p.node_id: p for p in ChildNodeProgress.objects.filter(child=child)
        }

        result = []
        for node in nodes:
            prog = progress_map.get(node.id)
            result.append(
                {
                    "id": node.id,
                    "area": node.area,
                    "title": node.title,
                    "story_intro": node.story_intro,
                    "order_index": node.order_index,
                    "is_boss_challenge": node.is_boss_challenge,
                    "reward_stars": node.reward_stars,
                    "is_completed": prog.is_completed if prog else False,
                    "stars_earned": prog.stars_earned if prog else 0,
                }
            )
        return Response({"status": "success", "data": result})


class NodeSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, node_id):
        child = get_active_child(request)
        if not child:
            return Response({"status": "error", "message": "Profil anak tidak ditemukan."}, status=404)

        node = LearningNode.objects.filter(id=node_id).first()
        if not node:
            return Response({"status": "error", "message": "Titik belajar tidak ditemukan."}, status=404)

        questions = AdaptiveQuizService.generate_session_questions(child, node)
        return Response(
            {
                "status": "success",
                "data": {
                    "node": {
                        "id": node.id,
                        "area": node.area,
                        "title": node.title,
                        "story_intro": node.story_intro,
                        "reward_stars": node.reward_stars,
                    },
                    "questions": questions,
                },
            }
        )


class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        child = get_active_child(request)
        if not child:
            return Response({"status": "error", "message": "Profil anak tidak ditemukan."}, status=404)

        item_key = request.data.get("item_key")
        is_correct = bool(request.data.get("is_correct", False))
        if not item_key:
            return Response({"status": "error", "message": "item_key wajib diisi."}, status=400)

        result = AdaptiveQuizService.record_answer(child, item_key, is_correct)
        return Response({"status": "success", "data": result})


class CompleteNodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, node_id):
        child = get_active_child(request)
        if not child:
            return Response({"status": "error", "message": "Profil anak tidak ditemukan."}, status=404)

        node = LearningNode.objects.filter(id=node_id).first()
        if not node:
            return Response({"status": "error", "message": "Titik belajar tidak ditemukan."}, status=404)

        prog, created = ChildNodeProgress.objects.get_or_create(child=child, node=node)
        earned = node.reward_stars if not prog.is_completed else 1
        prog.is_completed = True
        prog.stars_earned = max(prog.stars_earned, node.reward_stars)
        prog.save()

        child.stars_balance += earned
        child.save(update_fields=["stars_balance"])

        return Response(
            {
                "status": "success",
                "data": {
                    "stars_earned": earned,
                    "total_stars": child.stars_balance,
                },
            }
        )


class AdminCurriculumStudioView(APIView):
    permission_classes = [IsCurriculumAdmin]

    def get(self, request):
        nodes = LearningNode.objects.all()
        data = [
            {
                "id": n.id,
                "area": n.area,
                "title": n.title,
                "story_intro": n.story_intro,
                "order_index": n.order_index,
                "reward_stars": n.reward_stars,
                "questions_count": len(n.content_payload or []),
                "content_payload": n.content_payload,
            }
            for n in nodes
        ]
        return Response({"status": "success", "data": data})

    def post(self, request):
        area = request.data.get("area", LearningNode.Area.HUTAN_HURUF)
        title = request.data.get("title", "").strip()
        story_intro = request.data.get("story_intro", "").strip()
        reward_stars = int(request.data.get("reward_stars", 3))
        content_payload = request.data.get("content_payload", [])

        if not title or not content_payload:
            return Response(
                {"status": "error", "message": "Judul titik dan daftar soal wajib diisi."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        next_order = LearningNode.objects.filter(area=area).count() + 1
        node = LearningNode.objects.create(
            area=area,
            order_index=next_order,
            title=title,
            story_intro=story_intro or f"Petualangan baru bersama Kiko di {title}!",
            reward_stars=reward_stars,
            content_payload=content_payload,
        )
        return Response(
            {"status": "success", "data": {"id": node.id, "title": node.title}},
            status=status.HTTP_201_CREATED,
        )