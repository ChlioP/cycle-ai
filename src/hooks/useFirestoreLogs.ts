"use client";

import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/components/providers/FirebaseAuthProvider";
import {
  subscribeToAssistantMessages,
  subscribeToPeriodLogs,
  subscribeToSymptomLogs,
  type AssistantMessageRecord,
  type PeriodLogRecord,
  type SymptomLogRecord,
} from "@/lib/firebase/firestore";

export function useFirestoreLogs() {
  const { user, configured } = useFirebaseAuth();
  const [periodLogs, setPeriodLogs] = useState<PeriodLogRecord[]>([]);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLogRecord[]>([]);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessageRecord[]>([]);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const onError = (value: Error) => {
      setError(value.message);
      setLoading(false);
    };
    let pending = 3;
    const received = () => {
      pending -= 1;
      if (pending === 0) setLoading(false);
    };
    const unsubscribePeriods = subscribeToPeriodLogs(user.uid, (records) => { setPeriodLogs(records); received(); }, onError);
    const unsubscribeSymptoms = subscribeToSymptomLogs(user.uid, (records) => { setSymptomLogs(records); received(); }, onError);
    const unsubscribeMessages = subscribeToAssistantMessages(user.uid, (records) => { setAssistantMessages(records); received(); }, onError);
    return () => {
      unsubscribePeriods();
      unsubscribeSymptoms();
      unsubscribeMessages();
    };
  }, [user]);

  return { periodLogs, symptomLogs, assistantMessages, error, configured, loading };
}
