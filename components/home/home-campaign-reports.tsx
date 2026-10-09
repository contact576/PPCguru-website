"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import "./home-campaign-reports.css";
import { googleAdsReports, metaAdsReports, type CampaignReport } from "@/lib/data/landing-paid-ads-reports";

type Platform = "Google Ads" | "Meta Ads";
type Selection = { platform: Platform; index: number };
const reportsByPlatform: Record<Platform, CampaignReport[]> = {
  "Google Ads": googleAdsReports,
  "Meta Ads": metaAdsReports,
};

type ReportRailProps = {
  platform: Platform;
  paused: boolean;
  playbackVersion: number;
  reducedMotion: boolean;
  onOpen: (selection: Selection, opener: HTMLButtonElement) => void;
};

/* eslint-disable @next/next/no-img-element -- platform logos and full-resolution report viewer */
function ReportRail({ platform, paused, playbackVersion, reducedMotion, onOpen }: ReportRailProps) {
  const reports = reportsByPlatform[platform];
  const isGoogle = platform === "Google Ads";
  const railId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [manual, setManual] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const [inView, setInView] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number; id: number; scrollLeft: number; mouse: boolean } | null>(null);
  const dragged = useRef(false);
  const moving = !paused && !manual && !reducedMotion && inView && foreground;

  const pauseBriefly = useCallback(() => {
    setManual(true);
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      resumeTimer.current = null;
      setManual(false);
      setSelected(null);
    }, 900);
  }, []);

  useEffect(() => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    setManual(false);
    setSelected(null);
  }, [playbackVersion]);

  useEffect(() => {
    const releasePointer = (event: PointerEvent) => {
      if (pointerStart.current?.id !== event.pointerId) return;
      pointerStart.current = null;
      if (event.type === "pointercancel") dragged.current = true;
      pauseBriefly();
    };
    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);
    return () => {
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
      if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    };
  }, [pauseBriefly]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "60px" });
    const syncVisibility = () => setForeground(!document.hidden);
    observer.observe(viewport);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;
    // Start the rightward Google rail at its identical second copy.
    viewport.scrollLeft = isGoogle && !reducedMotion ? group.offsetWidth : 0;
  }, [isGoogle, reducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!moving || !viewport || !group) return;
    let frame = 0;
    let previousTime: number | null = null;
    let position = viewport.scrollLeft;
    const animate = (time: number) => {
      const distance = group.offsetWidth;
      if (previousTime !== null && distance > 0) {
        // A constant speed keeps both rows in sync regardless of report count.
        position += Math.min(time - previousTime, 50) * .025 * (isGoogle ? -1 : 1);
        position = ((position % distance) + distance) % distance;
        viewport.scrollLeft = position;
      }
      previousTime = time;
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [isGoogle, moving]);

  const showReport = useCallback((index: number, focus = false) => {
    const viewport = viewportRef.current;
    const button = buttonRefs.current[index];
    if (!viewport || !button) return;
    pauseBriefly();
    setSelected(index);
    let left = viewport.scrollLeft + button.getBoundingClientRect().left - viewport.getBoundingClientRect().left - 18;
    const distance = groupRef.current?.offsetWidth ?? 0;
    if (!reducedMotion && !focus && distance > 0) {
      // Navigate to the nearest identical copy, including across the loop seam.
      left += Math.round((viewport.scrollLeft - left) / distance) * distance;
      if (left < 0) {
        viewport.scrollLeft += distance;
        left += distance;
      } else if (left > viewport.scrollWidth - viewport.clientWidth) {
        viewport.scrollLeft -= distance;
        left -= distance;
      }
    }
    viewport.scrollTo({ left, behavior: reducedMotion || focus ? "auto" : "smooth" });
    if (focus) button.focus({ preventScroll: true });
  }, [pauseBriefly, reducedMotion]);

  function nearestReport() {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group || !reports.length) return 0;
    const step = group.offsetWidth / reports.length;
    return Math.round((viewport.scrollLeft % group.offsetWidth) / step) % reports.length;
  }

  function openReport(index: number) {
    const opener = buttonRefs.current[index];
    if (opener && !dragged.current) onOpen({ platform, index }, opener);
  }

  function reportImage(report: CampaignReport, duplicate = false) {
    return <Image className="hcr-report-image" src={report.src} width={report.width} height={report.height} sizes="(max-width: 600px) 124px, 152px" quality={75} alt={duplicate ? "" : report.alt} loading="lazy" draggable={false} />;
  }

  return (
    <div className={`hcr-report-rail${moving ? " is-moving" : ""}`} data-platform={isGoogle ? "google" : "meta"}>
      <div className="hcr-rail-heading">
        <h3><img src={isGoogle ? "/badges/google-ads-logo.svg" : "/badges/meta-logo.svg"} width={isGoogle ? 910 : 948} height={isGoogle ? 230 : 191} alt={platform} loading="lazy" />{!isGoogle && <span aria-hidden="true">Ads</span>}</h3>
        <div className="hcr-rail-controls" role="group" aria-label={`Browse ${platform} reports`}>
          <span>{reports.length} campaign reports</span>
          <button type="button" aria-controls={railId} aria-label={`Previous ${platform} report`} onClick={() => showReport(((selected ?? nearestReport()) - 1 + reports.length) % reports.length)}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" aria-controls={railId} aria-label={`Next ${platform} report`} onClick={() => showReport(((selected ?? nearestReport()) + 1) % reports.length)}><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
      <div ref={viewportRef} id={railId} className="hcr-report-viewport" role="region" aria-label={`${platform} campaign screenshots; swipe or use the arrow buttons to browse`} tabIndex={0}
        onWheel={(event) => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) { pauseBriefly(); setSelected(null); } }}
        onScroll={() => { if (manual && !pointerStart.current) pauseBriefly(); }}
        onPointerDownCapture={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
          setManual(true);
          setSelected(null);
          pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId, scrollLeft: event.currentTarget.scrollLeft, mouse: event.pointerType === "mouse" };
          dragged.current = false;
        }}
        onPointerMoveCapture={(event) => {
          const start = pointerStart.current;
          if (!start || start.id !== event.pointerId) return;
          if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) dragged.current = true;
          // Touch uses native scrolling; mouse dragging needs to move the rail.
          if (dragged.current && start.mouse) {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.scrollLeft = start.scrollLeft - (event.clientX - start.x);
          }
        }}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
          const current = selected ?? nearestReport();
          const target = event.key === "Home" ? 0 : event.key === "End" ? reports.length - 1 : event.key === "ArrowLeft" ? (current - 1 + reports.length) % reports.length : event.key === "ArrowRight" ? (current + 1) % reports.length : null;
          if (target === null) return;
          event.preventDefault();
          showReport(target, true);
        }}>
        <div className="hcr-report-strip">
          <div ref={groupRef} className="hcr-report-group">
            {reports.map((report, index) => <button key={report.src} ref={(node) => { buttonRefs.current[index] = node; }} type="button" className="hcr-report-card" style={{ "--float-delay": `${(index % 5) * -.8}s` } as CSSProperties} aria-haspopup="dialog" aria-label={`Enlarge ${report.client} ${platform} report, ${index + 1} of ${reports.length}`}
              onFocus={(event) => { if (!pointerStart.current && event.currentTarget.matches(":focus-visible")) showReport(index, true); }}
              onClick={(event) => { if (event.detail === 0) dragged.current = false; openReport(index); }}>
              {reportImage(report)}
            </button>)}
          </div>
          {!reducedMotion && <div className="hcr-report-group hcr-report-duplicates" aria-hidden="true">
            {reports.map((report, index) => <div key={report.src} className="hcr-report-card" style={{ "--float-delay": `${(index % 5) * -.8}s` } as CSSProperties} onClick={() => openReport(index)}>{reportImage(report, true)}</div>)}
          </div>}
        </div>
      </div>
      <span className="sr-only" role="status">{selected === null ? "" : `${platform} report ${selected + 1} of ${reports.length}: ${reports[selected].client}`}</span>
    </div>
  );
}

