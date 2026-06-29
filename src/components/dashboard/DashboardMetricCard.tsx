"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { EmptyState } from "@/components/ui/EmptyState";

export function DashboardMetricCard() {
  const { symptomLogs } = useHealthData();
  const latestDate = symptomLogs.map((log) => log.date).toSorted().at(-1);
  const entries = symptomLogs.filter((log) => log.date === latestDate).slice(0, 3).map((log, index) => ({
    name: log.symptom,
    detail: log.notes || (index === 0 ? "Recently logged" : "Added in your check-in"),
    value: `${log.severity}/5`,
    tone: index === 0 ? "" : index === 1 ? "lav" : "green",
  }));

  return <Card>
    <div className="card-head">
      <div><p className="eyebrow">Today</p><h2>Symptom summary</h2></div>
      <Badge tone="blush">{entries.length} logged</Badge>
    </div>
    {entries.length === 0 ? <EmptyState title="No symptoms logged" description="Add a check-in to see your latest symptom summary here." action={{ href: "/log-symptoms", label: "Log symptoms" }} /> : null}
    <div className="list">
      {entries.map((entry) => <div className="row" key={entry.name}>
        <i className={`dot ${entry.tone}`.trim()} />
        <div><strong>{entry.name}</strong><p className="muted">{entry.detail}</p></div>
        <span>{entry.value}</span>
      </div>)}
    </div>
  </Card>;
}
