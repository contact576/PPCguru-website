import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Buildings,
  ChartBar,
  Check,
  ClipboardText,
  FirstAidKit,
  HardHat,
  HouseLine,
  LockKey,
  MapPin,
  SealCheck,
  ShieldCheck,
  Target,
  TrendUp,
  X,
} from "@phosphor-icons/react";
import { campaignResults, clientLogos, logoLabel } from "./content.js";

const businessTypes = [
  { id: "home-services", label: "Home services", Icon: HouseLine },
  { id: "construction", label: "Construction & trades", Icon: HardHat },
  { id: "healthcare", label: "Health & wellness", Icon: FirstAidKit },
  { id: "professional", label: "Professional service", Icon: Briefcase },
];

const budgets = [
  { id: "under-2500", label: "Under $2,500" },
  { id: "2500-5000", label: "$2,500–$5,000" },
  { id: "5000-10000", label: "$5,000–$10,000" },
  { id: "10000-plus", label: "$10,000+" },
];

const steps = ["Business", "Campaign", "Contact"];

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

function scrollToForm() {
  document.getElementById("qualification")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollToResults() {
  document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stepper({ step }) {
  return (
    <ol className="form-stepper" aria-label={`Step ${step} of ${steps.length}`}>
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        return (
          <li key={label} className={number === step ? "is-current" : complete ? "is-complete" : ""}>
            <span>{complete ? <Check weight="bold" aria-hidden="true" /> : number}</span>
            <small>{label}</small>
          </li>
        );
      })}
    </ol>
  );
}

function QualificationForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: "", location: "", businessType: "", budget: "", name: "", email: "", phone: "" });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const choose = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const submitForm = (event) => { event.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <section className="lead-form lead-form-success" id="qualification" aria-live="polite">
        <div className="success-mark"><Check weight="bold" aria-hidden="true" /></div>
        <p className="form-kicker">Fit check complete</p>
        <h2>Great, {form.name.split(" ")[0]}.</h2>
        <p>{form.company} looks like a potential fit. Choose a time to confirm your market, lead criteria, ad budget and written guarantee terms.</p>
        <div className="success-summary">
          <span><MapPin weight="fill" aria-hidden="true" /> {form.location}</span>
          <span><Target weight="fill" aria-hidden="true" /> 100-lead target</span>
        </div>
        <a className="primary-button" href="https://ppcguru.ca/contact">Book my qualification call <ArrowRight weight="bold" aria-hidden="true" /></a>
        <button className="text-button" type="button" onClick={() => setSubmitted(false)}>Review my answers</button>
      </section>
    );
  }

  const stepOneReady = form.company.trim() && form.location.trim();
  const stepTwoReady = form.businessType && form.budget;

  return (
    <section className="lead-form" id="qualification" aria-labelledby="qualification-title">
      <div className="form-topline">
        <span><SealCheck weight="fill" aria-hidden="true" /> 100-lead fit check</span>
        <strong>{step} of 3</strong>
      </div>
      <Stepper step={step} />

      {step === 1 && (
        <form className="form-panel" onSubmit={(event) => { event.preventDefault(); setStep(2); }}>
          <div className="form-heading">
            <p className="form-kicker">Let’s start with your market</p>
            <h2 id="qualification-title">Where should we send the leads?</h2>
            <p>Tell us which business and service area we would be advertising.</p>
          </div>
          <div className="input-stack">
            <label>
              <span>Business name</span>
              <div className="input-shell"><Buildings weight="regular" aria-hidden="true" /><input name="company" value={form.company} onChange={updateField} placeholder="e.g. Northstar Heating" autoComplete="organization" required /></div>
            </label>
            <label>
              <span>Primary city or service area</span>
              <div className="input-shell"><MapPin weight="regular" aria-hidden="true" /><input name="location" value={form.location} onChange={updateField} placeholder="e.g. Toronto & GTA" autoComplete="address-level2" required /></div>
            </label>
          </div>
          <button className="primary-button" type="submit" disabled={!stepOneReady}>Map my lead market <ArrowRight weight="bold" aria-hidden="true" /></button>
          <p className="form-reassurance"><LockKey weight="fill" aria-hidden="true" /> No credit card, contract or account access needed.</p>
        </form>
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
              {businessTypes.map(({ id, label, Icon }) => {
                const selected = form.businessType === id;
                return (
                  <button key={id} type="button" className={selected ? "choice-card is-selected" : "choice-card"} role="radio" aria-checked={selected} onClick={() => choose("businessType", id)}>
                    <Icon weight={selected ? "fill" : "regular"} aria-hidden="true" /><span>{label}</span><i>{selected && <Check weight="bold" aria-hidden="true" />}</i>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="choice-fieldset budget-fieldset">
            <legend>Monthly ad budget</legend>
            <div className="budget-grid" role="radiogroup" aria-label="Monthly ad budget">
              {budgets.map(({ id, label }) => <button key={id} type="button" className={form.budget === id ? "budget-choice is-selected" : "budget-choice"} role="radio" aria-checked={form.budget === id} onClick={() => choose("budget", id)}>{label}</button>)}
            </div>
          </fieldset>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => setStep(1)}><ArrowLeft weight="bold" aria-hidden="true" /> Back</button>
            <button className="primary-button" type="button" disabled={!stepTwoReady} onClick={() => setStep(3)}>Continue <ArrowRight weight="bold" aria-hidden="true" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="form-panel" onSubmit={submitForm}>
          <div className="form-heading">
            <p className="form-kicker">Last step</p>
            <h2>Where should we send your lead plan?</h2>
            <p>We’ll use this to arrange a short qualification call—not to spam you.</p>
          </div>
          <div className="input-stack compact-fields">
            <label><span>Your name</span><input name="name" value={form.name} onChange={updateField} autoComplete="name" required /></label>
            <label><span>Work email</span><input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required /></label>
            <label><span>Phone number</span><input name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" required /></label>
          </div>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => setStep(2)}><ArrowLeft weight="bold" aria-hidden="true" /> Back</button>
            <button className="primary-button" type="submit">See if I qualify <ArrowRight weight="bold" aria-hidden="true" /></button>
          </div>
          <p className="consent-copy">By continuing, you agree that PPC Guru may contact you about this request. See our <a href="https://ppcguru.ca/privacy">Privacy Policy</a>.</p>
        </form>
      )}
    </section>
  );
}

function LogoMarquee() {
  const repeated = [...clientLogos, ...clientLogos];
  return (
    <section className="logo-proof" aria-labelledby="logos-title">
      <div className="logo-proof-heading">
        <p id="logos-title"><strong>Trusted across 200+ businesses</strong><span>A selection of client brands, franchises and national names.</span></p>
        <div className="proof-rating"><SealCheck weight="fill" aria-hidden="true" /><span>Real PPC Guru clients</span></div>
      </div>
      <div className="logo-viewport" aria-label="PPC Guru client logo carousel">
        <div className="logo-track">
          {repeated.map((file, index) => <figure className="logo-item" key={`${file}-${index}`} aria-hidden={index >= clientLogos.length}><img src={`/logos/${file}`} alt={index < clientLogos.length ? logoLabel(file) : ""} loading="lazy" /></figure>)}
        </div>
      </div>
    </section>
  );
}

function ResultsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pointerStart = useRef(null);
  const didSwipe = useRef(false);
  const closeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const move = (direction) => setIndex((current) => (current + direction + campaignResults.length) % campaignResults.length);

  useEffect(() => {
    if (paused || reducedMotion || lightboxOpen) return undefined;
    const timer = window.setInterval(() => move(1), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKey); };
  }, [lightboxOpen]);

  const handlePointerUp = (event) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    if (Math.abs(distance) > 40) {
      didSwipe.current = true;
      move(distance < 0 ? 1 : -1);
    }
    pointerStart.current = null;
  };

  const previous = campaignResults[(index - 1 + campaignResults.length) % campaignResults.length];
  const active = campaignResults[index];
  const next = campaignResults[(index + 1) % campaignResults.length];

  return (
    <section className="results-section" id="results" aria-labelledby="results-title">
      <div className="results-heading">
        <div><p className="section-kicker">Original Meta Ads dashboards</p><h2 id="results-title">Get 100 qualified leads. <span>Or our management fee is $0.</span></h2></div>
        <p>Open original PPC Guru campaign screenshots and inspect the results behind the promise. No recreated charts and no made-up dashboard mockups.</p>
      </div>
      <div className="proof-shell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} onPointerDown={(event) => { pointerStart.current = event.clientX; didSwipe.current = false; setPaused(true); }} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; didSwipe.current = false; }}>
        <div className="proof-stage">
          <div className="dashboard-ghost ghost-left" aria-hidden="true"><img src={`/results/${previous.file}`} alt="" /></div>
          <button className="dashboard-card" type="button" onClick={() => { if (didSwipe.current) { didSwipe.current = false; return; } setLightboxOpen(true); }} aria-label={`Open ${active.client} Meta Ads result full size`}>
            <div className="dashboard-card-head">
              <span className="client-lockup"><img src={`/logos/${active.logo}`} alt="" /><span><strong>{active.client}</strong><small>Meta Ads · Client snapshot</small></span></span>
              <span className="verified-chip"><SealCheck weight="fill" aria-hidden="true" /> Actual result</span>
            </div>
            <div className="dashboard-stats" aria-live="polite">
              <span><small>Result</small><strong>{active.result}</strong></span><span><small>Cost</small><strong>{active.cost}</strong></span><span><small>Spend</small><strong>{active.spend}</strong></span>
            </div>
            <div className="dashboard-image-wrap"><img src={`/results/${active.file}`} alt={`${active.client} Meta Ads dashboard screenshot`} /></div>
            <span className="open-result">Tap to inspect full result <ArrowRight weight="bold" aria-hidden="true" /></span>
          </button>
          <div className="dashboard-ghost ghost-right" aria-hidden="true"><img src={`/results/${next.file}`} alt="" /></div>
        </div>
        <div className="proof-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous campaign result"><ArrowLeft weight="bold" /></button>
          <div className="result-dots" aria-label="Choose campaign result">
            {campaignResults.map((result, resultIndex) => <button key={result.file} type="button" className={resultIndex === index ? "is-active" : ""} aria-label={`Show ${result.client}`} aria-current={resultIndex === index ? "true" : undefined} onClick={() => setIndex(resultIndex)} />)}
          </div>
          <span>{String(index + 1).padStart(2, "0")} / {String(campaignResults.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(1)} aria-label="Next campaign result"><ArrowRight weight="bold" /></button>
        </div>
      </div>
      <p className="result-disclosure">These are real campaign screenshots supplied by PPC Guru. Results vary by offer, market, budget and follow-up. Lead and enquiry results are not the same as independently verified sales or revenue.</p>
      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${active.client} campaign result`} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxOpen(false); }}>
          <button ref={closeRef} className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close full result"><X weight="bold" /></button>
          <button className="lightbox-arrow lightbox-arrow-left" type="button" onClick={() => move(-1)} aria-label="Previous result"><ArrowLeft weight="bold" /></button>
          <figure><img src={`/results/${active.file}`} alt={`${active.client} Meta Ads dashboard screenshot, full size`} /><figcaption><span><strong>{active.client}</strong><small>{active.result} · {active.cost}</small></span><b>{String(index + 1).padStart(2, "0")} / {String(campaignResults.length).padStart(2, "0")}</b></figcaption></figure>
          <button className="lightbox-arrow lightbox-arrow-right" type="button" onClick={() => move(1)} aria-label="Next result"><ArrowRight weight="bold" /></button>
        </div>
      )}
    </section>
  );
}

function QualitySection() {
  const qualityChecks = ["Needs the service you actually sell", "Located inside the agreed service area", "Provides real, usable contact information", "Shows genuine intent—not a bot or duplicate"];
  const process = [
    { Icon: ClipboardText, title: "Agree", copy: "We define the offer, geography and quality rules in writing." },
    { Icon: ChartBar, title: "Launch", copy: "We build the campaign, creative, tracking and lead flow." },
    { Icon: ShieldCheck, title: "Prove", copy: "Every enquiry is tracked against the agreed 100-lead target." },
  ];
  return (
    <section className="quality-section" aria-labelledby="quality-title">
      <div className="quality-copy">
        <p className="section-kicker">No vague definition of “quality”</p>
        <h2 id="quality-title">We agree on what counts <span>before your first ad runs.</span></h2>
        <p>You should never have to argue about whether junk enquiries count toward the target. The qualification rules are set upfront.</p>
        <ul>{qualityChecks.map((item) => <li key={item}><Check weight="bold" aria-hidden="true" /> {item}</li>)}</ul>
      </div>
      <div className="guarantee-card">
        <div className="guarantee-number"><TrendUp weight="bold" aria-hidden="true" /><strong>100</strong><span>agreed-quality leads</span></div>
        <div className="guarantee-zero"><small>If we miss the target</small><strong>$0</strong><span>management fee</span></div>
        <p>Ad spend is separate and paid directly to Google or Meta. Qualification and written campaign terms apply.</p>
      </div>
      <ol className="process-row">{process.map(({ Icon, title, copy }, index) => <li key={title}><span>{index + 1}</span><Icon weight="regular" aria-hidden="true" /><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
    </section>
  );
}

export function App() {
  return (
    <div className="site-shell" id="top">
      <div className="hero-surface">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="PPC Guru home"><img src="/logos/ppc-guru.png" alt="PPC Guru" /></a>
          <div className="header-actions"><span>Google Ads + Meta Ads</span><button type="button" onClick={scrollToForm}>Get my lead plan <ArrowRight weight="bold" aria-hidden="true" /></button></div>
        </header>
        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="hero-kicker"><span /> Performance-paid lead generation · Canada & USA</p>
              <h1>Get 100 qualified leads.<br /><em>Or our fee is $0.</em></h1>
              <p className="hero-lede">Not bots. Not junk. Real prospects who match the service, location and intent criteria we agree on before launch.</p>
              <div className="hero-checks"><span><Check weight="bold" aria-hidden="true" /> Offer and ads built for you</span><span><Check weight="bold" aria-hidden="true" /> Every enquiry tracked</span><span><Check weight="bold" aria-hidden="true" /> Your ad accounts stay yours</span></div>
              <div className="hero-assurance">
                <div><Target weight="bold" aria-hidden="true" /><span><strong>100</strong> agreed-quality leads</span></div>
                <div><ShieldCheck weight="bold" aria-hidden="true" /><span><strong>$0</strong> management if missed</span></div>
                <button type="button" onClick={scrollToResults}>See real results <ArrowRight weight="bold" aria-hidden="true" /></button>
              </div>
            </div>
            <QualificationForm />
          </section>
        </main>
      </div>
      <LogoMarquee />
      <ResultsCarousel />
      <QualitySection />
      <section className="final-cta" aria-labelledby="final-cta-title">
        <div><p className="section-kicker">A 60-second fit check</p><h2 id="final-cta-title">Want to know if 100 leads is realistic for your business?</h2></div>
        <button className="primary-button" type="button" onClick={scrollToForm}>Build my lead plan <ArrowRight weight="bold" aria-hidden="true" /></button>
      </section>
      <footer className="site-footer">
        <img src="/logos/ppc-guru.png" alt="PPC Guru" /><p>Performance advertising for local service businesses.</p><div><a href="https://ppcguru.ca/privacy">Privacy</a><a href="https://ppcguru.ca/terms">Terms</a><span>© 2026 PPC Guru</span></div>
      </footer>
    </div>
  );
}
