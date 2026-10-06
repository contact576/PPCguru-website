"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Expand, ExternalLink, Star, X } from "lucide-react";
import { googleBusinessProfile, googleReviews } from "@/lib/data/google-reviews";
import { googleAdsResults, metaAdsResults, type CampaignScreenshot } from "@/lib/data/landing-google-meta-results";

const googleAdsReviewNames = new Set(["aayush patel", "Hunter Harris"]);
const googleAdsReviews = googleReviews.filter((review) => googleAdsReviewNames.has(review.name));

function ResultCaption({ result }: { result: CampaignScreenshot }) {
  return (
    <div className="gm-result-caption">
      <h4>{result.client}</h4>
      <dl className="gm-result-stats">
        <div><dt>Result</dt><dd>{result.result}</dd></div>
        <div><dt>Cost per result</dt><dd>{result.cost}</dd></div>
        <div><dt>Ad spend</dt><dd>{result.spend}</dd></div>
      </dl>
      <p className="gm-result-period">{result.period}</p>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element -- preserve the original supplied dashboard captures */
function ResultCarousel({ platform, results }: { platform: string; results: CampaignScreenshot[] }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);
  const previousOverflow = useRef<string | null>(null);
  const active = results[index];
  const total = results.length;

  useEffect(() => () => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
  }, []);

  function move(direction: number) {
    setIndex((current) => (current + direction + total) % total);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? total - 1 : null;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && nextIndex === null) return;
    event.preventDefault();
    event.stopPropagation();
    if (nextIndex !== null) setIndex(nextIndex);
    else move(event.key === "ArrowRight" ? 1 : -1);
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) {
      didSwipe.current = true;
      move(dx < 0 ? 1 : -1);
    }
  }

  function restoreAfterClose() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
    openerRef.current?.focus({ preventScroll: true });
  }

  function openResult(opener: HTMLButtonElement) {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    openerRef.current = opener;
    dialog.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className="gm-result-carousel" role="region" aria-roledescription="carousel" aria-label={`${platform} campaign screenshots`} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="gm-phone-stage">
        <button
          type="button"
          className="gm-phone-frame"
          aria-label={`Open ${active.client} ${platform} screenshot full size`}
          aria-haspopup="dialog"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            pointerStart.current = { x: event.clientX, y: event.clientY };
            didSwipe.current = false;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStart.current = null; didSwipe.current = false; }}
          onClick={(event) => {
            if (event.detail === 0) didSwipe.current = false;
            openResult(event.currentTarget);
          }}
        >
          <img className="gm-phone-image" src={active.src} width={active.width} height={active.height} alt={`${active.client} ${platform} campaign dashboard`} loading="lazy" decoding="async" draggable={false} />
          <span className="gm-phone-open"><Expand aria-hidden="true" /> Open original</span>
        </button>
      </div>
      <ResultCaption result={active} />
      <div className="gm-carousel-controls">
        <button className="gm-carousel-arrow" type="button" onClick={() => move(-1)} disabled={total < 2} aria-label={`Previous ${platform} result`}><ArrowLeft aria-hidden="true" /></button>
        <div className="gm-carousel-dots" aria-label={`Choose a ${platform} result`}>
          {results.map((result, resultIndex) => (
            <button key={result.src} type="button" className={`gm-carousel-dot${resultIndex === index ? " is-active" : ""}`} aria-label={`Show ${result.client}, result ${resultIndex + 1} of ${total}`} aria-current={resultIndex === index ? "true" : undefined} onClick={() => setIndex(resultIndex)} />
          ))}
        </div>
        <span className="gm-carousel-counter" aria-hidden="true">{index + 1} / {total}</span>
        <button className="gm-carousel-arrow" type="button" onClick={() => move(1)} disabled={total < 2} aria-label={`Next ${platform} result`}><ArrowRight aria-hidden="true" /></button>
      </div>
      <span className="sr-only" role="status">{platform} result {index + 1} of {total}: {active.client}, {active.result}, {active.cost}.</span>
      <dialog ref={dialogRef} className="gm-result-dialog" aria-label={`${active.client} ${platform} original campaign screenshot`} onClose={restoreAfterClose} onKeyDown={handleKeyDown} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        <div className="gm-dialog-header">
          <span>{platform} · Original campaign screenshot</span>
          <button ref={closeRef} className="gm-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close full-size screenshot"><X aria-hidden="true" /></button>
        </div>
        <img className="gm-dialog-image" src={active.src} width={active.width} height={active.height} alt={`${active.client}: ${active.result}, ${active.cost}, ${active.spend} spent. ${active.period}.`} />
        <div className="gm-dialog-caption"><ResultCaption result={active} /></div>
        <div className="gm-dialog-controls">
          <button type="button" onClick={() => move(-1)} disabled={total < 2} aria-label={`Previous ${platform} screenshot`}><ArrowLeft aria-hidden="true" /> Previous</button>
          <span>{index + 1} / {total}</span>
          <button type="button" onClick={() => move(1)} disabled={total < 2} aria-label={`Next ${platform} screenshot`}>Next <ArrowRight aria-hidden="true" /></button>
        </div>
      </dialog>
    </div>
  );
}

