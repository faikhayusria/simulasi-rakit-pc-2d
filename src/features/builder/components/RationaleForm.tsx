import React from 'react';
import type { ComponentCategory, PcComponent } from '@/domain/types';

interface RationaleFormProps {
  selectedComponents: Partial<Record<ComponentCategory, PcComponent>>;
  rationales: Partial<Record<ComponentCategory, string>>;
  onSaveRationale: (category: ComponentCategory, text: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const RationaleForm: React.FC<RationaleFormProps> = ({
  selectedComponents,
  rationales,
  onSaveRationale,
  onSubmit,
  onBack,
}) => {
  const categoryLabels: Record<ComponentCategory, { name: string; icon: string; tip: string }> = {
    cpu: {
      name: 'Prosesor (CPU)',
      icon: '🧠',
      tip: 'Jelaskan mengapa jumlah core, soket, dan TDP ini cocok untuk beban kerja skenario.',
    },
    motherboard: {
      name: 'Motherboard',
      icon: '🎛️',
      tip: 'Jelaskan pertimbangan pemilihan form factor dan dukungan fitur soket/RAM.',
    },
    ram: {
      name: 'Memori RAM',
      icon: '⚡',
      tip: 'Jelaskan mengapa kapasitas (16GB/32GB) dan generasi (DDR4/DDR5) ini memadai.',
    },
    gpu: {
      name: 'Kartu Grafis (GPU)',
      icon: '🎮',
      tip: 'Jelaskan kebutuhan pengolahan visual / resolusi dan koneksi daya PCIe.',
    },
    storage: {
      name: 'Media Penyimpanan',
      icon: '💾',
      tip: 'Jelaskan pertimbangan kecepatan baca/tulis NVMe vs SATA terhadap anggaran.',
    },
    psu: {
      name: 'Catu Daya (PSU)',
      icon: '🔌',
      tip: 'Jelaskan estimasi kalkulasi daya sistem dan kecukupan kabel daya.',
    },
    case: {
      name: 'Casing Komputer',
      icon: '🖥️',
      tip: 'Jelaskan kesesuaian ruang dimensi casing terhadap GPU dan cooler.',
    },
    cooler: {
      name: 'Pendingin CPU',
      icon: '❄️',
      tip: 'Jelaskan kecukupan disipasi panas (TDP) cooler terhadap panas prosesor.',
    },
  };

  const installedEntries = Object.entries(selectedComponents) as [ComponentCategory, PcComponent][];

  return (
    <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-6 max-w-4xl mx-auto shadow-xl">
      {/* Form Header */}
      <div className="pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <div>
            <h2 className="text-lg font-bold text-white">
              Catatan Rasionalisasi Pemilihan Komponen
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sebagai calon teknisi/perakit komputer, tuliskan pertimbangan teknis dan alasan pemilihan Anda untuk masing-masing komponen. Catatan ini akan diikutsertakan dalam laporan akhir dan evaluasi ahli.
            </p>
          </div>
        </div>
      </div>

      {/* Rationale Fields */}
      <div className="space-y-4">
        {installedEntries.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
            <span className="text-3xl block">⚠️</span>
            <p className="text-sm font-semibold text-slate-300">
              Belum ada komponen yang dipasang pada papan rakitan.
            </p>
            <p className="text-xs text-slate-500">
              Silakan kembali ke tab "Papan Perakitan PC 2D" dan pilih komponen terlebih dahulu sebelum mengisi catatan alasan.
            </p>
          </div>
        ) : (
          installedEntries.map(([cat, comp]) => {
          const meta = categoryLabels[cat] || {
            name: cat,
            icon: '📦',
            tip: 'Tuliskan alasan teknis Anda.',
          };
          const value = rationales[cat] || '';
          const isValidLength = value.trim().length >= 10;

          return (
            <div
              key={cat}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 focus-within:border-cyan-500/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-cyan-300">
                      {meta.name}
                    </span>
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      — {comp.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span
                    className={
                      isValidLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                    }
                  >
                    {value.trim().length} karakter (min. 10)
                  </span>
                  {isValidLength && <span className="text-emerald-400">✓</span>}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-2 italic">
                💡 {meta.tip}
              </p>

              <textarea
                rows={2}
                placeholder={`Contoh: Saya memilih ${comp.name} karena...`}
                value={value}
                onChange={(e) => onSaveRationale(cat, e.target.value)}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
              />
            </div>
          );
        }))}
      </div>

      {/* Form Actions */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          ← Kembali ke Papan Rakit
        </button>

        <button
          onClick={onSubmit}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/60 transition-all flex items-center gap-2"
        >
          <span>Selesaikan Simulasi & Tinjau Hasil</span>
          <span>✓</span>
        </button>
      </div>
    </div>
  );
};
