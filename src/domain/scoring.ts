import type {
  BuildEvaluation,
  CheckResult,
  BudgetResult,
  ComponentCategory,
} from './types';
import { ALL_CATEGORIES } from './rules/completeness';

export function evaluateBuildScore(
  results: CheckResult[],
  budget: BudgetResult,
  rationale: Partial<Record<ComponentCategory, string>>,
  attemptsCount: number
): BuildEvaluation {
  const errors = results.filter((r) => r.status === 'fail');
  const warnings = results.filter((r) => r.status === 'warn');

  const isCompatible = errors.length === 0;
  const isWithinBudget = budget.status === 'within';

  // Base score calculation
  let score = 0;

  if (isCompatible) {
    score += 50; // 50 pts for full compatibility
  } else {
    // Partial points for fewer errors
    score += Math.max(0, 50 - errors.length * 15);
  }

  // Budget points (max 20)
  if (isWithinBudget) {
    // Optimal is utilizing 80% - 99% of budget
    if (budget.percentage >= 80 && budget.percentage <= 100) {
      score += 20;
    } else if (budget.percentage < 80) {
      score += 15; // Still good, frugal
    }
  }

  // Warnings deduction (max -10)
  score -= Math.min(10, warnings.length * 5);

  // Rationale completeness (max 20 pts)
  let rationaleFilledCount = 0;
  for (const cat of ALL_CATEGORIES) {
    const text = (rationale[cat] || '').trim();
    if (text.length >= 10) {
      rationaleFilledCount++;
    }
  }
  score += Math.round((rationaleFilledCount / ALL_CATEGORIES.length) * 20);

  // Persistence bonus (attempts count >= 1 and passed)
  if (isCompatible && attemptsCount > 0) {
    score += 10;
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Badges
  const badges = [
    {
      id: 'badge-perfect-compat',
      name: 'Rakit Sempurna',
      description: 'Seluruh komponen 100% kompatibel tanpa satupun error!',
      icon: 'CheckCircle2',
      earned: isCompatible && errors.length === 0,
    },
    {
      id: 'badge-budget-master',
      name: 'Pakar Anggaran',
      description: 'Berhasil merakit PC tanpa melampaui pagu anggaran skenario.',
      icon: 'Coins',
      earned: isWithinBudget,
    },
    {
      id: 'badge-clean-run',
      name: 'Bebas Hambatan Termal',
      description: 'Tidak ada peringatan termal pendinginan maupun PSU.',
      icon: 'ShieldCheck',
      earned: isCompatible && warnings.length === 0,
    },
    {
      id: 'badge-rationale-pro',
      name: 'Rasionalisasi Lengkap',
      description: 'Memberikan catatan analisis alasan pemilihan untuk seluruh 8 komponen.',
      icon: 'FileText',
      earned: rationaleFilledCount === ALL_CATEGORIES.length,
    },
  ];

  let verdict = '';
  if (score >= 90) {
    verdict = 'Sangat Memuaskan (Master Builder) — Rakitan sangat optimal, efisien, dan rasionalisasi komprehensif.';
  } else if (score >= 75) {
    verdict = 'Memuaskan (Teknisi Kompeten) — Rakitan kompatibel dan aman, siap untuk dioperasikan.';
  } else if (score >= 60) {
    verdict = 'Cukup (Perlu Optimasi) — Sistem berjalan, namun masih terdapat catatan optimasi biaya atau pendinginan.';
  } else {
    verdict = 'Kurang — Masih terdapat kendala inkompatibilitas kritis atau anggaran terlampaui.';
  }

  return {
    isCompatible,
    isWithinBudget,
    score,
    badges,
    verdict,
  };
}
