"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  X, Sparkles, Check, AlertTriangle, Flame, AudioLines, MessageSquareQuote,
  Briefcase, Building2, Wallet, Home, GitBranch, TrendingUp, TrendingDown,
  Dna, Target, ChevronDown,
} from "lucide-react";

/* ── palette ── */
const GREEN = "#7AB800";
const TEAL = "#11AFCC";
const INK = "#183833";
const AMBER = "#E8A317";
const RED = "#FF5252";

/* ============================================================
   CandidateReportEn — "Example report" (standalone view).
   A fully laid-out candidate report with animations.
   Each soft-skill card has a "Details" button that opens a
   modal with an in-depth breakdown. Includes a "Corporate
   Compatibility" section.
   ============================================================ */

const ARGS_FOR = [
  "Launched B2B fintech products from idea to market",
  "Strong product analytics: metrics, A/B tests, unit economics",
  "Experience working with engineering, design and data-analytics teams",
  "Able to formulate hypotheses and validate them with data",
];
const ARGS_AGAINST = ["High salary expectations", "Limited experience with mass-market B2C products"];

type Skill = { name: string; val: number; req: number; desc: string };
const SKILLS: Skill[] = [
  { name: "Management", val: 81, req: 84, desc: "Confidently runs the product backlog and prioritization. Coordinated cross-functional teams of 10+ people on B2B product launches" },
  { name: "Leadership", val: 74, req: 82, desc: "Leads through product vision and data-driven reasoning. Carries the team along, but sometimes avoids tough management decisions" },
  { name: "Communication", val: 83, req: 78, desc: "A strong skill. Clearly conveys product strategy to stakeholders and translates business requirements into engineering language" },
  { name: "Planning", val: 79, req: 80, desc: "Builds a solid roadmap and decomposes features well. Balances business goals against the team's technical constraints" },
  { name: "Adaptability", val: 77, req: 74, desc: "Worked in a bank, a fintech startup and EdTech — switches easily between different processes and quickly masters new domains" },
  { name: "Stress tolerance", val: 71, req: 82, desc: "Stays composed under tight release deadlines. Speech is steady, but the interview offered few direct examples of working through acute crises" },
  { name: "Teamwork", val: 62, req: 78, desc: "Focused on shared results, actively involves design and analytics, but tends to keep key decisions to herself" },
  { name: "Empathy", val: 76, req: 80, desc: "Deeply understands user pain points through customer development and interviews. Relies on real feedback, not just numbers" },
  { name: "Problem solving", val: 84, req: 83, desc: "Strongest skill. Formulates hypotheses, tests them with experiments and finds solutions based on data and unit economics" },
  { name: "Critical thinking", val: 82, req: 79, desc: "Questions the value of features, cuts the unnecessary based on data and focuses the team on the metrics that truly move the product" },
];

const RADAR: { l: string; v: number; req: number }[] = [
  { l: "Management", v: 68, req: 84 }, { l: "Leadership", v: 55, req: 82 }, { l: "Communication", v: 85, req: 78 },
  { l: "Planning", v: 72, req: 80 }, { l: "Adaptability", v: 78, req: 74 }, { l: "Stress tolerance", v: 52, req: 82 },
  { l: "Teamwork", v: 38, req: 78 }, { l: "Empathy", v: 70, req: 80 }, { l: "Problem solving", v: 80, req: 83 },
  { l: "Critical thinking", v: 76, req: 79 },
];

/* corporate compatibility score — candidate vs the reference culture profile */
type CDim = { name: string; val: number; ref: number };
const COMPAT_SCORE = 79;
const COMPAT_DIMS: CDim[] = [
  { name: "Data orientation", val: 86, ref: 80 },
  { name: "Results orientation", val: 83, ref: 78 },
  { name: "Customer focus", val: 80, ref: 76 },
  { name: "Innovation / agility", val: 74, ref: 70 },
  { name: "People orientation", val: 72, ref: 70 },
  { name: "Teamwork", val: 60, ref: 78 },
  { name: "Stability and process", val: 64, ref: 72 },
];
const COMPAT_MATCHES: [string, string][] = [
  ["Makes data-driven decisions", "Relies on metrics and experiments rather than intuition — reducing the cost of product mistakes."],
  ["Keeps focus on results", "Ships features to launch and measures their impact — aligned with the team's product culture."],
  ["Listens to the user", "Regularly runs customer development and feeds the feedback into the backlog — keeping the product close to the market."],
];
const COMPAT_ATTENTION: [string, string][] = [
  ["Team collaboration", "Tends to keep key decisions to herself. At the outset it's worth agreeing on a transparent split of ownership."],
  ["Process discipline", "A flexible style may clash with strict regulations. Better to spell out the mandatory processes up front."],
];
const dimTone = (g: number) => (g >= 0 ? { c: GREEN, l: "On target" } : g >= -8 ? { c: AMBER, l: "Close" } : { c: RED, l: "Below benchmark" });

