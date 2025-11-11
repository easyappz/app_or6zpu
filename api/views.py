from datetime import datetime, timedelta, time
from decimal import Decimal, InvalidOperation

import jwt
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.decorators import action

from .models import Ad, Category, Favorite, Member
from .serializers import (
    AdCreateUpdateSerializer,
    AdSerializer,
    CategorySerializer,
    LoginSerializer,
    MemberSerializer,
    MemberUpdateSerializer,
    MessageSerializer,
    RegisterSerializer,
)
from .pagination import DefaultPageNumberPagination


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


# --------------------
# Auth
# --------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Регистрация успешна"}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member: Member = serializer.validated_data["member"]

        ttl = getattr(settings, "JWT_ACCESS_TTL_SECONDS", 60 * 60 * 24 * 7)
        exp_dt = timezone.now() + timedelta(seconds=ttl)
        payload = {
            "sub": member.id,
            "email": member.email,
            "type": "access",
            "exp": exp_dt,
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=getattr(settings, "JWT_ALGORITHM", "HS256"))
        return Response(
            {"access": token, "token_type": "bearer", "expires_in": ttl},
            status=status.HTTP_200_OK,
        )


# --------------------
# Members
# --------------------
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        member: Member = request.user.member  # type: ignore[attr-defined]
        return Response(MemberSerializer(member).data)

    def put(self, request):
        member: Member = request.user.member  # type: ignore[attr-defined]
        serializer = MemberUpdateSerializer(instance=member, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MemberSerializer(member).data)


# --------------------
# Categories
# --------------------
class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# --------------------
# Ads
# --------------------
class AdViewSet(ModelViewSet):
    queryset = Ad.objects.select_related("owner", "category").all()
    permission_classes = [AllowAny]
    pagination_class = DefaultPageNumberPagination

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return AdCreateUpdateSerializer
        return AdSerializer

    # Public list with filters and ordering
    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()

        # Filters
        category_id = request.query_params.get("category_id")
        price_min = request.query_params.get("price_min")
        price_max = request.query_params.get("price_max")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        location = request.query_params.get("location")
        q = request.query_params.get("q")
        ordering = request.query_params.get("ordering", "-created_at")

        if category_id:
            try:
                qs = qs.filter(category_id=int(category_id))
            except ValueError:
                pass

        if price_min:
            try:
                qs = qs.filter(price__gte=Decimal(price_min))
            except (InvalidOperation, ValueError):
                pass

        if price_max:
            try:
                qs = qs.filter(price__lte=Decimal(price_max))
            except (InvalidOperation, ValueError):
                pass

        if date_from:
            try:
                df = datetime.fromisoformat(date_from).date()
                start_dt = timezone.make_aware(datetime.combine(df, time.min))
                qs = qs.filter(created_at__gte=start_dt)
            except Exception:
                pass

        if date_to:
            try:
                dt_ = datetime.fromisoformat(date_to).date()
                end_dt = timezone.make_aware(datetime.combine(dt_, time.max))
                qs = qs.filter(created_at__lte=end_dt)
            except Exception:
                pass

        if location:
            qs = qs.filter(location__icontains=location)

        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))

        allowed_ordering = {"-created_at", "created_at", "price", "-price"}
        if ordering in allowed_ordering:
            qs = qs.order_by(ordering)
        else:
            qs = qs.order_by("-created_at")

        page = self.paginate_queryset(qs)
        serializer = AdSerializer(page, many=True, context={"request": request})
        return self.get_paginated_response(serializer.data)

    # Public retrieve
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AdSerializer(instance, context={"request": request})
        return Response(serializer.data)

    # Secured create
    def create(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        serializer = AdCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ad: Ad = serializer.save(owner=request.user.member)  # type: ignore[attr-defined]
        out = AdSerializer(ad, context={"request": request})
        return Response(out.data, status=status.HTTP_201_CREATED)

    # Secured update (owner only)
    def update(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        instance: Ad = self.get_object()
        member: Member = request.user.member  # type: ignore[attr-defined]
        if instance.owner_id != member.id:
            return Response({"detail": "Нет прав"}, status=status.HTTP_403_FORBIDDEN)
        serializer = AdCreateUpdateSerializer(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        ad = serializer.save()
        out = AdSerializer(ad, context={"request": request})
        return Response(out.data)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        instance: Ad = self.get_object()
        member: Member = request.user.member  # type: ignore[attr-defined]
        if instance.owner_id != member.id:
            return Response({"detail": "Нет прав"}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post", "delete"], url_path="favorite", permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):  # type: ignore[override]
        ad = self.get_object()
        member: Member = request.user.member  # type: ignore[attr-defined]
        if request.method.lower() == "post":
            Favorite.objects.get_or_create(member=member, ad=ad)
            return Response(status=status.HTTP_204_NO_CONTENT)
        # DELETE
        Favorite.objects.filter(member=member, ad=ad).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --------------------
# My lists
# --------------------
class MyAdsListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPageNumberPagination

    def get(self, request):
        member: Member = request.user.member  # type: ignore[attr-defined]
        qs = Ad.objects.filter(owner_id=member.id).order_by("-created_at")
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(qs, request)
        serializer = AdSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)


class MyFavoritesListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPageNumberPagination

    def get(self, request):
        member: Member = request.user.member  # type: ignore[attr-defined]
        qs = (
            Ad.objects.select_related("owner", "category")
            .filter(favorites__member_id=member.id)
            .order_by("-created_at")
        )
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(qs, request)
        serializer = AdSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)
