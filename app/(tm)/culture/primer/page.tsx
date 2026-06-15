"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dna, Building2, Globe, Users, FileText, Check, AlertTriangle,
  Target, Compass, UserCheck, Lightbulb, ShieldCheck,
  X, TrendingUp, TrendingDown, ExternalLink, MessageSquareQuote,
} from "lucide-react";

/* ── палитра ── */
const GREEN = "#7AB800";
const TEAL = "#11AFCC";
const INK = "#183833";
const AMBER = "#E8A317";
const RED = "#FF5252";

/* ============================================================
   /culture/primer — «Пример отчёта по корпоративной культуре».
   Полностью свёрстанная страница с анимациями: профиль ДНК
   компании по 7 измерениям и детальным параметрам, доминирующий
   тип культуры, сильные стороны и зоны напряжения, портрет
   идеального кандидата и рекомендации по найму.
   ============================================================ */

type Dim = { key: string; name: string; val: number; c: string; sum: string; params: string[] };
const DIMS: Dim[] = [
  { key: "result", name: "Ориентация на результат", val: 70, c: "#FF6B57", sum: "Сильное измерение. Команды держат фокус на пользовательских метриках, но допускают гибкость в путях достижения", params: ["Ориентация на действие", "Ориентация на достижения", "Требовательность", "Высокие ожидания", "Ориентация на результат", "Оплата за результат", "Акцент на качестве"] },
  { key: "stab", name: "Стабильность", val: 52, c: TEAL, sum: "Умеренная. Процессы существуют, но регулярно пересматриваются под рост и новые задачи", params: ["Стабильность", "Предсказуемость", "Осторожность", "Ориентация на правила", "Безопасность занятости", "Низкий уровень конфликтов"] },
  { key: "detail", name: "Внимание к деталям", val: 61, c: "#2E9E8F", sum: "Сбалансированное. Качество важно, но скорость гипотез часто берёт верх над дотошностью", params: ["Аналитичность", "Внимание к деталям", "Точность", "Высокая организованность"] },
  { key: "people", name: "Ориентация на людей", val: 83, c: AMBER, sum: "Доминирующее измерение. Развитие, забота и психологическая безопасность встроены в повседневность", params: ["Справедливость", "Уважение прав личности", "Толерантность", "Поддержка", "Ориентация на людей", "Возможности для роста", "Признание достижений"] },
  { key: "team", name: "Командная ориентация", val: 80, c: "#5BA528", sum: "Очень высокая. Кросс-функциональные команды и совместное принятие решений — основа работы", params: ["Командная ориентация", "Свободный обмен информацией", "Совместная работа", "Дружеские отношения", "Вписывание в коллектив"] },
  { key: "inno", name: "Инновационность", val: 86, c: GREEN, sum: "Сильнейшее измерение. Эксперименты, быстрые гипотезы и право на ошибку поощряются", params: ["Гибкость", "Адаптивность", "Инновационность", "Использование возможностей", "Готовность к экспериментам", "Готовность к риску", "Отсутствие жёстких ограничений"] },
  { key: "aggr", name: "Конкурентность", val: 47, c: "#E07B39", sum: "Самое слабое измерение. Внутри ценится сотрудничество, а не соревнование между людьми", params: ["Конкурентность", "Агрессивность", "Решительность", "Инициативность", "Личная ответственность", "Прямое разрешение конфликтов", "Интенсивность работы"] },
];

/* ── 9 ключевых ценностей, каждая = среднее (ROUND) её OCP-параметров ── */
const nlvl = (v: number) => (v >= 75 ? GREEN : v >= 50 ? AMBER : RED);
const badgeColor = (b: string) => (b === "Системный" ? TEAL : b === "Процессный" ? "#5B8BB0" : b === "Поведенческий" ? GREEN : AMBER);

type Ocp = { ru: string; en: string; n: number; score: number; badge: string; statement: string; lower: string; higher: string; quote?: string };
type Nine = { key: string; ru: string; en: string; score: number; desc: string; gap: string; src: string; params: Ocp[] };

