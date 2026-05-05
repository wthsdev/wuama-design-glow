import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Bot, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { generateMockWorkspaces } from "@/components/dashboard/workspace-table/mock-data";

export default function Workspaces() {
  const workspaces = useMemo(() => generateMockWorkspaces(87), []);
  const visible = workspaces.slice(0, 4);

  return (
    <div className="section-spacing">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">All Workspaces</h1>
          <p className="text-sm text-muted-foreground">Manage all your client workspaces</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/workspaces/new">
            <Plus className="h-4 w-4" /> New Workspace
          </Link>
        </Button>
      </div>

      {/* List */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="font-heading text-base font-semibold">
            All Workspaces ({workspaces.length})
          </h2>

          <div className="space-y-3">
            {visible.map((ws) => (
                <div
                  key={ws.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-heading text-base font-semibold">{ws.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{ws.plan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden items-center gap-8 md:flex">
                    <KpiCol label="Monthly Revenue" value={formatCurrency(ws.mrr)} />
                    <KpiCol label="Your Profit" value={formatCurrency(ws.marginEur)} />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-[11px]">Active</Badge>
                    <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                      <Link to={`/workspaces/${ws.id}`}>
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}