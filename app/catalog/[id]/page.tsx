import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BorrowModal } from "@/components/borrow-modal";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  AlertTriangle,
  Wrench,
  Info,
} from "lucide-react";

const statusConfig: Record<
  string,
  { color: string; label: string }
> = {
  AVAILABLE: { color: "bg-green-500", label: "Available" },
  CHECKED_OUT: { color: "bg-amber-500", label: "Checked Out" },
  NEEDS_REPAIR: { color: "bg-red-500", label: "Needs Repair" },
  REMOVED: { color: "bg-gray-400", label: "Removed" },
};

const conditionConfig: Record<string, string> = {
  NEW: "New",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  WORN: "Worn",
};

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      },
    },
  });

  if (!item) notFound();

  const loanCount = await prisma.loan.count({
    where: { itemId: id },
  });

  // Get the active loan for due date info
  const activeLoan = item.status === "CHECKED_OUT"
    ? await prisma.loan.findFirst({
        where: { itemId: id, status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const status = statusConfig[item.status] ?? statusConfig.AVAILABLE;
  const isOwner = session?.user?.id === item.ownerId;
  const isLoggedIn = !!session?.user;
  const canBorrow =
    item.status === "AVAILABLE" && isLoggedIn && !isOwner;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/catalog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to catalog
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary to-accent/20">
                <span className="font-heading text-6xl font-semibold text-primary/30">
                  {item.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              <Badge variant="outline">
                {conditionConfig[item.condition] || item.condition}
              </Badge>
              <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium shadow-sm border">
                <span className={`size-2 rounded-full ${status.color}`} />
                {status.label}
              </div>
            </div>

            {/* Name */}
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {item.name}
            </h1>

            {/* Owner */}
            <div className="flex items-center gap-3">
              <Avatar>
                {item.owner.image && (
                  <AvatarImage
                    src={item.owner.image}
                    alt={item.owner.name}
                  />
                )}
                <AvatarFallback>
                  {item.owner.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{item.owner.name}</p>
                <p className="text-xs text-muted-foreground">
                  Member since{" "}
                  {format(new Date(item.owner.createdAt), "MMMM yyyy")}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Description
              </h2>
              <p className="text-sm leading-relaxed">{item.description}</p>
            </div>

            {/* Care instructions */}
            {item.careInstructions && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900">
                      Care Instructions
                    </h3>
                    <p className="mt-1 text-sm text-amber-800">
                      {item.careInstructions}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-2 p-3">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Replacement Value
                    </p>
                    <p className="text-sm font-semibold">
                      ${item.replacementValue.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-2 p-3">
                  <Shield className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Deposit Required
                    </p>
                    <p className="text-sm font-semibold">
                      ${item.depositAmount.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-2 p-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Max Loan Period
                    </p>
                    <p className="text-sm font-semibold">
                      {item.maxLoanDays} days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loan count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              Borrowed {loanCount} {loanCount === 1 ? "time" : "times"}
            </div>

            {/* Action section */}
            <div className="border-t pt-6">
              {isOwner ? (
                <Link href={`/items/${item.id}/edit`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Edit Listing
                  </Button>
                </Link>
              ) : item.status === "AVAILABLE" && isLoggedIn ? (
                <BorrowModal
                  item={{
                    id: item.id,
                    name: item.name,
                    depositAmount: item.depositAmount,
                    maxLoanDays: item.maxLoanDays,
                  }}
                />
              ) : item.status === "AVAILABLE" && !isLoggedIn ? (
                <Link href="/login">
                  <Button className="w-full sm:w-auto">
                    Sign In to Borrow
                  </Button>
                </Link>
              ) : item.status === "CHECKED_OUT" ? (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertTriangle className="size-4 shrink-0" />
                  Currently Borrowed
                  {activeLoan && (
                    <> &mdash; Due back {format(new Date(activeLoan.dueDate), "MMM d, yyyy")}</>
                  )}
                </div>
              ) : item.status === "NEEDS_REPAIR" ? (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  <Wrench className="size-4 shrink-0" />
                  Temporarily Unavailable
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
