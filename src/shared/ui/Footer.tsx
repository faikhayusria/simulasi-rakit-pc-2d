import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#070a10] py-8 text-xs text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">RakitPC 2D</span>
          <span>•</span>
          <span>Simulasi Pemilihan Komponen Komputer</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-400 font-mono">
            v0.1.0-MVP
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-cyan-400 transition-colors">
            Spesifikasi Aturan & Audit
          </Link>
          <Link to="/scenarios" className="hover:text-cyan-400 transition-colors">
            Katalog Skenario
          </Link>
          <span className="text-slate-500 font-mono">
            Local-First (Offline Capable)
          </span>
        </div>
      </div>
    </footer>
  );
};
