"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./navigation";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { LegalFooter } from "./LegalFooter";

export function AppShell({ children, note }: { children: React.ReactNode; note?: string }) {
  const pathname = usePathname();
  return <>
    <a className="skip" href="#content">Skip to content</a>
    <div className="app">
      <Sidebar pathname={pathname} note={note} />
      <main className="main" id="content"><TopNav />{children}<LegalFooter /></main>
    </div>
    <nav className="bottom-nav" aria-label="Primary">
      {navigationItems.map((item) => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}><span className="nav-icon">{item.icon}</span><small>{item.mobile}</small></Link>)}
    </nav>
  </>;
}
