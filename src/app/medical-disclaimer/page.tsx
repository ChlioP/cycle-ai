import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { PageHead } from "@/components/ui/PageHead";

export const metadata = { title: "Medical disclaimer" };

export default function MedicalDisclaimerPage() {
  return <AppShell>
    <PageHead eyebrow="Important information" title="Medical disclaimer" description="Please understand the limits of CycleCare before relying on its summaries." />
    <Card className="legal-copy">
      <h2>Educational information only</h2>
      <p>CycleCare organizes information you choose to log and presents estimated patterns. It is not a medical device, does not provide a diagnosis, and is not a substitute for advice from a qualified healthcare professional.</p>
      <h2>Predictions are estimates</h2>
      <p>Cycle timing and symptom associations can change. Prediction windows and confidence scores are based only on available entries and may be incomplete or inaccurate. Do not use CycleCare as contraception or to determine pregnancy status.</p>
      <h2>When to seek care</h2>
      <p>Contact a healthcare professional about symptoms that concern you. Seek urgent medical care for severe or sudden pain, very heavy bleeding, fainting, breathing difficulty, signs of pregnancy complications, or another possible emergency.</p>
    </Card>
  </AppShell>;
}
