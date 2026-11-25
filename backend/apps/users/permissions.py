from rest_framework.permissions import BasePermission
from apps.users.models import User, ChildProfile


class IsChildOwner(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        child_id = (
            request.headers.get("x-child-profile-id")
            or request.headers.get("X-Child-ID")
            or request.query_params.get("child_id")
        )
        if child_id:
            child = ChildProfile.objects.filter(id=child_id, parent=request.user).first()
        else:
            child = request.user.children.first()
        if not child:
            return False
        request.child_profile = child
        return True


class IsParentOrTeacher(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in [User.Role.PARENT, User.Role.TEACHER, User.Role.CURRICULUM_ADMIN]
        )


class IsTeacherRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in [User.Role.TEACHER, User.Role.CURRICULUM_ADMIN]
        )


class IsCurriculumAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == User.Role.CURRICULUM_ADMIN or request.user.is_staff)
        )