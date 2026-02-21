from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from ..db import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, Token
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    u = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == form.username).first()
    if not u or not verify_password(form.password, u.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(u.email)
    return Token(access_token=token)

@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