function GoogleClientFeedback() {
  return (
    <div className="gm-client-feedback">
      <div className="gm-feedback-heading"><p className="gm-platform-label">Google Ads · Client feedback</p><h3>What working together feels like.</h3><p>In our clients’ own words, published on Google.</p></div>
      <div className="gm-feedback-list">
        {googleAdsReviews.map((review) => (
          <figure className="gm-feedback-card" key={review.name}>
            <div className="gm-feedback-stars" aria-label={`${review.stars} out of 5 stars`}>{Array.from({ length: review.stars }, (_, star) => <Star key={star} aria-hidden="true" />)}</div>
            <blockquote>{review.text}</blockquote>
            <figcaption><strong>{review.name}</strong><span>Google review · <time dateTime={review.date}>{new Date(`${review.date}T12:00:00Z`).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></span></figcaption>
          </figure>
        ))}
      </div>
      <a className="gm-feedback-source" href={googleBusinessProfile.url} target="_blank" rel="noopener noreferrer">Read our reviews on Google <ExternalLink aria-hidden="true" /></a>
    </div>
  );
}

export function GoogleMetaResults() {
  return (
    <section className="gm-results" id="results" aria-labelledby="gm-results-title">
      <div className="gm-results-heading"><p className="section-kicker">The work, in the open</p><h2 id="gm-results-title" tabIndex={-1}>Real campaigns. <span>See the evidence.</span></h2><p>{googleAdsResults.length > 0 ? "Original Google and Meta campaign screenshots you can open and inspect." : "Client feedback on Google Ads. Original Meta campaign screenshots you can open and inspect."}</p></div>
      <div className="gm-results-grid">
        <article className="gm-platform-panel gm-platform-google" aria-label="Google Ads evidence">
          <div className="gm-platform-heading"><img className="gm-platform-logo" src="/badges/google-ads-logo.svg" width={910} height={230} alt="Google Ads" loading="lazy" />{googleAdsResults.length > 0 && <h3 className="gm-platform-label">Google Ads · Original campaign screenshots</h3>}</div>
          {googleAdsResults.length > 0 ? <ResultCarousel platform="Google Ads" results={googleAdsResults} /> : <GoogleClientFeedback />}
        </article>
        <article className="gm-platform-panel gm-platform-meta" aria-label="Meta Ads campaign evidence">
          <div className="gm-platform-heading"><img className="gm-platform-logo" src="/badges/meta-logo.svg" width={948} height={191} alt="Meta" loading="lazy" /><h3 className="gm-platform-label">Meta Ads · Original campaign screenshots</h3></div>
          <ResultCarousel platform="Meta Ads" results={metaAdsResults} />
        </article>
      </div>
      <p className="gm-results-disclosure">Campaign screenshots supplied by PPC Guru. Results vary by offer, market, budget and follow-up. Leads and messaging conversations are not independently verified sales or revenue. Reviews describe individual client experiences.</p>
    </section>
  );
}
