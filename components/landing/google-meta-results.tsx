"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Expand, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { googleAdsResults, metaAdsResults, type CampaignScreenshot } from "@/lib/data/landing-google-meta-results";

type CampaignItem = CampaignScreenshot & { platform: "Google Ads" | "Meta Ads" };

const reports: CampaignItem[] = Array.from({ length: Math.max(googleAdsResults.length, metaAdsResults.length) }, (_, index) => [
  googleAdsResults[index] ? { ...googleAdsResults[index], platform: "Google Ads" as const } : null,
  metaAdsResults[index] ? { ...metaAdsResults[index], platform: "Meta Ads" as const } : null,
]).flat().filter((result): result is CampaignItem => result !== null);
const campaigns: CampaignItem[] = reports;
const initialIndex = 0;
const firstGoogleIndex = campaigns.findIndex((result) => result.platform === "Google Ads");
const firstMetaIndex = campaigns.findIndex((result) => result.platform === "Meta Ads");

function ResultCaption({ result }: { result: CampaignScreenshot }) {
  return (
    <div className="gm-result-caption">
      <h3>{result.client}</h3>
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
export function GoogleMetaResults() {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeIndexRef = useRef(initialIndex);
  const navigationTarget = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackId = useId();
  const [dialogIndex, setDialogIndex] = useState(initialIndex);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const dragged = useRef(false);
  const rotationControlRef = useRef<HTMLButtonElement>(null);
  const rotationDirection = useRef(1);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [hovered, setHovered] = useState(false);
  const total = campaigns.length;
  const active = campaigns[activeIndex];
  const expanded = campaigns[dialogIndex];
  const rotating = total > 1 && !rotationPaused && !reducedMotion && inView && foreground && !hovered && !dialogOpen;

  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    const trackBounds = track.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    // The track's CSS edge padding lets the first and last cards center too.
    const left = track.scrollLeft + cardBounds.left - trackBounds.left - (track.clientWidth - cardBounds.width) / 2;
    activeIndexRef.current = index;
    setActiveIndex(index);
    navigationTarget.current = Math.abs(track.scrollLeft - left) < 3 ? null : index;
    track.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : behavior });
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !total) return;
    let frame: number | null = null;

    function readPosition() {
      frame = null;
      if (!track) return;
      const bounds = track.getBoundingClientRect();
      const centre = bounds.left + track.clientWidth / 2;
      let nearest = 0;
      let distance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const delta = Math.abs(rect.left + rect.width / 2 - centre);
        if (delta < distance) { nearest = index; distance = delta; }
      });
      if (navigationTarget.current !== null) {
        if (nearest !== navigationTarget.current || distance > 3) return;
        navigationTarget.current = null;
      }
      activeIndexRef.current = nearest;
      setActiveIndex(nearest);
    }

    function onScroll() {
      if (frame === null) frame = window.requestAnimationFrame(readPosition);
    }

    function onResize() {
      scrollToCard(activeIndexRef.current, "auto");
    }

    scrollToCard(initialIndex, "auto");
    track.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(onResize);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [scrollToCard, total]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReducedMotion(motion.matches);
      if (motion.matches) setRotationPaused(true);
    };
    const syncVisibility = () => setForeground(!document.hidden);
    syncMotion();
    syncVisibility();
    motion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= .15), { threshold: [0, .15] });
    observer.observe(track);
    return () => {
      motion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      if (navigationTarget.current !== null) return;
      const current = activeIndexRef.current;
      // Reverse at either end so every automatic move travels just one card.
      if (current === total - 1) rotationDirection.current = -1;
      else if (current === 0) rotationDirection.current = 1;
      scrollToCard(current + rotationDirection.current);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [rotating, scrollToCard, total]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialogOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [dialogOpen]);

  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.scrollTop = 0;
  }, [dialogIndex]);

  function move(direction: number) {
    setRotationPaused(true);
    if (total > 1) scrollToCard((activeIndexRef.current + direction + total) % total);
  }

  function keyboardTarget(event: KeyboardEvent<HTMLElement>, current: number) {
    if (total < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return null;
    if (event.key === "Home") return 0;
    if (event.key === "End") return total - 1;
    if (event.key === "ArrowLeft") return (current - 1 + total) % total;
    if (event.key === "ArrowRight") return (current + 1) % total;
    return null;
  }

  function onCarouselKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (dialogOpen) return;
    const target = keyboardTarget(event, activeIndexRef.current);
    if (target === null) return;
    event.preventDefault();
    event.stopPropagation();
    setRotationPaused(true);
    const fromScreenshot = buttonRefs.current.some((button) => button === document.activeElement);
    scrollToCard(target, "auto");
    if (fromScreenshot) buttonRefs.current[target]?.focus({ preventScroll: true });
  }

  function openResult(index: number, opener: HTMLButtonElement, keyboard: boolean) {
    if (dragged.current && !keyboard) return;
    scrollToCard(index, "auto");
    openerRef.current = opener;
    setDialogIndex(index);
    setDialogOpen(true);
  }

  if (!active || !expanded) return null;

  return (
    <section className="gm-results" id="results" aria-labelledby="gm-results-title">
      <div className="gm-results-heading">
        <p className="section-kicker">The work, in the open</p>
        <h2 id="gm-results-title" tabIndex={-1}>Real campaigns.<br /><span>Real results.</span></h2>
        <p>Swipe through Google and Meta campaign reports supplied by PPC Guru. Open any image to inspect its figures.</p>
      </div>
      <div className="gm-results-carousel" role="region" aria-roledescription="carousel" aria-label="Google and Meta campaign reports" tabIndex={0} onKeyDown={onCarouselKeyDown}
        onFocusCapture={(event) => { if (!rotationControlRef.current?.contains(event.target)) setRotationPaused(true); }}
        onPointerDownCapture={(event) => { if (!rotationControlRef.current?.contains(event.target as Node)) setRotationPaused(true); }}>
        {total > 1 && !reducedMotion ? <div className="gm-carousel-playback">
          <button ref={rotationControlRef} type="button" className="gm-autoplay-button" aria-controls={trackId} onClick={() => setRotationPaused((paused) => !paused)}>
            {rotationPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            {rotationPaused ? "Play slideshow" : "Pause slideshow"}
          </button>
        </div> : null}
        <div className="gm-platform-shortcuts" role="group" aria-label="Jump to campaign type">
          {firstGoogleIndex >= 0 && <button type="button" aria-controls={trackId} onClick={() => { setRotationPaused(true); scrollToCard(firstGoogleIndex); }}>Google Ads <span>{googleAdsResults.length}</span></button>}
          {firstMetaIndex >= 0 && <button type="button" aria-controls={trackId} onClick={() => { setRotationPaused(true); scrollToCard(firstMetaIndex); }}>Meta Ads <span>{metaAdsResults.length}</span></button>}
        </div>
        <div className="gm-carousel-controls">
          <button className="gm-carousel-arrow" type="button" onClick={() => move(-1)} disabled={total < 2} aria-controls={trackId} aria-label="Previous campaign"><ArrowLeft aria-hidden="true" /></button>
          {total > 8 ? <span className="gm-carousel-platform" aria-hidden="true">{active.platform}</span> : <div className="gm-carousel-dots" role="group" aria-label="Choose a campaign">
            {campaigns.map((result, index) => <button key={`${result.platform}-${result.src}`} type="button" className={`gm-carousel-dot${index === activeIndex ? " is-active" : ""}`} aria-controls={trackId} aria-label={`Show ${result.client}, ${result.platform}, ${index + 1} of ${total}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => { setRotationPaused(true); scrollToCard(index); }} />)}
          </div>}
          <span className="gm-carousel-counter" aria-hidden="true">{activeIndex + 1} / {total}</span>
          <button className="gm-carousel-arrow" type="button" onClick={() => move(1)} disabled={total < 2} aria-controls={trackId} aria-label="Next campaign"><ArrowRight aria-hidden="true" /></button>
        </div>
        <div ref={trackRef} id={trackId} className="gm-results-track" onPointerDownCapture={() => { navigationTarget.current = null; }} onWheel={() => { navigationTarget.current = null; setRotationPaused(true); }}
          onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }} onPointerLeave={() => setHovered(false)}>
          {campaigns.map((result, index) => (
            <article ref={(node) => { cardRefs.current[index] = node; }} key={`${result.platform}-${result.src}`} className={`gm-campaign-card${index === activeIndex ? " is-active" : ""}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}: ${result.client}, ${result.platform}`}>
              <div className="gm-campaign-heading">
                <img className="gm-platform-logo" src={result.platform === "Google Ads" ? "/badges/google-ads-logo.svg" : "/badges/meta-logo.svg"} width={result.platform === "Google Ads" ? 910 : 948} height={result.platform === "Google Ads" ? 230 : 191} alt={result.platform} loading="lazy" />
                <span className="gm-platform-label">Provided campaign report</span>
              </div>
              <ResultCaption result={result} />
              <div className="gm-phone-stage">
                <button ref={(node) => { buttonRefs.current[index] = node; }} type="button" className="gm-phone-frame" tabIndex={index === activeIndex ? 0 : -1} aria-haspopup="dialog" aria-label={`Open ${result.client} ${result.platform} report full size`} style={{ touchAction: "auto" }}
                  onPointerDown={(event) => { if (event.isPrimary && event.button === 0) { pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId }; dragged.current = false; } }}
                  onPointerMove={(event) => { const start = pointerStart.current; if (start && start.id === event.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) dragged.current = true; }}
                  onPointerUp={(event) => { if (pointerStart.current?.id === event.pointerId) pointerStart.current = null; }}
                  onPointerCancel={(event) => { if (pointerStart.current?.id === event.pointerId) { pointerStart.current = null; dragged.current = true; } }}
                  onClick={(event) => openResult(index, event.currentTarget, event.detail === 0)}>
                  <Image className="gm-phone-image" src={result.src} width={result.width} height={result.height} sizes="(max-width: 600px) 234px, 238px" quality={75} alt={`${result.client} ${result.platform} campaign report`} loading="lazy" draggable={false} />
                  <span className="gm-phone-open"><Expand aria-hidden="true" /> View full image</span>
                </button>
              </div>
            </article>
          ))}
        </div>
        <span className="sr-only" role="status" aria-live={rotating ? "off" : "polite"}>Campaign {activeIndex + 1} of {total}: {active.client}, {active.platform}, {active.result}, {active.cost}.</span>
      </div>
      <p className="gm-results-disclosure">Past campaign figures supplied by PPC Guru; independently unverified. Reports show the metric and period on each image, and a conversion does not necessarily mean a lead or sale. Performance varies by offer, market, budget and follow-up.</p>
      <dialog ref={dialogRef} className="gm-result-dialog" aria-label={`${expanded.client} ${expanded.platform} campaign image`} onClose={() => setDialogOpen(false)} onKeyDown={(event) => {
        const target = keyboardTarget(event, dialogIndex);
        if (target !== null) { event.preventDefault(); event.stopPropagation(); setDialogIndex(target); }
      }} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialogRef.current?.close();
      }}>
        <div className="gm-dialog-header"><span>{expanded.platform} · Provided campaign report</span><button ref={closeRef} className="gm-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close full-size report"><X aria-hidden="true" /></button></div>
        <div className="gm-dialog-controls">
          <button type="button" onClick={() => setDialogIndex((current) => (current - 1 + total) % total)} disabled={total < 2} aria-label="Previous campaign report"><ArrowLeft aria-hidden="true" /> Previous</button>
          <span>{dialogIndex + 1} / {total}</span>
          <button type="button" onClick={() => setDialogIndex((current) => (current + 1) % total)} disabled={total < 2} aria-label="Next campaign report">Next <ArrowRight aria-hidden="true" /></button>
        </div>
        <span className="sr-only" role="status">Report {dialogIndex + 1} of {total}: {expanded.client}, {expanded.platform}, {expanded.result}, {expanded.cost}.</span>
        <img key={expanded.src} className="gm-dialog-image" src={expanded.src} width={expanded.width} height={expanded.height} alt={`${expanded.client}: ${expanded.result}, ${expanded.cost}, ${expanded.spend} spent. ${expanded.period}.`} />
        <a className="gm-dialog-original-link" href={expanded.src} target="_blank" rel="noopener noreferrer">Open full-resolution report</a>
        <div className="gm-dialog-caption"><ResultCaption result={expanded} /></div>
      </dialog>
    </section>
  );
}
