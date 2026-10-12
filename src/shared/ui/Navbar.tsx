import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useBuildStore } from '@/store/build-store';
import { selectCurrentScenario } from '@/store/selectors';

export const Navbar: React.FC = () => {
  const store = useBuildStore();
  const scenario = selectCurrentScenario(store);
  const installedCount = Object.keys(store.selectedComponents).length;

  const navItems = [
    { to: '/', label: 'Beranda' },
    { to: '/scenarios', label: 'Skenario' },
    { to: '/builder', label: 'Papan Simulasi' },
    { to: '/results', label: 'Hasil Evaluasi' },
    { to: '/about', label: 'Tentang & Aturan' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-md shadow-cyan-950/50 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-white flex items-center gap-1">
              <span>RakitPC</span>
              <span className="text-cyan-400">2D</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Simulasi Hardware & Anggaran
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Active Scenario Badge & Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/builder"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono hover:border-cyan-500/60 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300 max-w-[130px] truncate">
              {scenario.title}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px] border border-cyan-800">
              {installedCount}/8
            </span>
          </Link>

          <Link
            to="/builder"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-950/40"
          >
            Mulai Merakit
          </Link>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 bg-[#0a0d14] text-[11px] font-semibold text-slate-400">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
};
