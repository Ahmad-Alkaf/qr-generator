import { serializeJsonLd } from "@/lib/seo";

/** Renders one schema.org JSON-LD script tag. Pass the output of jsonLdGraph(). */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