export default function CandidateReportEn() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Skill | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* sections appear out of blur + slight scale-up */
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

  /* lock background scroll when the modal is open */
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <div ref={rootRef} className="relative w-full" style={{ color: INK }}>
      {/* HERO */}
      <section className="mx-auto max-w-[1100px] px-6 pt-36 pb-8 text-center md:px-8 lg:pt-40">
        <h1 className="rv mx-auto mt-5 text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-tight">Analysis Result</h1>
        <p className="rv mx-auto mt-4 max-w-2xl text-lg text-[#183833]/65">A detailed breakdown of soft skills and corporate compatibility based on a real interview</p>
      </section>

      <div className="mx-auto max-w-[1100px] space-y-5 px-5 pb-24 md:px-8">
        {/* 0 · candidate header + match */}
        <div className="rv flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#e6ece4] bg-white p-6 shadow-[0_16px_44px_rgba(24,56,51,0.06)] sm:flex-row sm:items-center md:px-8">
          <div>
            <h2 className="text-[1.7rem] font-bold leading-tight tracking-tight" style={{ color: INK }}>Elena Vorontsova</h2>
            <p className="mt-1.5 text-[15px] font-semibold leading-snug" style={{ color: TEAL }}>Lead Product Manager</p>
            <p className="text-[15px] font-medium leading-snug" style={{ color: `${TEAL}b3` }}>FinTech · B2B</p>
          </div>
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#183833]/50">Match</p>
            <ComplianceRing value={81} />
          </div>
        </div>

        {/* 1 · candidate + decision */}
        <div className="rv grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-base font-bold">Candidate Information</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Info icon={<Briefcase className="h-4 w-4" />} t="Experience" v="7 years" />
              <Info icon={<Building2 className="h-4 w-4" />} t="Companies" v="Revolut, Stripe, an EdTech startup" />
              <Info icon={<Wallet className="h-4 w-4" />} t="Expectations" v="$3,200 (net)" />
              <Info icon={<Home className="h-4 w-4" />} t="Format" v="office / hybrid" />
            </div>
            <p className="mt-4 border-t border-[#eef0ee] pt-4 text-[15px] leading-relaxed text-[#183833]/70">
              A fintech product manager focused on B2B products. Launched payment and analytics services from scratch,
              owned the backlog and metrics, and made decisions based on data and unit economics
            </p>
          </Card>

          <div className="rounded-3xl border border-[#d8ecc4] bg-gradient-to-br from-[#f3faea] to-[#eef7e0] p-5 shadow-[0_16px_44px_rgba(24,56,51,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-base font-bold"><Check className="h-5 w-5" style={{ color: GREEN }} /> Decision to advance to the next stage</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold shadow-sm" style={{ color: GREEN }}><Check className="h-3.5 w-3.5" /> Recommended</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[13px] font-semibold" style={{ color: GREEN }}>Arguments For</p>
                <ul className="mt-2 space-y-1.5">{ARGS_FOR.map((a) => <li key={a} className="flex items-start gap-1.5 text-[13px] text-[#183833]/75"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} /> {a}</li>)}</ul>
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: RED }}>Arguments Against</p>
                <ul className="mt-2 space-y-1.5">{ARGS_AGAINST.map((a) => <li key={a} className="flex items-start gap-1.5 text-[13px] text-[#183833]/75"><X className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: RED }} /> {a}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2 · corporate compatibility */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Corporate Compatibility</h2>
          <p className="mx-auto mt-1 max-w-xl text-center text-[13px] text-[#183833]/55">How well the candidate's values and behavior align with the company's DNA and culture code</p>

          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            {/* compatibility index */}
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-[#d8ecc4] bg-gradient-to-br from-[#f3faea] via-white to-[#eef7e0] p-6 shadow-[0_16px_44px_rgba(24,56,51,0.07)]">
              <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#7AB800]/12 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-[-30%] h-32 w-32 rounded-full bg-[#11AFCC]/8 blur-3xl" />
              <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#183833]/45"><Dna className="h-4 w-4" style={{ color: GREEN }} /> Compatibility index</p>
              <div className="relative mt-1 flex justify-center"><FitGauge value={COMPAT_SCORE} /></div>
              <div className="relative -mt-1 flex justify-center"><span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold shadow-sm" style={{ color: GREEN }}><Check className="h-3.5 w-3.5" /> High compatibility</span></div>
              <p className="relative mt-4 text-center text-sm leading-relaxed text-[#183833]/75">The candidate is a great fit for a team where <b style={{ color: INK }}>data, hypotheses and fast experiments</b> matter: her strengths align with the role's requirements. The main thing to watch during onboarding is team collaboration.</p>
              <div className="relative mt-auto grid grid-cols-2 gap-3 pt-5">
                <div className="rounded-2xl bg-white/70 p-3 text-center"><p className="text-2xl font-bold" style={{ color: GREEN }}>{COMPAT_DIMS.filter((d) => d.val >= d.ref).length}</p><p className="mt-0.5 text-[11px] text-[#183833]/55">strong matches</p></div>
                <div className="rounded-2xl bg-white/70 p-3 text-center"><p className="text-2xl font-bold" style={{ color: AMBER }}>{COMPAT_DIMS.filter((d) => d.val < d.ref).length}</p><p className="mt-0.5 text-[11px] text-[#183833]/55">areas to watch</p></div>
              </div>
            </div>

            {/* match across culture dimensions */}
            <Card className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: `${GREEN}1a` }}><Target className="h-4 w-4" style={{ color: GREEN }} /></span> Match by dimension</p>
                <span className="flex items-center gap-1.5 text-[11px] text-[#183833]/45"><span className="inline-block h-2.5 w-4 rounded-full border border-[#cfd6ce]" style={{ background: "#e0e5df" }} /> gap to benchmark</span>
              </div>
              <div className="mt-4 flex flex-1 flex-col justify-between gap-3">
                {COMPAT_DIMS.map((d) => <DimRow key={d.name} d={d} mounted={mounted} />)}
              </div>
            </Card>
          </div>

          {/* strong matches / areas to watch */}
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-[#d8ecc4] bg-[#f3faea] p-5">
              <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest" style={{ color: GREEN }}><Sparkles className="h-4 w-4" /> Strong matches</p>
              <div className="mt-3 space-y-2.5">{COMPAT_MATCHES.map(([t, x]) => <div key={t} className="rounded-2xl bg-white/70 p-3.5"><p className="text-sm font-bold" style={{ color: INK }}>{t}</p><p className="mt-0.5 text-[13px] leading-snug text-[#183833]/65">{x}</p></div>)}</div>
            </div>
            <div className="rounded-3xl border border-[#f1d9a8] bg-[#fdf6e9] p-5">
              <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest" style={{ color: AMBER }}><AlertTriangle className="h-4 w-4" /> Areas to watch</p>
              <div className="mt-3 space-y-2.5">{COMPAT_ATTENTION.map(([t, x]) => <div key={t} className="rounded-2xl bg-white/70 p-3.5"><p className="text-sm font-bold" style={{ color: INK }}>{t}</p><p className="mt-0.5 text-[13px] leading-snug text-[#183833]/65">{x}</p></div>)}</div>
            </div>
          </div>
        </section>

        {/* 3 · risks / strengths / psycholinguistics */}
        <div className="rv grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: RED }}><Flame className="h-4 w-4" /> Risks</h3>
            <Block t="Team collaboration" badge="Important" bc={RED} text="Tends to keep key decisions to herself — a risk of becoming a bottleneck in a large team" />
            <Block t="Mass-market B2C experience" badge="Important" bc={AMBER} text="All her experience is concentrated in B2B fintech. In a mass-audience product she may lack intuition about user behavior" />
            <Block t="Salary expectations" badge="Note" bc={AMBER} text="Expectations are above the market average for the role. Worth aligning on the range and scope of responsibility in advance" />
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: GREEN }}><Sparkles className="h-4 w-4" /> Strengths</h3>
            <Block t="Data-driven approach" text="Makes product decisions based on metrics, A/B tests and unit economics rather than intuition" />
            <Block t="Full product lifecycle" text="Drives the product from hypothesis and customer development through launch and data-driven iteration" />
            <Block t="Customer focus" text="Dives deep into user pain points and feeds feedback into backlog prioritization" />
          </Card>
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: TEAL }}><AudioLines className="h-4 w-4" /> Psycholinguistics</h3>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold"><span style={{ color: INK }}>We</span><span style={{ color: INK }}>I</span></div>
              <div className="relative mt-1.5 h-1.5 rounded-full bg-[#eef2ec]">
                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000" style={{ width: mounted ? "70%" : "0%", background: `linear-gradient(90deg,${TEAL},${GREEN})` }} />
                <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition-[left] duration-1000" style={{ left: mounted ? "70%" : "0%", background: GREEN }} />
              </div>
            </div>
            <Block t="I / We balance" text="Skewed toward 'I': talks more often about her own decisions and hypotheses, less about the team's contribution" />
            <Block t="Tone" text="Lively, energetic, confident. Speech is fast and structured, with clear reasoning" />
            <Block t="Locus of control" text="Internal: attributes product outcomes to her own decisions and validated hypotheses" />
          </Card>
        </div>

        {/* 3 · compatibility chart */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Compatibility Chart</h2>
          <p className="mx-auto mt-1 max-w-md text-center text-[13px] text-[#183833]/55">The chart shows where the candidate falls short of the profile requirements</p>
          <div className="mt-4 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.3fr_1fr]">
            <Card><RoseChart /></Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-2xl border border-[#e6ece4] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(24,56,51,0.05)]"><span className="text-base font-bold">Average deviation</span><span className="flex items-center gap-1 text-base font-bold" style={{ color: AMBER }}>7% <ChevronDown className="h-4 w-4" /></span></div>
              <Card className="flex flex-1 flex-col">
                <p className="flex items-center gap-2 text-base font-bold" style={{ color: RED }}><Flame className="h-4 w-4" /> Top risks</p>
                <div className="mt-3 space-y-3">
                  {([
                    ["Teamwork", "16%", "Tends to keep key decisions to herself; lacks examples of delegation and distributed ownership"],
                    ["Stress tolerance", "11%", "Stays composed under deadlines, but the interview offered few direct examples of working through acute crises"],
                    ["Leadership", "9%", "Leads through product vision and data; lacks examples of tough management decisions in difficult conditions"],
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
                  <p className="flex items-center gap-2 text-base font-bold" style={{ color: GREEN }}><Sparkles className="h-4 w-4" /> Best match</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#183833]/75">The candidate's profile is closest to the requirements on the "Communication" and "Problem solving" skills</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 4 · soft skills map */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Soft Skills Map</h2>
          <p className="mx-auto mt-1 max-w-lg text-center text-[13px] text-[#183833]/55">A detailed gap analysis, a mini-chart and quotes open in a modal window</p>
          <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
            {SKILLS.map((s) => <SkillCard key={s.name} s={s} mounted={mounted} onOpen={() => setActive(s)} />)}
          </div>
        </section>

        {/* 5 · STAR cases */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">STAR Cases</h2>
          <div className="mt-4 space-y-4">
            <StarCase title="Case 1: Launching a B2B payment-analytics service for businesses"
              s="Bank clients couldn't make sense of their payment-flow structure, which drove up churn on business plans"
              t="Launch a product that clearly visualizes payment analytics and retains business clients"
              a="Ran the product as PO: conducted customer development, formulated hypotheses, prioritized the backlog and took the MVP to release with a team of 10"
              r="The MVP shipped in 4 months; the A/B test showed retention rising in the segment and churn dropping by a noticeable margin"
              note="A strong example of a full product lifecycle grounded in data. The weak spot is that the result is described only partially, without a full breakdown of the metrics" />
            <StarCase title="Case 2: Data-driven rebuild of onboarding in an EdTech product"
              s="In an EdTech service, users were dropping off en masse at the first steps and activation was low"
              t="Increase new-user activation and get them to their first value-driving action"
              a="Built the funnel, found bottlenecks through analytics, raised hypotheses and ran a series of A/B tests of the new onboarding"
              r="New-user activation rose as a result of the experiments; the patterns discovered were reused in other flows"
              note="Excellently demonstrates analytical and hypothesis-driven experimental thinking. The role here reveals her work with metrics more than her management of a team" />
          </div>
        </section>

        {/* 7 · recommendations */}
        <section className="rv">
          <h2 className="text-center text-lg font-bold md:text-2xl">Recommendations for next steps</h2>
          <div className="mt-4 space-y-3">
            <Reco title="Delegation and working with the team" text="The candidate tends to keep key decisions to herself. It's important to understand how she scales ownership in a large team"
              qs={["Describe a situation where you delegated an important product decision. How did you monitor the outcome?", "How do you involve the team in forming hypotheses, not just in execution?", "What do you do when a strong engineer's opinion diverges from your product vision?"]} />
            <Reco title="Experience in B2C and mass-market products" text="All her experience is concentrated in B2B fintech. It's unclear how the candidate would perform on a product for a broad audience"
              qs={["In your view, how does product work in B2C differ from the B2B you've worked in?", "How would you approach prioritization if the product had millions of diverse users?", "Which hypotheses would you test first when entering an unfamiliar mass market?"]} />
            <Reco title="Stakeholder management and conflicting priorities" text="We need to check how the candidate balances the interests of business, sales and engineering under limited resources"
              qs={["Describe the sharpest conflict of priorities between departments. How did you resolve it?", "How do you align the roadmap when business and engineering have different expectations on timelines?", "What will you do if sales demands a feature 'yesterday' but the data says it isn't needed?"]} />
          </div>
        </section>

        <p className="rv text-center text-xs text-[#183833]/40">TalentMind · automatically generated report · demo data</p>
      </div>

      {/* SKILL DETAIL MODAL */}
      {active && <SkillModal s={active} onClose={() => setActive(null)} />}
    </div>
  );
}

/* ============================================================
   Modal window — detailed skill breakdown
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
          <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e6ece4] text-[#183833]/55 transition-colors hover:bg-[#f4f7f2] hover:text-[#183833]"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* expectations + gap */}
          <div className="space-y-4">
            <SoftCard t="Role expectations" text="Requires confident command of the skill across all stages of the product lifecycle — from hypothesis and customer development through launch and metrics analysis" />
            <SoftCard t="Gap" text={gap < 0 ? "A small gap. The candidate works confidently with data and users. To score higher she lacked examples of team leadership and delegation" : "No gap — the candidate meets the profile requirements or exceeds them on this skill"} />
          </div>
          {/* chart */}
          <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[#e6ece4] bg-gradient-to-br from-[#f7fbf0] via-white to-[#eef7e0] p-6">
            <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#7AB800]/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-[-30%] h-32 w-32 rounded-full bg-[#11AFCC]/8 blur-3xl" />
            <ConeChart val={s.val} req={s.req} color={lc} />
            <div className="relative flex-1">
              <p className="text-sm font-semibold" style={{ color: INK }}>{s.name} <span className="ml-1 text-2xl font-bold" style={{ color: lc }}>{s.val}%</span></p>
              <div className="mt-4 space-y-2.5 text-xs">
                <LegendRow c="#bfe3ec" t="Gap" v={`${gap > 0 ? "+" : ""}${gap}%`} vc={gap < 0 ? RED : GREEN} d={0.5} />
                <LegendRow c={lc} t="Candidate level" v={`${s.val}%`} d={0.62} />
                <LegendRow c="#d6ebf2" t="Profile requirements" v={`${s.req}%`} d={0.74} />
              </div>
            </div>
          </div>
        </div>

        {/* why not higher / lower */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#fff5f5] p-5">
            <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: RED }}><TrendingDown className="h-4 w-4" /> Why not higher</p>
            <p className="mt-2 text-[15px] leading-snug text-[#183833]/70">The candidate is strong in analysis and hypotheses but shows team leadership less often: she makes key decisions herself more than she grows them within the team</p>
          </div>
          <div className="rounded-2xl bg-[#f3faea] p-5">
            <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: GREEN }}><TrendingUp className="h-4 w-4" /> Why not lower</p>
            <p className="mt-2 text-[15px] leading-snug text-[#183833]/70">A strong orientation toward data and the user. The candidate can set hypotheses, validate them with experiments and drive the product to a measurable result</p>
          </div>
        </div>

        {/* audio markers */}
        <div className="mt-4 rounded-2xl bg-[#f6faef] p-5">
          <p className="text-sm font-bold" style={{ color: INK }}>Audio markers</p>
          <p className="mt-1 text-[13px] text-[#183833]/55">When talking about the product she sounds energetic and confident, leaning on numbers and hypotheses</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["Speeds up her pace when she moves to metrics and experiment results — her engagement with data is noticeable", "Articulates 'hypothesis → test → conclusion' in a structured way, revealing a mature product mindset"].map((m) => (
              <div key={m} className="flex items-start gap-2"><AudioLines className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN }} /><span className="text-[13px] leading-snug text-[#183833]/65">{m}</span></div>
            ))}
          </div>
        </div>

        {/* quotes */}
        <div className="mt-4 rounded-2xl bg-[#f6faef] p-5">
          <p className="text-sm font-bold" style={{ color: INK }}>Quotes</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["I never launch a feature until I've defined a hypothesis and the metric that will tell me whether it worked", "We saw from the funnel exactly where clients were dropping off, and we rewrote that onboarding step", "I ran a dozen interviews before I understood the real pain of the business"].map((q) => (
              <div key={q} className="flex items-start gap-2"><MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN }} /><span className="text-[13px] italic leading-snug text-[#183833]/60">{q}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* cone shades by level (light · base · dark) */
