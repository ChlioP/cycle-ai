import type { FlowLevel, PeriodLog } from "./mockData";

export const PERIOD_STORAGE_KEY = "cyclecare.real-period-records.v1";
const DATE_ONLY = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;

export type PeriodEntryInput = {
  startDate: string;
  endDate?: string;
  flow: FlowLevel;
  painLevel: number;
  notes?: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

function isDateOnly(value: string) {
  if (!DATE_ONLY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function validatePeriodEntry(input: PeriodEntryInput) {
  if (!input.startDate || !isDateOnly(input.startDate)) throw new Error("Start date is required.");
  if (input.endDate && (!isDateOnly(input.endDate) || input.endDate < input.startDate)) {
    throw new Error("End date cannot be earlier than Start date.");
  }
}

export function createPeriodId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `period-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRealPeriodLog(value: unknown): value is PeriodLog {
  if (!value || typeof value !== "object") return false;
  const log = value as Partial<PeriodLog>;
  return typeof log.id === "string" && typeof log.startDate === "string" && isDateOnly(log.startDate);
}

export function readLocalPeriodEntries(storage: StorageLike): PeriodLog[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(PERIOD_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isRealPeriodLog) : [];
  } catch {
    return [];
  }
}

function write(storage: StorageLike, records: PeriodLog[]) {
  storage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(records));
}

export function saveLocalPeriodEntry(storage: StorageLike, input: PeriodEntryInput, id = createPeriodId()) {
  validatePeriodEntry(input);
  const record: PeriodLog = { id, ...input };
  write(storage, [...readLocalPeriodEntries(storage), record]);
  return record;
}

export function updateLocalPeriodEntry(storage: StorageLike, id: string, input: PeriodEntryInput) {
  validatePeriodEntry(input);
  const records = readLocalPeriodEntries(storage);
  if (!records.some((record) => record.id === id)) throw new Error("Period record not found.");
  const record: PeriodLog = { id, ...input };
  write(storage, records.map((item) => item.id === id ? record : item));
  return record;
}

export function deleteLocalPeriodEntry(storage: StorageLike, id: string) {
  write(storage, readLocalPeriodEntries(storage).filter((record) => record.id !== id));
}

export function selectPeriodDisplayData(realRecords: PeriodLog[], demoRecords: PeriodLog[]) {
  return realRecords.length > 0
    ? { records: realRecords, mode: "real" as const }
    : { records: demoRecords, mode: "demo" as const };
}
