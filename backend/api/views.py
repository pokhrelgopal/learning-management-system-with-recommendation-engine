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


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_serializer(self, *args, **kwargs):
        if self.action == "list":
            return CategoryListSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.select_related("instructor", "category").filter(
        is_published=True
    )
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title"]
    permission_classes = [CustomPermission]
    lookup_field = "slug"

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
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class SectionViewSet(ModelViewSet):
    queryset = Section.objects.all().select_related("course")
    serializer_class = SectionSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

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
            print(course_id, user)
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
