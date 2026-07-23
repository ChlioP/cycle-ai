"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFirestoreLogs } from "@/hooks/useFirestoreLogs";
import { createPeriodLog, deletePeriodLog, updatePeriodLog } from "@/lib/firebase/firestore";
import {
  deleteLocalPeriodEntry,
  readLocalPeriodEntries,
  saveLocalPeriodEntry,
  selectPeriodDisplayData,
  updateLocalPeriodEntry,
  validatePeriodEntry,
  type PeriodEntryInput,
} from "@/lib/periodRepository";
import {
  mockAssistantMessages,
  periodLogs as mockPeriodLogs,
  symptomLogs as mockSymptomLogs,
  type AssistantMessage,
  type FlowLevel,
  type PeriodLog,
  type SymptomLog,
} from "@/lib/mockData";

type HealthData = {
  periodLogs: PeriodLog[];
  symptomLogs: SymptomLog[];
  assistantMessages: AssistantMessage[];
  loading: boolean;
  error: string | null;
  source: "real" | "demo";
  persistence: "firestore" | "localStorage";
  createPeriod: (input: PeriodEntryInput) => Promise<void>;
  updatePeriod: (id: string, input: PeriodEntryInput) => Promise<void>;
  deletePeriod: (id: string) => Promise<void>;
};

const HealthDataContext = createContext<HealthData>({
  periodLogs: mockPeriodLogs,
  symptomLogs: mockSymptomLogs,
  assistantMessages: mockAssistantMessages,
  loading: false,
  error: null,
  source: "demo",
  persistence: "localStorage",
  createPeriod: async () => undefined,
  updatePeriod: async () => undefined,
  deletePeriod: async () => undefined,
});

const moods = new Set<SymptomLog["mood"]>(["calm", "low", "anxious", "irritable", "positive"]);
const energies = new Set<SymptomLog["energy"]>(["high", "low", "very low"]);
const flows = new Set<FlowLevel>(["spotting", "light", "medium", "heavy"]);

export function HealthDataProvider({ children }: { children: React.ReactNode }) {
  const cloud = useFirestoreLogs();
  const [localPeriods, setLocalPeriods] = useState<PeriodLog[]>([]);
  const [localReady, setLocalReady] = useState(false);

  useEffect(() => {
    if (cloud.configured) return;
    const timer = window.setTimeout(() => {
      setLocalPeriods(readLocalPeriodEntries(window.localStorage));
      setLocalReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [cloud.configured]);

  const createPeriod = useCallback(async (input: PeriodEntryInput) => {
    validatePeriodEntry(input);
    if (cloud.configured) {
      await createPeriodLog({ ...input, notes: input.notes ?? "" });
    } else {
      const record = saveLocalPeriodEntry(window.localStorage, input);
      setLocalPeriods((records) => [...records, record]);
    }
  }, [cloud.configured]);

  const updatePeriod = useCallback(async (id: string, input: PeriodEntryInput) => {
    validatePeriodEntry(input);
    if (cloud.configured) {
      await updatePeriodLog(id, { ...input, endDate: input.endDate, notes: input.notes ?? "" });
    } else {
      const record = updateLocalPeriodEntry(window.localStorage, id, input);
      setLocalPeriods((records) => records.map((item) => item.id === id ? record : item));
    }
  }, [cloud.configured]);

  const deletePeriod = useCallback(async (id: string) => {
    if (cloud.configured) {
      await deletePeriodLog(id);
    } else {
      deleteLocalPeriodEntry(window.localStorage, id);
      setLocalPeriods((records) => records.filter((record) => record.id !== id));
    }
  }, [cloud.configured]);

  const value = useMemo<HealthData>(() => {
    const realPeriods = cloud.configured ? cloud.periodLogs.map((log) => ({
      id: log.id,
      startDate: log.startDate,
      endDate: log.endDate || undefined,
      flow: flows.has(log.flow as FlowLevel) ? log.flow as FlowLevel : "medium" as const,
      painLevel: log.painLevel,
      notes: log.notes,
    })) : localPeriods;
    const display = selectPeriodDisplayData(realPeriods, mockPeriodLogs);
    const realSymptoms = cloud.configured ? cloud.symptomLogs.flatMap((log) => log.symptoms.map((symptom) => ({
      id: `${log.id}-${symptom}`,
      date: log.date,
      symptom,
      severity: log.severity,
      mood: moods.has(log.mood as SymptomLog["mood"]) ? log.mood as SymptomLog["mood"] : "calm" as const,
      energy: energies.has(log.energy as SymptomLog["energy"]) ? log.energy as SymptomLog["energy"] : "low" as const,
      notes: log.notes,
    }))) : [];
    const realMessages = cloud.configured ? cloud.assistantMessages.map((message, index) => ({
      id: index + 1,
      role: message.role,
      text: message.text,
    })) : [];

    return {
      periodLogs: display.records,
      symptomLogs: display.mode === "real" ? realSymptoms : mockSymptomLogs,
      assistantMessages: display.mode === "real" ? realMessages : mockAssistantMessages,
      loading: cloud.configured ? cloud.loading : !localReady,
      error: cloud.error,
      source: display.mode,
      persistence: cloud.configured ? "firestore" : "localStorage",
      createPeriod,
      updatePeriod,
      deletePeriod,
    };
  }, [cloud, createPeriod, deletePeriod, localPeriods, localReady, updatePeriod]);

  return <HealthDataContext value={value}>{children}</HealthDataContext>;
}

export function useHealthData() {
  return useContext(HealthDataContext);
}
