from rest_framework.viewsets import ModelViewSet
from users.permissions import *
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import *
from api.serializers import *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db import IntegrityError
from django.db.models import Sum, F, Q, Avg, Count
from django.db.models.functions import TruncMonth
import calendar
import math

# ! Recommendation
import pandas as pd  # type: ignore

# from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from nltk.stem.porter import PorterStemmer  # type: ignore
from nltk.corpus import stopwords  # type: ignore
from sklearn.metrics.pairwise import cosine_similarity

ps = PorterStemmer()


def stem(text):
    y = []
    for i in text.split():
        y.append(ps.stem(i))

    return " ".join(y)


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                status=status.HTTP_409_CONFLICT, data={"detail": "Duplicate Entry."}
            )

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        if Course.objects.filter(category=category).exists():
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail": "Can't delete category with courses."},
            )

        return super().destroy(request, *args, **kwargs)

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

    def destroy(self, request, *args, **kwargs):
        course = self.get_object()
        if (
            Enrollment.objects.filter(course=course)
            .exclude(user=course.instructor)
            .exists()
        ):
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"detail": "Can't delete course with students enrolled."},
            )

        return super().destroy(request, *args, **kwargs)

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

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_all_courses(self, request):
        courses = Course.objects.all()
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

    @action(detail=False, methods=["GET"])
    # get student count for each course based on the course_id
    def get_student_count(self, request):
        course_id = request.query_params.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in query parameter."},
            )
        try:
            course = Course.objects.get(id=course_id)
            student_count = (
                Enrollment.objects.filter(course=course)
                .exclude(user=course.instructor)
                .count()
            )
            return Response({"student_count": student_count})
        except Course.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Course not found."}
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
        if (
            Enrollment.objects.filter(course=section.course)
            .exclude(user=section.course.instructor)
            .exists()
        ):
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

    @action(detail=False, methods=["PATCH"], permission_classes=[IsAuthenticated])
    def complete_payment(self, request):
        pidx = request.data.get("pidx")
        if not pidx:
            return Response(
                status=status.HTTP_409_CONFLICT,
                data={"detail": "pidx is required in the request body."},
            )

        try:
            payments = Payment.objects.filter(pidx=pidx)
            for payment in payments:
                payment.status = "completed"
                payment.save()

            return Response(
                status=status.HTTP_200_OK,
                data={"detail": "Payment completed."},
            )
        except Payment.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Payment with given pidx not found."},
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_details(self, request):
        months = {month: 0 for month in calendar.month_name if month}
        payments = (
            Payment.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(earning=Sum("amount"))
            .order_by("month")
        )

        for payment in payments:
            month_name = calendar.month_name[payment["month"].month]
            months[month_name] = payment["earning"]

        chart_data = [
            {"month": month, "earning": earning} for month, earning in months.items()
        ]

        return Response(chart_data)

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_earning_of_instructor(self, request):
        instructor_id = request.query_params.get("instructor_id")
        if not instructor_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "instructor_id required in query parameter."},
            )
        try:
            instructor = User.objects.get(id=instructor_id)
            total_earning = Payment.objects.filter(
                course__instructor=instructor
            ).aggregate(total_earning=Sum("amount"))
            return Response(
                {
                    "total_earning": total_earning["total_earning"] or 0.0,
                }
            )
        except User.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Instructor not found."},
            )

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_student_spending(self, request):
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "student_id required in query parameter."},
            )
        try:
            student = User.objects.get(id=student_id)
            total_spending = Payment.objects.filter(user=student).aggregate(
                total_spending=Sum("amount")
            )
            return Response(
                {
                    "total_spending": total_spending["total_spending"] or 0.0,
                }
            )
        except User.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"detail": "Student not found."},
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

    @action(detail=False, methods=["GET"])
    def get_review_detail(self, request):
        course_id = request.query_params.get("course_id")
        if not course_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "course_id required in query parameter."},
            )

        try:
            course = Course.objects.get(id=course_id)
            reviews = Review.objects.filter(course=course).exclude(
                user=course.instructor
            )
            avg_rating = reviews.aggregate(Avg("rating"))["rating__avg"]
            review_count = reviews.count()
            enrollment_count = course.enrollments.exclude(
                user=course.instructor
            ).count()

            return Response(
                data={
                    "average_rating": avg_rating,
                    "review_count": review_count,
                    "enrollment_count": enrollment_count,
                }
            )

        except Course.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"detail": "Course not found."}
            )


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

    @action(detail=False, methods=["GET"])
    def is_completed(self, request):
        section_id = request.query_params.get("section_id")
        if not section_id:
            return Response(
                status=status.HTTP_406_NOT_ACCEPTABLE,
                data={"detail": "section_id required in query parameter."},
            )
        try:
            progress = Progress.objects.get(section_id=section_id, user=request.user)
            return Response({"is_completed": progress.completed})
        except Progress.DoesNotExist:
            return Response({"is_completed": False})

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


