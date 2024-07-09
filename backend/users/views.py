from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import CustomPermission
from rest_framework.permissions import IsAdminUser
from users.serializers import UserSerializer
from rest_framework import status
from users.models import User
from django.db.models import Sum


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = []
        elif self.action == "list":
            self.permission_classes = [IsAdminUser]
        elif self.action in ["retrieve", "update", "destroy"]:
            self.permission_classes = [CustomPermission]
        return super().get_permissions()

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        if request.user.is_superuser or request.user == user:
            return super().retrieve(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN, data={"detail": "Forbidden"})

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if not request.user.is_superuser:
            if "is_staff" in request.data or "is_superuser" in request.data:
                raise PermissionDenied(
                    "You do not have permission to modify these fields."
                )
        if request.user.is_superuser or request.user == user:
            return super().update(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN, data={"detail": "Forbidden"})

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if request.user.is_superuser or request.user == user:
            return super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN, data={"detail": "Forbidden"})

    @action(detail=False, methods=["GET"])
    # ! This is a custom action that returns a user by email
    def get_user_by_email(self, request):

        email = request.query_params.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            return Response(UserSerializer(user).data)
        return Response(
            status=status.HTTP_404_NOT_FOUND, data={"detail": "User not found"}
        )

    @action(detail=False, methods=["GET"], permission_classes=[IsAuthenticated])
    # ! This is a custom action that returns the current user
    def get_user(self, request):
        return Response(UserSerializer(request.user).data)

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_students(self, request):
        students = User.objects.filter(role="student")
        return Response(UserSerializer(students, many=True).data)

    @action(detail=False, methods=["GET"], permission_classes=[IsAdminUser])
    def get_instructors(self, request):
        from api.models import Payment

        instructors = User.objects.filter(role="instructor")
        for instructor in instructors:
            total_earning = Payment.objects.filter(
                course__instructor=instructor
            ).aggregate(total_earning=Sum("amount"))["total_earning"]
            instructor.total_earning = total_earning if total_earning else 0
        instructors = sorted(instructors, key=lambda x: x.total_earning, reverse=True)
        return Response(UserSerializer(instructors, many=True).data)
