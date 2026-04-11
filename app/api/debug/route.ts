export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Test 1: raw libsql connection
  try {
    const { createClient } = require("@libsql/client");
    const client = createClient({ url: tursoUrl, authToken });
    const result = await client.execute("SELECT 1 as test");
    const rawOk = result.rows[0]?.test === 1;

    // Test 2: Prisma with adapter
    try {
      const { PrismaLibSql } = require("@prisma/adapter-libsql");
      const { PrismaClient } = require("@/lib/generated/prisma/client");
      const adapter = new PrismaLibSql({ url: tursoUrl, authToken });
      const prisma = new PrismaClient({ adapter });
      const count = await prisma.user.count();
      return Response.json({ rawOk, prismaOk: true, userCount: count });
    } catch (e: unknown) {
      const err = e as Error;
      return Response.json({ rawOk, prismaError: err.message?.slice(0, 200) }, { status: 500 });
    }
  } catch (e: unknown) {
    const err = e as Error;
    return Response.json({ rawError: err.message?.slice(0, 200), tursoUrl: tursoUrl?.slice(0, 40) }, { status: 500 });
  }
}
