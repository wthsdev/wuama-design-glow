import { useState, useCallback } from "react";
import { TrendingUp, FileText, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonthRangePicker } from "@/components/dashboard/MonthRangePicker";

type DataMode = "forecast" | "real";

export function DashboardHeader() {
  const [mode, setMode] = useState<DataMode>("forecast");
  const [spinning, setSpinning] = useState(false);

  // Month range state
  const [startMonth, setStartMonth] = useState<number | null>(9); // Oct
  const [startYear, setStartYear] = useState<number | null>(2025);
  const [endMonth, setEndMonth] = useState<number | null>(11); // Dec
  const [endYear, setEndYear] = useState<number | null>(2025);

  const handleRefresh = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }, []);

  const handleApplyRange = useCallback(
    (sm: number, sy: number, em: number, ey: number) => {
      setStartMonth(sm);
      setStartYear(sy);
      setEndMonth(em);
      setEndYear(ey);
    },
    [],
  );

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

        {/* Center: Tabs + Month Range */}
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={mode} onValueChange={(v) => setMode(v as DataMode)}>
            <TabsList className="h-9">
              <TabsTrigger
                value="forecast"
                className={cn(
                  "gap-1.5 text-xs",
                  mode === "forecast" && "bg-primary text-primary-foreground shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                )}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Forecast
              </TabsTrigger>
              <TabsTrigger
                value="real"
                className={cn(
                  "gap-1.5 text-xs",
                  mode === "real" && "bg-primary text-primary-foreground shadow-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                Real
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Month range — only for Real */}
          {mode === "real" && (
            <MonthRangePicker
              startMonth={startMonth}
              startYear={startYear}
              endMonth={endMonth}
              endYear={endYear}
              onApply={handleApplyRange}
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
