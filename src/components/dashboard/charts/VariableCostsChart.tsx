import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const data = [
  { month: "Sep", convCost: 320, creditCost: 180, convUnits: 1200, creditUnits: 150, isForecast: false },
  { month: "Oct", convCost: 280, creditCost: 200, convUnits: 1050, creditUnits: 170, isForecast: false },
  { month: "Nov", convCost: 350, creditCost: 220, convUnits: 1300, creditUnits: 190, isForecast: false },
  { month: "Dic", convCost: 300, creditCost: 250, convUnits: 1100, creditUnits: 210, isForecast: false },
  { month: "Ene", convCost: 380, creditCost: 270, convUnits: 1400, creditUnits: 230, isForecast: false },
  { month: "Feb", convCost: 400, creditCost: 300, convUnits: 1500, creditUnits: 260, isForecast: true },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold">{d.month} {d.isForecast ? "(Forecast)" : ""}</p>
      <p>Conv. Overages: <span className="font-medium">{d.convUnits.toLocaleString("es-ES")} units · {formatCurrency(d.convCost)}</span></p>
      <p>Credit Overages: <span className="font-medium">{d.creditUnits.toLocaleString("es-ES")} units · {formatCurrency(d.creditCost)}</span></p>
      <hr className="my-1 border-border" />
      <p className="font-medium">Total: {formatCurrency(d.convCost + d.creditCost)}</p>
    </div>
  );
}

export function VariableCostsChart() {
  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <h3 className="text-base font-semibold font-heading">Variable Costs</h3>
        <p className="text-[13px] text-muted-foreground">Conversations & Credit Overages</p>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        {/* Legend */}
        <div className="mb-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
            <span className="text-xs text-muted-foreground">Conversations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(240 60% 60%)" }} />
            <span className="text-xs text-muted-foreground">Credits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-muted-foreground bg-muted" />
            <span className="text-xs text-muted-foreground">Forecast</span>
          </div>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <pattern id="stripe" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="hsl(var(--primary))" strokeWidth="2" strokeOpacity="0.4" />
                </pattern>
                <pattern id="stripeIndigo" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="hsl(240 60% 60%)" strokeWidth="2" strokeOpacity="0.4" />
                </pattern>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `€${v}`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar
                dataKey="convCost"
                stackId="costs"
                radius={[0, 0, 0, 0]}
                maxBarSize={36}
                fill="hsl(var(--primary))"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload.isForecast ? "url(#stripe)" : "hsl(var(--primary))"}
                      rx={0}
                    />
                  );
                }}
              />
              <Bar
                dataKey="creditCost"
                stackId="costs"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
                fill="hsl(240 60% 60%)"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const isTop = true;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload.isForecast ? "url(#stripeIndigo)" : "hsl(240 60% 60%)"}
                      rx={isTop ? 4 : 0}
                      ry={isTop ? 4 : 0}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
