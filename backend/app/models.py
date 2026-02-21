from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, UniqueConstraint, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    holdings: Mapped[list["Holding"]] = relationship("Holding", back_populates="user", cascade="all, delete-orphan")

class Holding(Base):
    __tablename__ = "holdings"
    __table_args__ = (UniqueConstraint("user_id", "symbol", name="uq_user_symbol"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    symbol: Mapped[str] = mapped_column(String(16), index=True)
    name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    cost_basis: Mapped[float | None] = mapped_column(Float, nullable=True)
    shares: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_pref: Mapped[str] = mapped_column(String(16), default="neutral")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user: Mapped["User"] = relationship("User", back_populates="holdings")
    snapshots: Mapped[list["StockSnapshot"]] = relationship("StockSnapshot", back_populates="holding", cascade="all, delete-orphan")
    alerts: Mapped[list["AlertEvent"]] = relationship("AlertEvent", back_populates="holding", cascade="all, delete-orphan")

class StockSnapshot(Base):
    __tablename__ = "snapshots"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    holding_id: Mapped[int] = mapped_column(Integer, ForeignKey("holdings.id"), index=True)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    price: Mapped[float] = mapped_column(Float)
    change_pct_1d: Mapped[float] = mapped_column(Float, default=0.0)
    volume: Mapped[float | None] = mapped_column(Float, nullable=True)
    sentiment_score: Mapped[float] = mapped_column(Float, default=50.0)
    risk_score: Mapped[float] = mapped_column(Float, default=5.0)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    holding: Mapped["Holding"] = relationship("Holding", back_populates="snapshots")

class AlertEvent(Base):
    __tablename__ = "alerts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    holding_id: Mapped[int] = mapped_column(Integer, ForeignKey("holdings.id"), index=True)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    level: Mapped[str] = mapped_column(String(16), default="info")
    title: Mapped[str] = mapped_column(String(200))
    detail: Mapped[str] = mapped_column(Text)
    holding: Mapped["Holding"] = relationship("Holding", back_populates="alerts")

class ContentItem(Base):
    __tablename__ = "content_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    holding_id: Mapped[int] = mapped_column(Integer, ForeignKey("holdings.id"), index=True)
    ts: Mapped[datetime] = mapped_column(DateTime, index=True)
    source: Mapped[str] = mapped_column(String(32))
    title: Mapped[str] = mapped_column(String(400))
    url: Mapped[str | None] = mapped_column(String(800), nullable=True)
    dedupe_key: Mapped[str] = mapped_column(String(64), index=True)
    sentiment_score: Mapped[float] = mapped_column(Float, default=50.0)
    hot_score: Mapped[float] = mapped_column(Float, default=0.0)
    holding: Mapped["Holding"] = relationship("Holding")

class TriggerRule(Base):
    __tablename__ = "trigger_rules"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    holding_id: Mapped[int] = mapped_column(Integer, ForeignKey("holdings.id"), index=True, unique=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    risk_ge: Mapped[float] = mapped_column(Float, default=8.0)
    sentiment_le: Mapped[float] = mapped_column(Float, default=25.0)
    hot_ge: Mapped[float] = mapped_column(Float, default=70.0)
    change_abs_ge: Mapped[float] = mapped_column(Float, default=6.0)
    holding: Mapped["Holding"] = relationship("Holding")

class DailyReport(Base):
    __tablename__ = "daily_reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    date_yyyymmdd: Mapped[str] = mapped_column(String(10), index=True)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user: Mapped["User"] = relationship("User")
