"use client";

import { useState } from "react";
import { useHealthData } from "@/components/providers/HealthDataProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function MonthCalendar() {
  const { periodLogs, symptomLogs, loading } = useHealthData();
  const [selected, setSelected] = useState("June 28");
  const periodDates = new Set(periodLogs.flatMap((log) => {
    if (!log.startDate.startsWith("2026-06")) return [];
    const start = Number(log.startDate.slice(-2));
    const end = log.endDate.startsWith("2026-06") ? Number(log.endDate.slice(-2)) : start;
    return Array.from({ length: Math.max(1, end - start + 1) }, (_, index) => start + index);
  }));
  const symptomDates = new Set(symptomLogs.filter((log) => log.date.startsWith("2026-06")).map((log) => Number(log.date.slice(-2))));
  const days = [
    ...Array.from({ length: 30 }, (_, index) => {
      const day = index + 1;
      const type = periodDates.has(day) ? "period" : symptomDates.has(day) ? "symptom" : day >= 24 && day <= 27 ? "pms" : "";
      return { label: day, month: "June", type };
    }),
    ...Array.from({ length: 5 }, (_, index) => ({ label: index + 1, month: "July", type: "predicted" })),
  ];
  if (loading) return <div className="calendar-loading" aria-busy="true" aria-label="Loading calendar"><Skeleton className="h-80 w-full rounded-2xl" /></div>;

  return <>
    <div className="calendar" aria-label="June 2026 calendar">
      {"SMTWTFS".split("").map((day, index) => <span className="weekday" key={`${day}-${index}`}>{day}</span>)}
      {days.map((day) => {
        const date = `${day.month} ${day.label}`;
        return <button type="button" className={`day ${day.type}`.trim()} key={date} aria-current={selected === date ? "date" : undefined} aria-label={`${date}${day.type ? `, ${day.type}` : ""}`} onClick={() => setSelected(date)}>{day.label}</button>;
      })}
    </div>
    <div className="legend"><span><i className="legend-period" />Period</span><span><i className="legend-predicted" />Predicted</span><span><i className="legend-symptom" />Symptom</span><span><i className="legend-pms" />PMS window</span></div>
    {periodLogs.length === 0 && symptomLogs.length === 0 ? <EmptyState title="No calendar entries yet" description="Period and symptom logs will appear on this calendar." action={{ href: "/log-period", label: "Add first log" }} /> : null}
    <p className="sr-only" aria-live="polite">{selected} selected</p>
  </>;
}
