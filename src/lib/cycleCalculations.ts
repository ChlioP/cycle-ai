import type { PeriodLog } from "./mockData";

const DAY_MS = 86_400_000;

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return date;
}

export function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(start: string, end: string) {
  return Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / DAY_MS);
}

export function averageCycleLength(lengths: readonly number[]) {
  if (lengths.length === 0) return null;
  return lengths.reduce((total, length) => total + length, 0) / lengths.length;
}

export function averagePeriodDuration(logs: readonly PeriodLog[]) {
  if (logs.length === 0) return null;
  const durations = logs.map((log) => daysBetween(log.startDate, log.endDate || log.startDate) + 1);
  return durations.reduce((total, duration) => total + duration, 0) / durations.length;
}

export function currentCycleDay(lastPeriodStart: string, asOfDate: string) {
  const elapsed = daysBetween(lastPeriodStart, asOfDate);
  return elapsed < 0 ? null : elapsed + 1;
}

export function cycleVariation(lengths: readonly number[]) {
  if (lengths.length === 0) return null;
  const minimum = Math.min(...lengths);
  const maximum = Math.max(...lengths);
  return { minimum, maximum, range: maximum - minimum };
}

export function cycleLengthsFromPeriods(logs: readonly PeriodLog[]) {
  const starts = logs.map((log) => log.startDate).filter(Boolean).toSorted();
  return starts.slice(1).map((start, index) => daysBetween(starts[index], start)).filter((length) => length > 0);
}

export type PeriodPrediction = {
  expectedDate: Date;
  rangeStart: Date;
  rangeEnd: Date;
  daysUntilRange: { minimum: number; maximum: number };
  wording: string;
};

export function predictNextPeriod(lastPeriodStart: string, lengths: readonly number[], asOfDate: string): PeriodPrediction | null {
  const average = averageCycleLength(lengths);
  const variation = cycleVariation(lengths);
  if (average === null || variation === null) return null;

  const expectedDays = Math.round(average);
  const margin = Math.max(2, Math.ceil(variation.range / 2));
  const expectedDate = addDays(lastPeriodStart, expectedDays);
  const rangeStart = addDays(lastPeriodStart, expectedDays - margin);
  const rangeEnd = addDays(lastPeriodStart, expectedDays + margin);

  return {
    expectedDate,
    rangeStart,
    rangeEnd,
    daysUntilRange: {
      minimum: Math.max(0, Math.ceil((rangeStart.getTime() - parseDate(asOfDate).getTime()) / DAY_MS)),
      maximum: Math.max(0, Math.ceil((rangeEnd.getTime() - parseDate(asOfDate).getTime()) / DAY_MS)),
    },
    wording: "This is an estimate based on logged cycle timing, not a diagnosis or a guaranteed date.",
  };
}

export function formatMonthDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
