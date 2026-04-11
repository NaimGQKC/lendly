export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Test with @libsql/client/web (HTTP transport, works on serverless)
  try {
    const { createClient } = require("@libsql/client/web");
    const client = createClient({ url: tursoUrl!, authToken });
    const result = await client.execute("SELECT 1 as test");
    return Response.json({ webClientOk: true, rows: result.rows });
  } catch (e: unknown) {
    const err = e as Error;
    return Response.json({ webClientError: err.message?.slice(0, 300) }, { status: 500 });
  }
}
