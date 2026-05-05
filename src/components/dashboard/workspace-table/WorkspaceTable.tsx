import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, SlidersHorizontal, Download, ArrowUpDown, ArrowUp, ArrowDown,
  MoreHorizontal, Check, AlertTriangle, Lock, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdvancedFiltersDrawer, DEFAULT_FILTERS, type AdvancedFilters } from "./AdvancedFiltersDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import { EmptyState } from "@/components/states/EmptyState";
import { ErrorBlock } from "@/components/states/ErrorBlock";

import type { Workspace, QuickFilter, SortField, SortDir } from "./types";
import { generateMockWorkspaces } from "./mock-data";

// ── Status badge helper ─────────────────────────────────────────────
const STATUS_MAP: Record<Workspace["status"], { label: string; variant: "success" | "default" | "warning" | "secondary" }> = {
  active: { label: "Active", variant: "success" },
  onboarding: { label: "Onboarding", variant: "default" },
  paused: { label: "Paused", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

// ── Quick filters ───────────────────────────────────────────────────
const FILTERS: { value: QuickFilter; label: string; dot?: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active", dot: "bg-success" },
  { value: "at_risk", label: "At Risk", dot: "bg-destructive" },
  { value: "negative_margin", label: "Negative Margin", dot: "bg-destructive" },
  { value: "overage", label: "Overage", dot: "bg-warning" },
  { value: "onboarding", label: "Onboarding", dot: "bg-primary" },
];

// ── Usage bar color ─────────────────────────────────────────────────
function usageBarColor(pct: number) {
  if (pct > 100) return "bg-destructive";
  if (pct >= 80) return "bg-warning";
  return "bg-primary";
}

function marginColor(v: number) {
  return v >= 0 ? "text-success" : "text-destructive";
}

// ── Component ───────────────────────────────────────────────────────
export function WorkspaceTable() {
  const navigate = useNavigate();
  const allData = useMemo(() => generateMockWorkspaces(87), []);

  const [filter, setFilter] = useState<QuickFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);

  // Debounce search
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [search]);

  // Filter + search
  // Count active advanced filters
  const advFilterCount = useMemo(() => {
    let c = 0;
    const df = DEFAULT_FILTERS;
    if (advancedFilters.statuses.length !== df.statuses.length || advancedFilters.statuses.some(s => !df.statuses.includes(s))) c++;
    if (advancedFilters.plans.length !== df.plans.length) c++;
    if (advancedFilters.alertTypes.length > 0) c++;
    if (advancedFilters.marginRange[0] !== df.marginRange[0] || advancedFilters.marginRange[1] !== df.marginRange[1]) c++;
    if (advancedFilters.usageLevel !== "any") c++;
    if (advancedFilters.accountManager !== "any") c++;
    return c;
  }, [advancedFilters]);

  const filtered = useMemo(() => {
    let d = allData;

    // Quick filter
    if (filter === "active") d = d.filter(w => w.status === "active");
    else if (filter === "onboarding") d = d.filter(w => w.status === "onboarding");
    else if (filter === "at_risk") d = d.filter(w => w.health === "red" || w.health === "amber");
    else if (filter === "negative_margin") d = d.filter(w => w.marginPct < 0);
    else if (filter === "overage") d = d.filter(w => w.convUsed > w.convIncluded || w.creditsUsed > w.creditsIncluded);

    // Advanced filters
    const af = advancedFilters;
    d = d.filter(w => af.statuses.includes(w.status));
    d = d.filter(w => af.plans.includes(w.plan));
    if (af.alertTypes.length > 0) d = d.filter(w => w.alerts.some(a => af.alertTypes.includes(a.type)));
    d = d.filter(w => w.marginPct >= af.marginRange[0] && w.marginPct <= af.marginRange[1]);
    if (af.usageLevel !== "any") {
      d = d.filter(w => {
        const pct = Math.round((w.convUsed / w.convIncluded) * 100);
        if (af.usageLevel === "low") return pct < 50;
        if (af.usageLevel === "medium") return pct >= 50 && pct < 80;
        if (af.usageLevel === "high") return pct >= 80 && pct <= 100;
        if (af.usageLevel === "over") return pct > 100;
        return true;
      });
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      d = d.filter(w => w.name.toLowerCase().includes(q));
    }
    return d;
  }, [allData, filter, debouncedSearch, advancedFilters]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { field, dir } = sort;
    arr.sort((a, b) => {
      let cmp = 0;
      if (field === "name") cmp = a.name.localeCompare(b.name);
      else if (field === "plan") cmp = a.plan.localeCompare(b.plan);
      else if (field === "health") cmp = a.health.localeCompare(b.health);
      else cmp = (a[field] as number) - (b[field] as number);
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = useCallback((field: SortField) => {
    setSort(prev => prev.field === field ? { field, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" });
    setPage(1);
  }, []);

  const handleFilterChange = (f: QuickFilter) => { setFilter(f); setPage(1); };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />;
    return sort.dir === "asc"
      ? <ArrowUp className="ml-1 h-3.5 w-3.5 text-foreground" />
      : <ArrowDown className="ml-1 h-3.5 w-3.5 text-foreground" />;
  };

  // Pagination range
  const pageButtons = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, page]);

  // ── Render ──────────────────────────────────────────────────────
  return (
    <>
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">Workspaces</h2>
          <Badge variant="outline" className="text-xs">{allData.length} total</Badge>
        </div>

        {/* Center – quick filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium transition-colors",
                filter === f.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {f.dot && <span className={cn("h-2 w-2 rounded-full", f.dot)} />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name…"
              className="h-9 w-[240px] pl-8 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="relative gap-1.5" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {advFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {advFilterCount}
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </CardHeader>

      {/* Error state */}
      {isError && (
        <div className="p-4">
          <ErrorBlock message="Failed to load workspaces." onRetry={() => {}} />
        </div>
      )}

      {/* Table */}
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] cursor-pointer select-none" onClick={() => toggleSort("name")}>
                <span className="inline-flex items-center">Workspace <SortIcon field="name" /></span>
              </TableHead>
              <TableHead className="w-[100px] cursor-pointer select-none" onClick={() => toggleSort("plan")}>
                <span className="inline-flex items-center">Plan <SortIcon field="plan" /></span>
              </TableHead>
              <TableHead className="w-[100px] cursor-pointer select-none text-right" onClick={() => toggleSort("mrr")}>
                <span className="inline-flex items-center justify-end w-full">MRR <SortIcon field="mrr" /></span>
              </TableHead>
              <TableHead className="w-[110px] cursor-pointer select-none text-right" onClick={() => toggleSort("cost")}>
                <span className="inline-flex items-center justify-end w-full">WUAMA Cost <SortIcon field="cost" /></span>
              </TableHead>
              <TableHead className="w-[100px] cursor-pointer select-none text-right" onClick={() => toggleSort("marginEur")}>
                <span className="inline-flex items-center justify-end w-full">Margin € <SortIcon field="marginEur" /></span>
              </TableHead>
              <TableHead className="w-[100px] cursor-pointer select-none text-right" onClick={() => toggleSort("marginPct")}>
                <span className="inline-flex items-center justify-end w-full">Margin % <SortIcon field="marginPct" /></span>
              </TableHead>
              <TableHead className="w-[120px] cursor-pointer select-none" onClick={() => toggleSort("creditsUsed")}>
                <span className="inline-flex items-center">Credits <SortIcon field="creditsUsed" /></span>
              </TableHead>
              <TableHead className="w-[100px]">Alerts</TableHead>
              <TableHead className="w-[60px] cursor-pointer select-none" onClick={() => toggleSort("health")}>
                <span className="inline-flex items-center">Health <SortIcon field="health" /></span>
              </TableHead>
              <TableHead className="w-[48px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading */}
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))}

            {/* Empty – no data at all */}
            {!isLoading && allData.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <EmptyState
                    title="No workspaces yet"
                    description="Create your first workspace to start tracking."
                    actionLabel="Create Workspace"
                    onAction={() => toast.info("Coming soon")}
                  />
                </TableCell>
              </TableRow>
            )}

            {/* Empty – filters return nothing */}
            {!isLoading && allData.length > 0 && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="flex flex-col items-center py-12 text-center">
                    <p className="text-sm text-muted-foreground">No workspaces match your filters</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFilter("all"); setSearch(""); }}>
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading && paginated.map(ws => {
              const creditPct = Math.round((ws.creditsUsed / ws.creditsIncluded) * 100);
              const negMargin = ws.marginPct < 0;

              return (
                <TableRow
                  key={ws.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    negMargin && "border-l-[3px] border-l-destructive",
                  )}
                  onClick={() => navigate(`/workspaces/${ws.id}`)}
                >
                  {/* Workspace */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="max-w-[180px] truncate text-sm font-medium">{ws.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>{ws.name}</TooltipContent>
                      </Tooltip>
                      <Badge variant={STATUS_MAP[ws.status].variant} className="w-fit text-[11px]">
                        {STATUS_MAP[ws.status].label}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Plan */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{ws.plan}</Badge>
                  </TableCell>

                  {/* MRR */}
                  <TableCell className="text-right text-sm font-medium">{formatCurrency(ws.mrr)}</TableCell>

                  {/* Cost */}
                  <TableCell className="text-right text-sm">{formatCurrency(ws.cost)}</TableCell>

                  {/* Margin € */}
                  <TableCell className={cn("text-right text-sm font-medium", marginColor(ws.marginEur))}>
                    {formatCurrency(ws.marginEur)}
                  </TableCell>

                  {/* Margin % */}
                  <TableCell>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn("text-sm font-medium", marginColor(ws.marginPct))}>{ws.marginPct}%</span>
                      <div className="h-1.5 w-full max-w-[60px] overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all", ws.marginPct >= 40 ? "bg-success" : ws.marginPct >= 20 ? "bg-warning" : "bg-destructive")}
                          style={{ width: `${Math.min(100, Math.max(0, ws.marginPct))}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Credits */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{ws.creditsUsed.toLocaleString("es-ES")} / {ws.creditsIncluded.toLocaleString("es-ES")}</span>
                      <div className="h-1.5 w-full max-w-[80px] overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full transition-all", usageBarColor(creditPct))} style={{ width: `${Math.min(100, creditPct)}%` }} />
                      </div>
                    </div>
                  </TableCell>

                  {/* Alerts */}
                  <TableCell>
                    {ws.alerts.length === 0 ? (
                      <Check className="h-4 w-4 text-muted-foreground/40" />
                    ) : (
                      <div className="flex items-center gap-1">
                        {ws.alerts.map((a, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                            </TooltipTrigger>
                            <TooltipContent>{a.label}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </TableCell>

                  {/* Health */}
                  <TableCell>
                    <span className={cn(
                      "inline-block h-2.5 w-2.5 rounded-full",
                      ws.health === "green" ? "bg-success" : ws.health === "amber" ? "bg-warning" : "bg-destructive",
                    )} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => toast.info("Coming soon")}>View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Coming soon")}>View invoices</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Coming soon")}>Manage plan</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Coming soon")}>Contact</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {!isLoading && sorted.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row">
          <p className="text-[13px] text-muted-foreground">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length} workspaces
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} />
              </PaginationItem>
              {pageButtons.map((pb, i) =>
                pb === "ellipsis" ? (
                  <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={pb}>
                    <PaginationLink href="#" isActive={pb === page} onClick={e => { e.preventDefault(); setPage(pb); }}>
                      {pb}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext href="#" onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-9 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>

    <AdvancedFiltersDrawer
      open={filtersOpen}
      onOpenChange={setFiltersOpen}
      filters={advancedFilters}
      onApply={(f) => { setAdvancedFilters(f); setPage(1); }}
    />
    </>
  );
}
