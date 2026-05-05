import { useState, useCallback } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonthRangePicker } from "@/components/dashboard/MonthRangePicker";

type DataMode = "forecast" | "real";

interface DashboardHeaderProps {
  mode: DataMode;
  onModeChange: (mode: DataMode) => void;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  onApplyRange: (sm: number, sy: number, em: number, ey: number) => void;
}

export function DashboardHeader({ mode, onModeChange, startMonth, startYear, endMonth, endYear, onApplyRange }: DashboardHeaderProps) {
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }, []);

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3 lg:items-center">
        {/* Left: Title */}
        <div className="min-w-0">
          <h1 className="text-page-title">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Agency overview · <span className="font-medium text-foreground">WUAMA Agency</span>
          </p>
        </div>

        {/* Center: Month Range — only for Real */}
        <div className="flex flex-wrap items-center gap-3">
          {mode === "real" && (
            <MonthRangePicker
              startMonth={startMonth}
              startYear={startYear}
              endMonth={endMonth}
              endYear={endYear}
              onApply={onApplyRange}
            />
          )}
        </div>

        {/* Right: Updated + Refresh */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs font-normal text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated 5 min ago
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 transition-transform duration-700",
                spinning && "animate-[spin_0.7s_ease-in-out]",
              )}
            />
          </Button>
        </div>
      </div>

      {/* Contextual badge below tabs */}
      <div className="mt-2">
        <Badge variant="secondary" className="text-xs font-normal">
          {mode === "forecast"
            ? "Current month estimate based on active plans"
            : "Invoiced data for selected period"}
        </Badge>
      </div>
    </div>
  );
}
