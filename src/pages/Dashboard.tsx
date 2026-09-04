import { useNavigate } from "react-router";
import StatCard from "../components/StatCard";
import { RiskBadge, RecommendationBadge } from "../components/RiskBadge";
import { transactions, dashboardStats } from "../data/mockData";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const highRisk = transactions.filter((t) => t.riskLevel === "HIGH");
  const recent = [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold text-[#E8EAF0] tracking-wider">COMMAND CENTER</h1>
          <p className="text-sm text-[#8B93A7] mt-0.5">Real-time fraud detection & risk intelligence</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-[#8B93A7]">LIVE · Jan 15, 2024</div>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs font-mono text-[#00E676]">14 ACTIVE ALERTS</span>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Transactions" value={dashboardStats.totalTransactions.toLocaleString()} sub="All time" accent="primary" />
        <StatCard label="High Risk" value={dashboardStats.highRisk} sub={`${dashboardStats.mediumRisk} medium`} accent="high" />
        <StatCard label="Detection Rate" value={`${dashboardStats.fraudDetectionRate}%`} sub="Model accuracy" accent="low" />
        <StatCard label="Avg Risk Score" value={dashboardStats.avgRiskScore} sub="out of 100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Transactions Today" value={dashboardStats.transactionsToday} sub="↑ 12% vs yesterday" accent="primary" />
        <StatCard label="Low Risk" value={dashboardStats.lowRisk.toLocaleString()} sub="Auto-approved" accent="low" />
        <StatCard label="Under Review" value={dashboardStats.alertsActive} sub="Require analyst action" accent="medium" />
      </div>

      {/* Active alerts strip */}
      <div className="bg-[rgba(255,59,92,0.08)] border border-[rgba(255,59,92,0.2)] rounded-lg p-3 mb-6 flex items-center gap-3">
        <span className="font-mono text-[#FF3B5C] text-sm font-bold shrink-0">⚠ ACTIVE ALERTS</span>
        <div className="h-4 w-px bg-[rgba(255,59,92,0.3)]" />
        <div className="flex gap-3 overflow-x-auto flex-1 min-w-0">
          {highRisk.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/transactions/${t.id}`)}
              className="shrink-0 font-mono text-xs text-[#FF3B5C] hover:text-[#FF6B82] transition-colors"
            >
              {t.id} · {fmt(t.amount)} · Score {t.riskScore}
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions table */}
      <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1E2A45] flex items-center justify-between">
          <span className="font-mono text-sm text-[#E8EAF0] font-semibold tracking-wide">RECENT TRANSACTIONS</span>
          <button onClick={() => navigate("/transactions")} className="text-xs font-mono text-[#F5A623] hover:text-[#F5B845] transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2A45]">
                {["TXN ID", "CUSTOMER", "AMOUNT", "MERCHANT", "TIME", "RISK", "RECOMMENDATION"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#8B93A7] tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((t, i) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/transactions/${t.id}`)}
                  className={`border-b border-[#1E2A45] cursor-pointer transition-colors hover:bg-[#141D35] ${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.01)]"}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#F5A623] font-semibold">{t.id}</td>
                  <td className="px-4 py-3 text-xs text-[#E8EAF0]">{t.customerName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#E8EAF0]">{fmt(t.amount)}</td>
                  <td className="px-4 py-3 text-xs text-[#8B93A7] whitespace-nowrap">{t.merchant}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[#8B93A7] whitespace-nowrap">{fmtTime(t.timestamp)}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={t.riskLevel} score={t.riskScore} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <RecommendationBadge action={t.recommendation} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
