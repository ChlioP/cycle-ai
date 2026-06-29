import type { ComponentPropsWithoutRef } from "react";

export function Card({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={`rounded-cycle border border-cycle-border bg-cycle-surface p-5 shadow-cycle ${className}`.trim()} {...props} />;
}
