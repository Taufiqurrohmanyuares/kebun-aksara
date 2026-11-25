from rest_framework import serializers
from .models import ParentGoalAndMission, ParentCheerMessage


class ParentMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentGoalAndMission
        fields = ["id", "mission_type", "title", "target_stars", "is_completed", "completed_at", "created_at"]


class ParentCheerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentCheerMessage
        fields = ["id", "sticker_code", "message_text", "is_seen_by_child", "created_at"]