const CONE_SHADES: Record<string, [string, string, string]> = {
  [GREEN]: ["#a4d44a", "#7AB800", "#5f9b00"],
  [AMBER]: ["#f6cf63", "#E8A317", "#bd840c"],
  [RED]: ["#ff8f8f", "#FF5252", "#dd3b3b"],
};
/* cone chart of the level (animated, color and length by percentage) */
function ConeChart({ val, req, color }: { val: number; req: number; color: string }) {
  const W = 196, H = 132, cy = H / 2, x0 = 16, x1 = W - 16, maxH = H - 26;
  const Lfull = x1 - x0, half = maxH / 2;
  const [c0, c1, c2] = CONE_SHADES[color] ?? CONE_SHADES[GREEN];
  /* the cone occupies val% of the scale length, thickness grows proportionally */
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

      {/* profile requirements — dashed outline up to req% */}
      <polygon points={`${x0},${cy} ${xr},${cy - hr} ${xr},${cy + hr}`} fill="#bfe3ec" fillOpacity="0.16" stroke="#a9d8e6" strokeWidth="1.8" strokeDasharray="4 4" strokeLinejoin="round" style={{ animation: "skillFade .4s ease .15s both" }} />
      <line x1={xr} y1={cy - hr} x2={xr} y2={cy + hr} stroke="#a9d8e6" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 4" style={{ animation: "skillFade .4s ease .15s both" }} />

      {/* candidate level — cone growing up to val% */}
      <g style={{ transformOrigin: `${x0}px ${cy}px`, animation: "coneGrow 1s cubic-bezier(.22,1,.36,1) .12s both" }}>
        <polygon points={`${x0},${cy} ${xv},${cy - hv} ${xv},${cy + hv}`} fill={`url(#${gid})`} filter={`url(#${fid})`} strokeLinejoin="round" />
        <line x1={xv} y1={cy - hv} x2={xv} y2={cy + hv} stroke={c2} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* apex */}
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
/* card for a "point of agreement / friction" */
/* match ring in the candidate header */
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
/* semicircular gauge for the compatibility index */
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
/* culture-dimension row: candidate vs benchmark (bullet bar) */
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
        {/* gap to the required level (benchmark) */}
        {g < 0 && (
          <div className="absolute inset-y-0 rounded-r-full" style={{ left: mounted ? `${d.val}%` : "0%", width: mounted ? `${-g}%` : "0%", background: "repeating-linear-gradient(-45deg,#dfe4de,#dfe4de 3px,#eceff0 3px,#eceff0 6px)", transition: "left 1.1s cubic-bezier(.22,1,.36,1), width 1.1s cubic-bezier(.22,1,.36,1)" }} />
        )}
        {/* candidate level */}
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: mounted ? `${d.val}%` : "0%", background: t.c, transition: "width 1.1s cubic-bezier(.22,1,.36,1)" }} />
      </div>
    </div>
  );
}

