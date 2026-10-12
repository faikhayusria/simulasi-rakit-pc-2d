import React from 'react';
import type { CheckResult } from '@/domain/types';
import { generatePrioritizedFeedback } from '@/domain/feedback';

interface FeedbackPanelProps {
  results: CheckResult[];
  onClose: () => void;
  onProceedToRationale: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  results,
  onClose,
  onProceedToRationale,
}) => {
  const feedback = generatePrioritizedFeedback(results);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0e1422] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/80 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {feedback.hasErrors ? '⚠️' : feedback.hasWarnings ? '⚡' : '🎉'}
              </span>
              <h2 className="text-xl font-bold text-white">
                Hasil Pemeriksaan Kompatibilitas & Anggaran
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {feedback.summaryMessage}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Issues List */}
        <div className="my-5 space-y-3.5 max-h-[60vh] overflow-y-auto pr-2">
          {/* 1. Errors Section */}
          {feedback.errors.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping" />
                Inkompatibilitas Kritis ({feedback.errors.length})
              </h4>
              {feedback.errors.map((item) => (
                <div
                  key={item.ruleId}
                  className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-red-300 font-mono">
                      [{item.ruleId}] {item.ruleName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-900/80 text-red-200 text-[10px] font-bold uppercase">
                      Error
                    </span>
                  </div>
                  <p className="text-slate-200 font-semibold mb-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="bg-slate-900/90 rounded-lg p-2.5 border border-red-900/50 text-[11px] text-slate-300">
                      <strong className="text-red-400">🔍 Mengapa Salah / Penyebab: </strong>
                      {item.educationalNote}
                    </div>
                    {item.remedy && (
                      <div className="bg-emerald-950/40 rounded-lg p-2.5 border border-emerald-700/60 text-[11px] text-emerald-200 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✅ Langkah yang Benar:</span>
                        <span>{item.remedy}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Warnings Section */}
          {feedback.warnings.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚠️ Catatan Optimasi & Rekomendasi ({feedback.warnings.length})</span>
              </h4>
              {feedback.warnings.map((item) => (
                <div
                  key={item.ruleId}
                  className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/80 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-amber-300 font-mono">
                      [{item.ruleId}] {item.ruleName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 text-[10px] font-bold uppercase">
                      Warning
                    </span>
                  </div>
                  <p className="text-slate-200 font-semibold mb-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="bg-slate-900/90 rounded-lg p-2.5 border border-amber-900/40 text-[11px] text-slate-300">
                      <strong className="text-amber-400">💡 Analisis Dampak: </strong>
                      {item.educationalNote}
                    </div>
                    {item.remedy && (
                      <div className="bg-emerald-950/40 rounded-lg p-2.5 border border-emerald-700/60 text-[11px] text-emerald-200 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✅ Saran Perbaikan:</span>
                        <span>{item.remedy}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. Passed Section */}
          {feedback.passes.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Aturan yang Lolos ({feedback.passes.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {feedback.passes.map((item) => (
                  <div
                    key={item.ruleId}
                    className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/50 text-[11px] flex items-center gap-2"
                  >
                    <span className="text-emerald-400 text-sm">✓</span>
                    <span className="text-slate-300 font-medium truncate">
                      {item.ruleName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {feedback.hasErrors ? 'Perbaiki Komponen' : 'Tutup'}
          </button>

          {!feedback.hasErrors && (
            <button
              onClick={onProceedToRationale}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Catatan Alasan & Selesai</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
