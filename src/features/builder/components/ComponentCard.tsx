import React from 'react';
import type { PcComponent } from '@/domain/types';
import { ComponentSvg } from '@/shared/illustrations/ComponentSvg';

interface ComponentCardProps {
  component: PcComponent;
  isInstalled: boolean;
  onSelect: (component: PcComponent) => void;
  onRemove: (component: PcComponent) => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isInstalled,
  onSelect,
  onRemove,
}) => {
  const formatRp = (num: number) =>
    'Rp ' + num.toLocaleString('id-ID');

  const getSpecBadges = (comp: PcComponent) => {
    const s = comp.specs;
    switch (comp.category) {
      case 'cpu':
        return [
          `Socket ${s.socket}`,
          `TDP ${s.tdp}W`,
          `${s.cores}C/${s.threads}T`,
        ];
      case 'motherboard':
        return [
          `Socket ${s.socket}`,
          `Form ${s.formFactor}`,
          `RAM ${s.ramType}`,
        ];
      case 'ram':
        return [
          `${s.type}`,
          `${s.capacityGB}GB`,
          `${s.speedMhz}MHz`,
        ];
      case 'gpu':
        return [
          `${s.vramGB}GB VRAM`,
          `${s.lengthMM}mm Panjang`,
          `Power ${s.powerConnector}`,
        ];
      case 'storage':
        return [
          `${s.interface}`,
          `${s.capacityGB}GB`,
          `${s.readSpeedMBs} MB/s`,
        ];
      case 'psu':
        return [
          `${s.wattage}W`,
          `${s.efficiencyRating}`,
          `Konektor: ${(s.pcieConnectors as string[]).join(', ')}`,
        ];
      case 'case':
        return [
          `Dukung ${(s.supportedFormFactors as string[]).join('/')}`,
          `Max GPU ${s.maxGpuLengthMM}mm`,
          `Max Cool ${s.maxCoolerHeightMM}mm`,
        ];
      case 'cooler':
        return [
          `${s.coolerType}`,
          `Tinggi ${s.heightMM}mm`,
          `TDP ${s.tdpSupport}W`,
        ];
      default:
        return [];
    }
  };

  const badges = getSpecBadges(component);

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl p-4 transition-all duration-200 border ${
        isInstalled
          ? 'bg-cyan-950/30 border-cyan-400/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
          : 'bg-[#121824] border-slate-800 hover:border-slate-600 hover:bg-[#151f30]'
      }`}
    >
      {/* Top Header: Brand & Category Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase truncate">
          {component.brand}
        </span>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            isInstalled
              ? 'bg-cyan-500 text-black'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          {component.category}
        </span>
      </div>

      {/* Center: Illustration & Name */}
      <div className="flex items-start gap-3 my-2">
        <div className="shrink-0 p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
          <ComponentSvg name={component.illustration} className="w-14 h-14" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
            {component.name}
          </h4>
          <div className="mt-1 text-xs font-bold text-cyan-400 font-mono">
            {formatRp(component.price)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {component.shortDescription}
          </p>
        </div>
      </div>

      {/* Specs Badges */}
      <div className="flex flex-wrap gap-1.5 my-2.5">
        {badges.map((b, idx) => (
          <span
            key={idx}
            className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono"
          >
            {b}
          </span>
        ))}
      </div>

      {/* Bottom Action Button */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        {isInstalled ? (
          <div className="flex w-full items-center gap-2">
            <button
              onClick={() => onRemove(component)}
              className="flex-1 py-1.5 px-3 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>✕ Lepas dari Slot</span>
            </button>
            <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-1.5 rounded-lg border border-cyan-800/60">
              ✓ Terpasang
            </span>
          </div>
        ) : (
          <button
            onClick={() => onSelect(component)}
            className="w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-cyan-950/50 flex items-center justify-center gap-1.5"
          >
            <span>+ Pasang Komponen</span>
          </button>
        )}
      </div>
    </div>
  );
};
