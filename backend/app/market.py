import httpx
from datetime import datetime, timezone

class MarketQuote:
    def __init__(self, symbol: str, price: float, change_pct_1d: float, volume: float | None):
        self.symbol = symbol
        self.price = price
        self.change_pct_1d = change_pct_1d
        self.volume = volume
        self.ts = datetime.now(timezone.utc)

async def fetch_quote_stooq(symbol: str) -> MarketQuote:
    s = symbol.lower() + ".us"
    url = f"https://stooq.com/q/l/?s={s}&i=d"
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url)
        r.raise_for_status()
        lines = r.text.strip().splitlines()
        if len(lines) < 2:
            raise ValueError("No data")
        cols = lines[1].split(",")
        close = float(cols[6])
        volume = float(cols[7]) if cols[7] else None
        return MarketQuote(symbol=symbol.upper(), price=close, change_pct_1d=0.0, volume=volume)

async def fetch_quote_mock(symbol: str) -> MarketQuote:
    import random
    price = round(50 + random.random() * 200, 2)
    change = round((random.random() - 0.5) * 6, 2)
    vol = float(int(1e6 + random.random() * 2e6))
    return MarketQuote(symbol=symbol.upper(), price=price, change_pct_1d=change, volume=vol)

async def fetch_snapshot(symbol: str) -> tuple[float, float, float | None]:
    from .config import settings
    if settings.MARKET_DATA_PROVIDER == "mock":
        q = await fetch_quote_mock(symbol)
    else:
        q = await fetch_quote_stooq(symbol)
    return q.price, q.change_pct_1d, q.volume
