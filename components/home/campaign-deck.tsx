"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { googleAdsResults, metaAdsResults } from "@/lib/data/landing-google-meta-results";

const reports = googleAdsResults.flatMap((report, index) => [
  { ...report, platform: "Google Ads", logo: "/platforms/google-ads.svg" },
  ...(metaAdsResults[index] ? [{ ...metaAdsResults[index], platform: "Meta Ads", logo: "/platforms/meta.svg" }] : []),
]);

/** Rotate supplied evidence, never a simulated dashboard or invented results. */
export function CampaignDeck() {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const playing = !paused && !hovered && visible && pageVisible && !reducedMotion;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % reports.length), 5500);
    return () => window.clearInterval(timer);
  }, [playing, index]);

  const current = reports[index];
  const next = reports[(index + 1) % reports.length];
  const move = (direction: number) => {
    setPaused(true);
    setIndex((currentIndex) => (currentIndex + direction + reports.length) % reports.length);
  };

  return (
    <div
      ref={root}
      className="home-campaign-deck"
      role="region"
      aria-roledescription="carousel"
      aria-label="The work behind the results: campaign reports"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        // Focusing Pause must not change its state before the click toggles it.
        if (!(event.target as HTMLElement).closest("[data-rotation-control]")) setPaused(true);
      }}
      data-playing={playing}
    >
      <div className="home-deck-header"><span><i aria-hidden="true" /> The work behind the results</span><span>{String(index + 1).padStart(2, "0")} / {reports.length}</span></div>
      <div className="home-deck-stage">
        <div className="home-deck-ring" aria-hidden="true" />
        <div className="home-deck-float">
          <div className="home-deck-back" aria-hidden="true"><Image src={next.src} alt="" width={next.width} height={next.height} sizes="(max-width: 600px) 65vw, 320px" loading="eager" /></div>
          <Link key={current.src} className="home-deck-front" href="/google-ads-and-meta-ads#results" aria-label={`Inspect ${current.platform} campaign reports: ${current.client}`}>
            <Image src={current.src} alt={`${current.platform} supplied report visual: ${current.client}, ${current.result}, ${current.cost}`} width={current.width} height={current.height} sizes="(max-width: 600px) 65vw, 320px" loading="lazy" />
            <span className="home-deck-inspect">Inspect the reports <ArrowUpRight size={15} aria-hidden="true" /></span>
          </Link>
        </div>
        <div className="home-deck-platform"><Image src={current.logo} width={38} height={38} alt="" /><span>{current.platform}<small>Campaign report</small></span></div>
      </div>
      <div className="home-deck-summary" aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">
        <div><span>{current.client}</span><strong>{current.result}</strong><small>{current.cost}</small></div>
        <Link href="/google-ads-and-meta-ads#results" aria-label="View all Google Ads and Meta Ads reports"><ArrowUpRight size={25} aria-hidden="true" /></Link>
      </div>
      <div className="home-deck-footer">
        <span>Supplied report visuals <a href="#report-context">About these results</a></span>
        <div className="home-deck-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous report"><ArrowLeft size={17} aria-hidden="true" /></button>
          <button type="button" data-rotation-control onClick={() => setPaused((value) => !value)} disabled={reducedMotion} aria-label={reducedMotion ? "Automatic rotation disabled for reduced motion" : paused ? "Play report rotation" : "Pause report rotation"}>{paused || reducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>
          <button type="button" onClick={() => move(1)} aria-label="Next report"><ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
