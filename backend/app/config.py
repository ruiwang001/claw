from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Stock Guardian AI"
    JWT_SECRET: str = "dev_secret_change_me"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL: str = "sqlite:///./guardian.db"
    
    # LLM (OpenAI-compatible). Optional.
    LLM_BASE_URL: str | None = None  # e.g. https://api.openai.com/v1
    LLM_API_KEY: str | None = None
    LLM_MODEL: str = "gpt-4o-mini"
    
    # Telegram notify optional
    TELEGRAM_BOT_TOKEN: str | None = None
    TELEGRAM_CHAT_ID: str | None = None
    
    # Reddit (optional)
    REDDIT_CLIENT_ID: str | None = None
    REDDIT_CLIENT_SECRET: str | None = None
    REDDIT_USER_AGENT: str = "StockGuardian/1.0"
    REDDIT_SUBREDDITS: str = "wallstreetbets+stocks+investing"
    
    # Polygon.io (optional, for news)
    POLYGON_API_KEY: str | None = None
    
    # Market adapter
    MARKET_DATA_PROVIDER: str = "stooq"  # "stooq" or "mock"
    AGENT_CRON_MINUTES: int = 15
    NEWS_LIMIT: int = 20
    REDDIT_LIMIT: int = 20

    class Config:
        env_file = ".env"

settings = Settings()
