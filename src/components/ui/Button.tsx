import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  secondary?: boolean;
};

export function Button({ href, secondary = false, className = "", children, ...props }: Props) {
  const tone = secondary
    ? "border-cycle-border bg-cycle-surface text-cycle-text hover:bg-cycle-soft"
    : "border-transparent bg-cycle-primary text-white hover:bg-cycle-primary-strong";
  const classes = `inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-extrabold no-underline transition-colors disabled:cursor-wait disabled:opacity-55 ${tone} ${className}`.trim();
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
