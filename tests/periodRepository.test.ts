import assert from "node:assert/strict";
import test from "node:test";
import {
  PERIOD_STORAGE_KEY,
  readLocalPeriodEntries,
  saveLocalPeriodEntry,
  selectPeriodDisplayData,
  validatePeriodEntry,
} from "../src/lib/periodRepository.ts";
import type { PeriodLog } from "../src/lib/mockData.ts";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const base = { flow: "medium" as const, painLevel: 2 };
const demo: PeriodLog[] = [{ id: "demo-only", startDate: "2026-06-03", endDate: "2026-06-06", ...base }];

test("saves the first real period with a stable unique id", () => {
  const storage = new MemoryStorage();
  const saved = saveLocalPeriodEntry(storage, { startDate: "2026-07-22", ...base }, "real-unique-id");
  assert.equal(saved.id, "real-unique-id");
  assert.deepEqual(readLocalPeriodEntries(storage), [saved]);
});

test("saves with Start date only and leaves End date absent", () => {
  const storage = new MemoryStorage();
  const saved = saveLocalPeriodEntry(storage, { startDate: "2026-07-22", ...base }, "start-only");
  assert.equal(saved.endDate, undefined);
  assert.equal(JSON.parse(storage.getItem(PERIOD_STORAGE_KEY) ?? "[]")[0].endDate, undefined);
});

test("saves with Start and End dates", () => {
  const storage = new MemoryStorage();
  const saved = saveLocalPeriodEntry(storage, { startDate: "2026-07-22", endDate: "2026-07-26", ...base }, "with-end");
  assert.equal(saved.endDate, "2026-07-26");
});

test("rejects an End date earlier than Start date", () => {
  assert.throws(() => validatePeriodEntry({ startDate: "2026-07-22", endDate: "2026-07-21", ...base }), /End date cannot be earlier/);
});

test("persists records when the repository is read again after refresh", () => {
  const storage = new MemoryStorage();
  saveLocalPeriodEntry(storage, { startDate: "2026-07-22", ...base }, "persisted");
  assert.equal(readLocalPeriodEntries(storage)[0]?.id, "persisted");
});

test("switches from demo mode to real-data mode", () => {
  assert.equal(selectPeriodDisplayData([], demo).mode, "demo");
  const real = [{ ...demo[0], id: "real" }];
  assert.deepEqual(selectPeriodDisplayData(real, demo), { records: real, mode: "real" });
});

test("demo records are display-only and are never written", () => {
  const storage = new MemoryStorage();
  const display = selectPeriodDisplayData([], demo);
  assert.equal(display.records[0]?.id, "demo-only");
  assert.deepEqual(readLocalPeriodEntries(storage), []);
  assert.equal(storage.getItem(PERIOD_STORAGE_KEY), null);
});

test("preserves date-only strings across timezones", () => {
  const originalTimezone = process.env.TZ;
  for (const timezone of ["Pacific/Kiritimati", "America/Los_Angeles", "Pacific/Honolulu"]) {
    process.env.TZ = timezone;
    const storage = new MemoryStorage();
    const saved = saveLocalPeriodEntry(storage, { startDate: "2026-01-01", endDate: "2026-01-05", ...base }, timezone);
    assert.equal(saved.startDate, "2026-01-01");
    assert.equal(readLocalPeriodEntries(storage)[0]?.endDate, "2026-01-05");
  }
  process.env.TZ = originalTimezone;
});
