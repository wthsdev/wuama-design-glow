import { ExternalLink, Download, Filter, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export type AlertSeverity = "critical" | "warning" | "info";

export interface AlertWorkspaceItem {
  name: string;
  status: "active" | "onboarding" | "paused" | "cancelled";
  metric: string;
  metricDetail?: string;
  progressPct?: number;
  severity?: AlertSeverity;
}

interface AlertListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertType: string;
  severity: AlertSeverity;
  workspaces: AlertWorkspaceItem[];
  onApplyFilter?: () => void;
}

const STATUS_MAP: Record<string, { label: string; variant: "success" | "default" | "warning" | "secondary" }> = {
  active: { label: "Active", variant: "success" },
  onboarding: { label: "Onboarding", variant: "default" },
  paused: { label: "Paused", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

const severityBadge: Record<AlertSeverity, "destructive" | "warning" | "secondary"> = {
  critical: "destructive",
  warning: "warning",
  info: "secondary",
};

function progressColor(pct: number) {
  if (pct > 100) return "bg-destructive";
  if (pct >= 80) return "bg-warning";
  return "bg-primary";
}

export function AlertListDrawer({
  open,
  onOpenChange,
  alertType,
  severity,
  workspaces,
  onApplyFilter,
}: AlertListDrawerProps) {
  // Group by severity if items have individual severity
  const hasMixedSeverity = workspaces.some((w) => w.severity && w.severity !== severity);
  const groups = hasMixedSeverity
    ? (["critical", "warning", "info"] as AlertSeverity[])
        .map((s) => ({ severity: s, items: workspaces.filter((w) => (w.severity ?? severity) === s) }))
        .filter((g) => g.items.length > 0)
    : [{ severity, items: workspaces }];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col bg-card p-0 sm:max-w-[480px]">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-card px-5 py-5">
          <SheetHeader className="mb-1 p-0">
            <SheetTitle className="flex items-center gap-2 text-lg">
              {alertType}
              <Badge variant={severityBadge[severity]} className="text-[11px]">
                {severity}
              </Badge>
            </SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground">
            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} affected
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {groups.map((group, gi) => (
            <div key={group.severity}>
              {hasMixedSeverity && (
                <p className="mb-2 mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.severity}
                </p>
              )}

              <div className="space-y-3">
                {group.items.map((ws) => {
                  const st = STATUS_MAP[ws.status] ?? STATUS_MAP.active;
                  return (
                    <Card key={ws.name} className="space-y-2 p-3.5">
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{ws.name}</span>
                        <Badge variant={st.variant} className="shrink-0 text-[10px]">
                          {st.label}
                        </Badge>
                      </div>

                      {/* Middle row — contextual metric */}
                      <div className="space-y-1.5">
                        <p
                          className={cn(
                            "text-sm",
                            ws.metricDetail === "negative" || (ws.progressPct && ws.progressPct > 100)
                              ? "text-destructive"
                              : "text-muted-foreground",
                          )}
                        >
                          {ws.metric}
                        </p>

                        {ws.progressPct !== undefined && (
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn("h-full rounded-full transition-all", progressColor(ws.progressPct))}
                              style={{ width: `${Math.min(110, ws.progressPct)}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Bottom row — actions */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 px-2 text-xs text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info("Detail page coming soon");
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          View workspace
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {gi < groups.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 space-y-2 border-t bg-card px-4 py-4">
          <Button
            variant="outline"
            className="w-full gap-1.5 text-sm"
            onClick={() => {
              onApplyFilter?.();
              onOpenChange(false);
            }}
          >
            <Filter className="h-3.5 w-3.5" />
            Apply as table filter
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-1.5 text-sm text-muted-foreground"
            onClick={() => toast.info("Export coming soon")}
          >
            <Download className="h-3.5 w-3.5" />
            Export affected workspaces
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
