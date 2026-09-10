"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  ChartBar,
  Check,
  ClipboardList,
  HardHat,
  HeartPulse,
  House,
  Lock,
  MapPin,
  ShieldCheck,
  Target,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { submitLandingLead, type LandingLeadState } from "@/app/actions/landing-lead";
import { TurnstileField } from "@/components/shared/turnstile-field";
import { SessionField } from "@/components/shared/session-field";
import { track } from "@/lib/analytics";
import {
  BUSINESS_TYPES,
  LANDING_BUDGETS,
  LANDING_SOURCE,
  campaignResults,
  clientLogos,
  logoLabel,
} from "@/lib/data/landing-100-leads";

/**
 * "100 Qualified Leads" paid-traffic landing page — ported from the standalone
 * Vite build (branch `landing-page`). Styles live in app/100-leads/landing.css,
 * scoped under `.lp-root`, so this component owns its own header/footer and
 * the site chrome is hidden on this route (components/layout/chrome-gate.tsx).
 *
 * The three-step qualification flow is ONE <form> posting to
 * `submitLandingLead`; earlier steps' answers travel as hidden inputs so a
 * single server action sees the whole picture. On success the action
 * redirects to /100-leads/thank-you.
 */

const LOGOS = "/landing/logos";
const RESULTS = "/landing/results";

const TYPE_ICONS: Record<string, LucideIcon> = {
  "home-services": House,
  construction: HardHat,
  healthcare: HeartPulse,
  professional: Briefcase,
};

