export function SymptomChip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return <button className="chip" type="button" aria-pressed={selected} onClick={onToggle}>{label}</button>;
}
