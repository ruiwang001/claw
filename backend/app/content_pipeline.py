from datetime import datetime, timezone
from sqlalchemy.orm import Session
from .models import Holding, ContentItem
from .sentiment import vader_score_0_100
from .scoring import sha256_key, hot_score_news, hot_score_reddit, ensure_utc

NEWS_PUBLISHER_WEIGHT = {
    "Bloomberg": 1.0,
    "Reuters": 1.0,
    "The Wall Street Journal": 1.0,
    "CNBC": 0.9,
    "MarketWatch": 0.8,
}

def publisher_weight(name: str | None) -> float:
    if not name:
        return 0.7
    return NEWS_PUBLISHER_WEIGHT.get(name, 0.75)

def upsert_dedup_content(
    db: Session, holding: Holding, source: str, title: str, ts: datetime, url: str | None, hot_score: float,
) -> ContentItem | None:
    key = sha256_key(source, title[:220], url or "")
    existing = db.query(ContentItem).filter(
        ContentItem.holding_id == holding.id,
        ContentItem.dedupe_key == key,
    ).first()
    now = datetime.now(timezone.utc)
    ts = ensure_utc(ts)
    sentiment = vader_score_0_100([title])
    if existing:
        if hot_score > existing.hot_score or ts > existing.ts:
            existing.ts = ts
            existing.hot_score = hot_score
            existing.sentiment_score = sentiment
            existing.title = title[:400]
            existing.url = url
            db.commit()
        return existing
    item = ContentItem(
        holding_id=holding.id,
        ts=ts,
        source=source,
        title=title[:400],
        url=url,
        dedupe_key=key,
        sentiment_score=sentiment,
        hot_score=hot_score,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def ingest_polygon_news(db: Session, holding: Holding, news_rows: list[dict]) -> int:
    now = datetime.now(timezone.utc)
    n = 0
    for r in news_rows:
        title = r.get("title") or ""
        pub = (r.get("publisher") or {}).get("name")
        url = r.get("article_url") or r.get("url") or None
        ts_str = r.get("published_utc") or r.get("published_at")
        ts = now
        if ts_str:
            try:
                ts = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
            except Exception:
                ts = now
        hs = hot_score_news(publisher_weight(pub), ensure_utc(ts), now)
        if title.strip():
            upsert_dedup_content(db, holding, "polygon_news", title, ts, url, hs)
            n += 1
    return n

def ingest_reddit(db: Session, holding: Holding, reddit_items: list[dict]) -> int:
    now = datetime.now(timezone.utc)
    n = 0
    for it in reddit_items:
        title = it.get("title") or ""
        url = it.get("url")
        ts = it.get("ts") or now
        score = int(it.get("score", 0) or 0)
        comments = int(it.get("num_comments", 0) or 0)
        hs = hot_score_reddit(score, comments, ensure_utc(ts), now)
        if title.strip():
            sub = it.get("subreddit")
            decorated = f"[r/{sub}] ({score}/{comments}) {title}" if sub else title
            upsert_dedup_content(db, holding, "reddit", decorated, ts, url, hs)
            n += 1
    return n

def build_top_bullets(db: Session, holding: Holding, hours: int = 48, limit: int = 30) -> list[str]:
    from datetime import timedelta
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    rows = (
        db.query(ContentItem)
        .filter(ContentItem.holding_id == holding.id, ContentItem.ts >= since)
        .order_by(ContentItem.hot_score.desc(), ContentItem.ts.desc())
        .limit(limit)
        .all()
    )
    bullets = []
    for r in rows:
        bullets.append(f"{r.title} (hot:{r.hot_score:.0f})")
    return bullets
