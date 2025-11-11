from typing import Any, Dict, Optional

from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers

from .models import Ad, Category, Favorite, Member


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


# --------------------
# Member serializers
# --------------------
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "avatar_url",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class MemberUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["name", "phone", "avatar_url"]

    def validate_phone(self, value: str) -> str:
        member: Optional[Member] = self.instance
        qs = Member.objects.filter(phone=value)
        if member is not None:
            qs = qs.exclude(pk=member.pk)
        if qs.exists():
            raise serializers.ValidationError("Пользователь с таким телефоном уже существует.")
        return value


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120, error_messages={
        "blank": "Имя не может быть пустым.",
        "required": "Поле 'name' обязательно.",
    })
    email = serializers.EmailField(error_messages={
        "invalid": "Введите корректный email.",
        "blank": "Email не может быть пустым.",
        "required": "Поле 'email' обязательно.",
    })
    phone = serializers.CharField(max_length=32, error_messages={
        "blank": "Телефон не может быть пустым.",
        "required": "Поле 'phone' обязательно.",
    })
    password = serializers.CharField(write_only=True, min_length=6, error_messages={
        "blank": "Пароль не может быть пустым.",
        "required": "Поле 'password' обязательно.",
        "min_length": "Минимальная длина пароля: 6 символов.",
    })

    def validate_email(self, value: str) -> str:
        if Member.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def validate_phone(self, value: str) -> str:
        if Member.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Пользователь с таким телефоном уже существует.")
        return value

    def create(self, validated_data: Dict[str, Any]) -> Member:
        password = validated_data.pop("password")
        member = Member(**validated_data)
        member.password_hash = make_password(password)
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={
        "invalid": "Введите корректный email.",
        "blank": "Email не может быть пустым.",
        "required": "Поле 'email' обязательно.",
    })
    password = serializers.CharField(write_only=True, error_messages={
        "blank": "Пароль не может быть пустым.",
        "required": "Поле 'password' обязательно.",
    })

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        email = attrs.get("email")
        password = attrs.get("password")
        try:
            member = Member.objects.get(email=email)
        except Member.DoesNotExist:
            raise serializers.ValidationError("Неверный email или пароль.")

        if not check_password(password, member.password_hash):
            raise serializers.ValidationError("Неверный email или пароль.")

        attrs["member"] = member
        return attrs


# --------------------
# Category serializers
# --------------------
class CategorySerializer(serializers.ModelSerializer):
    parent_id = serializers.IntegerField(source="parent_id", read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent_id"]
        read_only_fields = ["id", "parent_id"]


# --------------------
# Ad serializers
# --------------------
class AdSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(source="owner_id", read_only=True)
    category_id = serializers.IntegerField(source="category_id", read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = [
            "id",
            "title",
            "description",
            "price",
            "photos",
            "location",
            "contact",
            "condition",
            "category_id",
            "owner_id",
            "is_favorite",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner_id",
            "category_id",
            "is_favorite",
            "created_at",
            "updated_at",
        ]

    def get_is_favorite(self, obj: Ad) -> bool:
        request = self.context.get("request")
        if not request:
            return False
        user = getattr(request, "user", None)
        member = getattr(user, "member", None)
        if not member:
            return False
        return Favorite.objects.filter(member_id=member.id, ad_id=obj.id).exists()


class AdCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", error_messages={
            "does_not_exist": "Указанная категория не найдена.",
            "required": "Поле 'category_id' обязательно.",
        }
    )

    class Meta:
        model = Ad
        fields = [
            "title",
            "description",
            "price",
            "photos",
            "location",
            "contact",
            "condition",
            "category_id",
        ]

    def validate_price(self, value):
        if value is None:
            raise serializers.ValidationError("Цена обязательна для заполнения.")
        if value < 0:
            raise serializers.ValidationError("Цена не может быть отрицательной.")
        return value

    def validate_photos(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("Поле 'photos' должно быть списком строк (URL).")
        for idx, item in enumerate(value):
            if not isinstance(item, str) or not item:
                raise serializers.ValidationError(f"Элемент photos[{idx}] должен быть непустой строкой.")
        return value
