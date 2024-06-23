from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"courses", CourseViewSet, basename="courses")
router.register(r"sections", SectionViewSet, basename="sections")
router.register(r"carts", CartViewSet, basename="carts")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")
router.register(r"reviews", ReviewViewSet, basename="reviews")
router.register(r"discussions", DiscussionViewSet, basename="discussions")
router.register(r"replies", ReplyViewSet, basename="replies")
router.register(r"progress", ProgressViewSet, basename="progress")
router.register(r"attachments", AttachmentViewSet, basename="attachments")
router.register(r"certificates", CertificateViewSet, basename="notifications")
router.register(r"recommendation", RecommendedCourseViewSet, basename="recommendation")

urlpatterns = []

urlpatterns += router.urls
