import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type Point = readonly [label: string, height: number, value?: string];

export function TrendChartCard({ title, summary, data, ariaLabel, blush = false, badge }: { title: string; summary: string; data: readonly Point[]; ariaLabel: string; blush?: boolean; badge?: string }) {
  return <Card>
    <div className="card-head">
      <div><h2>{title}</h2><p className="muted">{summary}</p></div>
      {badge ? <Badge tone="warn">{badge}</Badge> : null}
    </div>
    {data.length === 0 ? <EmptyState title="No chart data yet" description="Add more logs to build this trend." /> : <div className="chart" role="img" aria-label={ariaLabel}>
      {data.map(([label, height, value]) => <div className={`bar${blush ? " blush" : ""}`} style={{ height: `${height}%` }} title={value ? `${label}: ${value}` : label} key={label}>{value ? <strong className="bar-value">{value}</strong> : null}<span className="bar-label">{label}</span></div>)}
    </div>}
  </Card>;
}
