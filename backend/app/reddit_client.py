from .config import settings
from datetime import datetime, timezone

def _client():
    import praw
    if not (settings.REDDIT_CLIENT_ID and settings.REDDIT_CLIENT_SECRET):
        raise RuntimeError("REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET not set")
    return praw.Reddit(
        client_id=settings.REDDIT_CLIENT_ID,
        client_secret=settings.REDDIT_CLIENT_SECRET,
        user_agent=settings.REDDIT_USER_AGENT,
    )

def fetch_reddit_mentions(symbol: str, limit: int = 30) -> list[dict]:
    try:
        reddit = _client()
    except RuntimeError:
        return []
    subs = settings.REDDIT_SUBREDDITS
    q = f'"{symbol.upper()}"'
    items: list[dict] = []
    for s in reddit.subreddit(subs).search(q, sort="new", limit=limit):
        items.append({
            "source": "reddit",
            "subreddit": s.subreddit.display_name,
            "title": s.title,
            "url": f"https://www.reddit.com{s.permalink}",
            "score": int(getattr(s, "score", 0) or 0),
            "num_comments": int(getattr(s, "num_comments", 0) or 0),
            "created_utc": float(getattr(s, "created_utc", 0) or 0),
        })
    for it in items:
        ts = datetime.fromtimestamp(it["created_utc"], tz=timezone.utc) if it["created_utc"] else datetime.now(timezone.utc)
        it["ts"] = ts
    return items
