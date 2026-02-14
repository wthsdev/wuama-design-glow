export type WorkspaceStatus = "active" | "onboarding" | "paused" | "cancelled";

export type AlertType = "conv_overage" | "credit_overage" | "negative_margin" | "overdue_invoice" | "stalled_onboarding";

export type HealthLevel = "green" | "amber" | "red";

export type QuickFilter = "all" | "active" | "at_risk" | "negative_margin" | "overage" | "onboarding";

export interface WorkspaceAlert {
  type: AlertType;
  label: string;
}

export interface Workspace {
  id: string;
  name: string;
  status: WorkspaceStatus;
  plan: string;
  mrr: number;
  cost: number;
  marginEur: number;
  marginPct: number;
  convUsed: number;
  convIncluded: number;
  creditsUsed: number;
  creditsIncluded: number;
  alerts: WorkspaceAlert[];
  health: HealthLevel;
}

export type SortField = "name" | "plan" | "mrr" | "cost" | "marginEur" | "marginPct" | "convUsed" | "creditsUsed" | "health";
export type SortDir = "asc" | "desc";
