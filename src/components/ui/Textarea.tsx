import type { ComponentPropsWithoutRef } from "react";

export function Textarea({ className = "", ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={`min-h-26 w-full resize-y rounded-xl border border-cycle-border bg-cycle-surface px-[13px] py-[11px] ${className}`.trim()} {...props} />;
}
