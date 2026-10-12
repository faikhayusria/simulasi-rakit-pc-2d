import React, { useState } from 'react';
import type { ComponentCategory, PcComponent } from '@/domain/types';
import { ComponentCard } from './ComponentCard';

interface PaletteProps {
  components: PcComponent[];
  selectedComponents: Partial<Record<ComponentCategory, PcComponent>>;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectComponent: (component: PcComponent) => void;
  onRemoveComponent: (component: PcComponent) => void;
}

export const Palette: React.FC<PaletteProps> = ({
  components,
  selectedComponents,
  activeCategory,
  onSelectCategory,
  onSelectComponent,
  onRemoveComponent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua', icon: '📦' },
    { id: 'cpu', label: 'CPU', icon: '🧠' },
    { id: 'motherboard', label: 'Motherboard', icon: '🎛️' },
    { id: 'ram', label: 'RAM', icon: '⚡' },
    { id: 'gpu', label: 'GPU', icon: '🎮' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'psu', label: 'PSU', icon: '🔌' },
    { id: 'case', label: 'Casing', icon: '🖥️' },
    { id: 'cooler', label: 'Cooler', icon: '❄️' },
  ];

  const filteredComponents = components
    .filter((comp) => {
      if (activeCategory !== 'all' && comp.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.brand.toLowerCase().includes(q) ||
          comp.shortDescription.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="flex flex-col h-full bg-[#0d131f] rounded-2xl border border-slate-800 p-4">
      {/* Header Search & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <span>Katalog Komponen</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredComponents.length} Tersedia
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih komponen fiktif dengan spesifikasi yang sesuai
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Cari komponen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="default">Urutan Standar</option>
            <option value="price-asc">Harga Termurah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80 mb-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40 font-bold'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredComponents.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
            <span className="text-3xl mb-2">🔍</span>
            <p>Tidak ada komponen yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
            {filteredComponents.map((comp) => {
              const isInstalled = selectedComponents[comp.category]?.id === comp.id;
              return (
                <ComponentCard
                  key={comp.id}
                  component={comp}
                  isInstalled={isInstalled}
                  onSelect={onSelectComponent}
                  onRemove={onRemoveComponent}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
