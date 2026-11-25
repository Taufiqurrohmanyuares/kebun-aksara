from rest_framework import serializers
from .models import LearningNode


class LearningNodeMapSerializer(serializers.ModelSerializer):
    is_completed = serializers.BooleanField(read_only=True)
    stars_earned = serializers.IntegerField(read_only=True)

    class Meta:
        model = LearningNode
        fields = [
            "id", "area", "title", "story_intro", "order_index",
            "is_boss_challenge", "reward_stars", "is_completed", "stars_earned",
        ]