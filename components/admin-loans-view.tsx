"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Package } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReturnModal } from "@/components/return-modal";
import type { LoanWithDetails } from "@/lib/types";

const statusConfig: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  ACTIVE: { variant: "default", label: "Active" },
  RETURNED: { variant: "secondary", label: "Returned" },
  OVERDUE: { variant: "destructive", label: "Overdue" },
  DISPUTED: { variant: "outline", label: "Disputed" },
};

const depositConfig: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  PENDING: { variant: "outline", label: "Pending" },
  COLLECTED: { variant: "default", label: "Collected" },
  RETURNED: { variant: "secondary", label: "Returned" },
  CLAIMED: { variant: "destructive", label: "Claimed" },
};

type FilterTab = "all" | "active" | "overdue" | "returned" | "disputed";

function filterLoans(loans: LoanWithDetails[], tab: FilterTab) {
  if (tab === "all") return loans;
  const statusMap: Record<FilterTab, string> = {
    all: "",
    active: "ACTIVE",
    overdue: "OVERDUE",
    returned: "RETURNED",
    disputed: "DISPUTED",
  };
  return loans.filter((l) => l.status === statusMap[tab]);
}

export function AdminLoansView({ loans }: { loans: LoanWithDetails[] }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [returnLoan, setReturnLoan] = useState<LoanWithDetails | null>(null);

  const filtered = filterLoans(loans, activeTab);

  const counts = {
    all: loans.length,
    active: loans.filter((l) => l.status === "ACTIVE").length,
    overdue: loans.filter((l) => l.status === "OVERDUE").length,
    returned: loans.filter((l) => l.status === "RETURNED").length,
    disputed: loans.filter((l) => l.status === "DISPUTED").length,
  };

  return (
    <>
      <Tabs
        defaultValue="all"
        onValueChange={(val) => setActiveTab(val as FilterTab)}
      >
        <TabsList className="mb-4">
          {(
            [
              ["all", "All"],
              ["active", "Active"],
              ["overdue", "Overdue"],
              ["returned", "Returned"],
              ["disputed", "Disputed"],
            ] as const
          ).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
              {counts[value] > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-semibold text-primary">
                  {counts[value]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All tabs render the same table, filtered */}
        {(["all", "active", "overdue", "returned", "disputed"] as const).map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              <LoanTable
                loans={filterLoans(loans, tab)}
                onProcessReturn={setReturnLoan}
              />
            </TabsContent>
          )
        )}
      </Tabs>

      {returnLoan && (
        <ReturnModal
          loan={returnLoan}
          open={!!returnLoan}
          onOpenChange={(open) => {
            if (!open) setReturnLoan(null);
          }}
        />
      )}
    </>
  );
}

function LoanTable({
  loans,
  onProcessReturn,
}: {
  loans: LoanWithDetails[];
  onProcessReturn: (loan: LoanWithDetails) => void;
}) {
  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <Package className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No loans found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Borrower</TableHead>
          <TableHead>Checkout</TableHead>
          <TableHead>Due</TableHead>
          <TableHead>Returned</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deposit</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => {
          const status =
            statusConfig[loan.status] ?? statusConfig.ACTIVE;
          const deposit =
            depositConfig[loan.depositStatus] ?? depositConfig.PENDING;
          const isActionable =
            loan.status === "ACTIVE" || loan.status === "OVERDUE";

          return (
            <TableRow key={loan.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {loan.item.imageUrl ? (
                      <Image
                        src={loan.item.imageUrl}
                        alt={loan.item.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="size-3.5 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium truncate max-w-[160px]">
                    {loan.item.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {loan.borrower.name}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(loan.checkoutDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(loan.dueDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {loan.returnDate
                  ? format(new Date(loan.returnDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={status.variant}
                  className={
                    loan.status === "ACTIVE"
                      ? "bg-green-600 text-white"
                      : loan.status === "DISPUTED"
                        ? "border-amber-400 text-amber-700 bg-amber-50"
                        : ""
                  }
                >
                  {status.label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={deposit.variant}>{deposit.label}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {isActionable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProcessReturn(loan)}
                  >
                    Process Return
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