const BIG_NINE: Nine[] = [
  {
    key: "agility", ru: "Гибкость", en: "Agility", score: 82,
    desc: "Гибкость — опора культуры: команды свободно меняют подход и быстро перестраиваются под новые задачи.",
    gap: "Адаптивность высока: решения принимаются на местах, а развороты курса проходят за дни, а не за кварталы. Слабое место — устойчивость процессов при росте.",
    src: "Главный источник: All-Hands Meetings · Вспомогательный: Интервью с командами",
    params: [
      { ru: "Гибкость", en: "Flexibility", n: 1, score: 84, badge: "Поведенческий", statement: "Сотрудники свободно меняют подход — и в своей зоне, и между командами.", lower: "Подход к работе можно менять без длинных согласований", higher: "Иногда не хватает общих ориентиров при частой смене курса", quote: "[All-Hands] «Если есть идея лучше — мы меняем процесс на следующей неделе, а не через квартал.»" },
      { ru: "Адаптивность", en: "Adaptability", n: 2, score: 80, badge: "Поведенческий", statement: "Команды быстро перестраивают тактику и стратегию под обратную связь.", lower: "Быстрая реакция на изменения встроена в ритм работы", higher: "Скорость иногда опережает фиксацию решений" },
      { ru: "Использование возможностей", en: "Being quick to take advantage of opportunities", n: 4, score: 83, badge: "Поведенческий", statement: "Новые возможности подхватываются почти мгновенно.", lower: "Инициативы запускаются без долгой бюрократии", higher: "Не каждая ставка успевает пройти проверку" },
      { ru: "Готовность к экспериментам", en: "A willingness to experiment", n: 5, score: 81, badge: "Ценностный", statement: "Эксперименты — повседневная норма, а не исключение.", lower: "MVP и быстрые гипотезы поощряются", higher: "Часть экспериментов запускается без чётких метрик" },
    ],
  },
  {
    key: "collab", ru: "Коллаборация", en: "Collaboration", score: 85,
    desc: "Живое неформальное сотрудничество: люди легко обращаются друг к другу и решают задачи вместе.",
    gap: "Сотрудничество строится на доверии и открытости, а не на регламентах: помощь коллеге — норма, знания свободно перетекают между командами.",
    src: "Главный источник: Интервью с командами · Вспомогательный: Onboarding-гайд",
    params: [
      { ru: "Командная ориентация", en: "Being team oriented", n: 32, score: 88, badge: "Поведенческий", statement: "Командный результат ценится выше индивидуальных заслуг.", lower: "Общие цели объединяют команды в каждом цикле", higher: "Иногда личный вклад теряется за коллективным" },
      { ru: "Свободный обмен информацией", en: "Sharing information freely", n: 33, score: 83, badge: "Ценностный", statement: "Информация открыта по умолчанию, секретов между командами почти нет.", lower: "Прозрачность и открытые каналы — норма", higher: "Объём информации иногда перегружает" },
      { ru: "Совместная работа", en: "Working in collaboration", n: 34, score: 86, badge: "Поведенческий", statement: "Кросс-функциональные команды — основной формат работы.", lower: "Парная и совместная работа поощряется", higher: "Много синхронизаций отнимают фокус-время" },
      { ru: "Дружеские отношения", en: "Developing friends at work", n: 35, score: 84, badge: "Поведенческий", statement: "Тёплые отношения и дружба на работе — часть культуры.", lower: "Менторы и неформальное общение сближают людей", higher: "Близость иногда мешает прямой обратной связи", quote: "[Onboarding] «Новичка в первый же день знакомят со всей командой за общим обедом.»" },
    ],
  },
  {
    key: "customer", ru: "Клиентоцентричность", en: "Customer", score: 80,
    desc: "Польза для ученика — главный ориентир: каждый в команде регулярно общается с пользователями.",
    gap: "Клиент действительно в центре: продуктовые решения проверяются на живых пользователях, а обратная связь быстро превращается в изменения.",
    src: "Главный источник: Интервью с командами · Вспомогательный: All-Hands Meetings",
    params: [
      { ru: "Ориентация на действие", en: "Action orientation", n: 21, score: 84, badge: "Поведенческий", statement: "Культура «сначала сделай, потом отполируй».", lower: "Быстрый запуск ценится выше идеального плана", higher: "Иногда не хватает паузы на проверку качества" },
      { ru: "Ориентация на результат", en: "Being results oriented", n: 25, score: 76, badge: "Поведенческий", statement: "Решения оцениваются по влиянию на ученика и продукт.", lower: "Пользовательские метрики в фокусе команд", higher: "Путь к результату остаётся гибким" },
      { ru: "Акцент на качестве", en: "An emphasis on quality", n: 27, score: 78, badge: "Ценностный", statement: "Качество контента и продукта — предмет гордости.", lower: "Команды держат высокую планку для учеников", higher: "Скорость гипотез иногда опережает шлифовку", quote: "[Интервью] «Прежде чем катить фичу, мы показываем её паре реальных учеников.»" },
    ],
  },
  {
    key: "diversity", ru: "Разнообразие", en: "Diversity", score: 78,
    desc: "Разные взгляды и фон сотрудников воспринимаются как источник сильных продуктовых решений.",
    gap: "Разнообразие ценится живо: команды собираются из людей с разным опытом, а несогласие приветствуется как способ найти лучшую идею.",
    src: "Главный источник: Onboarding-гайд · Вспомогательный: Отзывы Glassdoor/eNPS",
    params: [
      { ru: "Справедливость", en: "Fairness", n: 14, score: 80, badge: "Ценностный", statement: "К людям относятся по-честному, без скрытых иерархий.", lower: "Возможности открыты независимо от стажа и роли", higher: "Гибкость иногда мешает единым правилам", quote: "[Onboarding] «У нас стажёр может оспорить решение тимлида — и это нормально.»" },
      { ru: "Уважение прав личности", en: "Respect for the individual's rights", n: 15, score: 79, badge: "Ценностный", statement: "Личные границы и автономия сотрудника уважаются.", lower: "Право на своё мнение и стиль работы поощряется", higher: "Свобода требует зрелости в самоорганизации" },
      { ru: "Толерантность", en: "Tolerance", n: 16, score: 74, badge: "Ценностный", statement: "Разные точки зрения принимаются и обсуждаются открыто.", lower: "Несогласие воспринимается конструктивно", higher: "Нет отдельной формализованной DEI-политики" },
    ],
  },
  {
    key: "execution", ru: "Исполнение", en: "Execution", score: 66,
    desc: "Энергичное исполнение: команды быстро доводят идеи до запуска, опираясь на ритм и автономию.",
    gap: "Исполнение держится на драйве и владении задачей, а не на жёстком контроле: темп высокий, но устойчивость процессов под рост ещё формируется.",
    src: "Главный источник: All-Hands Meetings · Вспомогательный: Интервью с командами",
    params: [
      { ru: "Ориентация на достижения", en: "Achievement orientation", n: 22, score: 72, badge: "Поведенческий", statement: "Амбициозные цели драйвят команды на быстрые запуски.", lower: "Цели амбициозны и вдохновляют", higher: "Не всё доводится до системной шлифовки" },
      { ru: "Высокие ожидания", en: "Having high expectations for performance", n: 24, score: 68, badge: "Поведенческий", statement: "Ожидания высоки, но держатся на мотивации, а не на контроле.", lower: "Команды сами ставят себе высокую планку", higher: "Формальных KPI и ревью пока немного" },
      { ru: "Аналитичность", en: "Being analytical", n: 28, score: 63, badge: "Поведенческий", statement: "Решения опираются на данные, но и на быструю интуицию.", lower: "Гипотезы проверяются на пользователях", higher: "Глубина аналитики уступает скорости" },
      { ru: "Внимание к деталям", en: "Paying attention to detail", n: 29, score: 61, badge: "Поведенческий", statement: "Детали важны, но не должны тормозить запуск.", lower: "Качество для ученика держится на уровне", higher: "Скорость иногда побеждает дотошность" },
      { ru: "Высокая организованность", en: "Being highly organized", n: 31, score: 64, badge: "Процессный", statement: "Процессы лёгкие и постоянно эволюционируют.", lower: "Минимум бюрократии, максимум автономии", higher: "При росте не хватает устойчивой структуры", quote: "[Интервью] «Мы только сейчас начинаем описывать процессы — раньше всё держалось на людях.»" },
    ],
  },
  {
    key: "innovation", ru: "Инновации", en: "Innovation", score: 87,
    desc: "Инновации — сердце культуры: новые идеи поощряются, а право на ошибку закреплено в ценностях.",
    gap: "Инновационность — сильнейшее измерение: эксперименты идут постоянно, риск воспринимается как часть обучения, а правил намеренно немного.",
    src: "Главный источник: All-Hands Meetings · Вспомогательный: Интервью с командами",
    params: [
      { ru: "Инновационность", en: "Being innovative", n: 3, score: 89, badge: "Ценностный", statement: "Поиск новых решений — ожидаемое поведение, а не подвиг.", lower: "Идеи рождаются и тестируются на всех уровнях", higher: "Не каждая идея доходит до устойчивого продукта" },
      { ru: "Готовность к экспериментам", en: "A willingness to experiment", n: 5, score: 88, badge: "Ценностный", statement: "Эксперименты запускаются легко и часто.", lower: "Гипотезы проверяются быстро и без бюрократии", higher: "Иногда не хватает дисциплины измерений" },
      { ru: "Готовность к риску", en: "Risk taking", n: 6, score: 84, badge: "Поведенческий", statement: "Разумный риск приветствуется, провал — повод научиться.", lower: "Право на ошибку зафиксировано в ценностях", higher: "Высокий риск иногда не подкреплён данными", quote: "[All-Hands] «Лучше попробовать и ошибиться, чем месяц согласовывать идею.»" },
      { ru: "Отсутствие жёстких ограничений", en: "Not being constrained by many rules", n: 7, score: 86, badge: "Поведенческий", statement: "Правил намеренно мало — свобода действий в приоритете.", lower: "Автономия команд максимальна", higher: "Недостаток правил усложняет масштабирование" },
    ],
  },
  {
    key: "integrity", ru: "Честность", en: "Integrity", score: 81,
    desc: "Открытость и прямота: о проблемах говорят вслух, а ценности реально направляют решения.",
    gap: "Честность высока и держится на доверии: люди дают прямую обратную связь, берут на себя инициативу, а миссия ощущается в повседневной работе.",
    src: "Главный источник: Отзывы Glassdoor/eNPS · Вспомогательный: Onboarding-гайд",
    params: [
      { ru: "Справедливость", en: "Fairness", n: 14, score: 80, badge: "Ценностный", statement: "Решения принимаются честно и объясняются команде.", lower: "Прозрачность мотивов без скрытых игр", higher: "Гибкость иногда мешает единообразию" },
      { ru: "Личная ответственность", en: "Taking individual responsibility", n: 41, score: 85, badge: "Поведенческий", statement: "Культура инициативы: «вижу проблему — беру и решаю».", lower: "Ownership поощряется на всех уровнях", higher: "Границы ответственности порой размыты" },
      { ru: "Прямое разрешение конфликтов", en: "Confronting conflict", n: 42, score: 78, badge: "Поведенческий", statement: "Проблемы обсуждаются прямо и без обходных манёвров.", lower: "Открытая обратная связь — норма", higher: "Прямота иногда опережает такт", quote: "[Glassdoor] «Здесь можно честно сказать, что не работает, — и тебя услышат.»" },
      { ru: "Чёткая философия", en: "Having a clear guiding philosophy", n: 54, score: 81, badge: "Ценностный", statement: "Миссия живёт в решениях, а не только в презентациях.", lower: "Ценности реально влияют на выбор", higher: "Формализации ценностей пока немного" },
    ],
  },
  {
    key: "performance", ru: "Результативность", en: "Performance", score: 68,
    desc: "Результат измеряется влиянием на учеников и ростом продукта, а не строгими KPI.",
    gap: "Результативность держится на вовлечённости и общих целях; формальная система оценки и привязка вознаграждения к итогу пока в становлении.",
    src: "Главный источник: All-Hands Meetings · Вспомогательный: Интервью с командами",
    params: [
      { ru: "Ориентация на достижения", en: "Achievement orientation", n: 22, score: 73, badge: "Поведенческий", statement: "Команды сами тянутся к амбициозным целям роста.", lower: "Цели вдохновляют и измеримы по продукту", higher: "Достижения не всегда формализованы" },
      { ru: "Требовательность", en: "Being demanding", n: 23, score: 64, badge: "Поведенческий", statement: "Планка высокая, но поддерживается мотивацией, а не давлением.", lower: "Команды держат стандарт ради учеников", higher: "Требовательность мягче строгой дисциплины" },
      { ru: "Высокие ожидания", en: "Having high expectations for performance", n: 24, score: 70, badge: "Поведенческий", statement: "Ожидания ясны и обсуждаются открыто.", lower: "Понятные цели по ролям и командам", higher: "Регулярных performance review пока немного" },
      { ru: "Оплата за результат", en: "High pay for good performance", n: 26, score: 66, badge: "Ценностный", statement: "Опционы и бонусы связывают людей с ростом компании.", lower: "Вознаграждение растёт вместе с продуктом", higher: "Привязка к личному итогу пока умеренная", quote: "[Интервью] «У нас у всех опционы — мы реально болеем за общий результат.»" },
    ],
  },
  {
    key: "respect", ru: "Уважение", en: "Respect", score: 84,
    desc: "Забота о людях ощущается ежедневно: поддержка, развитие и психологическая безопасность в приоритете.",
    gap: "Уважение выражено сильно и по-человечески: людям дают расти, ошибаться и быть собой, а влияние решений на команду учитывается всерьёз.",
    src: "Главный источник: Отзывы Glassdoor/eNPS · Вспомогательный: Onboarding-гайд",
    params: [
      { ru: "Справедливость", en: "Fairness", n: 14, score: 81, badge: "Ценностный", statement: "К людям относятся честно и без скрытых иерархий.", lower: "Равные возможности независимо от роли", higher: "Гибкость иногда мешает единым правилам" },
      { ru: "Толерантность", en: "Tolerance", n: 16, score: 80, badge: "Ценностный", statement: "Разные взгляды и стили работы принимаются открыто.", lower: "Команды ценят непохожесть друг друга", higher: "DEI держится на культуре, а не на политике" },
      { ru: "Поддержка", en: "Being supportive", n: 17, score: 88, badge: "Поведенческий", statement: "Менторство и взаимопомощь — естественная часть дня.", lower: "Психологическая безопасность реально работает", higher: "Поддержка иногда смягчает прямую критику" },
      { ru: "Ориентация на людей", en: "Being people oriented", n: 18, score: 85, badge: "Ценностный", statement: "Влияние решений на людей — важный фактор выбора.", lower: "Команда в центре решений", higher: "Баланс с бизнес-результатом ещё выстраивается" },
      { ru: "Возможности для роста", en: "Opportunities for professional growth", n: 19, score: 84, badge: "Поведенческий", statement: "Развитие и смена ролей доступны и поощряются.", lower: "Горизонтальный рост и обучение открыты", higher: "Формальных грейдов пока немного", quote: "[Glassdoor] «За год я попробовала три роли — здесь реально дают расти вширь.»" },
    ],
  },
];

