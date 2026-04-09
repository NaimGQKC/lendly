"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, PenLine, Trash2, Loader2 } from "lucide-react";
import { CATEGORIES, CONDITIONS } from "@/lib/types";
import type { Category, Condition } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoUpload } from "@/components/photo-upload";

interface ItemFormData {
  name: string;
  description: string;
  category: string;
  condition: string;
  replacementValue: string;
  depositAmount: string;
  maxLoanDays: string;
  imageUrl: string;
  careInstructions: string;
}

interface ItemFormProps {
  initialData?: Partial<ItemFormData>;
  itemId?: string;
}

const emptyForm: ItemFormData = {
  name: "",
  description: "",
  category: "",
  condition: "",
  replacementValue: "",
  depositAmount: "",
  maxLoanDays: "7",
  imageUrl: "",
  careInstructions: "",
};

export function ItemForm({ initialData, itemId }: ItemFormProps) {
  const router = useRouter();
  const isEdit = !!itemId;
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<ItemFormData>({
    ...emptyForm,
    ...initialData,
  });

  const [aiMode, setAiMode] = useState<"ai" | "manual" | null>(
    isEdit ? null : null
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFilled, setAiFilled] = useState<Set<string>>(new Set());
  const [animatingFields, setAnimatingFields] = useState<Set<string>>(
    new Set()
  );

  const updateField = useCallback(
    (field: keyof ItemFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear AI badge when user manually edits
      setAiFilled((prev) => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });
    },
    []
  );

  const handleAiUpload = useCallback(async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/photo-listing", { method: "POST" });
      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();

      const fieldMap: Record<string, keyof ItemFormData> = {
        name: "name",
        description: "description",
        category: "category",
        condition: "condition",
        replacementValue: "replacementValue",
        depositAmount: "depositAmount",
        maxLoanDays: "maxLoanDays",
        careInstructions: "careInstructions",
      };

      // Stagger fill fields
      const fields = Object.entries(fieldMap);
      const newAiFields = new Set<string>();

      for (let i = 0; i < fields.length; i++) {
        const [dataKey, formKey] = fields[i];
        if (data[dataKey] !== undefined) {
          newAiFields.add(formKey);
          setTimeout(() => {
            setForm((prev) => ({
              ...prev,
              [formKey]: String(data[dataKey]),
            }));
            setAnimatingFields((prev) => {
              const next = new Set(prev);
              next.add(formKey);
              return next;
            });
            // Remove animation class after it plays
            setTimeout(() => {
              setAnimatingFields((prev) => {
                const next = new Set(prev);
                next.delete(formKey);
                return next;
              });
            }, 600);
          }, i * 120);
        }
      }

      setAiFilled(newAiFields);
      toast.success("AI analysis complete! Review the details below.");
    } catch {
      toast.error("Failed to analyze photo. Please fill in manually.");
    } finally {
      setAiLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !form.name ||
        !form.description ||
        !form.category ||
        !form.condition ||
        !form.replacementValue ||
        !form.depositAmount
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      startTransition(async () => {
        try {
          const body = {
            name: form.name,
            description: form.description,
            category: form.category,
            condition: form.condition,
            replacementValue: Number(form.replacementValue),
            depositAmount: Number(form.depositAmount),
            maxLoanDays: Number(form.maxLoanDays) || 7,
            imageUrl: form.imageUrl || null,
            careInstructions: form.careInstructions || null,
          };

          const url = isEdit ? `/api/items/${itemId}` : "/api/items";
          const method = isEdit ? "PATCH" : "POST";

          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Something went wrong");
          }

          const item = await res.json();
          toast.success(
            isEdit ? "Item updated successfully!" : "Item published to catalog!"
          );
          router.push(`/catalog/${item.id}`);
          router.refresh();
        } catch (err: unknown) {
          toast.error(
            err instanceof Error ? err.message : "Failed to save item"
          );
        }
      });
    },
    [form, isEdit, itemId, router]
  );

  const handleRemove = useCallback(async () => {
    if (!itemId) return;
    if (!confirm("Are you sure you want to remove this listing?")) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REMOVED" }),
        });

        if (!res.ok) throw new Error("Failed to remove item");

        toast.success("Listing removed.");
        router.push("/catalog");
        router.refresh();
      } catch {
        toast.error("Failed to remove listing.");
      }
    });
  }, [itemId, router]);

  function fieldWrapper(field: keyof ItemFormData, children: React.ReactNode) {
    return (
      <div
        className={`relative transition-all duration-500 ${
          animatingFields.has(field)
            ? "animate-in fade-in slide-in-from-bottom-2"
            : ""
        }`}
      >
        {children}
        {aiFilled.has(field) && (
          <Badge
            variant="secondary"
            className="absolute -top-2 right-2 gap-1 bg-primary/10 text-primary text-[10px] px-1.5 py-0"
          >
            <Sparkles className="h-2.5 w-2.5" />
            AI-generated
          </Badge>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* AI vs Manual entry - only for new items */}
      {!isEdit && (
        <div className="space-y-4">
          {aiMode !== "manual" && (
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 border-b border-primary/10 bg-primary/5 px-6 py-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-heading text-sm font-semibold text-primary">
                    Quick List with AI
                  </span>
                </div>
                <div className="p-6">
                  <PhotoUpload
                    onUpload={handleAiUpload}
                    isLoading={aiLoading}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {aiMode !== "manual" && !aiLoading && aiFilled.size === 0 && (
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <button
                type="button"
                onClick={() => setAiMode("manual")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <PenLine className="h-3.5 w-3.5" />
                Manual Entry
              </button>
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {aiMode === "manual" && (
            <button
              type="button"
              onClick={() => setAiMode(null)}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Switch back to AI upload
            </button>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Item name - full width */}
        <div className="sm:col-span-2">
          {fieldWrapper(
            "name",
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Item name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                placeholder="e.g. DeWalt Cordless Drill"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
          )}
        </div>

        {/* Description - full width */}
        <div className="sm:col-span-2">
          {fieldWrapper(
            "description",
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Describe the item, what it's great for, and any accessories included..."
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
              />
            </div>
          )}
        </div>

        {/* Category */}
        {fieldWrapper(
          "category",
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category <span className="text-destructive">*</span>
            </label>
            <Select
              value={form.category}
              onValueChange={(v) => v && updateField("category", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Condition */}
        {fieldWrapper(
          "condition",
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Condition <span className="text-destructive">*</span>
            </label>
            <Select
              value={form.condition}
              onValueChange={(v) => v && updateField("condition", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((cond) => (
                  <SelectItem key={cond.value} value={cond.value}>
                    {cond.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Replacement value */}
        {fieldWrapper(
          "replacementValue",
          <div className="space-y-2">
            <label
              htmlFor="replacementValue"
              className="text-sm font-medium text-foreground"
            >
              Replacement value <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="replacementValue"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={form.replacementValue}
                onChange={(e) =>
                  updateField("replacementValue", e.target.value)
                }
                required
              />
            </div>
          </div>
        )}

        {/* Deposit amount */}
        {fieldWrapper(
          "depositAmount",
          <div className="space-y-2">
            <label
              htmlFor="depositAmount"
              className="text-sm font-medium text-foreground"
            >
              Deposit amount <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="depositAmount"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={form.depositAmount}
                onChange={(e) => updateField("depositAmount", e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Max loan period */}
        {fieldWrapper(
          "maxLoanDays",
          <div className="space-y-2">
            <label
              htmlFor="maxLoanDays"
              className="text-sm font-medium text-foreground"
            >
              Max loan period (days)
            </label>
            <Input
              id="maxLoanDays"
              type="number"
              min={1}
              max={365}
              placeholder="7"
              value={form.maxLoanDays}
              onChange={(e) => updateField("maxLoanDays", e.target.value)}
            />
          </div>
        )}

        {/* Image URL */}
        {fieldWrapper(
          "imageUrl",
          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="text-sm font-medium text-foreground"
            >
              Image URL
            </label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
            />
          </div>
        )}

        {/* Care instructions - full width */}
        <div className="sm:col-span-2">
          {fieldWrapper(
            "careInstructions",
            <div className="space-y-2">
              <label
                htmlFor="careInstructions"
                className="text-sm font-medium text-foreground"
              >
                Care instructions
              </label>
              <Textarea
                id="careInstructions"
                placeholder="Any special handling, cleaning, or storage instructions..."
                rows={3}
                value={form.careInstructions}
                onChange={(e) =>
                  updateField("careInstructions", e.target.value)
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
        <div>
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={isPending}
              className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Remove Listing
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Publish to Catalog"}
          </Button>
        </div>
      </div>
    </form>
  );
}
