from fastapi import APIRouter
from sqlalchemy.orm import Session
from ..db import get_db, SessionLocal
from ..models import DailyReport, User
from ..schemas import DailyReportOut

router = APIRouter(prefix="/api/daily", tags=["daily"])

@router.get("/reports", response_model=list[DailyReportOut])
def list_reports():
    db = SessionLocal()
    try:
        # 获取第一个用户的日报
        user = db.query(User).first()
        if not user:
            return []
        return (
            db.query(DailyReport)
            .filter(DailyReport.user_id == user.id)
            .order_by(DailyReport.date_yyyymmdd.desc())
            .limit(30)
            .all()
        )
    finally:
        db.close()
