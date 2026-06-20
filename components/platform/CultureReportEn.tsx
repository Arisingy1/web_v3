"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dna, Building2, Globe, Users, FileText, Check, AlertTriangle,
  Target, Compass, UserCheck, Lightbulb, ShieldCheck,
  X, TrendingUp, TrendingDown, ExternalLink, MessageSquareQuote,
} from "lucide-react";

/* ── palette ── */
const GREEN = "#7AB800";
const TEAL = "#11AFCC";
const INK = "#183833";
const AMBER = "#E8A317";
const RED = "#FF5252";

/* ============================================================
   CultureReportEn — "Corporate culture report example".
   A fully designed page with animations: the company's DNA
   profile across 7 dimensions with detailed parameters, the
   dominant culture type, strengths and tension zones, the
   ideal-candidate portrait and hiring recommendations.
   ============================================================ */

type Dim = { key: string; name: string; val: number; c: string; sum: string; params: string[] };
const DIMS: Dim[] = [
  { key: "result", name: "Results orientation", val: 70, c: "#FF6B57", sum: "A strong dimension. Teams stay focused on user metrics but allow flexibility in how they get there", params: ["Action orientation", "Achievement orientation", "Being demanding", "High expectations", "Results orientation", "Pay for performance", "Emphasis on quality"] },
  { key: "stab", name: "Stability", val: 52, c: TEAL, sum: "Moderate. Processes exist but are regularly revisited to keep up with growth and new challenges", params: ["Stability", "Predictability", "Caution", "Rule orientation", "Job security", "Low conflict levels"] },
  { key: "detail", name: "Attention to detail", val: 61, c: "#2E9E8F", sum: "Balanced. Quality matters, but the speed of hypotheses often takes precedence over meticulousness", params: ["Analytical thinking", "Attention to detail", "Precision", "High organization"] },
  { key: "people", name: "People orientation", val: 83, c: AMBER, sum: "A dominant dimension. Development, care and psychological safety are built into everyday work", params: ["Fairness", "Respect for individual rights", "Tolerance", "Support", "People orientation", "Growth opportunities", "Recognition of achievements"] },
  { key: "team", name: "Team orientation", val: 80, c: "#5BA528", sum: "Very high. Cross-functional teams and joint decision-making are the foundation of how work gets done", params: ["Team orientation", "Free flow of information", "Working together", "Friendly relationships", "Fitting into the team"] },
  { key: "inno", name: "Innovativeness", val: 86, c: GREEN, sum: "The strongest dimension. Experiments, fast hypotheses and the right to make mistakes are encouraged", params: ["Flexibility", "Adaptability", "Innovativeness", "Seizing opportunities", "Willingness to experiment", "Risk taking", "Absence of rigid constraints"] },
  { key: "aggr", name: "Competitiveness", val: 47, c: "#E07B39", sum: "The weakest dimension. Collaboration is valued internally rather than competition between people", params: ["Competitiveness", "Aggressiveness", "Decisiveness", "Initiative", "Personal accountability", "Direct conflict resolution", "Work intensity"] },
];

/* ── 9 key values, each = the average (ROUND) of its OCP parameters ── */
const nlvl = (v: number) => (v >= 75 ? GREEN : v >= 50 ? AMBER : RED);
const badgeColor = (b: string) => (b === "Systemic" ? TEAL : b === "Process" ? "#5B8BB0" : b === "Behavioral" ? GREEN : AMBER);

type Ocp = { ru: string; en: string; n: number; score: number; badge: string; statement: string; lower: string; higher: string; quote?: string };
type Nine = { key: string; ru: string; en: string; score: number; desc: string; gap: string; src: string; params: Ocp[] };

