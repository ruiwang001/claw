import httpx
from .config import settings

async def fetch_ticker_news(symbol: str, limit: int = 20) -> list[dict]:
    if not settings.POLYGON_API_KEY:
        return []
    url = f"https://api.polygon.io/v2/reference/news"
    params = {
        "ticker": symbol.upper(),
        "limit": limit,
        "apiKey": settings.POLYGON_API_KEY,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        return data.get("results", [])
