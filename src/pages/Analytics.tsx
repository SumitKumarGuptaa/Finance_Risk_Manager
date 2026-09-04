import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";
import { analyticsData, dashboardStats } from "../data/mockData";

const tooltipStyle = {
  backgroundColor: "#0F1629",
  border: "1px solid #1E2A45",
  borderRadius: "6px",
  fontFamily: "JetBrains Mono",
  fontSize: "11px",
  color: "#E8EAF0",
};

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-mono text-xl font-bold text-[#E8EAF0] tracking-wider">RISK ANALYTICS</h1>
        <p className="text-sm text-[#8B93A7] mt-0.5">Model performance and transaction risk distribution</p>
      </div>

      {/* Model metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Precision", value: "93.1%", color: "#00E676" },
          { label: "Recall", value: "91.4%", color: "#00E676" },
          { label: "F1 Score", value: "92.2%", color: "#F5A623" },
          { label: "ROC-AUC", value: "0.971", color: "#F5A623" },
        ].map((m) => (
          <div key={m.label} className="bg-[#0F1629] border border-[#1E2A45] rounded-lg px-4 py-3">
            <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-1">{m.label}</div>
            <div className="font-mono font-bold text-xl" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Risk Distribution Donut */}
        <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
          <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-4">Risk Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={analyticsData.riskDistribution} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {analyticsData.riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [Number(v).toLocaleString(), "Transactions"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {analyticsData.riskDistribution.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.fill }} />
                  <span className="font-mono text-xs text-[#8B93A7]">{d.name}</span>
                  <span className="font-mono text-xs text-[#E8EAF0] font-semibold">{d.value.toLocaleString()}</span>
                  <span className="font-mono text-[10px] text-[#4A5568]">
                    ({((d.value / dashboardStats.totalTransactions) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Merchant Risk Heatmap */}
        <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
          <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-4">Avg Risk by Merchant Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analyticsData.merchantRisk} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A45" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" width={90} tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Avg Risk Score"]} />
              <Bar dataKey="avgRisk" radius={[0, 3, 3, 0]}>
                {analyticsData.merchantRisk.map((d, i) => (
                  <Cell key={i} fill={d.avgRisk >= 71 ? "#FF3B5C" : d.avgRisk >= 31 ? "#FFD600" : "#00E676"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume over time */}
      <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5 mb-5">
        <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-4">Transaction Volume & High-Risk Count (7 Days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={analyticsData.volumeOverTime} margin={{ left: 0, right: 12, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2A45" />
            <XAxis dataKey="date" tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "JetBrains Mono", color: "#8B93A7" }} />
            <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#F5A623" strokeWidth={2} dot={false} name="Total TXN" />
            <Line yAxisId="right" type="monotone" dataKey="highRisk" stroke="#FF3B5C" strokeWidth={2} dot={{ fill: "#FF3B5C", r: 3 }} name="High Risk" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk score histogram */}
      <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
        <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-4">Risk Score Distribution</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={analyticsData.riskScoreHistogram} margin={{ left: 0, right: 12, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2A45" vertical={false} />
            <XAxis dataKey="range" tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8B93A7", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [Number(v).toLocaleString(), "Transactions"]} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {analyticsData.riskScoreHistogram.map((d, i) => {
                const mid = parseInt(d.range.split("–")[1]);
                return <Cell key={i} fill={mid >= 71 ? "#FF3B5C" : mid >= 31 ? "#FFD600" : "#00E676"} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
