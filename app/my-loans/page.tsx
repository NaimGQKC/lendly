import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MyLoansView } from "@/components/my-loans-view";

export default async function MyLoansPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [borrowedLoans, lentLoans] = await Promise.all([
    prisma.loan.findMany({
      where: { borrowerId: userId },
      include: {
        item: {
          include: {
            owner: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        borrower: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.loan.findMany({
      where: { item: { ownerId: userId } },
      include: {
        item: {
          include: {
            owner: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        borrower: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Serialize dates for client component
  const serialize = (loans: typeof borrowedLoans) =>
    loans.map((loan: (typeof borrowedLoans)[number]) => ({
      id: loan.id,
      checkoutDate: loan.checkoutDate.toISOString(),
      dueDate: loan.dueDate.toISOString(),
      returnDate: loan.returnDate?.toISOString() ?? null,
      status: loan.status,
      depositStatus: loan.depositStatus,
      item: {
        id: loan.item.id,
        name: loan.item.name,
        imageUrl: loan.item.imageUrl,
        owner: loan.item.owner,
      },
      borrower: loan.borrower,
    }));

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            My Loans
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track items you&apos;ve borrowed and lent out
          </p>
        </div>

        <MyLoansView
          borrowedLoans={serialize(borrowedLoans)}
          lentLoans={serialize(lentLoans)}
        />
      </div>
    </div>
  );
}
