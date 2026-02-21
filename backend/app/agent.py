from sqlalchemy.orm import Session
from datetime import datetime
from .models import Holding, StockSnapshot, AlertEvent
from .config import settings
from .sentiment import vader_score_0_100, llm_summarize
from .notify import notify_telegram
from .market import fetch_snapshot
from .polygon_client import fetch_ticker_news
from .reddit_client import fetch_reddit_mentions
from .content_pipeline import ingest_polygon_news, ingest_reddit, build_top_bullets
from .rules import get_or_create_rule, should_trigger

def compute_risk(change_pct_1d: float, sentiment: float, risk_pref: str) -> float:
    vol_component = min(5.0, abs(change_pct_1d) / 2.0)
    sentiment_component = min(5.0, max(0.0, (50.0 - sentiment) / 10.0))
    base = vol_component + sentiment_component
    if risk_pref == "conservative":
        base += 0.7
    elif risk_pref == "aggressive":
        base -= 0.4
    return float(max(0.0, min(10.0, base)))

async def run_agent_once(db: Session) -> int:
    holdings = db.query(Holding).all()
    count = 0
    for h in holdings:
        symbol = h.symbol.upper()
        
        # 1) 行情
        price, change_pct_1d, volume = await fetch_snapshot(symbol)
        
        # 2) 内容摄入
        try:
            news = await fetch_ticker_news(symbol, limit=settings.NEWS_LIMIT)
            ingest_polygon_news(db, h, news)
        except Exception:
            pass
        
        try:
            reddit_items = fetch_reddit_mentions(symbol, limit=settings.REDDIT_LIMIT)
            ingest_reddit(db, h, reddit_items)
        except Exception:
            pass
        
        # 3) 构建 Top bullets
        bullets = build_top_bullets(db, h, hours=48, limit=30)
        
        # 4) Sentiment
        sentiment = vader_score_0_100(bullets)
        
        # 5) Risk
        risk = compute_risk(change_pct_1d, sentiment, h.risk_pref)
        
        # 6) LLM 摘要
        summary = await llm_summarize(symbol, bullets)
        
        snap = StockSnapshot(
            holding_id=h.id,
            ts=datetime.utcnow(),
            price=price,
            change_pct_1d=change_pct_1d,
            volume=volume,
            sentiment_score=sentiment,
            risk_score=risk,
            summary=summary,
        )
        db.add(snap)
        db.commit()
        
        # 7) 规则触发
        rule = get_or_create_rule(db, h)
        hot_now = 0.0
        if bullets:
            try:
                hot_now = float(bullets[0].split("hot:")[1].split(")")[0])
            except Exception:
                hot_now = 0.0
        
        ok, reason = should_trigger(rule, risk, sentiment, hot_now, change_pct_1d)
        if ok:
            title = f"{symbol} alert ({reason})"
            detail = f"Risk={risk:.1f}/10, Sentiment={sentiment:.0f}/100, Hot={hot_now:.0f}, Change={change_pct_1d:.2f}%"
            alert = AlertEvent(holding_id=h.id, level="critical", title=title, detail=detail)
            db.add(alert)
            db.commit()
            await notify_telegram(f"[CRITICAL] {title} {detail}")
            count += 1
    return count
