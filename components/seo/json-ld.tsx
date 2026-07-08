import { organizationSchema, websiteSchema, graphSchema } from "@/lib/seo";

/** Renders a JSON-LD <script> block. Use for any schema.org object. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify does NOT escape "<", so a value containing "</script>" (e.g. a
  // CMS-authored post title) would break out of the script tag. Escape the few
  // characters that matter inside a <script> context.
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** Sitewide Organization/ProfessionalService schema (rendered once in layout). */
export function OrganizationJsonLd() {
  return <JsonLd data={organizationSchema()} />;
}

/** Sitewide WebSite entity (rendered once in layout, alongside Organization). */
export function WebSiteJsonLd() {
  return <JsonLd data={websiteSchema()} />;
}

/** Preferred sitewide node-set — Organization + WebSite in one @graph (rendered once in layout). */
export function SiteGraphJsonLd() {
  return <JsonLd data={graphSchema()} />;
}
