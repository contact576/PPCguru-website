import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Check, MessageCircle, MousePointer2, PanelsTopLeft, Pause, Play } from "lucide-react";

/** An illustrative customer journey, using our actual page and platform artwork. */
export function GrowthJourney() {
  return (
    <figure className="growth-journey">
      <input id="growth-journey-pause" className="journey-motion-input" type="checkbox" aria-label="Pause customer journey animation" />
      <div className="journey-heading">
        <span>From discovery to conversion</span>
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
          <span className="journey-step"><b>01</b> Reach your next customer</span>
          <div className="journey-platforms">
            <Link href="/services/google-ads" aria-label="Google Ads management"><Image src="/platforms/google-ads.svg" alt="Google Ads" width={42} height={42} /><span>Google Ads</span></Link>
            <Link href="/services/meta-ads" aria-label="Meta Ads management"><Image src="/platforms/meta.svg" alt="Meta" width={48} height={36} /><span>Meta Ads</span></Link>
            <Link href="/services/seo" aria-label="SEO for Google Search"><Image src="/platforms/google.svg" alt="Google" width={37} height={37} /><span>Google Search</span></Link>
            {/* Unmodified OpenAI-owned Blossom from https://cdn.openai.com/brand/OpenAI-Logos-2025.zip */}
            <Link href="/services/seo" aria-label="SEO and visibility in ChatGPT search"><Image src="/platforms/openai.svg" alt="OpenAI" width={40} height={40} /><span>ChatGPT Search</span></Link>
          </div>
        </div>
        <div className="journey-website">
          <div className="journey-browser-bar"><span><i /><i /><i /></span><small>Illustrative landing page</small><PanelsTopLeft size={13} aria-hidden="true" /></div>
          <div className="journey-website-caption"><span className="journey-step"><b>02</b> Help visitors take action</span><MousePointer2 size={19} aria-hidden="true" /></div>
          <Image src="/images/home/ppc-guru-landing-page.jpg" alt="A PPC Guru landing page illustrating an offer, client evidence and enquiry form" width={1265} height={712} sizes="(max-width: 600px) 80vw, 420px" priority />
        </div>
        <div className="journey-conversation">
          <span className="journey-message-icon"><MessageCircle size={25} aria-hidden="true" /></span>
          <div><span className="journey-step"><b>03</b> Convert interest</span><strong>Capture enquiries.<br />Create opportunities.</strong></div>
          <ArrowDown size={20} aria-hidden="true" />
        </div>
        <span className="journey-followup"><Check size={15} aria-hidden="true" /> Track. Follow up. Improve.</span>
      </div>
      <figcaption>An illustrative conversion journey using a PPC Guru landing page.</figcaption>
    </figure>
  );
}
