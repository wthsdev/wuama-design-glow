import { useState, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { AnalyticsZone } from "@/components/dashboard/AnalyticsZone";
import { WorkspaceTable } from "@/components/dashboard/workspace-table/WorkspaceTable";

type DataMode = "forecast" | "real";

const Index = () => {
  const [mode, setMode] = useState<DataMode>("forecast");
  const [startMonth, setStartMonth] = useState<number | null>(9);
  const [startYear, setStartYear] = useState<number | null>(2025);
  const [endMonth, setEndMonth] = useState<number | null>(11);
  const [endYear, setEndYear] = useState<number | null>(2025);

  const handleApplyRange = useCallback(
    (sm: number, sy: number, em: number, ey: number) => {
      setStartMonth(sm);
      setStartYear(sy);
      setEndMonth(em);
      setEndYear(ey);
    },
    [],
  );

  return (
    <div className="section-spacing">
      <DashboardHeader
        mode={mode}
        onModeChange={setMode}
        startMonth={startMonth}
        startYear={startYear}
        endMonth={endMonth}
        endYear={endYear}
        onApplyRange={handleApplyRange}
      />
      <KpiGrid mode={mode} endMonth={endMonth} endYear={endYear} />
      <AnalyticsZone />
      <WorkspaceTable />
    </div>
  );
};

export default Index;
