import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildStore } from '@/store/build-store';
import {
  selectCurrentScenario,
  selectHydratedComponents,
  selectBudgetResult,
  selectCategoryStatusMap,
} from '@/store/selectors';
import { CatalogLoader } from '@/infrastructure/catalog-loader';
import { PcAssemblyCanvas } from './components/PcAssemblyCanvas';
import { Palette } from './components/Palette';
import { LiveBudgetBar } from './components/LiveBudgetBar';
import { FeedbackPanel } from './components/FeedbackPanel';
import { RationaleForm } from './components/RationaleForm';
import { AssemblyGuide } from './components/AssemblyGuide';
import type { ComponentCategory, PcComponent } from '@/domain/types';

export const BuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useBuildStore();
  const scenario = selectCurrentScenario(store);
  const hydratedComponents = selectHydratedComponents(store);
  const budgetResult = selectBudgetResult(store);
  const statusMap = selectCategoryStatusMap(store);
  const allComponents = CatalogLoader.getComponents();

  const [activeTab, setActiveTab] = useState<'board' | 'rationale'>('board');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleSelectComponent = (comp: PcComponent) => {
    store.selectComponent(comp.category, comp.id);
  };

  const handleRemoveComponent = (comp: PcComponent) => {
    store.removeComponent(comp.category);
  };

  const handleSlotClick = (category: ComponentCategory) => {
    store.setFilterCategory(category);
  };

  const handleRunCheck = () => {
    store.runFullCheck();
    setShowFeedbackModal(true);
  };

  const handleProceedToRationale = () => {
    setShowFeedbackModal(false);
    setActiveTab('rationale');
  };

  const handleFinalSubmit = () => {
    const success = store.submitBuild();
    if (success) {
      navigate('/results');
    } else {
      setShowFeedbackModal(true);
    }
  };

  const installedCount = Object.keys(store.selectedComponents).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Scenario Banner */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              Skenario Aktif
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-950 text-purple-300 border border-purple-800">
              Tingkat: {scenario.difficulty}
            </span>
            <span className="text-xs text-slate-400">
              Klien: {scenario.targetAudience}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {scenario.title}
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {scenario.brief}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/scenarios')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>🔄 Ganti Skenario</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Yakin ingin mereset seluruh rakitan pada skenario ini?')) {
                store.resetCurrentBuild();
              }
            }}
            className="px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-900 rounded-xl text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Interactive Step-by-Step Assembly Guide */}
      <AssemblyGuide selectedComponents={hydratedComponents} />

      {/* Live Budget Bar */}
      <LiveBudgetBar budgetResult={budgetResult} />

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'board'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>🖥️ Papan Perakitan PC 2D</span>
            <span className="px-1.5 py-0.5 bg-black/30 rounded text-[10px]">
              {installedCount}/8
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rationale')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'rationale'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>📝 Catatan Alasan Pemilihan</span>
          </button>
        </div>

        {/* Global Action Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCheck}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all flex items-center gap-1.5"
          >
            <span>⚡ Periksa Rakitan</span>
          </button>

          <button
            onClick={handleFinalSubmit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-1.5"
          >
            <span>✓ Selesai & Lihat Hasil</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      {activeTab === 'board' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 2D PC Assembly Visualizer */}
          <div className="lg:col-span-5 space-y-4">
            <PcAssemblyCanvas
              selectedComponents={hydratedComponents}
              statusMap={statusMap}
              onSlotClick={handleSlotClick}
              activeCategory={store.activeFilterCategory}
            />

            {/* Quick Helper Guide */}
            <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <span>💡 Panduan Interaksi 2D</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Klik slot komponen pada casing 2D di atas untuk langsung menyaring katalog di sebelah kanan. Anda juga dapat langsung menekan tombol <strong>+ Pasang</strong> atau <strong>✕ Lepas</strong> pada kartu komponen.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cocok (Pass)
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Peringatan (Warn)
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Inkompatibel (Fail)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Component Palette */}
          <div className="lg:col-span-7 h-[680px]">
            <Palette
              components={allComponents}
              selectedComponents={hydratedComponents}
              activeCategory={store.activeFilterCategory}
              onSelectCategory={store.setFilterCategory}
              onSelectComponent={handleSelectComponent}
              onRemoveComponent={handleRemoveComponent}
            />
          </div>
        </div>
      ) : (
        <RationaleForm
          selectedComponents={hydratedComponents}
          rationales={store.rationales}
          onSaveRationale={store.setRationale}
          onSubmit={handleFinalSubmit}
          onBack={() => setActiveTab('board')}
        />
      )}

      {/* Modal Feedback */}
      {showFeedbackModal && store.lastCheckResults && (
        <FeedbackPanel
          results={store.lastCheckResults}
          onClose={() => setShowFeedbackModal(false)}
          onProceedToRationale={handleProceedToRationale}
        />
      )}
    </div>
  );
};
