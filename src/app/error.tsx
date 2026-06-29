"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="main"><div className="card error-state" role="alert"><p className="eyebrow">Something went wrong</p><h1>We couldn’t load this view</h1><p className="muted">Your saved data has not been changed. Try loading the page again.</p><Button onClick={reset}>Try again</Button></div></main>;
}
