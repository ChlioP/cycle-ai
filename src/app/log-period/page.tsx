import { FormTopNav } from "@/components/layout/TopNav";
import { PeriodLogForm } from "@/components/forms/PeriodLogForm";
import { PageHead } from "@/components/ui/PageHead";
import { LegalFooter } from "@/components/layout/LegalFooter";

export const metadata = { title: "Log period" };
export default function LogPeriodPage() {
  return <main className="main" id="content"><FormTopNav cancelHref="/calendar" /><PageHead eyebrow="New entry" title="Log your period" description="Record what you know. You can update this later." /><PeriodLogForm /><LegalFooter /></main>;
}
