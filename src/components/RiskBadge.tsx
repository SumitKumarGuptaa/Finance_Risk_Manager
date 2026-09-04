import type { RiskLevel, Recommendation } from "../data/mockData";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: "sm" | "md" | "lg";
}

const riskConfig = {
  HIGH: { color: "text-[#FF3B5C]", bg: "bg-[rgba(255,59,92,0.15)]", border: "border-[rgba(255,59,92,0.3)]" },
  MEDIUM: { color: "text-[#FFD600]", bg: "bg-[rgba(255,214,0,0.15)]", border: "border-[rgba(255,214,0,0.3)]" },
  LOW: { color: "text-[#00E676]", bg: "bg-[rgba(0,230,118,0.15)]", border: "border-[rgba(0,230,118,0.3)]" },
};

export function RiskBadge({ level, score, size = "md" }: RiskBadgeProps) {
  const cfg = riskConfig[level];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-sm px-4 py-2" : "text-xs px-3 py-1";
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold border rounded ${cfg.color} ${cfg.bg} ${cfg.border} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === "HIGH" ? "bg-[#FF3B5C]" : level === "MEDIUM" ? "bg-[#FFD600]" : "bg-[#00E676]"}`} />
      {level}
      {score !== undefined && <span className="opacity-70">· {score}</span>}
    </span>
  );
}

interface RecommendationBadgeProps {
  action: Recommendation;
}

const recConfig = {
  APPROVE: { color: "text-[#00E676]", bg: "bg-[rgba(0,230,118,0.12)]", border: "border-[rgba(0,230,118,0.3)]", icon: "✓" },
  VERIFY: { color: "text-[#64B5F6]", bg: "bg-[rgba(100,181,246,0.12)]", border: "border-[rgba(100,181,246,0.3)]", icon: "?" },
  HOLD: { color: "text-[#FFD600]", bg: "bg-[rgba(255,214,0,0.12)]", border: "border-[rgba(255,214,0,0.3)]", icon: "⏸" },
  BLOCK: { color: "text-[#FF3B5C]", bg: "bg-[rgba(255,59,92,0.12)]", border: "border-[rgba(255,59,92,0.3)]", icon: "✕" },
};

export function RecommendationBadge({ action }: RecommendationBadgeProps) {
  const cfg = recConfig[action];
  return (
    <span className={`inline-flex items-center gap-2 font-mono font-bold text-sm px-4 py-2 border rounded ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span>{cfg.icon}</span>
      {action}
    </span>
  );
}
