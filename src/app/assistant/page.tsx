import { AppShell } from "@/components/layout/AppShell";
import { AssistantChatBox } from "@/components/assistant/AssistantChatBox";
import { PageHead } from "@/components/ui/PageHead";

export const metadata = { title: "Assistant" };

export default function AssistantPage() {
  return <AppShell note="CycleCare AI can explain logged patterns, but it cannot diagnose or replace a clinician.">
    <PageHead eyebrow="Cycle assistant" title="Ask about your patterns" />
    <section className="card soft health-note"><strong>Health & safety</strong><p className="muted">Answers are educational and based on your fictional demo logs. Seek professional care for severe pain, very heavy bleeding, fainting, pregnancy concerns, or symptoms that worry you.</p></section>
    <AssistantChatBox />
  </AppShell>;
}
