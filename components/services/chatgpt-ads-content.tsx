import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Focus, Layers3, MousePointer2, PanelsTopLeft, ScanLine, Target } from "lucide-react";
import "./chatgpt-ads.css";

const conceptAngles = [
  {
    theme: "Website enquiries",
    hint: "Service businesses looking to turn existing website visits into more enquiries.",
    headline: "Your website has visitors. What happens next?",
    copy: "Get a free website audit from PPC Guru. Find the gaps between the first click and the enquiry.",
    image: "A clear offer and a simple enquiry path",
    icon: MousePointer2,
  },
  {
    theme: "Advertising efficiency",
    hint: "Business owners reviewing whether their ads and landing pages work well together.",
    headline: "Give your ad spend a clearer plan.",
    copy: "PPC Guru reviews your website and ads, then recommends where to focus. Start with a free audit.",
    image: "One connected website and ads review",
    icon: Target,
  },
  {
    theme: "A stronger offer",
    hint: "Service businesses improving how their website explains the offer and next step.",
    headline: "Make your next customer’s decision easier.",
    copy: "A clearer offer. Useful proof. An easier next step. Find your website’s gaps with a free audit.",
    image: "The offer, the evidence and the next step",
    icon: Layers3,
  },
] as const;

/** Proposed creative only: this is neither a live placement nor ChatGPT UI. */
export function ChatGptAdConcept() {
  return (
    <figure className="cga-concept">
      <div className="cga-concept-heading">
        <span><Image src="/platforms/openai.svg" alt="OpenAI" width={25} height={25} /> ChatGPT Ads</span>
        <span className="cga-concept-label">Illustrative ad concept</span>
      </div>

      <div className="cga-ad-sheet">
        <div className="cga-ad-identity">
          <Image src="/brand/ppc-guru-logo-720.png" alt="PPC Guru" width={720} height={251} sizes="130px" />
          <span>Sponsored</span>
        </div>
        <div className="cga-ad-poster">
          <span className="cga-poster-orbit" aria-hidden="true" />
          <span className="cga-poster-kicker">A clearer path to your next lead</span>
          <strong>Free website<br />&amp; ads audit.</strong>
          <div className="cga-poster-checks"><span><Check size={13} aria-hidden="true" /> Your offer</span><span><Check size={13} aria-hidden="true" /> Your page</span><span><Check size={13} aria-hidden="true" /> Your next step</span></div>
          <span className="cga-poster-focus" aria-hidden="true"><Focus size={33} strokeWidth={1.4} /></span>
        </div>
        <div className="cga-ad-copy">
          <h3>Find what’s holding back your leads.</h3>
          <p>Get a free website and ads audit from PPC Guru. Clear priorities for your business. No obligation.</p>
          <span className="cga-ad-address">ppcguru.ca <span>Website &amp; ads audit</span></span>
        </div>
      </div>

      <figcaption>Proposed PPC Guru creative. This is not a live ad or a screenshot of the ChatGPT interface. Paid ads do not influence organic ChatGPT answers.</figcaption>
    </figure>
  );
}

export function ChatGptCampaignStructure() {
  return (
    <section className="srv-section cga-structure" id="campaign-structure" aria-labelledby="cga-structure-title">
      <div className="srv-wrap">
        <div className="srv-section-heading">
          <div><p className="srv-kicker">Content. Creative. A connected plan.</p><h2 id="cga-structure-title">Build around the need.<br /><em>Make the next step clear.</em></h2></div>
          <p>Here’s how we could structure a PPC Guru audit campaign: one offer, three relevant themes, and a page that follows through. These are proposed examples, not campaign results.</p>
        </div>

        <div className="cga-campaign-node">
          <div><span className="cga-flow-label"><b>01</b> Campaign</span><h3>A free website &amp; ads audit</h3><p>Agree the business goal, budget, markets and schedule before launch.</p></div>
          <div className="cga-campaign-objectives"><span>Choose the right objective</span><ul aria-label="Campaign objective options"><li>Views</li><li>Clicks</li><li>Conversions</li></ul><small>Availability and conversion setup depend on account eligibility.</small></div>
        </div>

        <div className="cga-branch" aria-hidden="true"><ArrowDown size={18} /></div>
        <div className="cga-angle-grid">
          {conceptAngles.map((angle) => {
            const Icon = angle.icon;
            return (
              <article className="cga-angle" key={angle.theme}>
                <div className="cga-angle-context">
                  <span className="cga-flow-label"><b>02</b> Ad group + context</span>
                  <h3>{angle.theme}</h3>
                  <p><span className="cga-detail-label">Example context hint</span>{angle.hint}</p>
                </div>
                <div className="cga-angle-creative">
                  <span className="cga-flow-label"><b>03</b> Ad creative</span>
                  <h4>{angle.headline}</h4>
                  <p>{angle.copy}</p>
                  <div className="cga-image-direction"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /><span><small>Image direction</small>{angle.image}</span></div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="cga-context-note">Context hints guide relevance; they are not exact-match keywords or guaranteed placements. OpenAI controls ad selection and delivery.</p>

        <div className="cga-finish-path">
          <div className="cga-finish-step"><span className="cga-finish-icon"><PanelsTopLeft size={24} strokeWidth={1.5} aria-hidden="true" /></span><div><span className="cga-flow-label"><b>04</b> Landing page</span><h3>Deliver on the ad’s promise.</h3><p>Match the headline, offer and enquiry form. Add a clear destination URL and campaign tracking parameters.</p></div></div>
          <ArrowRight className="cga-finish-arrow" size={22} aria-hidden="true" />
          <div className="cga-finish-step"><span className="cga-finish-icon"><ScanLine size={24} strokeWidth={1.5} aria-hidden="true" /></span><div><span className="cga-flow-label"><b>05</b> Measurement</span><h3>Measure the enquiry, then its quality.</h3><p>Connect the Pixel and, where appropriate, Conversions API. Match event IDs when both report the same conversion, then review lead quality.</p></div></div>
        </div>
        <aside className="cga-organic-note" aria-label="Paid ads and organic visibility">
          <strong>Paid placement. Independent answers.</strong>
          <p>ChatGPT Ads are labeled sponsored placements. Buying an ad does not influence ChatGPT’s organic answers. For the content and technical work behind organic discovery, explore our <a href="/services/seo">SEO &amp; AI visibility service</a>.</p>
        </aside>
        <div className="cga-structure-foot"><span>Official guidance checked <time dateTime="2026-10-10">10 October 2026</time>. Access and features may change.</span><div><a href="https://help.openai.com/en/articles/20001245-ads-manager-availability" target="_blank" rel="noopener noreferrer">Advertiser availability</a><a href="https://help.openai.com/en/articles/20001521-write-context-hints-for-chatgpt-ads" target="_blank" rel="noopener noreferrer">Context hints</a><a href="https://developers.openai.com/ads/conversions-api" target="_blank" rel="noopener noreferrer">Conversion measurement</a></div></div>
      </div>
    </section>
  );
}
