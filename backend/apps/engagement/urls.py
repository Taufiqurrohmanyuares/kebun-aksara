from django.urls import path
from .views import (
    ChildStreakAndHeartbeatView,
    ParentDashboardSummaryView,
    ParentMissionManageView,
    ParentSendCheerView,
)

urlpatterns = [
    path("child/status/", ChildStreakAndHeartbeatView.as_view()),
    path("parent/dashboard/<int:child_id>/", ParentDashboardSummaryView.as_view()),
    path("parent/dashboard/<int:child_id>/missions/", ParentMissionManageView.as_view()),
    path("parent/dashboard/<int:child_id>/missions/<int:mission_id>/complete/", ParentMissionManageView.as_view()),
    path("parent/dashboard/<int:child_id>/cheer/", ParentSendCheerView.as_view()),
]