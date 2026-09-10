import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  ChartLineUp,
  ChatCircleText,
  Check,
  Crosshair,
  GlobeHemisphereWest,
  LockKey,
  MagnifyingGlass,
  MapPin,
  SealCheck,
  Sparkle,
  Target,
} from "@phosphor-icons/react";
import { aiProofs, clientLogos, logoLabel } from "./content.js";

const goals = [
  { id: "google", label: "Google Search", Icon: MagnifyingGlass },
  { id: "maps", label: "Google Maps", Icon: MapPin },
  { id: "ai", label: "AI answers", Icon: ChatCircleText },
  { id: "all", label: "All three", Icon: Sparkle },
];

const investmentRanges = ["Under $1,500", "$1,500–$3,000", "$3,000–$5,000", "$5,000+"];
const steps = ["Search", "Goal", "Contact"];

function Wordmark() {
  return (
    <span className="text-logo" aria-label="PPC Guru dot C A">
      <small>PPC</small>
      <strong>GURU.CA</strong>
    </span>
  );
}

function scrollToForm() {
  document.getElementById("visibility-check")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollToProof() {
  document.getElementById("ai-proof")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stepper({ step }) {
  return (
    <ol className="form-stepper" aria-label={`Step ${step} of ${steps.length}`}>
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        const className = number === step ? "is-current" : complete ? "is-complete" : "";

        return (
          <li className={className} key={label}>
            <span>{complete ? <Check weight="bold" aria-hidden="true" /> : number}</span>
            <small>{label}</small>
          </li>
        );
      })}
    </ol>
  );
}

function VisibilityForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    website: "",
    search: "",
    goal: "",
    investment: "",
    business: "",
    name: "",
    email: "",
    phone: "",
  });

  const update = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const select = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  if (submitted) {
    return (
      <section className="lead-form lead-form-success" id="visibility-check" aria-live="polite">
        <div className="success-mark"><Check weight="bold" aria-hidden="true" /></div>
        <p className="form-kicker">Visibility check received</p>
        <h2>Thanks, {form.name.split(" ")[0]}.</h2>
        <p>We’ll review how {form.business || form.website} appears for “{form.search},” then contact you to discuss a measurable 30-day target.</p>
        <div className="success-summary">
          <span><MagnifyingGlass weight="bold" aria-hidden="true" /> {form.search}</span>
          <span><Target weight="bold" aria-hidden="true" /> {goals.find((goal) => goal.id === form.goal)?.label}</span>
        </div>
        <a className="primary-button" href="https://ppcguru.ca/contact">Continue with PPC Guru <ArrowRight weight="bold" aria-hidden="true" /></a>
        <button className="text-button" type="button" onClick={() => setSubmitted(false)}>Review my answers</button>
      </section>
    );
  }

  const stepOneReady = form.website.trim() && form.search.trim();
  const stepTwoReady = form.goal && form.investment;

  return (
    <section className="lead-form" id="visibility-check" aria-labelledby="form-title">
      <div className="form-topline">
        <span><SealCheck weight="fill" aria-hidden="true" /> Free search visibility check</span>
        <strong>{step} / 3</strong>
      </div>
      <Stepper step={step} />

      {step === 1 && (
        <form className="form-panel" onSubmit={(event) => { event.preventDefault(); setStep(2); }}>
          <div className="form-heading">
            <p className="form-kicker">Start with one valuable search</p>
            <h2 id="form-title">What should AI recommend you for?</h2>
            <p>Give us your website and the service + city your next customer would ask about.</p>
          </div>
          <div className="input-stack">
            <label>
              <span>Your website</span>
              <div className="input-shell">
                <GlobeHemisphereWest aria-hidden="true" />
                <input name="website" value={form.website} onChange={update} placeholder="e.g. northstarheating.ca" autoComplete="url" inputMode="url" required />
              </div>
            </label>
            <label>
              <span>Service + city</span>
              <div className="input-shell">
                <MagnifyingGlass aria-hidden="true" />
                <input name="search" value={form.search} onChange={update} placeholder="e.g. Furnace repair in Toronto" required />
              </div>
            </label>
          </div>
          <button className="primary-button" type="submit" disabled={!stepOneReady}>Show me my opportunity <ArrowRight weight="bold" aria-hidden="true" /></button>
          <p className="form-reassurance"><LockKey weight="fill" aria-hidden="true" /> No account access. No credit card. No obligation.</p>
        </form>
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
              {goals.map(({ id, label, Icon }) => {
                const selected = form.goal === id;
                return (
                  <button className={selected ? "choice-card is-selected" : "choice-card"} key={id} type="button" role="radio" aria-checked={selected} onClick={() => select("goal", id)}>
                    <Icon weight={selected ? "fill" : "regular"} aria-hidden="true" />
                    <span>{label}</span>
                    <i>{selected && <Check weight="bold" aria-hidden="true" />}</i>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="choice-fieldset budget-fieldset">
            <legend>Monthly SEO investment</legend>
            <div className="budget-grid" role="radiogroup" aria-label="Monthly SEO investment">
              {investmentRanges.map((range) => (
                <button className={form.investment === range ? "budget-choice is-selected" : "budget-choice"} key={range} type="button" role="radio" aria-checked={form.investment === range} onClick={() => select("investment", range)}>{range}</button>
              ))}
            </div>
          </fieldset>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => setStep(1)}><ArrowLeft weight="bold" /> Back</button>
            <button className="primary-button" type="button" disabled={!stepTwoReady} onClick={() => setStep(3)}>Continue <ArrowRight weight="bold" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="form-panel" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <div className="form-heading">
            <p className="form-kicker">Last step</p>
            <h2>Where should we send the findings?</h2>
            <p>We’ll contact you about this request only. Your details are not sold.</p>
          </div>
          <div className="input-stack compact-fields">
            <label><span>Business name</span><input name="business" value={form.business} onChange={update} autoComplete="organization" required /></label>
            <label><span>Your name</span><input name="name" value={form.name} onChange={update} autoComplete="name" required /></label>
            <label><span>Work email</span><input name="email" value={form.email} onChange={update} type="email" autoComplete="email" required /></label>
            <label><span>Phone / WhatsApp</span><input name="phone" value={form.phone} onChange={update} type="tel" autoComplete="tel" required /></label>
          </div>
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={() => setStep(2)}><ArrowLeft weight="bold" /> Back</button>
            <button className="primary-button" type="submit">Request my visibility check <ArrowRight weight="bold" /></button>
          </div>
          <p className="consent-copy">By submitting, you agree that PPC Guru may contact you about this request. See our <a href="https://ppcguru.ca/privacy">Privacy Policy</a>.</p>
        </form>
      )}
    </section>
  );
}

function LogoMarquee() {
  const repeated = [...clientLogos, ...clientLogos];

  return (
    <section className="logo-proof" aria-labelledby="logo-title">
      <div className="logo-proof-heading">
        <p id="logo-title"><strong>Trusted across 200+ businesses</strong></p>
        <div className="proof-rating"><SealCheck weight="fill" aria-hidden="true" /> Local and service-business experience</div>
      </div>
      <div className="logo-viewport" aria-label="Selected PPC Guru client logos">
        <div className="logo-track">
          {repeated.map((file, index) => (
            <figure className="logo-item" key={`${file}-${index}`} aria-hidden={index >= clientLogos.length}>
              <img src={`/logos/${file}`} alt={index < clientLogos.length ? logoLabel(file) : ""} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofGallery() {
  const [activeProof, setActiveProof] = useState(0);
  const proofTrack = useRef(null);

  const showProof = (index) => {
    const next = Math.max(0, Math.min(aiProofs.length - 1, index));
    const track = proofTrack.current;
    const card = track?.children[next];
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    setActiveProof(next);
  };

  const syncActiveProof = () => {
    const track = proofTrack.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const next = cards.reduce((closest, card, index) => (
      Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft)
        < Math.abs(cards[closest].offsetLeft - track.offsetLeft - track.scrollLeft)
        ? index
        : closest
    ), 0);
    if (next !== activeProof) setActiveProof(next);
  };

  return (
    <section className="results-section mobile-results" id="ai-proof" aria-labelledby="proof-title">
      <div className="results-heading mobile-results-heading">
        <div>
          <p className="section-kicker">Original ChatGPT app screenshots</p>
          <h2 id="proof-title">See PPC Guru recommended by <span>ChatGPT.</span></h2>
        </div>
        <p>Real captures supplied by PPC Guru for SEO, Google Ads and Meta Ads searches in Toronto. Swipe through them on mobile or compare all three side by side on desktop.</p>
      </div>

      <div className="mobile-proof-list" ref={proofTrack} onScroll={syncActiveProof}>
        {aiProofs.map((proof, index) => (
          <article className="mobile-proof-card" key={proof.file}>
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><p>{proof.platform}</p><h3>{proof.title}</h3></div>
              <small>Original</small>
            </header>
            <figure>
              <img src={`/proof/${proof.file}`} alt={proof.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
              <figcaption><SealCheck weight="fill" aria-hidden="true" /> Original ChatGPT app screenshot supplied by PPC Guru.</figcaption>
            </figure>
            <div className="mobile-proof-source">
              <p><strong>Search shown</strong> “{proof.query}”</p>
              <p>{proof.caption}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="proof-mobile-controls" aria-label="ChatGPT screenshot controls">
        <button type="button" onClick={() => showProof(activeProof - 1)} disabled={activeProof === 0} aria-label="Show previous screenshot"><ArrowLeft weight="bold" /></button>
        <div className="proof-dots" aria-label={`Screenshot ${activeProof + 1} of ${aiProofs.length}`}>
          {aiProofs.map((proof, index) => (
            <button className={index === activeProof ? "is-active" : ""} type="button" key={proof.file} onClick={() => showProof(index)} aria-label={`Show ${proof.platform} screenshot`} />
          ))}
        </div>
        <button type="button" onClick={() => showProof(activeProof + 1)} disabled={activeProof === aiProofs.length - 1} aria-label="Show next screenshot"><ArrowRight weight="bold" /></button>
      </div>

      <div className="proof-conversion">
        <p>Want to know what customers may find about your business?</p>
        <button className="primary-button" type="button" onClick={scrollToForm}>Check my search visibility <ArrowRight weight="bold" /></button>
      </div>

      <p className="result-disclosure"><strong>Important:</strong> These are original, time-specific ChatGPT app screenshots supplied by PPC Guru. Exact outputs vary by prompt, location, account, sources and time. They show observed answers—not permanent rankings, independent endorsements or guaranteed placement.</p>
    </section>
  );
}

const deliverables = [
  { Icon: GlobeHemisphereWest, title: "Build the baseline", copy: "Record how your agreed searches appear across Google, Maps and selected AI answers." },
  { Icon: Crosshair, title: "Improve the signals", copy: "Strengthen local relevance, service pages, technical clarity and the sources that describe your business." },
  { Icon: ChartLineUp, title: "Measure the change", copy: "Recheck the same queries after 30 days and report what moved, what did not and what comes next." },
];

function MeasurementSection() {
  return (
    <section className="quality-section" aria-labelledby="measure-title">
      <div className="quality-copy">
        <p className="section-kicker">No vague “AI ranking” report</p>
        <h2 id="measure-title">A 30-day target you can <span>actually inspect.</span></h2>
        <p>We agree on the services, cities, searches and evidence before work starts. That turns “get me found” into a clear visibility plan.</p>
        <ul>
          <li><Check weight="bold" /> Same search themes</li>
          <li><Check weight="bold" /> Same target cities</li>
          <li><Check weight="bold" /> Before-and-after captures</li>
          <li><Check weight="bold" /> Clear next-step report</li>
        </ul>
      </div>
      <aside className="guarantee-card">
        <div className="guarantee-number"><Target weight="bold" /><strong>30</strong><span>days to measure the agreed target</span></div>
        <div className="guarantee-zero"><small>Visibility surfaces measured</small><strong>3</strong><span>Google Search, Maps and AI answers</span></div>
        <p>No agency can honestly guarantee a specific Google position, AI citation, recommendation or lead volume. We guarantee clarity about the target and report the work measured against it.</p>
      </aside>
      <ol className="process-row">
        {deliverables.map(({ Icon, title, copy }, index) => (
          <li key={title}><span>{index + 1}</span><Icon weight="regular" /><div><h3>{title}</h3><p>{copy}</p></div></li>
        ))}
      </ol>
    </section>
  );
}

export function App() {
  return (
    <div className="site-shell" id="top">
      <div className="hero-surface">
        <header className="site-header">
          <a className="brand brand-wordmark" href="#top"><Wordmark /></a>
          <div className="header-actions"><span>SEO + AI visibility</span><button type="button" onClick={scrollToForm}>Get my visibility plan <ArrowRight weight="bold" /></button></div>
        </header>

        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="hero-kicker"><span /> SEO + AI-search visibility · Canada & USA</p>
              <h1>Make your business the obvious answer. <em>In Google and AI search.</em></h1>
              <p className="hero-lede">When customers ask ChatGPT who to hire, your business should be easy to find, verify and recommend. We build the search signals that help local businesses appear across Google and selected AI answers—with a measurable 30-day target agreed upfront.</p>
              <div className="hero-checks">
                <span><Check weight="bold" /> Google Search + Maps</span>
                <span><Check weight="bold" /> AI-answer visibility</span>
                <span><Check weight="bold" /> Same searches checked before + after</span>
              </div>
              <div className="hero-assurance">
                <div><Target weight="bold" /><span><strong>30 days</strong> agreed measurement target</span></div>
                <div><SealCheck weight="fill" /><span><strong>200+ businesses</strong> trusted PPC Guru</span></div>
                <button type="button" onClick={scrollToProof}>See captured answers <ArrowRight weight="bold" /></button>
              </div>
            </div>
            <VisibilityForm />
          </section>
        </main>
      </div>

      <LogoMarquee />
      <ProofGallery />
      <MeasurementSection />

      <section className="final-cta" aria-labelledby="final-title">
        <div><p className="section-kicker">Before your next customer asks</p><h2 id="final-title">See what Google and AI say about your business right now.</h2></div>
        <button className="primary-button" type="button" onClick={scrollToForm}>Show me my visibility <ArrowRight weight="bold" /></button>
      </section>

      <footer className="site-footer">
        <a className="brand brand-wordmark" href="#top"><Wordmark /></a>
        <p>Search visibility for local and service businesses.</p>
        <div><a href="https://ppcguru.ca/privacy">Privacy</a><a href="https://ppcguru.ca/terms">Terms</a><span>© 2026 PPC Guru</span></div>
      </footer>
    </div>
  );
}
