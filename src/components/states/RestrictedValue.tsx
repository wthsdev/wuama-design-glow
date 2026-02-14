import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

/** Inline restricted value for individual cells — shows '—' + lock icon */
export function RestrictedValue() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <span>—</span>
          <Lock className="h-3.5 w-3.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        You don't have permission to view financial data. Contact your administrator.
      </TooltipContent>
    </Tooltip>
  );
}

/** Full section restricted state — centered lock inside a card */
export function RestrictedSection({
  requiredRole = "Finance",
  onRequestAccess,
}: {
  requiredRole?: string;
  onRequestAccess?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-base font-semibold">Restricted</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        This section requires <span className="font-medium">{requiredRole}</span> permissions.
      </p>
      {onRequestAccess && (
        <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={onRequestAccess}>
          Request access
        </Button>
      )}
    </div>
  );
}
