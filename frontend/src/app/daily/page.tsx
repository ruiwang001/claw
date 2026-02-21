"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/language";

type Report = {
  id: number;
  date_yyyymmdd: string;
  content: string;
  created_at: string;
};

export default function Daily() {
  const { t, lang } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await api<Report[]>("/api/daily/reports");
      setReports(r);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (lang === "zh") {
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    }
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("daily.title")}</h1>
          <p className="text-white/50 mt-1">{t("daily.subtitle")}</p>
        </div>
        
        <button
          onClick={load}
          disabled={loading}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("daily.refresh")}
        </button>
      </div>

      {loading ? (
        <div className="glass-panel p-12 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-white/50">{t("daily.empty.desc")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((r, index) => (
            <div key={r.id} className="glass-panel p-6 relative overflow-hidden">
              {index === 0 && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {t("daily.latest")}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <div>
                  <div className="text-sm text-white/40">{formatDate(r.date_yyyymmdd)}</div>
                  <div className="text-xs text-white/30 mt-0.5">
                    {t("daily.generated")} {new Date(r.created_at).toLocaleTimeString(lang === "zh" ? "zh-CN" : "en-US")}
                  </div>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans leading-relaxed bg-white/5 rounded-xl p-4 border border-white/5">
                  {r.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
