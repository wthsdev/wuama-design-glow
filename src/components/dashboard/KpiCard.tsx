import { useState } from "react";
import { Info, ArrowUpRight, ArrowDownRight, AlertTriangle, Lock } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  KpiBreakdownModal,
  type BreakdownItem,
  type TopContributor,
} from "./KpiBreakdownModal";

// ─── Types ───────────────────────────────────────────────────────────
export type KpiCardState = "loaded" | "loading" | "error" | "restricted" | "empty";

export interface KpiCardProps {
  label: string;
  value: string;
  formula?: string;
  formulaDetail?: string;
  formulaNote?: string;
  breakdownItems?: BreakdownItem[];
  topContributors?: TopContributor[];
  dataSourceNote?: string;
  delta?: string;
  deltaValue?: number;
  invertDelta?: boolean;
  secondaryText?: string;
  sparklineData?: number[];
  deltaLabel?: string;
  state?: KpiCardState;
  onRetry?: () => void;
  variant?: "core" | "secondary";
  leftBorderClass?: string;
}

export function KpiCard({
  label,
  value,
  formula,
  formulaDetail,
  formulaNote,
  breakdownItems = [],
  topContributors = [],
  dataSourceNote,
  delta,
  deltaValue = 0,
  invertDelta = false,
  secondaryText,
  sparklineData,
  deltaLabel = "vs prev month",
  state = "loaded",
  onRetry,
  variant = "core",
  leftBorderClass,
}: KpiCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const isCore = variant === "core";
  const padding = isCore ? "p-3.5" : "p-4";
  const valueSize = isCore ? "text-xl" : "text-[22px]";

  // Delta color logic
  const isPositive = deltaValue > 0;
  const deltaColor = invertDelta
    ? isPositive
      ? "text-destructive"
      : "text-success"
    : isPositive
      ? "text-success"
      : "text-destructive";
  const DeltaIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  // ─── Loading state ──────────────────
  if (state === "loading") {
    return (
      <Card className={cn("transition-all duration-150 hover:shadow-card-hover hover:scale-[1.01]", padding, leftBorderClass)}>
        <Skeleton className="mb-3 h-3 w-[60%]" />
        <Skeleton className="mb-2 h-7 w-[40%]" />
        <Skeleton className="h-3 w-[30%]" />
      </Card>
    );
  }

  // ─── Error state ────────────────────
  if (state === "error") {
    return (
      <Card className={cn("border-destructive/20 bg-[hsl(0_80%_97%)] transition-all duration-150", padding, leftBorderClass)}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-xs font-medium text-destructive">Failed to load</span>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-xs font-medium text-primary hover:underline">
            Retry
          </button>
        )}
      </Card>
    );
  }

  // ─── Restricted state ───────────────
  if (state === "restricted") {
    return (
      <Card className={cn("transition-all duration-150 hover:shadow-card-hover hover:scale-[1.01]", padding, leftBorderClass)}>
        <span className="text-card-label">{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <span className={cn("font-bold", valueSize)}>—</span>
              <Lock className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent>Unauthorized — contact admin</TooltipContent>
        </Tooltip>
      </Card>
    );
  }

  // ─── Empty state ────────────────────
  const isEmpty = state === "empty";

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-150 hover:shadow-card-hover hover:scale-[1.01]",
          padding,
          leftBorderClass,
        )}
      >
        {/* Top line: label + info icon */}
        <div className="flex items-center justify-between">
          <span className="text-card-label">{label}</span>
          {formula && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{formula}</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Value */}
        <p className={cn("mt-2 font-bold leading-none font-heading", valueSize, isEmpty && "text-muted-foreground")}>
          {value}
        </p>

        {/* Delta line */}
        {delta && !isEmpty && deltaValue !== 0 && (
          <div className="mt-1.5 flex items-center gap-1 flex-nowrap">
            <DeltaIcon className={cn("h-3.5 w-3.5 shrink-0", deltaColor)} />
            <span className={cn("text-[13px] font-semibold whitespace-nowrap", deltaColor)}>{delta}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{deltaLabel}</span>
          </div>
        )}

        {/* Secondary text */}
        {secondaryText && (
          <p className="mt-1 text-xs text-muted-foreground">{secondaryText}</p>
        )}

        {/* Sparkline (core variant only) */}
        {isCore && sparklineData && sparklineData.length > 0 && !isEmpty && (
          <div className="mt-2 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((v) => ({ v }))}>
                <defs>
                  <linearGradient id={`spark-${label.replace(/\s+/g, "-")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                  fill={`url(#spark-${label.replace(/\s+/g, "-")})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* KPI Breakdown Modal */}
      {formula && (
        <KpiBreakdownModal
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          kpiName={label}
          formula={formulaDetail || formula}
          formulaNote={formulaNote}
          breakdownItems={breakdownItems}
          topContributors={topContributors}
          dataSourceNote={dataSourceNote}
        />
      )}
    </>
  );
}
