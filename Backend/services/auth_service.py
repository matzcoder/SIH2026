"""
Authentication service: Password hashing, JWT token handling, and auth dependencies.
"""
from __future__ import annotations

import hashlib
import hmac
import os
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES
from database import get_db
from models.db_models import User

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Create a secure salted SHA-256 hash of the password."""
    salt = os.urandom(16).hex()
    hash_obj = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,
    )
    return f"{salt}${hash_obj.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored salted hash (with legacy plain fallback for demo accounts)."""
    if not hashed_password:
        return False
    
    # Check if format is salt$hex
    if "$" in hashed_password:
        try:
            salt, stored_hash = hashed_password.split("$", 1)
            hash_obj = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                100000,
            )
            return hmac.compare_digest(hash_obj.hex(), stored_hash)
        except Exception:
            return False

    # Fallback for plain demo passwords
    return plain_password == hashed_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Encode user information into a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None


def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Dependency that returns the authenticated User if valid token is provided, or None."""
    if not auth or not auth.credentials:
        return None
    
    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        return None
    
    user_id = payload.get("sub")
    try:
        user_id_int = int(user_id)
        user = db.query(User).filter(User.id == user_id_int).first()
        return user
    except (ValueError, TypeError):
        # Email as sub fallback
        user = db.query(User).filter(User.email == str(user_id)).first()
        return user


def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_optional),
) -> User:
    """Dependency that enforces a valid authenticated user."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided or have expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


def require_role(allowed_roles: List[str]):
    """Decorator / dependency factory ensuring the user has one of the allowed roles."""
    def role_checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {allowed_roles}",
            )
        return user
    return role_checker
