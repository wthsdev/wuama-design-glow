import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download, Search, Receipt, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { generateMockWorkspaces } from "@/components/dashboard/workspace-table/mock-data";
import { toast } from "sonner";

type InvoiceStatus = "paid" | "pending" | "overdue";

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: Date;
  amount: number;
  status: InvoiceStatus;
  concept: string;
}

function buildInvoices(): Invoice[] {
  const workspaces = generateMockWorkspaces(40).slice(0, 12);
  const concepts = ["Cuota mensual", "Instalación inicial", "Cuota mensual", "Cuota mensual"];
  const statuses: InvoiceStatus[] = ["paid", "paid", "paid", "pending", "overdue"];
  const list: Invoice[] = [];
  let counter = 1042;
  workspaces.forEach((ws, wi) => {
    const count = 4 + (wi % 3);
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(((wi * 3 + i) % 27) + 1);
      list.push({
        id: `INV-${counter}`,
        number: `F-2026-${String(counter).padStart(5, "0")}`,
        clientId: ws.id,
        clientName: ws.name,
        date,
        concept: concepts[(wi + i) % concepts.length],
        amount: Math.round((ws.mrr * (0.6 + ((i * 13) % 50) / 100)) * 100) / 100,
        status: statuses[(wi + i) % statuses.length],
      });
      counter++;
    }
  });
  return list.sort((a, b) => b.date.getTime() - a.date.getTime());
}

const statusMeta: Record<InvoiceStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  paid: { label: "Pagada", variant: "success" },
  pending: { label: "Pendiente", variant: "warning" },
  overdue: { label: "Vencida", variant: "destructive" },
};

function downloadCSV(filename: string, invoices: Invoice[]) {
  const header = ["Número", "Fecha", "Cliente", "Concepto", "Importe (EUR)", "Estado"];
  const rows = invoices.map((i) => [
    i.number,
    format(i.date, "dd/MM/yyyy"),
    i.clientName,
    i.concept,
    i.amount.toFixed(2).replace(".", ","),
    statusMeta[i.status].label,
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Invoices() {
  const all = useMemo(() => buildInvoices(), []);
  const clients = useMemo(() => {
    const map = new Map<string, string>();
    all.forEach((i) => map.set(i.clientId, i.clientName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [all]);

  const [client, setClient] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return all.filter((inv) => {
      if (client !== "all" && inv.clientId !== client) return false;
      if (status !== "all" && inv.status !== status) return false;
      if (from && inv.date < from) return false;
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (inv.date > end) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!inv.number.toLowerCase().includes(q) && !inv.clientName.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [all, client, status, from, to, query]);

  const totals = useMemo(() => {
    const total = filtered.reduce((s, i) => s + i.amount, 0);
    const paid = filtered.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
    const pending = filtered.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
    return { total, paid, pending, count: filtered.length };
  }, [filtered]);

  const grouped = useMemo(() => {
    const map = new Map<string, Invoice[]>();
    filtered.forEach((i) => {
      if (!map.has(i.clientId)) map.set(i.clientId, []);
      map.get(i.clientId)!.push(i);
    });
    return map;
  }, [filtered]);

  const resetFilters = () => {
    setClient("all");
    setStatus("all");
    setFrom(undefined);
    setTo(undefined);
    setQuery("");
  };

  const handleDownloadAll = () => {
    if (filtered.length === 0) {
      toast.error("No hay facturas para descargar");
      return;
    }
    downloadCSV(`facturas_${format(new Date(), "yyyy-MM-dd")}.csv`, filtered);
    toast.success(`${filtered.length} facturas descargadas`);
  };

  const handleDownloadClient = (clientId: string, clientName: string) => {
    const list = grouped.get(clientId) ?? [];
    downloadCSV(
      `facturas_${clientName.replace(/\s+/g, "_").toLowerCase()}.csv`,
      list,
    );
    toast.success(`${list.length} facturas de ${clientName} descargadas`);
  };

  const handleDownloadInvoice = (inv: Invoice) => {
    downloadCSV(`${inv.number}.csv`, [inv]);
  };

  return (
    <div className="section-spacing">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">Facturas</h1>
          <p className="text-sm text-muted-foreground">
            Consulta, filtra y descarga facturas por cliente o periodo
          </p>
        </div>
        <Button onClick={handleDownloadAll} className="gap-2">
          <FileDown className="h-4 w-4" /> Descargar todas
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-3 md:grid-cols-4">
        <SummaryCard label="Facturas" value={String(totals.count)} />
        <SummaryCard label="Total" value={formatCurrency(totals.total)} />
        <SummaryCard label="Cobrado" value={formatCurrency(totals.paid)} accent="success" />
        <SummaryCard label="Pendiente" value={formatCurrency(totals.pending)} accent="warning" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-12">
          <div className="relative md:col-span-3">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nº de factura o cliente"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={client} onValueChange={setClient}>
            <SelectTrigger className="md:col-span-3">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent className="max-h-72 bg-popover">
              <SelectItem value="all">Todos los clientes</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:col-span-2">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="paid">Pagadas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="overdue">Vencidas</SelectItem>
            </SelectContent>
          </Select>

          <DateField label="Desde" date={from} onChange={setFrom} className="md:col-span-2" />
          <DateField label="Hasta" date={to} onChange={setTo} className="md:col-span-2" />

          <div className="md:col-span-12 flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* By client */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold">
              Por cliente ({grouped.size})
            </h2>
          </div>
          <div className="space-y-2">
            {Array.from(grouped.entries()).map(([cid, list]) => {
              const total = list.reduce((s, i) => s + i.amount, 0);
              return (
                <div
                  key={cid}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{list[0].clientName}</span>
                      <span className="text-xs text-muted-foreground">
                        {list.length} facturas · {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => handleDownloadClient(cid, list[0].clientName)}
                  >
                    <Download className="h-3.5 w-3.5" /> Descargar
                  </Button>
                </div>
              );
            })}
            {grouped.size === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hay facturas con los filtros actuales
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Factura</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead className="text-right">Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No se encontraron facturas
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                    <TableCell className="text-sm">{format(inv.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-sm font-medium">{inv.clientName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.concept}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMeta[inv.status].variant} className="text-[11px]">
                        {statusMeta[inv.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1.5"
                        onClick={() => handleDownloadInvoice(inv)}
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success" | "warning";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 font-heading text-2xl font-semibold",
            accent === "success" && "text-success",
            accent === "warning" && "text-warning",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function DateField({
  label,
  date,
  onChange,
  className,
}: {
  label: string;
  date?: Date;
  onChange: (d?: Date) => void;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-popover p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}