export function SuggestedPromptCard({ prompt, onSelect }: { prompt: string; onSelect: (prompt: string) => void }) {
  return <button className="chip" type="button" onClick={() => onSelect(prompt)}>{prompt}</button>;
}
