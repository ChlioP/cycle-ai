import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { PageHead } from "@/components/ui/PageHead";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return <AppShell>
    <PageHead eyebrow="Your data" title="Privacy policy" description="How this portfolio application handles information you choose to enter." />
    <Card className="legal-copy">
      <p className="muted">Last updated: June 28, 2026</p>
      <h2>Information collected</h2>
      <p>CycleCare stores period dates, flow and pain entries, symptom check-ins, optional notes, and assistant conversation history. Firebase Authentication assigns an anonymous user identifier so records can be separated by user.</p>
      <h2>How information is used</h2>
      <p>Entries are used only to provide the calendar, analytics, predictions, and assistant summaries shown in the application. This portfolio application does not sell health information or use it for advertising.</p>
      <h2>Storage and access</h2>
      <p>Configured deployments store records in Google Firebase Cloud Firestore. Security rules restrict each authenticated user to documents under their own user identifier. Application operators and infrastructure providers may still have administrative access needed to operate the service.</p>
      <h2>Retention and deletion</h2>
      <p>Records remain until deleted through the application or removed by the project operator. Anonymous authentication may make account recovery impossible after browser data is cleared or the anonymous session is lost.</p>
      <h2>Your choices</h2>
      <p>Do not enter information you do not want stored. You may delete individual period and symptom records through the application’s Firestore data controls. For project-level privacy requests, contact the owner through the portfolio or repository where this deployment is published.</p>
    </Card>
  </AppShell>;
}
