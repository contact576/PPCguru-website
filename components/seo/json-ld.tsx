import { organizationSchema, websiteSchema, graphSchema } from "@/lib/seo";

/** Renders a JSON-LD <script> block. Use for any schema.org object. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // schema is build-time/static data, safe to inject
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
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
