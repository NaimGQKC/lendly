import { prisma } from "@/lib/prisma";
import { AdminUsersView } from "@/components/admin-users-view";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      suspended: true,
      createdAt: true,
      _count: {
        select: {
          ownedItems: true,
          borrowedLoans: {
            where: { status: "ACTIVE" },
          },
        },
      },
    },
  });

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold mb-4">
        User Management
      </h2>
      <AdminUsersView users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
