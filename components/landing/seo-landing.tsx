"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  Building2,
  Check,
  ChartNoAxesCombined,
  Crosshair,
  Globe,
  Lock,
  MapPin,
  Search,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { submitSeoLead, type SeoLeadState } from "@/app/actions/seo-lead";
import { TurnstileField } from "@/components/shared/turnstile-field";
import { SessionField } from "@/components/shared/session-field";
import { track } from "@/lib/analytics";
import { LandingHeader, LandingFooter } from "@/components/landing/landing-chrome";
import { IndustryLogoWall, TrustSection } from "@/components/landing/trust";
import { GOOGLE_PARTNER_BADGE, GOOGLE_PARTNER_PROFILE_URL } from "@/lib/data/certifications";
import { SEO_GOALS, SEO_INVESTMENTS, SEO_LANDING_SOURCE, aiProofs } from "@/lib/data/landing-seo";

/**
 * "SEO + AI search visibility" paid-traffic landing page — ported from the
 * standalone Vite build (branch `seo-landing-page`) into the site, on the same
 * scoped stylesheet as /100-leads (app/100-leads/landing.css → .lp-root, with
 * the page-specific additions under .lp-seo).
 *
 * The three-step "visibility check" is ONE <form> posting to `submitSeoLead`;
 * step 1/2 answers travel as hidden inputs. On success the action redirects to
 * /seo-visibility/thank-you — the conversion URL for the ad platforms.
 */

const PROOF = "/landing/proof";

const GOAL_ICONS: Record<string, LucideIcon> = { google: Search, maps: MapPin, ai: Bot, all: Sparkles };
const steps = ["Search", "Goal", "Contact"];
const initial: SeoLeadState = { ok: false, message: "" };

function useAttribution() {
  const [utm, setUtm] = useState("");
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const out: Record<string, string> = {};
      for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid"]) {
        const v = params.get(k);
        if (v) out[k] = v;
      }
      if (document.referrer) out.referrer = document.referrer;
      out.path = window.location.pathname + window.location.search;
      setUtm(JSON.stringify(out));
    } catch {
      /* attribution is a nice-to-have */
    }
  }, []);
  return utm;
}

function scrollToForm() {
  document.getElementById("visibility-check")?.scrollIntoView({ behavior: "smooth", block: "center" });
}
function scrollToProof() {
  document.getElementById("ai-proof")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="form-stepper" aria-label={`Step ${step} of ${steps.length}`}>
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        return (
          <li key={label} className={number === step ? "is-current" : complete ? "is-complete" : ""}>
            <span>{complete ? <Check aria-hidden="true" /> : number}</span>
            <small>{label}</small>
          </li>
        );
      })}
    </ol>
  );
}

function VisibilityForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ website: "", search: "", goal: "", investment: "", company: "", name: "", email: "", phone: "" });
  const [state, action, pending] = useActionState(submitSeoLead, initial);
  const utm = useAttribution();

  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (state.message && !state.ok) setAttempt((n) => n + 1);
  }, [state]);

  useEffect(() => {
    const e = state.errors ?? {};
    if (e.website || e.search) setStep(1);
    else if (e.goal || e.investment) setStep(2);
  }, [state.errors]);

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };
  const choose = (name: "goal" | "investment", value: string) => setForm((current) => ({ ...current, [name]: value }));

  const stepOneReady = Boolean(form.website.trim() && form.search.trim());
  const stepTwoReady = Boolean(form.goal && form.investment);

  const goTo = (next: number) => {
    if (next === 2 && step === 1) track("audit_form_start", { source: SEO_LANDING_SOURCE });
    setStep(next);
  };
  const advanceOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (stepOneReady) goTo(2);
  };

  const errors = state.errors ?? {};

  return (
    <section className="lead-form" id="visibility-check" aria-labelledby="form-title">
      <div className="form-topline">
        <span>
          <BadgeCheck aria-hidden="true" /> Free search visibility check
        </span>
        <strong>{step} / 3</strong>
      </div>
      <Stepper step={step} />

      <form action={action} noValidate={step !== 3}>
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="lp-hidden" aria-hidden />
        <input type="hidden" name="source" value={SEO_LANDING_SOURCE} />
        <input type="hidden" name="utm" value={utm} readOnly />
        <SessionField />
        {step !== 1 ? (
          <>
            <input type="hidden" name="website" value={form.website} readOnly />
            <input type="hidden" name="search" value={form.search} readOnly />
          </>
        ) : null}
        <input type="hidden" name="goal" value={form.goal} readOnly />
        <input type="hidden" name="investment" value={form.investment} readOnly />

        {step === 1 && (
          <div className="form-panel">
            <div className="form-heading">
              <p className="form-kicker">Start with one valuable search</p>
              <h2 id="form-title">What should AI recommend you for?</h2>
              <p>Give us your website and the service + city your next customer would ask about.</p>
            </div>
            <div className="input-stack">
              <label>
                <span>Your website</span>
                <div className="input-shell">
                  <Globe aria-hidden="true" />
                  <input name="website" value={form.website} onChange={update} onKeyDown={advanceOnEnter} placeholder="e.g. northstarheating.ca" autoComplete="url" inputMode="url" required />
                </div>
                {errors.website ? <em className="field-error">{errors.website}</em> : null}
              </label>
              <label>
                <span>Service + city</span>
                <div className="input-shell">
                  <Search aria-hidden="true" />
                  <input name="search" value={form.search} onChange={update} onKeyDown={advanceOnEnter} placeholder="e.g. Furnace repair in Toronto" required />
                </div>
                {errors.search ? <em className="field-error">{errors.search}</em> : null}
              </label>
            </div>
            <button className="primary-button" type="button" disabled={!stepOneReady} onClick={() => goTo(2)}>
              Show me my opportunity <ArrowRight aria-hidden="true" />
            </button>
            <p className="form-reassurance">
              <Lock aria-hidden="true" /> No account access. No credit card. No obligation.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="form-panel">
            <div className="form-heading">
              <p className="form-kicker">Set the visibility target</p>
              <h2>Where do you need to show up?</h2>
              <p>This tells us which search surfaces to measure before and after.</p>
            </div>
            <fieldset className="choice-fieldset">
              <legend>Primary goal</legend>
              <div className="choice-grid" role="radiogroup" aria-label="Primary visibility goal">
                {SEO_GOALS.map(({ id, label }) => {
                  const Icon = GOAL_ICONS[id] ?? Search;
                  const selected = form.goal === id;
                  return (
                    <button key={id} type="button" className={selected ? "choice-card is-selected" : "choice-card"} role="radio" aria-checked={selected} onClick={() => choose("goal", id)}>
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                      <i>{selected && <Check aria-hidden="true" />}</i>
                    </button>
                  );
                })}
              </div>
              {errors.goal ? <em className="field-error">{errors.goal}</em> : null}
            </fieldset>
            <fieldset className="choice-fieldset budget-fieldset">
              <legend>Monthly SEO investment</legend>
              <div className="budget-grid" role="radiogroup" aria-label="Monthly SEO investment">
                {SEO_INVESTMENTS.map(({ id, label }) => (
                  <button key={id} type="button" className={form.investment === id ? "budget-choice is-selected" : "budget-choice"} role="radio" aria-checked={form.investment === id} onClick={() => choose("investment", id)}>
                    {label}
                  </button>
                ))}
              </div>
              {errors.investment ? <em className="field-error">{errors.investment}</em> : null}
            </fieldset>
            <div className="form-actions">
              <button className="secondary-button" type="button" onClick={() => goTo(1)}>
                <ArrowLeft aria-hidden="true" /> Back
              </button>
              <button className="primary-button" type="button" disabled={!stepTwoReady} onClick={() => goTo(3)}>
                Continue <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-panel">
            <div className="form-heading">
              <p className="form-kicker">Last step</p>
              <h2>Where should we send the findings?</h2>
              <p>We’ll contact you about this request only. Your details are not sold.</p>
            </div>
            <div className="input-stack compact-fields">
              <label>
                <span>Business name</span>
                <input name="company" value={form.company} onChange={update} autoComplete="organization" required />
                {errors.company ? <em className="field-error">{errors.company}</em> : null}
              </label>
              <label>
                <span>Your name</span>
                <input name="name" value={form.name} onChange={update} autoComplete="name" required />
                {errors.name ? <em className="field-error">{errors.name}</em> : null}
              </label>
              <label>
                <span>Work email</span>
                <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required />
                {errors.email ? <em className="field-error">{errors.email}</em> : null}
              </label>
              <label>
                <span>Phone / WhatsApp</span>
                <input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" required />
                {errors.phone ? <em className="field-error">{errors.phone}</em> : null}
              </label>
            </div>
            <TurnstileField resetKey={attempt} />
            {state.message && !state.ok ? (
              <p className="form-error" role="alert">
                {state.message}
              </p>
            ) : null}
            <div className="form-actions">
              <button className="secondary-button" type="button" onClick={() => goTo(2)} disabled={pending}>
                <ArrowLeft aria-hidden="true" /> Back
              </button>
              <button className="primary-button" type="submit" disabled={pending}>
                {pending ? "Checking your visibility…" : "Request my visibility check"} <ArrowRight aria-hidden="true" />
              </button>
            </div>
            <p className="consent-copy">
              By submitting, you agree that PPC Guru may contact you about this request. See our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        )}
      </form>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element -- supplied JPEG screenshots + badge artwork */
function ProofGallery() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const show = (index: number) => {
    const next = Math.max(0, Math.min(aiProofs.length - 1, index));
    const el = trackRef.current;
    const card = el?.children[next] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setActive(next);
  };

  const sync = () => {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const next = cards.reduce(
      (closest, card, index) => (Math.abs(card.offsetLeft - el.offsetLeft - el.scrollLeft) < Math.abs(cards[closest].offsetLeft - el.offsetLeft - el.scrollLeft) ? index : closest),
      0,
    );
    if (next !== active) setActive(next);
  };

  return (
    <section className="results-section mobile-results" id="ai-proof" aria-labelledby="proof-title">
      <div className="results-heading mobile-results-heading">
        <div>
          <p className="section-kicker">Original ChatGPT app screenshots</p>
          <h2 id="proof-title">
            See PPC Guru recommended by <span>ChatGPT.</span>
          </h2>
        </div>
        <p>Real captures for SEO, Google Ads and Meta Ads searches in Toronto. Swipe through them on mobile or compare all three side by side on desktop.</p>
      </div>

      <div className="mobile-proof-list" ref={trackRef} onScroll={sync}>
        {aiProofs.map((proof, index) => (
          <article className="mobile-proof-card" key={proof.file}>
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{proof.platform}</p>
                <h3>{proof.title}</h3>
              </div>
              <small>Original</small>
            </header>
            <figure>
              <img src={`${PROOF}/${proof.file}`} alt={proof.alt} width={736} height={1600} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
              <figcaption>
                <BadgeCheck aria-hidden="true" /> Original ChatGPT app screenshot supplied by PPC Guru.
              </figcaption>
            </figure>
            <div className="mobile-proof-source">
              <p>
                <strong>Search shown</strong> “{proof.query}”
              </p>
              <p>{proof.caption}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="proof-mobile-controls" aria-label="ChatGPT screenshot controls">
        <button type="button" onClick={() => show(active - 1)} disabled={active === 0} aria-label="Show previous screenshot">
          <ArrowLeft />
        </button>
        <div className="proof-dots" aria-label={`Screenshot ${active + 1} of ${aiProofs.length}`}>
          {aiProofs.map((proof, index) => (
            <button key={proof.file} type="button" className={index === active ? "is-active" : ""} onClick={() => show(index)} aria-label={`Show ${proof.platform} screenshot`} />
          ))}
        </div>
        <button type="button" onClick={() => show(active + 1)} disabled={active === aiProofs.length - 1} aria-label="Show next screenshot">
          <ArrowRight />
        </button>
      </div>

      <div className="proof-conversion">
        <p>Want to know what customers may find about your business?</p>
        <button className="primary-button" type="button" onClick={scrollToForm}>
          Check my search visibility <ArrowRight aria-hidden="true" />
        </button>
      </div>

      <p className="result-disclosure">
        <strong>Important:</strong> These are original, time-specific ChatGPT app screenshots supplied by PPC Guru. Exact outputs vary by prompt, location, account, sources and time. They show observed answers — not permanent rankings, independent endorsements or guaranteed placement.
      </p>
    </section>
  );
}

const deliverables: { Icon: LucideIcon; title: string; copy: string }[] = [
  { Icon: Globe, title: "Build the baseline", copy: "Record how your agreed searches appear across Google, Maps and selected AI answers." },
  { Icon: Crosshair, title: "Improve the signals", copy: "Strengthen local relevance, service pages, technical clarity and the sources that describe your business." },
  { Icon: ChartNoAxesCombined, title: "Measure the change", copy: "Recheck the same queries after 30 days and report what moved, what did not and what comes next." },
];

function MeasurementSection() {
  return (
    <section className="quality-section" aria-labelledby="measure-title">
      <div className="quality-copy">
        <p className="section-kicker">No vague “AI ranking” report</p>
        <h2 id="measure-title">
          A 30-day target you can <span>actually inspect.</span>
        </h2>
        <p>We agree on the services, cities, searches and evidence before work starts. That turns “get me found” into a clear visibility plan.</p>
        <ul>
          {["Same search themes", "Same target cities", "Before-and-after captures", "Clear next-step report"].map((item) => (
            <li key={item}>
              <Check aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <aside className="guarantee-card">
        <div className="guarantee-number">
          <Target aria-hidden="true" />
          <strong>30</strong>
          <span>days to measure the agreed target</span>
        </div>
        <div className="guarantee-zero">
          <small>Visibility surfaces measured</small>
          <strong>3</strong>
          <span>Google Search, Maps and AI answers</span>
        </div>
        <p>No agency can honestly guarantee a specific Google position, AI citation, recommendation or lead volume. We guarantee clarity about the target and report the work measured against it.</p>
      </aside>
      <ol className="process-row">
        {deliverables.map(({ Icon, title, copy }, index) => (
          <li key={title}>
            <span>{index + 1}</span>
            <Icon aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function SeoLanding() {
  return (
    <div className="lp-root lp-seo">
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader ctaLabel="Get my visibility plan" formId="visibility-check" tagline="SEO + AI visibility" />
          <div className="lp-main">
            <section className="hero-section">
              <div className="hero-copy">
                <p className="hero-kicker">
                  <span /> SEO + AI-search visibility · Canada &amp; USA
                </p>
                <h1>
                  Make your business the obvious answer. <em>In Google and AI search.</em>
                </h1>
                <p className="hero-lede">
                  When customers ask ChatGPT who to hire, your business should be easy to find, verify and recommend. We build the search signals that help local businesses appear across Google and selected AI answers — with a measurable 30-day target agreed upfront.
                </p>
                <div className="hero-checks">
                  <span>
                    <Check aria-hidden="true" /> Google Search + Maps
                  </span>
                  <span>
                    <Check aria-hidden="true" /> AI-answer visibility
                  </span>
                  <span>
                    <Check aria-hidden="true" /> Same searches checked before + after
                  </span>
                </div>
                <div className="hero-assurance">
                  <div>
                    <Target aria-hidden="true" />
                    <span>
                      <strong>30 days</strong> agreed measurement target
                    </span>
                  </div>
                  <div>
                    <Building2 aria-hidden="true" />
                    <span>
                      <strong>200+ businesses</strong> trusted PPC Guru
                    </span>
                  </div>
                  <a className="hero-partner-badge" href={GOOGLE_PARTNER_PROFILE_URL} target="_blank" rel="noopener noreferrer nofollow" aria-label="Google Partner — view PPC Guru's profile on Google Partners">
                    <img src={GOOGLE_PARTNER_BADGE} alt="Google Partner" width={56} height={54} />
                    <span>
                      <strong>Google Partner</strong>
                      <small>Verified profile</small>
                    </span>
                  </a>
                  <button type="button" onClick={scrollToProof}>
                    See captured answers <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
              <VisibilityForm />
            </section>
          </div>
        </div>
        <IndustryLogoWall />
        <ProofGallery />
        <MeasurementSection />
        <TrustSection />
        <section className="final-cta" aria-labelledby="final-title">
          <div>
            <p className="section-kicker">Before your next customer asks</p>
            <h2 id="final-title">See what Google and AI say about your business right now.</h2>
          </div>
          <button className="primary-button" type="button" onClick={scrollToForm}>
            Show me my visibility <ArrowRight aria-hidden="true" />
          </button>
        </section>
        <LandingFooter tagline="Search visibility for local and service businesses." />
      </div>
    </div>
  );
}
/* eslint-enable @next/next/no-img-element */
