import { daysBetween } from "./cycleCalculations";
import type { PeriodLog, SymptomLog } from "./mockData";

export type PrePeriodSymptomInsight = {
  symptom: string;
  occurrences: number;
  typicalWindow: string;
  wording: string;
};

export function detectPrePeriodSymptoms(symptoms: readonly SymptomLog[], periods: readonly PeriodLog[], windowDays = 7): PrePeriodSymptomInsight[] {
  const matches = new Map<string, { cycles: Set<string>; offsets: number[] }>();

  for (const period of periods) {
    for (const symptom of symptoms) {
      const offset = daysBetween(symptom.date, period.startDate);
      if (offset < 1 || offset > windowDays) continue;
      const match = matches.get(symptom.symptom) ?? { cycles: new Set<string>(), offsets: [] };
      match.cycles.add(period.id);
      match.offsets.push(offset);
      matches.set(symptom.symptom, match);
    }
  }

  return [...matches.entries()]
    .map(([symptom, match]) => {
      const minimum = Math.min(...match.offsets);
      const maximum = Math.max(...match.offsets);
      const typicalWindow = minimum === maximum ? `${minimum} day${minimum === 1 ? "" : "s"}` : `${minimum}–${maximum} days`;
      return {
        symptom,
        occurrences: match.cycles.size,
        typicalWindow,
        wording: `${symptom} was logged ${typicalWindow} before a period in ${match.cycles.size} recent cycle${match.cycles.size === 1 ? "" : "s"}. This is a logged association, not a diagnosis.`,
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences || a.symptom.localeCompare(b.symptom));
}