const BIG_NINE: Nine[] = [
  {
    key: "agility", ru: "Agility", en: "Agility", score: 82,
    desc: "Agility is the backbone of the culture: teams freely change their approach and quickly adapt to new tasks.",
    gap: "Adaptability is high: decisions are made locally, and course corrections take days rather than quarters. The weak spot is process resilience as the company grows.",
    src: "Primary source: All-Hands Meetings · Supporting: Team interviews",
    params: [
      { ru: "Flexibility", en: "Flexibility", n: 1, score: 84, badge: "Behavioral", statement: "Employees freely change their approach — both within their own area and across teams.", lower: "The way work is done can change without lengthy approvals", higher: "Frequent course changes sometimes lack shared reference points", quote: "[All-Hands] \"If there's a better idea, we change the process next week, not next quarter.\"" },
      { ru: "Adaptability", en: "Adaptability", n: 2, score: 80, badge: "Behavioral", statement: "Teams quickly reshape tactics and strategy in response to feedback.", lower: "Quick reaction to change is built into the rhythm of work", higher: "Speed sometimes outpaces locking in decisions" },
      { ru: "Seizing opportunities", en: "Being quick to take advantage of opportunities", n: 4, score: 83, badge: "Behavioral", statement: "New opportunities are picked up almost instantly.", lower: "Initiatives launch without lengthy bureaucracy", higher: "Not every bet gets a chance to be validated" },
      { ru: "Willingness to experiment", en: "A willingness to experiment", n: 5, score: 81, badge: "Value-based", statement: "Experimentation is a daily norm, not an exception.", lower: "MVPs and fast hypotheses are encouraged", higher: "Some experiments launch without clear metrics" },
    ],
  },
  {
    key: "collab", ru: "Collaboration", en: "Collaboration", score: 85,
    desc: "Lively, informal collaboration: people reach out to each other easily and solve problems together.",
    gap: "Collaboration is built on trust and openness rather than regulations: helping a colleague is the norm, and knowledge flows freely between teams.",
    src: "Primary source: Team interviews · Supporting: Onboarding guide",
    params: [
      { ru: "Team orientation", en: "Being team oriented", n: 32, score: 88, badge: "Behavioral", statement: "Team results are valued above individual credit.", lower: "Shared goals unite teams in every cycle", higher: "Individual contribution is sometimes lost behind the collective" },
      { ru: "Free flow of information", en: "Sharing information freely", n: 33, score: 83, badge: "Value-based", statement: "Information is open by default; there are almost no secrets between teams.", lower: "Transparency and open channels are the norm", higher: "The volume of information can sometimes be overwhelming" },
      { ru: "Working together", en: "Working in collaboration", n: 34, score: 86, badge: "Behavioral", statement: "Cross-functional teams are the primary way of working.", lower: "Pair work and joint work are encouraged", higher: "Many sync-ups eat into focus time" },
      { ru: "Friendly relationships", en: "Developing friends at work", n: 35, score: 84, badge: "Behavioral", statement: "Warm relationships and friendships at work are part of the culture.", lower: "Mentors and informal communication bring people closer", higher: "Closeness sometimes gets in the way of direct feedback", quote: "[Onboarding] \"On their very first day, a new hire is introduced to the whole team over a shared lunch.\"" },
    ],
  },
  {
    key: "customer", ru: "Customer focus", en: "Customer", score: 80,
    desc: "Value for the learner is the main reference point: everyone on the team talks to users regularly.",
    gap: "The customer truly is at the center: product decisions are tested with real users, and feedback quickly turns into changes.",
    src: "Primary source: Team interviews · Supporting: All-Hands Meetings",
    params: [
      { ru: "Action orientation", en: "Action orientation", n: 21, score: 84, badge: "Behavioral", statement: "A \"ship first, polish later\" culture.", lower: "A fast launch is valued over a perfect plan", higher: "There is sometimes too little pause for quality checks" },
      { ru: "Results orientation", en: "Being results oriented", n: 25, score: 76, badge: "Behavioral", statement: "Decisions are judged by their impact on the learner and the product.", lower: "User metrics are in the teams' focus", higher: "The path to the result stays flexible" },
      { ru: "Emphasis on quality", en: "An emphasis on quality", n: 27, score: 78, badge: "Value-based", statement: "The quality of the content and the product is a point of pride.", lower: "Teams keep a high bar for learners", higher: "The speed of hypotheses sometimes outpaces polishing", quote: "[Interview] \"Before we roll out a feature, we show it to a couple of real learners.\"" },
    ],
  },
  {
    key: "diversity", ru: "Diversity", en: "Diversity", score: 78,
    desc: "Different perspectives and backgrounds are seen as a source of strong product decisions.",
    gap: "Diversity is genuinely valued: teams are made up of people with different experiences, and disagreement is welcomed as a way to find the better idea.",
    src: "Primary source: Onboarding guide · Supporting: Glassdoor/eNPS reviews",
    params: [
      { ru: "Fairness", en: "Fairness", n: 14, score: 80, badge: "Value-based", statement: "People are treated fairly, without hidden hierarchies.", lower: "Opportunities are open regardless of tenure and role", higher: "Flexibility sometimes gets in the way of uniform rules", quote: "[Onboarding] \"Here an intern can challenge a team lead's decision — and that's perfectly fine.\"" },
      { ru: "Respect for individual rights", en: "Respect for the individual's rights", n: 15, score: 79, badge: "Value-based", statement: "An employee's personal boundaries and autonomy are respected.", lower: "The right to one's own opinion and working style is encouraged", higher: "Freedom requires maturity in self-organization" },
      { ru: "Tolerance", en: "Tolerance", n: 16, score: 74, badge: "Value-based", statement: "Different viewpoints are accepted and discussed openly.", lower: "Disagreement is taken constructively", higher: "There is no separate, formalized DEI policy" },
    ],
  },
  {
    key: "execution", ru: "Execution", en: "Execution", score: 66,
    desc: "Energetic execution: teams quickly take ideas to launch, relying on rhythm and autonomy.",
    gap: "Execution rests on drive and ownership rather than tight control: the pace is high, but process resilience for growth is still forming.",
    src: "Primary source: All-Hands Meetings · Supporting: Team interviews",
    params: [
      { ru: "Achievement orientation", en: "Achievement orientation", n: 22, score: 72, badge: "Behavioral", statement: "Ambitious goals drive teams toward fast launches.", lower: "Goals are ambitious and inspiring", higher: "Not everything gets carried through to systematic polishing" },
      { ru: "High expectations", en: "Having high expectations for performance", n: 24, score: 68, badge: "Behavioral", statement: "Expectations are high, but rest on motivation rather than control.", lower: "Teams set a high bar for themselves", higher: "There are still few formal KPIs and reviews" },
      { ru: "Analytical thinking", en: "Being analytical", n: 28, score: 63, badge: "Behavioral", statement: "Decisions rely on data, but also on fast intuition.", lower: "Hypotheses are tested with users", higher: "Analytical depth yields to speed" },
      { ru: "Attention to detail", en: "Paying attention to detail", n: 29, score: 61, badge: "Behavioral", statement: "Details matter, but should not slow down the launch.", lower: "Quality for the learner is kept at a good level", higher: "Speed sometimes wins over meticulousness" },
      { ru: "High organization", en: "Being highly organized", n: 31, score: 64, badge: "Process", statement: "Processes are lightweight and constantly evolving.", lower: "Minimal bureaucracy, maximum autonomy", higher: "As the company grows, a stable structure is lacking", quote: "[Interview] \"We're only now starting to document our processes — before, everything relied on people.\"" },
    ],
  },
  {
    key: "innovation", ru: "Innovation", en: "Innovation", score: 87,
    desc: "Innovation is the heart of the culture: new ideas are encouraged, and the right to fail is enshrined in the values.",
    gap: "Innovativeness is the strongest dimension: experiments run constantly, risk is seen as part of learning, and rules are deliberately few.",
    src: "Primary source: All-Hands Meetings · Supporting: Team interviews",
    params: [
      { ru: "Innovativeness", en: "Being innovative", n: 3, score: 89, badge: "Value-based", statement: "Looking for new solutions is expected behavior, not a heroic feat.", lower: "Ideas are born and tested at all levels", higher: "Not every idea makes it to a sustainable product" },
      { ru: "Willingness to experiment", en: "A willingness to experiment", n: 5, score: 88, badge: "Value-based", statement: "Experiments are launched easily and often.", lower: "Hypotheses are tested quickly and without bureaucracy", higher: "There is sometimes a lack of measurement discipline" },
      { ru: "Risk taking", en: "Risk taking", n: 6, score: 84, badge: "Behavioral", statement: "Reasonable risk is welcomed; failure is a chance to learn.", lower: "The right to fail is enshrined in the values", higher: "High risk is sometimes not backed by data", quote: "[All-Hands] \"Better to try and fail than to spend a month getting an idea approved.\"" },
      { ru: "Absence of rigid constraints", en: "Not being constrained by many rules", n: 7, score: 86, badge: "Behavioral", statement: "Rules are deliberately few — freedom of action takes priority.", lower: "Team autonomy is at a maximum", higher: "A lack of rules complicates scaling" },
    ],
  },
  {
    key: "integrity", ru: "Integrity", en: "Integrity", score: 81,
    desc: "Openness and candor: problems are spoken about out loud, and the values genuinely guide decisions.",
    gap: "Integrity is high and rests on trust: people give direct feedback, take the initiative, and the mission is felt in everyday work.",
    src: "Primary source: Glassdoor/eNPS reviews · Supporting: Onboarding guide",
    params: [
      { ru: "Fairness", en: "Fairness", n: 14, score: 80, badge: "Value-based", statement: "Decisions are made fairly and explained to the team.", lower: "Transparent motives without hidden games", higher: "Flexibility sometimes gets in the way of consistency" },
      { ru: "Personal accountability", en: "Taking individual responsibility", n: 41, score: 85, badge: "Behavioral", statement: "A culture of initiative: \"I see a problem — I take it and solve it.\"", lower: "Ownership is encouraged at all levels", higher: "The boundaries of responsibility are sometimes blurred" },
      { ru: "Direct conflict resolution", en: "Confronting conflict", n: 42, score: 78, badge: "Behavioral", statement: "Problems are discussed directly, without workarounds.", lower: "Open feedback is the norm", higher: "Directness sometimes outpaces tact", quote: "[Glassdoor] \"Here you can honestly say what isn't working — and you'll be heard.\"" },
      { ru: "Clear philosophy", en: "Having a clear guiding philosophy", n: 54, score: 81, badge: "Value-based", statement: "The mission lives in decisions, not just in presentations.", lower: "Values genuinely influence choices", higher: "There is still little formalization of the values" },
    ],
  },
  {
    key: "performance", ru: "Performance", en: "Performance", score: 68,
    desc: "Results are measured by impact on learners and product growth rather than by strict KPIs.",
    gap: "Performance rests on engagement and shared goals; a formal evaluation system and tying rewards to outcomes are still emerging.",
    src: "Primary source: All-Hands Meetings · Supporting: Team interviews",
    params: [
      { ru: "Achievement orientation", en: "Achievement orientation", n: 22, score: 73, badge: "Behavioral", statement: "Teams reach for ambitious growth goals on their own.", lower: "Goals inspire and are measurable by product", higher: "Achievements are not always formalized" },
      { ru: "Being demanding", en: "Being demanding", n: 23, score: 64, badge: "Behavioral", statement: "The bar is high, but it is supported by motivation rather than pressure.", lower: "Teams keep the standard for the sake of learners", higher: "Demandingness is softer than strict discipline" },
      { ru: "High expectations", en: "Having high expectations for performance", n: 24, score: 70, badge: "Behavioral", statement: "Expectations are clear and discussed openly.", lower: "Clear goals by role and team", higher: "There are still few regular performance reviews" },
      { ru: "Pay for performance", en: "High pay for good performance", n: 26, score: 66, badge: "Value-based", statement: "Stock options and bonuses tie people to the company's growth.", lower: "Compensation grows along with the product", higher: "The link to individual outcomes is still moderate", quote: "[Interview] \"We all have stock options — we genuinely care about the shared result.\"" },
    ],
  },
  {
    key: "respect", ru: "Respect", en: "Respect", score: 84,
    desc: "Care for people is felt daily: support, development and psychological safety are the priority.",
    gap: "Respect is strongly and genuinely expressed: people are allowed to grow, to make mistakes and to be themselves, and the impact of decisions on the team is taken seriously.",
    src: "Primary source: Glassdoor/eNPS reviews · Supporting: Onboarding guide",
    params: [
      { ru: "Fairness", en: "Fairness", n: 14, score: 81, badge: "Value-based", statement: "People are treated honestly and without hidden hierarchies.", lower: "Equal opportunities regardless of role", higher: "Flexibility sometimes gets in the way of uniform rules" },
      { ru: "Tolerance", en: "Tolerance", n: 16, score: 80, badge: "Value-based", statement: "Different views and working styles are accepted openly.", lower: "Teams value each other's differences", higher: "DEI rests on culture rather than on policy" },
      { ru: "Support", en: "Being supportive", n: 17, score: 88, badge: "Behavioral", statement: "Mentorship and mutual help are a natural part of the day.", lower: "Psychological safety genuinely works", higher: "Support sometimes softens direct criticism" },
      { ru: "People orientation", en: "Being people oriented", n: 18, score: 85, badge: "Value-based", statement: "The impact of decisions on people is an important factor in choices.", lower: "The team is at the center of decisions", higher: "The balance with business results is still being built" },
      { ru: "Growth opportunities", en: "Opportunities for professional growth", n: 19, score: 84, badge: "Behavioral", statement: "Development and role changes are available and encouraged.", lower: "Lateral growth and learning are open", higher: "There are still few formal grades", quote: "[Glassdoor] \"In a year I tried three roles — here they really let you grow sideways.\"" },
    ],
  },
];

