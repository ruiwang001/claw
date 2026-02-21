from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db, SessionLocal
from ..models import Holding, User
from ..schemas import HoldingCreate, HoldingOut
from ..auth import hash_password

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

def get_or_create_default_user():
    """获取或创建默认用户（无需登录）"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "default@user.com").first()
        if not user:
            user = User(email="default@user.com", password_hash=hash_password("def"))
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    finally:
        db.close()

@router.get("/holdings", response_model=list[HoldingOut])
def list_holdings():
    db = SessionLocal()
    try:
        user = get_or_create_default_user()
        return db.query(Holding).filter(Holding.user_id == user.id).order_by(Holding.created_at.desc()).all()
    finally:
        db.close()

@router.post("/holdings", response_model=HoldingOut)
def add_holding(payload: HoldingCreate):
    db = SessionLocal()
    try:
        user = get_or_create_default_user()
        symbol = payload.symbol.strip().upper()
        if not symbol.isalnum():
            raise HTTPException(status_code=400, detail="Invalid symbol")
        existing = db.query(Holding).filter(Holding.user_id == user.id, Holding.symbol == symbol).first()
        if existing:
            raise HTTPException(status_code=400, detail="Already added")
        h = Holding(
            user_id=user.id,
            symbol=symbol,
            name=payload.name,
            shares=payload.shares,
            cost_basis=payload.cost_basis,
            risk_pref=payload.risk_pref,
        )
        db.add(h)
        db.commit()
        db.refresh(h)
        return h
    finally:
        db.close()

@router.delete("/holdings/{holding_id}")
def delete_holding(holding_id: int):
    db = SessionLocal()
    try:
        user = get_or_create_default_user()
        h = db.query(Holding).filter(Holding.id == holding_id, Holding.user_id == user.id).first()
        if not h:
            raise HTTPException(status_code=404, detail="Not found")
        db.delete(h)
        db.commit()
        return {"ok": True}
    finally:
        db.close()
