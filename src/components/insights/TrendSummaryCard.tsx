import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { calculateHealthAnalytics } from "@/lib/healthAnalytics";

type Analytics = ReturnType<typeof calculateHealthAnalytics>;

export function TrendSummaryCard({ analytics }: { analytics: Analytics }) {
  return <Card>
    <div className="card-head"><div><h2>Trends & confidence</h2><p className="muted">Descriptive patterns from your logs</p></div><Badge>{analytics.predictionConfidence.label}</Badge></div>
    <div className="trend"><span>Pain trend</span><strong className="capitalize">{analytics.painTrend}</strong></div>
    <div className="trend"><span>Mood trend</span><strong className="capitalize">{analytics.moodTrend.dominant ? `${analytics.moodTrend.dominant} most common` : "Not enough data"}</strong></div>
    <div className="trend"><span>Prediction confidence</span><strong>{analytics.predictionConfidence.score}%</strong></div>
    <p className="muted content-gap">{analytics.predictionConfidence.wording}</p>
  </Card>;
}
