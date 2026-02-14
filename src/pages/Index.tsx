import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { AnalyticsZone } from "@/components/dashboard/AnalyticsZone";
import { WorkspaceTable } from "@/components/dashboard/workspace-table/WorkspaceTable";

type DataMode = "forecast" | "real";

const Index = () => {
  const [mode, setMode] = useState<DataMode>("forecast");

  return (
    <div className="section-spacing">
      <DashboardHeader mode={mode} onModeChange={setMode} />
      <KpiGrid mode={mode} />
      <AnalyticsZone />
      <WorkspaceTable />
    </div>
  );
};

export default Index;
