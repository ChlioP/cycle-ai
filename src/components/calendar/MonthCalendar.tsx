"use client";

import { useState } from "react";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cycleLengthsFromPeriods, formatDateOnly, predictNextPeriod } from "@/lib/cycleCalculations";

export function MonthCalendar() {
  const { periodLogs, symptomLogs, loading, source } = useHealthData();
  const latest = periodLogs.map((log) => log.startDate).toSorted().at(-1) ?? formatDateOnly(new Date());
  const [year, month] = latest.split("-").map(Number);
  const monthStart = new Date(year, month - 1, 1, 12);
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(monthStart);
  const [selected, setSelected] = useState(latest);
  const count = new Date(year, month, 0, 12).getDate();
  const leading = monthStart.getDay();
  const cycleLengths = cycleLengthsFromPeriods(periodLogs);
  const prediction = predictNextPeriod(latest, cycleLengths.length > 0 ? cycleLengths : source === "real" ? [28] : [31], formatDateOnly(new Date()));
  const predictedStart = prediction ? formatDateOnly(prediction.rangeStart) : "";
  const predictedEnd = prediction ? formatDateOnly(prediction.rangeEnd) : "";
  const days = Array.from({ length: leading + count }, (_, index) => {
    if (index < leading) return null;
    const day = index - leading + 1;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const period = periodLogs.some((log) => date >= log.startDate && date <= (log.endDate || log.startDate));
    const symptom = symptomLogs.some((log) => log.date === date);
    const predicted = date >= predictedStart && date <= predictedEnd;
    return { label: day, date, type: period ? "period" : symptom ? "symptom" : predicted ? "predicted" : "" };
  });
  if (loading) return <div className="calendar-loading" aria-busy="true" aria-label="Loading calendar"><Skeleton className="h-80 w-full rounded-2xl" /></div>;

  return <>
    {source === "demo" ? <p className="preview-note"><strong>Sample preview data</strong> — not saved to your history.</p> : null}
    <p className="eyebrow">{monthName}</p>
    <div className="calendar" aria-label={`${monthName} calendar`}>
      {"SMTWTFS".split("").map((day, index) => <span className="weekday" key={`${day}-${index}`}>{day}</span>)}
      {days.map((day, index) => {
        if (!day) return <span key={`empty-${index}`} />;
        return <button type="button" className={`day ${day.type}`.trim()} key={day.date} aria-current={selected === day.date ? "date" : undefined} aria-label={`${day.date}${day.type ? `, ${day.type}` : ""}`} onClick={() => setSelected(day.date)}>{day.label}</button>;
      })}
    </div>
    <div className="legend"><span><i className="legend-period" />Period</span><span><i className="legend-predicted" />Predicted</span><span><i className="legend-symptom" />Symptom</span><span><i className="legend-pms" />PMS window</span></div>
    {source === "real" && periodLogs.length === 0 && symptomLogs.length === 0 ? <EmptyState title="No calendar entries yet" description="Period and symptom logs will appear on this calendar." action={{ href: "/log-period", label: "Add first log" }} /> : null}
    <p className="sr-only" aria-live="polite">{selected} selected</p>
  </>;
}
