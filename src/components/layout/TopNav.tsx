import Link from "next/link";

export function Brand() {
  return <Link className="brand" href="/dashboard"><span className="brand-mark">C</span>CycleCare AI</Link>;
}

export function TopNav() {
  return <header className="topbar"><Brand /><button className="avatar" aria-label="Open profile">AM</button></header>;
}

export function FormTopNav({ cancelHref }: { cancelHref: string }) {
  return <header className="topbar"><Brand /><Link href={cancelHref}>Cancel</Link></header>;
}
