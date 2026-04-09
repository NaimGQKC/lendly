"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface JobMatch {
  title: string;
  explanation: string;
  itemNames: string[];
}

interface MatchedItem {
  id: string;
  name: string;
  imageUrl: string | null;
  status: string;
  depositAmount: number;
  category: string;
}

interface JobSearchResponse {
  jobMatch: JobMatch | null;
  items: MatchedItem[];
}

interface JobSearchResultsProps {
  query: string;
  allItems: Array<{
    id: string;
    name: string;
    imageUrl: string | null;
    status: string;
    depositAmount: number;
    category: string;
  }>;
}

export function JobSearchResults({ query, allItems }: JobSearchResultsProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<JobSearchResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/job-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (!res.ok) {
          setResult(null);
          return;
        }
        const data: JobSearchResponse = await res.json();
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setResult(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) {
    return (
      <div className="mb-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-64 mb-3" />
            <div className="flex gap-3 overflow-x-auto">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-40 shrink-0 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result?.jobMatch) return null;

  const { jobMatch } = result;

  // Match items from the API results or from the page items by name
  const matchedItems: MatchedItem[] = [];
  for (const itemName of jobMatch.itemNames) {
    const nameLower = itemName.toLowerCase();
    // Try API-returned items first, then page items
    const apiItem = result.items.find(
      (i) => i.name.toLowerCase().includes(nameLower) || nameLower.includes(i.name.toLowerCase())
    );
    const pageItem = allItems.find(
      (i) => i.name.toLowerCase().includes(nameLower) || nameLower.includes(i.name.toLowerCase())
    );
    const found = apiItem || pageItem;
    if (found && !matchedItems.some((m) => m.id === found.id)) {
      matchedItems.push(found);
    }
  }

  if (matchedItems.length === 0) return null;

  return (
    <div className="mb-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="size-5 text-primary" />
            <Badge variant="secondary" className="text-xs font-medium">
              AI Suggestion
            </Badge>
          </div>
          <h3 className="font-heading text-lg font-semibold mt-2 mb-1">
            {jobMatch.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {jobMatch.explanation}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {matchedItems.map((item) => (
              <Link
                key={item.id}
                href={`/catalog/${item.id}`}
                className="group shrink-0"
              >
                <div className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                    <span className="font-heading text-sm font-semibold text-primary">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${item.depositAmount.toFixed(2)} deposit
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
