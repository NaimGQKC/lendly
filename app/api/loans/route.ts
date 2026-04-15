import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (role !== "ADMIN") {
    where.OR = [
      { borrowerId: session.user.id },
      { item: { ownerId: session.user.id } },
    ];
  }

  const loans = await prisma.loan.findMany({
    where,
    include: {
      item: {
        include: {
          owner: { select: { id: true, name: true, email: true, image: true } },
        },
      },
      borrower: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(loans);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { itemId, notes, beforeImageUrl } = body;

  if (!itemId) {
    return Response.json({ error: "itemId is required" }, { status: 400 });
  }

  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.status !== "AVAILABLE") {
    return Response.json({ error: "Item is not available for borrowing" }, { status: 400 });
  }

  if (item.ownerId === session.user.id) {
    return Response.json({ error: "You cannot borrow your own item" }, { status: 400 });
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + item.maxLoanDays);

  const loan = await prisma.loan.create({
    data: {
      itemId,
      borrowerId: session.user.id,
      dueDate,
      notes: notes || null,
      beforeImageUrl: beforeImageUrl || null,
    },
  });

  await prisma.item.update({
    where: { id: itemId },
    data: { status: "CHECKED_OUT" },
  });

  return Response.json(loan, { status: 201 });
}
