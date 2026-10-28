"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { useLenis } from "lenis/react";
import type { CampaignReport } from "@/lib/data/landing-paid-ads-reports";

/** Actual supplied dashboards; no derived or simulated performance metrics. */
export function ServiceReportGallery({ reports, platform }: { reports: CampaignReport[]; platform: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const lenis = useLenis();
  const open = selected !== null;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      lenis?.start();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (selected === null || !dialog.current) return;
    if (!dialog.current.open) dialog.current.showModal();
    dialog.current.scrollTop = 0;
  }, [selected]);

  function move(direction: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.current?.scrollBy({ left: direction * 390, behavior: reduced ? "auto" : "smooth" });
  }

  return <div className="srv-report-gallery">
    <div className="srv-report-toolbar"><span>{reports.length} supplied {platform} campaign reports</span><div><button type="button" onClick={() => move(-1)} aria-label={`Previous ${platform} reports`}><ArrowLeft size={18} /></button><button type="button" onClick={() => move(1)} aria-label={`Next ${platform} reports`}><ArrowRight size={18} /></button></div></div>
    <div className="srv-report-rail" ref={rail} tabIndex={0} role="region" aria-label={`${platform} report gallery. Scroll horizontally to browse.`}>
      {reports.map((report, index) => <button key={report.src} type="button" className="srv-report" aria-haspopup="dialog" onClick={(event) => { opener.current = event.currentTarget; setSelected(index); }}>
        <Image src={report.src} alt={report.alt} width={report.width} height={report.height} sizes="180px" loading="lazy" />
        <span>{report.client}<Maximize2 size={13} aria-hidden="true" /></span>
      </button>)}
    </div>
    <p className="srv-fine">Original campaign screenshots supplied by PPC Guru. Dates, budgets and measurement definitions differ between reports. Past results do not guarantee future performance. Open a report to read the full dashboard.</p>
    <dialog className="srv-report-dialog" ref={dialog} data-lenis-prevent aria-label={`${platform} campaign report`} onClose={() => { setSelected(null); opener.current?.focus({ preventScroll: true }); }} onKeyDown={(event) => {
      if (selected === null || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault(); setSelected((selected + (event.key === "ArrowLeft" ? -1 : 1) + reports.length) % reports.length);
    }}>
      {selected !== null && <><div className="srv-dialog-heading"><span>{reports[selected].client} · {platform}</span><button type="button" onClick={() => dialog.current?.close()} aria-label="Close report"><X size={21} /></button></div>
        <div className="srv-dialog-controls"><button type="button" onClick={() => setSelected((selected - 1 + reports.length) % reports.length)}><ArrowLeft size={16} /> Previous</button><span>{selected + 1} / {reports.length}</span><button type="button" onClick={() => setSelected((selected + 1) % reports.length)}>Next <ArrowRight size={16} /></button></div>
        {/* Full original is intentional: reporting labels must remain readable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={reports[selected].src} alt={reports[selected].alt} width={reports[selected].width} height={reports[selected].height} />
      </>}
    </dialog>
  </div>;
}
