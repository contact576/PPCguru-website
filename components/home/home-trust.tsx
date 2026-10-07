import type { CSSProperties } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import {
  GOOGLE_PARTNER_PROFILE_URL,
  META_PARTNER_URL,
} from "@/lib/data/certifications";
import { clientLogos, logoName } from "@/lib/data/landing-100-leads";
import { clientLogosWebp } from "@/lib/data/client-logos-webp";
import "./home-trust.css";

/* eslint-disable @next/next/no-img-element -- local vector marks and small supplied client logos */

export function HomePartners() {
  return (
    <div className="home-partner-marks" aria-label="Platform partner profiles">
      <a
        className="home-partner-mark home-partner-google"
        href={GOOGLE_PARTNER_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Google Partner — view PPC Guru's Google partner profile"
      >
        <div className="home-google-partner-label"><img src="/badges/reviews/google.svg" alt="Google" width="148" height="48" /><strong>Partner</strong></div>
        <span>View partner profile <ArrowUpRight size={13} aria-hidden="true" /></span>
      </a>
      <a
        className="home-partner-mark home-partner-meta"
        href={META_PARTNER_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Meta — view PPC Guru's business partner documentation"
      >
        <img src="/badges/meta-logo.svg" alt="Meta" width="948" height="191" />
        <span>Business partner documentation <ArrowUpRight size={13} aria-hidden="true" /></span>
      </a>
    </div>
  );
}

const logoSource = (file: string) => clientLogosWebp.has(file)
  ? `/landing/logos/opt/${file.replace(/\.[^.]+$/, ".webp")}`
  : `/landing/logos/${file}`;

// These supplied transparent marks contain white lettering.
const darkLogoBackdrop = new Set(["the-ups-store-604.svg", "ecocare-home-comfort.png"]);

/** Native checkbox controls the CSS animation, keeping this entire strip server-rendered. */
export function HomeClientMarquee() {
  return (
    <section className="home-client-marquee" aria-labelledby="home-client-marquee-title">
      <input
        className="home-client-motion-toggle"
        id="home-client-motion-toggle"
        type="checkbox"
        aria-label="Pause client logo animation"
      />
      <div className="home-wrap home-client-marquee-heading">
        <div>
          <p className="home-kicker">Selected client work</p>
          <h2 id="home-client-marquee-title">Good company to grow with.</h2>
        </div>
        <label htmlFor="home-client-motion-toggle" className="home-client-motion-control">
          <span className="home-client-pause"><Pause size={13} aria-hidden="true" /> Pause motion</span>
          <span className="home-client-resume"><Play size={13} aria-hidden="true" /> Resume motion</span>
        </label>
      </div>
      <div className="home-client-marquee-viewport" tabIndex={0} role="region" aria-label="Selected client logos. Focus to pause animation.">
        <div className="home-client-marquee-track" style={{ "--client-marquee-duration": `${clientLogos.length * 4.1}s` } as CSSProperties}>
          {[false, true].map((duplicate) => (
            <ul className="home-client-marquee-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {clientLogos.map((file) => (
                <li className={`home-client-marquee-logo${darkLogoBackdrop.has(file) ? " home-client-logo-dark" : ""}`} key={file}>
                  <img
                    src={logoSource(file)}
                    alt={duplicate ? "" : logoName(file)}
                    width="180"
                    height="85"
                    decoding="async"
                    loading="eager"
                    fetchPriority="low"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

/* eslint-enable @next/next/no-img-element */
