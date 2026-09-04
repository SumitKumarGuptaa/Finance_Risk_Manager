import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { transactions, customers } from "../data/mockData";
import { RiskBadge, RecommendationBadge } from "../components/RiskBadge";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
function fmtTime(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "medium" });
}

function RiskScoreGauge({ score }: { score: number }) {
  const color = score >= 71 ? "#FF3B5C" : score >= 31 ? "#FFD600" : "#00E676";
  const pct = score;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="70" viewBox="0 0 120 70">
        <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="#1E2A45" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M10 65 A50 50 0 0 1 110 65"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 157} 157`}
        />
        <text x="60" y="60" textAnchor="middle" fill={color} fontFamily="JetBrains Mono" fontWeight="700" fontSize="22">
          {score}
        </text>
      </svg>
      <span className="font-mono text-xs text-[#8B93A7]">/ 100</span>
    </div>
  );
}

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const txn = transactions.find((t) => t.id === id);
  const customer = customers.find((c) => c.id === txn?.customerId);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [investigating, setInvestigating] = useState(false);

  useEffect(() => {
    setRevealedSteps(0);
    setInvestigating(false);
  }, [id]);

  function runInvestigation() {
    if (!txn || investigating) return;
    setInvestigating(true);
    setRevealedSteps(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealedSteps(i);
      if (i >= txn.aiInvestigation.steps.length) clearInterval(interval);
    }, 600);
  }

  if (!txn) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full gap-4">
        <span className="font-mono text-[#8B93A7]">Transaction not found</span>
        <button onClick={() => navigate("/transactions")} className="text-sm font-mono text-[#F5A623] hover:underline">
          ← Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back + header */}
      <button onClick={() => navigate(-1)} className="text-xs font-mono text-[#8B93A7] hover:text-[#E8EAF0] mb-4 transition-colors">
        ← Back
      </button>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-mono text-2xl font-bold text-[#E8EAF0]">{txn.id}</h1>
            <RiskBadge level={txn.riskLevel} score={txn.riskScore} size="lg" />
          </div>
          <p className="text-sm text-[#8B93A7] mt-1">{fmtTime(txn.timestamp)}</p>
        </div>
        <RecommendationBadge action={txn.recommendation} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: Transaction info + risk factors */}
        <div className="flex flex-col gap-5">
          {/* Risk score + metadata */}
          <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
            <div className="flex items-start gap-6">
              <RiskScoreGauge score={txn.riskScore} />
              <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Amount</div>
                  <div className="font-mono font-bold text-[#E8EAF0]">{fmt(txn.amount)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Fraud Prob.</div>
                  <div className="font-mono font-bold text-[#FF3B5C]">{(txn.fraudProbability * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Customer</div>
                  <div className="text-[#E8EAF0] text-xs">{txn.customerName} ({txn.customerId})</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Avg Amount</div>
                  <div className="font-mono text-xs text-[#8B93A7]">{fmt(txn.avgCustomerAmount)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Merchant</div>
                  <div className="text-xs text-[#E8EAF0]">{txn.merchant}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Method</div>
                  <div className="text-xs text-[#E8EAF0]">{txn.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Location</div>
                  <div className="text-xs text-[#E8EAF0]">
                    {txn.location}
                    {txn.isNewLocation && (
                      <span className="ml-1.5 text-[10px] font-mono text-[#FF3B5C] bg-[rgba(255,59,92,0.1)] px-1 rounded">NEW</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Device</div>
                  <div className="text-xs text-[#E8EAF0]">
                    {txn.deviceId}
                    {txn.isNewDevice && (
                      <span className="ml-1.5 text-[10px] font-mono text-[#FF3B5C] bg-[rgba(255,59,92,0.1)] px-1 rounded">NEW</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">Failed Attempts</div>
                  <div className={`font-mono text-xs font-bold ${txn.failedAttempts > 2 ? "text-[#FF3B5C]" : "text-[#8B93A7]"}`}>{txn.failedAttempts}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#8B93A7] uppercase tracking-widest mb-0.5">TXN Last 24h</div>
                  <div className="font-mono text-xs text-[#8B93A7]">{txn.transactionsLast24h}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer profile */}
          {customer && (
            <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
              <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-3">Customer Profile</h2>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-[#8B93A7] mb-0.5">Usual Location</div>
                  <div className="text-[#E8EAF0]">{customer.usualLocation}</div>
                </div>
                <div>
                  <div className="text-[#8B93A7] mb-0.5">Avg Transaction</div>
                  <div className="font-mono text-[#E8EAF0]">{fmt(customer.avgTransactionAmount)}</div>
                </div>
                <div>
                  <div className="text-[#8B93A7] mb-0.5">Total TXN</div>
                  <div className="font-mono text-[#E8EAF0]">{customer.totalTransactions}</div>
                </div>
                <div>
                  <div className="text-[#8B93A7] mb-0.5">Account Type</div>
                  <div className="text-[#E8EAF0]">{customer.accountType}</div>
                </div>
                <div>
                  <div className="text-[#8B93A7] mb-0.5">Risk Profile</div>
                  <RiskBadge level={customer.riskProfile} size="sm" />
                </div>
              </div>
            </div>
          )}

          {/* Risk Factors — SHAP-style bars */}
          <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
            <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-4">Risk Factor Analysis</h2>
            <div className="flex flex-col gap-3">
              {txn.riskFactors.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#E8EAF0]">{f.label}</span>
                    <span className="font-mono text-xs text-[#F5A623] font-semibold">+{f.impact}</span>
                  </div>
                  <div className="h-1.5 bg-[#1E2A45] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#F5A623] transition-all duration-700"
                      style={{ width: `${(f.impact / 30) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#8B93A7] mt-1">{f.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Investigation */}
        <div className="flex flex-col gap-5">
          {/* AI Agent panel */}
          <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest">AI Investigation Agent</h2>
              <button
                onClick={runInvestigation}
                disabled={investigating && revealedSteps < txn.aiInvestigation.steps.length}
                className="text-xs font-mono px-3 py-1.5 rounded border border-[#F5A623] text-[#F5A623] hover:bg-[rgba(245,166,35,0.12)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {investigating ? "Investigating..." : "▶ Run Investigation"}
              </button>
            </div>

            {/* Step-by-step agent output */}
            <div className="bg-[#080C18] border border-[#1E2A45] rounded p-4 min-h-[200px] font-mono text-xs space-y-1.5">
              {revealedSteps === 0 && !investigating && (
                <span className="text-[#4A5568]">Click "Run Investigation" to start the AI agent analysis...</span>
              )}
              {txn.aiInvestigation.steps.slice(0, revealedSteps).map((step, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#F5A623] shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                  <span className="text-[#8B93A7]">{step}</span>
                </div>
              ))}
              {investigating && revealedSteps < txn.aiInvestigation.steps.length && (
                <div className="flex gap-2">
                  <span className="text-[#F5A623]">[{String(revealedSteps + 1).padStart(2, "0")}]</span>
                  <span className="text-[#F5A623] animate-pulse">█</span>
                </div>
              )}
            </div>

            {/* Summary — shown after all steps revealed */}
            {revealedSteps >= txn.aiInvestigation.steps.length && revealedSteps > 0 && (
              <div className="bg-[rgba(245,166,35,0.06)] border border-[rgba(245,166,35,0.2)] rounded p-4">
                <div className="text-[10px] font-mono text-[#F5A623] uppercase tracking-widest mb-2">Investigation Summary</div>
                <p className="text-xs text-[#E8EAF0] leading-relaxed">{txn.aiInvestigation.summary}</p>
              </div>
            )}
          </div>

          {/* Relevant Policy */}
          <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest">Relevant Policy</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[rgba(100,181,246,0.12)] text-[#64B5F6] border border-[rgba(100,181,246,0.2)] rounded">RAG Retrieved</span>
            </div>
            <p className="text-xs text-[#E8EAF0] leading-relaxed border-l-2 border-[#F5A623] pl-3">{txn.relevantPolicy}</p>
          </div>

          {/* Final Recommendation */}
          <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-5">
            <div className="font-mono text-xs text-[#8B93A7] uppercase tracking-widest mb-3">Final Recommendation</div>
            <div className="flex items-center gap-4 flex-wrap">
              <RecommendationBadge action={txn.recommendation} />
              <div className="text-xs text-[#8B93A7]">
                {txn.recommendation === "APPROVE" && "Transaction is safe to process."}
                {txn.recommendation === "VERIFY" && "Request OTP verification before processing."}
                {txn.recommendation === "HOLD" && "Temporarily hold. Require customer identity verification."}
                {txn.recommendation === "BLOCK" && "Block immediately. Initiate account security review."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
