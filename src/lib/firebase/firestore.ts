import {
  addDoc,
  collection,
  deleteField,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { ensureAuthenticatedUser } from "./auth";
import { getFirebaseServices } from "./client";
import { createPeriodId } from "../periodRepository";

export type PeriodLogInput = {
  startDate: string;
  endDate?: string;
  flow: string;
  painLevel: number;
  notes: string;
};

export type PeriodLogRecord = PeriodLogInput & {
  id: string;
  userId: string;
  createdAt: unknown;
  updatedAt: unknown;
};

export type SymptomLogInput = {
  date: string;
  symptoms: string[];
  severity: number;
  mood: string;
  energy: string;
  sleepHours: number | null;
  stress: string;
  notes: string;
};

export type SymptomLogRecord = SymptomLogInput & {
  id: string;
  userId: string;
  createdAt: unknown;
  updatedAt: unknown;
};

export type AssistantMessageInput = {
  role: "ai" | "user";
  text: string;
};

export type AssistantMessageRecord = AssistantMessageInput & {
  id: string;
  userId: string;
  createdAt: unknown;
};

type CollectionName = "periodLogs" | "symptomLogs" | "assistantMessages";

async function authenticatedCollection(name: CollectionName) {
  const services = getFirebaseServices();
  const user = await ensureAuthenticatedUser();
  if (!services || !user) throw new Error("Firebase authentication is required.");
  return { ...services, user, reference: collection(services.db, "users", user.uid, name) };
}

async function authenticatedDocument(name: CollectionName, id: string) {
  const services = getFirebaseServices();
  const user = await ensureAuthenticatedUser();
  if (!services || !user) throw new Error("Firebase authentication is required.");
  return doc(services.db, "users", user.uid, name, id);
}

function subscribe<T>(userId: string, name: CollectionName, onData: (records: T[]) => void, onError?: (error: Error) => void): Unsubscribe {
  const services = getFirebaseServices();
  if (!services) return () => undefined;
  const recordsQuery = query(collection(services.db, "users", userId, name), orderBy("createdAt", "asc"));
  return onSnapshot(
    recordsQuery,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)),
    onError,
  );
}

export async function createPeriodLog(input: PeriodLogInput) {
  const { reference, user } = await authenticatedCollection("periodLogs");
  const id = createPeriodId();
  const { endDate, ...required } = input;
  const payload = { ...required, ...(endDate ? { endDate } : {}), userId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await setDoc(doc(reference, id), payload);
  return id;
}

export async function updatePeriodLog(id: string, updates: Partial<PeriodLogInput>) {
  await updateDoc(await authenticatedDocument("periodLogs", id), {
    ...updates,
    ...(Object.hasOwn(updates, "endDate") ? { endDate: updates.endDate || deleteField() } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePeriodLog(id: string) {
  await deleteDoc(await authenticatedDocument("periodLogs", id));
}

export async function createSymptomLog(input: SymptomLogInput) {
  const { reference, user } = await authenticatedCollection("symptomLogs");
  const result = await addDoc(reference, { ...input, userId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return result.id;
}

export async function updateSymptomLog(id: string, updates: Partial<SymptomLogInput>) {
  await updateDoc(await authenticatedDocument("symptomLogs", id), { ...updates, updatedAt: serverTimestamp() });
}

export async function deleteSymptomLog(id: string) {
  await deleteDoc(await authenticatedDocument("symptomLogs", id));
}

export async function createAssistantMessage(input: AssistantMessageInput) {
  const { reference, user } = await authenticatedCollection("assistantMessages");
  const result = await addDoc(reference, { ...input, userId: user.uid, createdAt: serverTimestamp() });
  return result.id;
}

export async function updateAssistantMessage(id: string, updates: Partial<AssistantMessageInput>) {
  await updateDoc(await authenticatedDocument("assistantMessages", id), updates as DocumentData);
}

export async function deleteAssistantMessage(id: string) {
  await deleteDoc(await authenticatedDocument("assistantMessages", id));
}

export const subscribeToPeriodLogs = (userId: string, onData: (records: PeriodLogRecord[]) => void, onError?: (error: Error) => void) =>
  subscribe(userId, "periodLogs", onData, onError);

export const subscribeToSymptomLogs = (userId: string, onData: (records: SymptomLogRecord[]) => void, onError?: (error: Error) => void) =>
  subscribe(userId, "symptomLogs", onData, onError);

export const subscribeToAssistantMessages = (userId: string, onData: (records: AssistantMessageRecord[]) => void, onError?: (error: Error) => void) =>
  subscribe(userId, "assistantMessages", onData, onError);