const STRENGTHS = [
  ["Speed and experimentation", "Fast hypotheses and the right to fail let the team learn and grow ahead of the curve"],
  ["Team engagement", "Openness, mutual help and shared goals create a high level of trust"],
  ["Care for people", "Development, support and psychological safety retain strong employees"],
];
const TENSIONS = [
  ["Process immaturity", "High flexibility with a weak structure makes work harder as the team grows"],
  ["Risk of spreading thin", "Many parallel experiments sometimes blur focus and priorities"],
  ["Softness in evaluation", "A supportive environment is comfortable, but direct feedback on results is sometimes lacking"],
];

const FIT = [
  "Loves to experiment and learns quickly from mistakes",
  "A team player who values openness and helping colleagues",
  "Feels comfortable with ambiguity and structures the chaos themselves",
  "Energized by the mission and cares about the product's user",
];
const NOFIT = [
  "Needs clear regulations and step-by-step instructions",
  "Avoids risk and struggles with frequent changes",
  "Focused on individual results at the team's expense",
];
const RECO = [
  ["Check their attitude toward ambiguity", "Ask them to describe a project they had to run without a ready-made plan or processes"],
  ["Assess their appetite for experimentation", "Ask about a hypothesis the candidate tested and what a failure taught them"],
  ["Read their teamwork", "Clarify how the candidate helped colleagues and shared knowledge without being formally required to"],
];

