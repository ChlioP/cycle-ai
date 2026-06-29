"use client";

import { createContext, useContext, useMemo } from "react";
import { useFirestoreLogs } from "@/hooks/useFirestoreLogs";
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
  source: "firestore" | "mock";
};

const HealthDataContext = createContext<HealthData>({
  periodLogs: mockPeriodLogs,
  symptomLogs: mockSymptomLogs,
  assistantMessages: mockAssistantMessages,
  loading: false,
  error: null,
  source: "mock",
});

const moods = new Set<SymptomLog["mood"]>(["calm", "low", "anxious", "irritable", "positive"]);
const energies = new Set<SymptomLog["energy"]>(["high", "low", "very low"]);
const flows = new Set<FlowLevel>(["spotting", "light", "medium", "heavy"]);

export function HealthDataProvider({ children }: { children: React.ReactNode }) {
  const cloud = useFirestoreLogs();
  const value = useMemo<HealthData>(() => {
    const useCloudData = cloud.configured;

    return {
      periodLogs: useCloudData ? cloud.periodLogs.map((log) => ({
        id: log.id,
        startDate: log.startDate,
        endDate: log.endDate || log.startDate,
        flow: flows.has(log.flow as FlowLevel) ? log.flow as FlowLevel : "medium",
        painLevel: log.painLevel,
        notes: log.notes,
      })) : mockPeriodLogs,
      symptomLogs: useCloudData ? cloud.symptomLogs.flatMap((log) => log.symptoms.map((symptom) => ({
        id: `${log.id}-${symptom}`,
        date: log.date,
        symptom,
        severity: log.severity,
        mood: moods.has(log.mood as SymptomLog["mood"]) ? log.mood as SymptomLog["mood"] : "calm",
        energy: energies.has(log.energy as SymptomLog["energy"]) ? log.energy as SymptomLog["energy"] : "low",
        notes: log.notes,
      }))) : mockSymptomLogs,
      assistantMessages: useCloudData ? cloud.assistantMessages.map((message, index) => ({
        id: index + 1,
        role: message.role,
        text: message.text,
      })) : mockAssistantMessages,
      loading: cloud.loading,
      error: cloud.error,
      source: cloud.configured ? "firestore" : "mock",
    };
  }, [cloud]);

  return <HealthDataContext value={value}>{children}</HealthDataContext>;
}

export function useHealthData() {
  return useContext(HealthDataContext);
}
