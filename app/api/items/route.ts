import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: { not: "REMOVED" },
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
        _count: { select: { loans: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.item.count({ where }),
  ]);

  return Response.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "MEMBER" && role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, category, condition, imageUrl, replacementValue, depositAmount, maxLoanDays, careInstructions } = body;

  if (!name || !description || !category || !condition || replacementValue == null || depositAmount == null) {
    return Response.json({ error: "Missing required fields: name, description, category, condition, replacementValue, depositAmount" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: {
      name,
      description,
      category,
      condition,
      imageUrl: imageUrl || null,
      replacementValue: Number(replacementValue),
      depositAmount: Number(depositAmount),
      maxLoanDays: maxLoanDays ? Number(maxLoanDays) : 7,
      careInstructions: careInstructions || null,
      ownerId: session.user.id,
    },
  });

  return Response.json(item, { status: 201 });
}
