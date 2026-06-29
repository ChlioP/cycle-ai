import { Card } from "@/components/ui/Card";
import type { calculateHealthAnalytics } from "@/lib/healthAnalytics";

type Analytics = ReturnType<typeof calculateHealthAnalytics>;

export function InsightMetricCard({ analytics, cycleCount }: { analytics: Analytics; cycleCount: number }) {
  return <Card>
    <h2>Symptom frequency</h2>
    {analytics.symptomFrequency.slice(0, 4).map(({ symptom, count }) => <div className="trend" key={symptom}><span>{symptom}</span><strong>{count} log{count === 1 ? "" : "s"} · {cycleCount} cycles</strong></div>)}
  </Card>;
}
