export type FlowLevel = "spotting" | "light" | "medium" | "heavy";

export type PeriodLog = {
  id: string;
  startDate: string;
  endDate: string;
  flow: FlowLevel;
  painLevel: number;
  notes?: string;
};

export type SymptomLog = {
  id: string;
  date: string;
  symptom: string;
  severity: number;
  mood: "calm" | "low" | "anxious" | "irritable" | "positive";
  energy: "high" | "low" | "very low";
  notes?: string;
};

export type AssistantMessage = {
  id: number;
  role: "ai" | "user";
  text: string;
};

export const periodLogs: PeriodLog[] = [
  { id: "period-1", startDate: "2026-01-03", endDate: "2026-01-07", flow: "medium", painLevel: 2 },
  { id: "period-2", startDate: "2026-02-01", endDate: "2026-02-04", flow: "light", painLevel: 2 },
  { id: "period-3", startDate: "2026-03-04", endDate: "2026-03-09", flow: "heavy", painLevel: 4, notes: "Heavier on days two and three." },
  { id: "period-4", startDate: "2026-04-30", endDate: "2026-05-04", flow: "medium", painLevel: 3 },
  { id: "period-5", startDate: "2026-06-03", endDate: "2026-06-06", flow: "medium", painLevel: 3, notes: "Back pain improved with a heating pad." },
];

export const symptomLogs: SymptomLog[] = [
  { id: "symptom-1", date: "2026-05-27", symptom: "Lower back pain", severity: 3, mood: "low", energy: "low" },
  { id: "symptom-2", date: "2026-05-29", symptom: "Low energy", severity: 2, mood: "calm", energy: "very low" },
  { id: "symptom-3", date: "2026-06-03", symptom: "Cramps", severity: 4, mood: "irritable", energy: "low" },
  { id: "symptom-4", date: "2026-06-04", symptom: "Bloating", severity: 2, mood: "calm", energy: "low" },
  { id: "symptom-5", date: "2026-06-08", symptom: "Headache", severity: 2, mood: "positive", energy: "high" },
  { id: "symptom-6", date: "2026-06-10", symptom: "Breast tenderness", severity: 2, mood: "calm", energy: "high" },
  { id: "symptom-7", date: "2026-06-24", symptom: "Lower back pain", severity: 2, mood: "low", energy: "low" },
  { id: "symptom-8", date: "2026-06-26", symptom: "Bloating", severity: 3, mood: "irritable", energy: "low" },
  { id: "symptom-9", date: "2026-06-28", symptom: "Lower back pain", severity: 3, mood: "low", energy: "low", notes: "Moderate discomfort after waking." },
  { id: "symptom-10", date: "2026-06-28", symptom: "Low energy", severity: 2, mood: "low", energy: "very low" },
];

export const cycleLengths = [
  { month: "Jan", days: 29 },
  { month: "Feb", days: 31 },
  { month: "Mar", days: 27 },
  { month: "Apr", days: 34 },
  { month: "May", days: 36 },
  { month: "Jun", days: 31 },
] as const;

export const periodDurations = [
  { month: "Jan", days: 5 },
  { month: "Feb", days: 4 },
  { month: "Mar", days: 6 },
  { month: "Apr", days: 5 },
  { month: "May", days: 5 },
  { month: "Jun", days: 4 },
] as const;

export const commonSymptoms = [
  { name: "Lower back pain", cycles: 4 },
  { name: "Low energy", cycles: 4 },
  { name: "Cramps", cycles: 3 },
  { name: "Headache", cycles: 2 },
] as const;

export const mockAssistantMessages: AssistantMessage[] = [
  { id: 1, role: "ai", text: "Hi Ava. I can help you review cycle length, symptoms, and timing from your logs. What would you like to understand?" },
  { id: 2, role: "user", text: "Why is my predicted period a range?" },
  { id: 3, role: "ai", text: "Your last six cycles ranged from 27 to 36 days. A wider prediction window reflects that variation and avoids implying an exact date." },
];

export const suggestedPrompts = [
  "Analyze my previous cycles",
  "Explain my cycle irregularity",
  "Summarize my recent patterns",
  "Compare this cycle vs previous cycles",
  "Explain my prediction confidence",
] as const;

export const assistantFallbackReply = "Cycle patterns can vary, especially when recent cycles are irregular. I can help you review your logs, but I can’t diagnose a condition. Seek care for severe pain, very heavy bleeding, fainting, or pregnancy concerns.";
