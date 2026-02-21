from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db, SessionLocal
from ..models import Holding, StockSnapshot, AlertEvent
from ..schemas import SnapshotOut, AlertOut

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/stock/{symbol}/snapshots", response_model=list[SnapshotOut])
def snapshots(symbol: str):
    db = SessionLocal()
    try:
        sym = symbol.upper()
        # 获取第一个用户的第一个持仓（简化版，无需登录）
        h = db.query(Holding).filter(Holding.symbol == sym).first()
        if not h:
            return []
        return db.query(StockSnapshot).filter(StockSnapshot.holding_id == h.id).order_by(StockSnapshot.ts.desc()).limit(200).all()
    finally:
        db.close()

@router.get("/stock/{symbol}/alerts", response_model=list[AlertOut])
def alerts(symbol: str):
    db = SessionLocal()
    try:
        sym = symbol.upper()
        h = db.query(Holding).filter(Holding.symbol == sym).first()
        if not h:
            return []
        return db.query(AlertEvent).filter(AlertEvent.holding_id == h.id).order_by(AlertEvent.ts.desc()).limit(200).all()
    finally:
        db.close()