const steps = ["Business", "Campaign", "Contact"];
const initial: LandingLeadState = { ok: false, message: "" };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** utm_* / click ids / referrer from the landing URL → one hidden JSON field. */
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
  document.getElementById("qualification")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollToResults() {
  document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

function QualificationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ company: "", location: "", businessType: "", budget: "", name: "", email: "", phone: "" });
  const [state, action, pending] = useActionState(submitLandingLead, initial);
  const utm = useAttribution();

  // Turnstile tokens are single-use: after a rejected submit, issue a fresh
  // challenge before the retry.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (state.message && !state.ok) setAttempt((n) => n + 1);
  }, [state]);

  // A server-side validation error on a step-1/2 field means the visitor
  // tampered or a stale tab — send them back to that step rather than stranding
  // them on the contact panel with an invisible error.
  useEffect(() => {
    const e = state.errors ?? {};
    if (e.company || e.location) setStep(1);
    else if (e.business_type || e.budget) setStep(2);
  }, [state.errors]);

  const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };
  const choose = (name: "businessType" | "budget", value: string) => setForm((current) => ({ ...current, [name]: value }));

  const stepOneReady = Boolean(form.company.trim() && form.location.trim());
  const stepTwoReady = Boolean(form.businessType && form.budget);

  const goTo = (next: number) => {
    if (next === 2 && step === 1) track("audit_form_start", { source: LANDING_SOURCE });
    setStep(next);
  };

  /** Enter on a step-1 field advances the step instead of submitting the whole form. */
  const advanceOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (stepOneReady) goTo(2);
  };

  const errors = state.errors ?? {};

  return (
    <section className="lead-form" id="qualification" aria-labelledby="qualification-title">
      <div className="form-topline">
        <span>
          <BadgeCheck aria-hidden="true" /> 100-lead fit check
        </span>
        <strong>{step} of 3</strong>
      </div>
      <Stepper step={step} />

      <form action={action} noValidate={step !== 3}>
        {/* Honeypot + attribution + first-party session id. */}
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="lp-hidden" aria-hidden />
        <input type="hidden" name="source" value={LANDING_SOURCE} />
        <input type="hidden" name="utm" value={utm} readOnly />
        <SessionField />
        {/* Answers from earlier steps ride along as hidden fields. */}
        {step !== 1 ? (
          <>
            <input type="hidden" name="company" value={form.company} readOnly />
            <input type="hidden" name="location" value={form.location} readOnly />
          </>
        ) : null}
        <input type="hidden" name="business_type" value={form.businessType} readOnly />
        <input type="hidden" name="budget" value={form.budget} readOnly />

        {step === 1 && (
          <div className="form-panel">
            <div className="form-heading">
              <p className="form-kicker">Let’s start with your market</p>
              <h2 id="qualification-title">Where should we send the leads?</h2>
              <p>Tell us which business and service area we would be advertising.</p>
            </div>
            <div className="input-stack">
              <label>
                <span>Business name</span>
                <div className="input-shell">
                  <Building2 aria-hidden="true" />
                  <input name="company" value={form.company} onChange={updateField} onKeyDown={advanceOnEnter} placeholder="e.g. Northstar Heating" autoComplete="organization" required />
                </div>
                {errors.company ? <em className="field-error">{errors.company}</em> : null}
              </label>
              <label>
                <span>Primary city or service area</span>
                <div className="input-shell">
                  <MapPin aria-hidden="true" />
                  <input name="location" value={form.location} onChange={updateField} onKeyDown={advanceOnEnter} placeholder="e.g. Toronto & GTA" autoComplete="address-level2" required />
                </div>
                {errors.location ? <em className="field-error">{errors.location}</em> : null}
              </label>
            </div>
            <button className="primary-button" type="button" disabled={!stepOneReady} onClick={() => goTo(2)}>
              Map my lead market <ArrowRight aria-hidden="true" />
            </button>
            <p className="form-reassurance">
              <Lock aria-hidden="true" /> No credit card, contract or account access needed.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="form-panel">
            <div className="form-heading">
              <p className="form-kicker">Build the right campaign</p>
              <h2>What best describes {form.company || "your business"}?</h2>
              <p>These answers help us judge whether a 100-lead target is realistic.</p>
            </div>
            <fieldset className="choice-fieldset">
              <legend>Business type</legend>
              <div className="choice-grid" role="radiogroup" aria-label="Business type">
                {BUSINESS_TYPES.map(({ id, label }) => {
                  const Icon = TYPE_ICONS[id] ?? Briefcase;
                  const selected = form.businessType === id;
                  return (
                    <button key={id} type="button" className={selected ? "choice-card is-selected" : "choice-card"} role="radio" aria-checked={selected} onClick={() => choose("businessType", id)}>
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                      <i>{selected && <Check aria-hidden="true" />}</i>
                    </button>
                  );
                })}
              </div>
              {errors.business_type ? <em className="field-error">{errors.business_type}</em> : null}
            </fieldset>
            <fieldset className="choice-fieldset budget-fieldset">
              <legend>Monthly ad budget</legend>
              <div className="budget-grid" role="radiogroup" aria-label="Monthly ad budget">
                {LANDING_BUDGETS.map(({ id, label }) => (
                  <button key={id} type="button" className={form.budget === id ? "budget-choice is-selected" : "budget-choice"} role="radio" aria-checked={form.budget === id} onClick={() => choose("budget", id)}>
                    {label}
                  </button>
                ))}
              </div>
              {errors.budget ? <em className="field-error">{errors.budget}</em> : null}
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
              <h2>Where should we send your lead plan?</h2>
              <p>We’ll use this to arrange a short qualification call—not to spam you.</p>
            </div>
            <div className="input-stack compact-fields">
              <label>
                <span>Your name</span>
                <input name="name" value={form.name} onChange={updateField} autoComplete="name" required />
                {errors.name ? <em className="field-error">{errors.name}</em> : null}
              </label>
              <label>
                <span>Work email</span>
                <input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />
                {errors.email ? <em className="field-error">{errors.email}</em> : null}
              </label>
              <label>
                <span>Phone number</span>
                <input name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" required />
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
                {pending ? "Checking your fit…" : "See if I qualify"} <ArrowRight aria-hidden="true" />
              </button>
            </div>
            <p className="consent-copy">
              By continuing, you agree that PPC Guru may contact you about this request. See our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        )}
      </form>
    </section>
  );
}

