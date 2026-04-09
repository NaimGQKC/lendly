"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, ArrowRightLeft, Package } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LoanItem {
  id: string;
  name: string;
  imageUrl: string | null;
  owner: { id: string; name: string; email: string; image: string | null };
}

interface LoanBorrower {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface LoanData {
  id: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  depositStatus: string;
  item: LoanItem;
  borrower: LoanBorrower;
}

interface MyLoansViewProps {
  borrowedLoans: LoanData[];
  lentLoans: LoanData[];
}

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
  PENDING: { variant: "outline", label: "Deposit Pending" },
  COLLECTED: { variant: "default", label: "Deposit Held" },
  RETURNED: { variant: "secondary", label: "Deposit Returned" },
  CLAIMED: { variant: "destructive", label: "Deposit Claimed" },
};

function formatRelativeDate(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

function LoanCard({
  loan,
  counterpartyLabel,
  counterpartyName,
}: {
  loan: LoanData;
  counterpartyLabel: string;
  counterpartyName: string;
}) {
  const status = statusConfig[loan.status] ?? statusConfig.ACTIVE;
  const deposit = depositConfig[loan.depositStatus] ?? depositConfig.PENDING;
  const isOverdue = loan.status === "OVERDUE";
  const isDisputed = loan.status === "DISPUTED";

  return (
    <Card
      className={`transition-colors ${
        isOverdue
          ? "border-destructive/40 bg-destructive/5"
          : isDisputed
            ? "border-amber-400/40 bg-amber-50"
            : ""
      }`}
    >
      <CardContent className="flex gap-4 p-4">
        {/* Item image */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {loan.item.imageUrl ? (
            <Image
              src={loan.item.imageUrl}
              alt={loan.item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-sm font-semibold leading-tight truncate">
              {loan.item.name}
            </h3>
            <div className="flex flex-shrink-0 gap-1.5">
              <Badge
                variant={status.variant}
                className={`text-[10px] px-1.5 py-0 ${
                  loan.status === "ACTIVE"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : loan.status === "OVERDUE"
                      ? ""
                      : loan.status === "DISPUTED"
                        ? "border-amber-400 text-amber-700 bg-amber-50"
                        : ""
                }`}
              >
                {status.label}
              </Badge>
              <Badge
                variant={deposit.variant}
                className="text-[10px] px-1.5 py-0"
              >
                {deposit.label}
              </Badge>
            </div>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {counterpartyLabel}:{" "}
            <span className="font-medium text-foreground">
              {counterpartyName}
            </span>
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Checked out {formatRelativeDate(loan.checkoutDate)}
            </span>
            <span
              className={
                isOverdue ? "font-semibold text-destructive" : ""
              }
            >
              {loan.returnDate
                ? `Returned ${formatRelativeDate(loan.returnDate)}`
                : `Due ${formatRelativeDate(loan.dueDate)}`}
            </span>
          </div>

          {isOverdue && !loan.returnDate && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-destructive">
              <AlertTriangle className="h-3 w-3" />
              This item is overdue
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ type }: { type: "borrowed" | "lent" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
      <ArrowRightLeft className="mb-4 h-10 w-10 text-muted-foreground/40" />
      <h3 className="font-heading text-base font-semibold">
        {type === "borrowed" ? "No borrowed items" : "No lent items"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {type === "borrowed"
          ? "Browse the catalog to find items to borrow"
          : "List an item to start lending to your community"}
      </p>
    </div>
  );
}

export function MyLoansView({ borrowedLoans, lentLoans }: MyLoansViewProps) {
  return (
    <Tabs defaultValue="borrowed" className="w-full">
      <TabsList className="mb-6 w-full sm:w-auto">
        <TabsTrigger value="borrowed" className="gap-1.5">
          Borrowed
          {borrowedLoans.length > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {borrowedLoans.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="lent" className="gap-1.5">
          Lent Out
          {lentLoans.length > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {lentLoans.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="borrowed">
        {borrowedLoans.length > 0 ? (
          <div className="space-y-3">
            {borrowedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                counterpartyLabel="Owner"
                counterpartyName={loan.item.owner.name}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="borrowed" />
        )}
      </TabsContent>

      <TabsContent value="lent">
        {lentLoans.length > 0 ? (
          <div className="space-y-3">
            {lentLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                counterpartyLabel="Borrower"
                counterpartyName={loan.borrower.name}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="lent" />
        )}
      </TabsContent>
    </Tabs>
  );
}
