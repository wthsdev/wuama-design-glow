import { useState, useCallback, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { WorkspaceStatus, AlertType } from "./types";

// ── Filter state shape ──────────────────────────────────────────────
export interface AdvancedFilters {
  statuses: WorkspaceStatus[];
  plans: string[];
  alertTypes: AlertType[];
  marginRange: [number, number];
  usageLevel: string;
  accountManager: string;
}

export const DEFAULT_FILTERS: AdvancedFilters = {
  statuses: ["active", "onboarding", "paused"],
  plans: ["Starter", "Growth", "Pro", "Enterprise"],
  alertTypes: [],
  marginRange: [-50, 100],
  usageLevel: "any",
  accountManager: "any",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: AdvancedFilters;
  onApply: (f: AdvancedFilters) => void;
}

// ── Config ──────────────────────────────────────────────────────────
const STATUS_OPTIONS: { value: WorkspaceStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

const PLAN_OPTIONS = ["Starter", "Growth", "Pro", "Enterprise"];

const ALERT_OPTIONS: { value: AlertType; label: string; dot: string }[] = [
  { value: "conv_overage", label: "Conversation overage", dot: "bg-warning" },
  { value: "credit_overage", label: "Credit overage", dot: "bg-warning" },
  { value: "negative_margin", label: "Negative margin", dot: "bg-destructive" },
  { value: "overdue_invoice", label: "Invoice overdue", dot: "bg-destructive" },
  { value: "stalled_onboarding", label: "Onboarding stalled", dot: "bg-primary" },
];

const USAGE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "low", label: "Low (<50%)" },
  { value: "medium", label: "Medium (50-80%)" },
  { value: "high", label: "High (80-100%)" },
  { value: "over", label: "Over limit (>100%)" },
];

const MANAGERS = ["Any", "Ana García", "Carlos López", "María Fernández", "Pedro Ruiz"];

const MARGIN_PRESETS: { label: string; range: [number, number] }[] = [
  { label: "Negative only", range: [-50, 0] },
  { label: "Below 20%", range: [-50, 20] },
  { label: "Healthy (>40%)", range: [40, 100] },
];

// ── Helpers ─────────────────────────────────────────────────────────
function toggleInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function countActive(f: AdvancedFilters): number {
  let count = 0;
  if (f.statuses.length !== DEFAULT_FILTERS.statuses.length || f.statuses.some((s) => !DEFAULT_FILTERS.statuses.includes(s))) count++;
  if (f.plans.length !== DEFAULT_FILTERS.plans.length) count++;
  if (f.alertTypes.length > 0) count++;
  if (f.marginRange[0] !== DEFAULT_FILTERS.marginRange[0] || f.marginRange[1] !== DEFAULT_FILTERS.marginRange[1]) count++;
  if (f.usageLevel !== "any") count++;
  if (f.accountManager !== "any") count++;
  return count;
}

// ── Component ───────────────────────────────────────────────────────
export function AdvancedFiltersDrawer({ open, onOpenChange, filters, onApply }: Props) {
  const [draft, setDraft] = useState<AdvancedFilters>(filters);

  // Reset draft when opening
  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (v) setDraft(filters);
      onOpenChange(v);
    },
    [filters, onOpenChange],
  );

  const activeCount = useMemo(() => countActive(draft), [draft]);

  const clearAll = () => setDraft({ ...DEFAULT_FILTERS });

  const apply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col bg-card p-0 sm:max-w-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-5">
          <SheetHeader className="p-0">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
            </SheetTitle>
          </SheetHeader>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={clearAll}>
            Clear all
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 space-y-0 overflow-y-auto">
          {/* ─ Status ─ */}
          <Section title="Status">
            <div className="space-y-3">
              {STATUS_OPTIONS.map((s) => (
                <label key={s.value} className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox
                    checked={draft.statuses.includes(s.value)}
                    onCheckedChange={() => setDraft((d) => ({ ...d, statuses: toggleInArray(d.statuses, s.value) }))}
                  />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Separator />

          {/* ─ Plan ─ */}
          <Section title="Plan">
            <div className="space-y-3">
              {PLAN_OPTIONS.map((p) => (
                <label key={p} className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox
                    checked={draft.plans.includes(p)}
                    onCheckedChange={() => setDraft((d) => ({ ...d, plans: toggleInArray(d.plans, p) }))}
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </Section>

          <Separator />

          {/* ─ Alerts ─ */}
          <Section title="Alerts">
            <div className="space-y-3">
              {ALERT_OPTIONS.map((a) => (
                <label key={a.value} className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox
                    checked={draft.alertTypes.includes(a.value)}
                    onCheckedChange={() => setDraft((d) => ({ ...d, alertTypes: toggleInArray(d.alertTypes, a.value) }))}
                  />
                  <span className={cn("h-2 w-2 rounded-full", a.dot)} />
                  <span className="text-sm">{a.label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Separator />

          {/* ─ Margin Range ─ */}
          <Section title="Margin Range">
            <div className="space-y-4">
              <Slider
                min={-50}
                max={100}
                step={1}
                value={draft.marginRange}
                onValueChange={(v) => setDraft((d) => ({ ...d, marginRange: v as [number, number] }))}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground">
                From <span className="font-medium text-foreground">{draft.marginRange[0]}%</span> to{" "}
                <span className="font-medium text-foreground">{draft.marginRange[1]}%</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MARGIN_PRESETS.map((pr) => (
                  <button
                    key={pr.label}
                    onClick={() => setDraft((d) => ({ ...d, marginRange: pr.range }))}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                      draft.marginRange[0] === pr.range[0] && draft.marginRange[1] === pr.range[1]
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Separator />

          {/* ─ Usage Level ─ */}
          <Section title="Usage Level">
            <Select value={draft.usageLevel} onValueChange={(v) => setDraft((d) => ({ ...d, usageLevel: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {USAGE_OPTIONS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>

          <Separator />

          {/* ─ Account Manager ─ */}
          <Section title="Account Manager">
            <Select
              value={draft.accountManager}
              onValueChange={(v) => setDraft((d) => ({ ...d, accountManager: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {MANAGERS.map((m) => (
                  <SelectItem key={m} value={m === "Any" ? "any" : m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-card px-5 py-4">
          <p className="text-[13px] text-muted-foreground">
            {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} active` : "No filters active"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={apply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <Label className="mb-3 block text-sm font-semibold">{title}</Label>
      {children}
    </div>
  );
}
