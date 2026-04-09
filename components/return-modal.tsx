"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Camera, Package, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConditionReportView } from "@/components/condition-report";
import type { LoanWithDetails, ConditionReport } from "@/lib/types";

interface ReturnModalProps {
  loan: LoanWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const progressMessages = [
  "Comparing images...",
  "Analyzing condition...",
  "Generating report...",
];

export function ReturnModal({ loan, open, onOpenChange }: ReturnModalProps) {
  const router = useRouter();
  const [condition, setCondition] = useState<string | null>("");
  const [notes, setNotes] = useState("");
  const [afterUploaded, setAfterUploaded] = useState(false);
  const [report, setReport] = useState<ConditionReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [processing, setProcessing] = useState(false);

  async function handleGenerateReport() {
    if (!condition) {
      toast.error("Please select a return condition first");
      return;
    }
    setGenerating(true);
    setProgressIdx(0);
    setReport(null);

    // Cycle through progress messages
    const interval = setInterval(() => {
      setProgressIdx((prev) =>
        prev < progressMessages.length - 1 ? prev + 1 : prev
      );
    }, 700);

    try {
      const res = await fetch("/api/ai/condition-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition: condition ?? "" }),
      });
      if (!res.ok) throw new Error("Failed to generate report");
      const data: ConditionReport = await res.json();
      setReport(data);
    } catch {
      toast.error("Could not generate condition report");
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  }

  async function handleAction(depositAction: "RETURNED" | "CLAIMED", claimAmount?: number) {
    setProcessing(true);
    try {
      const body: Record<string, unknown> = {
        status: "RETURNED",
        returnCondition: condition ?? "",
        depositStatus: depositAction,
        notes,
        afterImageUrl: loan.item.imageUrl ?? null,
      };
      if (report) {
        body.conditionReport = JSON.stringify(report);
      }

      const res = await fetch(`/api/loans/${loan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to process return");

      toast.success("Return processed", {
        description:
          depositAction === "RETURNED"
            ? "Full deposit has been released."
            : `$${(claimAmount ?? 0).toFixed(2)} claimed from deposit.`,
      });
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to process return");
    } finally {
      setProcessing(false);
    }
  }

  const recommendation = report?.recommendation?.toUpperCase() ?? "";
  const isFullReturn = recommendation.includes("FULL_RETURN") || recommendation.includes("FULL RETURN");
  const isPartialClaim = recommendation.includes("PARTIAL_CLAIM") || recommendation.includes("PARTIAL");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Process Return</DialogTitle>
          <DialogDescription>
            Review and process the return of {loan.item.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item info */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
              {loan.item.imageUrl ? (
                <img
                  src={loan.item.imageUrl}
                  alt={loan.item.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="size-5 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <div>
              <p className="font-heading text-sm font-semibold">
                {loan.item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Borrowed by {loan.borrower.name}
              </p>
            </div>
          </div>

          {/* Before / After photos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Before (checkout)
              </p>
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                {loan.item.imageUrl ? (
                  <img
                    src={loan.item.imageUrl}
                    alt="Before"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="size-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                After (return)
              </p>
              <div
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted transition-colors hover:border-primary/50"
                onClick={() => setAfterUploaded(true)}
              >
                {afterUploaded && loan.item.imageUrl ? (
                  <img
                    src={loan.item.imageUrl}
                    alt="After"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground/50">
                    <Camera className="size-6" />
                    <span className="text-[10px]">Click to upload</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Condition select */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Return Condition
            </label>
            <Select value={condition} onValueChange={(val) => setCondition(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="DAMAGED">Damaged</SelectItem>
                <SelectItem value="MISSING_PARTS">Missing Parts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium">Notes</label>
            <Textarea
              placeholder="Optional notes about the return..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Separator />

          {/* AI Report */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerateReport}
            disabled={generating || !condition || condition === ""}
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {generating
              ? progressMessages[progressIdx]
              : "Generate AI Condition Report"}
          </Button>

          {report && <ConditionReportView report={report} />}
        </div>

        {/* Action buttons */}
        {report && (
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {(isFullReturn || !isPartialClaim) && (
              <>
                <Button
                  className="w-full"
                  onClick={() => handleAction("RETURNED")}
                  disabled={processing}
                >
                  {processing && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Release Full Deposit
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    handleAction("CLAIMED", report.suggestedClaimAmount)
                  }
                  disabled={processing}
                >
                  Override: Claim Partial
                </Button>
              </>
            )}
            {isPartialClaim && (
              <>
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAction("CLAIMED", report.suggestedClaimAmount)
                  }
                  disabled={processing}
                >
                  {processing && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Claim ${report.suggestedClaimAmount.toFixed(2)} and Return
                  Remainder
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAction("RETURNED")}
                  disabled={processing}
                >
                  Override: Release Full Deposit
                </Button>
              </>
            )}
          </DialogFooter>
        )}

        {/* Fallback if no report yet but condition selected */}
        {!report && condition && (
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAction("RETURNED")}
              disabled={processing}
            >
              {processing && <Loader2 className="size-4 animate-spin" />}
              Return Without Report
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
