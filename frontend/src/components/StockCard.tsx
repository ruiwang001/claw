import Link from "next/link";
import { useLanguage } from "@/lib/language";

export default function StockCard({
  symbol,
  name,
  sentiment,
  risk,
  price,
}: {
  symbol: string;
  name?: string | null;
  sentiment?: number;
  risk?: number;
  price?: number;
}) {
  const { t } = useLanguage();
  const sentimentValue = sentiment ?? 50;
  const riskValue = risk ?? 5;
  const sentimentLabel = sentimentValue >= 60 ? t("card.bullish") : sentimentValue <= 40 ? t("card.bearish") : t("card.neutral");
  const riskLabel = riskValue >= 7 ? t("card.high") : riskValue >= 4 ? t("card.medium") : t("card.low");
  
  return (
    <Link
      href={`/stock/${symbol}`}
      className="glass-card block p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-bold">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <div className="text-lg font-semibold">{symbol}</div>
              <div className="text-xs text-white/40">{name || "—"}</div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${price?.toFixed(2) ?? "—"}</div>
          <div className="text-xs text-white/40">USD</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="metric-label mb-1">{t("card.sentiment")}</div>
          <div className={`text-xl font-semibold ${sentimentValue >= 60 ? 'sentiment-bullish' : sentimentValue <= 40 ? 'sentiment-bearish' : 'text-white/80'}`}>
            {sentiment?.toFixed(0) ?? "—"}
          </div>
          <div className="text-xs text-white/40 mt-1">{sentimentLabel}</div>
        </div>
        
        <div className="rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="metric-label mb-1">{t("card.risk")}</div>
          <div className={`text-xl font-semibold ${riskValue >= 7 ? 'risk-high' : riskValue >= 4 ? 'risk-medium' : 'risk-low'}`}>
            {risk?.toFixed(1) ?? "—"}
          </div>
          <div className="text-xs text-white/40 mt-1">{riskLabel}</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${riskValue >= 7 ? 'bg-red-500 animate-pulse' : riskValue >= 4 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
          <span className="text-xs text-white/40">{price ? t("card.active") : t("card.pending")}</span>
        </div>
        <svg className="w-5 h-5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
