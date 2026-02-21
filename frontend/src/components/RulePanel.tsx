"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/language";

type Rule = {
  enabled: boolean;
  risk_ge: number;
  sentiment_le: number;
  hot_ge: number;
  change_abs_ge: number;
};

export default function RulePanel({ symbol }: { symbol: string }) {
  const { t } = useLanguage();
  const [rule, setRule] = useState<Rule | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const r = await api<Rule>(`/api/rules/stock/${symbol}`);
    setRule(r);
  }

  useEffect(() => {
    load();
  }, [symbol]);

  if (!rule) return (
    <div className="glass-panel p-6 flex items-center justify-center h-32">
      <div className="animate-pulse flex items-center gap-2 text-white/40">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
        Loading…
      </div>
    </div>
  );

  async function save(patch: Partial<Rule>) {
    setSaving(true);
    try {
      const r = await api<Rule>(`/api/rules/stock/${symbol}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setRule(r);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-panel p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold">{t("detail.rules.title")}</span>
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-sm text-white/50">{rule.enabled ? t("detail.rules.enabled") : t("detail.rules.disabled")}</span>
          <div className={`relative w-12 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-cyan-500' : 'bg-white/20'}`}>
            <input
              type="checkbox"
              checked={rule.enabled}
              onChange={(e) => save({ enabled: e.target.checked })}
              className="sr-only"
            />
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${rule.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RuleField
          label={t("detail.rules.risk")}
          value={rule.risk_ge}
          onChange={(v) => save({ risk_ge: v })}
          disabled={saving || !rule.enabled}
          min={0}
          max={10}
          step={0.5}
          icon="🔴"
        />
        
        <RuleField
          label={t("detail.rules.sentiment")}
          value={rule.sentiment_le}
          onChange={(v) => save({ sentiment_le: v })}
          disabled={saving || !rule.enabled}
          min={0}
          max={100}
          step={5}
          icon="📉"
        />
        
        <RuleField
          label={t("detail.rules.hot")}
          value={rule.hot_ge}
          onChange={(v) => save({ hot_ge: v })}
          disabled={saving || !rule.enabled}
          min={0}
          max={100}
          step={5}
          icon="🔥"
        />
        
        <RuleField
          label={t("detail.rules.change")}
          value={rule.change_abs_ge}
          onChange={(v) => save({ change_abs_ge: v })}
          disabled={saving || !rule.enabled}
          min={0}
          max={20}
          step={0.5}
          icon="📊"
        />
      </div>
      
      <div className="text-xs text-white/30 pt-4 border-t border-white/5">
        {t("detail.rules.desc")}
      </div>
    </div>
  );
}

function RuleField({
  label,
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
  icon: string;
}) {
  return (
    <div className={`rounded-xl bg-white/5 p-4 border border-white/5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-lg font-bold text-cyan-400">{value}</span>
      </div>
      
      <input
        disabled={disabled}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
      />
    </div>
  );
}
