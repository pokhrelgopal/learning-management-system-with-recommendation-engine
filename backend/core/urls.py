from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

v = settings.API_VERSION

urlpatterns = [
    path("admin/", admin.site.urls),
    path(f"api/{v}/user/", include("users.urls")),
    path(f"api/{v}/", include("api.urls")),
    path("", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
