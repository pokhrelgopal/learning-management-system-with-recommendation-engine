from rest_framework import serializers
from api.models import *
from users.models import User
from users.serializers import UserListSerializer


class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    instructor = UserListSerializer(read_only=True)
    category = CategoryListSerializer(read_only=True)
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="instructor"),
        source="instructor",
        write_only=True,
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
    )
    sections = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "category",
            "category_id",
            "instructor",
            "instructor_id",
            "price",
            "thumbnail",
            "created_at",
            "updated_at",
            "is_published",
            "sections",
        ]

    def get_sections(self, obj):
        return SectionSerializer(obj.sections.all(), many=True).data


class CourseListSerializer(serializers.ModelSerializer):
    instructor = UserListSerializer(read_only=True)
    category = CategoryListSerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "instructor",
            "price",
            "thumbnail",
        ]


class CategorySerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "courses"]


class SectionSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    modules = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Section
        fields = [
            "id",
            "title",
            "order",
            "course_id",
            "created_at",
            "updated_at",
            "modules",
        ]

    def get_modules(self, obj):
        return ModuleSerializer(obj.modules.all(), many=True).data


class ModuleSerializer(serializers.ModelSerializer):
    section_id = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(), source="section", write_only=True
    )

    class Meta:
        model = Module
        fields = [
            "id",
            "title",
            "video",
            "order",
            "is_preview",
            "section_id",
            "created_at",
            "updated_at",
        ]


class CartSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="user", write_only=True
    )

    class Meta:
        model = Cart
        fields = ["id", "course", "course_id", "user_id"]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="user", write_only=True
    )

    class Meta:
        model = Enrollment
        fields = ["id", "course", "course_id", "user_id"]


class PaymentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source="course", write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="user", write_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "pidx",
            "course_id",
            "amount",
            "course",
            "user_id",
            "created_at",
        ]
