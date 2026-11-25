from django.urls import path
from apps.curriculum.views import (
    ChildMapView,
    NodeSessionView,
    SubmitAnswerView,
    CompleteNodeView,
    AdminCurriculumStudioView,
)

urlpatterns = [
    path("child/map/", ChildMapView.as_view(), name="child-map"),
    path("child/node/<int:node_id>/session/", NodeSessionView.as_view(), name="node-session"),
    path("child/submit-answer/", SubmitAnswerView.as_view(), name="submit-answer"),
    path("child/node/<int:node_id>/complete/", CompleteNodeView.as_view(), name="complete-node"),
    path("curriculum/studio/nodes/", AdminCurriculumStudioView.as_view(), name="curriculum-studio-nodes"),
]