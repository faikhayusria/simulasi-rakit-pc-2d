import React from 'react';
import type { ComponentCategory, PcComponent } from '@/domain/types';

interface PcAssemblyCanvasProps {
  selectedComponents: Partial<Record<ComponentCategory, PcComponent>>;
  statusMap: Record<ComponentCategory, 'pass' | 'warn' | 'fail' | 'neutral'>;
  onSlotClick: (category: ComponentCategory) => void;
  activeCategory: string;
}

export const PcAssemblyCanvas: React.FC<PcAssemblyCanvasProps> = ({
  selectedComponents,
  statusMap,
  onSlotClick,
  activeCategory,
}) => {
  const cpu = selectedComponents['cpu'];
  const mb = selectedComponents['motherboard'];
  const ram = selectedComponents['ram'];
  const gpu = selectedComponents['gpu'];
  const storage = selectedComponents['storage'];
  const psu = selectedComponents['psu'];
  const pcCase = selectedComponents['case'];
  const cooler = selectedComponents['cooler'];

  const getBorderColor = (category: ComponentCategory) => {
    if (activeCategory === category) return '#00f2fe';
    const status = statusMap[category];
    if (status === 'fail') return '#ef4444';
    if (status === 'warn') return '#f59e0b';
    if (status === 'pass') return '#10b981';
    return '#334155';
  };

  const isAtx = pcCase?.id === 'case-storm-panoramic';

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[4/3] bg-gradient-to-b from-[#080d1a] to-[#04060a] rounded-2xl p-4 border border-cyan-500/20 shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Outer Chassis Frame */}
      <div className="absolute inset-2 border-2 border-slate-700/60 rounded-xl pointer-events-none" />
      
      {/* Top Header Bar / Status Indicator */}
      <div className="relative z-10 flex items-center justify-between px-3 py-1.5 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-cyan-300 font-semibold uppercase tracking-wider">
            {pcCase ? pcCase.name : 'CHASSIS BELUM TERPASANG'}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Klik area slot untuk memasang / meninjau
        </div>
      </div>

      {/* Main Internal PC Canvas Area */}
      <div className="relative flex-1 my-2 bg-slate-950/60 rounded-lg border border-slate-800/80 p-3 overflow-hidden flex flex-col">
        {/* Motherboard Backplate Area */}
        <div
          onClick={() => onSlotClick('motherboard')}
          style={{
            borderColor: getBorderColor('motherboard'),
          }}
          className={`relative flex-1 rounded-xl transition-all duration-300 cursor-pointer ${
            mb
              ? isAtx
                ? 'bg-[#0f172a]/90 border-2'
                : 'bg-[#0d1424]/90 border-2'
              : 'border-2 border-dashed border-slate-700/50 hover:border-cyan-500/50 bg-slate-900/20'
          } p-3 flex flex-col justify-between`}
        >
          {/* MB Header Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-slate-300">
                {mb ? mb.name : 'Slot 1: Motherboard (Kosong)'}
              </span>
              {mb && (
                <span className="px-1.5 py-0.2 bg-cyan-950 text-cyan-300 text-[10px] rounded border border-cyan-800">
                  {mb.specs.formFactor} • {mb.specs.socket}
                </span>
              )}
            </div>
            {statusMap['motherboard'] === 'fail' && (
              <span className="text-red-400 font-bold text-[10px] animate-pulse">! Inkompatibel</span>
            )}
          </div>

          {/* Central Area: CPU, Cooler, RAM, Storage */}
          <div className="grid grid-cols-12 gap-2 my-auto items-center">
            {/* CPU & Cooler Socket Area (Col 1-7) */}
            <div className="col-span-7 flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 relative min-h-[90px]">
              {/* CPU Slot */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick('cpu');
                }}
                style={{ borderColor: getBorderColor('cpu') }}
                className={`w-20 h-16 rounded-md transition-all flex flex-col items-center justify-center text-center p-1 cursor-pointer ${
                  cpu
                    ? 'bg-slate-800 border-2 shadow-md'
                    : 'border-2 border-dashed border-amber-500/50 bg-amber-950/10 hover:border-amber-400'
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400">CPU</span>
                <span className="text-[11px] font-bold text-white truncate max-w-full">
                  {cpu ? cpu.specs.socket : 'AM-X / LGA'}
                </span>
                {cpu && (
                  <span className="text-[9px] text-cyan-400 truncate max-w-full">
                    {cpu.name.split(' ')[1]}
                  </span>
                )}
              </div>

              {/* Cooler Overlay / Bracket */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSlotClick('cooler');
                }}
                style={{ borderColor: getBorderColor('cooler') }}
                className={`mt-1.5 px-3 py-1 rounded text-center transition-all cursor-pointer ${
                  cooler
                    ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-[10px] font-semibold'
                    : 'border border-dashed border-slate-600 text-slate-400 text-[9px] hover:border-cyan-400'
                }`}
              >
                {cooler ? `❄️ ${cooler.name}` : '+ Pasang Cooler CPU'}
              </div>
            </div>

            {/* RAM Slots (Col 8-9) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSlotClick('ram');
              }}
              style={{ borderColor: getBorderColor('ram') }}
              className={`col-span-2 flex flex-col gap-1 p-1.5 rounded-lg transition-all cursor-pointer items-center min-h-[90px] justify-center ${
                ram
                  ? 'bg-purple-950/40 border-2 border-purple-500/60'
                  : 'border-2 border-dashed border-slate-700/60 hover:border-purple-400/60'
              }`}
            >
              <div className="text-[9px] font-mono text-slate-400">RAM</div>
              <div className="flex gap-1 h-12 items-center">
                <div className={`w-1.5 h-full rounded ${ram ? 'bg-purple-400 shadow-sm shadow-purple-500 animate-pulse' : 'bg-slate-700'}`} />
                <div className={`w-1.5 h-full rounded ${ram ? 'bg-purple-400 shadow-sm shadow-purple-500 animate-pulse' : 'bg-slate-700'}`} />
              </div>
              <span className="text-[9px] font-bold text-purple-300 truncate">
                {ram ? `${ram.specs.capacityGB}GB` : 'Kosong'}
              </span>
            </div>

            {/* Storage Drive / M.2 Slot (Col 10-12) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSlotClick('storage');
              }}
              style={{ borderColor: getBorderColor('storage') }}
              className={`col-span-3 flex flex-col items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer min-h-[90px] ${
                storage
                  ? 'bg-emerald-950/40 border-2 border-emerald-500/60'
                  : 'border-2 border-dashed border-slate-700/60 hover:border-emerald-400/60'
              }`}
            >
              <span className="text-[9px] font-mono text-slate-400">STORAGE</span>
              <div className="text-xl my-1">💾</div>
              <span className="text-[9px] font-bold text-emerald-300 text-center truncate max-w-full">
                {storage ? `${storage.specs.capacityGB}GB` : '+ Pasang SSD'}
              </span>
            </div>
          </div>

          {/* Bottom of Motherboard: GPU Expansion Slot */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSlotClick('gpu');
            }}
            style={{ borderColor: getBorderColor('gpu') }}
            className={`w-full py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-between ${
              gpu
                ? 'bg-gradient-to-r from-red-950/60 to-slate-900 border-2 border-red-500/60 shadow-lg'
                : 'border-2 border-dashed border-slate-700/60 hover:border-red-400/60 bg-slate-900/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎮</span>
              <div>
                <div className="text-[10px] font-mono text-slate-400">SLOT EXPANSION PCIe (GPU)</div>
                <div className="text-[11px] font-bold text-white">
                  {gpu ? gpu.name : 'Belum Ada Kartu Grafis'}
                </div>
              </div>
            </div>
            {gpu && (
              <span className="text-[10px] font-mono text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                {gpu.specs.lengthMM}mm • {gpu.specs.powerConnector}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Basement: Power Supply Unit (PSU Shroud) */}
        <div
          onClick={() => onSlotClick('psu')}
          style={{ borderColor: getBorderColor('psu') }}
          className={`mt-2 h-14 rounded-lg p-2 transition-all cursor-pointer flex items-center justify-between ${
            psu
              ? 'bg-[#151c28] border-2 border-amber-500/60 shadow-inner'
              : 'border-2 border-dashed border-slate-700/60 hover:border-amber-400/60 bg-slate-900/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
              ⚡
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400">PSU COMPARTMENT</div>
              <div className="text-[11px] font-bold text-slate-100">
                {psu ? psu.name : 'Unit Catu Daya (PSU) Kosong'}
              </div>
            </div>
          </div>
          {psu && (
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-1 rounded border border-amber-800">
              {psu.specs.wattage}W ({psu.specs.efficiencyRating})
            </span>
          )}
        </div>
      </div>

      {/* Case Footer Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <button
          onClick={() => onSlotClick('case')}
          className="hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
        >
          <span>🖥️ Casing:</span>
          <span className="text-white underline font-semibold">
            {pcCase ? pcCase.name : 'Pilih Casing PC'}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-mono text-slate-400">
            {Object.keys(selectedComponents).length} / 8 Terpasang
          </span>
        </div>
      </div>
    </div>
  );
};
