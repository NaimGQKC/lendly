import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ItemOwner {
  id: string;
  name: string;
  image: string | null;
}

interface ItemData {
  id: string;
  name: string;
  category: string;
  condition: string;
  status: string;
  imageUrl: string | null;
  depositAmount: number;
  owner?: ItemOwner;
}

interface ItemCardProps {
  item: ItemData;
  showOwner?: boolean;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  AVAILABLE: { color: "bg-green-500", label: "Available" },
  CHECKED_OUT: { color: "bg-amber-500", label: "Checked out" },
  NEEDS_REPAIR: { color: "bg-red-500", label: "Needs Repair" },
  REMOVED: { color: "bg-gray-400", label: "Removed" },
};

function conditionVariant(condition: string) {
  switch (condition) {
    case "NEW":
    case "EXCELLENT":
      return "default" as const;
    case "GOOD":
      return "secondary" as const;
    case "FAIR":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

function formatCondition(condition: string) {
  return condition.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ItemCard({ item, showOwner = false }: ItemCardProps) {
  const status = statusConfig[item.status] ?? statusConfig.AVAILABLE;

  return (
    <Link href={`/catalog/${item.id}`} className="group block">
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary to-accent/20">
              <span className="font-heading text-3xl font-semibold text-primary/30">
                {item.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Availability indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
            <span className={`size-2 rounded-full ${status.color}`} />
            {status.label}
          </div>
        </div>

        <CardContent className="space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{item.category}</Badge>
            <Badge variant={conditionVariant(item.condition)}>
              {formatCondition(item.condition)}
            </Badge>
          </div>

          {/* Name */}
          <h3 className="font-heading text-base font-semibold leading-tight">
            {item.name}
          </h3>

          {/* Deposit */}
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              ${item.depositAmount.toFixed(2)}
            </span>{" "}
            deposit
          </p>

          {/* Owner */}
          {showOwner && item.owner && (
            <div className="flex items-center gap-2 border-t pt-3">
              <Avatar size="sm">
                {item.owner.image && (
                  <AvatarImage
                    src={item.owner.image}
                    alt={item.owner.name}
                  />
                )}
                <AvatarFallback>
                  {item.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {item.owner.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
