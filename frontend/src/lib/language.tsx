"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    "nav.portfolio": "Portfolio",
    "nav.reports": "Reports",
    "nav.title": "Stock Guardian",
    
    // Home
    "home.hero.tag": "AI Agent Active",
    "home.hero.title": "24/7 Portfolio",
    "home.hero.subtitle": "Risk Guardian",
    "home.hero.desc": "AI-powered monitoring for your US stock holdings. Real-time sentiment analysis, intelligent risk scoring, and proactive alerts.",
    "home.cta.dashboard": "View Dashboard",
    "home.cta.docs": "Documentation",
    "home.stats.interval": "Update Interval",
    "home.stats.ai": "Powered Analysis",
    "home.stats.monitoring": "Monitoring",
    
    // Portfolio
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Monitor your holdings and risk exposure",
    "portfolio.refresh": "Refresh",
    "portfolio.stats.total": "Total Positions",
    "portfolio.stats.active": "Active Monitoring",
    "portfolio.stats.risk": "Avg Risk Score",
    "portfolio.stats.sentiment": "Avg Sentiment",
    "portfolio.add.title": "Add Position",
    "portfolio.add.symbol": "Stock Symbol",
    "portfolio.add.placeholder": "e.g. AAPL",
    "portfolio.add.conservative": "🛡️ Conservative",
    "portfolio.add.neutral": "⚖️ Neutral",
    "portfolio.add.aggressive": "🚀 Aggressive",
    "portfolio.add.button": "Add",
    "portfolio.empty.title": "No holdings yet",
    "portfolio.empty.desc": "Add your first stock above.",
    "portfolio.footer": "Agent runs every 15 minutes. Latest snapshot appears after the first run.",
    
    // Stock Card
    "card.sentiment": "Sentiment",
    "card.risk": "Risk Level",
    "card.bullish": "Bullish",
    "card.bearish": "Bearish",
    "card.neutral": "Neutral",
    "card.high": "High",
    "card.medium": "Medium",
    "card.low": "Low",
    "card.active": "Active",
    "card.pending": "Pending",
    
    // Stock Detail
    "detail.price": "Current Price",
    "detail.change": "Change",
    "detail.sentiment": "Sentiment Score",
    "detail.risk": "Risk Score",
    "detail.back": "Back to Portfolio",
    "detail.equity": "US Equity",
    "detail.rules.title": "Alert Rules",
    "detail.rules.enabled": "Enabled",
    "detail.rules.disabled": "Disabled",
    "detail.rules.risk": "Risk Score ≥",
    "detail.rules.sentiment": "Sentiment ≤",
    "detail.rules.hot": "Hot Score ≥",
    "detail.rules.change": "Daily Change |%| ≥",
    "detail.rules.desc": "Rules evaluate every 15 minutes. Any condition met triggers a critical alert.",
    "detail.ai.title": "AI Analysis",
    "detail.ai.empty": "No AI summary available yet.",
    "detail.alerts.title": "Alert History",
    "detail.alerts.empty": "No alerts triggered yet",
    "detail.alerts.total": "total",
    "detail.snapshots.title": "Snapshot History",
    "detail.snapshots.latest": "Latest 20",
    "detail.snapshots.time": "Time",
    "detail.snapshots.price": "Price",
    "detail.snapshots.change": "Change",
    
    // Daily Reports
    "daily.title": "Daily Reports",
    "daily.subtitle": "AI-generated portfolio summaries",
    "daily.refresh": "Refresh",
    "daily.empty.title": "No reports yet",
    "daily.empty.desc": "Daily reports are generated automatically at 22:00 UTC.",
    "daily.latest": "Latest",
    "daily.generated": "Generated at",
  },
  zh: {
    // Navbar
    "nav.portfolio": "投资组合",
    "nav.reports": "日报",
    "nav.title": "股票守护",
    
    // Home
    "home.hero.tag": "AI 智能监控中",
    "home.hero.title": "24/7 投资组合",
    "home.hero.subtitle": "风险守护者",
    "home.hero.desc": "AI 驱动的美股持仓监控系统。实时情绪分析、智能风险评分、主动预警。",
    "home.cta.dashboard": "查看仪表盘",
    "home.cta.docs": "使用文档",
    "home.stats.interval": "更新频率",
    "home.stats.ai": "AI 驱动分析",
    "home.stats.monitoring": "全天候监控",
    
    // Portfolio
    "portfolio.title": "投资组合",
    "portfolio.subtitle": "监控您的持仓和风险敞口",
    "portfolio.refresh": "刷新",
    "portfolio.stats.total": "总持仓数",
    "portfolio.stats.active": "活跃监控",
    "portfolio.stats.risk": "平均风险分",
    "portfolio.stats.sentiment": "平均情绪分",
    "portfolio.add.title": "添加持仓",
    "portfolio.add.symbol": "股票代码",
    "portfolio.add.placeholder": "例如 AAPL",
    "portfolio.add.conservative": "🛡️ 保守型",
    "portfolio.add.neutral": "⚖️ 中性型",
    "portfolio.add.aggressive": "🚀 激进型",
    "portfolio.add.button": "添加",
    "portfolio.empty.title": "暂无持仓",
    "portfolio.empty.desc": "请在上方添加您的第一只股票。",
    "portfolio.footer": "Agent 每15分钟运行一次。首次运行后显示最新快照。",
    
    // Stock Card
    "card.sentiment": "情绪指数",
    "card.risk": "风险等级",
    "card.bullish": "看涨",
    "card.bearish": "看跌",
    "card.neutral": "中性",
    "card.high": "高风险",
    "card.medium": "中风险",
    "card.low": "低风险",
    "card.active": "活跃",
    "card.pending": "等待数据",
    
    // Stock Detail
    "detail.price": "当前价格",
    "detail.change": "涨跌",
    "detail.sentiment": "情绪评分",
    "detail.risk": "风险评分",
    "detail.back": "返回投资组合",
    "detail.equity": "美股",
    "detail.rules.title": "预警规则",
    "detail.rules.enabled": "已启用",
    "detail.rules.disabled": "已禁用",
    "detail.rules.risk": "风险分 ≥",
    "detail.rules.sentiment": "情绪分 ≤",
    "detail.rules.hot": "热度分 ≥",
    "detail.rules.change": "日涨跌 |%| ≥",
    "detail.rules.desc": "规则每15分钟评估一次。满足任一条件即触发关键预警。",
    "detail.ai.title": "AI 分析",
    "detail.ai.empty": "暂无 AI 分析摘要。",
    "detail.alerts.title": "预警历史",
    "detail.alerts.empty": "暂无预警触发",
    "detail.alerts.total": "总计",
    "detail.snapshots.title": "快照历史",
    "detail.snapshots.latest": "最新20条",
    "detail.snapshots.time": "时间",
    "detail.snapshots.price": "价格",
    "detail.snapshots.change": "涨跌",
    
    // Daily Reports
    "daily.title": "每日报告",
    "daily.subtitle": "AI 生成的投资组合摘要",
    "daily.refresh": "刷新",
    "daily.empty.title": "暂无报告",
    "daily.empty.desc": "每日报告将在 UTC 22:00 自动生成。",
    "daily.latest": "最新",
    "daily.generated": "生成于",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "zh")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
