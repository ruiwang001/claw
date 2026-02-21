from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from .models import User, Holding, StockSnapshot, DailyReport
from .sentiment import llm_summarize
from .notify import notify_telegram

def _today_yyyymmdd() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")

async def run_daily_reports(db: Session) -> int:
    users = db.query(User).all()
    day = _today_yyyymmdd()
    created = 0
    for u in users:
        exists = db.query(DailyReport).filter(DailyReport.user_id == u.id, DailyReport.date_yyyymmdd == day).first()
        if exists:
            continue
        holdings = db.query(Holding).filter(Holding.user_id == u.id).all()
        blocks = []
        for h in holdings:
            since = datetime.utcnow() - timedelta(hours=24)
            snap = (
                db.query(StockSnapshot)
                .filter(StockSnapshot.holding_id == h.id, StockSnapshot.ts >= since)
                .order_by(StockSnapshot.ts.desc())
                .first()
            )
            if not snap:
                continue
            blocks.append(f"{h.symbol}: price ${snap.price:.2f}, risk {snap.risk_score:.1f}/10, sentiment {snap.sentiment_score:.0f}/100")
        if not blocks:
            content = "No snapshots today. Agent may not have run yet."
        else:
            summary = await llm_summarize("PORTFOLIO", blocks)
            content = summary or ("Daily Brief: " + " ".join(["- " + b for b in blocks]))
        r = DailyReport(user_id=u.id, date_yyyymmdd=day, content=content)
        db.add(r)
        db.commit()
        db.refresh(r)
        created += 1
        await notify_telegram(f"[Daily Report {day}] {u.email} {content[:3500]}")
    return created
