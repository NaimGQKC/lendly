import type { Item, Loan, User } from "@/lib/generated/prisma/client";

export type Role = "MEMBER" | "ADMIN";

export type Category =
  | "TOOLS"
  | "KITCHEN"
  | "ELECTRONICS"
  | "OUTDOOR"
  | "GAMES"
  | "MUSIC"
  | "SPORTS"
  | "BABY_KIDS"
  | "CLEANING"
  | "GARDEN"
  | "OTHER";

export type Condition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "WORN";

export type ItemStatus = "AVAILABLE" | "CHECKED_OUT" | "NEEDS_REPAIR" | "REMOVED";

export type LoanStatus = "ACTIVE" | "RETURNED" | "OVERDUE" | "DISPUTED";

export type DepositStatus = "PENDING" | "COLLECTED" | "RETURNED" | "CLAIMED";

export type ReturnCondition = "GOOD" | "DAMAGED" | "MISSING_PARTS";

export type ItemWithOwner = Item & {
  owner: Pick<User, "id" | "name" | "email" | "image" | "createdAt">;
};

export type LoanWithDetails = Loan & {
  item: Item & { owner: Pick<User, "id" | "name" | "email" | "image"> };
  borrower: Pick<User, "id" | "name" | "email" | "image">;
  approvedBy: Pick<User, "id" | "name"> | null;
};

export interface ConditionReportFinding {
  area: string;
  status: "good" | "damaged" | "missing";
  detail: string;
}

export interface ConditionReport {
  summary: string;
  findings: ConditionReportFinding[];
  overallCondition: string;
  recommendation: string;
  suggestedClaimAmount: number;
  reasoning: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "TOOLS", label: "Tools" },
  { value: "KITCHEN", label: "Kitchen" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "GAMES", label: "Games" },
  { value: "MUSIC", label: "Music" },
  { value: "SPORTS", label: "Sports" },
  { value: "BABY_KIDS", label: "Baby & Kids" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "GARDEN", label: "Garden" },
  { value: "OTHER", label: "Other" },
];

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "EXCELLENT", label: "Excellent" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "WORN", label: "Worn" },
];
