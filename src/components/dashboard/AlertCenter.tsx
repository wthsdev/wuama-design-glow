import { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldAlert,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertListDrawer, type AlertWorkspaceItem, type AlertSeverity } from "./AlertListDrawer";

interface AlertItem {
  id: string;
  type: string;
  count: number;
  countLabel: string;
  severity: AlertSeverity;
  drawerWorkspaces: AlertWorkspaceItem[];
}

const alerts: AlertItem[] = [
  {
    id: "conv",
    type: "Conversation overages",
    count: 4,
    countLabel: "4 workspaces",
    severity: "warning",
    drawerWorkspaces: [
      { name: "Acme Corp", status: "active", metric: "Projected: 8.600 / 8.000 included (107%)", progressPct: 107 },
      { name: "Globex SA", status: "active", metric: "Projected: 5.200 / 5.000 included (104%)", progressPct: 104 },
      { name: "Initech SL", status: "active", metric: "Projected: 3.100 / 3.000 included (103%)", progressPct: 103 },
      { name: "Umbrella Ltd", status: "active", metric: "Projected: 4.500 / 4.000 included (112%)", progressPct: 112 },
    ],
  },
  {
    id: "credit",
    type: "Credit overages",
    count: 2,
    countLabel: "2 workspaces",
    severity: "warning",
    drawerWorkspaces: [
      { name: "Globex SA", status: "active", metric: "Projected: 12.500 / 10.000 included (125%)", progressPct: 125 },
      { name: "Wayne Enterprises", status: "active", metric: "Projected: 8.800 / 8.000 included (110%)", progressPct: 110 },
    ],
  },
  {
    id: "margin",
    type: "Negative margin",
    count: 1,
    countLabel: "1 workspace",
    severity: "critical",
    drawerWorkspaces: [
      { name: "Stark Industries", status: "active", metric: "Margin: -€45 (-5,6%)", metricDetail: "negative" },
    ],
  },
  {
    id: "overdue",
    type: "Overdue invoices",
    count: 3,
    countLabel: "3 invoices",
    severity: "critical",
    drawerWorkspaces: [
      { name: "Acme Corp", status: "active", metric: "Invoice #1234 — €799 — 15 days overdue", metricDetail: "negative" },
      { name: "Umbrella Ltd", status: "active", metric: "Invoice #1267 — €450 — 8 days overdue", metricDetail: "negative" },
      { name: "Oscorp", status: "paused", metric: "Invoice #1301 — €1.200 — 22 days overdue", metricDetail: "negative" },
    ],
  },
  {
    id: "onboarding",
    type: "Stalled onboarding",
    count: 2,
    countLabel: "2 workspaces",
    severity: "info",
    drawerWorkspaces: [
      { name: "Daily Planet", status: "onboarding", metric: "Last activity: 12 days ago" },
      { name: "LexCorp", status: "onboarding", metric: "Last activity: 9 days ago" },
    ],
  },
];

const severityConfig = {
  critical: {
    icon: AlertOctagon,
    badgeVariant: "destructive" as const,
    iconClass: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    badgeVariant: "warning" as const,
    iconClass: "text-warning",
  },
  info: {
    icon: Info,
    badgeVariant: "secondary" as const,
    iconClass: "text-primary",
  },
};

export function AlertCenter() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const hasCritical = alerts.some((a) => a.severity === "critical");
  const hasWarning = alerts.some((a) => a.severity === "warning");
  const totalAlerts = alerts.reduce((s, a) => s + a.count, 0);
  const isEmpty = alerts.length === 0;

  const handleView = (alert: AlertItem) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card className="flex flex-col lg:sticky lg:top-20">
        <CardHeader className="flex-row items-center gap-2 p-5 pb-3">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <h3 className="flex-1 text-base font-semibold font-heading">Alert Center</h3>
          <Badge
            variant={hasCritical ? "destructive" : hasWarning ? "warning" : "outline"}
            className="text-xs"
          >
            {totalAlerts}
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 px-5 pb-2">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="mb-3 h-10 w-10 text-success" />
              <p className="text-sm font-medium">All clear</p>
              <p className="mt-1 text-xs text-muted-foreground">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-0">
              {alerts.map((alert, i) => {
                const cfg = severityConfig[alert.severity];
                const Icon = cfg.icon;
                return (
                  <div key={alert.id}>
                    <div className="flex items-center gap-3 py-3">
                      <Icon className={cn("h-[18px] w-[18px] shrink-0", cfg.iconClass)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">{alert.type}</p>
                        <Badge variant={cfg.badgeVariant} className="mt-1 text-[10px] px-1.5 py-0">
                          {alert.countLabel}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={() => handleView(alert)}
                      >
                        View
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                    {i < alerts.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <div className="border-t px-5 py-3">
          <Button variant="ghost" className="w-full text-xs" size="sm">
            View all alerts
          </Button>
        </div>
      </Card>

      {/* Alert List Drawer */}
      <AlertListDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        alertType={selectedAlert?.type ?? ""}
        severity={selectedAlert?.severity ?? "warning"}
        workspaces={selectedAlert?.drawerWorkspaces ?? []}
        onApplyFilter={() => {
          // Placeholder: would apply filter to workspace table
        }}
      />
    </>
  );
}
