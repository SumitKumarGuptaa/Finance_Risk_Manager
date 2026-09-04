import { Outlet, NavLink } from "react-router";

const nav = [
  { to: "/", label: "Dashboard", icon: "⬡", end: true },
  { to: "/transactions", label: "Transactions", icon: "⇄", end: false },
  { to: "/analytics", label: "Analytics", icon: "◈", end: false },
  { to: "/policies", label: "Policy KB", icon: "☰", end: false },
];

export default function Root() {
  return (
    <div className="flex h-screen bg-[#080C18] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-[#1E2A45] bg-[#080C18]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#1E2A45]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#F5A623] rounded flex items-center justify-center">
              <span className="text-[#080C18] font-mono font-bold text-xs">RG</span>
            </div>
            <div>
              <div className="font-mono font-bold text-sm text-[#E8EAF0] tracking-wider">RISKGUARD</div>
              <div className="font-mono text-[10px] text-[#8B93A7] tracking-widest">AI · v2.1</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
                  isActive
                    ? "bg-[rgba(245,166,35,0.12)] text-[#F5A623] border border-[rgba(245,166,35,0.25)]"
                    : "text-[#8B93A7] hover:text-[#E8EAF0] hover:bg-[#0F1629] border border-transparent"
                }`
              }
            >
              <span className="font-mono text-base w-4 text-center">{icon}</span>
              <span className="font-body">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status bar */}
        <div className="px-4 py-3 border-t border-[#1E2A45]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs font-mono text-[#8B93A7]">SYSTEM ONLINE</span>
          </div>
          <div className="text-[10px] font-mono text-[#4A5568]">
            ML MODEL · v3.2.1<br />
            LAST TRAINED · 14 Jan
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
