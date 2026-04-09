import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Activity,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

const unmetDemand = [
  {
    term: "pressure washer",
    searches: 12,
    demand: "High demand",
    variant: "destructive" as const,
  },
  {
    term: "sewing machine",
    searches: 8,
    demand: "Moderate demand",
    variant: "default" as const,
  },
  {
    term: "kayak",
    searches: 5,
    demand: "Seasonal",
    variant: "secondary" as const,
  },
];

const collectionHealth = [
  {
    label: "Most Borrowed Item",
    value: "DeWalt Cordless Drill",
    detail: "14 checkouts this quarter",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    label: "Least Utilized",
    value: "Bread Maker",
    detail: "0 checkouts in 90 days",
    icon: TrendingDown,
    color: "text-amber-500",
  },
  {
    label: "Highest Demand Category",
    value: "Tools",
    detail: "42% of all borrows",
    icon: Star,
    color: "text-primary",
  },
];

export default async function AdminInsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-semibold mb-1">
          AI Insights
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Data-driven recommendations for your lending library
        </p>
      </div>

      {/* Section 1: Unmet Demand */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Search className="size-4" />
          </div>
          <h3 className="font-heading text-base font-semibold">
            Unmet Demand
          </h3>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Search Term</TableHead>
                  <TableHead>Searches</TableHead>
                  <TableHead>Demand Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unmetDemand.map((item) => (
                  <TableRow key={item.term}>
                    <TableCell className="font-medium">
                      &ldquo;{item.term}&rdquo;
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.searches} searches
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.variant}>{item.demand}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Collection Health */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Activity className="size-4" />
          </div>
          <h3 className="font-heading text-base font-semibold">
            Collection Health
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {collectionHealth.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <stat.icon className={`size-4 ${stat.color}`} />
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
                <p className="font-heading text-base font-semibold">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: AI Recommendation */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Lightbulb className="size-4" />
          </div>
          <h3 className="font-heading text-base font-semibold">
            AI Recommendation
          </h3>
        </div>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed text-foreground">
              Based on search patterns and borrowing trends, we recommend
              prioritizing the acquisition of a{" "}
              <strong>pressure washer</strong> and a{" "}
              <strong>sewing machine</strong>. These two items account for 20
              unmatched searches in the past month, representing the highest
              unmet demand in your community. A pressure washer would serve the
              seasonal spring cleaning surge, while a sewing machine addresses
              year-round demand from the growing maker community. Consider
              reaching out to members who frequently borrow tools — they may be
              willing to donate or lend these items to the library. Additionally,
              the <strong>Bread Maker</strong> has seen zero activity in 90
              days and may be a candidate for rotation or featured promotion to
              increase utilization.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
