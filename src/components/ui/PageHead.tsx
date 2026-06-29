import { Button } from "./Button";

export function PageHead({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: { href: string; label: string; secondary?: boolean } }) {
  return <div className="mb-6 flex items-end justify-between gap-4">
    <div><p className="mb-1.5 text-xs font-extrabold tracking-[.09em] text-cycle-primary-strong uppercase">{eyebrow}</p><h1>{title}</h1>{description ? <p className="mt-2 max-w-[56ch] text-cycle-muted">{description}</p> : null}</div>
    {action ? <Button href={action.href} secondary={action.secondary}>{action.label}</Button> : null}
  </div>;
}
