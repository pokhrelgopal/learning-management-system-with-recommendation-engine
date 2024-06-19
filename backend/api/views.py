import rest_framework.permissions
from rest_framework.viewsets import ModelViewSet
from users.permissions import *
from django.db.models import Q
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Course, Category
from api.serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_serializer(self, *args, **kwargs):
        if self.action == "list":
            return CategoryListSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.select_related("instructor", "category").all()
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
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class ModuleViewSet(ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [CustomPermission]

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
