import { FormTopNav } from "@/components/layout/TopNav";
import { SymptomLogForm } from "@/components/forms/SymptomLogForm";
import { PageHead } from "@/components/ui/PageHead";
import { LegalFooter } from "@/components/layout/LegalFooter";

export const metadata = { title: "Log symptoms" };
export default function LogSymptomsPage() {
  return <main className="main" id="content"><FormTopNav cancelHref="/dashboard" /><PageHead eyebrow="Daily check-in" title="How are you feeling?" description="Choose any symptoms that apply today." /><SymptomLogForm /><LegalFooter /></main>;
}
