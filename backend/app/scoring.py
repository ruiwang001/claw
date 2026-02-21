import hashlib
import math
from datetime import datetime, timezone

def sha256_key(*parts: str) -> str:
    raw = "||".join([p.strip() for p in parts if p is not None]).encode("utf-8", errors="ignore")
    return hashlib.sha256(raw).hexdigest()

def time_decay_hours(ts: datetime, now: datetime, half_life_hours: float = 24.0) -> float:
    age_h = max(0.0, (now - ts).total_seconds() / 3600.0)
    return 0.5 ** (age_h / half_life_hours)

def hot_score_news(publisher_weight: float, ts: datetime, now: datetime) -> float:
    return 100.0 * publisher_weight * time_decay_hours(ts, now, half_life_hours=18.0)

def hot_score_reddit(score: int, num_comments: int, ts: datetime, now: datetime) -> float:
    base = math.log(1.0 + max(0, score) + 2.0 * max(0, num_comments))
    return 25.0 * base * time_decay_hours(ts, now, half_life_hours=10.0)

def ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
