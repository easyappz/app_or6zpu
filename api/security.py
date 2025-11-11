from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import jwt
from django.contrib.auth.hashers import check_password, make_password

# Hardcoded JWT secret for the project. Do NOT use in production.
SECRET_KEY: str = "easyappz_hardcoded_jwt_secret_2025_11_11_do_not_use_in_production"
ALGORITHM: str = "HS256"
ISSUER: str = "easyappz-api"


def hash_password(raw_password: str) -> str:
    """Return a Django-hashed password string."""
    return make_password(raw_password)


def verify_password(raw_password: str, hashed_password: str) -> bool:
    """Verify a raw password against a Django-hashed password string."""
    return check_password(raw_password, hashed_password)


def jwt_encode(payload: Dict[str, Any], expires_minutes: int = 60) -> str:
    """
    Encode a JWT with an expiration using a hardcoded SECRET_KEY.

    Args:
        payload: Custom payload to include in the token (must be JSON-serializable).
        expires_minutes: Minutes until the token expires.

    Returns:
        Encoded JWT as a string.
    """
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=expires_minutes)

    full_payload = {
        **payload,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "iss": ISSUER,
    }
    token: str = jwt.encode(full_payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def jwt_decode(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT token using the hardcoded SECRET_KEY.

    Raises jwt.ExpiredSignatureError, jwt.InvalidTokenError on failure.
    """
    data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"require": ["exp", "iat"]}, issuer=ISSUER)
    return data
