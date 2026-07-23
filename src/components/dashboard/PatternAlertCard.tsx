"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { detectIrregularPattern } from "@/lib/irregularDetection";
import { detectPrePeriodSymptoms } from "@/lib/symptomInsights";
import { cycleLengths } from "@/lib/mockData";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { cycleLengthsFromPeriods } from "@/lib/cycleCalculations";

export function PatternAlertCard({ compact = false }: { compact?: boolean }) {
  const healthData = useHealthData();
  const calculatedLengths = cycleLengthsFromPeriods(healthData.periodLogs);
  const lengths = calculatedLengths.length > 0 ? calculatedLengths : healthData.source === "demo" ? cycleLengths.map((cycle) => cycle.days) : [];
  const irregularity = detectIrregularPattern(lengths);
  const symptomPattern = detectPrePeriodSymptoms(healthData.symptomLogs, healthData.periodLogs)[0];

  if (compact) return <Card className="bg-cycle-soft shadow-none">
    <p className="eyebrow">A gentle check-in</p>
    <h2>{symptomPattern ? `${symptomPattern.symptom} may appear before your period` : "Keep logging to reveal symptom timing"}</h2>
    <p className="muted content-gap">{symptomPattern?.wording ?? "There is not enough logged information yet to summarize a pre-period symptom pattern."}</p>
    <Button className="content-gap-large" href="/assistant">Ask the assistant</Button>
  </Card>;

  return <Card className="border-[var(--alert-border)] bg-[var(--alert-bg)]">
    <Badge tone="warn">Pattern notice</Badge>
    <h2 className="spaced-title">{irregularity.detected ? "Your cycle length has varied" : "Your recent timing is relatively consistent"}</h2>
    <p className="muted">{irregularity.wording}</p>
    <Link className="text-link" href="/insights">Review pattern →</Link>
  </Card>;
}
