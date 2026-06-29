export function Badge({ children, tone = "" }: { children: React.ReactNode; tone?: "warn" | "blush" | "" }) {
  const color = tone === "warn"
    ? "bg-[#fae7d8] text-[#7b421a]"
    : tone === "blush"
      ? "bg-cycle-blush-soft text-[#873d4d]"
      : "bg-cycle-soft text-cycle-primary-strong";
  return <span className={`tag ${tone} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${color}`.trim()}>{children}</span>;
}