function LogoMarquee() {
  const repeated = [...clientLogos, ...clientLogos];
  return (
    <section className="logo-proof" aria-labelledby="logos-title">
      <div className="logo-proof-heading">
        <p id="logos-title">
          <strong>Trusted across 200+ businesses</strong>
          <span>A selection of client brands, franchises and national names.</span>
        </p>
        <div className="proof-rating">
          <BadgeCheck aria-hidden="true" />
          <span>Real PPC Guru clients</span>
        </div>
      </div>
      <div className="logo-viewport" aria-label="PPC Guru client logo carousel">
        <div className="logo-track">
          {repeated.map((file, index) => (
            <figure className="logo-item" key={`${file}-${index}`} aria-hidden={index >= clientLogos.length}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 57 tiny mixed-format logos; next/image adds nothing here */}
              <img src={`${LOGOS}/${file}`} alt={index < clientLogos.length ? logoLabel(file) : ""} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const total = campaignResults.length;

  const move = useCallback((direction: number) => setIndex((current) => (current + direction + total) % total), [total]);

  useEffect(() => {
    if (paused || reducedMotion || lightboxOpen) return undefined;
    const timer = window.setInterval(() => move(1), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, lightboxOpen, move]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxOpen, move]);

  const handlePointerUp = (event: React.PointerEvent) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    if (Math.abs(distance) > 40) {
      didSwipe.current = true;
      move(distance < 0 ? 1 : -1);
    }
    pointerStart.current = null;
  };

  const previous = campaignResults[(index - 1 + total) % total];
  const active = campaignResults[index];
  const next = campaignResults[(index + 1) % total];
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  /* eslint-disable @next/next/no-img-element -- supplied JPEG screenshots inside a swipe/lightbox deck */
  return (
    <section className="results-section" id="results" aria-labelledby="results-title">
      <div className="results-heading">
        <div>
          <p className="section-kicker">Original Meta Ads dashboards</p>
          <h2 id="results-title">
            Get 100 qualified leads. <span>Or our management fee is $0.</span>
          </h2>
        </div>
        <p>Open original PPC Guru campaign screenshots and inspect the results behind the promise. No recreated charts and no made-up dashboard mockups.</p>
      </div>
      <div
        className="proof-shell"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
          didSwipe.current = false;
          setPaused(true);
        }}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
          didSwipe.current = false;
        }}
      >
        <div className="proof-stage">
          <div className="dashboard-ghost ghost-left" aria-hidden="true">
            <img src={`${RESULTS}/${previous.file}`} alt="" />
          </div>
          <button
            className="dashboard-card"
            type="button"
            onClick={() => {
              if (didSwipe.current) {
                didSwipe.current = false;
                return;
              }
              setLightboxOpen(true);
            }}
            aria-label={`Open ${active.client} Meta Ads result full size`}
          >
            <div className="dashboard-card-head">
              <span className="client-lockup">
                <img src={`${LOGOS}/${active.logo}`} alt="" />
                <span>
                  <strong>{active.client}</strong>
                  <small>Meta Ads · Client snapshot</small>
                </span>
              </span>
              <span className="verified-chip">
                <BadgeCheck aria-hidden="true" /> Actual result
              </span>
            </div>
            <div className="dashboard-stats" aria-live="polite">
              <span>
                <small>Result</small>
                <strong>{active.result}</strong>
              </span>
              <span>
                <small>Cost</small>
                <strong>{active.cost}</strong>
              </span>
              <span>
                <small>Spend</small>
                <strong>{active.spend}</strong>
              </span>
            </div>
            <div className="dashboard-image-wrap">
              <img src={`${RESULTS}/${active.file}`} alt={`${active.client} Meta Ads dashboard screenshot`} />
            </div>
            <span className="open-result">
              Tap to inspect full result <ArrowRight aria-hidden="true" />
            </span>
          </button>
          <div className="dashboard-ghost ghost-right" aria-hidden="true">
            <img src={`${RESULTS}/${next.file}`} alt="" />
          </div>
        </div>
        <div className="proof-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous campaign result">
            <ArrowLeft />
          </button>
          <div className="result-dots" aria-label="Choose campaign result">
            {campaignResults.map((result, resultIndex) => (
              <button
                key={result.file}
                type="button"
                className={resultIndex === index ? "is-active" : ""}
                aria-label={`Show ${result.client}`}
                aria-current={resultIndex === index ? "true" : undefined}
                onClick={() => setIndex(resultIndex)}
              />
            ))}
          </div>
          <span>{counter}</span>
          <button type="button" onClick={() => move(1)} aria-label="Next campaign result">
            <ArrowRight />
          </button>
        </div>
      </div>
      <p className="result-disclosure">
        These are real campaign screenshots supplied by PPC Guru. Results vary by offer, market, budget and follow-up. Lead and enquiry results are not the same as independently verified sales or revenue.
      </p>
      {lightboxOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.client} campaign result`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button ref={closeRef} className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close full result">
            <X />
          </button>
          <button className="lightbox-arrow lightbox-arrow-left" type="button" onClick={() => move(-1)} aria-label="Previous result">
            <ArrowLeft />
          </button>
          <figure>
            <img src={`${RESULTS}/${active.file}`} alt={`${active.client} Meta Ads dashboard screenshot, full size`} />
            <figcaption>
              <span>
                <strong>{active.client}</strong>
                <small>
                  {active.result} · {active.cost}
                </small>
              </span>
              <b>{counter}</b>
            </figcaption>
          </figure>
          <button className="lightbox-arrow lightbox-arrow-right" type="button" onClick={() => move(1)} aria-label="Next result">
            <ArrowRight />
          </button>
        </div>
      )}
    </section>
  );
  /* eslint-enable @next/next/no-img-element */
}

function QualitySection() {
  const qualityChecks = [
    "Needs the service you actually sell",
    "Located inside the agreed service area",
    "Provides real, usable contact information",
    "Shows genuine intent—not a bot or duplicate",
  ];
  const process: { Icon: LucideIcon; title: string; copy: string }[] = [
    { Icon: ClipboardList, title: "Agree", copy: "We define the offer, geography and quality rules in writing." },
    { Icon: ChartBar, title: "Launch", copy: "We build the campaign, creative, tracking and lead flow." },
    { Icon: ShieldCheck, title: "Prove", copy: "Every enquiry is tracked against the agreed 100-lead target." },
  ];
  return (
    <section className="quality-section" aria-labelledby="quality-title">
      <div className="quality-copy">
        <p className="section-kicker">No vague definition of “quality”</p>
        <h2 id="quality-title">
          We agree on what counts <span>before your first ad runs.</span>
        </h2>
        <p>You should never have to argue about whether junk enquiries count toward the target. The qualification rules are set upfront.</p>
        <ul>
          {qualityChecks.map((item) => (
            <li key={item}>
              <Check aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="guarantee-card">
        <div className="guarantee-number">
          <TrendingUp aria-hidden="true" />
          <strong>100</strong>
          <span>agreed-quality leads</span>
        </div>
        <div className="guarantee-zero">
          <small>If we miss the target</small>
          <strong>$0</strong>
          <span>management fee</span>
        </div>
        <p>Ad spend is separate and paid directly to Google or Meta. Qualification and written campaign terms apply.</p>
      </div>
      <ol className="process-row">
        {process.map(({ Icon, title, copy }, index) => (
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

/** `ctaHref`: on pages without the form (thank-you) the header CTA navigates back to the offer instead of scrolling. */
export function LandingHeader({ ctaHref }: { ctaHref?: string } = {}) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="PPC Guru home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${LOGOS}/ppc-guru.png`} alt="PPC Guru" />
      </a>
      <div className="header-actions">
        <span>Google Ads + Meta Ads</span>
        {ctaHref ? (
          <Link href={ctaHref}>
            Get my lead plan <ArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <button type="button" onClick={scrollToForm}>
            Get my lead plan <ArrowRight aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="site-footer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${LOGOS}/ppc-guru.png`} alt="PPC Guru" />
      <p>Performance advertising for local service businesses.</p>
      <div>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <span>© {new Date().getFullYear()} PPC Guru</span>
      </div>
    </footer>
  );
}

