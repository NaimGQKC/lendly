import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, image: true, createdAt: true } },
      _count: { select: { loans: true } },
    },
  });

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  return Response.json(item);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  const role = (session.user as any).role;
  if (item.ownerId !== session.user.id && role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, category, condition, imageUrl, replacementValue, depositAmount, maxLoanDays, status, careInstructions } = body;

  const updated = await prisma.item.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(condition !== undefined && { condition }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(replacementValue !== undefined && { replacementValue: Number(replacementValue) }),
      ...(depositAmount !== undefined && { depositAmount: Number(depositAmount) }),
      ...(maxLoanDays !== undefined && { maxLoanDays: Number(maxLoanDays) }),
      ...(status !== undefined && { status }),
      ...(careInstructions !== undefined && { careInstructions }),
    },
  });

  return Response.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  const role = (session.user as any).role;
  if (item.ownerId !== session.user.id && role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.item.update({
    where: { id },
    data: { status: "REMOVED" },
  });

  return Response.json(updated);
}
