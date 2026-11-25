from django.urls import path
from apps.users.views import (
    RegisterView,
    LoginView,
    VerifyParentPinView,
    ChildProfileListCreateView,
    JoinClassroomView,
    TeacherClassroomView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("parent/verify-pin/", VerifyParentPinView.as_view(), name="verify-parent-pin"),
    path("parent/children/", ChildProfileListCreateView.as_view(), name="parent-children"),
    path("parent/children/<int:child_id>/join-class/", JoinClassroomView.as_view(), name="join-classroom"),
    path("teacher/classrooms/", TeacherClassroomView.as_view(), name="teacher-classrooms"),
]