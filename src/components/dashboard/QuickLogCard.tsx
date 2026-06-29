import Link from "next/link";

export function QuickLogCard({ name, detail, href }: { name: string; detail: string; href: string }) {
  return <Link className="quick" href={href}>
    <span className="quick-icon" />
    <strong>{name}</strong>
    <span className="muted">{detail}</span>
  </Link>;
}
