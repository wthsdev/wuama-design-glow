import { AlertTriangle, RefreshCw, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBlockProps {
  message?: string;
  onRetry?: () => void;
  detail?: string;
}

/** Per-card / per-section error state with subtle red tint */
export function ErrorBlock({
  message = "Unable to load data",
  onRetry,
  detail = "5xx error — reported automatically",
}: ErrorBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-[hsl(0_80%_98%)] py-8 text-center dark:bg-destructive/5">
      <AlertTriangle className="mb-2 h-6 w-6 text-destructive" />
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">{detail}</p>
    </div>
  );
}

/** Full-page error state when API is unreachable */
export function FullPageError({
  onRetry,
  cacheTimestamp,
}: {
  onRetry?: () => void;
  cacheTimestamp?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <CloudOff className="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 className="font-heading text-xl font-semibold">Connection issue</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We're having trouble reaching the server. Your last data snapshot is shown below.
      </p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

/** Stale data amber banner — placed at top of page */
export function StaleDataBanner({ timestamp }: { timestamp: string }) {
  return (
    <div className="rounded-md border border-warning/30 bg-warning/10 px-4 py-2.5 text-center text-sm text-warning-foreground">
      Showing cached data from <span className="font-medium">{timestamp}</span> — some information may be outdated
    </div>
  );
}
