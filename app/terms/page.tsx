import type { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `The terms governing your use of the ${siteConfig.name} website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated="June 2026">
      <p>These Terms of Use govern your access to and use of the {siteConfig.name} website at {siteConfig.domain}. By using this site, you agree to these terms.</p>

      <h2>Use of the site</h2>
      <p>You may use this site for lawful purposes only. You agree not to misuse the site, attempt to gain unauthorized access, or interfere with its operation.</p>

      <h2>Free tools &amp; calculators</h2>
      <p>Our calculators, audits and other tools provide illustrative estimates based on industry-average benchmarks and the inputs you provide. They are for general informational purposes only, are not guarantees of performance or results, and should not be relied upon as professional advice for your specific situation.</p>

      <h2>No guarantee of results</h2>
      <p>Digital marketing results depend on many factors outside our control. Any examples, case studies or projections shown are representative and illustrative; individual results vary. We do not guarantee specific rankings, leads, revenue or returns.</p>

      <h2>Intellectual property</h2>
      <p>All content on this site, including text, graphics, logos and design, is the property of {siteConfig.name} or its licensors and is protected by applicable intellectual-property laws. You may not reproduce it without permission.</p>

      <h2>Third-party links</h2>
      <p>This site may link to third-party websites. We are not responsible for the content or practices of those sites.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, {siteConfig.name} is not liable for any indirect, incidental or consequential damages arising from your use of this site or reliance on its content or tools.</p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.</p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
    </LegalLayout>
  );
}
