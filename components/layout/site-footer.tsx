import Link from "next/link";
import { BrandMarquee } from "@/components/shared/logo-wall";
import { Logo } from "@/components/shared/logo";

/**
 * Footer — handoff design (dark olive #14170e, lime accents). Shared across all
 * pages. Real routes wired where they exist; contact details remain honest
 * ([VERIFY] phone/WhatsApp until confirmed — we show email + Book a call).
 */
const col = { fontSize: 13.5, color: "#9a9b88" } as const;
const head = { fontSize: 10.5, fontWeight: 700, color: "#f1efe3", letterSpacing: ".1em", textTransform: "uppercase" as const, marginBottom: 16 };

function FCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mono" style={head}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {links.map((l) => (
          <Link key={l.label} href={l.href} style={{ ...col, transition: "color .2s" }} className="hover:text-[#ceff3a]">{l.label}</Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer id="footer" style={{ background: "#14170e", color: "#9a9b88" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "64px 20px 40px" }}>
        {/* Industries we serve — carousel (swap to real client logos with consent) */}
        <div style={{ marginBottom: 56, paddingBottom: 48, borderBottom: "1px solid rgba(241,239,227,.08)" }}>
          <div className="mono" style={{ fontSize: 10.5, fontWeight: 700, color: "#75766a", letterSpacing: ".12em", textTransform: "uppercase", textAlign: "center", marginBottom: 18 }}>Industries we serve</div>
          <BrandMarquee />
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <div style={{ marginBottom: 16 }}>
              <Logo variant="light" size={44} />
            </div>
            <p style={{ fontSize: 13.5, color: "#75766a", lineHeight: 1.6, maxWidth: 320 }}>
              A Google Partner &amp; Meta Business Partner agency turning ad spend into booked jobs and qualified leads for service businesses across the GTA, Canada and the USA.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              {/* [VERIFY] partner status + badge-usage rights before launch */}
              {["Google Partner", "Meta Partner"].map((b) => (
                <span key={b} className="mono" style={{ fontSize: 10, fontWeight: 600, color: "#9a9b88", border: "1px solid rgba(241,239,227,.12)", padding: "6px 11px", borderRadius: 8, letterSpacing: ".06em", textTransform: "uppercase" }}>{b}</span>
              ))}
            </div>
          </div>

          <FCol title="Services" links={[
            { label: "Free audit + 30-day trial", href: "/free-audit" },
            { label: "Google Ads Management", href: "/services/google-ads" },
            { label: "Meta Ads", href: "/services/meta-ads" },
            { label: "SEO & Local Search", href: "/services/seo" },
            { label: "Creative Production", href: "/services/creative" },
            { label: "Websites & Landing Pages", href: "/services/web-design" },
            { label: "CRM & Marketing Ops", href: "/services/crm" },
            { label: "Industry benchmarks", href: "/benchmarks" },
            { label: "Pricing", href: "/pricing" },
            { label: "Compare guides", href: "/compare" },
            { label: "Marketing glossary", href: "/glossary" },
          ]} />
          <FCol title="Industries" links={[
            { label: "Physiotherapy", href: "/industries/physiotherapy" },
            { label: "Dental", href: "/industries/dental" },
            { label: "HVAC", href: "/industries/hvac" },
            { label: "Construction", href: "/industries/construction-renovation" },
            { label: "Immigration", href: "/industries/immigration" },
            { label: "Real Estate", href: "/industries/real-estate" },
          ]} />
          <FCol title="Locations" links={[
            { label: "Toronto", href: "/toronto/google-ads" },
            { label: "Brampton", href: "/brampton/google-ads" },
            { label: "Mississauga", href: "/mississauga/google-ads" },
            { label: "Vaughan", href: "/vaughan/google-ads" },
            { label: "Markham", href: "/markham/google-ads" },
            { label: "Ottawa", href: "/ottawa/google-ads" },
          ]} />

          <div>
            <div className="mono" style={head}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13.5 }}>
              <a href="mailto:hello@ppcguru.ca" style={{ ...col }} className="hover:text-[#ceff3a]">hello@ppcguru.ca</a>
              <span style={{ color: "#75766a" }}>Brampton, ON · GTA</span>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#ceff3a", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ceff3a" }} />Message us
              </Link>
              <Link href="/contact" className="mono" style={{ marginTop: 6, background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 11.5, letterSpacing: ".05em", textTransform: "uppercase", textAlign: "center", padding: 13, borderRadius: 12 }}>Book a call</Link>
            </div>
          </div>
        </div>

        <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 48, paddingTop: 26, borderTop: "1px solid rgba(241,239,227,.08)", fontSize: 12, color: "#5e5f54" }}>
          <span style={{ letterSpacing: ".03em" }}>© {2026} PPC Guru. All rights reserved.</span>
          <div style={{ display: "flex", gap: 22 }}>
            <Link href="/privacy" style={{ letterSpacing: ".05em", textTransform: "uppercase", fontSize: 11 }} className="hover:text-[#f1efe3]">Privacy</Link>
            <Link href="/terms" style={{ letterSpacing: ".05em", textTransform: "uppercase", fontSize: 11 }} className="hover:text-[#f1efe3]">Terms</Link>
            <Link href="/privacy#cookies" style={{ letterSpacing: ".05em", textTransform: "uppercase", fontSize: 11 }} className="hover:text-[#f1efe3]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
