"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHead } from "@/components/ui/PageHead";
import { InsightMetricCard } from "./InsightMetricCard";
import { TrendChartCard } from "./TrendChartCard";
import { cycleLengths as fallbackCycleLengths } from "@/lib/mockData";
import { averageCycleLength, averagePeriodDuration, cycleVariation, daysBetween } from "@/lib/cycleCalculations";
import { detectIrregularPattern } from "@/lib/irregularDetection";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { calculateHealthAnalytics } from "@/lib/healthAnalytics";
import { AnalyticsOverviewCard } from "./AnalyticsOverviewCard";
import { FlowDistributionCard } from "./FlowDistributionCard";
import { TrendSummaryCard } from "./TrendSummaryCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

const month = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

export function Insights() {
  const { periodLogs, symptomLogs, source, loading, error } = useHealthData();
  const analytics = calculateHealthAnalytics(periodLogs, symptomLogs, source === "mock" ? fallbackCycleLengths.map((cycle) => cycle.days) : []);
  const lengths = analytics.cycleLengths;
  const cycles = lengths.map((days, index) => [periodLogs[index + 1] ? month(periodLogs[index + 1].startDate) : `C${index + 1}`, Math.round((days / 38) * 100), `${days}d`] as const);
  const durations = periodLogs.map((log) => daysBetween(log.startDate, log.endDate || log.startDate) + 1);
  const periods = durations.map((days, index) => [month(periodLogs[index].startDate), Math.round((days / 7) * 100), `${days}d`] as const);
  const averageCycle = averageCycleLength(lengths);
  const averagePeriod = averagePeriodDuration(periodLogs);
  const variation = cycleVariation(lengths);
  const irregularity = detectIrregularPattern(lengths);
  const symptomPattern = analytics.prePeriodSymptoms[0];

  return <AppShell>
    <PageHead eyebrow="Last 6 cycles" title="Your patterns" description="Patterns are observations from your logs, not medical conclusions." />
    {error ? <p className="data-error" role="alert">Analytics could not refresh. Please check your connection.</p> : null}
    {loading ? <DashboardSkeleton /> : <>
    <AnalyticsOverviewCard analytics={analytics} />
    <div className="grid grid-2">
      <TrendChartCard title="Cycle length" summary={`${averageCycle?.toFixed(1)}-day average · ${irregularity.detected ? "variable" : "relatively consistent"}`} data={cycles} ariaLabel={`Cycle lengths: ${lengths.join(", ")} days`} badge={`${variation?.range ?? 0}-day range`} />
      <TrendChartCard title="Period duration" summary={`${averagePeriod?.toFixed(1)}-day logged average`} data={periods} ariaLabel={`Period durations: ${durations.join(", ")} days`} blush />
    </div>
    <div className="grid grid-2 section-block">
      <TrendSummaryCard analytics={analytics} />
      <FlowDistributionCard analytics={analytics} />
    </div>
    <div className="grid grid-2 section-block">
      <InsightMetricCard analytics={analytics} cycleCount={periodLogs.length} />
      <Card className="bg-cycle-soft shadow-none"><Badge>Pre-period pattern</Badge><h2 className="spaced-title">{symptomPattern ? `${symptomPattern.symptom}: ${symptomPattern.typicalWindow} before bleeding` : "More logs are needed"}</h2><p className="muted content-gap">{symptomPattern?.wording ?? "Keep logging symptoms and period dates to explore possible timing associations."}</p><Button className="content-gap-large" href="/assistant">Ask about this</Button></Card>
    </div>
    </>}
  </AppShell>;
}
