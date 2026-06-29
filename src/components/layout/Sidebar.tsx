import Link from "next/link";
import { Brand } from "./TopNav";
import { navigationItems } from "./navigation";

export function Sidebar({ pathname, note }: { pathname: string; note?: string }) {
  const active = (href: string) => pathname.startsWith(href);
  return <aside className="sidebar">
    <Brand />
    <nav className="side-nav" aria-label="Primary">
      {navigationItems.slice(0, 2).map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}
      <Link href="/log-period" aria-current={pathname === "/log-period" ? "page" : undefined}>Log period</Link>
      {navigationItems.slice(2).map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}
    </nav>
    {note ? <p className="side-note">{note}</p> : null}
  </aside>;
}
