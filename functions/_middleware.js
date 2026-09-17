/* Canonical host redirect: www.openwfa.com -> openwfa.com (301, path + query kept).
 * Also keeps the raw *.pages.dev domain (production alias + every preview/branch
 * deployment) out of search entirely — it serves the same bytes as openwfa.com and
 * would otherwise depend on the canonical tag alone to avoid being indexed.
 * Runs ahead of static assets and /api/*, so it holds regardless of which Cloudflare
 * account's zone-level Redirect Rules are reachable — no dashboard/DNS access needed.
 */
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  if (url.hostname === "www.openwfa.com") {
    url.hostname = "openwfa.com";
    return Response.redirect(url.toString(), 301);
  }
  const response = await next();
  if (url.hostname.endsWith(".pages.dev")) {
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex");
    return new Response(response.body, { status: response.status, headers });
  }
  return response;
}
