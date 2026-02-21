from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from .config import settings
import httpx

analyzer = SentimentIntensityAnalyzer()

def vader_score_0_100(texts: list[str]) -> float:
    if not texts:
        return 50.0
    s = 0.0
    for t in texts:
        s += analyzer.polarity_scores(t)["compound"]
    avg = s / len(texts)
    return float(max(0.0, min(100.0, (avg + 1) * 50)))

async def llm_summarize(symbol: str, bullets: list[str]) -> str | None:
    if not (settings.LLM_BASE_URL and settings.LLM_API_KEY):
        return None
    prompt = (
        f"用中文总结 {symbol} 的最新情况，面向散户投资者。"
        "输入要点: " + " ".join([f"- {b}" for b in bullets[:30]]) +
        " 输出格式: - 3个核心要点 - 1个风险提示 - 1个关注重点 保持简洁。"
    )
    url = settings.LLM_BASE_URL.rstrip("/") + "/chat/completions"
    headers = {"Authorization": f"Bearer {settings.LLM_API_KEY}"}
    payload = {
        "model": settings.LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    async with httpx.AsyncClient(timeout=25) as client:
        r = await client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]
