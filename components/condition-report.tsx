"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ConditionReport } from "@/lib/types";

function StatusIcon({ status }: { status: "good" | "damaged" | "missing" }) {
  if (status === "good") {
    return <span className="text-green-600 font-bold" aria-label="Good">&#10003;</span>;
  }
  if (status === "damaged") {
    return <span className="text-red-600 font-bold" aria-label="Damaged">&#10007;</span>;
  }
  return <span className="text-amber-500 font-bold" aria-label="Missing">&#9888;</span>;
}

export function ConditionReportView({ report }: { report: ConditionReport }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="space-y-3 p-4">
        <p className="font-heading text-sm font-bold">{report.summary}</p>

        <div className="space-y-2">
          {report.findings.map((finding, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <StatusIcon status={finding.status} />
              <div>
                <span className="font-medium">{finding.area}:</span>{" "}
                <span className="text-muted-foreground">{finding.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="rounded-md bg-background/80 p-2.5">
          <p className="text-xs font-semibold text-primary mb-1">
            Recommendation
          </p>
          <p className="text-sm font-medium">{report.recommendation}</p>
        </div>

        <p className="text-xs italic text-muted-foreground">
          {report.reasoning}
        </p>

        {report.suggestedClaimAmount > 0 && (
          <p className="text-sm font-semibold text-destructive">
            Suggested claim: ${report.suggestedClaimAmount.toFixed(2)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
