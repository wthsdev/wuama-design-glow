import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/components/dashboard/KpiGrid";

const Index = () => {
  return (
    <div className="section-spacing">
      <DashboardHeader />
      <KpiGrid />
    </div>
  );
};

export default Index;
