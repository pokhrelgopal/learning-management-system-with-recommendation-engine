from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"courses", CourseViewSet, basename="courses")
router.register(r"sections", SectionViewSet, basename="sections")
router.register(r"modules", ModuleViewSet, basename="modules")

urlpatterns = []

urlpatterns += router.urls
