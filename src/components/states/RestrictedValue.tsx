import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function RestrictedValue() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <span>—</span>
          <Lock className="h-3.5 w-3.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent>Sin permisos</TooltipContent>
    </Tooltip>
  );
}
