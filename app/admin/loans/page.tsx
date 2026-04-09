import { prisma } from "@/lib/prisma";
import { AdminLoansView } from "@/components/admin-loans-view";

export default async function AdminLoansPage() {
  const loans = await prisma.loan.findMany({
    orderBy: { createdAt: "desc" },
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
      approvedBy: {
        select: { id: true, name: true },
      },
    },
  });

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold mb-4">
        Loans Management
      </h2>
      <AdminLoansView loans={JSON.parse(JSON.stringify(loans))} />
    </div>
  );
}
