import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { AnalyticsZone } from "@/components/dashboard/AnalyticsZone";

const Index = () => {
  return (
    <div className="section-spacing">
      <DashboardHeader />
      <KpiGrid />
      <AnalyticsZone />
    </div>
  );
};

export default Index;
