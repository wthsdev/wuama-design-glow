import { useMemo } from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { getSpanishMonth } from "@/lib/formatters";

// ─── Demo data ────────────────────────────────────────────────────────
const coreKpis = [
  {
    label: "MRR",
    value: "€12.450",
    delta: "+12%",
    deltaValue: 12,
    formula: "MRR = Σ Active subscriptions × plan price",
    formulaDetail:
      "MRR = Σ workspace.monthly_fee for all active workspaces",
    formulaNote: "Excludes setup fees and one-time extras.",
    breakdownItems: [
      { label: "Recurring Revenue", value: "€10.200" },
      { label: "From Pro plans", value: "€6.800", indent: true },
      { label: "From Starter plans", value: "€3.400", indent: true },
      { label: "Setup Fees (excluded from MRR)", value: "€2.800" },
      { label: "Extras Revenue", value: "€450" },
      { label: "Total Revenue", value: "€13.450", bold: true, separatorAbove: true },
    ],
    topContributors: [
      { name: "Cipher Digital", plan: "Enterprise", contribution: "€581" },
      { name: "Beta Labs", plan: "Growth", contribution: "€548" },
      { name: "Coral Digital", plan: "Starter", contribution: "€503" },
      { name: "Alpha Plus", plan: "Pro", contribution: "€482" },
      { name: "Aura Group", plan: "Growth", contribution: "€477" },
    ],
    dataSourceNote: "Forecast: based on active plans and subscriptions as of Feb 2026.",
    sparklineData: [8200, 9100, 9800, 10500, 11200, 12450],
  },
  {
    label: "ARR",
    value: "€149.400",
    delta: "+12%",
    deltaValue: 12,
    formula: "ARR = MRR × 12",
    formulaDetail: "ARR = MRR × 12",
    formulaNote: "Annualized projection based on current MRR.",
    breakdownItems: [
      { label: "Current MRR", value: "€12.450" },
      { label: "ARR (MRR × 12)", value: "€149.400", bold: true, separatorAbove: true },
    ],
    dataSourceNote: "Forecast: based on current MRR as of Feb 2026.",
    sparklineData: [98400, 109200, 117600, 126000, 134400, 149400],
  },
  {
    label: "WUAMA Base Cost",
    value: "€6.200",
    delta: "+8%",
    deltaValue: 8,
    invertDelta: true,
    formula: "Cost = Platform fees + infrastructure + licenses",
    formulaDetail:
      "Total cost of running WUAMA platform including infrastructure, third-party licenses, and operational costs. A rising cost is flagged as negative trend.",
    sparklineData: [4800, 5100, 5300, 5600, 5750, 6200],
  },
  {
    label: "Recurring Gross Profit",
    value: "€6.250",
    delta: "+15%",
    deltaValue: 15,
    formula: "Gross Profit = MRR − WUAMA Cost",
    formulaDetail: "Revenue minus direct costs. Represents the margin available before operational expenses.",
    sparklineData: [3400, 4000, 4500, 4900, 5450, 6250],
  },
  {
    label: "Recurring Gross Margin",
    value: "50,2%",
    delta: "+2pp",
    deltaValue: 2,
    formula: "Gross Margin = (Gross Profit / MRR) × 100",
    formulaDetail:
      "Percentage of revenue retained after direct costs. Target is above 60%. Measured in percentage points (pp).",
    sparklineData: [41, 44, 46, 47, 49, 50.2],
  },
];

