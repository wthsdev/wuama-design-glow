import { KpiCard } from "@/components/dashboard/KpiCard";

// ─── Demo data ────────────────────────────────────────────────────────
const coreKpis = [
  {
    label: "MRR",
    value: "€12.450",
    delta: "+12%",
    deltaValue: 12,
    formula: "MRR = Σ Active subscriptions × plan price",
    formulaDetail:
      "Monthly Recurring Revenue is the sum of all active workspace subscriptions multiplied by their respective plan price. Excludes one-time fees and extras.",
    sparklineData: [8200, 9100, 9800, 10500, 11200, 12450],
  },
  {
    label: "ARR",
    value: "€149.400",
    delta: "+12%",
    deltaValue: 12,
    formula: "ARR = MRR × 12",
    formulaDetail: "Annual Recurring Revenue is calculated by multiplying the current MRR by 12 months.",
    sparklineData: [98400, 109200, 117600, 126000, 134400, 149400],
  },
  {
    label: "WUAMA Cost",
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
    label: "Gross Profit",
    value: "€6.250",
    delta: "+15%",
    deltaValue: 15,
    formula: "Gross Profit = MRR − WUAMA Cost",
    formulaDetail: "Revenue minus direct costs. Represents the margin available before operational expenses.",
    sparklineData: [3400, 4000, 4500, 4900, 5450, 6250],
  },
  {
    label: "Gross Margin",
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
    secondaryText: "1.200 conv + 300 credits over",
    formula: "Sum of overage charges + add-on purchases",
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
    secondaryText: "●●●●● ●●●●● ●●●●● + 72 more",
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

export function KpiGrid() {
  return (
    <div className="space-y-4">
      {/* Row 1 — Core KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {coreKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} variant="core" />
        ))}
      </div>

      {/* Row 2 — Secondary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {secondaryKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} variant="secondary" />
        ))}
      </div>
    </div>
  );
}
