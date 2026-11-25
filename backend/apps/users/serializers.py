from rest_framework import serializers
from .models import User, ChildProfile


class ChildProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildProfile
        fields = [
            "id", "name", "avatar_code", "birth_year",
            "stars_balance", "current_level", "mascot_equipped",
        ]
        read_only_fields = ["id", "stars_balance", "current_level"]


class RegisterParentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    parent_pin = serializers.CharField(write_only=True, min_length=4, max_length=4)
    child_name = serializers.CharField(write_only=True)
    child_birth_year = serializers.IntegerField(write_only=True, default=2020)

    class Meta:
        model = User
        fields = ["email", "full_name", "password", "parent_pin", "child_name", "child_birth_year"]

    def create(self, validated_data):
        child_name = validated_data.pop("child_name")
        child_birth_year = validated_data.pop("child_birth_year")
        raw_pin = validated_data.pop("parent_pin")
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)
        user.set_parent_pin(raw_pin)
        user.save()

        ChildProfile.objects.create(
            parent=user, name=child_name, birth_year=child_birth_year
        )
        return user