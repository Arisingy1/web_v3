"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  X, Sparkles, Check, AlertTriangle, Flame, AudioLines, MessageSquareQuote,
  Briefcase, Building2, Wallet, Home, GitBranch, TrendingUp, TrendingDown,
  Dna, Target, ChevronDown,
} from "lucide-react";

/* ── палитра ── */
const GREEN = "#7AB800";
const TEAL = "#11AFCC";
const INK = "#183833";
const AMBER = "#E8A317";
const RED = "#FF5252";

/* ============================================================
   /otchet/primer — «Пример отчёта» (отдельная страница).
   Полностью свёрстанный отчёт по кандидату с анимациями.
   У каждого soft-skill кнопка «Подробнее» открывает модальное
   окно с детальным разбором. Добавлен блок «Корпоративная
   совместимость».
   ============================================================ */

const ARGS_FOR = [
  "Запускала B2B-продукты в финтехе от идеи до выхода на рынок",
  "Сильная продуктовая аналитика: метрики, A/B-тесты, юнит-экономика",
  "Опыт работы с командами разработки, дизайна и data-аналитики",
  "Умеет формулировать гипотезы и подтверждать их данными",
];
const ARGS_AGAINST = ["Высокие зарплатные ожидания", "Мало опыта в B2C-продуктах массового рынка"];

type Skill = { name: string; val: number; req: number; desc: string };
const SKILLS: Skill[] = [
  { name: "Управление", val: 81, req: 84, desc: "Уверенно ведёт продуктовый бэклог и приоритизацию. Координировала кросс-функциональные команды из 10+ человек на запусках B2B-продуктов" },
  { name: "Лидерство", val: 74, req: 82, desc: "Лидирует через продуктовое видение и аргументацию данными. Ведёт команду за собой, но иногда избегает жёстких управленческих решений" },
  { name: "Коммуникация", val: 83, req: 78, desc: "Сильный навык. Чётко доносит продуктовую стратегию до стейкхолдеров и переводит требования бизнеса на язык разработки" },
  { name: "Планирование", val: 79, req: 80, desc: "Грамотно строит роадмап и декомпозирует фичи. Балансирует между бизнес-целями и техническими ограничениями команды" },
  { name: "Адаптивность", val: 77, req: 74, desc: "Работала в банке, финтех-стартапе и EdTech — легко переключается между разными процессами и быстро осваивает новые домены" },
  { name: "Стрессоустойчивость", val: 71, req: 82, desc: "Сохраняет собранность при сжатых сроках релизов. Речь ровная, но прямых кейсов работы в острых кризисах в интервью немного" },
  { name: "Командная работа", val: 62, req: 78, desc: "Ориентирована на совместный результат, активно вовлекает дизайн и аналитику, но склонна замыкать ключевые решения на себе" },
  { name: "Эмпатия", val: 76, req: 80, desc: "Глубоко понимает боли пользователей через кастдев и интервью. Опирается на реальную обратную связь, а не только на цифры" },
  { name: "Решение проблем", val: 84, req: 83, desc: "Сильнейший навык. Формулирует гипотезы, проверяет их экспериментами и находит решения на основе данных и юнит-экономики" },
  { name: "Критическое мышление", val: 82, req: 79, desc: "Подвергает сомнению ценность фич, отсекает лишнее по данным и фокусирует команду на метриках, которые реально двигают продукт" },
];

const RADAR: { l: string; v: number; req: number }[] = [
  { l: "Управление", v: 68, req: 84 }, { l: "Лидерство", v: 55, req: 82 }, { l: "Коммуникация", v: 85, req: 78 },
  { l: "Планирование", v: 72, req: 80 }, { l: "Адаптивность", v: 78, req: 74 }, { l: "Стрессоустойчивость", v: 52, req: 82 },
  { l: "Командная работа", v: 38, req: 78 }, { l: "Эмпатия", v: 70, req: 80 }, { l: "Решение проблем", v: 80, req: 83 },
  { l: "Критическое мышление", v: 76, req: 79 },
];

/* оценка корпоративной совместимости — кандидат против эталонного профиля культуры */
type CDim = { name: string; val: number; ref: number };
const COMPAT_SCORE = 79;
const COMPAT_DIMS: CDim[] = [
  { name: "Ориентация на данные", val: 86, ref: 80 },
  { name: "Ориентация на результат", val: 83, ref: 78 },
  { name: "Клиентоориентированность", val: 80, ref: 76 },
  { name: "Инновационность / гибкость", val: 74, ref: 70 },
  { name: "Ориентация на людей", val: 72, ref: 70 },
  { name: "Командная работа", val: 60, ref: 78 },
  { name: "Стабильность и процессы", val: 64, ref: 72 },
];
const COMPAT_MATCHES: [string, string][] = [
  ["Принимает решения на данных", "Опирается на метрики и эксперименты, а не на интуицию — снижает цену продуктовых ошибок."],
  ["Держит фокус на результате", "Доводит фичи до выхода и измеряет эффект — совпадает с продуктовой культурой команды."],
  ["Слышит пользователя", "Регулярно проводит кастдев и встраивает обратную связь в бэклог — продукт ближе к рынку."],
];
const COMPAT_ATTENTION: [string, string][] = [
  ["Командное взаимодействие", "Склонна замыкать ключевые решения на себе. На старте стоит договориться о прозрачном распределении ответственности."],
  ["Процессная дисциплина", "Гибкий стиль может конфликтовать со строгими регламентами. Лучше заранее обозначить обязательные процессы."],
];
const dimTone = (g: number) => (g >= 0 ? { c: GREEN, l: "Соответствует" } : g >= -8 ? { c: AMBER, l: "Близко" } : { c: RED, l: "Ниже эталона" });