export function LeadsLanding() {
  return (
    <div className="lp-root">
      <div className="site-shell" id="top">
        <div className="hero-surface">
          <LandingHeader />
          <div className="lp-main">
            <section className="hero-section">
              <div className="hero-copy">
                <p className="hero-kicker">
                  <span /> Performance-paid lead generation · Canada & USA
                </p>
                <h1>
                  Get 100 qualified leads.
                  <br />
                  <em>Or our fee is $0.</em>
                </h1>
                <p className="hero-lede">Not bots. Not junk. Real prospects who match the service, location and intent criteria we agree on before launch.</p>
                <div className="hero-checks">
                  <span>
                    <Check aria-hidden="true" /> Offer and ads built for you
                  </span>
                  <span>
                    <Check aria-hidden="true" /> Every enquiry tracked
                  </span>
                  <span>
                    <Check aria-hidden="true" /> Your ad accounts stay yours
                  </span>
                </div>
                <div className="hero-assurance">
                  <div>
                    <Target aria-hidden="true" />
                    <span>
                      <strong>100</strong> agreed-quality leads
                    </span>
                  </div>
                  <div>
                    <ShieldCheck aria-hidden="true" />
                    <span>
                      <strong>$0</strong> management if missed
                    </span>
                  </div>
                  <button type="button" onClick={scrollToResults}>
                    See real results <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
              <QualificationForm />
            </section>
          </div>
        </div>
        <LogoMarquee />
        <ResultsCarousel />
        <QualitySection />
        <section className="final-cta" aria-labelledby="final-cta-title">
          <div>
            <p className="section-kicker">A 60-second fit check</p>
            <h2 id="final-cta-title">Want to know if 100 leads is realistic for your business?</h2>
          </div>
          <button className="primary-button" type="button" onClick={scrollToForm}>
            Build my lead plan <ArrowRight aria-hidden="true" />
          </button>
        </section>
        <LandingFooter />
      </div>
    </div>
  );
}
