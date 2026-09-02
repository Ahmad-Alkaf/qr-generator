import { buildLlmsFullTxt } from "@/lib/llms";

// Static at build time. Regenerated whenever the content modules change.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