export default function ReportPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Skill | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* появление секций из блюра + лёгкое увеличение */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".rv").forEach((el) => {
        gsap.fromTo(el,
          { autoAlpha: 0, y: 46, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* блокируем скролл фона при открытой модалке */
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <div ref={rootRef} className="relative w-full" style={{ color: INK }}>
      {/* HERO */}
      <section className="mx-auto max-w-[1100px] px-6 pt-36 pb-8 text-center md:px-8 lg:pt-40">
        <h1 className="rv mx-auto mt-5 text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-tight">Результат анализа</h1>
        <p className="rv mx-auto mt-4 max-w-2xl text-lg text-[#183833]/65">Детальный разбор soft skills и корпоративной совместимости на основе реального интервью</p>
      </section>

      <div className="mx-auto max-w-[1100px] space-y-5 px-5 pb-24 md:px-8">
        {/* 0 · шапка кандидата + соответствие */}
        <div className="rv flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#e6ece4] bg-white p-6 shadow-[0_16px_44px_rgba(24,56,51,0.06)] sm:flex-row sm:items-center md:px-8">
          <div>
            <h2 className="text-[1.7rem] font-bold leading-tight tracking-tight" style={{ color: INK }}>Елена Воронцова</h2>
            <p className="mt-1.5 text-[15px] font-semibold leading-snug" style={{ color: TEAL }}>Ведущий продуктовый менеджер</p>
            <p className="text-[15px] font-medium leading-snug" style={{ color: `${TEAL}b3` }}>FinTech · B2B</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#183833]/50">Соответствие</p>
            <ComplianceRing value={81} />
          </div>
        </div>

        {/* 1 · кандидат + решение */}
        <div className="rv grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-bold">Информация о кандидате</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Info icon={<Briefcase className="h-4 w-4" />} t="Опыт" v="7 лет" />
              <Info icon={<Building2 className="h-4 w-4" />} t="Компании" v="Тинькофф, СберТех, EdTech" />
              <Info icon={<Wallet className="h-4 w-4" />} t="Ожидания" v="$3 200 (на руки)" />
              <Info icon={<Home className="h-4 w-4" />} t="Формат" v="офис / гибрид" />
            </div>
            <p className="mt-4 border-t border-[#eef0ee] pt-4 text-[15px] leading-relaxed text-[#183833]/70">
              Продуктовый менеджер в финтехе с фокусом на B2B-продуктах. Запускала платёжные и аналитические сервисы с нуля,
              управляла бэклогом и метриками, принимала решения на основе данных и юнит-экономики
            </p>
          </Card>

          <div className="rounded-3xl border border-[#d8ecc4] bg-gradient-to-br from-[#f3faea] to-[#eef7e0] p-5 shadow-[0_16px_44px_rgba(24,56,51,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-base font-bold"><Check className="h-5 w-5" style={{ color: GREEN }} /> Решение о переходе на следующий этап</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold shadow-sm" style={{ color: GREEN }}><Check className="h-3.5 w-3.5" /> Рекомендован</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[13px] font-semibold" style={{ color: GREEN }}>Аргументы «За»</p>
                <ul className="mt-2 space-y-1.5">{ARGS_FOR.map((a) => <li key={a} className="flex items-start gap-1.5 text-[13px] text-[#183833]/75"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} /> {a}</li>)}</ul>
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: RED }}>Аргументы «Против»</p>
                <ul className="mt-2 space-y-1.5">{ARGS_AGAINST.map((a) => <li key={a} className="flex items-start gap-1.5 text-[13px] text-[#183833]/75"><X className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: RED }} /> {a}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2 · оценка корпоративной совместимости */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Оценка корпоративной совместимости</h2>
          <p className="mx-auto mt-1 max-w-xl text-center text-[13px] text-[#183833]/55">Насколько ценности и поведение кандидата совпадают с ДНК и культурным кодом компании</p>

          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            {/* индекс совместимости */}
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-[#d8ecc4] bg-gradient-to-br from-[#f3faea] via-white to-[#eef7e0] p-6 shadow-[0_16px_44px_rgba(24,56,51,0.07)]">
              <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#7AB800]/12 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-[-30%] h-32 w-32 rounded-full bg-[#11AFCC]/8 blur-3xl" />
              <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#183833]/45"><Dna className="h-4 w-4" style={{ color: GREEN }} /> Индекс совместимости</p>
              <div className="relative mt-1 flex justify-center"><FitGauge value={COMPAT_SCORE} /></div>
              <div className="relative -mt-1 flex justify-center"><span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold shadow-sm" style={{ color: GREEN }}><Check className="h-3.5 w-3.5" /> Высокая совместимость</span></div>
              <p className="relative mt-4 text-center text-sm leading-relaxed text-[#183833]/75">Кандидат хорошо подойдёт команде, где важны <b style={{ color: INK }}>данные, гипотезы и быстрые эксперименты</b>: её сильные стороны совпадают с требованиями позиции. Главное, на что обратить внимание при адаптации, — командное взаимодействие.</p>
              <div className="relative mt-auto grid grid-cols-2 gap-3 pt-5">
                <div className="rounded-2xl bg-white/70 p-3 text-center"><p className="text-2xl font-bold" style={{ color: GREEN }}>{COMPAT_DIMS.filter((d) => d.val >= d.ref).length}</p><p className="mt-0.5 text-[11px] text-[#183833]/55">сильных совпадения</p></div>
                <div className="rounded-2xl bg-white/70 p-3 text-center"><p className="text-2xl font-bold" style={{ color: AMBER }}>{COMPAT_DIMS.filter((d) => d.val < d.ref).length}</p><p className="mt-0.5 text-[11px] text-[#183833]/55">зоны внимания</p></div>
              </div>
            </div>

            {/* совпадение по измерениям культуры */}
            <Card className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: `${GREEN}1a` }}><Target className="h-4 w-4" style={{ color: GREEN }} /></span> Совпадение по измерениям</p>
                <span className="flex items-center gap-1.5 text-[11px] text-[#183833]/45"><span className="inline-block h-2.5 w-4 rounded-full border border-[#cfd6ce]" style={{ background: "#e0e5df" }} /> разрыв до эталона</span>
              </div>
              <div className="mt-4 flex flex-1 flex-col justify-between gap-3">
                {COMPAT_DIMS.map((d) => <DimRow key={d.name} d={d} mounted={mounted} />)}
              </div>
            </Card>
          </div>

          {/* сильные совпадения / зоны внимания */}
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-[#d8ecc4] bg-[#f3faea] p-5">
              <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest" style={{ color: GREEN }}><Sparkles className="h-4 w-4" /> Сильные совпадения</p>
              <div className="mt-3 space-y-2.5">{COMPAT_MATCHES.map(([t, x]) => <div key={t} className="rounded-2xl bg-white/70 p-3.5"><p className="text-sm font-bold" style={{ color: INK }}>{t}</p><p className="mt-0.5 text-[13px] leading-snug text-[#183833]/65">{x}</p></div>)}</div>
            </div>
            <div className="rounded-3xl border border-[#f1d9a8] bg-[#fdf6e9] p-5">
              <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest" style={{ color: AMBER }}><AlertTriangle className="h-4 w-4" /> Зоны внимания</p>
              <div className="mt-3 space-y-2.5">{COMPAT_ATTENTION.map(([t, x]) => <div key={t} className="rounded-2xl bg-white/70 p-3.5"><p className="text-sm font-bold" style={{ color: INK }}>{t}</p><p className="mt-0.5 text-[13px] leading-snug text-[#183833]/65">{x}</p></div>)}</div>
            </div>
          </div>
        </section>

        {/* 3 · риски / сильные / психолингвистика */}
        <div className="rv grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: RED }}><Flame className="h-4 w-4" /> Риски</h3>
            <Block t="Командное взаимодействие" badge="Важно" bc={RED} text="Склонна замыкать ключевые решения на себе — есть риск стать узким горлышком в большой команде" />
            <Block t="Опыт массового B2C" badge="Важно" bc={AMBER} text="Весь опыт сосредоточен в B2B-финтехе. В продукте на массовую аудиторию может не хватить интуиции по поведению пользователей" />
            <Block t="Зарплатные ожидания" badge="Заметка" bc={AMBER} text="Ожидания выше средних по рынку для роли. Стоит заранее сверить вилку и зону ответственности" />
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: GREEN }}><Sparkles className="h-4 w-4" /> Сильные стороны</h3>
            <Block t="Data-driven подход" text="Принимает продуктовые решения на основе метрик, A/B-тестов и юнит-экономики, а не интуиции" />
            <Block t="Полный цикл продукта" text="Ведёт продукт от гипотезы и кастдева до запуска и итерационного развития по данным" />
            <Block t="Клиентоориентированность" text="Глубоко погружается в боли пользователей и встраивает обратную связь в приоритизацию бэклога" />
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: TEAL }}><AudioLines className="h-4 w-4" /> Психолингвистика</h3>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold"><span style={{ color: INK }}>Мы</span><span style={{ color: INK }}>Я</span></div>
              <div className="relative mt-1.5 h-1.5 rounded-full bg-[#eef2ec]">
                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000" style={{ width: mounted ? "70%" : "0%", background: `linear-gradient(90deg,${TEAL},${GREEN})` }} />
                <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition-[left] duration-1000" style={{ left: mounted ? "70%" : "0%", background: GREEN }} />
              </div>
            </div>
            <Block t="Баланс «Я» / «Мы»" text="Смещение к «Я»: чаще говорит о собственных решениях и гипотезах, реже — о вкладе команды" />
            <Block t="Тон" text="Живой, энергичный, уверенный. Речь быстрая и структурная, с чёткой аргументацией" />
            <Block t="Локус контроля" text="Внутренний: связывает результаты продукта со своими решениями и проверенными гипотезами" />
          </Card>
        </div>

        {/* 3 · диаграмма соответствия */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Диаграмма соответствия</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] text-[#183833]/55">График показывает зоны отставания кандидата от требований профиля</p>
          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.3fr_1fr]">
            <Card><RoseChart /></Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-[#e6ece4] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(24,56,51,0.05)]"><span className="text-base font-bold">Среднее отклонение</span><span className="flex items-center gap-1 text-base font-bold" style={{ color: AMBER }}>7% <ChevronDown className="h-4 w-4" /></span></div>
              <Card className="flex flex-1 flex-col">
                <p className="flex items-center gap-2 text-base font-bold" style={{ color: RED }}><Flame className="h-4 w-4" /> Главные риски</p>
                <div className="mt-3 space-y-3">
                  {([
                    ["Командная работа", "16%", "Склонна замыкать ключевые решения на себе; не хватает примеров делегирования и распределённой ответственности"],
                    ["Стрессоустойчивость", "11%", "Сохраняет собранность под дедлайнами, но в интервью мало прямых кейсов работы в острых кризисах"],
                    ["Лидерство", "9%", "Лидирует через продуктовое видение и данные; не хватает примеров жёстких управленческих решений в сложных условиях"],
                  ] as [string, string, string][]).map(([k, v, dsc], i) => (
                    <div key={k} className={i ? "border-t border-[#eef0ee] pt-3" : ""}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{k}</span>
                        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: RED }}>{v} <ChevronDown className="h-3.5 w-3.5" /></span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#183833]/65">{dsc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-[#eef0ee] pt-4">
                  <p className="flex items-center gap-2 text-base font-bold" style={{ color: GREEN }}><Sparkles className="h-4 w-4" /> Наибольшее соответствие</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#183833]/75">Профиль кандидата максимально близок к требованиям по навыкам «Коммуникация» и «Решение проблем»</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 4 · карта soft skills */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Карта soft skills</h2>
          <p className="mx-auto mt-1 max-w-lg text-center text-[13px] text-[#183833]/55">Подробный gap-анализ, мини-диаграмма и цитаты открываются в модальном окне</p>
          <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
            {SKILLS.map((s) => <SkillCard key={s.name} s={s} mounted={mounted} onOpen={() => setActive(s)} />)}
          </div>
        </section>

        {/* 5 · кейсы STAR */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Кейсы (модель STAR)</h2>
          <div className="mt-4 space-y-4">
            <StarCase title="Кейс 1: Запуск B2B-сервиса аналитики платежей для бизнеса"
              s="Клиенты банка не понимали структуру своих платёжных потоков, из-за чего отток на тарифах для бизнеса рос"
              t="Запустить продукт, который наглядно показывает аналитику платежей и удерживает бизнес-клиентов"
              a="Вела продукт как PO: провела кастдев, сформулировала гипотезы, приоритизировала бэклог и довела MVP до релиза с командой из 10 человек"
              r="MVP вышел за 4 месяца; по A/B-тесту удержание на сегменте выросло, отток снизился на заметную величину"
              note="Сильный кейс полного продуктового цикла с опорой на данные. Слабое место — результат описан частично без полной декомпозиции метрик" />
            <StarCase title="Кейс 2: Перестройка онбординга в EdTech-продукте по данным"
              s="В EdTech-сервисе пользователи массово отваливались на первых шагах, активация была низкой"
              t="Поднять активацию новых пользователей и довести их до первого ценностного действия"
              a="Построила воронку, нашла узкие места по аналитике, выдвинула гипотезы и прогнала серию A/B-тестов нового онбординга"
              r="Активация новых пользователей выросла по итогам экспериментов; найденные паттерны переиспользовали в других потоках"
              note="Отлично показывает аналитическое и гипотезно-экспериментальное мышление. Роль здесь сильнее раскрывает работу с метриками, чем управление командой" />
          </div>
        </section>

        {/* 7 · рекомендации */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Рекомендации для следующих этапов</h2>
          <div className="mt-4 space-y-3">
            <Reco title="Делегирование и работа с командой" text="Кандидат склонна замыкать ключевые решения на себе. Важно понять, как она масштабирует ответственность в большой команде"
              qs={["Опишите ситуацию, когда вы делегировали важное продуктовое решение. Как контролировали результат?", "Как вы вовлекаете команду в формирование гипотез, а не только в исполнение?", "Что вы делаете, когда мнение сильного разработчика расходится с вашим продуктовым видением?"]} />
            <Reco title="Опыт в B2C и массовых продуктах" text="Весь опыт сосредоточен в B2B-финтехе. Неясно, как кандидат сработает в продукте на широкую аудиторию"
              qs={["Чем, по-вашему, продуктовая работа в B2C отличается от B2B, с которым вы работали?", "Как бы вы строили приоритизацию, если у продукта миллионы разнородных пользователей?", "Какие гипотезы вы бы проверяли первыми, выходя на незнакомый массовый рынок?"]} />
            <Reco title="Управление стейкхолдерами и конфликты приоритетов" text="Нужно проверить, как кандидат балансирует интересы бизнеса, продаж и разработки при ограниченных ресурсах"
              qs={["Опишите самый острый конфликт приоритетов между отделами. Как вы его разрешили?", "Как вы согласуете роадмап, когда у бизнеса и разработки разные ожидания по срокам?", "Что вы будете делать, если продажи требуют фичу «вчера», а данные говорят, что она не нужна?"]} />
          </div>
        </section>

        <p className="rv text-center text-xs text-[#183833]/40">TalentMind · автоматически сгенерированный отчёт · демо-данные</p>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ДЕТАЛИ НАВЫКА */}
      {active && <SkillModal s={active} onClose={() => setActive(null)} />}
    </div>
  );
}

/* ============================================================
   Модальное окно — детальный разбор навыка
   ============================================================ */
function SkillModal({ s, onClose }: { s: Skill; onClose: () => void }) {
  const gap = s.val - s.req;
  const lc = s.val >= 70 ? GREEN : s.val >= 50 ? AMBER : RED;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <style>{`@keyframes skillFade{from{opacity:0}to{opacity:1}}
        @keyframes skillPop{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes coneGrow{from{transform:scaleX(0);opacity:.2}to{transform:scaleX(1);opacity:1}}
        @keyframes legendIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <div className="absolute inset-0 bg-[#0d1b17]/45 backdrop-blur-sm" style={{ animation: "skillFade .28s ease both" }} onClick={onClose} />
      <div className="relative z-10 w-[min(1080px,94vw)] max-h-[90vh] overflow-y-auto rounded-[26px] border border-[#e6ece4] bg-white p-6 shadow-[0_60px_140px_rgba(13,27,23,0.5)] md:p-9" data-lenis-prevent style={{ animation: "skillPop .36s cubic-bezier(.22,1,.36,1) both" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight" style={{ color: INK }}>{s.name}</h3>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#183833]/65">{s.desc}</p>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e6ece4] text-[#183833]/55 transition-colors hover:bg-[#f4f7f2] hover:text-[#183833]"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* ожидания + разрыв */}
          <div className="space-y-4">
            <SoftCard t="Ожидания от роли" text="Требуется уверенное владение навыком на всех этапах жизненного цикла продукта — от гипотезы и кастдева до запуска и анализа метрик" />
            <SoftCard t="Разрыв" text={gap < 0 ? "Небольшой разрыв. Кандидат уверенно работает с данными и пользователями. Для более высокой оценки не хватило кейсов командного лидерства и делегирования" : "Разрыва нет — кандидат соответствует требованиям профиля или превосходит их по этому навыку"} />
          </div>
          {/* диаграмма */}
          <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[#e6ece4] bg-gradient-to-br from-[#f7fbf0] via-white to-[#eef7e0] p-6">
            <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#7AB800]/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-[-30%] h-32 w-32 rounded-full bg-[#11AFCC]/8 blur-3xl" />
            <ConeChart val={s.val} req={s.req} color={lc} />
            <div className="relative flex-1">
              <p className="text-sm font-semibold" style={{ color: INK }}>{s.name} <span className="ml-1 text-2xl font-bold" style={{ color: lc }}>{s.val}%</span></p>
              <div className="mt-4 space-y-2.5 text-xs">
                <LegendRow c="#bfe3ec" t="Разрыв" v={`${gap > 0 ? "+" : ""}${gap}%`} vc={gap < 0 ? RED : GREEN} d={0.5} />
                <LegendRow c={lc} t="Уровень кандидата" v={`${s.val}%`} d={0.62} />
                <LegendRow c="#d6ebf2" t="Требования профиля" v={`${s.req}%`} d={0.74} />
              </div>
            </div>
          </div>
        </div>

        {/* почему не выше / ниже */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#fff5f5] p-5">
            <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: RED }}><TrendingDown className="h-4 w-4" /> Почему не выше</p>
            <p className="mt-2 text-[15px] leading-snug text-[#183833]/70">Кандидат сильна в анализе и гипотезах, но реже показывает командное лидерство: ключевые решения чаще принимает сама, чем выращивает их в команде</p>
          </div>
          <div className="rounded-2xl bg-[#f3faea] p-5">
            <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}><TrendingUp className="h-4 w-4" /> Почему не ниже</p>
            <p className="mt-2 text-[15px] leading-snug text-[#183833]/70">Сильная ориентация на данные и пользователя. Кандидат умеет ставить гипотезы, проверять их экспериментами и доводить продукт до измеримого результата</p>
          </div>
        </div>

        {/* аудиомаркеры */}
        <div className="mt-4 rounded-2xl bg-[#f6faef] p-5">
          <p className="text-sm font-bold" style={{ color: INK }}>Аудиомаркеры</p>
          <p className="mt-1 text-[13px] text-[#183833]/55">Говоря о продукте, звучит энергично и уверенно, опираясь на цифры и гипотезы</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["Ускоряет темп речи, когда переходит к метрикам и результатам экспериментов — заметна вовлечённость в данные", "Структурно проговаривает «гипотеза → проверка → вывод», что выдаёт зрелый продуктовый подход"].map((m) => (
              <div key={m} className="flex items-start gap-2"><AudioLines className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN }} /><span className="text-[13px] leading-snug text-[#183833]/65">{m}</span></div>
            ))}
          </div>
        </div>

        {/* цитаты */}
        <div className="mt-4 rounded-2xl bg-[#f6faef] p-5">
          <p className="text-sm font-bold" style={{ color: INK }}>Цитаты</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["Я никогда не запускаю фичу, пока не сформулирую гипотезу и метрику, по которой пойму, сработала ли она", "Мы увидели по воронке, где именно отваливаются клиенты, и переписали этот шаг онбординга", "Я провела десяток интервью, прежде чем поняла настоящую боль бизнеса"].map((q) => (
              <div key={q} className="flex items-start gap-2"><MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN }} /><span className="text-[13px] italic leading-snug text-[#183833]/60">{q}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* оттенки конуса по уровню (светлый · базовый · тёмный) */
const CONE_SHADES: Record<string, [string, string, string]> = {
  [GREEN]: ["#a4d44a", "#7AB800", "#5f9b00"],
  [AMBER]: ["#f6cf63", "#E8A317", "#bd840c"],
  [RED]: ["#ff8f8f", "#FF5252", "#dd3b3b"],
};
/* конусная диаграмма уровня (анимированная, цвет и длина по проценту) */
function ConeChart({ val, req, color }: { val: number; req: number; color: string }) {
  const W = 196, H = 132, cy = H / 2, x0 = 16, x1 = W - 16, maxH = H - 26;
  const Lfull = x1 - x0, half = maxH / 2;
  const [c0, c1, c2] = CONE_SHADES[color] ?? CONE_SHADES[GREEN];
  /* конус занимает val% длины шкалы, толщина растёт пропорционально */
  const xv = x0 + (val / 100) * Lfull, hv = (val / 100) * half;
  const xr = x0 + (req / 100) * Lfull, hr = (req / 100) * half;
  const gid = "coneFill", fid = "coneGlow";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[124px] w-[186px] shrink-0 overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c0} />
          <stop offset="55%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <filter id={fid} x="-30%" y="-40%" width="160%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor={c1} floodOpacity="0.34" />
        </filter>
      </defs>

      {/* требования профиля — пунктирный контур до req% */}
      <polygon points={`${x0},${cy} ${xr},${cy - hr} ${xr},${cy + hr}`} fill="#bfe3ec" fillOpacity="0.16" stroke="#a9d8e6" strokeWidth="1.8" strokeDasharray="4 4" strokeLinejoin="round" style={{ animation: "skillFade .4s ease .15s both" }} />
      <line x1={xr} y1={cy - hr} x2={xr} y2={cy + hr} stroke="#a9d8e6" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 4" style={{ animation: "skillFade .4s ease .15s both" }} />

      {/* уровень кандидата — растущий конус до val% */}
      <g style={{ transformOrigin: `${x0}px ${cy}px`, animation: "coneGrow 1s cubic-bezier(.22,1,.36,1) .12s both" }}>
        <polygon points={`${x0},${cy} ${xv},${cy - hv} ${xv},${cy + hv}`} fill={`url(#${gid})`} filter={`url(#${fid})`} strokeLinejoin="round" />
        <line x1={xv} y1={cy - hv} x2={xv} y2={cy + hv} stroke={c2} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* вершина */}
      <circle cx={x0} cy={cy} r="3.4" fill={c2} style={{ animation: "skillFade .4s ease .35s both" }} />
    </svg>
  );
}
function LegendRow({ c, t, v, vc, d = 0 }: { c: string; t: string; v: string; vc?: string; d?: number }) {
  return (
    <div className="flex items-center justify-between" style={{ animation: `legendIn .5s ease ${d}s both` }}>
      <span className="flex items-center gap-2 text-[#183833]/70"><span className="h-3 w-3 rounded-sm" style={{ background: c }} /> {t}</span>
      <span className="font-bold tabular-nums" style={{ color: vc || INK }}>{v}</span>
    </div>
  );
}
function SoftCard({ t, text }: { t: string; text: string }) {
  return <div className="rounded-2xl bg-[#f6faef] p-5"><p className="text-sm font-bold" style={{ color: INK }}>{t}</p><p className="mt-2 text-[15px] leading-snug text-[#183833]/70">{text}</p></div>;
}
/* карточка «точка совпадения / трения» */
/* кольцо соответствия в шапке кандидата */
function ComplianceRing({ value }: { value: number }) {
  const r = 36, circ = 2 * Math.PI * r, off = circ - (value / 100) * circ;
  return (
    <div className="relative h-[96px] w-[96px]">
      <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90">
        <defs><linearGradient id="compG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a4d44a" /><stop offset="100%" stopColor="#5f9b00" /></linearGradient></defs>
        <style>{`@keyframes compDraw{from{stroke-dashoffset:${circ.toFixed(1)}}to{stroke-dashoffset:${off.toFixed(1)}}}`}</style>
        <circle cx="48" cy="48" r={r} fill="none" stroke="#eef2ec" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke="url(#compG)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circ.toFixed(1)} style={{ strokeDashoffset: off.toFixed(1), animation: "compDraw 1.2s cubic-bezier(.22,1,.36,1) .2s both" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold" style={{ color: "#5f9b00" }}>{value}%</span></div>
    </div>
  );
}
/* полукруглый гейдж индекса совместимости */
function FitGauge({ value }: { value: number }) {
  const circ = Math.PI * 64, off = circ - (value / 100) * circ;
  return (
    <svg viewBox="0 0 168 100" className="w-full max-w-[200px] overflow-visible">
      <defs>
        <linearGradient id="fitG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#11AFCC" /><stop offset="100%" stopColor="#7AB800" /></linearGradient>
      </defs>
      <style>{`@keyframes gaugeDraw{from{stroke-dashoffset:${circ.toFixed(1)}}to{stroke-dashoffset:${off.toFixed(1)}}}`}</style>
      <path d="M20,88 A64,64 0 0 1 148,88" fill="none" stroke="#e7eee4" strokeWidth="13" strokeLinecap="round" />
      <path d="M20,88 A64,64 0 0 1 148,88" fill="none" stroke="url(#fitG)" strokeWidth="13" strokeLinecap="round" strokeDasharray={circ.toFixed(1)} style={{ strokeDashoffset: off.toFixed(1), animation: "gaugeDraw 1.2s cubic-bezier(.22,1,.36,1) .2s both" }} />
      <text x="84" y="80" textAnchor="middle" fontSize="34" fontWeight="800" fill={INK}>{value}<tspan fontSize="17" dy="-2">%</tspan></text>
    </svg>
  );
}
/* строка измерения культуры: кандидат vs эталон (bullet-полоса) */
function DimRow({ d, mounted }: { d: CDim; mounted: boolean }) {
  const g = d.val - d.ref, t = dimTone(g);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium" style={{ color: INK }}>{d.name}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: `${t.c}1a`, color: t.c }}>{t.l}</span>
          <span className="text-[13px] font-bold tabular-nums" style={{ color: t.c }}>{d.val}<span className="font-medium text-[#183833]/35"> / {d.ref}</span></span>
        </span>
      </div>
      <div className="relative mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#eef2ec]">
        {/* разрыв до требуемого уровня (эталона) */}
        {g < 0 && (
          <div className="absolute inset-y-0 rounded-r-full" style={{ left: mounted ? `${d.val}%` : "0%", width: mounted ? `${-g}%` : "0%", background: "repeating-linear-gradient(-45deg,#dfe4de,#dfe4de 3px,#eceff0 3px,#eceff0 6px)", transition: "left 1.1s cubic-bezier(.22,1,.36,1), width 1.1s cubic-bezier(.22,1,.36,1)" }} />
        )}
        {/* уровень кандидата */}
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: mounted ? `${d.val}%` : "0%", background: t.c, transition: "width 1.1s cubic-bezier(.22,1,.36,1)" }} />
      </div>
    </div>
  );
}