# class RecommendedCourseViewSet(ModelViewSet):
#     queryset = Course.objects.select_related("instructor", "category").filter(
#         is_published=True
#     )
#     serializer_class = CourseListSerializer

#     def get_queryset(self):
#         current_slug = self.request.query_params.get("course", None)
#         if not current_slug:
#             return Course.objects.none()

#         courses = Course.objects.filter(is_published=True).values_list(
#             "id", "title", "description", "instructor", "category", "slug"
#         )
#         instructors = User.objects.values_list("id", "full_name")
#         categories = Category.objects.values_list("id", "name")

#         courses_df = pd.DataFrame(
#             courses,
#             columns=["id", "title", "description", "instructor", "category", "slug"],
#         )
#         instructors_df = pd.DataFrame(instructors, columns=["id", "full_name"])
#         categories_df = pd.DataFrame(categories, columns=["id", "name"])

#         instructors_df["full_name"] = instructors_df["full_name"].str.replace(" ", "")
#         categories_df["name"] = categories_df["name"].str.replace(" ", "")

#         courses_df["instructor"] = courses_df["instructor"].map(
#             dict(instructors_df.values.tolist())
#         )
#         courses_df["category"] = courses_df["category"].map(
#             dict(categories_df.values.tolist())
#         )

#         courses_df["tags"] = (
#             courses_df["title"]
#             + " "
#             + courses_df["description"]
#             + " "
#             + courses_df["instructor"]
#             + " "
#             + courses_df["category"]
#             + " "
#         )
#         courses_df["tags"] = courses_df["tags"].apply(stem)

#         cv = TfidfVectorizer(max_features=5000, stop_words="english")
#         vector = cv.fit_transform(courses_df["tags"]).toarray()
#         similarity = cosine_similarity(vector)

#         def recommend_courses(course_slug):
#             if course_slug not in courses_df["slug"].values:
#                 return []
#             course_index = courses_df[courses_df["slug"] == course_slug].index[0]
#             similar_courses = list(enumerate(similarity[course_index]))
#             sorted_similar_courses = sorted(
#                 similar_courses, key=lambda x: x[1], reverse=True
#             )
#             recommended_courses = []
#             for i in sorted_similar_courses[1:5]:
#                 recommended_courses.append(courses_df.iloc[i[0]]["title"])
#             return recommended_courses

#         recommended_courses = recommend_courses(current_slug)
#         if not recommended_courses:
#             return Course.objects.none()

#         queryset = Course.objects.filter(title__in=recommended_courses)
#         return queryset


