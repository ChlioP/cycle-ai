import { averageCycleLength, cycleLengthsFromPeriods } from "./cycleCalculations";
import type { FlowLevel, PeriodLog, SymptomLog } from "./mockData";
import { detectPrePeriodSymptoms } from "./symptomInsights";

type TrendDirection = "increasing" | "decreasing" | "stable" | "insufficient data";

function trendDirection(values: readonly number[]): TrendDirection {
  if (values.length < 2) return "insufficient data";
  const midpoint = Math.ceil(values.length / 2);
  const first = values.slice(0, midpoint);
  const second = values.slice(-midpoint);
  const average = (items: readonly number[]) => items.reduce((sum, value) => sum + value, 0) / items.length;
  const difference = average(second) - average(first);
  return difference > 0.5 ? "increasing" : difference < -0.5 ? "decreasing" : "stable";
}

function standardDeviation(values: readonly number[]) {
  const average = averageCycleLength(values);
  if (average === null) return null;
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function cycleConsistencyScore(lengths: readonly number[]) {
  const average = averageCycleLength(lengths);
  const deviation = standardDeviation(lengths);
  if (average === null || deviation === null || lengths.length < 2) return null;
  return Math.max(0, Math.min(100, Math.round(100 - (deviation / average) * 200)));
}

export function predictionConfidence(lengths: readonly number[]) {
  const consistency = cycleConsistencyScore(lengths);
  if (consistency === null) return { score: 0, label: "Not enough data", wording: "At least two completed cycle intervals are needed." };
  const historyScore = Math.min(100, lengths.length * 20);
  const score = Math.round(consistency * 0.7 + historyScore * 0.3);
  const label = score >= 80 ? "Higher" : score >= 55 ? "Moderate" : "Lower";
  return {
    score,
    label,
    wording: `${label} confidence based on ${lengths.length} completed cycles and a ${consistency}% timing consistency score. Predictions remain estimates.`,
  };
}

export function symptomFrequency(logs: readonly SymptomLog[]) {
  const counts = logs.reduce((map, log) => map.set(log.symptom, (map.get(log.symptom) ?? 0) + 1), new Map<string, number>());
  return [...counts.entries()].map(([symptom, count]) => ({ symptom, count })).toSorted((a, b) => b.count - a.count || a.symptom.localeCompare(b.symptom));
}

export function flowDistribution(logs: readonly PeriodLog[]) {
  const levels: FlowLevel[] = ["spotting", "light", "medium", "heavy"];
  return levels.map((flow) => {
    const count = logs.filter((log) => log.flow === flow).length;
    return { flow, count, percentage: logs.length === 0 ? 0 : Math.round((count / logs.length) * 100) };
  });
}

export function moodTrend(logs: readonly SymptomLog[]) {
  if (logs.length === 0) return { dominant: null, latest: null, distribution: [] as { mood: string; count: number }[] };
  const ordered = logs.toSorted((a, b) => a.date.localeCompare(b.date));
  const counts = ordered.reduce((map, log) => map.set(log.mood, (map.get(log.mood) ?? 0) + 1), new Map<string, number>());
  const distribution = [...counts.entries()].map(([mood, count]) => ({ mood, count })).toSorted((a, b) => b.count - a.count);
  return { dominant: distribution[0]?.mood ?? null, latest: ordered.at(-1)?.mood ?? null, distribution };
}

export function calculateHealthAnalytics(periods: readonly PeriodLog[], symptoms: readonly SymptomLog[], fallbackLengths: readonly number[] = []) {
  const calculatedLengths = cycleLengthsFromPeriods(periods);
  const lengths = calculatedLengths.length > 0 ? calculatedLengths : [...fallbackLengths];
  const average = averageCycleLength(lengths);
  const consistency = cycleConsistencyScore(lengths);

  return {
    cycleLengths: lengths,
    averageCycleLength: average,
    shortestCycle: lengths.length > 0 ? Math.min(...lengths) : null,
    longestCycle: lengths.length > 0 ? Math.max(...lengths) : null,
    cycleConsistencyScore: consistency,
    predictionConfidence: predictionConfidence(lengths),
    painTrend: trendDirection(periods.toSorted((a, b) => a.startDate.localeCompare(b.startDate)).map((log) => log.painLevel)),
    moodTrend: moodTrend(symptoms),
    symptomFrequency: symptomFrequency(symptoms),
    flowDistribution: flowDistribution(periods),
    prePeriodSymptoms: detectPrePeriodSymptoms(symptoms, periods),
  };
}
