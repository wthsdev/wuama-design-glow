import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Settings, DollarSign, Wallet, PiggyBank, CheckCircle2,
  BarChart3, Plus, ExternalLink, Pencil, Bot,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { generateMockWorkspaces } from "@/components/dashboard/workspace-table/mock-data";

const FLOWS = [
  { asset: "Atención al cliente WhatsApp", canal: "WhatsApp" },
  { asset: "Proveedores Telegram", canal: "WhatsApp" },
  { asset: "Consultas Email", canal: "WhatsApp" },
];

const USERS = [
  { name: "You (Partner)", email: "partner@example.com", role: "Partner" },
  { name: "John Smith", email: "john@techcorp.com", role: "Visitor" },
];

const CHANNELS = ["Website Widget", "WhatsApp", "Instagram"];

export default function WorkspaceDetail() {
  const { id } = useParams();
  const all = useMemo(() => generateMockWorkspaces(87), []);
  const ws = all.find((w) => w.id === id) ?? all[0];

  const profitPct = Math.max(0, ws.marginPct);

  return (
    <div className="section-spacing">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold">{ws.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{ws.plan}</span>
                <Badge variant="success" className="text-[11px]">Active</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Settings className="h-4 w-4" /> Setting
          </Button>
        </CardContent>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiTile
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Monthly Revenue"
          value={formatCurrency(ws.mrr)}
        />
        <KpiTile
          icon={<Wallet className="h-5 w-5" />}
          label="Total WAMA Cost"
          value={formatCurrency(ws.cost)}
          extra={
            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
              Ver Desglose Wama Cost
            </Button>
          }
        />
        <KpiTile
          icon={<PiggyBank className="h-5 w-5" />}
          label="Total Profit"
          value={formatCurrency(ws.marginEur)}
          sub={`${profitPct}% Margin`}
        />
      </div>

      {/* Payment Status + Agent Performance */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Current billing and payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-md bg-success/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Payment Received</span>
                <span className="text-xs text-muted-foreground">Next Billing: May 1, 2025</span>
              </div>
            </div>
            <Button className="w-full">Send Payment Link to Client</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Key metrics and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total Conversations</span>
                <span className="text-xl font-semibold tabular-nums">{ws.convUsed.toLocaleString()}</span>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <Button variant="secondary" className="w-full">View Full Analytics</Button>
          </CardContent>
        </Card>
      </div>

      {/* Flows */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Flows del Workspace</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5 text-primary">
            <Plus className="h-4 w-4" /> Crear nuevo Flow
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">WAMA Cost</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Margen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[120px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {FLOWS.map((f, i) => {
                const revenue = Math.round(ws.mrr / FLOWS.length);
                const cost = Math.round(ws.cost / FLOWS.length);
                const profit = revenue - cost;
                const margen = Math.round((profit / revenue) * 100);
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{f.asset}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-primary">{f.canal}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(revenue)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(cost)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(profit)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{margen}%</TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[11px]">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                          Ver <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Workspace Users */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {USERS.map((u) => (
            <div key={u.email} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{u.name}</span>
                  <span className="text-xs text-muted-foreground">{u.email}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px]">{u.role}</Badge>
            </div>
          ))}
          <Button variant="secondary" className="w-full">Invite Client as Visitor</Button>
        </CardContent>
      </Card>

      {/* Active Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Active Channels</CardTitle>
          <CardDescription>Where this AI agent is deployed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((c) => (
              <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Button variant="outline">Access CRM</Button>
        <Button variant="outline">Configure Agent</Button>
      </div>
    </div>
  );
}

function KpiTile({
  icon, label, value, sub, extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  extra?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="font-heading text-2xl font-semibold">{value}</span>
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
          {extra}
        </div>
      </CardContent>
    </Card>
  );
}