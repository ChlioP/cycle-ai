"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SuggestedPromptCard } from "./SuggestedPromptCard";
import { mockAssistantMessages, suggestedPrompts, type AssistantMessage } from "@/lib/mockData";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { createAssistantMessage } from "@/lib/firebase/firestore";
import { generateAssistantReply } from "@/lib/assistantInsights";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function AssistantChatBox() {
  const { assistantMessages, periodLogs, symptomLogs, source, persistence, loading, error } = useHealthData();
  const [input, setInput] = useState("");
  const [pendingMessages, setPendingMessages] = useState<AssistantMessage[]>([]);
  const storedMessages = assistantMessages.length > 0 ? assistantMessages : source === "demo" ? mockAssistantMessages : [];
  const messages = [...storedMessages, ...pendingMessages.filter((pending) =>
    !storedMessages.some((stored) => stored.role === pending.role && stored.text === pending.text),
  )];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    const id = Date.now();
    const reply = generateAssistantReply(text, periodLogs, symptomLogs);
    setPendingMessages((current) => [...current, { id, role: "user", text }, { id: id + 1, role: "ai", text: "Thinking…" }]);
    setInput("");
    if (source === "real" && persistence === "firestore") await createAssistantMessage({ role: "user", text }).catch(() => undefined);
    window.setTimeout(() => {
      setPendingMessages((current) => current.map((message) => message.id === id + 1 ? { ...message, text: reply } : message));
      if (source === "real" && persistence === "firestore") void createAssistantMessage({ role: "ai", text: reply }).catch(() => undefined);
    }, 650);
  };

  return <>
    <div className="chips prompt-chips">
      {suggestedPrompts.map((prompt) => <SuggestedPromptCard prompt={prompt} onSelect={setInput} key={prompt} />)}
    </div>
    {error ? <p className="data-error" role="alert">Conversation history could not refresh.</p> : null}
    <div className="chat" aria-live="polite" aria-busy={loading}>
      {loading ? <><Skeleton className="h-16 w-3/4 rounded-2xl" /><Skeleton className="ml-auto h-12 w-1/2 rounded-2xl" /></> : null}
      {!loading && messages.length === 0 ? <EmptyState title="Start a private conversation" description="Ask about your logged cycle timing, symptoms, or prediction confidence." /> : null}
      {!loading ? messages.map((message) => <p className={`bubble ${message.role}`} key={message.id}>{message.text}</p>) : null}
    </div>
    <form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="chat-input">Message CycleCare AI</label><Input id="chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your cycle data…" autoComplete="off" /><Button type="submit">Send</Button></form>
  </>;
}
