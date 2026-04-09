import type { ConditionReport } from "@/lib/types";

const MOCK_REPORTS: Record<string, ConditionReport> = {
  GOOD: {
    summary:
      "Item returned in condition consistent with normal use. No significant wear or damage detected beyond expected levels.",
    findings: [
      {
        area: "Overall body/housing",
        status: "good",
        detail: "Minor surface marks consistent with normal handling, no structural damage",
      },
      {
        area: "Functional components",
        status: "good",
        detail: "All moving parts operate as expected, no degradation noted",
      },
      {
        area: "Accessories/attachments",
        status: "good",
        detail: "All included accessories present and accounted for",
      },
      {
        area: "Cosmetic condition",
        status: "good",
        detail: "Matches before-photo within normal use expectations",
      },
    ],
    overallCondition: "good",
    recommendation: "FULL_RETURN",
    suggestedClaimAmount: 0,
    reasoning:
      "Item is in expected condition for its loan period. Recommend full deposit return. No further action needed.",
  },
  DAMAGED: {
    summary:
      "Item returned with visible damage inconsistent with normal wear. Condition has degraded beyond expected levels for the loan period.",
    findings: [
      {
        area: "Exterior housing",
        status: "damaged",
        detail: "Deep scratch on left side, approximately 4 inches, exposing underlying material",
      },
      {
        area: "Primary function",
        status: "good",
        detail: "Core functionality intact — item still operates correctly",
      },
      {
        area: "Accessories",
        status: "missing",
        detail: "Carrying case / storage container not returned with item",
      },
      {
        area: "Power/battery",
        status: "good",
        detail: "Battery holds charge, electrical components test normal",
      },
    ],
    overallCondition: "damaged",
    recommendation: "PARTIAL_CLAIM",
    suggestedClaimAmount: 85,
    reasoning:
      "Surface damage reduces item value but does not affect functionality. Missing storage case requires replacement (~$35). Combined damage estimate: $85. Recommend partial deposit claim and return remainder to borrower.",
  },
  MISSING_PARTS: {
    summary:
      "Item returned incomplete. One or more components or accessories are missing from the original set.",
    findings: [
      {
        area: "Main item",
        status: "good",
        detail: "Primary item present and functional",
      },
      {
        area: "Attachment set",
        status: "missing",
        detail: "3 of 12 included attachments not returned",
      },
      {
        area: "Storage/case",
        status: "good",
        detail: "Original case returned in acceptable condition",
      },
      {
        area: "Documentation",
        status: "missing",
        detail: "Instruction manual not returned (minor)",
      },
    ],
    overallCondition: "missing_parts",
    recommendation: "PARTIAL_CLAIM",
    suggestedClaimAmount: 45,
    reasoning:
      "Missing attachments can be replaced individually for approximately $12 each ($36 total). Missing manual is negligible ($2 online). Suggest claiming $45 to cover replacements plus administrative handling. Item can return to circulation once parts are replaced.",
  },
};

export function generateConditionReport(condition: string): ConditionReport {
  const key = condition.toUpperCase();
  return MOCK_REPORTS[key] ?? MOCK_REPORTS["GOOD"];
}
