export const runtime = "edge";

export function GET() {
  const body = `Contact: mailto:security@stemtechlab.com
Expires: 2027-04-20T00:00:00.000Z
Preferred-Languages: en, ar
Canonical: https://www.stemtechlab.com/.well-known/security.txt
Policy: https://www.stemtechlab.com/en/privacy
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