export function HomeCampaignReports() {
  const [paused, setPaused] = useState(false);
  const [playbackVersion, setPlaybackVersion] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [selection, setSelection] = useState<Selection | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = selection !== null;
  const reports = selection ? reportsByPlatform[selection.platform] : [];
  const expanded = selection ? reports[selection.index] : null;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => { if (dialogRef.current) dialogRef.current.scrollTop = 0; }, [selection]);

  function openReport(next: Selection, opener: HTMLButtonElement) {
    openerRef.current = opener;
    setSelection(next);
  }

  function moveReport(direction: number) {
    setSelection((current) => current ? { ...current, index: (current.index + direction + reportsByPlatform[current.platform].length) % reportsByPlatform[current.platform].length } : null);
  }

  return (
    <section className="home-campaign-reports" id="proof" aria-labelledby="hcr-results-title">
      <div className="hcr-results-heading">
        <p className="hcr-kicker">The work, in the open</p>
        <h2 id="hcr-results-title" tabIndex={-1}>Real campaigns. <em>Real results.</em></h2>
        <div className="hcr-results-intro"><p>Google Ads and Meta Ads. Explore the actual dashboards. Tap any report to see the details.</p>
          {!reducedMotion && <button type="button" className="hcr-autoplay-button" onClick={() => { setPaused((value) => !value); setPlaybackVersion((value) => value + 1); }}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}{paused ? "Resume motion" : "Pause motion"}</button>}
        </div>
      </div>
      <ReportRail platform="Google Ads" paused={paused || isOpen} playbackVersion={playbackVersion} reducedMotion={reducedMotion} onOpen={openReport} />
      <ReportRail platform="Meta Ads" paused={paused || isOpen} playbackVersion={playbackVersion} reducedMotion={reducedMotion} onOpen={openReport} />
      <p className="hcr-results-disclosure">Campaign reports supplied by PPC Guru. Each image shows its own reporting period and metrics. Past performance does not guarantee future results.</p>
      <dialog ref={dialogRef} className="hcr-result-dialog" data-lenis-prevent aria-label={selection && expanded ? `${expanded.client} ${selection.platform} campaign report` : "Campaign report"} onClose={() => setSelection(null)} onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); moveReport(event.key === "ArrowLeft" ? -1 : 1); }
      }} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialogRef.current?.close();
      }}>
        {selection && expanded && <>
          <div className="hcr-dialog-header"><span>{selection.platform} <span aria-hidden="true">·</span> {expanded.client}</span><button ref={closeRef} className="hcr-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close report"><X aria-hidden="true" /></button></div>
          <div className="hcr-dialog-controls"><button type="button" onClick={() => moveReport(-1)} aria-label={`Previous ${selection.platform} report`}><ArrowLeft aria-hidden="true" /> Previous</button><span>{selection.index + 1} / {reports.length}</span><button type="button" onClick={() => moveReport(1)} aria-label={`Next ${selection.platform} report`}>Next <ArrowRight aria-hidden="true" /></button></div>
          <span className="sr-only" role="status">{selection.platform} report {selection.index + 1} of {reports.length}: {expanded.client}</span>
          <img key={expanded.src} className="hcr-dialog-image" src={expanded.src} width={expanded.width} height={expanded.height} alt={expanded.alt} />
        </>}
      </dialog>
    </section>
  );
}
