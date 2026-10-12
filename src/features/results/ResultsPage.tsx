import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useBuildStore } from '@/store/build-store';
import {
  selectCurrentScenario,
  selectHydratedComponents,
  selectBudgetResult,
  selectBuildEvaluation,
} from '@/store/selectors';
import { exportToJson, type ExportDataPayload } from '@/infrastructure/exporters/to-json';
import { exportToCsv } from '@/infrastructure/exporters/to-csv';
import { exportToPrintablePdf } from '@/infrastructure/exporters/to-pdf';
import { exportToImage } from '@/infrastructure/exporters/to-image';
import { ComponentSvg } from '@/shared/illustrations/ComponentSvg';
import type { ComponentCategory } from '@/domain/types';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useBuildStore();
  const scenario = selectCurrentScenario(store);
  const hydratedComponents = selectHydratedComponents(store);
  const budgetResult = selectBudgetResult(store);
  const evaluation = selectBuildEvaluation(store);
  const [expandedAttempt, setExpandedAttempt] = useState<number | null>(null);

  const formatRp = (num: number) =>
    'Rp ' + num.toLocaleString('id-ID');

  // Trigger celebration confetti if compatible
  useEffect(() => {
    if (evaluation.isCompatible && evaluation.isWithinBudget) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [evaluation.isCompatible, evaluation.isWithinBudget]);

  const payload: ExportDataPayload = {
    exportDate: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    scenario,
    selectedComponents: hydratedComponents,
    rationale: store.rationales,
    budget: {
      total: budgetResult.total,
      budget: budgetResult.budget,
      remaining: budgetResult.remaining,
    },
    attempts: store.attempts,
    evaluation,
  };

  const componentEntries = Object.entries(hydratedComponents);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Banner / Verdict */}
      <div className="bg-[#0f172a] rounded-2xl border border-cyan-500/30 p-6 md:p-8 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                Hasil Akhir Evaluasi
              </span>
              <span className="text-xs text-slate-400">
                Skenario: <strong>{scenario.title}</strong>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {evaluation.isCompatible && evaluation.isWithinBudget
                ? '🎉 Perakitan Berhasil Diselesaikan!'
                : '⚠️ Perakitan Perlu Penyesuaian'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {evaluation.verdict}
            </p>
          </div>

          {/* Big Score Card */}
          <div className="bg-[#121c2e] border border-cyan-500/50 rounded-2xl p-5 text-center shrink-0 min-w-[180px] shadow-lg">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Skor Performa
            </div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono">
              {evaluation.score}
              <span className="text-lg text-slate-500 font-normal">/100</span>
            </div>
            <div className="mt-2 text-[11px] font-bold">
              {evaluation.isCompatible ? (
                <span className="text-emerald-400">✓ 100% Kompatibel</span>
              ) : (
                <span className="text-red-400">✕ Belum Kompatibel</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <span>🏅 Lencana Pencapaian:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {evaluation.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                b.earned
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                  : 'bg-slate-900/40 border-slate-800 opacity-50 grayscale'
              }`}
            >
              <div>
                <div className="text-2xl mb-2">{b.earned ? '🌟' : '🔒'}</div>
                <div className="text-xs font-bold text-slate-100 mb-1">
                  {b.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {b.description}
                </div>
              </div>
              <div className="mt-3 text-[10px] font-mono font-bold">
                {b.earned ? (
                  <span className="text-cyan-400">Diraih ✓</span>
                ) : (
                  <span className="text-slate-500">Terkunci</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Realization Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-mono">Pagu Anggaran</span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {formatRp(budgetResult.budget)}
          </div>
        </div>
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-mono">Total Biaya Realisasi</span>
          <div className="text-xl font-bold text-cyan-300 font-mono mt-1">
            {formatRp(budgetResult.total)}
          </div>
        </div>
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-mono">
            {budgetResult.remaining >= 0 ? 'Sisa Anggaran Efisiensi' : 'Pelampauan Biaya'}
          </span>
          <div
            className={`text-xl font-bold font-mono mt-1 ${
              budgetResult.remaining >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {budgetResult.remaining >= 0
              ? formatRp(budgetResult.remaining)
              : `-${formatRp(Math.abs(budgetResult.remaining))}`}
          </div>
        </div>
      </div>

      {/* Critical Issues & Remediation Guidance */}
      {store.lastCheckResults && store.lastCheckResults.some((r) => r.status !== 'pass') && (
        <div className="bg-[#0e1422] rounded-2xl border border-red-500/40 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-base font-bold text-white">
                Tinjauan Masalah & Solusi Perbaikan yang Benar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi rakitan Anda memiliki catatan teknis. Pelajari alasan ketidakcocokan dan langkah solusinya di bawah ini:
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {store.lastCheckResults
              .filter((r) => r.status !== 'pass')
              .map((issue) => (
                <div
                  key={issue.ruleId}
                  className={`p-4 rounded-xl border text-xs ${
                    issue.severity === 'error'
                      ? 'bg-red-950/30 border-red-800/80'
                      : 'bg-amber-950/20 border-amber-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-white text-sm">
                      [{issue.ruleId}] {issue.ruleName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        issue.severity === 'error'
                          ? 'bg-red-900 text-red-200 border border-red-800'
                          : 'bg-amber-900 text-amber-200 border border-amber-800'
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  <p className="text-slate-100 font-semibold mb-2.5 leading-relaxed">
                    {issue.message}
                  </p>

                  <div className="space-y-2">
                    <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-[11px] text-slate-300">
                      <strong className="text-red-400">🔍 Mengapa Salah / Penyebab: </strong>
                      {issue.educationalNote}
                    </div>

                    {issue.remedy && (
                      <div className="bg-emerald-950/40 rounded-lg p-3 border border-emerald-700/60 text-[11px] text-emerald-200 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✅ Langkah yang Benar:</span>
                        <span className="leading-relaxed">{issue.remedy}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Components & Rationale Table */}
      <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Rincian Komponen & Catatan Rasionalisasi
        </h3>

        <div className="space-y-3">
          {componentEntries.map(([cat, comp]) => {
            if (!comp) return null;
            const categoryKey = cat as ComponentCategory;
            const rationaleText = store.rationales[categoryKey];
            return (
              <div
                key={cat}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                    <ComponentSvg name={comp.illustration} className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      {comp.category}
                    </div>
                    <div className="text-sm font-bold text-white">{comp.name}</div>
                    <div className="text-xs text-slate-400">{comp.shortDescription}</div>
                  </div>
                </div>

                <div className="flex-1 md:max-w-md bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Alasan Pemilihan:
                  </span>
                  <p className="text-slate-200 italic">
                    {rationaleText ? `"${rationaleText}"` : 'Tidak ada catatan alasan.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-slate-400">Harga</div>
                  <div className="text-sm font-bold text-cyan-300 font-mono">
                    {formatRp(comp.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attempt History (Expandable & Informative) */}
      {store.attempts.length > 0 && (
        <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Riwayat Percobaan & Perbaikan ({store.attempts.length}x Pemeriksaan)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Klik salah satu riwayat percobaan untuk melihat rincian komponen terpilih, kesalahan, dan solusinya:
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono">
              Total: {store.attempts.length} Sesi
            </span>
          </div>

          <div className="space-y-3">
            {store.attempts.map((att) => {
              const isExpanded = expandedAttempt === att.attemptNumber;
              return (
                <div
                  key={att.attemptNumber}
                  className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all text-xs"
                >
                  <div
                    onClick={() => setExpandedAttempt(isExpanded ? null : att.attemptNumber)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/90 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-200">
                        Percobaan #{att.attemptNumber}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {att.timestamp}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          att.passed
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {att.passed ? '✓ Lulus Kompatibel' : `✕ ${att.errorCount} Masalah`}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="font-mono text-slate-300">
                        Biaya: <strong className="text-white">{formatRp(att.totalCost)}</strong>
                      </div>
                      <span className="text-cyan-400 font-mono text-[11px] font-semibold">
                        {isExpanded ? '▲ Sembunyikan' : '▼ Rincian'}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800/80 bg-slate-950/70 space-y-4 animate-fade-in">
                      {att.componentsSummary && att.componentsSummary.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-2">
                            Komponen yang Dipasang pada Percobaan Ini:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {att.componentsSummary.map((c, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]"
                              >
                                <div className="text-[9px] font-mono text-cyan-400 uppercase font-bold">
                                  {c.category}
                                </div>
                                <div className="font-bold text-white truncate">
                                  {c.name}
                                </div>
                                <div className="text-slate-400 font-mono text-[10px]">
                                  {formatRp(c.price)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {att.issues.length > 0 ? (
                        <div>
                          <span className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-2">
                            Catatan Masalah pada Percobaan Ini ({att.issues.length}):
                          </span>
                          <div className="space-y-2">
                            {att.issues.map((iss, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg bg-red-950/20 border border-red-800/60 text-[11px] space-y-1.5"
                              >
                                <div className="font-bold text-red-300">
                                  [{iss.ruleId}] {iss.ruleName} — {iss.message}
                                </div>
                                {iss.educationalNote && (
                                  <div className="text-slate-300 text-[11px]">
                                    <strong className="text-red-400">🔍 Mengapa Salah: </strong>
                                    {iss.educationalNote}
                                  </div>
                                )}
                                {iss.remedy && (
                                  <div className="text-emerald-300 text-[11px] bg-emerald-950/30 p-2 rounded border border-emerald-800/50">
                                    <strong className="text-emerald-400">✅ Langkah yang Benar: </strong>
                                    {iss.remedy}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
                          <span>✓</span>
                          <span>Seluruh aturan kompatibilitas dan batas anggaran terpenuhi dengan sempurna pada percobaan ini!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Action Bar */}
      <div className="bg-[#121c2e] rounded-2xl border border-cyan-500/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="font-bold text-sm text-white">
            Dokumentasi & Ekspor Hasil Simulasi
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Unduh laporan tugas rakitan dalam berbagai format standar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportToJson(payload)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>{ } Ekspor JSON</span>
          </button>
          <button
            onClick={() => exportToCsv(payload)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>📊 Ekspor CSV</span>
          </button>
          <button
            onClick={() => exportToImage(payload)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>🖼️ Unduh Gambar</span>
          </button>
          <button
            onClick={() => exportToPrintablePdf(payload)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-950/50 flex items-center gap-1.5"
          >
            <span>🖨️ Cetak Laporan / PDF</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation & Replay Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => navigate('/builder')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>🛠️ Perbaiki / Ubah Rakitan</span>
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  'Mulai ulang rakitan ini dari awal? Komponen terpilih saat ini akan dikosongkan agar Anda dapat mencoba merakit ulang, namun seluruh riwayat percobaan tetap tersimpan.'
                )
              ) {
                store.resetCurrentBuild();
                navigate('/builder');
              }
            }}
            className="px-4 py-2.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>🔄 Coba Ulang Bermain (Mulai Baru)</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/scenarios')}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Pilih Skenario Lain →</span>
        </button>
      </div>
    </div>
  );
};
