import { Card } from "@/components/ui/Card";
import type { calculateHealthAnalytics } from "@/lib/healthAnalytics";

type Analytics = ReturnType<typeof calculateHealthAnalytics>;

export function AnalyticsOverviewCard({ analytics }: { analytics: Analytics }) {
  const metrics = [
    ["Average cycle", analytics.averageCycleLength ? `${analytics.averageCycleLength.toFixed(1)} days` : "—"],
    ["Shortest cycle", analytics.shortestCycle ? `${analytics.shortestCycle} days` : "—"],
    ["Longest cycle", analytics.longestCycle ? `${analytics.longestCycle} days` : "—"],
    ["Consistency score", analytics.cycleConsistencyScore !== null ? `${analytics.cycleConsistencyScore}%` : "—"],
  ];

  return <Card className="section-block">
    <div className="card-head"><div><p className="eyebrow">Cycle overview</p><h2>Timing at a glance</h2></div></div>
    <div className="grid grid-2">
      {metrics.map(([label, value]) => <div className="rounded-xl bg-cycle-soft p-4" key={label}><p className="muted">{label}</p><strong className="text-xl">{value}</strong></div>)}
    </div>
  </Card>;
}
