import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** KPI card skeleton — label 60%, value 40%, delta 30% */
export function SkeletonKpiCard() {
  return (
    <Card>
      <CardHeader className="space-y-2 pb-2">
        <Skeleton className="h-3 w-[60%]" />
        <Skeleton className="h-7 w-[40%]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-[30%]" />
      </CardContent>
    </Card>
  );
}

/** Chart card skeleton — full area block */
export function SkeletonChartCard({ height = 220 }: { height?: number }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full rounded-md" style={{ height }} />
      </CardContent>
    </Card>
  );
}

/** Table skeleton — 8 rows matching column widths */
export function SkeletonTableRows({ rows = 8, columns = 11 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="h-[52px] border-b">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="px-4">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Alert Center skeleton — 5 lines with icon circle + text blocks */
export function SkeletonAlertCenter() {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 p-5 pb-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <div className="flex-1" />
        <Skeleton className="h-5 w-8 rounded-full" />
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-[18px] w-[18px] rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-[70%]" />
                <Skeleton className="h-3 w-[40%]" />
              </div>
              <Skeleton className="h-7 w-12 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Legacy SkeletonCard export for backwards compatibility */
export function SkeletonCard() {
  return <SkeletonKpiCard />;
}

/** Legacy SkeletonTableRow export */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="h-12 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
