import { Card } from "@/components/ui/Card";
import type { calculateHealthAnalytics } from "@/lib/healthAnalytics";

type Analytics = ReturnType<typeof calculateHealthAnalytics>;

export function FlowDistributionCard({ analytics }: { analytics: Analytics }) {
  return <Card>
    <h2>Flow distribution</h2>
    {analytics.flowDistribution.map((item) => <div className="trend" key={item.flow}><span className="capitalize">{item.flow}</span><strong>{item.count} · {item.percentage}%</strong></div>)}
  </Card>;
}
