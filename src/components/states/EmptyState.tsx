import { Plus, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function EmptyState({
  title = "Sin datos",
  description = "No hay información disponible en este momento.",
  actionLabel,
  onAction,
  icon,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon ?? <Building2 className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-section-title mb-1">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
      {secondaryLabel && onSecondary && (
        <Button variant="ghost" size="sm" className="mt-2 gap-1 text-xs" onClick={onSecondary}>
          {secondaryLabel}
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

/** Full-page empty state for when no workspaces exist */
export function FullPageEmptyState({ onCreateWorkspace }: { onCreateWorkspace?: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-5 rounded-full bg-muted p-5">
        {/* Simple workspace + plus SVG icon */}
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-muted-foreground">
          <rect x="8" y="16" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <rect x="14" y="22" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="24" y="22" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="14" y="32" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="24" y="32" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="20" y="42" width="4" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="44" cy="20" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="44" y1="15" x2="44" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="39" y1="20" x2="49" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="font-heading text-[22px] font-semibold">Welcome to your Dashboard</h2>
      <p className="mt-2 max-w-[400px] text-sm text-muted-foreground">
        Create your first workspace to start tracking revenue, costs, and performance.
      </p>
      <Button size="lg" className="mt-6 gap-2" onClick={onCreateWorkspace}>
        <Plus className="h-4 w-4" />
        Create Workspace
      </Button>
      <Button variant="ghost" size="sm" className="mt-2 gap-1 text-xs text-muted-foreground">
        Learn more about Workspaces
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  );
}

/** Section empty state — fits inside a card */
export function SectionEmptyState({
  icon,
  title = "No invoiced data for this period",
  description = "Try selecting a different date range or switch to Forecast mode.",
  actionLabel,
  onAction,
}: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 rounded-full bg-muted p-2.5">
        {icon ?? <Building2 className="h-10 w-10 text-muted-foreground" />}
      </div>
      <p className="text-base font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <button
          className="mt-3 text-sm font-medium text-primary hover:underline"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Table empty state when filters return nothing */
export function TableEmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3 rounded-full bg-muted p-2.5">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-muted-foreground">
          <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="25" y1="25" x2="33" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-base font-medium">No workspaces match your filters</p>
      <p className="mt-1 text-[13px] text-muted-foreground">Try adjusting your search or filters.</p>
      {onClearFilters && (
        <Button variant="ghost" size="sm" className="mt-3" onClick={onClearFilters}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}
