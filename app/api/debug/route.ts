export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    return Response.json({ ok: true, userCount: count });
  } catch (e: unknown) {
    const err = e as Error;
    return Response.json({ error: err.message?.slice(0, 300) }, { status: 500 });
  }
}
