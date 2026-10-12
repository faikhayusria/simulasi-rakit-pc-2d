import React from 'react';
import { CatalogLoader } from '@/infrastructure/catalog-loader';

export const AboutPage: React.FC = () => {
  const rules = CatalogLoader.getRulesMeta();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Title Header */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800">
          Dokumentasi & Riset
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Tentang Proyek RakitPC 2D
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Aplikasi media pembelajaran interaktif berbasis web yang dikembangkan untuk simulasi pemilihan perangkat keras komputer (PC assembly) dengan tantangan kompatibilitas teknis dan pembatasan anggaran.
        </p>
      </div>

      {/* Local-first & Privacy Box */}
      <div className="bg-[#0f172a] rounded-2xl border border-emerald-500/40 p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <h3 className="text-base font-bold text-emerald-400">
            Arsitektur Local-First & Jaminan Privasi Data
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sesuai dengan spesifikasi riset, aplikasi ini beroperasi secara <strong>100% di peramban (client-side) tanpa ketergantungan server backend</strong>. Seluruh proses evaluasi kompatibilitas, penghitungan anggaran, dan penyimpanan riwayat percobaan disimpan di dalam memori lokal browser (<code>localStorage</code>) Anda. Tidak ada data identitas atau jejak aktivitas pengguna yang dikirimkan ke server pihak ketiga.
        </p>
      </div>

      {/* Rules Audit Table */}
      <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋 Tabel Audit Aturan Kompatibilitas (Untuk Ahli Materi)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Seluruh aturan divalidasi oleh Domain Core (Pure TypeScript) independen dan dapat ditinjau oleh validator ahli:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-mono">
                <th className="py-2.5 px-3">ID Aturan</th>
                <th className="py-2.5 px-3">Nama Aturan</th>
                <th className="py-2.5 px-3">Tingkat</th>
                <th className="py-2.5 px-3">Penjelasan Edukatif Pengguna</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {rule.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {rule.name}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rule.severity === 'error'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed min-w-[280px]">
                    {rule.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation & Instrument Notice */}
      <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Instrumen Evaluasi & Pengujian
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Aplikasi ini dirancang untuk mendukung pengujian fungsi perangkat lunak (black-box testing), validasi ahli media dan ahli materi menggunakan kuesioner skala Likert, serta uji kebergunaan pengguna menggunakan kuesioner <strong>System Usability Scale (SUS)</strong>.
        </p>
      </div>
    </div>
  );
};