export default function CultureReportEn() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<Nine | null>(null);
  useEffect(() => { setMounted(true); }, []);

  /* lock background scroll while the modal is open */
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
        <h1 className="rv mx-auto mt-5 text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-tight">Company Culture Profile</h1>
        <p className="rv mx-auto mt-4 max-w-2xl text-lg text-[#183833]/65">The company's corporate culture digitized across 7 dimensions and detailed parameters, based on the company's artifacts</p>
      </section>

      <div className="mx-auto max-w-[1100px] space-y-5 px-5 pb-24 md:px-8">
        {/* 1 · company + dominant type */}
        <div className="rv grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-bold">Company Information</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Info icon={<Building2 className="h-4 w-4" />} t="Company" v="Company" />
              <Info icon={<Globe className="h-4 w-4" />} t="Industry" v="EdTech / Online Education" />
              <Info icon={<Users className="h-4 w-4" />} t="Size" v="340 employees" />
              <Info icon={<FileText className="h-4 w-4" />} t="Artifacts" v="job postings, careers site, interviews, onboarding guide" />
            </div>
            <p className="mt-4 border-t border-[#eef0ee] pt-4 text-[15px] leading-relaxed text-[#183833]/70">
              A fast-growing team with an energetic, entrepreneurial culture. It puts speed,
              experimentation and care for the user first; it sees mistakes as part of learning
            </p>
          </Card>

          <div className="rounded-3xl border border-[#d8ecc4] bg-gradient-to-br from-[#f3faea] to-[#eef7e0] p-5 shadow-[0_16px_44px_rgba(24,56,51,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-base font-bold"><Compass className="h-5 w-5" style={{ color: GREEN }} /> Dominant Culture Type</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold shadow-sm" style={{ color: GREEN }}>Innovation + People</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-[#183833]/75">
              An entrepreneurial growth culture built on experimentation, teamwork and care for people.
              Decisions are made quickly and iteratively, and the right to fail is the norm. The strengths are
              speed and engagement; the area to grow is building resilient processes for scale.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[["Innovation", 86, GREEN], ["People", 83, AMBER], ["Team", 80, "#5BA528"]].map(([t, v, c]) => (
                <div key={t as string} className="rounded-2xl bg-white/70 p-3 text-center">
                  <p className="text-xl font-bold" style={{ color: c as string }}>{v}%</p>
                  <p className="mt-0.5 text-[11px] text-[#183833]/55">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2 · DNA chart */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Culture DNA — 7 dimensions</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] text-[#183833]/55">The polar chart shows how pronounced each dimension of the company's culture is</p>
          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.15fr_1fr]">
            <Card className="flex items-center justify-center"><RoseChart /></Card>
            <Card className="flex flex-col">
              <p className="flex items-center gap-2 text-sm font-bold"><Dna className="h-4 w-4" style={{ color: GREEN }} /> Strength of the dimensions</p>
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

        {/* 3 · dimension analysis */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Dimension Analysis</h2>
          <p className="mx-auto mt-1 max-w-lg text-center text-[13px] text-[#183833]/55">9 key culture values — each calculated as the average of its parameters' scores</p>
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
                    Learn more <ExternalLink className="h-3.5 w-3.5" style={{ color: GREEN }} />
                  </button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 4 · strengths / tension zones */}
        <div className="rv grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: GREEN }}><ShieldCheck className="h-4 w-4" /> Culture strengths</h3>
            {STRENGTHS.map(([t, x]) => <Block key={t} t={t} text={x} />)}
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: AMBER }}><AlertTriangle className="h-4 w-4" /> Tension zones</h3>
            {TENSIONS.map(([t, x]) => <Block key={t} t={t} text={x} badge="Area to grow" bc={AMBER} />)}
          </Card>
        </div>

        {/* 5 · ideal candidate */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Ideal Candidate Portrait</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] text-[#183833]/55">Who the company's culture will welcome naturally, and who will feel uncomfortable</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#d8ecc4] bg-[#f3faea] p-5">
              <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}><UserCheck className="h-4 w-4" /> A good fit</p>
              <ul className="mt-3 space-y-2">{FIT.map((t) => <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-[#183833]/75"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} /> {t}</li>)}</ul>
            </div>
            <div className="rounded-3xl border border-[#ffd9d9] bg-[#fff5f5] p-5">
              <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: RED }}><AlertTriangle className="h-4 w-4" /> Risk zone</p>
              <ul className="mt-3 space-y-2">{NOFIT.map((t) => <li key={t} className="flex items-start gap-2 text-[13px] leading-snug text-[#183833]/75"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: RED }} /> {t}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* 6 · hiring recommendations */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Hiring Recommendations</h2>
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
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Build a profile like this for your company</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">Upload your culture artifacts — and evaluate candidates through the lens of your DNA. The first 5 assessments are free</p>
          <a href="https://app.talentmind.ru" className="ease-smooth mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1" style={{ color: GREEN }}>Get a report for your company →</a>
        </div>

        <p className="rv text-center text-xs text-[#183833]/40">TalentMind · automatically generated report · demo data</p>
      </div>

      {/* modal — dimension rationale */}
      {active && <DimModal key={active.key} d={active} onClose={() => setActive(null)} />}
    </div>
  );
}

