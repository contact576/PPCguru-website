import Image from "next/image";
import { ArrowRight, Check, MousePointer2, Search } from "lucide-react";

export type ServiceVisualKind = "google" | "meta" | "seo" | "website" | "tracking";

export function ServiceVisual({ kind }: { kind: ServiceVisualKind }) {
  return (
    <div className={`home-service-visual home-service-visual-${kind}`} aria-hidden="true">
      {kind === "google" && <><Image className="home-service-wordmark" src="/badges/google-ads-logo.svg" alt="" width={910} height={230} style={{ width: 190, height: "auto" }} /><div className="home-search-moment"><Search size={15} /><span>Your service. Their next search.</span><ArrowRight size={14} /></div></>}
      {kind === "meta" && <><div className="home-meta-halo" /><Image className="home-service-wordmark" src="/badges/meta-logo.svg" alt="" width={948} height={191} style={{ width: 156, height: "auto" }} /><div className="home-meta-channels"><span>Facebook</span><Image src="/platforms/instagram.svg" alt="" width={24} height={24} /><span>Instagram</span></div></>}
      {kind === "seo" && <><div className="home-map-grid" /><Image className="home-map-pin" src="/platforms/google-maps.svg" alt="" width={50} height={65} /><div className="home-search-moment"><Image src="/platforms/google.svg" alt="" width={19} height={19} /><span>Be found in your area</span></div></>}
      {kind === "website" && <><div className="home-browser-preview"><div className="home-browser-chrome"><i /><i /><i /><span>ppcguru.ca / 100-leads</span></div><Image src="/images/home/ppc-guru-landing-page.jpg" alt="" width={1265} height={712} sizes="(max-width: 600px) 90vw, 500px" /></div><span className="home-design-label"><MousePointer2 size={14} /> PPC Guru landing page</span></>}
      {kind === "tracking" && <div className="home-tracking-path"><span className="home-tracking-node"><Image src="/platforms/google-tag-manager.svg" width={38} height={38} alt="" /><small>Track</small></span><i /><span className="home-tracking-node"><Image src="/platforms/google-analytics.svg" width={38} height={38} alt="" /><small>Understand</small></span><i /><span className="home-tracking-node"><Check size={32} /><small>Follow up</small></span></div>}
    </div>
  );
}
