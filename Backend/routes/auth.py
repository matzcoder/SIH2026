"""
Authentication Router (/api/auth)
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.db_models import User
from models.schemas import (
    UserLogin,
    UserRegister,
    LoginResponse,
    RegisterResponse,
    UserProfile,
)
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)) -> LoginResponse:
    """Authenticate user with email and password, returning JWT token and profile."""
    email_clean = credentials.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact your administrator.",
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    profile = UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
    )

    return LoginResponse(token=token, user=profile)


@router.post("/register", response_model=RegisterResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)) -> RegisterResponse:
    """Register a new user account."""
    email_clean = user_data.email.strip().lower()
    existing = db.query(User).filter(User.email == email_clean).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    new_user = User(
        name=user_data.name.strip(),
        email=email_clean,
        password_hash=hash_password(user_data.password),
        role=user_data.role or "inspector",
        status="active",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    profile = UserProfile(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        status=new_user.status,
    )

    return RegisterResponse(
        success=True,
        message="Account successfully created.",
        token=token,
        user=profile,
    )


@router.get("/me", response_model=UserProfile)
def get_current_user_profile(current_user: User = Depends(get_current_user)) -> UserProfile:
    """Get profile of the currently logged-in user."""
    return UserProfile(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
    )


@router.post("/logout")
def logout() -> dict[str, str]:
    """Logout endpoint."""
    return {"status": "ok", "message": "Successfully logged out."}
