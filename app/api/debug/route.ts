export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || "NOT_SET";
  const authToken = process.env.TURSO_AUTH_TOKEN || "NOT_SET";

  // Dump exact URL for debugging
  return Response.json({
    tursoUrl,
    tursoUrlLength: tursoUrl.length,
    tursoUrlCharCodes: Array.from(tursoUrl.slice(0, 10)).map(c => c.charCodeAt(0)),
    hasAuthToken: authToken !== "NOT_SET",
    authTokenLength: authToken.length,
  });
}
