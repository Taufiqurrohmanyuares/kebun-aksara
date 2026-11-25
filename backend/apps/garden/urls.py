from django.urls import path
from .views import ChildGardenView, OpenMysteryChestView, AlbumCatalogView

urlpatterns = [
    path("child/garden/", ChildGardenView.as_view()),
    path("child/open-chest/", OpenMysteryChestView.as_view()),
    path("child/album/", AlbumCatalogView.as_view()),
]