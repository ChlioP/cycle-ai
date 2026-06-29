import { averageCycleLength, cycleVariation } from "./cycleCalculations";

export type IrregularPatternResult = {
  detected: boolean;
  variationDays: number;
  wording: string;
};

export function detectIrregularPattern(lengths: readonly number[]): IrregularPatternResult {
  const variation = cycleVariation(lengths);
  const average = averageCycleLength(lengths);

  if (lengths.length < 3 || variation === null || average === null) {
    return {
      detected: false,
      variationDays: variation?.range ?? 0,
      wording: "More logged cycles are needed before timing variation can be summarized.",
    };
  }

  const detected = variation.range >= 8 || variation.range / average >= 0.2;
  return {
    detected,
    variationDays: variation.range,
    wording: detected
      ? `Your logged cycle lengths vary by ${variation.range} days. This is a pattern observation, not a medical conclusion.`
      : "Your recent logged cycle lengths are relatively consistent. This observation may change as more cycles are logged.",
  };
}
