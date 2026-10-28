import Image from "next/image";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { reviewProfileUrls, reviewSources } from "@/lib/data/reviews";
import "./home-credentials.css";

// Destinations stay tied to the owner's existing profile list. A directory
// listing is not a certification, award, rating or endorsement.
const profileUrl = (domain: string) => reviewProfileUrls.find((url) => new URL(url).hostname.includes(domain))!;

const profiles = [
  { name: "Google", label: "Read client reviews", url: reviewSources.find((source) => source.key === "google")!.url, image: "/badges/reviews/google.svg", width: 148, height: 48 },
  { name: "Trustpilot", label: "Explore our profile", url: profileUrl("trustpilot.com"), image: "/badges/reviews/trustpilot.svg", width: 180, height: 45 },
  { name: "GoodFirms", label: "Explore our profile", url: profileUrl("goodfirms.co"), image: "/badges/reviews/goodfirms.svg", width: 181, height: 27 },
  { name: "DesignRush", label: "Explore our profile", url: profileUrl("designrush.com"), image: "/badges/reviews/designrush.svg", width: 170, height: 40 },
  { name: "Clutch", label: "Explore our profile", url: profileUrl("clutch.co"), image: "/badges/reviews/clutch.png", width: 980, height: 460 },
  { name: "The Manifest", label: "Explore our profile", url: profileUrl("themanifest.com"), image: "/badges/reviews/themanifest.png", width: 885, height: 595 },
  { name: "G2", label: "Explore our profile", url: profileUrl("g2.com"), image: "/badges/reviews/g2.svg", width: 80, height: 80 },
  { name: "Sortlist", label: "Explore our profile", url: profileUrl("sortlist.com"), image: "/badges/reviews/sortlist.svg", width: 284, height: 72 },
  { name: "ProvenExpert", label: "Explore our profile", url: profileUrl("provenexpert.com"), image: "/badges/reviews/provenexpert.svg", width: 191, height: 57 },
  { name: "TechBehemoths", label: "Explore our profile", url: profileUrl("techbehemoths.com"), image: "/badges/reviews/techbehemoths.png", width: 256, height: 256 },
  { name: "ITProfiles", label: "Explore our profile", url: profileUrl("itprofiles.com"), image: "/badges/reviews/itprofiles.svg", width: 826, height: 200 },
  { name: "BBB", label: "Explore our profile", url: profileUrl("bbb.org"), image: "/badges/reviews/bbb.svg", width: 186, height: 76 },
  { name: "Agency Spotter", label: "Explore our profile", url: profileUrl("agencyspotter.com"), image: "/badges/reviews/agencyspotter.svg", width: 296, height: 154 },
];

export function HomeCredentials() {
  return (
    <section className="home-credentials" id="credentials" aria-labelledby="home-credentials-heading">
      <input className="home-credentials-toggle" id="home-credentials-motion" type="checkbox" aria-label="Pause review platform logo animation" />
      <div className="home-wrap">
        <div className="home-credentials-intro">
          <div>
            <p className="home-kicker">Reviews &amp; agency profiles</p>
            <h2 id="home-credentials-heading">Find us beyond<br /><em>our website.</em></h2>
          </div>
          <p>Do your own research. Read client feedback and explore PPC Guru’s profiles across independent platforms.</p>
        </div>
        <div className="home-credentials-controls">
          <span>Read reviews. Explore our profiles.</span>
          <label htmlFor="home-credentials-motion" className="home-credentials-motion-control">
            <span className="home-credentials-pause"><Pause size={13} aria-hidden="true" /> Pause motion</span>
            <span className="home-credentials-resume"><Play size={13} aria-hidden="true" /> Resume motion</span>
          </label>
        </div>
      </div>
      <div className="home-credentials-brands" role="region" aria-label="Review and directory profiles. Focus to stop motion and browse links." tabIndex={0}>
        <div className="home-credentials-track">
          {[false, true].map((duplicate) => (
            <ul className="home-credentials-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {profiles.map((profile) => (
                <li key={profile.name}>
                  <a href={profile.url} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={`PPC Guru on ${profile.name} (opens in a new tab)`}>
                    <span className={`home-credentials-logo${profile.name === "TechBehemoths" ? " home-credentials-icon-wordmark" : ""}${profile.name === "Clutch" ? " home-credentials-logo-clutch" : ""}`}>
                      <Image src={profile.image} width={profile.width} height={profile.height} alt={duplicate ? "" : profile.name} loading="eager" />
                      {profile.name === "TechBehemoths" && <span aria-hidden="true">TechBehemoths</span>}
                    </span>
                    <span className="home-credentials-label">{profile.label}<ArrowUpRight size={14} aria-hidden="true" /></span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
