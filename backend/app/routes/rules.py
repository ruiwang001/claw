from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db, SessionLocal
from ..models import Holding
from ..schemas import TriggerRuleOut, TriggerRuleUpdate
from ..rules import get_or_create_rule

router = APIRouter(prefix="/api/rules", tags=["rules"])

@router.get("/stock/{symbol}", response_model=TriggerRuleOut)
def get_rule(symbol: str):
    db = SessionLocal()
    try:
        sym = symbol.upper()
        h = db.query(Holding).filter(Holding.symbol == sym).first()
        if not h:
            raise HTTPException(status_code=404, detail="Holding not found")
        rule = get_or_create_rule(db, h)
        return rule
    finally:
        db.close()

@router.patch("/stock/{symbol}", response_model=TriggerRuleOut)
def update_rule(symbol: str, payload: TriggerRuleUpdate):
    db = SessionLocal()
    try:
        sym = symbol.upper()
        h = db.query(Holding).filter(Holding.symbol == sym).first()
        if not h:
            raise HTTPException(status_code=404, detail="Holding not found")
        rule = get_or_create_rule(db, h)
        for k, v in payload.model_dump(exclude_unset=True).items():
            setattr(rule, k, v)
        db.commit()
        db.refresh(rule)
        return rule
    finally:
        db.close()
