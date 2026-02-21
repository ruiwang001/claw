from pydantic import BaseModel, EmailStr
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    class Config:
        from_attributes = True

class HoldingCreate(BaseModel):
    symbol: str
    name: str | None = None
    shares: float | None = None
    cost_basis: float | None = None
    risk_pref: str = "neutral"

class HoldingOut(BaseModel):
    id: int
    symbol: str
    name: str | None
    shares: float | None
    cost_basis: float | None
    risk_pref: str
    created_at: datetime
    class Config:
        from_attributes = True

class SnapshotOut(BaseModel):
    id: int
    ts: datetime
    price: float
    change_pct_1d: float
    volume: float | None
    sentiment_score: float
    risk_score: float
    summary: str | None
    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: int
    ts: datetime
    level: str
    title: str
    detail: str
    class Config:
        from_attributes = True

class TriggerRuleOut(BaseModel):
    enabled: bool
    risk_ge: float
    sentiment_le: float
    hot_ge: float
    change_abs_ge: float
    class Config:
        from_attributes = True

class TriggerRuleUpdate(BaseModel):
    enabled: bool | None = None
    risk_ge: float | None = None
    sentiment_le: float | None = None
    hot_ge: float | None = None
    change_abs_ge: float | None = None

class DailyReportOut(BaseModel):
    id: int
    date_yyyymmdd: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True
