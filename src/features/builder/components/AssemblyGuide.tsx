import React, { useState } from 'react';
import type { ComponentCategory, PcComponent } from '@/domain/types';

interface AssemblyGuideProps {
  selectedComponents: Partial<Record<ComponentCategory, PcComponent>>;
}

export const AssemblyGuide: React.FC<AssemblyGuideProps> = ({
  selectedComponents,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Fondasi: Casing & Motherboard',
      category: ['case', 'motherboard'] as ComponentCategory[],
      tip: 'Pilih Motherboard dan Casing yang sesuai form factor-nya (ATX atau mATX).',
      done: !!selectedComponents['case'] && !!selectedComponents['motherboard'],
    },
    {
      num: 2,
      title: 'Prosesor (CPU) & Pendingin (Cooler)',
      category: ['cpu', 'cooler'] as ComponentCategory[],
      tip: 'Pastikan soket CPU (AM-X / LGA-Z) sama dengan Motherboard dan didukung oleh Cooler.',
      done: !!selectedComponents['cpu'] && !!selectedComponents['cooler'],
    },
    {
      num: 3,
      title: 'Memori RAM',
      category: ['ram'] as ComponentCategory[],
      tip: 'Cocokkan tipe RAM (DDR4 atau DDR5) dengan slot pada Motherboard pilihan Anda.',
      done: !!selectedComponents['ram'],
    },
    {
      num: 4,
      title: 'Kartu Grafis (GPU)',
      category: ['gpu'] as ComponentCategory[],
      tip: 'Pastikan panjang kartu grafis (mm) tidak melebihi ruang horizontal maksimal casing.',
      done: !!selectedComponents['gpu'],
    },
    {
      num: 5,
      title: 'Media Penyimpanan (SSD)',
      category: ['storage'] as ComponentCategory[],
      tip: 'Pilih SSD M.2 NVMe (jika ada slot M.2) atau SATA SSD untuk sistem operasi & data.',
      done: !!selectedComponents['storage'],
    },
    {
      num: 6,
      title: 'Catu Daya (PSU)',
      category: ['psu'] as ComponentCategory[],
      tip: 'Pastikan daya PSU (Watt) mencukupi konsumsi CPU + GPU dan memiliki kabel PCIe yang pas.',
      done: !!selectedComponents['psu'],
    },
    {
      num: 7,
      title: 'Pemeriksaan & Koreksi Masalah',
      category: [] as ComponentCategory[],
      tip: 'Klik tombol "⚡ Periksa Rakitan" untuk deteksi dini. Baca alasan salah & ikuti langkah benarnya.',
      done: Object.keys(selectedComponents).length === 8,
    },
    {
      num: 8,
      title: 'Catatan Alasan & Penyelesaian',
      category: [] as ComponentCategory[],
      tip: 'Tuliskan alasan teknis Anda di tab "📝 Catatan Alasan", lalu klik "✓ Selesai & Lihat Hasil".',
      done: false,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className="bg-[#0e1422] rounded-2xl border border-cyan-500/30 overflow-hidden shadow-lg transition-all">
      {/* Header bar / Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 text-sm">
            🧭
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Panduan Langkah Pengerjaan Perakitan PC
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                {completedCount}/8 Selesai
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
              Ikuti urutan langkah ini agar tidak bingung saat memilih dan merakit komponen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-400 font-semibold font-mono">
            {isOpen ? 'Sembunyikan' : 'Buka Panduan'}
          </span>
          <span className="text-slate-400 text-xs transition-transform duration-200">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                  step.done
                    ? 'bg-emerald-950/20 border-emerald-800/80'
                    : 'bg-slate-900/50 border-slate-800/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase">
                      Langkah {step.num}
                    </span>
                    {step.done ? (
                      <span className="px-1.5 py-0.2 bg-emerald-900/60 text-emerald-300 rounded text-[10px] font-bold">
                        ✓ Terpasang
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded text-[10px]">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white mb-1 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {step.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/60 text-[11px] text-cyan-200 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong>Tips Mengerjakan:</strong> Klik slot pada visual chassis di sebelah kiri untuk langsung menyaring katalog komponen terkait di sebelah kanan. Pantau selalu bar anggaran di bagian atas agar tidak melebihi anggaran yang diberikan.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
