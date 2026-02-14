import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SkeletonCard, SkeletonTableRow } from "@/components/states/SkeletonCard";
import { ErrorBlock } from "@/components/states/ErrorBlock";
import { EmptyState } from "@/components/states/EmptyState";
import { RestrictedValue } from "@/components/states/RestrictedValue";
import { PercentageDelta } from "@/components/PercentageDelta";
import { formatCurrency, formatMonthYear, formatDayMonth } from "@/lib/formatters";
import { TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const Index = () => {
  return (
    <div className="section-spacing">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* ── Typography ─────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Tipografía</h2>
        <Card>
          <CardContent className="space-y-4 p-5">
            <p className="text-page-title">Título de Página — 28px Semibold (Plus Jakarta Sans)</p>
            <p className="text-section-title">Título de Sección — 18px Semibold</p>
            <p className="text-card-label">Etiqueta de Tarjeta — 12px Medium Uppercase</p>
            <p className="text-kpi">€128.450 <span className="text-sm font-normal text-muted-foreground">KPI Value</span></p>
            <p>Texto body — 14px Regular (DM Sans). Lorem ipsum dolor sit amet consectetur.</p>
          </CardContent>
        </Card>
      </section>

      {/* ── Colors ──────────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Paleta de Colores</h2>
        <div className="card-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {[
            { label: "Primary", cls: "bg-primary text-primary-foreground" },
            { label: "Accent", cls: "bg-accent text-accent-foreground" },
            { label: "Success", cls: "bg-success text-success-foreground" },
            { label: "Warning", cls: "bg-warning text-warning-foreground" },
            { label: "Destructive", cls: "bg-destructive text-destructive-foreground" },
            { label: "Muted", cls: "bg-muted text-muted-foreground" },
          ].map((c) => (
            <div key={c.label} className={`flex h-20 items-center justify-center rounded-lg text-xs font-medium ${c.cls}`}>
              {c.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── KPI Cards ──────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Tarjetas KPI</h2>
        <div className="card-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Ingresos", value: 128450.75, delta: 12.3, icon: DollarSign },
            { label: "Usuarios Activos", value: 3842, delta: -2.1, icon: Users, isCurrency: false },
            { label: "Margen Bruto", value: 67.8, delta: 4.5, icon: TrendingUp, isPercent: true },
            { label: "MRR", value: 45200, delta: 8.7, icon: BarChart3 },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <span className="text-card-label">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-kpi">
                  {kpi.isPercent
                    ? `${kpi.value}%`
                    : kpi.isCurrency === false
                      ? kpi.value.toLocaleString("es-ES")
                      : formatCurrency(kpi.value)}
                </p>
                <PercentageDelta value={kpi.delta} className="mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Badges ──────────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Activo</Badge>
          <Badge variant="warning">Pendiente</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* ── Buttons ─────────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Botones</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* ── Table ───────────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Tabla con Datos</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                  <TableHead className="text-right">Acceso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Acme Corp", date: new Date(2025, 0, 15), amount: 24500, margin: 18.3 },
                  { name: "Globex SA", date: new Date(2025, 1, 3), amount: 8750, margin: -4.2 },
                  { name: "Initech SL", date: new Date(2025, 2, 22), amount: 156200, margin: 32.1 },
                  { name: "Umbrella Ltd", date: new Date(2025, 3, 8), amount: 3200, margin: -12.5 },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{formatDayMonth(row.date)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.amount)}</TableCell>
                    <TableCell className="text-right">
                      <PercentageDelta value={row.margin} />
                    </TableCell>
                    <TableCell className="text-right">
                      <RestrictedValue />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* ── Tooltip ─────────────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Tooltips</h2>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              Tooltip con fondo oscuro, texto blanco, 12px, max-width 280px. Ideal para descripciones cortas.
            </TooltipContent>
          </Tooltip>
        </div>
      </section>

      {/* ── Data Formatting ─────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Formato de Datos</h2>
        <Card>
          <CardContent className="space-y-2 p-5">
            <p><span className="text-card-label mr-2">Moneda:</span> {formatCurrency(12450.5)}</p>
            <p><span className="text-card-label mr-2">Compacto K:</span> {formatCurrency(12450, true)}</p>
            <p><span className="text-card-label mr-2">Compacto M:</span> {formatCurrency(1234567, true)}</p>
            <p><span className="text-card-label mr-2">Fecha mes/año:</span> {formatMonthYear(new Date())}</p>
            <p><span className="text-card-label mr-2">Fecha día/mes:</span> {formatDayMonth(new Date())}</p>
            <p className="flex items-center gap-2">
              <span className="text-card-label">Positivo:</span> <PercentageDelta value={12.3} />
              <span className="text-card-label ml-4">Negativo:</span> <PercentageDelta value={-5.8} />
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Global States ───────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Estados Globales</h2>

        <div className="space-y-4">
          <h3 className="text-card-label">Skeleton Loading</h3>
          <div className="card-grid grid-cols-1 sm:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <h3 className="text-card-label mt-6">Error State</h3>
          <ErrorBlock message="No se pudieron cargar los ingresos del mes." onRetry={() => alert("Retry!")} />

          <h3 className="text-card-label mt-6">Empty State</h3>
          <Card>
            <CardContent className="p-5">
              <EmptyState
                title="Sin transacciones"
                description="No se encontraron transacciones para el periodo seleccionado."
                actionLabel="Crear transacción"
                onAction={() => alert("Create!")}
              />
            </CardContent>
          </Card>

          <h3 className="text-card-label mt-6">Restricted (RBAC)</h3>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="text-sm">Valor restringido:</span>
              <RestrictedValue />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Shadows & Radius ────────────────────────────── */}
      <section className="section-spacing">
        <h2 className="text-section-title">Sombras y Bordes</h2>
        <div className="card-grid grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-card-label mb-2">Card Default</p>
              <p className="text-sm text-muted-foreground">shadow-card · rounded-lg (10px)</p>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center rounded-md border bg-card p-5 text-center shadow-card">
            <div>
              <p className="text-card-label mb-2">Button Radius</p>
              <p className="text-sm text-muted-foreground">rounded-md (8px)</p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-sm border bg-card p-5 text-center shadow-card">
            <div>
              <p className="text-card-label mb-2">Badge Radius</p>
              <p className="text-sm text-muted-foreground">rounded-sm (6px)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
