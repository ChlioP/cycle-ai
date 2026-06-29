import { AppShell } from "@/components/layout/AppShell";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { Badge as Tag } from "@/components/ui/Badge";
import { PageHead } from "@/components/ui/PageHead";

export const metadata = { title: "Calendar" };

export default function CalendarPage() {
  return <AppShell>
    <PageHead eyebrow="Cycle calendar" title="June 2026" description="Logged history and estimated windows are visually distinct." action={{ href: "/log-period", label: "Log period" }} />
    <div className="grid grid-2">
      <section className="card"><MonthCalendar /></section>
      <div className="grid">
        <section className="card soft"><p className="eyebrow">Selected date</p><h2>June 28 · Select a log to add details</h2></section>
        <section className="card alert"><Tag tone="warn">Lower confidence</Tag><h2 className="spaced-title">Predicted period: July 4–8</h2><p className="muted content-gap">The range is wider because your recent cycle lengths varied by nine days.</p></section>
      </div>
    </div>
  </AppShell>;
}
