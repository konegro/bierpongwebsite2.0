import type { LucideIcon } from "lucide-react";

export function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="chamfer flex flex-col gap-2 border border-doom-border bg-doom-card p-3.5">
      <Icon size={18} className="text-doom-green" />
      <span className="font-mono tabular text-2xl font-bold leading-none">{value}</span>
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-doom-silver/50">
        {label}
      </span>
    </div>
  );
}
