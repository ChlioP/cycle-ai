"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SymptomChip } from "./SymptomChip";
import { useLogSubmit } from "./useLogSubmit";
import { createSymptomLog } from "@/lib/firebase/firestore";
import { Toast } from "@/components/ui/Toast";

const symptomOptions = ["Cramps", "Headache", "Back pain", "Bloating", "Breast tenderness", "Nausea"];

export function SymptomLogForm() {
  const [selected, setSelected] = useState(() => new Set(["Cramps", "Back pain"]));
  const [severity, setSeverity] = useState(3);
  const save = useLogSubmit("Symptoms", async (form) => {
    if (selected.size === 0) throw new Error("Select at least one symptom.");
    const data = new FormData(form);
    const sleep = String(data.get("sleepHours") ?? "");
    await createSymptomLog({
      date: String(data.get("date") ?? ""),
      symptoms: [...selected],
      severity,
      mood: String(data.get("mood") ?? ""),
      energy: String(data.get("energy") ?? ""),
      sleepHours: sleep === "" ? null : Number(sleep),
      stress: String(data.get("stress") ?? ""),
      notes: String(data.get("notes") ?? ""),
    });
  });
  const toggle = (option: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(option)) next.delete(option); else next.add(option);
    return next;
  });

  return <>
    <form className="card form form-width wide" onSubmit={save.submit}>
      <div className="field"><label htmlFor="symptom-date">Date</label><Input id="symptom-date" name="date" type="date" defaultValue="2026-06-28" required /></div>
      <div><p className="group-label">Symptoms</p><div className="chips">{symptomOptions.map((option) => <SymptomChip label={option} selected={selected.has(option)} onToggle={() => toggle(option)} key={option} />)}</div></div>
      <div className="field"><label htmlFor="severity">Overall severity: <output>{severity}</output> of 5</label><Input className="range" id="severity" type="range" min="1" max="5" value={severity} onChange={(event) => setSeverity(Number(event.target.value))} /></div>
      <div className="grid grid-2">
        <div className="field"><label htmlFor="mood">Mood</label><Select id="mood" name="mood" defaultValue="Low"><option>Calm</option><option>Low</option><option>Anxious</option><option>Irritable</option><option>Positive</option></Select></div>
        <div className="field"><label htmlFor="energy">Energy</label><Select id="energy" name="energy" defaultValue="Low"><option>High</option><option>Low</option><option>Very low</option></Select></div>
        <div className="field"><label htmlFor="sleep">Sleep</label><Input id="sleep" name="sleepHours" type="number" min="0" max="24" step=".5" defaultValue="6.5" inputMode="decimal" /></div>
        <div className="field"><label htmlFor="stress">Stress</label><Select id="stress" name="stress" defaultValue="Moderate"><option>Low</option><option>Moderate</option><option>High</option></Select></div>
      </div>
      <div className="field"><label htmlFor="symptom-notes">Notes</label><Textarea id="symptom-notes" name="notes" placeholder="What helped, what changed, or anything else" /></div>
      <Button type="submit" disabled={save.saving}>{save.saving ? "Saving…" : "Save symptoms"}</Button>
    </form>
    <Toast visible={save.showToast} message={save.message} error={save.error} />
  </>;
}
