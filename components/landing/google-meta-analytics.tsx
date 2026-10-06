"use client";

import { useEffect } from "react";
import { consentState } from "@/lib/analytics";

// Verified PPC Guru destinations; the Ads action is secondary (measurement only).
export const GOOGLE_META_GA4_ID = "G-MKBLW76L2Z";
export const GOOGLE_META_ADS_ID = "AW-18496471261";
export const GOOGLE_META_ADS_CONVERSION = "AW-18496471261/CysrCNTKlZMdEN2B5_NE";

type GoogleTag = (...args: unknown[]) => void;
type GoogleTagWindow = typeof window & {
  dataLayer?: Array<Record<string, unknown> | IArguments>;
  gtag?: GoogleTag;
  __ppcgGoogleMetaAdsConfigured?: boolean;
};

/** Reuse the Google tag loaded by GTM, including its queue before it is ready. */
export function googleMetaTag(...args: unknown[]) {
  const win = window as GoogleTagWindow;
  if (win.gtag) win.gtag(...args);
  else (win.dataLayer ??= []).push(arguments);
}

export function configureGoogleMetaAds() {
  if (typeof window === "undefined" || consentState() === "declined") return;
  const win = window as GoogleTagWindow;
  if (win.__ppcgGoogleMetaAdsConfigured) return;
  // Configure on entry to this funnel so the ad click is available at conversion.
  // The existing Google tag supports another destination; no second loader.
  googleMetaTag("config", GOOGLE_META_ADS_ID);
  win.__ppcgGoogleMetaAdsConfigured = true;
}

/** Mounted only on the Google + Meta landing page; this never sends a lead. */
export function GoogleMetaAnalytics() {
  useEffect(() => {
    configureGoogleMetaAds();
    window.addEventListener("ppcg:consent", configureGoogleMetaAds);
    return () => window.removeEventListener("ppcg:consent", configureGoogleMetaAds);
  }, []);
  return null;
}
