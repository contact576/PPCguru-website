import type { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your personal information, in line with Canada's PIPEDA.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 2026">
      <p>{siteConfig.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and is committed to protecting your personal information in accordance with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws. This policy explains what we collect, why, and your choices.</p>

      <h2>Information we collect</h2>
      <p>We collect information you provide directly — such as your name, email, phone number, business name and the details you include in our contact or audit forms. We also collect limited technical information automatically, such as your IP address, device and browser type, and how you interact with our site, through privacy-respecting analytics and cookies.</p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your enquiries and provide the free audit or services you request;</li>
        <li>To communicate with you about your project and our services;</li>
        <li>To improve our website and understand how it is used;</li>
        <li>To meet legal, regulatory and contractual obligations.</li>
      </ul>

      <h2>Legal basis &amp; consent</h2>
      <p>We collect and use your personal information with your consent, which you provide by submitting a form or otherwise contacting us. You may withdraw consent at any time, subject to legal or contractual restrictions, by contacting us using the details below.</p>

      <h2 id="cookies">Cookies &amp; analytics</h2>
      <p>We use cookies and similar technologies to operate the site and measure performance. You can control cookies through your browser settings. Where we run advertising pixels (e.g. Google or Meta), they may set cookies to measure ad performance; you can opt out via your ad-platform and browser settings.</p>

      <h2>Sharing your information</h2>
      <p>We do not sell your personal information. We may share it with trusted service providers (such as email delivery, CRM and analytics vendors) who process it on our behalf under appropriate safeguards, or where required by law.</p>

      <h2>Data retention &amp; security</h2>
      <p>We retain personal information only as long as necessary for the purposes described or as required by law, and we use reasonable administrative, technical and physical safeguards to protect it.</p>

      <h2>Your rights</h2>
      <p>Subject to applicable law, you may request access to, correction of, or deletion of your personal information. To make a request, contact us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>

      <h2>Contact us</h2>
      <p>Questions about this policy or our privacy practices can be directed to {siteConfig.name} at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>, based in {siteConfig.contact.addressLocality}, {siteConfig.contact.addressRegion}, Canada.</p>
    </LegalLayout>
  );
}
