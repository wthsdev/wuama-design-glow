import { useState, useMemo } from "react";
import { BookOpen, HelpCircle, ExternalLink, Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ── data ─────────────────────────────────────────────── */

interface HelpEntry {
  id: string;
  title: string;
  section: string;
  content: React.ReactNode;
}

const entries: HelpEntry[] = [
  // Key Metrics
  {
    id: "mrr",
    title: "MRR (Monthly Recurring Revenue)",
    section: "Key Metrics",
    content: (
      <>
        <p className="text-sm text-foreground">Sum of all active subscription fees billed monthly. Excludes one-time setup fees and extras.</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">MRR = Σ workspace.monthly_fee (active)</pre>
        <p className="mt-2 text-xs text-muted-foreground"><strong>Forecast mode:</strong> Based on currently active plans and their monthly price.</p>
        <p className="text-xs text-muted-foreground"><strong>Real mode:</strong> Sum of invoiced subscription line items for the selected period.</p>
      </>
    ),
  },
  {
    id: "arr",
    title: "ARR (Annual Recurring Revenue)",
    section: "Key Metrics",
    content: (
      <>
        <p className="text-sm text-foreground">Annualised projection of recurring revenue.</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">ARR = MRR × 12</pre>
        <p className="mt-2 text-xs text-muted-foreground"><strong>Forecast mode:</strong> Current MRR × 12.</p>
        <p className="text-xs text-muted-foreground"><strong>Real mode:</strong> Average MRR over the selected period × 12.</p>
      </>
    ),
  },
  {
    id: "gross-profit",
    title: "Gross Profit",
    section: "Key Metrics",
    content: (
      <>
        <p className="text-sm text-foreground">Revenue minus direct variable costs (platform fees, infrastructure, licences).</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">Gross Profit = MRR − WUAMA Cost</pre>
        <p className="mt-2 text-xs text-muted-foreground"><strong>Forecast mode:</strong> Estimated from active plans minus projected costs.</p>
        <p className="text-xs text-muted-foreground"><strong>Real mode:</strong> Calculated from invoiced revenue minus actual costs.</p>
      </>
    ),
  },
  {
    id: "gross-margin",
    title: "Gross Margin %",
    section: "Key Metrics",
    content: (
      <>
        <p className="text-sm text-foreground">Percentage of revenue retained after direct costs. Target is above 60%.</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">Gross Margin = (Gross Profit / MRR) × 100</pre>
        <p className="mt-2 text-xs text-muted-foreground"><strong>Forecast mode:</strong> Based on projected profit and revenue.</p>
        <p className="text-xs text-muted-foreground"><strong>Real mode:</strong> Based on actual invoiced figures.</p>
      </>
    ),
  },
  {
    id: "net-new-mrr",
    title: "Net New MRR",
    section: "Key Metrics",
    content: (
      <>
        <p className="text-sm text-foreground">Net change in MRR from new subscriptions, expansions, contractions, and churn.</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">Net New MRR = New + Expansion − Contraction − Churn</pre>
        <p className="mt-2 text-xs text-muted-foreground"><strong>Forecast mode:</strong> Projected from pipeline and known changes.</p>
        <p className="text-xs text-muted-foreground"><strong>Real mode:</strong> Calculated from actual MRR movements in the period.</p>
      </>
    ),
  },
  {
    id: "churn-rate",
    title: "Churn Rate",
    section: "Key Metrics",
    content: (
      <>
        <p className="text-sm text-foreground">Percentage of MRR lost to cancellations. Lower is better.</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">Churn Rate = (Lost MRR / Previous MRR) × 100</pre>
        <p className="mt-2 text-xs text-muted-foreground"><strong>Forecast mode:</strong> Based on at-risk signals and historical patterns.</p>
        <p className="text-xs text-muted-foreground"><strong>Real mode:</strong> Actual churn from the selected period.</p>
      </>
    ),
  },
  // Data Modes
  {
    id: "forecast-vs-real",
    title: "Forecast vs Real — What's the difference?",
    section: "Data Modes",
    content: (
      <>
        <p className="text-sm text-foreground"><strong>Forecast</strong> shows estimates based on currently active plans, subscriptions, and projected usage. It answers: "If nothing changes, what will this month look like?"</p>
        <p className="mt-2 text-sm text-foreground"><strong>Real</strong> shows invoiced data for a selected date range. It answers: "What actually happened?" You can select specific months using the date range picker.</p>
      </>
    ),
  },
  {
    id: "meta-fees",
    title: "What does Meta (WhatsApp) fees mean?",
    section: "Data Modes",
    content: (
      <p className="text-sm text-foreground">Meta conversation fees are charged directly to the end client by Meta. They are <strong>not</strong> included in the agency P&L or margin calculations. They appear as a reference metric only.</p>
    ),
  },
  // Alerts
  {
    id: "alert-conv-overage",
    title: "Conversation Overage",
    section: "Alerts",
    content: (
      <>
        <p className="text-sm text-foreground">Triggered when a workspace's projected or actual conversation count exceeds the included allowance.</p>
        <p className="mt-1 text-xs text-muted-foreground"><span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1" />Warning: 90–100% of limit · <span className="inline-block h-2 w-2 rounded-full bg-destructive mr-1" />Critical: &gt;100% of limit.</p>
      </>
    ),
  },
  {
    id: "alert-credit-overage",
    title: "Credit Overage",
    section: "Alerts",
    content: (
      <>
        <p className="text-sm text-foreground">Triggered when AI credit usage approaches or exceeds the plan's included credits.</p>
        <p className="mt-1 text-xs text-muted-foreground"><span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1" />Warning: 80–100% · <span className="inline-block h-2 w-2 rounded-full bg-destructive mr-1" />Critical: &gt;100%.</p>
      </>
    ),
  },
  {
    id: "alert-negative-margin",
    title: "Negative Margin",
    section: "Alerts",
    content: (
      <p className="text-sm text-foreground">Flagged when a workspace's gross margin drops below 0%. This means the cost of serving the workspace exceeds the revenue it generates. Severity is <span className="inline-block h-2 w-2 rounded-full bg-destructive mr-1" />Critical.</p>
    ),
  },
  {
    id: "alert-invoice-overdue",
    title: "Invoice Overdue",
    section: "Alerts",
    content: (
      <>
        <p className="text-sm text-foreground">Raised when an invoice is past its due date.</p>
        <p className="mt-1 text-xs text-muted-foreground"><span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1" />Warning: 1–14 days overdue · <span className="inline-block h-2 w-2 rounded-full bg-destructive mr-1" />Critical: 15+ days overdue.</p>
      </>
    ),
  },
  {
    id: "alert-onboarding-stalled",
    title: "Onboarding Stalled",
    section: "Alerts",
    content: (
      <p className="text-sm text-foreground">Triggered when a workspace in onboarding status has had no activity for more than 7 days. Severity is <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-1" />Info.</p>
    ),
  },
  // Overages & Extras
  {
    id: "overage-calculation",
    title: "How overages are calculated",
    section: "Overages & Extras",
    content: (
      <>
        <p className="text-sm text-foreground">Each plan includes a set number of conversations and AI credits. Usage beyond those limits is billed as overages at the rate defined in the plan.</p>
        <pre className="mt-2 rounded-md bg-muted px-3 py-2 font-mono text-xs">Overage cost = (usage − included) × per-unit rate</pre>
      </>
    ),
  },
  {
    id: "passthrough-vs-markup",
    title: "Passthrough vs Markup",
    section: "Overages & Extras",
    content: (
      <>
        <p className="text-sm text-foreground"><strong>Passthrough:</strong> The overage cost is charged to the client at the same rate the agency pays. No margin is earned on overages.</p>
        <p className="mt-2 text-sm text-foreground"><strong>Markup:</strong> A percentage is added on top of the base overage cost. The markup contributes to gross profit.</p>
      </>
    ),
  },
];

const sections = ["Key Metrics", "Data Modes", "Alerts", "Overages & Extras"];

/* ── component ────────────────────────────────────────── */

export function HelpDrawer() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.section.toLowerCase().includes(q),
    );
  }, [search]);

  const visibleSections = useMemo(
    () => sections.filter((s) => filtered.some((e) => e.section === s)),
    [filtered],
  );

  return (
    <>
      {/* Persistent trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 gap-1.5 rounded-full bg-background/70 text-muted-foreground shadow-md backdrop-blur transition-opacity hover:bg-background hover:text-foreground hover:opacity-100 opacity-60"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="text-xs font-medium">?</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-[440px]">
          {/* Header */}
          <SheetHeader className="shrink-0 border-b px-5 py-4">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              Help & Definitions
            </SheetTitle>
            <Input
              placeholder="Search definitions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-3"
            />
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {visibleSections.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results for "{search}"
              </p>
            )}

            {visibleSections.map((section, idx) => (
              <div key={section}>
                {idx > 0 && <Separator className="my-4" />}
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {filtered
                    .filter((e) => e.section === section)
                    .map((entry) => (
                      <AccordionItem key={entry.id} value={entry.id}>
                        <AccordionTrigger className="text-sm font-medium">
                          {entry.title}
                        </AccordionTrigger>
                        <AccordionContent>{entry.content}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Footer */}
          <SheetFooter className="shrink-0 border-t px-5 py-4">
            <div className="w-full space-y-2 text-center">
              <p className="text-xs font-medium text-muted-foreground">Need more help?</p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
                  <a href="https://docs.example.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Documentation
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
                  <a href="mailto:support@wuama.com">
                    <Mail className="h-3.5 w-3.5" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
