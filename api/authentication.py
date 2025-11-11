from __future__ import annotations

from typing import Any, Optional, Tuple

from django.http import HttpRequest
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Member
from .security import jwt_decode


class AuthenticatedMember:
    """Lightweight wrapper so DRF treats the request as authenticated."""

    def __init__(self, member: Member):
        self._member = member
        # Expose common attributes directly for convenience
        self.id = getattr(member, "id", None)
        self.pk = getattr(member, "pk", None)
        self.email = getattr(member, "email", None)
        self.name = getattr(member, "name", None)

    @property
    def is_authenticated(self) -> bool:  # DRF checks this property
        return True

    @property
    def member(self) -> Member:
        return self._member

    def __str__(self) -> str:
        base = getattr(self._member, "name", None) or getattr(self._member, "email", None) or f"Member#{self.id}"
        return f"AuthenticatedMember({base})"


class MemberJWTAuthentication(BaseAuthentication):
    """
    DRF authentication class for Member via JWT in Authorization header.

    Expected header: `Authorization: Bearer <token>`
    """

    keyword = "Bearer"

    def authenticate(self, request: HttpRequest) -> Optional[Tuple[AuthenticatedMember, str]]:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            # No credentials provided. Return None to allow anonymous access where permitted.
            return None

        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != self.keyword.lower():
            raise AuthenticationFailed("Неверная схема авторизации. Используйте 'Bearer <token>'.")

        token = parts[1].strip()
        if not token:
            raise AuthenticationFailed("Токен отсутствует в заголовке Authorization.")

        try:
            payload = jwt_decode(token)
        except Exception as exc:  # PyJWT raises specific subclasses; we map all to a clear message
            raise AuthenticationFailed("Недействительный токен или истек срок его действия. Выполните вход снова.") from exc

        member_id = payload.get("member_id") or payload.get("sub")
        if member_id is None:
            raise AuthenticationFailed("Токен не содержит идентификатора пользователя (member_id или sub).")

        try:
            member = Member.objects.filter(id=member_id).first()
        except Exception as exc:
            raise AuthenticationFailed("Ошибка при загрузке пользователя.") from exc

        if not member:
            raise AuthenticationFailed("Пользователь не найден или был удалён.")

        user = AuthenticatedMember(member)
        # DRF expects (user, auth); auth may be token string or payload
        return user, token
