import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, Bot, MessageSquare, Clock, TrendingUp,
  PiggyBank, Save, Plus,
} from "lucide-react";

import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { generateMockWorkspaces } from "@/components/dashboard/workspace-table/mock-data";

const FLOWS = [
  { id: "f1", asset: "Atención al cliente WhatsApp", canal: "WhatsApp" },
  { id: "f2", asset: "Proveedores Telegram", canal: "WhatsApp" },
  { id: "f3", asset: "Consultas Email", canal: "WhatsApp" },
];

const CONTACTS = [
  { name: "Maria Garcia", msg: "Gracias por la ayuda", time: "hace 5 min" },
  { name: "Carlos López", msg: "¿Están abiertos hoy?", time: "hace 5 min" },
  { name: "Ana Martín", msg: "Quiero hacer un pedido", time: "hace 12 min" },
];

export default function FlowDetail() {
  const { id, flowId } = useParams();
  const all = useMemo(() => generateMockWorkspaces(87), []);
  const ws = all.find((w) => w.id === id) ?? all[0];
  const flow = FLOWS.find((f) => f.id === flowId) ?? FLOWS[0];

  const revenue = Math.round(ws.mrr / FLOWS.length);
  const cost = Math.round(ws.cost / FLOWS.length);
  const profit = revenue - cost;
  const margin = Math.round((profit / revenue) * 100);

  const [method, setMethod] = useState<"fixed" | "percentage">("fixed");
  const [marginInput, setMarginInput] = useState(margin.toString());

  return (
    <div className="section-spacing">
      <Link
        to={`/workspaces/${ws.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al Workspace
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bot className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold">{flow.asset}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="success" className="text-[11px]">Activo</Badge>
            <span>·</span>
            <span>{flow.canal}</span>
            <span>·</span>
            <span>{ws.name}</span>
          </div>
        </div>
      </div>

      {/* Financial Flow Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Financial Flow Metrics</CardTitle>
            <CardDescription>Rentabilidad específica de este agente</CardDescription>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New Workspace
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <FinTile label="Flow Revenue" value={formatCurrency(revenue)} sub="Mensual" />
            <FinTile label="WAMA Cost" value={formatCurrency(cost)} sub="Mensual" />
            <FinTile label="Flow Profit" value={formatCurrency(profit)} sub="Mensual" />
            <FinTile label="Margen" value={`${margin}%`} sub="Rentable" />
          </div>
        </CardContent>
      </Card>

      {/* Operational stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatTile icon={<MessageSquare className="h-5 w-5" />} label="Conversaciones" value="342" sub="12 activos" />
        <StatTile icon={<MessageSquare className="h-5 w-5" />} label="Mensajes" value="456" />
        <StatTile icon={<Clock className="h-5 w-5" />} label="Tiempo Respuesta" value="2.3 min" />
        <StatTile icon={<TrendingUp className="h-5 w-5" />} label="Satisfacción" value="4.7/5" />
      </div>

      {/* Collection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Cobro</CardTitle>
          <CardDescription>Define cuánto cobrar al cliente por este flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm">Método de Cobro</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as "fixed" | "percentage")} className="space-y-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/40">
                <RadioGroupItem value="fixed" id="fixed" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Precio Fijo</span>
                  <span className="text-xs text-muted-foreground">Cobrar una cantidad mensual fija</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/40">
                <RadioGroupItem value="percentage" id="percentage" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Porcentaje sobre Coste</span>
                  <span className="text-xs text-muted-foreground">Define un margen de beneficio en %</span>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="margin">Margen de Beneficio (%)</Label>
              <Input
                id="margin"
                type="number"
                value={marginInput}
                onChange={(e) => setMarginInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Basado en un coste base de {formatCurrency(cost)}</p>
            </div>
            <Card className="bg-muted/30">
              <CardContent className="space-y-2 p-4 text-sm">
                <p className="font-semibold">Resultado Estimado</p>
                <Row label="Ingresos:" value="Flow Revenue" />
                <Row label="Coste:" value={formatCurrency(cost)} />
                <div className="my-1 border-t" />
                <Row label="Profit:" value={formatCurrency(profit)} bold />
                <Row label="Margen:" value={`${margin}%`} bold />
              </CardContent>
            </Card>
          </div>

          <Button className="w-full gap-2">
            <Save className="h-4 w-4" /> Guardar Configuración de Precio
          </Button>
        </CardContent>
      </Card>

      {/* CRM tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="crm">
            <TabsList>
              <TabsTrigger value="crm">CRM</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="settings">Ajustes</TabsTrigger>
            </TabsList>
            <TabsContent value="crm" className="mt-4 space-y-4">
              <div>
                <h3 className="font-heading text-lg font-semibold">Contactos Recientes</h3>
                <p className="text-sm text-muted-foreground">Últimas conversaciones del flow</p>
              </div>
              <div className="space-y-2">
                {CONTACTS.map((c) => (
                  <div key={c.name} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.msg}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{c.time}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="metrics" className="mt-4 text-sm text-muted-foreground">
              Próximamente.
            </TabsContent>
            <TabsContent value="settings" className="mt-4 text-sm text-muted-foreground">
              Próximamente.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function FinTile({
  label, value, sub, extra,
}: { label: string; value: string; sub?: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ArrowUpRight className="h-4 w-4" />
        </div>
        <span>{label}</span>
      </div>
      <div className="mt-2 flex items-center">
        <span className="font-heading text-2xl font-semibold">{value}</span>
        {extra}
      </div>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

function StatTile({
  icon, label, value, sub,
}: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="font-heading text-xl font-semibold">{value}</span>
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}