/* ============================================================
   Modal — detailed dimension analysis
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

        {/* ── HERO HEADER (gradient by level) ── */}
        <div className="relative shrink-0 overflow-hidden px-6 py-6 text-white md:px-9 md:py-7" style={{ background: grad }}>
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-black/10 blur-3xl" />
          <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"><X className="h-4 w-4" /></button>
          <div className="relative flex items-center gap-5">
            <HeaderRing value={d.score} />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Culture value</p>
              <h3 className="mt-1 text-[1.9rem] font-bold leading-none tracking-tight">{d.ru}</h3>
              <p className="mt-1 text-[15px] italic text-white/70">{d.en}</p>
            </div>
          </div>
          <p className="relative mt-4 max-w-2xl text-[15px] leading-relaxed text-white/90">{d.desc}</p>
        </div>

        {/* ── SCROLL BODY ── */}
        <div className="flex flex-col overflow-y-auto bg-[#fafcf8]" data-lenis-prevent>

          {/* key takeaway + sources */}
          <div className="border-b border-[#eef0ee] px-6 py-5 md:px-9">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
              <div className="flex items-start gap-3 lg:flex-1">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: c }}><Lightbulb className="h-4 w-4" /></span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#183833]/45">Key takeaway · gap analysis</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#183833]/85">{d.gap}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-[#d8e0da] bg-white px-4 py-3 lg:w-[280px] lg:shrink-0">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#183833]/40" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#183833]/45">Evidence sources</p>
                  <p className="mt-1 text-xs leading-snug text-[#183833]/65">{d.src}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MASTER (score composition) ↔ DETAIL */}
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[0.92fr_1.08fr] md:p-9">

            {/* ── MASTER: composition chart ── */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-[#183833]/45">Score composition</p>
                <span className="rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums" style={{ background: `${GREEN}1a`, color: GREEN }}>{d.params.length} parameters</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#183833]/45"><span className="inline-block h-3 w-[2px]" style={{ background: "#183833", opacity: 0.4 }} /> dashed line — dimension average ({d.score})</p>

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
                      {/* average marker */}
                      <div className="relative">
                        <span className="absolute -top-[10px] h-2.5 w-[2px]" style={{ left: `${d.score}%`, background: "#183833", opacity: 0.4 }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── DETAIL: selected parameter ── */}
            <div className="self-start lg:sticky lg:top-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#183833]/45">Parameter breakdown</p>
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

                  <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#183833]/40">Score boundaries</p>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#d8ecc4] bg-[#f3faea] p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}><TrendingUp className="h-3.5 w-3.5" /> Why not lower</p>
                      <p className="mt-1.5 text-[13px] leading-snug text-[#183833]/70">{sp.lower}</p>
                    </div>
                    <div className="rounded-xl border border-[#f1d9a8] bg-[#fdf6e9] p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: AMBER }}><TrendingDown className="h-3.5 w-3.5" /> Why not higher</p>
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
/* large score ring in the header (white on color) */
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
/* parameter score ring */
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
   small components
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

/* rose chart, 7 dimensions */
function RoseChart() {
  const N = DIMS.length, cx = 280, cy = 215, R = 152, seg = 360 / N, pad = 1.4, labelR = R + 16;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  /* pie sector from the center to radius r */
  const sector = (r: number, i: number) => {
    const a0 = rad(i * seg - 90 + pad), a1 = rad((i + 1) * seg - 90 - pad);
    return `M ${cx} ${cy} L ${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)} Z`;
  };
  /* guide arc at radius r */
  const arc = (r: number, i: number) => {
    const a0 = rad(i * seg - 90 + pad), a1 = rad((i + 1) * seg - 90 - pad);
    return `M ${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}`;
  };
  /* wrap a long label onto two lines */
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
        {/* the full 0–100% scale — neutral backing */}
        {DIMS.map((_, i) => <path key={`bg${i}`} d={sector(R, i)} fill="#eef1f3" stroke="#ffffff" strokeWidth="2.5" />)}
        {/* concentric scale guides */}
        {[0.25, 0.5, 0.75, 1].map((f) => DIMS.map((_, i) => <path key={`g${f}-${i}`} d={arc(R * f, i)} fill="none" stroke="#d2dce2" strokeWidth="1" opacity="0.7" />))}
        {/* dimension strength — colored sector by value */}
        {DIMS.map((d, i) => <path key={`v${i}`} d={sector((R * d.val) / 100, i)} fill={d.c} style={{ transformOrigin: `${cx}px ${cy}px`, animation: `roseG .7s ease-out ${0.05 * i + 0.1}s both` }} />)}
        {/* percentages inside the sector */}
        {DIMS.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), rr = R * 0.62;
          return <text key={`p${i}`} x={(cx + rr * Math.cos(a)).toFixed(1)} y={(cy + rr * Math.sin(a)).toFixed(1)} fontSize="15" fontWeight="700" fill="#2b3b38" textAnchor="middle" dominantBaseline="middle">{d.val}%</text>;
        })}
        {/* dimension labels outside (with wrapping) */}
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
