import type { ComponentPropsWithoutRef } from "react";

export function Select({ className = "", ...props }: ComponentPropsWithoutRef<"select">) {
  return <select className={`min-h-12 w-full rounded-xl border border-cycle-border bg-cycle-surface px-[13px] py-[11px] ${className}`.trim()} {...props} />;
}
