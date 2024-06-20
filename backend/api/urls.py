from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"courses", CourseViewSet, basename="courses")
router.register(r"sections", SectionViewSet, basename="sections")
router.register(r"modules", ModuleViewSet, basename="modules")
router.register(r"carts", CartViewSet, basename="carts")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")

urlpatterns = []

urlpatterns += router.urls
