import { useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/formatters";

const data12m = [
  { month: "Mar", real: 8200, forecast: null, recurring: 7500, setup: 400, extras: 300, totalReal: 8200, totalForecast: null },
  { month: "Abr", real: 8900, forecast: null, recurring: 8100, setup: 500, extras: 300, totalReal: 8900, totalForecast: null },
  { month: "May", real: 9400, forecast: null, recurring: 8600, setup: 450, extras: 350, totalReal: 9400, totalForecast: null },
  { month: "Jun", real: 9800, forecast: null, recurring: 9000, setup: 400, extras: 400, totalReal: 9800, totalForecast: null },
  { month: "Jul", real: 10200, forecast: null, recurring: 9400, setup: 500, extras: 300, totalReal: 10200, totalForecast: null },
  { month: "Ago", real: 10500, forecast: null, recurring: 9700, setup: 450, extras: 350, totalReal: 10500, totalForecast: null },
  { month: "Sep", real: 10900, forecast: null, recurring: 10100, setup: 400, extras: 400, totalReal: 10900, totalForecast: null },
  { month: "Oct", real: 11200, forecast: null, recurring: 10400, setup: 500, extras: 300, totalReal: 11200, totalForecast: null },
  { month: "Nov", real: 11800, forecast: null, recurring: 10900, setup: 500, extras: 400, totalReal: 11800, totalForecast: null },
  { month: "Dic", real: 12100, forecast: null, recurring: 11200, setup: 500, extras: 400, totalReal: 12100, totalForecast: null },
  { month: "Ene", real: 12450, forecast: null, recurring: 11500, setup: 550, extras: 400, totalReal: 12450, totalForecast: null },
  { month: "Feb", real: null, forecast: 13100, recurring: 12100, setup: 500, extras: 500, totalReal: null, totalForecast: 13100 },
];

const data6m = data12m.slice(-6);

type ViewMode = "mrr" | "total";

const viewConfig: Record<ViewMode, { title: string; subtitle: string }> = {
  mrr: { title: "MRR Evolution", subtitle: "Monthly Recurring Revenue" },
  total: { title: "Total Revenue Evolution", subtitle: "Recurring + Setup + Extras" },
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold">{d.month}</p>
      {d.real != null && <p>Real: <span className="font-medium">{formatCurrency(d.real)}</span></p>}
      {d.forecast != null && <p>Forecast: <span className="font-medium">{formatCurrency(d.forecast)}</span></p>}
      <hr className="my-1 border-border" />
      <p className="text-xs text-muted-foreground">Recurring: {formatCurrency(d.recurring)}</p>
      <p className="text-xs text-muted-foreground">Setup: {formatCurrency(d.setup)}</p>
      <p className="text-xs text-muted-foreground">Extras: {formatCurrency(d.extras)}</p>
    </div>
  );
}

const formatYAxis = (v: number) => {
  if (v >= 1000) return `€${(v / 1000).toFixed(0)}K`;
  return `€${v}`;
};

export function MrrTimelineChart() {
  const [range, setRange] = useState("12M");
  const [view, setView] = useState<ViewMode>("mrr");
  const chartData = range === "6M" ? data6m : data12m;

  const realKey = view === "mrr" ? "real" : "totalReal";
  const forecastKey = view === "mrr" ? "forecast" : "totalForecast";
  const { title, subtitle } = viewConfig[view];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between p-6 pb-2">
        <div>
          <h3 className="text-base font-semibold font-heading">{title}</h3>
          <p className="text-[13px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="mrr" className="text-xs px-2.5 h-6">MRR</TabsTrigger>
              <TabsTrigger value="total" className="text-xs px-2.5 h-6">Total Revenue</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList className="h-8">
              <TabsTrigger value="6M" className="text-xs px-2.5 h-6">6M</TabsTrigger>
              <TabsTrigger value="12M" className="text-xs px-2.5 h-6">12M</TabsTrigger>
              <TabsTrigger value="All" className="text-xs px-2.5 h-6">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={realKey}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#mrrGradient)"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey={forecastKey}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
