import { Button } from "./Button";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: { href: string; label: string } }) {
  return <div className="empty-state" role="status">
    <span className="empty-state-icon" aria-hidden="true">○</span>
    <h2>{title}</h2>
    <p className="muted">{description}</p>
    {action ? <Button href={action.href}>{action.label}</Button> : null}
  </div>;
}
