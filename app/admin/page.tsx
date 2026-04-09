import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  BookOpen,
  AlertTriangle,
  Users,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";

export default async function AdminDashboardPage() {
  const now = new Date();

  const totalItems = await prisma.item.count();
  const activeLoans = await prisma.loan.count({ where: { status: "ACTIVE" } });
  const overdueLoans = await prisma.loan.findMany({
    where: { status: "OVERDUE" },
    include: {
      item: true,
      borrower: { select: { id: true, name: true, email: true } },
    },
  });
  const memberCount = await prisma.user.count();
  const recentLoans = await prisma.loan.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    include: {
      item: { select: { name: true, imageUrl: true } },
      borrower: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          description="Items in the library"
        />
        <StatCard
          title="Active Loans"
          value={activeLoans}
          icon={BookOpen}
          description="Currently checked out"
        />
        <StatCard
          title="Overdue"
          value={overdueLoans.length}
          icon={AlertTriangle}
          description="Need attention"
        />
        <StatCard
          title="Members"
          value={memberCount}
          icon={Users}
          description="Registered users"
        />
      </div>

      {/* Overdue loans alert */}
      {overdueLoans.length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3 text-destructive flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Overdue Loans ({overdueLoans.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {overdueLoans.map((loan: typeof overdueLoans[number]) => {
              const daysOverdue = differenceInDays(now, new Date(loan.dueDate));
              return (
                <Card
                  key={loan.id}
                  className="border-destructive/40 bg-destructive/5"
                >
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="font-heading text-sm font-semibold">
                        {loan.item.name}
                      </p>
                      <Badge variant="destructive">
                        {daysOverdue}d overdue
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Borrower:{" "}
                      <span className="font-medium text-foreground">
                        {loan.borrower.name}
                      </span>
                    </p>
                    <p className="text-xs text-destructive">
                      {loan.borrower.email}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent activity */}
      <section>
        <h2 className="font-heading text-lg font-semibold mb-3">
          Recent Activity
        </h2>
        <Card>
          <CardContent className="divide-y p-0">
            {recentLoans.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No loan activity yet.
              </p>
            )}
            {recentLoans.map((loan: typeof recentLoans[number]) => {
              const isReturned = loan.status === "RETURNED";
              return (
                <div
                  key={loan.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className={`rounded-full p-1.5 ${
                      isReturned
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {isReturned ? (
                      <RotateCcw className="size-3.5" />
                    ) : (
                      <ArrowRight className="size-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      <span className="font-medium">
                        {loan.borrower.name}
                      </span>{" "}
                      {isReturned ? "returned" : "borrowed"}{" "}
                      <span className="font-medium">{loan.item.name}</span>
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(loan.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="font-heading text-lg font-semibold mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/admin/loans" />}>
            <RotateCcw className="size-4" />
            Process Returns
          </Button>
          <Button variant="outline" render={<Link href="/admin/users" />}>
            <Users className="size-4" />
            Manage Users
          </Button>
        </div>
      </section>
    </div>
  );
}
