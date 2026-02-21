"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import RulePanel from "@/components/RulePanel";
import { useLanguage } from "@/lib/language";

type Snapshot = {
  ts: string;
  price: number;
  change_pct_1d: number;
  sentiment_score: number;
  risk_score: number;
  summary?: string | null;
};

type Alert = {
  ts: string;
  level: string;
  title: string;
  detail: string;
};

export default function StockDetail() {
  const { t } = useLanguage();
  const params = useParams<{ symbol: string }>();
  const symbol = (params.symbol || "").toUpperCase();
  const [snaps, setSnaps] = useState<Snapshot[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [symbol]);

  async function loadData() {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([
        api<Snapshot[]>(`/api/reports/stock/${symbol}/snapshots`),
        api<Alert[]>(`/api/reports/stock/${symbol}/alerts`),
      ]);
      setSnaps(s);
      setAlerts(a);
    } finally {
      setLoading(false);
    }
  }

  const latest = snaps[0];
  const changeColor = latest?.change_pct_1d >= 0 ? 'text-green-400' : 'text-red-400';
  const changeIcon = latest?.change_pct_1d >= 0 ? '↑' : '↓';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a 
          href="/portfolio" 
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xl font-bold border border-white/10">
          {symbol.slice(0, 2)}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <p className="text-white/40">{t("detail.equity")}</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      ) : !latest ? (
        <div className="glass-panel p-12 text-center">
          <div className="text-white/50">{t("detail.ai.empty")}</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              label={t("detail.price")}
              value={`$${latest.price.toFixed(2)}`}
              subValue={`${changeIcon} ${Math.abs(latest.change_pct_1d).toFixed(2)}%`}
              subColor={changeColor}
              icon="💰"
            />
            
            <MetricCard
              label={t("detail.sentiment")}
              value={latest.sentiment_score.toFixed(0)}
              subValue={latest.sentiment_score >= 60 ? t("card.bullish") : latest.sentiment_score <= 40 ? t("card.bearish") : t("card.neutral")}
              subColor={latest.sentiment_score >= 60 ? 'text-green-400' : latest.sentiment_score <= 40 ? 'text-red-400' : 'text-white/50'}
              icon="📊"
            />
            
            <MetricCard
              label={t("detail.risk")}
              value={latest.risk_score.toFixed(1)}
              subValue={latest.risk_score >= 7 ? t("card.high") : latest.risk_score >= 4 ? t("card.medium") : t("card.low")}
              subColor={latest.risk_score >= 7 ? 'text-red-400' : latest.risk_score >= 4 ? 'text-orange-400' : 'text-green-400'}
              icon="⚠️"
            />
          </div>

          <RulePanel symbol={symbol} />

          {latest.summary && (
            <div className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold">{t("detail.ai.title")}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans leading-relaxed">
                  {latest.summary}
                </pre>
              </div>
            </div>
          )}

          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">{t("detail.alerts.title")}</span>
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white/5">
                {alerts.length} {t("detail.alerts.total")}
              </span>
            </div>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-white/30">
                {t("detail.alerts.empty")}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 10).map((a, i) => (
                  <div key={i} className="rounded-xl bg-white/5 p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${a.level === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        <span className="font-medium">{a.title}</span>
                      </div>
                      <span className="text-xs text-white/30">{new Date(a.ts).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-white/60">{a.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-semibold">{t("detail.snapshots.title")}</span>
              </div>
              <span className="text-xs text-white/30">{t("detail.snapshots.latest")}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 border-b border-white/10">
                    <th className="pb-3 font-medium">{t("detail.snapshots.time")}</th>
                    <th className="pb-3 font-medium">{t("detail.snapshots.price")}</th>
                    <th className="pb-3 font-medium">{t("detail.change")}</th>
                    <th className="pb-3 font-medium">{t("detail.sentiment")}</th>
                    <th className="pb-3 font-medium">{t("detail.risk")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {snaps.slice(0, 20).map((s, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white/60">{new Date(s.ts).toLocaleTimeString()}</td>
                      <td className="py-3 font-medium">${s.price.toFixed(2)}</td>
                      <td className={`py-3 ${s.change_pct_1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {s.change_pct_1d >= 0 ? '+' : ''}{s.change_pct_1d.toFixed(2)}%
                      </td>
                      <td className="py-3">
                        <span className={`${s.sentiment_score >= 60 ? 'text-green-400' : s.sentiment_score <= 40 ? 'text-red-400' : 'text-white/60'}`}>
                          {s.sentiment_score.toFixed(0)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`${s.risk_score >= 7 ? 'text-red-400' : s.risk_score >= 4 ? 'text-orange-400' : 'text-green-400'}`}>
                          {s.risk_score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  subValue,
  subColor,
  icon,
}: {
  label: string;
  value: string;
  subValue: string;
  subColor: string;
  icon: string;
}) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="metric-label">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className={`text-sm mt-1 ${subColor}`}>{subValue}</div>
    </div>
  );
}
