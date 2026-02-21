from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
import asyncio
from .config import settings
from .db import Base, engine, SessionLocal
from .routes import auth as auth_routes
from .routes import portfolio as portfolio_routes
from .routes import reports as reports_routes
from .routes import rules as rules_routes
from .routes import daily as daily_routes
from .agent import run_agent_once
from .daily_agent import run_daily_reports

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router)
app.include_router(portfolio_routes.router)
app.include_router(reports_routes.router)
app.include_router(rules_routes.router)
app.include_router(daily_routes.router)

scheduler = BackgroundScheduler()

def _job():
    db: Session = SessionLocal()
    try:
        asyncio.run(run_agent_once(db))
    finally:
        db.close()

def _daily_job():
    db: Session = SessionLocal()
    try:
        asyncio.run(run_daily_reports(db))
    finally:
        db.close()

@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(_job, "interval", minutes=settings.AGENT_CRON_MINUTES, id="agent")
    scheduler.add_job(_daily_job, "cron", hour=22, minute=0, id="daily")
    scheduler.start()

@app.on_event("shutdown")
def stop_scheduler():
    scheduler.shutdown(wait=False)

@app.get("/health")
def health():
    return {"ok": True}
