"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { averageCycleLength, currentCycleDay, cycleLengthsFromPeriods, formatMonthDay, predictNextPeriod } from "@/lib/cycleCalculations";
import { cycleLengths as fallbackCycleLengths } from "@/lib/mockData";
import { EmptyState } from "@/components/ui/EmptyState";

export function PredictionCard() {
  const { periodLogs, source } = useHealthData();
  const calculatedLengths = cycleLengthsFromPeriods(periodLogs);
  const lengths = calculatedLengths.length > 0 ? calculatedLengths : source === "mock" ? fallbackCycleLengths.map((cycle) => cycle.days) : [];
  const lastPeriod = periodLogs.at(-1);
  const average = averageCycleLength(lengths);
  const cycleDay = lastPeriod ? currentCycleDay(lastPeriod.startDate, "2026-06-28") : null;
  const prediction = lastPeriod ? predictNextPeriod(lastPeriod.startDate, lengths, "2026-06-28") : null;

  if (!prediction) return <Card><EmptyState title="No prediction yet" description="Log at least two period start dates to estimate your next window." action={{ href: "/log-period", label: "Log period" }} /></Card>;

  return <Card className="hero">
    <div className="hero-content">
      <div><Badge>Estimated range</Badge><p className="metric">{prediction.daysUntilRange.minimum}–{prediction.daysUntilRange.maximum} days</p><p className="muted">possible window · {formatMonthDay(prediction.rangeStart)}–{formatMonthDay(prediction.rangeEnd)}</p></div>
      <div className="cycle-ring"><span>Day {cycleDay}<small>of ~{Math.round(average ?? 0)}</small></span></div>
    </div>
  </Card>;
}