const STRENGTHS = [
  ["Скорость и эксперименты", "Быстрые гипотезы и право на ошибку позволяют команде учиться и расти на опережение"],
  ["Командная вовлечённость", "Открытость, взаимопомощь и общие цели создают высокий уровень доверия"],
  ["Забота о людях", "Развитие, поддержка и психологическая безопасность удерживают сильных сотрудников"],
];
const TENSIONS = [
  ["Незрелость процессов", "Высокая гибкость при слабой структуре усложняет работу по мере роста команды"],
  ["Риск распыления", "Множество параллельных экспериментов иногда размывает фокус и приоритеты"],
  ["Мягкость в оценке", "Поддерживающая среда комфортна, но прямой обратной связи о результате порой не хватает"],
];

const FIT = [
  "Любит экспериментировать и быстро учится на ошибках",
  "Командный игрок, который ценит открытость и помощь коллегам",
  "Комфортно чувствует себя в неопределённости и сам структурирует хаос",
  "Заряжен миссией и заботится о пользователе продукта",
];
const NOFIT = [
  "Нуждается в чётких регламентах и пошаговых инструкциях",
  "Избегает риска и тяжело переносит частые изменения",
  "Ориентирован на личный результат в ущерб команде",
];
const RECO = [
  ["Проверьте отношение к неопределённости", "Попросите рассказать о проекте, который пришлось вести без готового плана и процессов"],
  ["Оцените тягу к экспериментам", "Спросите про гипотезу, которую кандидат проверил, и чему научил его провал"],
  ["Считайте командность", "Уточните, как кандидат помогал коллегам и делился знаниями без формального требования"],
];

