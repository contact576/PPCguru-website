import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, MessageCircle, MousePointer2, Pause, Play } from "lucide-react";

/** An illustrative customer journey, using our actual page and platform artwork. */
export function GrowthJourney() {
  return (
    <figure className="growth-journey">
      <input id="growth-journey-pause" className="journey-motion-input" type="checkbox" aria-label="Pause customer journey animation" />
      <div className="journey-heading">
        <span>From first click to first conversation</span>
        <label htmlFor="growth-journey-pause" className="journey-motion-control">
          <span className="journey-pause"><Pause size={12} aria-hidden="true" /> Pause</span>
          <span className="journey-play"><Play size={12} aria-hidden="true" /> Play</span>
        </label>
      </div>
      <div className="journey-scene">
        <div className="journey-orbit journey-orbit-one" aria-hidden="true" />
        <div className="journey-orbit journey-orbit-two" aria-hidden="true" />
        <svg className="journey-connectors" viewBox="0 0 560 510" fill="none" aria-hidden="true">
          <path d="M145 100V133Q145 154 170 154H280Q300 154 300 178V205M310 343V376Q310 396 334 396H410V428" />
          <path className="journey-flow" d="M145 100V133Q145 154 170 154H280Q300 154 300 178V205M310 343V376Q310 396 334 396H410V428" />
        </svg>
        <div className="journey-discovery">
          <span className="journey-step"><b>01</b> Get discovered</span>
          <div className="journey-platforms">
            <Link href="/services/google-ads" aria-label="Google Ads management"><Image src="/platforms/google-ads.svg" alt="Google Ads" width={42} height={42} /><span>Google Ads</span></Link>
            <Link href="/services/meta-ads" aria-label="Meta Ads management"><Image src="/platforms/meta.svg" alt="Meta" width={48} height={36} /><span>Meta Ads</span></Link>
            <Link href="/services/seo" aria-label="SEO and local search"><Image src="/platforms/google.svg" alt="Google" width={37} height={37} /><span>Search &amp; SEO</span></Link>
          </div>
        </div>
        <Link href="/100-leads" className="journey-website" aria-label="See the PPC Guru 100 Leads landing page">
          <div className="journey-browser-bar"><span><i /><i /><i /></span><small>ppcguru.ca / 100-leads</small><ArrowUpRight size={13} aria-hidden="true" /></div>
          <div className="journey-website-caption"><span className="journey-step"><b>02</b> Give them a reason to choose you</span><MousePointer2 size={19} aria-hidden="true" /></div>
          <Image src="/images/home/ppc-guru-landing-page.jpg" alt="PPC Guru's actual landing page with its offer, client evidence and enquiry form" width={1265} height={712} sizes="(max-width: 600px) 80vw, 420px" priority />
        </Link>
        <div className="journey-conversation">
          <span className="journey-message-icon"><MessageCircle size={25} aria-hidden="true" /></span>
          <div><span className="journey-step"><b>03</b> Make the connection</span><strong>A real enquiry.<br />A clear next step.</strong></div>
          <ArrowDown size={20} aria-hidden="true" />
        </div>
        <span className="journey-followup"><Check size={15} aria-hidden="true" /> Track. Follow up. Improve.</span>
      </div>
      <figcaption>One connected customer journey. Illustrated with a PPC Guru landing page.</figcaption>
    </figure>
  );
}
