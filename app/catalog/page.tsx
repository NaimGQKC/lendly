import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/types";
import { isJobQuery } from "@/lib/ai-mocks/job-search";
import { ItemCard } from "@/components/item-card";
import { JobSearchResults } from "@/components/job-search-results";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";

const PAGE_SIZE = 12;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const { search, category, status, page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const availableOnly = status === "available";

  // Build Prisma where clause
  const where: Record<string, unknown> = {
    status: availableOnly ? "AVAILABLE" : { not: "REMOVED" },
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    where.category = category;
  }

  // Fetch items + count in parallel
  const [items, totalCount] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, image: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.item.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const showAiSuggestion = search && isJobQuery(search);

  // Build query string helper
  function buildQuery(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { search, category, status, page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "undefined") params.set(k, v);
    }
    return params.toString();
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Browse Catalog
          </h1>
          <p className="mt-1 text-muted-foreground">
            Find items to borrow from your community
          </p>
        </div>

        {/* Search bar */}
        <form method="GET" action="/catalog" className="mb-6">
          {/* Preserve other filters */}
          {category && <input type="hidden" name="category" value={category} />}
          {status && <input type="hidden" name="status" value={status} />}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                name="search"
                placeholder="Search items or describe a job (e.g. 'refinish hardwood floors')..."
                defaultValue={search || ""}
                className="h-10 pl-9"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </div>
        </form>

        {/* Filter row */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Category filters */}
          <Link
            href={`/catalog?${buildQuery({ category: undefined, page: undefined })}`}
            className="inline-block"
          >
            <Badge
              variant={!category ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
            >
              All
            </Badge>
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/catalog?${buildQuery({ category: cat.value, page: undefined })}`}
              className="inline-block"
            >
              <Badge
                variant={category === cat.value ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
              >
                {cat.label}
              </Badge>
            </Link>
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Available only toggle */}
          <Link
            href={`/catalog?${buildQuery({
              status: availableOnly ? undefined : "available",
              page: undefined,
            })}`}
          >
            <Badge
              variant={availableOnly ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
            >
              {availableOnly ? "✓ " : ""}Available only
            </Badge>
          </Link>
        </div>

        {/* AI Suggestion section */}
        {showAiSuggestion && (
          <JobSearchResults query={search} allItems={items} />
        )}

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "item" : "items"} found
          {search && (
            <>
              {" "}for &ldquo;{search}&rdquo;
            </>
          )}
        </div>

        {/* Item grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item: typeof items[number]) => (
              <ItemCard key={item.id} item={item} showOwner />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
            <PackageOpen className="mb-4 size-12 text-muted-foreground/50" />
            <h3 className="font-heading text-lg font-semibold">
              No items found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
            <Link href="/catalog">
              <Button variant="outline" className="mt-4">
                Clear all filters
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/catalog?${buildQuery({ page: String(currentPage - 1) })}`}
              >
                <Button variant="outline" size="sm">
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="size-4" />
                Previous
              </Button>
            )}

            <span className="px-3 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/catalog?${buildQuery({ page: String(currentPage + 1) })}`}
              >
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
