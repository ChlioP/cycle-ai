import { AppShell } from "@/components/layout/AppShell";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { PageHead } from "@/components/ui/PageHead";
import { PeriodHistory } from "@/components/calendar/PeriodHistory";

export const metadata = { title: "Calendar" };

export default function CalendarPage() {
  return <AppShell>
    <PageHead eyebrow="Cycle calendar" title="Your calendar" description="Logged history and estimated windows are visually distinct." action={{ href: "/log-period", label: "Log period" }} />
    <div className="grid grid-2">
      <section className="card"><MonthCalendar /></section>
      <div className="grid"><PeriodHistory /></div>
    </div>
  </AppShell>;
}
