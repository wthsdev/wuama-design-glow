import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { AnalyticsZone } from "@/components/dashboard/AnalyticsZone";
import { WorkspaceTable } from "@/components/dashboard/workspace-table/WorkspaceTable";

const Index = () => {
  return (
    <div className="section-spacing">
      <DashboardHeader />
      <KpiGrid />
      <AnalyticsZone />
      <WorkspaceTable />
    </div>
  );
};

export default Index;
