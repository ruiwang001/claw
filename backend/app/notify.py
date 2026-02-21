import httpx
from .config import settings

async def notify_telegram(text: str) -> None:
    if not (settings.TELEGRAM_BOT_TOKEN and settings.TELEGRAM_CHAT_ID):
        return
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": settings.TELEGRAM_CHAT_ID, "text": text}
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(url, json=payload)
