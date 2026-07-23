"use client";

import { useState } from "react";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { FlowLevel, PeriodLog } from "@/lib/mockData";

export function PeriodHistory() {
  const { periodLogs, source, updatePeriod, deletePeriod } = useHealthData();
  const [editing, setEditing] = useState<PeriodLog | null>(null);
  const [error, setError] = useState("");

  if (source === "demo") return <section className="card soft">
    <p className="eyebrow">Cycle history</p>
    <h2>No saved periods yet</h2>
    <p className="muted content-gap">The calendar is showing sample preview data only. It will be replaced after your first period is saved.</p>
    <Button className="content-gap-large" href="/log-period">Log first period</Button>
  </section>;

  const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const endDate = String(data.get("endDate") ?? "");
    try {
      await updatePeriod(editing.id, {
        startDate: String(data.get("startDate") ?? ""),
        ...(endDate ? { endDate } : {}),
        flow: String(data.get("flow") ?? "medium") as FlowLevel,
        painLevel: Number(data.get("painLevel") ?? 0),
        notes: editing.notes,
      });
      setEditing(null);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update period.");
    }
  };

  const remove = async (record: PeriodLog) => {
    if (!window.confirm(`Delete the period starting ${record.startDate}?`)) return;
    await deletePeriod(record.id);
  };

  return <section className="card">
    <div className="card-head"><div><p className="eyebrow">Cycle history</p><h2>Your saved periods</h2></div></div>
    {error ? <p className="data-error" role="alert">{error}</p> : null}
    <div className="list">
      {periodLogs.toSorted((a, b) => b.startDate.localeCompare(a.startDate)).map((record) => editing?.id === record.id ?
        <form className="form" onSubmit={saveEdit} key={record.id}>
          <div className="grid grid-2">
            <div className="field"><label htmlFor={`edit-start-${record.id}`}>Start date</label><Input id={`edit-start-${record.id}`} name="startDate" type="date" defaultValue={record.startDate} required /></div>
            <div className="field"><label htmlFor={`edit-end-${record.id}`}>End date <span className="muted">(optional)</span></label><Input id={`edit-end-${record.id}`} name="endDate" type="date" defaultValue={record.endDate} /></div>
          </div>
          <input type="hidden" name="flow" value={record.flow} /><input type="hidden" name="painLevel" value={record.painLevel} />
          <div className="history-actions"><Button type="submit" className="small">Save</Button><Button type="button" secondary className="small" onClick={() => setEditing(null)}>Cancel</Button></div>
        </form> :
        <div className="row" key={record.id}>
          <i className="dot" />
          <div><strong>{record.startDate}{record.endDate ? ` – ${record.endDate}` : ""}</strong><p className="muted">{record.flow} flow · pain {record.painLevel}/5</p></div>
          <div className="history-actions"><Button type="button" secondary className="small" onClick={() => setEditing(record)}>Edit</Button><Button type="button" secondary className="small" onClick={() => void remove(record)}>Delete</Button></div>
        </div>,
      )}
    </div>
  </section>;
}
