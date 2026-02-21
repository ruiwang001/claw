"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StockCard from "@/components/StockCard";
import AddHolding from "@/components/AddHolding";
import { useLanguage } from "@/lib/language";

type Holding = {
  id: number;
  symbol: string;
  name?: string | null;
  risk_pref: string;
};

type Snapshot = {
  price: number;
  sentiment_score: number;
  risk_score: number;
};

export default function Portfolio() {
  const { t } = useLanguage();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [latest, setLatest] = useState<Record<string, Snapshot>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const hs = await api<Holding[]>("/api/portfolio/holdings");
      setHoldings(hs);
      const map: Record<string, Snapshot> = {};
      await Promise.all(
        hs.map(async (h) => {
          try {
            const snaps = await api<any[]>(`/api/reports/stock/${h.symbol}/snapshots`);
            if (snaps?.[0]) map[h.symbol] = snaps[0];
          } catch {}
        })
      );
      setLatest(map);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = {
    total: holdings.length,
    active: Object.keys(latest).length,
    avgRisk: holdings.length > 0 
      ? (Object.values(latest).reduce((acc, s) => acc + (s?.risk_score || 0), 0) / Object.keys(latest).length).toFixed(1)
      : "—",
    avgSentiment: holdings.length > 0
      ? (Object.values(latest).reduce((acc, s) => acc + (s?.sentiment_score || 0), 0) / Object.keys(latest).length).toFixed(0)
      : "—",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("portfolio.title")}</h1>
          <p className="text-white/50 mt-1">{t("portfolio.subtitle")}</p>
        </div>
        
        <button
          onClick={load}
          disabled={loading}
          className="btn-secondary inline-flex items-center gap-2 self-start"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("portfolio.refresh")}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label={t("portfolio.stats.total")} value={stats.total.toString()} icon="📊" />
        <StatCard label={t("portfolio.stats.active")} value={stats.active.toString()} icon="✓" color="green" />
        <StatCard label={t("portfolio.stats.risk")} value={stats.avgRisk} icon="⚠️" color="orange" />
        <StatCard label={t("portfolio.stats.sentiment")} value={stats.avgSentiment} icon="📈" color="cyan" />
      </div>

      <AddHolding onAdded={load} />

      {holdings.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
            </svg>
          </div>
          <p className="text-white/50">{t("portfolio.empty.desc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {holdings.map((h) => (
            <StockCard
              key={h.id}
              symbol={h.symbol}
              name={h.name}
              price={latest[h.symbol]?.price}
              sentiment={latest[h.symbol]?.sentiment_score}
              risk={latest[h.symbol]?.risk_score}
            />
          ))}
        </div>
      )}

      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
        <span className="text-sm text-white/50">
          {t("portfolio.footer")}
        </span>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  color = "white" 
}: { 
  label: string; 
  value: string; 
  icon: string;
  color?: "white" | "green" | "orange" | "cyan";
}) {
  const colorClasses = {
    white: "from-white/10 to-white/5",
    green: "from-green-500/20 to-green-500/5",
    orange: "from-orange-500/20 to-orange-500/5",
    cyan: "from-cyan-500/20 to-cyan-500/5",
  };

  return (
    <div className={`glass-card p-4 bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-white/40">{label}</span>
        <span>{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
