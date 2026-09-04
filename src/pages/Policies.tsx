import { useState } from "react";
import { policies } from "../data/mockData";

export default function Policies() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = ["ALL", ...Array.from(new Set(policies.map((p) => p.category)))];

  const filtered = policies.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
    const matchCat = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-mono text-xl font-bold text-[#E8EAF0] tracking-wider">POLICY KNOWLEDGE BASE</h1>
        <p className="text-sm text-[#8B93A7] mt-0.5">RAG-powered banking policy retrieval system · {policies.length} documents indexed</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-64 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[#8B93A7] text-sm">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policies, tags..."
            className="w-full bg-[#0F1629] border border-[#1E2A45] rounded px-3 py-2 pl-8 text-sm text-[#E8EAF0] placeholder-[#4A5568] font-mono focus:outline-none focus:border-[#F5A623] transition-colors"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-2 text-xs font-mono border rounded transition-colors ${
                categoryFilter === c
                  ? "bg-[#F5A623] text-[#080C18] border-[#F5A623] font-bold"
                  : "text-[#8B93A7] border-[#1E2A45] hover:border-[#253352] hover:text-[#E8EAF0]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* RAG system info */}
      <div className="bg-[rgba(100,181,246,0.06)] border border-[rgba(100,181,246,0.2)] rounded-lg px-4 py-3 mb-6 flex items-center gap-3">
        <span className="font-mono text-[#64B5F6] text-xs">▣ RAG SYSTEM</span>
        <div className="h-3 w-px bg-[rgba(100,181,246,0.3)]" />
        <span className="text-xs font-mono text-[#8B93A7]">FAISS vector index · {policies.length} chunks · Embedding model: text-embedding-ada-002 · Last indexed: Jan 15, 2024</span>
      </div>

      {/* Policy cards */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="bg-[#0F1629] border border-[#1E2A45] rounded-lg p-12 text-center">
            <span className="font-mono text-[#8B93A7] text-sm">No policies match your search.</span>
          </div>
        ) : (
          filtered.map((p) => {
            const isExpanded = expanded === p.id;
            return (
              <div key={p.id} className="bg-[#0F1629] border border-[#1E2A45] rounded-lg overflow-hidden transition-all">
                {/* Card header */}
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-[#141D35] transition-colors flex items-start justify-between gap-4"
                  onClick={() => setExpanded(isExpanded ? null : p.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-[10px] text-[#8B93A7] tracking-widest">{p.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[rgba(100,181,246,0.12)] text-[#64B5F6] border border-[rgba(100,181,246,0.2)] rounded">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#E8EAF0] text-sm mb-2">{p.title}</h3>
                    <p className="text-xs text-[#8B93A7] leading-relaxed">{p.excerpt}</p>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 bg-[#0F1629] border border-[#253352] text-[#8B93A7] rounded"
                          onClick={(e) => { e.stopPropagation(); setSearch(tag); }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#4A5568]">Updated {p.lastUpdated}</span>
                    <span className="font-mono text-[#F5A623] text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded full text */}
                {isExpanded && (
                  <div className="border-t border-[#1E2A45] px-5 py-4 bg-[#080C18]">
                    <div className="text-[10px] font-mono text-[#F5A623] uppercase tracking-widest mb-3">Full Policy Text</div>
                    <p className="text-xs text-[#E8EAF0] leading-relaxed whitespace-pre-wrap">{p.fullText}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 text-xs font-mono text-[#4A5568]">
        {filtered.length} of {policies.length} policies · Click a policy to expand
      </div>
    </div>
  );
}
