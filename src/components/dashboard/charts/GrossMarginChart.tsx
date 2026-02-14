import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const data = [
  { month: "Sep", margin: 38, profit: 3800, revenue: 10000, cost: 6200 },
  { month: "Oct", margin: 42, profit: 4700, revenue: 11200, cost: 6500 },
  { month: "Nov", margin: 45, profit: 5310, revenue: 11800, cost: 6490 },
  { month: "Dic", margin: 44, profit: 5324, revenue: 12100, cost: 6776 },
  { month: "Ene", margin: 48, profit: 5976, revenue: 12450, cost: 6474 },
  { month: "Feb", margin: 50.2, profit: 6580, revenue: 13100, cost: 6520 },
];

const getBarColor = (margin: number) => {
  if (margin > 40) return "hsl(var(--success))";
  if (margin >= 20) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold">{d.month}</p>
      <p>Margin: <span className="font-medium">{d.margin.toFixed(1)}%</span></p>
      <p>Gross Profit: <span className="font-medium">{formatCurrency(d.profit)}</span></p>
      <p className="text-xs text-muted-foreground">Revenue: {formatCurrency(d.revenue)}</p>
      <p className="text-xs text-muted-foreground">Cost: {formatCurrency(d.cost)}</p>
    </div>
  );
}

export function GrossMarginChart() {
  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <h3 className="text-base font-semibold font-heading">Gross Margin % by Month</h3>
        <p className="text-[13px] text-muted-foreground">Margin performance vs target</p>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 60]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={45}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="6 4"
                label={{ value: "Target 45%", position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <Bar dataKey="margin" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.margin)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
