from rest_framework.viewsets import ModelViewSet
from users.permissions import *
from django.db.models import Q
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import *
from api.serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db import IntegrityError
from django.db.models import Sum


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_serializer(self, *args, **kwargs):
        if self.action == "list":
            return CategoryListSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.select_related("instructor", "category").filter()
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]
    permission_classes = [CustomPermission]
    lookup_field = "slug"

    def create(self, request, *args, **kwargs):
        try:
            if not request.user.role == "instructor":
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={"detail": "You are not an instructor."},
                )
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    def update(self, request, *args, **kwargs):
        if request.data.get("is_published") == False:
            course = Course.objects.get(slug=kwargs["slug"])
            if (
                Enrollment.objects.filter(course=course)
                .exclude(user=request.user)
                .exists()
            ):
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={"detail": "Can't unpublish course with students enrolled."},
                )
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    # ! This is a custom action that returns published courses
    def get_published_courses(self, request):
        courses = Course.objects.filter(is_published=True)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["GET"])
    # ! This is a custom action that returns courses of a specific teacher
    def get_my_courses(self, request):
        if not request.user.role == "instructor":
            return Response(
                status=status.HTTP_403_FORBIDDEN, data={"detail": "Forbidden"}
            )
        courses = Course.objects.filter(instructor=request.user)
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["GET"])
    def get_stats(self, request):
        if not request.user.role == "instructor":
            return Response(
                status=status.HTTP_403_FORBIDDEN, data={"detail": "Forbidden"}
            )
        courses = Course.objects.filter(instructor=request.user).count()
        published_courses = Course.objects.filter(
            instructor=request.user, is_published=True
        ).count()
        students = (
            Enrollment.objects.filter(course__instructor=request.user)
            .exclude(user=request.user)
            .count()
        )
        total_earning = Payment.objects.filter(
            course__instructor=request.user
        ).aggregate(total_earning=Sum("amount"))
        return Response(
            {
                "courses": courses,
                "published_courses": published_courses,
                "students": students,
                "income": total_earning["total_earning"] or 0.0,
            }
        )


class SectionViewSet(ModelViewSet):
    queryset = Section.objects.all().select_related("course")
    serializer_class = SectionSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def destroy(self, request, *args, **kwargs):
        section = self.get_object()
        if Enrollment.objects.filter(course=section.course).exists():
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail": "Can't delete section with students enrolled."},
            )

        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["GET"], permission_classes=[])
    def get_preview(self, request):
        course_id = request.query_params.get("course_id")
        course = Course.objects.get(id=course_id)
        modules = Section.objects.filter(course=course, is_free=True)
        serializer = SectionSerializer(modules, many=True)
        return Response(serializer.data)


class CartViewSet(ModelViewSet):
    queryset = Cart.objects.all().select_related("course")
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in request body."},
            )
        try:
            user = request.user
            course = Course.objects.get(id=course_id)
            if Enrollment.objects.filter(user=user, course=course).exists():
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={"detail": "Already Enrolled."},
                )
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    def get_permissions(self):
        if self.action == "list":
            self.permission_classes = [IsAdminUser]
        elif self.action in ["retrieve", "update", "destroy"]:
            self.permission_classes = [CustomPermission]
        return super().get_permissions()

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def my_cart(self, request):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        cart = Cart.objects.filter(user=request.user).select_related("course")
        serializer = CartSerializer(cart, many=True)
        return Response(serializer.data)


class PaymentViewSet(ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )


class EnrollmentViewSet(ModelViewSet):
    queryset = Enrollment.objects.all().select_related("course")
    serializer_class = EnrollmentSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def my_enrollments(self, request):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        enrollments = Enrollment.objects.filter(user=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def enrollment_check(self, request):
        course_id = request.query_params.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in query parameter."},
            )
        try:
            course = Course.objects.get(id=course_id)
            enrollment = Enrollment.objects.filter(
                Q(user=request.user) & Q(course=course)
            ).exists()
            return Response({"enrolled": enrollment})
        except Course.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Course not found."}
            )


class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all().select_related("course", "user")
    serializer_class = ReviewSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            course_id = request.data.get("course_id")
            if not course_id:
                return Response(
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                    data={"detail": "course_id required in request body."},
                )
            user = request.user
            course = Course.objects.get(id=course_id)

            if not Enrollment.objects.filter(user=user, course=course).exists():
                return Response(
                    status=status.HTTP_403_FORBIDDEN,
                    data={"detail": "Not Enrolled."},
                )

            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def my_reviews(self, request):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        reviews = Review.objects.filter(user=request.user)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class DiscussionViewSet(ModelViewSet):
    queryset = Discussion.objects.all().select_related("user", "section")
    serializer_class = DiscussionSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def get_section_discussions(self, section):
        section_id = section.query_params.get("section_id")
        if not section_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "section_id required in query parameter."},
            )
        try:
            discussions = Discussion.objects.filter(
                section__id=section_id
            ).select_related("user")
            serializer = DiscussionSerializer(discussions, many=True)
            return Response(serializer.data)
        except Discussion.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Section not found."}
            )


class ReplyViewSet(ModelViewSet):
    queryset = Reply.objects.all().select_related("user", "discussion")
    serializer_class = ReplySerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )


class ProgressViewSet(ModelViewSet):
    queryset = Progress.objects.all().select_related("section", "user")
    serializer_class = ProgressSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def get_course_progress(self, request):
        course_id = request.query_params.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in query parameter."},
            )
        try:
            completed_sections = Progress.objects.filter(
                Q(user=request.user)
                & Q(section__course__id=course_id)
                & Q(completed=True)
            ).count()
            total_sections = Section.objects.filter(course__id=course_id).count()
            completed_percentage = (completed_sections / total_sections) * 100
            return Response(
                {
                    "completed_percentage": completed_percentage,
                }
            )
        except Course.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Course not found."}
            )


class AttachmentViewSet(ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )


class CertificateViewSet(ModelViewSet):
    queryset = Certificate.objects.all().select_related("user", "course")
    serializer_class = CertificateSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAdminUser]
        elif self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    def get_certificate(self, request):
        course_id = request.query_params.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in query parameter."},
            )
        # ! Check if the user is enrolled in the course

        if not Enrollment.objects.filter(
            Q(user=request.user) & Q(course__id=course_id)
        ).exists():
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail": "Not Enrolled in the course."},
            )

        try:
            certificate = Certificate.objects.get(
                Q(user=request.user) & Q(course__id=course_id)
            )
            serializer = CertificateSerializer(certificate)
            return Response(serializer.data)
        except Certificate.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Certificate not found."},
            )
        except Course.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Course not found."}
            )
