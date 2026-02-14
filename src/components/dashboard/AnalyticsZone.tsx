import { MrrTimelineChart } from "@/components/dashboard/charts/MrrTimelineChart";
import { GrossMarginChart } from "@/components/dashboard/charts/GrossMarginChart";
import { VariableCostsChart } from "@/components/dashboard/charts/VariableCostsChart";
import { AlertCenter } from "@/components/dashboard/AlertCenter";

export function AnalyticsZone() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Left — Charts */}
      <div className="space-y-4 lg:col-span-8">
        <MrrTimelineChart />
        <GrossMarginChart />
        <VariableCostsChart />
      </div>

      {/* Right — Alert Center */}
      <div className="lg:col-span-4">
        <AlertCenter />
      </div>
    </div>
  );
}
