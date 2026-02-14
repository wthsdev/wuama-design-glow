/**
 * WUAMA Data Formatting Utilities
 * European format conventions for a Spanish-speaking B2B SaaS dashboard.
 */

// ─── Currency ────────────────────────────────────────────────────────
/**
 * Format a number as European currency (€12.450,00).
 * @param value  The numeric value
 * @param compact  If true, use compact notation (€12,4K / €1,2M)
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `€${(value / 1_000_000).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `€${(value / 1_000).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
    }
  }
  return `€${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Percentage ──────────────────────────────────────────────────────
/**
 * Format a number as a percentage string with one decimal.
 * Returns the raw string — use `getPercentageColor` for styling.
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/** Returns a Tailwind text color class based on sign. */
export function getPercentageColor(value: number): string {
  if (value > 0) return "text-success";
  if (value < 0) return "text-destructive";
  return "text-muted-foreground";
}

/** Returns "arrow-up" | "arrow-down" | null */
export function getPercentageDirection(value: number): "up" | "down" | null {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return null;
}

// ─── Dates ───────────────────────────────────────────────────────────
const SPANISH_MONTHS_SHORT = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

/** Format a Date to "Ene 2024" style string */
export function formatMonthYear(date: Date): string {
  return `${SPANISH_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

/** Format a Date to "15 Ene" style string */
export function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${SPANISH_MONTHS_SHORT[date.getMonth()]}`;
}

/** Get a short Spanish month abbreviation by zero-based index */
export function getSpanishMonth(index: number): string {
  return SPANISH_MONTHS_SHORT[index] ?? "";
}
