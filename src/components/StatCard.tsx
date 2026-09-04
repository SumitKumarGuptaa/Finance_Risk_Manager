interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "high" | "medium" | "low" | "primary";
}

const accentColor = {
  default: "text-[#E8EAF0]",
  high: "text-[#FF3B5C]",
  medium: "text-[#FFD600]",
  low: "text-[#00E676]",
  primary: "text-[#F5A623]",
};

export default function StatCard({ label, value, sub, accent = "default" }: StatCardProps) {
  return (
    <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5 flex flex-col gap-1">
      <span className="text-xs font-mono text-[#8B93A7] uppercase tracking-widest">{label}</span>
      <span className={`text-3xl font-mono font-bold ${accentColor[accent]}`}>{value}</span>
      {sub && <span className="text-xs text-[#8B93A7]">{sub}</span>}
    </div>
  );
}
