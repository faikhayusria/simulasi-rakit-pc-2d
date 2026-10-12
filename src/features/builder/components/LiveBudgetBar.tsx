import React from 'react';
import type { BudgetResult } from '@/domain/types';

interface LiveBudgetBarProps {
  budgetResult: BudgetResult;
}

export const LiveBudgetBar: React.FC<LiveBudgetBarProps> = ({ budgetResult }) => {
  const { total, budget, remaining, status, percentage } = budgetResult;

  const formatRp = (num: number) =>
    'Rp ' + num.toLocaleString('id-ID');

  const isOver = status === 'over';
  const isNearLimit = percentage >= 85 && !isOver;

  // Determine bar color
  let barColorClass = 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]';
  if (isOver) {
    barColorClass = 'bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]';
  } else if (isNearLimit) {
    barColorClass = 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]';
  }

  return (
    <div className="bg-[#0f172a]/90 backdrop-blur border border-slate-800 rounded-xl p-3.5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">💰</span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Alokasi Anggaran
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              isOver
                ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                : isNearLimit
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {isOver ? '! MELEBIHI PAGU' : isNearLimit ? 'OPTIMAL' : 'DALAM PAGU'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Total: </span>
            <span className={`font-bold ${isOver ? 'text-red-400' : 'text-cyan-300'}`}>
              {formatRp(total)}
            </span>
          </div>
          <div className="text-slate-600">/</div>
          <div>
            <span className="text-slate-400">Batas: </span>
            <span className="font-bold text-slate-200">{formatRp(budget)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          style={{ width: `${Math.min(percentage, 100)}%` }}
          className={`h-full transition-all duration-300 rounded-full ${barColorClass}`}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-2 text-[11px] font-mono">
        <span className="text-slate-400">
          Pemakaian: <strong className="text-white">{percentage}%</strong>
        </span>
        <span className={isOver ? 'text-red-400 font-bold' : 'text-emerald-400 font-semibold'}>
          {isOver
            ? `Melebihi ${formatRp(Math.abs(remaining))}`
            : `Sisa Dana: ${formatRp(remaining)}`}
        </span>
      </div>
    </div>
  );
};