export default function CulturePrimerPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<Nine | null>(null);
  useEffect(() => { setMounted(true); }, []);

  /* блокируем скролл фона при открытой модалке */
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

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

  return (
    <div ref={rootRef} className="relative w-full" style={{ color: INK }}>
      {/* HERO */}
      <section className="mx-auto max-w-[1100px] px-6 pt-36 pb-8 text-center md:px-8 lg:pt-40">
        <h1 className="rv mx-auto mt-5 text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-tight">Профиль культуры компании</h1>
        <p className="rv mx-auto mt-4 max-w-2xl text-lg text-[#183833]/65">Оцифрованный код корпоративной культуры по 7 измерениям и детальным параметрам на основе артефактов компании</p>
      </section>

      <div className="mx-auto max-w-[1100px] space-y-5 px-5 pb-24 md:px-8">
        {/* 1 · компания + доминирующий тип */}
        <div className="rv grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-bold">Информация о компании</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Info icon={<Building2 className="h-4 w-4" />} t="Компания" v="Компания" />
              <Info icon={<Globe className="h-4 w-4" />} t="Отрасль" v="EdTech / Online Education" />
              <Info icon={<Users className="h-4 w-4" />} t="Размер" v="340 сотрудников" />
              <Info icon={<FileText className="h-4 w-4" />} t="Артефакты" v="вакансии, карьерный сайт, интервью, onboarding-гайд" />
            </div>
            <p className="mt-4 border-t border-[#eef0ee] pt-4 text-[15px] leading-relaxed text-[#183833]/70">
              Быстрорастущая команда с энергичной предпринимательской культурой. Ставит во главу угла скорость,
              эксперименты и заботу о пользователе; ошибки воспринимает как часть обучения
            </p>
          </Card>

          <div className="rounded-3xl border border-[#d8ecc4] bg-gradient-to-br from-[#f3faea] to-[#eef7e0] p-5 shadow-[0_16px_44px_rgba(24,56,51,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-base font-bold"><Compass className="h-5 w-5" style={{ color: GREEN }} /> Доминирующий тип культуры</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold shadow-sm" style={{ color: GREEN }}>Инновации + Люди</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[#183833]/75">
              Предпринимательская культура роста, опирающаяся на эксперименты, командную работу и заботу о людях.
              Решения принимаются быстро и итеративно, право на ошибку — норма. Сильные стороны —
              скорость и вовлечённость; точка роста — выстраивание устойчивых процессов под масштаб.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[["Инновации", 86, GREEN], ["Люди", 83, AMBER], ["Команда", 80, "#5BA528"]].map(([t, v, c]) => (
                <div key={t as string} className="rounded-2xl bg-white/70 p-3 text-center">
                  <p className="text-xl font-bold" style={{ color: c as string }}>{v}%</p>
                  <p className="mt-0.5 text-[11px] text-[#183833]/55">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2 · диаграмма ДНК */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">ДНК культуры — 7 измерений</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] text-[#183833]/55">Полярная диаграмма показывает выраженность каждого измерения культуры компании</p>
          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.15fr_1fr]">
            <Card className="flex items-center justify-center"><RoseChart /></Card>
            <Card className="flex flex-col">
              <p className="flex items-center gap-2 text-sm font-bold"><Dna className="h-4 w-4" style={{ color: GREEN }} /> Выраженность измерений</p>
              <div className="mt-4 flex flex-1 flex-col justify-between gap-3.5">
                {DIMS.map((d) => (
                  <div key={d.key}>
                    <div className="flex items-center justify-between text-[13px]"><span className="font-medium">{d.name}</span><span className="font-bold tabular-nums" style={{ color: d.c }}>{d.val}%</span></div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]"><div className="h-full rounded-full transition-[width] duration-[1100ms] ease-out" style={{ width: mounted ? `${d.val}%` : "0%", background: d.c }} /></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* 3 · анализ измерений */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Анализ измерений</h2>
          <p className="mx-auto mt-1 max-w-lg text-center text-[13px] text-[#183833]/55">9 ключевых ценностей культуры — каждая рассчитана как среднее оценок её параметров</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BIG_NINE.map((d) => {
              const c = nlvl(d.score);
              return (
                <Card key={d.key} className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-bold leading-tight">{d.ru}</p>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[13px] font-bold tabular-nums" style={{ background: `${c}1a`, color: c }}>{d.score} / 100</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#eef2ec]"><div className="h-full rounded-full transition-[width] duration-[1100ms] ease-out" style={{ width: mounted ? `${d.score}%` : "0%", background: c }} /></div>
                  <p className="mt-3 flex-1 text-[13px] leading-snug text-[#183833]/65">{d.desc}</p>
                  <button onClick={() => setActive(d)} className="ease-smooth mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e6ece4] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#183833] transition-all hover:-translate-y-0.5 hover:border-[#d8ecc4] hover:bg-[#f6faef]">
                    Подробнее <ExternalLink className="h-3.5 w-3.5" style={{ color: GREEN }} />
                  </button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 4 · сильные стороны / зоны напряжения */}
        <div className="rv grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: GREEN }}><ShieldCheck className="h-4 w-4" /> Сильные стороны культуры</h3>
            {STRENGTHS.map(([t, x]) => <Block key={t} t={t} text={x} />)}
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: AMBER }}><AlertTriangle className="h-4 w-4" /> Зоны напряжения</h3>
            {TENSIONS.map(([t, x]) => <Block key={t} t={t} text={x} badge="Точка роста" bc={AMBER} />)}
          </Card>
        </div>

        {/* 5 · идеальный кандидат */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Портрет идеального кандидата</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] text-[#183833]/55">Кого культура компании примет органично, а кому будет некомфортно</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#d8ecc4] bg-[#f3faea] p-5">
              <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}><UserCheck className="h-4 w-4" /> Хорошо впишется</p>
              <ul className="mt-3 space-y-2">{FIT.map((t) => <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-[#183833]/75"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} /> {t}</li>)}</ul>
            </div>
            <div className="rounded-3xl border border-[#ffd9d9] bg-[#fff5f5] p-5">
              <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: RED }}><AlertTriangle className="h-4 w-4" /> Зона риска</p>
              <ul className="mt-3 space-y-2">{NOFIT.map((t) => <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-[#183833]/75"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: RED }} /> {t}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* 6 · рекомендации по найму */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Рекомендации для найма</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {RECO.map(([t, x]) => (
              <Card key={t}>
                <p className="flex items-center gap-2 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: `${TEAL}1a`, color: TEAL }}><Lightbulb className="h-4 w-4" /></span> {t}</p>
                <p className="mt-2 text-[13px] leading-snug text-[#183833]/70">{x}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="report-cta rv overflow-hidden rounded-[2rem] px-8 py-12 text-center text-white shadow-[0_30px_70px_rgba(122,184,0,0.28)]" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #5e9400 100%)` }}>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Постройте такой профиль для вашей компании</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">Загрузите артефакты культуры — и оценивайте кандидатов через призму вашей ДНК. Первые 5 разборов бесплатно</p>
          <a href="https://app.talentmind.ru" className="ease-smooth mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1" style={{ color: GREEN }}>Отчёт для вашей компании →</a>
        </div>

        <p className="rv text-center text-xs text-[#183833]/40">TalentMind · автоматически сгенерированный отчёт · демо-данные</p>
      </div>

      {/* модальное окно — обоснование измерения */}
      {active && <DimModal key={active.key} d={active} onClose={() => setActive(null)} />}
    </div>
  );
}

/* ============================================================
   Модальное окно — детальный анализ измерения
   ============================================================ */
function DimModal({ d, onClose }: { d: Nine; onClose: () => void }) {
  const c = nlvl(d.score);
  const [sel, setSel] = useState(0);
  const sp = d.params[sel];
  const spc = nlvl(sp.score);
  const grad = c === GREEN ? "linear-gradient(120deg,#6aa400 0%,#8ec425 100%)"
    : c === AMBER ? "linear-gradient(120deg,#c8860a 0%,#f0b53e 100%)"
    : "linear-gradient(120deg,#e23b3b 0%,#ff7676 100%)";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <style>{`@keyframes dimFade{from{opacity:0}to{opacity:1}}
        @keyframes dimPop{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes pIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
      <div className="absolute inset-0 bg-[#0d1b17]/45 backdrop-blur-sm" style={{ animation: "dimFade .28s ease both" }} onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-[min(1080px,95vw)] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_60px_140px_rgba(13,27,23,0.5)]" style={{ animation: "dimPop .36s cubic-bezier(.22,1,.36,1) both" }}>

        {/* ── HERO HEADER (градиент по уровню) ── */}
        <div className="relative shrink-0 overflow-hidden px-6 py-6 text-white md:px-9 md:py-7" style={{ background: grad }}>
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-black/10 blur-3xl" />
          <button onClick={onClose} aria-label="Закрыть" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"><X className="h-4 w-4" /></button>
          <div className="relative flex items-center gap-5">
            <HeaderRing value={d.score} />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Ценность культуры</p>
              <h3 className="mt-1 text-[1.9rem] font-bold leading-none tracking-tight">{d.ru}</h3>
              <p className="mt-1 text-[15px] italic text-white/70">{d.en}</p>
            </div>
          </div>
          <p className="relative mt-4 max-w-2xl text-[15px] leading-relaxed text-white/90">{d.desc}</p>
        </div>

        {/* ── SCROLL BODY ── */}
        <div className="flex flex-col overflow-y-auto bg-[#fafcf8]" data-lenis-prevent>

          {/* ключевой вывод + источники */}
          <div className="border-b border-[#eef0ee] px-6 py-5 md:px-9">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
              <div className="flex items-start gap-3 lg:flex-1">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: c }}><Lightbulb className="h-4 w-4" /></span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#183833]/45">Ключевой вывод · анализ расхождений</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#183833]/85">{d.gap}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-[#d8e0da] bg-white px-4 py-3 lg:w-[280px] lg:shrink-0">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#183833]/40" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#183833]/45">Источники доказательств</p>
                  <p className="mt-1 text-xs leading-snug text-[#183833]/65">{d.src}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MASTER (состав оценки) ↔ DETAIL */}
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[0.92fr_1.08fr] md:p-9">

            {/* ── MASTER: диаграмма состава ── */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-[#183833]/45">Состав оценки</p>
                <span className="rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums" style={{ background: `${GREEN}1a`, color: GREEN }}>{d.params.length} параметра</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#183833]/45"><span className="inline-block h-3 w-[2px]" style={{ background: "#183833", opacity: 0.4 }} /> пунктир — среднее по измерению ({d.score})</p>

              <div className="mt-3 space-y-2">
                {d.params.map((p, i) => {
                  const lc = nlvl(p.score), on = i === sel;
                  return (
                    <button
                      key={p.n}
                      onClick={() => setSel(i)}
                      className="w-full rounded-2xl border border-[#e9ede9] bg-white p-3 text-left transition-all hover:border-[#d6e6c8]"
                      style={{ animation: `pIn .45s ease ${0.05 * i + 0.05}s both`, ...(on ? { boxShadow: `0 0 0 2px ${lc}`, background: `${lc}0d` } : {}) }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: lc }} />
                          <span className="truncate text-sm font-semibold" style={{ color: INK }}>{p.ru}</span>
                          <span className="hidden shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold sm:inline" style={{ background: `${badgeColor(p.badge)}1a`, color: badgeColor(p.badge) }}>{p.badge}</span>
                        </span>
                        <span className="shrink-0 text-sm font-bold tabular-nums" style={{ color: lc }}>{p.score}</span>
                      </div>
                      <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#eef2ec]">
                        <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: lc, transformOrigin: "left", animation: `barGrow .7s cubic-bezier(.22,1,.36,1) ${0.05 * i + 0.15}s both` }} />
                      </div>
                      {/* маркер среднего */}
                      <div className="relative">
                        <span className="absolute -top-[10px] h-2.5 w-[2px]" style={{ left: `${d.score}%`, background: "#183833", opacity: 0.4 }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── DETAIL: выбранный параметр ── */}
            <div className="self-start lg:sticky lg:top-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#183833]/45">Разбор параметра</p>
              <div key={sel} className="mt-3 overflow-hidden rounded-2xl border border-[#e9ede9] bg-white shadow-[0_12px_34px_rgba(24,56,51,0.07)]" style={{ animation: "pIn .35s ease both" }}>
                <div className="border-l-[5px] p-5" style={{ borderColor: spc }}>
                  <div className="flex items-center gap-4">
                    <ScoreRing value={sp.score} color={spc} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-bold leading-tight" style={{ color: INK }}>{sp.ru}</h4>
                        <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${badgeColor(sp.badge)}1a`, color: badgeColor(sp.badge) }}>{sp.badge}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-[15px] font-medium leading-snug" style={{ color: INK }}>{sp.statement}</p>

                  <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#183833]/40">Границы оценки</p>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#d8ecc4] bg-[#f3faea] p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}><TrendingUp className="h-3.5 w-3.5" /> Почему не ниже</p>
                      <p className="mt-1.5 text-[13px] leading-snug text-[#183833]/70">{sp.lower}</p>
                    </div>
                    <div className="rounded-xl border border-[#f1d9a8] bg-[#fdf6e9] p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: AMBER }}><TrendingDown className="h-3.5 w-3.5" /> Почему не выше</p>
                      <p className="mt-1.5 text-[13px] leading-snug text-[#183833]/70">{sp.higher}</p>
                    </div>
                  </div>

                  {sp.quote && (
                    <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#ececec] bg-[#f7f8f7] px-4 py-3">
                      <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-[#183833]/30" />
                      <p className="text-[13px] italic leading-snug text-[#183833]/60">{sp.quote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* большое кольцо оценки в шапке (белое на цветном) */
function HeaderRing({ value }: { value: number }) {
  const r = 30, cc = 2 * Math.PI * r, dash = ((value / 100) * cc).toFixed(1);
  return (
    <div className="relative h-[80px] w-[80px] shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${dash} ${cc.toFixed(1)}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-white">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
      </div>
    </div>
  );
}
/* кольцо оценки параметра */
function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 24, cc = 2 * Math.PI * r, dash = ((value / 100) * cc).toFixed(1);
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#eef2ec" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dash} ${cc.toFixed(1)}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-lg font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
    </div>
  );
}

/* ============================================================
   мелкие компоненты
   ============================================================ */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-[#e6ece4] bg-white p-5 shadow-[0_16px_44px_rgba(24,56,51,0.06)] ${className}`}>{children}</div>;
}
function Info({ icon, t, v }: { icon: React.ReactNode; t: string; v: string }) {
  return <div className="flex items-start gap-2"><span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f4f7f2] text-[#7AB800]">{icon}</span><div><p className="text-[11px] font-semibold uppercase tracking-wide text-[#183833]/45">{t}</p><p className="text-[13px] font-medium">{v}</p></div></div>;
}
function Block({ t, text, badge, bc }: { t: string; text: string; badge?: string; bc?: string }) {
  return <div className="mt-3 border-t border-[#eef0ee] pt-3"><div className="flex items-center justify-between gap-2"><p className="text-[13px] font-semibold">{t}</p>{badge && <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase" style={{ background: `${bc}1a`, color: bc }}>{badge}</span>}</div><p className="mt-1 text-xs leading-snug text-[#183833]/65">{text}</p></div>;
}

/* роза-диаграмма 7 измерений */
function RoseChart() {
  const N = DIMS.length, cx = 280, cy = 215, R = 152, seg = 360 / N, pad = 1.4, labelR = R + 16;
  const rad = (deg: number) => (deg * Math.PI) / 180;
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
  /* перенос длинной подписи на две строки */
  const wrap = (s: string) => {
    if (s.length <= 13 || !s.includes(" ")) return [s];
    const words = s.split(" "), half = s.length / 2;
    let l1 = "", k = 0;
    for (; k < words.length; k++) { if (l1.length && l1.length + words[k].length > half) break; l1 += (l1 ? " " : "") + words[k]; }
    const l2 = words.slice(k).join(" ");
    return l2 ? [l1, l2] : [l1];
  };
  return (
    <div className="flex w-full flex-col items-center">
      <svg viewBox="0 0 560 460" className="w-full max-w-[620px]">
        {/* вся шкала 0–100% — нейтральная подложка */}
        {DIMS.map((_, i) => <path key={`bg${i}`} d={sector(R, i)} fill="#eef1f3" stroke="#ffffff" strokeWidth="2.5" />)}
        {/* концентрические направляющие шкалы */}
        {[0.25, 0.5, 0.75, 1].map((f) => DIMS.map((_, i) => <path key={`g${f}-${i}`} d={arc(R * f, i)} fill="none" stroke="#d2dce2" strokeWidth="1" opacity="0.7" />))}
        {/* выраженность измерения — цветной сектор по значению */}
        {DIMS.map((d, i) => <path key={`v${i}`} d={sector((R * d.val) / 100, i)} fill={d.c} style={{ transformOrigin: `${cx}px ${cy}px`, animation: `roseG .7s ease-out ${0.05 * i + 0.1}s both` }} />)}
        {/* проценты внутри сектора */}
        {DIMS.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), rr = R * 0.62;
          return <text key={`p${i}`} x={(cx + rr * Math.cos(a)).toFixed(1)} y={(cy + rr * Math.sin(a)).toFixed(1)} fontSize="15" fontWeight="700" fill="#2b3b38" textAnchor="middle" dominantBaseline="middle">{d.val}%</text>;
        })}
        {/* подписи измерений снаружи (с переносом) */}
        {DIMS.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), ca = Math.cos(a);
          const lx = +(cx + labelR * ca).toFixed(1), ly = +(cy + labelR * Math.sin(a)).toFixed(1);
          const anchor = ca > 0.3 ? "start" : ca < -0.3 ? "end" : "middle";
          const lines = wrap(d.name), dy0 = lines.length > 1 ? -5 : 0;
          return (
            <text key={`l${i}`} x={lx} y={ly} fontSize="13" fill="#3a4f4a" textAnchor={anchor} dominantBaseline="middle">
              {lines.map((ln, k) => <tspan key={k} x={lx} dy={k === 0 ? dy0 : 13}>{ln}</tspan>)}
            </text>
          );
        })}
        <style>{`@keyframes roseG{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </svg>
    </div>
  );
}
