import { useState, useMemo } from "react";
import { CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSpanishMonth } from "@/lib/formatters";

const MONTHS = Array.from({ length: 12 }, (_, i) => getSpanishMonth(i));

interface MonthRangePickerProps {
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  onApply: (startMonth: number, startYear: number, endMonth: number, endYear: number) => void;
}

export function MonthRangePicker({
  startMonth: extStart,
  startYear: extStartY,
  endMonth: extEnd,
  endYear: extEndY,
  onApply,
}: MonthRangePickerProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(String(currentYear));
  const [startMonth, setStartMonth] = useState<number | null>(extStart);
  const [endMonth, setEndMonth] = useState<number | null>(extEnd);
  const [startYear, setStartYear] = useState<number | null>(extStartY);
  const [endYear, setEndYear] = useState<number | null>(extEndY);

  const selectedYear = parseInt(year);

  const isDisabled = (month: number) => {
    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && month > currentMonth) return true;
    return false;
  };

  const isInRange = (month: number) => {
    if (startMonth === null || endMonth === null || startYear === null || endYear === null) return false;
    const val = selectedYear * 12 + month;
    const s = startYear * 12 + startMonth;
    const e = endYear * 12 + endMonth;
    return val > s && val < e;
  };

  const isStart = (month: number) => startMonth === month && startYear === selectedYear;
  const isEnd = (month: number) => endMonth === month && endYear === selectedYear;

  const validationError = useMemo(() => {
    if (startMonth === null || endMonth === null || startYear === null || endYear === null) return null;
    const s = startYear * 12 + startMonth;
    const e = endYear * 12 + endMonth;
    if (e < s) return "El mes final debe ser posterior al inicial";
    return null;
  }, [startMonth, endMonth, startYear, endYear]);

  const handleMonthClick = (month: number, type: "start" | "end") => {
    if (type === "start") {
      setStartMonth(month);
      setStartYear(selectedYear);
    } else {
      setEndMonth(month);
      setEndYear(selectedYear);
    }
  };

  const handleApply = () => {
    if (startMonth !== null && endMonth !== null && startYear !== null && endYear !== null && !validationError) {
      onApply(startMonth, startYear, endMonth, endYear);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setStartMonth(extStart);
    setEndMonth(extEnd);
    setStartYear(extStartY);
    setEndYear(extEndY);
    setOpen(false);
  };

  const displayLabel = useMemo(() => {
    if (extStart !== null && extStartY !== null && extEnd !== null && extEndY !== null) {
      return `${getSpanishMonth(extStart)} ${extStartY} – ${getSpanishMonth(extEnd)} ${extEndY}`;
    }
    return "Select months";
  }, [extStart, extStartY, extEnd, extEndY]);

  const renderGrid = (type: "start" | "end") => {
    const selected = type === "start" ? startMonth : endMonth;
    const selectedY = type === "start" ? startYear : endYear;

    return (
      <div>
        <p className="text-card-label mb-2">{type === "start" ? "Start" : "End"}</p>
        <div className="grid grid-cols-3 gap-1">
          {MONTHS.map((label, i) => {
            const disabled = isDisabled(i);
            const active = selected === i && selectedY === selectedYear;
            const inRange = isInRange(i);

            return (
              <button
                key={`${type}-${i}`}
                disabled={disabled}
                onClick={() => handleMonthClick(i, type)}
                className={cn(
                  "h-8 rounded-sm text-xs font-medium transition-colors",
                  disabled && "text-muted-foreground/40 cursor-not-allowed",
                  !disabled && !active && !inRange && "hover:bg-muted text-foreground",
                  active && "bg-primary text-primary-foreground",
                  inRange && !active && "bg-primary/10",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm">
          <CalendarRange className="h-4 w-4" />
          <span>{displayLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 bg-popover p-4">
        {/* Year selector */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="mb-3 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month grids */}
        <div className="space-y-4">
          {renderGrid("start")}
          {renderGrid("end")}
        </div>

        {/* Validation */}
        {validationError && (
          <p className="mt-3 text-xs text-destructive">{validationError}</p>
        )}

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={startMonth === null || endMonth === null || !!validationError}
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
