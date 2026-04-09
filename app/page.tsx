import Link from "next/link";
import { Search, HandshakeIcon, RotateCcw, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/item-card";

async function getStats() {
  const [totalItems, totalUsers, activeLoans] = await Promise.all([
    prisma.item.count({ where: { status: { not: "REMOVED" } } }),
    prisma.user.count(),
    prisma.loan.count({ where: { status: "ACTIVE" } }),
  ]);
  return { totalItems, totalUsers, activeLoans };
}

async function getFeaturedItems() {
  return prisma.item.findMany({
    where: { status: "AVAILABLE" },
    include: { owner: { select: { id: true, name: true, image: true } } },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

const steps = [
  {
    icon: Search,
    title: "Browse",
    description:
      "Explore our catalog of shared items — from power tools to camping gear, kitchen gadgets to board games.",
  },
  {
    icon: HandshakeIcon,
    title: "Borrow",
    description:
      "Reserve what you need, put down a small deposit, and pick it up from your neighbour. Simple as that.",
  },
  {
    icon: RotateCcw,
    title: "Return",
    description:
      "Bring it back when you are done. Your deposit is returned, and the item is ready for the next person.",
  },
];

export default async function HomePage() {
  const [stats, featuredItems] = await Promise.all([
    getStats(),
    getFeaturedItems(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background px-4 py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Borrow anything.{" "}
            <span className="text-primary">Share everything.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Your neighbourhood library of things. Why buy when you can borrow?
            Tools, gadgets, gear, and more — shared between people who live
            near each other.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" render={<Link href="/catalog" />}>
              Browse Catalog
              <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/login" />}>
              Join the Library
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-card px-4 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-6">
          <span className="text-sm font-medium">
            <span className="font-heading text-lg font-bold text-primary">
              {stats.totalItems}
            </span>{" "}
            items available
          </span>
          <span className="hidden text-muted-foreground sm:inline">&middot;</span>
          <span className="text-sm font-medium">
            <span className="font-heading text-lg font-bold text-primary">
              {stats.totalUsers}
            </span>{" "}
            active members
          </span>
          <span className="hidden text-muted-foreground sm:inline">&middot;</span>
          <span className="text-sm font-medium">
            <span className="font-heading text-lg font-bold text-primary">
              {stats.activeLoans}
            </span>{" "}
            things borrowed this month
          </span>
        </div>
      </section>

      {/* Featured items */}
      {featuredItems.length > 0 && (
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Recently added
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fresh items from your neighbours, ready to borrow
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item: Awaited<ReturnType<typeof getFeaturedItems>>[number]) => (
                <ItemCard key={item.id} item={item} showOwner />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg" render={<Link href="/catalog" />}>
                View full catalog
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-secondary/30 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three simple steps to start sharing
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                  <step.icon className="size-6" />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </p>
                <h3 className="font-heading text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-xl sm:px-12">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Got stuff sitting in your garage?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
            Share what you are not using and help your neighbours save money.
            Listing an item takes less than a minute.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/catalog/new" />}
            >
              Share an Item
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              render={<Link href="/catalog" />}
            >
              Browse Catalog
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
