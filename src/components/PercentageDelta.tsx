import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage, getPercentageColor, getPercentageDirection } from "@/lib/formatters";

interface PercentageDeltaProps {
  value: number;
  className?: string;
}

export function PercentageDelta({ value, className }: PercentageDeltaProps) {
  const direction = getPercentageDirection(value);
  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : null;

  return (
    <span className={cn("inline-flex items-center gap-0.5 text-sm font-medium", getPercentageColor(value), className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {formatPercentage(value)}
    </span>
  );
}
