import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { reviewProfileUrls, reviewSources } from "@/lib/data/reviews";
import "./home-credentials.css";

// Destinations stay tied to the owner's existing profile list. A directory
// listing is not a certification, award, rating or endorsement.
const profileUrl = (domain: string) => reviewProfileUrls.find((url) => new URL(url).hostname.includes(domain))!;

const featuredProfiles = [
  { name: "Google", label: "Read client reviews", url: reviewSources.find((source) => source.key === "google")!.url, image: "/badges/reviews/google.svg", width: 148, height: 48 },
  { name: "Trustpilot", label: "Explore our profile", url: profileUrl("trustpilot.com"), image: "/badges/reviews/trustpilot.svg", width: 180, height: 45 },
  { name: "GoodFirms", label: "Explore our profile", url: profileUrl("goodfirms.co"), image: "/badges/reviews/goodfirms.svg", width: 181, height: 27 },
  { name: "DesignRush", label: "Explore our profile", url: profileUrl("designrush.com"), image: "/badges/reviews/designrush.svg", width: 170, height: 40 },
];

const additionalProfiles = [
  ["Clutch", "clutch.co"],
  ["The Manifest", "themanifest.com"],
  ["G2", "g2.com"],
  ["Sortlist", "sortlist.com"],
  ["ProvenExpert", "provenexpert.com"],
  ["TechBehemoths", "techbehemoths.com"],
  ["ITProfiles", "itprofiles.com"],
  ["BBB", "bbb.org"],
  ["Agency Spotter", "agencyspotter.com"],
];

export function HomeCredentials() {
  return (
    <section className="home-credentials" aria-labelledby="home-credentials-heading">
      <div className="home-wrap">
        <div className="home-credentials-intro">
          <div>
            <p className="home-kicker">Reviews &amp; agency profiles</p>
            <h2 id="home-credentials-heading">Find us beyond<br /><em>our website.</em></h2>
          </div>
          <p>Do your own research. Read client feedback and explore PPC Guru’s profiles across independent platforms.</p>
        </div>
        <div className="home-credentials-brands">
          {featuredProfiles.map((profile) => (
            <a key={profile.name} href={profile.url} target="_blank" rel="noopener noreferrer" aria-label={`PPC Guru on ${profile.name} (opens in a new tab)`}>
              <span className="home-credentials-logo">
                <Image src={profile.image} width={profile.width} height={profile.height} alt={profile.name} />
              </span>
              <span className="home-credentials-label">{profile.label}<ArrowUpRight size={16} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
        <div className="home-credentials-more">
          <span className="home-credentials-more-label">More places to find us</span>
          <ul aria-label="PPC Guru agency directory profiles">
            {additionalProfiles.map(([name, domain]) => (
              <li key={domain}><a href={profileUrl(domain)} target="_blank" rel="noopener noreferrer" aria-label={`PPC Guru on ${name} (opens in a new tab)`}>{name}<ArrowUpRight size={13} aria-hidden="true" /></a></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
