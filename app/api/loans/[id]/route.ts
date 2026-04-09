import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "ADMIN") {
    return Response.json({ error: "Forbidden — admin only" }, { status: 403 });
  }

  const { id } = await params;
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: { item: true },
  });

  if (!loan) {
    return Response.json({ error: "Loan not found" }, { status: 404 });
  }

  const body = await request.json();
  const { status, returnDate, returnCondition, depositStatus, notes, conditionReport, afterImageUrl } = body;

  const data: Record<string, unknown> = {};

  if (status !== undefined) data.status = status;
  if (returnDate !== undefined) data.returnDate = returnDate;
  if (returnCondition !== undefined) data.returnCondition = returnCondition;
  if (depositStatus !== undefined) data.depositStatus = depositStatus;
  if (notes !== undefined) data.notes = notes;
  if (conditionReport !== undefined) data.conditionReport = conditionReport;
  if (afterImageUrl !== undefined) data.afterImageUrl = afterImageUrl;

  // Handle status transitions
  if (status === "RETURNED") {
    data.returnDate = new Date().toISOString();

    // Set item status based on return condition
    const newItemStatus = returnCondition === "DAMAGED" || returnCondition === "MISSING_PARTS"
      ? "NEEDS_REPAIR"
      : "AVAILABLE";

    await prisma.item.update({
      where: { id: loan.itemId },
      data: { status: newItemStatus },
    });
  }

  // DISPUTED status — keep item status as-is

  const updated = await prisma.loan.update({
    where: { id },
    data,
  });

  return Response.json(updated);
}
