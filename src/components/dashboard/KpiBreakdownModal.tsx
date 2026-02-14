import { Download, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────
export interface BreakdownItem {
  label: string;
  value: string;
  indent?: boolean;
  bold?: boolean;
  separatorAbove?: boolean;
}

export interface TopContributor {
  name: string;
  plan: string;
  contribution: string;
}

export interface KpiBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpiName: string;
  dataMode?: "Forecast" | "Real";
  formula: string;
  formulaNote?: string;
  breakdownItems: BreakdownItem[];
  topContributors?: TopContributor[];
  dataSourceNote?: string;
  onSeeAllInTable?: () => void;
}

export function KpiBreakdownModal({
  open,
  onOpenChange,
  kpiName,
  dataMode = "Forecast",
  formula,
  formulaNote,
  breakdownItems,
  topContributors = [],
  dataSourceNote,
  onSeeAllInTable,
}: KpiBreakdownModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] gap-0 p-0">
        {/* ── Header ─────────────────────────────────────── */}
        <DialogHeader className="space-y-2 p-6 pb-4">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-[20px] font-semibold font-heading">
              {kpiName} Breakdown
            </DialogTitle>
            <Badge variant="outline" className="text-[11px]">{dataMode}</Badge>
          </div>
          <DialogDescription className="sr-only">
            Detailed breakdown of {kpiName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-6">
          {/* ── Section 1: Formula ──────────────────────── */}
          <div className="rounded-md bg-muted/50 p-4">
            <p className="font-mono text-[13px] leading-relaxed text-foreground">{formula}</p>
            {formulaNote && (
              <p className="mt-2 text-[13px] italic text-muted-foreground">{formulaNote}</p>
            )}
          </div>

          <Separator />

          {/* ── Section 2: Value Breakdown ──────────────── */}
          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Value Breakdown
            </h4>
            <div className="space-y-0">
              {breakdownItems.map((item, i) => (
                <div key={i}>
                  {item.separatorAbove && <Separator className="my-1" />}
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-sm px-3 py-2 text-sm",
                      i % 2 === 0 ? "bg-muted/30" : "",
                      item.indent && "pl-7",
                      item.bold && "font-semibold",
                    )}
                  >
                    <span className={cn(item.bold ? "text-foreground" : "text-foreground/80")}>
                      {item.label}
                    </span>
                    <span className="font-semibold tabular-nums">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 3: Top Contributors ─────────────── */}
          {topContributors.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Top Contributors
                </h4>
                <div className="space-y-0">
                  <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span className="flex-1">Workspace</span>
                    <span className="w-20 text-center">Plan</span>
                    <span className="w-20 text-right">Contribution</span>
                  </div>
                  {topContributors.map((c, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-3 rounded-sm px-3 py-2 text-sm",
                        i % 2 === 0 ? "bg-muted/30" : "",
                      )}
                    >
                      <span className="flex-1 truncate font-medium">{c.name}</span>
                      <Badge variant="outline" className="w-20 justify-center text-[11px]">{c.plan}</Badge>
                      <span className="w-20 text-right tabular-nums font-semibold">{c.contribution}</span>
                    </div>
                  ))}
                </div>
                {onSeeAllInTable && (
                  <button
                    onClick={() => {
                      onSeeAllInTable();
                      onOpenChange(false);
                    }}
                    className="mt-2 text-xs font-medium text-primary hover:underline"
                  >
                    See all in table →
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── Section 4: Data Source Note ──────────────── */}
          {dataSourceNote && (
            <>
              <Separator />
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <p className="text-[12px] text-muted-foreground">{dataSourceNote}</p>
              </div>
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <DialogFooter className="border-t px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" disabled className="gap-1.5">
                  <Download className="h-4 w-4" /> Export breakdown
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
