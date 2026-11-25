from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

def api_root(request):
    return JsonResponse({
        "status": "success",
        "service": "Kebun Aksara REST API v1",
        "endpoints": "/api/v1/",
    })

urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.users.urls")),
    path("api/v1/", include("apps.curriculum.urls")),
    path("api/v1/", include("apps.garden.urls")),
    path("api/v1/", include("apps.engagement.urls")),
]