class RecommendedCourseViewSet(ModelViewSet):
    queryset = Course.objects.select_related("instructor", "category").filter(
        is_published=True
    )
    serializer_class = CourseListSerializer

    def get_queryset(self):
        current_slug = self.request.query_params.get("course", None)
        if not current_slug:
            return Course.objects.none()

        courses = Course.objects.filter(is_published=True).values_list(
            "id", "title", "instructor", "category", "slug"
        )
        instructors = User.objects.values_list("id", "full_name")
        categories = Category.objects.values_list("id", "name")

        courses_df = pd.DataFrame(
            courses,
            columns=["id", "title", "instructor", "category", "slug"],
        )
        instructors_df = pd.DataFrame(instructors, columns=["id", "full_name"])
        categories_df = pd.DataFrame(categories, columns=["id", "name"])

        instructors_df["full_name"] = instructors_df["full_name"].str.replace(" ", "")
        categories_df["name"] = categories_df["name"].str.replace(" ", "")

        courses_df["instructor"] = courses_df["instructor"].map(
            dict(instructors_df.values.tolist())
        )
        courses_df["category"] = courses_df["category"].map(
            dict(categories_df.values.tolist())
        )

        stop_words = set(stopwords.words("english"))

        def remove_stopwords(text):
            return " ".join(
                word for word in text.lower().split() if word not in stop_words
            )

        courses_df["tags"] = (
            courses_df["title"]
            + " "
            + courses_df["instructor"]
            + " "
            + courses_df["category"]
        ).apply(remove_stopwords)

        # Compute TF for each document
        documents = [tags.split() for tags in courses_df["tags"]]
        tf_matrix = []

        for doc in documents:
            doc_tf = {}
            total_words = len(doc)
            for word in set(doc):
                doc_tf[word] = doc.count(word) / total_words
            tf_matrix.append(doc_tf)

        # Compute IDF
        unique_words = set(word for doc in documents for word in doc)
        num_documents = len(documents)
        idf = {}

        for word in unique_words:
            doc_count = sum(1 for doc in documents if word in doc)
            idf[word] = math.log(num_documents / doc_count)

        # Compute TF-IDF matrix
        tf_idf_matrix = []

        for tf_doc in tf_matrix:
            doc_tfidf = {}
            for word, tf in tf_doc.items():
                doc_tfidf[word] = tf * idf[word]
            tf_idf_matrix.append(doc_tfidf)

        # Organize TF-IDF values into a matrix form
        all_words = sorted(list(unique_words))
        matrix = []

        for doc_tfidf in tf_idf_matrix:
            row = []
            for word in all_words:
                if word in doc_tfidf:
                    row.append(doc_tfidf[word])
                else:
                    row.append(0.0)
            matrix.append(row)

        # Calculate cosine similarity among all documents in the matrix
        similarity_matrix = []

        def dot_product(v1, v2):
            return sum(x * y for x, y in zip(v1, v2))

        def magnitude(v):
            return math.sqrt(sum(x * x for x in v))

        def cosine_similarity(v1, v2):
            return dot_product(v1, v2) / (magnitude(v1) * magnitude(v2))

        # Compute similarity matrix
        for i in range(len(matrix)):
            row = []
            for j in range(len(matrix)):
                similarity = cosine_similarity(matrix[i], matrix[j])
                row.append(similarity)
            similarity_matrix.append(row)

        def recommend_courses(course_slug):
            if course_slug not in courses_df["slug"].values:
                return []
            course_index = courses_df[courses_df["slug"] == course_slug].index[0]
            similar_courses = list(enumerate(similarity_matrix[course_index]))
            sorted_similar_courses = sorted(
                similar_courses, key=lambda x: x[1], reverse=True
            )
            recommended_courses = []
            for i in sorted_similar_courses[1:5]:
                recommended_courses.append(courses_df.iloc[i[0]]["title"])
            return recommended_courses

        recommended_courses = recommend_courses(current_slug)
        if not recommended_courses:
            return Course.objects.none()

        queryset = Course.objects.filter(title__in=recommended_courses)
        return queryset


# ! Data for Admin Panel
class AdminPanelViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CourseListSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["GET"])
    def get_stats(self, request):
        total_users = User.objects.exclude(role="admin").count()
        total_instructors = User.objects.filter(role="instructor").count()
        total_students = User.objects.filter(role="student").count()
        total_courses = Course.objects.count()
        """
        the total number of enrollments in a course while excluding enrollments 
        where the user is both an instructor and enrolled in their own course.
        """
        total_enrollments = Enrollment.objects.exclude(
            Q(user__role="instructor") & Q(course__instructor=F("user"))
        ).count()
        total_payments = Payment.objects.aggregate(total_payments=Sum("amount"))[
            "total_payments"
        ]
        return Response(
            {
                "total_users": total_users,
                "total_instructors": total_instructors,
                "total_students": total_students,
                "total_courses": total_courses,
                "total_enrollments": total_enrollments,
                "total_payments": total_payments or 0.0,
            }
        )
