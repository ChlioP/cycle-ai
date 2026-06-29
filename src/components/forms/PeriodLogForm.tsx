"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SymptomChip } from "./SymptomChip";
import { useLogSubmit } from "./useLogSubmit";
import { createPeriodLog } from "@/lib/firebase/firestore";
import { Toast } from "@/components/ui/Toast";

const flowOptions = ["Spotting", "Light", "Medium", "Heavy"];

export function PeriodLogForm() {
  const [flow, setFlow] = useState("Medium");
  const [pain, setPain] = useState(3);
  const save = useLogSubmit("Period", async (form) => {
    const data = new FormData(form);
    const startDate = String(data.get("startDate") ?? "");
    const endDate = String(data.get("endDate") ?? "");
    if (endDate && endDate < startDate) throw new Error("End date must follow start date.");
    await createPeriodLog({
      startDate,
      endDate,
      flow: flow.toLowerCase(),
      painLevel: pain,
      notes: String(data.get("notes") ?? ""),
    });
  });

  return <>
    <form className="card form form-width" onSubmit={save.submit}>
      <div className="grid grid-2">
        <div className="field"><label htmlFor="start">Start date</label><Input id="start" name="startDate" type="date" defaultValue="2026-06-28" required /></div>
        <div className="field"><label htmlFor="end">End date <span className="muted">(optional)</span></label><Input id="end" name="endDate" type="date" /></div>
      </div>
      <div><p className="group-label">Flow level</p><div className="chips">{flowOptions.map((option) => <SymptomChip label={option} selected={flow === option} onToggle={() => setFlow(option)} key={option} />)}</div></div>
      <div className="field">
        <label htmlFor="pain">Pain level: <output>{pain}</output> of 5</label>
        <Input className="range" id="pain" type="range" min="0" max="5" value={pain} onChange={(event) => setPain(Number(event.target.value))} />
        <div className="range-labels"><span>None</span><span>Severe</span></div>
      </div>
      <div className="field"><label htmlFor="period-notes">Notes <span className="muted">(optional)</span></label><Textarea id="period-notes" name="notes" placeholder="Changes in flow, clots, medication, or anything you want to remember" /></div>
      <Button type="submit" disabled={save.saving}>{save.saving ? "Saving…" : "Save period"}</Button>
      <p className="muted fine-print">Very heavy bleeding, fainting, or severe pain may need urgent medical attention.</p>
    </form>
    <Toast visible={save.showToast} message={save.message} error={save.error} />
  </>;
}
