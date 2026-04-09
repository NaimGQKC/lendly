import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findJobMatches } from "@/lib/ai-mocks/job-search";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { query } = body;

  if (!query || typeof query !== "string") {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  const jobMatch = findJobMatches(query);

  // Also search items in the database
  const items = await prisma.item.findMany({
    where: {
      status: { not: "REMOVED" },
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ jobMatch, items });
}
