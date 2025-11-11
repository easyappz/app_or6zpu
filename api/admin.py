from django.contrib import admin

from .models import Member, Category, Ad, Favorite


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "created_at")
    search_fields = ("name", "email", "phone")
    list_filter = ("created_at",)

    def get_readonly_fields(self, request, obj=None):
        # Make email read-only on edit, but editable on create; created_at is always read-only
        if obj:
            return ("email", "created_at")
        return ("created_at",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")
    list_filter = ("parent",)


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "owner", "price", "created_at")
    list_filter = ("category", "owner", "created_at")
    search_fields = ("title", "description")


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("member", "ad")
    list_filter = ("member", "ad")
