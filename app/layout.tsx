import type { Metadata } from "next";
import { Archivo, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCta } from "@/components/shared/floating-cta";
import { CursorGlow } from "@/components/ui/interactive";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

// Display + body workhorse — Archivo (the design's primary grotesk).
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Italic editorial accent for emphasis words.
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "PPC agency",
    "Google Ads management",
    "Meta Ads agency",
    "SEO agency Toronto",
    "digital marketing GTA",
    "Google Partner",
    "Meta Business Partner",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${dmSerif.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen antialiased">
        <OrganizationJsonLd />
        <CursorGlow />
        <SmoothScrollProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <FloatingCta />
          {/*
            PRE-LAUNCH VERIFICATION CHECKLIST (search the codebase for "[VERIFY]"):
            [ ] Real phone number + WhatsApp (siteConfig.contact) — currently blank, shows "Book a call"
            [ ] Real email + mailing address / service area
            [ ] Google Partner + Meta Business Partner status & badge-usage rights
            [ ] Microsoft Advertising certification (if claimed)
            [ ] Review rating + count (none published yet; no Review schema until real)
            [ ] Replace representative case studies & testimonials with approved, real ones
            [ ] Pricing ranges & 30-Day Sprint terms; no-long-term-contract policy
            [ ] GA4 / GTM / Meta Pixel IDs (lib/analytics.ts hooks are no-ops) + cookie/consent banner
            [ ] CRM/email wiring for forms (app/contact/actions.ts, offer popup)
            [ ] Privacy / Terms reviewed by counsel; verify schema validity
          */}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
