"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { PageHead } from "@/components/ui/PageHead";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { DashboardMetricCard } from "./DashboardMetricCard";
import { PatternAlertCard } from "./PatternAlertCard";
import { PredictionCard } from "./PredictionCard";
import { QuickLogCard } from "./QuickLogCard";

const quickLogs = [
  ["Period", "Flow & pain", "/log-period"],
  ["Symptoms", "Body changes", "/log-symptoms"],
  ["Mood", "Emotions", "/log-symptoms"],
  ["Medication", "Dose & notes", "/log-symptoms"],
] as const;

export function Dashboard() {
  const { loading, error } = useHealthData();
  return <AppShell note="Your entries are private. Predictions are estimates, not a diagnosis.">
    <PageHead eyebrow="Sunday, June 28" title="Good morning, Ava" description="Here’s what your recent cycle data suggests today." action={{ href: "/log-symptoms", label: "+ Quick log", secondary: true }} />
    {error ? <p className="data-error" role="alert">Live data could not be refreshed. Please check your connection.</p> : null}
    {loading ? <DashboardSkeleton /> : <>
    <div className="grid grid-2">
      <PredictionCard />
      <PatternAlertCard />
    </div>
    <section className="section-block"><div className="card-head"><div><p className="eyebrow">Quick log</p><h2>How are you feeling?</h2></div></div><div className="quick-grid">{quickLogs.map(([name, detail, href]) => <QuickLogCard name={name} detail={detail} href={href} key={name} />)}</div></section>
    <div className="grid grid-2 section-block">
      <DashboardMetricCard />
      <PatternAlertCard compact />
    </div>
    </>}
  </AppShell>;
}