const secondaryKpis = [
  {
    label: "Setup Fees",
    value: "€2.800",
    delta: "+5%",
    deltaValue: 5,
    secondaryText: "3 installations",
    formula: "Sum of one-time setup charges",
  },
  {
    label: "Extras Revenue",
    value: "€450",
    delta: "+3%",
    deltaValue: 3,
    secondaryText: "1.200 conversations + 300 credits over",
    formula: "Sum of overage charges + add-on purchases",
  },
  {
    label: "Extras Cost",
    value: "€180",
    delta: "+6%",
    deltaValue: 6,
    invertDelta: true,
    secondaryText: "1.200 conversations + 300 credits over",
    formula: "Sum of variable costs associated with extras (Meta fees, credit provider costs)",
  },
  {
    label: "This Month Margin",
    value: "€2.170",
    delta: "+4%",
    deltaValue: 4,
    secondaryText: "Installation + extra usage only",
    formula: "This Month Margin = (Setup Fees + Extras Revenue) − Extras Cost",
    formulaDetail: "Margin generated from non-recurring revenue streams after deducting variable costs.",
  },
  {
    label: "Net New MRR",
    value: "+€1.250",
    delta: "+€1.250",
    deltaValue: 1250,
    formula: "New MRR + Expansion − Contraction − Churn",
    formulaDetail:
      "Net change in MRR from new subscriptions, expansions, contractions and churned accounts.",
  },
  {
    label: "Churn Rate",
    value: "2,3%",
    delta: "−0,5pp",
    deltaValue: -0.5,
    invertDelta: true,
    formula: "Churn = Lost MRR / Previous MRR × 100",
    formulaDetail: "Percentage of MRR lost to cancellations. Lower is better — decrease shown in green.",
  },
  {
    label: "Active Workspaces",
    value: "87",
    delta: "+4",
    deltaValue: 4,
    secondaryText: "Onboarding 6 · At risk 5",
    formula: "Count of workspaces with active subscription",
  },
  {
    label: "At Risk",
    value: "5",
    delta: "+2",
    deltaValue: 2,
    invertDelta: true,
    formula: "Workspaces with usage below threshold or pending churn signals",
    formulaDetail:
      "Workspaces flagged by the risk model based on low usage, failed payments, or explicit cancellation intent.",
    leftBorderClass: "border-l-[3px] border-l-destructive",
  },
];

interface KpiGridProps {
  mode: "forecast" | "real";
  endMonth: number | null;
  endYear: number | null;
}

export function KpiGrid({ mode, endMonth, endYear }: KpiGridProps) {
  const filteredSecondaryKpis = mode === "forecast"
    ? secondaryKpis.filter((kpi) => kpi.label !== "Churn Rate" && kpi.label !== "At Risk")
    : secondaryKpis;

  const totalRevenueKpi = {
    label: "Total Revenue",
    value: "€15.700",
    delta: "+10%",
    deltaValue: 10,
    formula: "Total Revenue = MRR + Setup Fees + Extras Revenue",
    formulaDetail: "Sum of all revenue streams: recurring subscriptions, one-time setup fees, and extra usage charges.",
    formulaNote: "Includes all revenue streams for the selected period.",
    dataSourceNote: "Based on invoiced data for selected period.",
    breakdownItems: [
      { label: "MRR (Recurring)", value: "€12.450" },
      { label: "Setup Fees", value: "€2.800" },
      { label: "Extras Revenue", value: "€450" },
      { label: "Total Revenue", value: "€15.700", bold: true, separatorAbove: true },
    ],
    sparklineData: [9600, 10500, 11200, 11800, 12500, 15700],
  } as (typeof coreKpis)[number];

  const displayCoreKpis = useMemo(() => {
    let kpis = [...coreKpis];
    if (mode === "real") {
      kpis = kpis.filter((kpi) => kpi.label !== "ARR");
      if (endMonth !== null && endYear !== null) {
        const suffix = ` ${getSpanishMonth(endMonth)} ${endYear}`;
        kpis = kpis.map((kpi) =>
          kpi.label === "MRR" ? { ...kpi, label: `MRR${suffix}` } : kpi
        );
      }
      // Insert Total Revenue after MRR
      const mrrIndex = kpis.findIndex((kpi) => kpi.label.startsWith("MRR"));
      if (mrrIndex !== -1) {
        kpis.splice(mrrIndex + 1, 0, totalRevenueKpi);
      }
    }
    return kpis;
  }, [mode, endMonth, endYear]);

  return (
    <div className="space-y-4">
      {/* Row 1 — Core KPIs */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recurring Run-Rate</h2>
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${mode === "real" ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {displayCoreKpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} variant="core" />
          ))}
        </div>
      </div>

      {/* Row 2 — Secondary KPIs */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">This Month: One-Off & Usage</h2>
        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${mode === "forecast" ? "lg:grid-cols-6" : "lg:grid-cols-8"}`}>
          {filteredSecondaryKpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} variant="secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}
