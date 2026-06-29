import Link from "next/link";

export function LegalFooter() {
  return <footer className="legal-footer">
    <p><strong>Medical disclaimer:</strong> CycleCare provides educational summaries of your logs. It does not diagnose conditions or replace professional medical care.</p>
    <nav aria-label="Legal"><Link href="/medical-disclaimer">Medical disclaimer</Link><Link href="/privacy">Privacy policy</Link></nav>
  </footer>;
}
