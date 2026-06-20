"use client";

import { useState } from "react";
import { Home, Building2, Settings, ChevronLeft, ChevronDown, Menu, X } from "lucide-react";
import { GREEN, INK } from "@/components/tm/ui";

/* ============================================================
   Сайдбар платформы TalentMind (RU/EN).
   Навигация: AI Ассистент (орб) · Главная · Отделы · Настройки
   + карточка пользователя. Сворачивается и открывается на мобильном.
   ============================================================ */

type Lang = "ru" | "en";

const T = {
  ru: {
    ai: "AI Ассистент", home: "Главная", depts: "Отделы", settings: "Настройки",
    sub: ["Профиль компании", "Команда и доступы", "Уведомления"],
    user: "Александр Козлов", role: "Рекрутер",
    open: "Открыть меню", close: "Закрыть", expand: "Развернуть", collapse: "Свернуть",
  },
  en: {
    ai: "AI Assistant", home: "Home", depts: "Departments", settings: "Settings",
    sub: ["Company profile", "Team & access", "Notifications"],
    user: "Alexander Kozlov", role: "Recruiter",
    open: "Open menu", close: "Close", expand: "Expand", collapse: "Collapse",
  },
} as const;

export default function PlatformSidebar({
  collapsed,
  setCollapsed,
  lang = "ru",
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  lang?: Lang;
}) {
  const t = T[lang];
  const [active, setActive] = useState<"ai" | "home" | "depts">("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const showLabels = !collapsed;

  const NavItem = ({
    icon, label, itemKey, trailing, onClick,
  }: { icon: React.ReactNode; label: string; itemKey?: "ai" | "home" | "depts"; trailing?: React.ReactNode; onClick?: () => void }) => {
    const on = !!itemKey && active === itemKey;
    return (
      <button
        onClick={onClick}
        className={`ease-smooth flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
          on ? "bg-[#eef1ee] text-[#183833]" : "text-[#183833]/80 hover:bg-[#f3f6f1]"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center">{icon}</span>
        {showLabels && <span className="flex-1 truncate text-left">{label}</span>}
        {showLabels && trailing}
      </button>
    );
  };

  return (
    <>
      {/* мобильная кнопка-меню */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label={t.open}
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-2xl border border-[#e6ece4] bg-white shadow-[0_8px_24px_rgba(24,56,51,0.1)] lg:hidden"
      >
        <Menu className="h-5 w-5" style={{ color: INK }} />
      </button>

      {/* затемнение под мобильным меню */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-[#0c1c18]/30 backdrop-blur-[2px] transition-opacity lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-dvh flex-col border-r border-[#eceeec] bg-white transition-all duration-300 ease-in-out ${
          collapsed ? "w-[76px]" : "w-[272px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* ЛОГО + сворачивание */}
        <div className="flex items-center justify-between px-4 pb-2 pt-5">
          <a href={lang === "en" ? "/en/app/otchet" : "/"} className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
            {collapsed ? (
              <img src="/logo-sign.svg" alt="TalentMind" className="h-8 w-8" />
            ) : (
              <img src="/figma/logo.svg" alt="TalentMind" className="h-8 w-auto" />
            )}
          </a>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? t.expand : t.collapse}
            className={`hidden h-7 w-7 place-items-center rounded-full border border-[#e6ece4] text-[#7c8b85] transition-colors hover:bg-[#f3f6f1] lg:grid ${collapsed ? "absolute right-[-13px] top-6 bg-white shadow-sm" : ""}`}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setMobileOpen(false)} aria-label={t.close} className="grid h-7 w-7 place-items-center rounded-full text-[#7c8b85] hover:bg-[#f3f6f1] lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* НАВИГАЦИЯ */}
        <nav className="mt-4 space-y-1.5 px-3">
          <NavItem
            icon={<img src="/robot.png" alt="" className="h-7 w-7 object-contain drop-shadow-[0_3px_8px_rgba(17,175,204,0.35)]" />}
            label={t.ai}
            itemKey="ai"
            onClick={() => setActive("ai")}
          />
          <NavItem icon={<Home className="h-5 w-5" style={{ color: active === "home" ? GREEN : "#5b6e67" }} />} label={t.home} itemKey="home" onClick={() => setActive("home")} />
          <NavItem icon={<Building2 className="h-5 w-5 text-[#7c8b85]" />} label={t.depts} itemKey="depts" onClick={() => setActive("depts")} />

          {/* Настройки c подменю */}
          <NavItem
            icon={<Settings className="h-5 w-5 text-[#7c8b85]" />}
            label={t.settings}
            trailing={<ChevronDown className={`h-4 w-4 text-[#9aa8a2] transition-transform ${settingsOpen ? "rotate-180" : ""}`} />}
            onClick={() => (collapsed ? setCollapsed(false) : setSettingsOpen((v) => !v))}
          />
          {showLabels && settingsOpen && (
            <div className="space-y-0.5 pb-1 pl-12 pr-1">
              {t.sub.map((s) => (
                <button key={s} className="ease-smooth block w-full truncate rounded-xl px-3 py-2 text-left text-sm text-[#183833]/65 transition-colors hover:bg-[#f3f6f1] hover:text-[#183833]">
                  {s}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* ПОЛЬЗОВАТЕЛЬ */}
        <div className="mt-auto border-t border-[#eceeec] p-3">
          <div className={`flex items-center gap-3 rounded-2xl px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e7ece9] text-sm font-bold text-[#5b6e67]">{lang === "en" ? "AK" : "АК"}</span>
            {showLabels && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: INK }}>{t.user}</p>
                <p className="text-xs text-[#9aa8a2]">{t.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
