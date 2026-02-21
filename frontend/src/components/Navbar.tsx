"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Stock<span className="gradient-text">{t("nav.title")}</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <NavLink href="/portfolio">{t("nav.portfolio")}</NavLink>
            <NavLink href="/daily">{t("nav.reports")}</NavLink>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
    >
      {children}
    </Link>
  );
}

function LanguageToggle({ lang, setLang }: { lang: string; setLang: (lang: "en" | "zh") => void }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "zh" : "en")}
      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
      title={lang === "en" ? "切换到中文" : "Switch to English"}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span className="uppercase">{lang}</span>
    </button>
  );
}