/* ============================================================
   Мелкие компоненты
   ============================================================ */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-[#e6ece4] bg-white p-5 shadow-[0_16px_44px_rgba(24,56,51,0.06)] ${className}`}>{children}</div>;
}
function Info({ icon, t, v }: { icon: React.ReactNode; t: string; v: string }) {
  return <div className="flex items-start gap-2"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f4f7f2] text-[#7AB800]">{icon}</span><div><p className="text-[11px] font-semibold uppercase tracking-wide text-[#183833]/45">{t}</p><p className="text-[13px] font-medium">{v}</p></div></div>;
}
function Block({ t, text, badge, bc }: { t: string; text: string; badge?: string; bc?: string }) {
  return <div className="mt-3 border-t border-[#eef0ee] pt-3"><div className="flex items-center justify-between gap-2"><p className="text-[13px] font-semibold">{t}</p>{badge && <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ background: `${bc}1a`, color: bc }}>{badge}</span>}</div><p className="mt-1 text-xs leading-snug text-[#183833]/65">{text}</p></div>;
}
function SkillCard({ s, mounted, onOpen }: { s: Skill; mounted: boolean; onOpen: () => void }) {
  const c = s.val >= 70 ? GREEN : s.val >= 50 ? AMBER : RED;
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{s.name}</p><span className="text-sm font-bold" style={{ color: c }}>{s.val}%</span></div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]"><div className="h-full rounded-full transition-[width] duration-[1100ms] ease-out" style={{ width: mounted ? `${s.val}%` : "0%", background: c }} /></div>
      <p className="mt-2 text-xs leading-snug text-[#183833]/65">{s.desc}</p>
      <button onClick={onOpen} className="ease-smooth mt-auto inline-flex w-fit items-center gap-1.5 self-start rounded-full border border-[#d8ecc4] px-3.5 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:bg-[#f3faea]" style={{ color: GREEN, marginTop: "auto" }}>Подробнее →</button>
    </Card>
  );
}
function StarCase({ title, s, t, a, r, note }: { title: string; s: string; t: string; a: string; r: string; note: string }) {
  const rows: [string, string, string][] = [["Ситуация", s, TEAL], ["Задача", t, GREEN], ["Действие", a, AMBER], ["Результат", r, GREEN]];
  return (
    <Card>
      <p className="text-sm font-bold">{title}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([k, v, c]) => <div key={k} className="rounded-2xl bg-[#f6faef] p-3"><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: c }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {k}</p><p className="mt-1 text-xs leading-snug text-[#183833]/70">{v}</p></div>)}
      </div>
      <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[#d8ecc4] bg-[#f3faea] p-3.5"><MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN }} /><div><p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}>Оценка</p><p className="mt-0.5 text-xs leading-snug text-[#183833]/70">{note}</p></div></div>
    </Card>
  );
}
function Reco({ title, text, qs }: { title: string; text: string; qs: string[] }) {
  return (
    <Card>
      <p className="flex items-center gap-2 text-base font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: `${TEAL}1a`, color: TEAL }}><GitBranch className="h-4 w-4" /></span> {title}</p>
      <p className="mt-2 text-[15px] leading-snug text-[#183833]/65">{text}</p>
      <ul className="mt-3 space-y-2">{qs.map((q) => <li key={q} className="flex items-start gap-2 rounded-xl bg-[#f6faef] px-3 py-2 text-[13px] text-[#183833]/75"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GREEN }} /> {q}</li>)}</ul>
    </Card>
  );
}
/* роза-диаграмма (полярные сектора) */
function RoseChart() {
  const N = RADAR.length, cx = 280, cy = 220, R = 140, seg = 360 / N, pad = 1.6, labelR = R + 18;
  const lvl = (v: number) => (v >= 60 ? GREEN : v >= 40 ? "#bcdd93" : "#f2a0a0");
  const rad = (d: number) => (d * Math.PI) / 180;
  /* пирог-сектор от центра до радиуса r */
  const sector = (r: number, i: number) => {
    const a0 = rad(i * seg - 90 + pad), a1 = rad((i + 1) * seg - 90 - pad);
    return `M ${cx} ${cy} L ${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)} Z`;
  };
  /* направляющая дуга на радиусе r */
  const arc = (r: number, i: number) => {
    const a0 = rad(i * seg - 90 + pad), a1 = rad((i + 1) * seg - 90 - pad);
    return `M ${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}`;
  };
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 560 480" className="w-full max-w-[520px]">
        {/* вся шкала 0–100% — нейтральная подложка сектора */}
        {RADAR.map((_, i) => <path key={`bg${i}`} d={sector(R, i)} fill="#eef1f3" stroke="#ffffff" strokeWidth="2.5" />)}
        {/* тонкие концентрические направляющие шкалы */}
        {[0.25, 0.5, 0.75, 1].map((f) => RADAR.map((_, i) => <path key={`g${f}-${i}`} d={arc(R * f, i)} fill="none" stroke="#d2dce2" strokeWidth="1" opacity="0.7" />))}
        {/* требования профиля — светло-голубой сектор до уровня req */}
        {RADAR.map((d, i) => <path key={`req${i}`} d={sector((R * d.req) / 100, i)} fill="#bcd9ec" stroke="#ffffff" strokeWidth="1.5" />)}
        {/* уровень кандидата — закрашенный сектор по значению */}
        {RADAR.map((d, i) => <path key={`v${i}`} d={sector((R * d.v) / 100, i)} fill={lvl(d.v)} style={{ transformOrigin: `${cx}px ${cy}px`, animation: `roseG .7s ease-out ${0.04 * i + 0.1}s both` }} />)}
        {/* значения % кандидата внутри сектора */}
        {RADAR.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), rr = R * 0.66;
          return <text key={`p${i}`} x={(cx + rr * Math.cos(a)).toFixed(1)} y={(cy + rr * Math.sin(a)).toFixed(1)} fontSize="13" fontWeight="700" fill="#2b4a44" textAnchor="middle" dominantBaseline="middle">{d.v}%</text>;
        })}
        {/* подписи навыков снаружи */}
        {RADAR.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), ca = Math.cos(a);
          const anchor = ca > 0.15 ? "start" : ca < -0.15 ? "end" : "middle";
          return <text key={`l${i}`} x={(cx + labelR * ca).toFixed(1)} y={(cy + labelR * Math.sin(a)).toFixed(1)} fontSize="12.5" fill="#3a4f4a" textAnchor={anchor} dominantBaseline="middle">{d.l}</text>;
        })}
        <style>{`@keyframes roseG{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#183833]/70 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-4">
        <Lg c="#bcd9ec" t="Требования профиля" /><Lg c="#f2a0a0" t="Низкий уровень навыка" /><Lg c="#bcdd93" t="Средний уровень навыка" /><Lg c={GREEN} t="Высокий уровень навыка" />
      </div>
    </div>
  );
}
function Lg({ c, t }: { c: string; t: string }) { return <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-black/5" style={{ background: c }} /> {t}</span>; }
