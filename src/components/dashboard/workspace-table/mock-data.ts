import type { Workspace } from "./types";

const PLANS = ["Starter", "Growth", "Pro", "Enterprise"];
const NAMES = [
  "Acme Corp", "Beta Labs", "Creative Studio", "Delta Agency", "Echo Digital",
  "Foxtrot Media", "Gamma Solutions", "Horizon Group", "Impulse Tech", "Jupiter Consulting",
  "Kilo Marketing", "Lima Ventures", "Metro Design", "Nova Partners", "Omega Works",
  "Pixel Agency", "Quantum Hub", "Rocket Studio", "Sigma Co", "Tango Digital",
  "Ultra Creative", "Vertex Labs", "Wave Media", "Xenon Group", "Yota Solutions",
  "Zenith Agency", "Alpha Plus", "Bravo Studio", "Coral Digital", "Dawn Agency",
  "Element Co", "Flux Creative", "Grid Solutions", "Halo Digital", "Ion Studio",
  "Jade Consulting", "Karma Labs", "Lux Agency", "Mint Digital", "Neon Works",
  "Orbit Media", "Prism Agency", "Quest Digital", "Rise Studio", "Spark Co",
  "Tide Solutions", "Unity Labs", "Vibe Agency", "Warp Digital", "Xero Studio",
  "Zeal Creative", "Apex Group", "Bolt Agency", "Crest Digital", "Drift Studio",
  "Edge Solutions", "Fern Creative", "Glow Agency", "Haven Digital", "Ivy Studios",
  "Jet Agency", "Keen Labs", "Loop Digital", "Mist Studio", "North Agency",
  "Opal Creative", "Peak Solutions", "Quill Agency", "Reef Digital", "Stone Studio",
  "Tusk Agency", "Umbra Labs", "Vale Digital", "Wind Creative", "Xeon Agency",
  "Yield Studio", "Zone Digital", "Aura Group", "Bliss Agency", "Cipher Digital",
  "Duo Studio", "Ember Agency", "Flair Creative", "Grit Solutions",
];

function rand(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function pickHealth(marginPct: number, alerts: Workspace["alerts"]): Workspace["health"] {
  if (marginPct < 0 || alerts.some(a => a.type === "negative_margin")) return "red";
  if (marginPct < 20 || alerts.length > 0) return "amber";
  return "green";
}

export function generateMockWorkspaces(count = 87): Workspace[] {
  return NAMES.slice(0, count).map((name, i) => {
    const mrr = rand(80, 600);
    const cost = rand(30, mrr);
    const marginEur = mrr - cost;
    const marginPct = Math.round((marginEur / mrr) * 100);
    const convIncluded = rand(500, 5000);
    const convUsed = rand(200, Math.round(convIncluded * 1.4));
    const creditsIncluded = rand(100, 2000);
    const creditsUsed = rand(50, Math.round(creditsIncluded * 1.3));

    const status: Workspace["status"] =
      i < 5 ? "onboarding" : i >= count - 3 ? "paused" : i === count - 4 ? "cancelled" : "active";

    const alerts: Workspace["alerts"] = [];
    if (convUsed > convIncluded) alerts.push({ type: "conv_overage", label: "Conv overage" });
    if (creditsUsed > creditsIncluded) alerts.push({ type: "credit_overage", label: "Credit overage" });
    if (marginPct < 0) alerts.push({ type: "negative_margin", label: "Negative margin" });
    if (i % 17 === 0) alerts.push({ type: "overdue_invoice", label: "Overdue invoice" });
    if (status === "onboarding" && i % 2 === 0) alerts.push({ type: "stalled_onboarding", label: "Stalled onboarding" });

    return {
      id: `ws-${i + 1}`,
      name,
      status,
      plan: PLANS[i % PLANS.length],
      mrr,
      cost,
      marginEur,
      marginPct,
      convUsed,
      convIncluded,
      creditsUsed,
      creditsIncluded,
      alerts,
      health: pickHealth(marginPct, alerts),
    };
  });
}
