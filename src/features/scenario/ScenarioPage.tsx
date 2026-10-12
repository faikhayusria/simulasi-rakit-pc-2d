import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CatalogLoader } from '@/infrastructure/catalog-loader';
import { useBuildStore } from '@/store/build-store';

export const ScenarioPage: React.FC = () => {
  const navigate = useNavigate();
  const scenarios = CatalogLoader.getScenarios();
  const currentScenarioId = useBuildStore((state) => state.currentScenarioId);
  const setScenario = useBuildStore((state) => state.setScenario);

  const formatRp = (num: number) =>
    'Rp ' + num.toLocaleString('id-ID');

  const handleSelectScenario = (id: string) => {
    setScenario(id);
    navigate('/builder');
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Pemula':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Menengah':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'Tantangan':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800">
          Modul Pembelajaran
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Pilih Skenario Kebutuhan Komputer
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Setiap skenario menghadirkan profil kebutuhan pengguna, batasan anggaran, dan tantangan kompatibilitas perangkat keras yang berbeda.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((item, idx) => {
          const isSelected = currentScenarioId === item.id;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 border ${
                isSelected
                  ? 'bg-[#121c2e] border-cyan-500 shadow-xl shadow-cyan-950/60 ring-1 ring-cyan-500'
                  : 'bg-[#0e1422] border-slate-800 hover:border-slate-700 hover:bg-[#121828]'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                      item.difficulty
                    )}`}
                  >
                    Tingkat: {item.difficulty}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Skenario #{idx + 1}
                  </span>
                </div>

                {/* Scenario Title */}
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Budget Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 mb-4">
                  <span>Pagu Anggaran:</span>
                  <strong className="text-white">{formatRp(item.budget)}</strong>
                </div>

                {/* Client Narrative */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.brief}
                </p>

                {/* Learning Objectives */}
                <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-800/80">
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                    🎯 Sasaran Belajar:
                  </h4>
                  <ul className="space-y-1">
                    {item.learningObjectives.map((obj, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-slate-400 flex items-start gap-1.5"
                      >
                        <span className="text-cyan-400 text-xs">›</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectScenario(item.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>{isSelected ? 'Lanjutkan Rakitan Ini' : 'Pilih Skenario Ini'}</span>
                <span>→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
