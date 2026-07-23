import {
  averageCycleLength,
  averagePeriodDuration,
  currentCycleDay,
  cycleLengthsFromPeriods,
  cycleVariation,
  formatDateOnly,
  formatMonthDay,
  predictNextPeriod,
} from "./cycleCalculations";
import { detectIrregularPattern } from "./irregularDetection";
import type { PeriodLog, SymptomLog } from "./mockData";
import { detectPrePeriodSymptoms } from "./symptomInsights";

function cycleSummary(periods: readonly PeriodLog[], symptoms: readonly SymptomLog[]) {
  const lengths = cycleLengthsFromPeriods(periods);
  const averageCycle = averageCycleLength(lengths);
  const averageDuration = averagePeriodDuration(periods);
  const variation = cycleVariation(lengths);
  const common = symptoms.reduce((counts, log) => counts.set(log.symptom, (counts.get(log.symptom) ?? 0) + 1), new Map<string, number>());
  const topSymptom = [...common.entries()].toSorted((a, b) => b[1] - a[1])[0];

  if (averageCycle === null) return "I need at least two period start dates before I can summarize cycle timing. Keep logging periods and symptoms to build a useful history.";
  return `Across ${lengths.length} completed cycle${lengths.length === 1 ? "" : "s"}, your average cycle length is ${averageCycle.toFixed(1)} days${variation ? `, with a ${variation.minimum}–${variation.maximum} day range` : ""}. Your logged periods average ${averageDuration?.toFixed(1) ?? "—"} days. ${topSymptom ? `${topSymptom[0]} is your most frequently logged symptom (${topSymptom[1]} logs).` : "There are not enough symptom logs to identify a frequent symptom."} These are summaries of your entries, not medical conclusions.`;
}

function irregularityExplanation(periods: readonly PeriodLog[]) {
  const result = detectIrregularPattern(cycleLengthsFromPeriods(periods));
  return `${result.wording} Variation can reflect many everyday or health factors, and the logs alone cannot identify a cause. Consider discussing persistent changes or concerns with a clinician.`;
}

function cycleComparison(periods: readonly PeriodLog[], symptoms: readonly SymptomLog[], asOfDate: string) {
  const ordered = periods.toSorted((a, b) => a.startDate.localeCompare(b.startDate));
  const latest = ordered.at(-1);
  const lengths = cycleLengthsFromPeriods(ordered);
  const previousLength = lengths.at(-1);
  if (!latest || previousLength === undefined) return "I need at least two logged period starts to compare this cycle with a previous cycle.";

  const currentDay = currentCycleDay(latest.startDate, asOfDate);
  const currentSymptoms = symptoms.filter((log) => log.date >= latest.startDate && log.date <= asOfDate);
  const symptomNames = [...new Set(currentSymptoms.map((log) => log.symptom))];
  return `You are on cycle day ${currentDay ?? "—"}. Your previous completed cycle lasted ${previousLength} days, so this cycle is currently ${currentDay && currentDay < previousLength ? `${previousLength - currentDay} days earlier than that endpoint` : "at or beyond that previous length"}. ${symptomNames.length ? `This cycle includes ${symptomNames.slice(0, 3).join(", ")} in your logs.` : "You have not logged symptoms in this cycle yet."} This comparison describes timing only and does not predict an outcome.`;
}

function confidenceExplanation(periods: readonly PeriodLog[], asOfDate: string) {
  const ordered = periods.toSorted((a, b) => a.startDate.localeCompare(b.startDate));
  const latest = ordered.at(-1);
  const lengths = cycleLengthsFromPeriods(ordered);
  const prediction = latest ? predictNextPeriod(latest.startDate, lengths, asOfDate) : null;
  const variation = cycleVariation(lengths);
  if (!prediction || !variation) return "Prediction confidence needs at least two completed cycle intervals. More period start dates will make the estimate more informative.";

  const confidence = lengths.length >= 5 && variation.range <= 5 ? "higher" : lengths.length >= 3 && variation.range <= 8 ? "moderate" : "lower";
  return `Prediction confidence is ${confidence}. It is based on ${lengths.length} completed cycles with ${variation.range} days of variation. The current estimated window is ${formatMonthDay(prediction.rangeStart)}–${formatMonthDay(prediction.rangeEnd)}; a wider history range produces a wider prediction window. ${prediction.wording}`;
}

function prePeriodExplanation(periods: readonly PeriodLog[], symptoms: readonly SymptomLog[]) {
  const insights = detectPrePeriodSymptoms(symptoms, periods);
  if (insights.length === 0) return "I do not see a repeated pre-period symptom association yet. Continue logging symptom and period dates to make this comparison possible.";
  return `${insights.slice(0, 2).map((insight) => insight.wording).join(" ")} Repeated timing can be useful context, but it does not establish a medical cause.`;
}

export function generateAssistantReply(question: string, periods: readonly PeriodLog[], symptoms: readonly SymptomLog[], asOfDate = formatDateOnly(new Date())) {
  const normalized = question.toLowerCase();
  if (/confidence|prediction|predicted|range/.test(normalized)) return confidenceExplanation(periods, asOfDate);
  if (/irregular|variation|vary|varied/.test(normalized)) return irregularityExplanation(periods);
  if (/compare|previous|last cycle|this cycle/.test(normalized)) return cycleComparison(periods, symptoms, asOfDate);
  if (/before|pre-period|symptom/.test(normalized)) return prePeriodExplanation(periods, symptoms);
  if (/summary|summarize|analyse|analyze|history|cycles/.test(normalized)) return cycleSummary(periods, symptoms);
  return `${cycleSummary(periods, symptoms)} You can also ask me to explain irregularity, compare this cycle with the previous one, or explain prediction confidence.`;
}
