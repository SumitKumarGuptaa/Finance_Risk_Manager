import { useState } from "react";
import { useNavigate } from "react-router";
import { RiskBadge, RecommendationBadge } from "../components/RiskBadge";
import { transactions } from "../data/mockData";
import type { RiskLevel } from "../data/mockData";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function fmtTime(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function Transactions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"time" | "score" | "amount">("time");

  const filtered = transactions
    .filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q);
      const matchesRisk = riskFilter === "ALL" || t.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.riskScore - a.riskScore;
      if (sortBy === "amount") return b.amount - a.amount;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-mono text-xl font-bold text-[#E8EAF0] tracking-wider">TRANSACTION MONITOR</h1>
        <p className="text-sm text-[#8B93A7] mt-0.5">{transactions.length} transactions · {transactions.filter(t => t.riskLevel === "HIGH").length} high risk</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, customer, merchant..."
          className="flex-1 min-w-48 bg-[#0F1629] border border-[#1E2A45] rounded px-3 py-2 text-sm text-[#E8EAF0] placeholder-[#4A5568] font-mono focus:outline-none focus:border-[#F5A623] transition-colors"
        />
        <div className="flex gap-1">
          {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-2 text-xs font-mono border rounded transition-colors ${
                riskFilter === r
                  ? "bg-[#F5A623] text-[#080C18] border-[#F5A623] font-bold"
                  : "text-[#8B93A7] border-[#1E2A45] hover:border-[#253352] hover:text-[#E8EAF0]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-[#0F1629] border border-[#1E2A45] rounded px-3 py-2 text-xs font-mono text-[#8B93A7] focus:outline-none focus:border-[#F5A623]"
        >
          <option value="time">Sort: Time</option>
          <option value="score">Sort: Risk Score</option>
          <option value="amount">Sort: Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2A45]">
                {["TXN ID", "CUSTOMER", "AMOUNT", "MERCHANT", "LOCATION", "DEVICE", "TIME", "RISK SCORE", "RECOMMENDATION"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] text-[#8B93A7] tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#8B93A7] font-mono text-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/transactions/${t.id}`)}
                    className={`border-b border-[#1E2A45] cursor-pointer transition-colors hover:bg-[#141D35] ${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.01)]"}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#F5A623] font-semibold">{t.id}</td>
                    <td className="px-4 py-3 text-xs text-[#E8EAF0] whitespace-nowrap">{t.customerName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#E8EAF0]">{fmt(t.amount)}</td>
                    <td className="px-4 py-3 text-xs text-[#8B93A7] whitespace-nowrap">{t.merchant}</td>
                    <td className="px-4 py-3 text-xs text-[#8B93A7]">{t.location}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${t.isNewDevice ? "text-[#FF3B5C] bg-[rgba(255,59,92,0.1)] border-[rgba(255,59,92,0.2)]" : "text-[#8B93A7] border-[#1E2A45]"}`}>
                        {t.isNewDevice ? "NEW" : "KNOWN"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-[#8B93A7] whitespace-nowrap">{fmtTime(t.timestamp)}</td>
                    <td className="px-4 py-3">
                      <RiskBadge level={t.riskLevel} score={t.riskScore} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <RecommendationBadge action={t.recommendation} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 text-xs font-mono text-[#8B93A7]">
        Showing {filtered.length} of {transactions.length} transactions
      </div>
    </div>
  );
}
