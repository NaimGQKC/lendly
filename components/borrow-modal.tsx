"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Shield, Loader2 } from "lucide-react";

interface BorrowModalProps {
  item: {
    id: string;
    name: string;
    depositAmount: number;
    maxLoanDays: number;
  };
}

export function BorrowModal({ item }: BorrowModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dueDate = addDays(new Date(), item.maxLoanDays);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to borrow item");
      }

      toast.success("Item borrowed!", {
        description: `You've borrowed ${item.name}. Due back by ${format(dueDate, "MMM d, yyyy")}.`,
      });
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Could not borrow item", {
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        Borrow This Item
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Borrow</DialogTitle>
            <DialogDescription>
              Review the details below before borrowing this item.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <h3 className="font-heading text-lg font-semibold">
              {item.name}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Shield className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Deposit Required
                  </p>
                  <p className="text-sm font-semibold">
                    ${item.depositAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-semibold">
                    {format(dueDate, "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.maxLoanDays} days from today
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Borrowing..." : "Confirm Borrow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
