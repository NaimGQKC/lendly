export async function GET() {
  try {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const hasToken = !!process.env.TURSO_AUTH_TOKEN;
    const dbUrl = process.env.DATABASE_URL;

    // Try connecting
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    return Response.json({ ok: true, userCount: count, tursoUrl: tursoUrl?.slice(0, 30), hasToken, dbUrl: dbUrl?.slice(0, 30) });
  } catch (e: unknown) {
    const err = e as Error;
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const hasToken = !!process.env.TURSO_AUTH_TOKEN;
    const dbUrl = process.env.DATABASE_URL;
    return Response.json(
      { error: err.message, tursoUrl: tursoUrl?.slice(0, 30), hasToken, dbUrl: dbUrl?.slice(0, 30) },
      { status: 500 }
    );
  }
}
