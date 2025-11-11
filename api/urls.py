from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdViewSet,
    CategoryViewSet,
    HelloView,
    LoginView,
    MeView,
    MyAdsListView,
    MyFavoritesListView,
    RegisterView,
)

# Ensure router paths have no trailing slash to match openapi.yml
router = DefaultRouter(trailing_slash="")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"ads", AdViewSet, basename="ad")

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    # Auth
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    # Me
    path("members/me", MeView.as_view(), name="me"),
    path("members/me/ads", MyAdsListView.as_view(), name="me-ads"),
    path("members/me/favorites", MyFavoritesListView.as_view(), name="me-favorites"),
    # Routers
    path("", include(router.urls)),
]
