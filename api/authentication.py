from typing import Optional, Tuple

import jwt
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header

from .models import Member


class AuthUser:
    """Lightweight wrapper for Member to satisfy DRF's user interface."""

    def __init__(self, member: Member) -> None:
        self.member = member
        self.id = member.id
        self.email = member.email

    @property
    def is_authenticated(self) -> bool:  # type: ignore[override]
        return True

    def __str__(self) -> str:
        return f"AuthUser(member_id={self.id})"


class MemberJWTAuthentication(BaseAuthentication):
    keyword = b"bearer"

    def authenticate(self, request) -> Optional[Tuple[AuthUser, str]]:  # type: ignore[override]
        auth = get_authorization_header(request).split()
        if not auth:
            return None

        if len(auth) != 2 or auth[0].lower() != self.keyword:
            raise exceptions.AuthenticationFailed("Invalid Authorization header.")

        token = auth[1].decode("utf-8")
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[getattr(settings, "JWT_ALGORITHM", "HS256")])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired.")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token.")

        if payload.get("type") != "access":
            raise exceptions.AuthenticationFailed("Invalid token type.")

        member_id = payload.get("sub")
        if not member_id:
            raise exceptions.AuthenticationFailed("Invalid token payload.")

        try:
            member = Member.objects.get(pk=member_id)
        except Member.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found.")

        return AuthUser(member), token
