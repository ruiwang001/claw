"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/language";

export default function AddHolding({ onAdded }: { onAdded: () => void }) {
  const { t } = useLanguage();
  const [symbol, setSymbol] = useState("");
  const [riskPref, setRiskPref] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="font-semibold">{t("portfolio.add.title")}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-5 relative">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-all ${focused || symbol ? 'text-xs -translate-y-8' : ''}`}>
            {t("portfolio.add.symbol")}
          </div>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? t("portfolio.add.placeholder") : ""}
            className="glass-input w-full pl-4 pr-4 py-4 text-lg font-mono"
          />
        </div>
        
        <div className="sm:col-span-4">
          <select
            value={riskPref}
            onChange={(e) => setRiskPref(e.target.value)}
            className="glass-input w-full py-4"
          >
            <option value="conservative">{t("portfolio.add.conservative")}</option>
            <option value="neutral">{t("portfolio.add.neutral")}</option>
            <option value="aggressive">{t("portfolio.add.aggressive")}</option>
          </select>
        </div>
        
        <div className="sm:col-span-3">
          <button
            disabled={loading || !symbol}
            onClick={async () => {
              setLoading(true);
              try {
                await api("/api/portfolio/holdings", {
                  method: "POST",
                  body: JSON.stringify({ symbol, risk_pref: riskPref }),
                });
                setSymbol("");
                onAdded();
              } finally {
                setLoading(false);
              }
            }}
            className="btn-primary w-full h-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              t("portfolio.add.button")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