/* ============================================================
   Small components
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
      <button onClick={onOpen} className="ease-smooth mt-auto inline-flex w-fit items-center gap-1.5 self-start rounded-full border border-[#d8ecc4] px-3.5 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:bg-[#f3faea]" style={{ color: GREEN, marginTop: "auto" }}>Details →</button>
    </Card>
  );
}
function StarCase({ title, s, t, a, r, note }: { title: string; s: string; t: string; a: string; r: string; note: string }) {
  const rows: [string, string, string][] = [["Situation", s, TEAL], ["Task", t, GREEN], ["Action", a, AMBER], ["Result", r, GREEN]];
  return (
    <Card>
      <p className="text-sm font-bold">{title}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([k, v, c]) => <div key={k} className="rounded-2xl bg-[#f6faef] p-3"><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: c }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {k}</p><p className="mt-1 text-xs leading-snug text-[#183833]/70">{v}</p></div>)}
      </div>
      <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[#d8ecc4] bg-[#f3faea] p-3.5"><MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GREEN }} /><div><p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: GREEN }}>Assessment</p><p className="mt-0.5 text-xs leading-snug text-[#183833]/70">{note}</p></div></div>
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
/* rose chart (polar sectors) */
function RoseChart() {
  const N = RADAR.length, cx = 280, cy = 220, R = 140, seg = 360 / N, pad = 1.6, labelR = R + 18;
  const lvl = (v: number) => (v >= 60 ? GREEN : v >= 40 ? "#bcdd93" : "#f2a0a0");
  const rad = (d: number) => (d * Math.PI) / 180;
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
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 560 480" className="w-full max-w-[520px]">
        {/* the full 0–100% scale — neutral sector backdrop */}
        {RADAR.map((_, i) => <path key={`bg${i}`} d={sector(R, i)} fill="#eef1f3" stroke="#ffffff" strokeWidth="2.5" />)}
        {/* thin concentric scale guides */}
        {[0.25, 0.5, 0.75, 1].map((f) => RADAR.map((_, i) => <path key={`g${f}-${i}`} d={arc(R * f, i)} fill="none" stroke="#d2dce2" strokeWidth="1" opacity="0.7" />))}
        {/* profile requirements — light-blue sector up to the req level */}
        {RADAR.map((d, i) => <path key={`req${i}`} d={sector((R * d.req) / 100, i)} fill="#bcd9ec" stroke="#ffffff" strokeWidth="1.5" />)}
        {/* candidate level — filled sector by value */}
        {RADAR.map((d, i) => <path key={`v${i}`} d={sector((R * d.v) / 100, i)} fill={lvl(d.v)} style={{ transformOrigin: `${cx}px ${cy}px`, animation: `roseG .7s ease-out ${0.04 * i + 0.1}s both` }} />)}
        {/* candidate's % values inside the sector */}
        {RADAR.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), rr = R * 0.66;
          return <text key={`p${i}`} x={(cx + rr * Math.cos(a)).toFixed(1)} y={(cy + rr * Math.sin(a)).toFixed(1)} fontSize="13" fontWeight="700" fill="#2b4a44" textAnchor="middle" dominantBaseline="middle">{d.v}%</text>;
        })}
        {/* skill labels outside */}
        {RADAR.map((d, i) => {
          const a = rad((i + 0.5) * seg - 90), ca = Math.cos(a);
          const anchor = ca > 0.15 ? "start" : ca < -0.15 ? "end" : "middle";
          return <text key={`l${i}`} x={(cx + labelR * ca).toFixed(1)} y={(cy + labelR * Math.sin(a)).toFixed(1)} fontSize="12.5" fill="#3a4f4a" textAnchor={anchor} dominantBaseline="middle">{d.l}</text>;
        })}
        <style>{`@keyframes roseG{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#183833]/70 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-4">
        <Lg c="#bcd9ec" t="Profile requirements" /><Lg c="#f2a0a0" t="Low skill level" /><Lg c="#bcdd93" t="Medium skill level" /><Lg c={GREEN} t="High skill level" />
      </div>
    </div>
  );
}
function Lg({ c, t }: { c: string; t: string }) { return <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-black/5" style={{ background: c }} /> {t}</span>; }
