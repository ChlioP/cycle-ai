"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="main"><div className="card error-state" role="alert"><h1>CycleCare couldn’t start</h1><p>Please retry. Your stored health data is unaffected.</p><button className="button" onClick={reset}>Try again</button></div></main></body></html>;
}
