import type { CheckResult } from './types';

export interface PrioritizedFeedback {
  hasErrors: boolean;
  hasWarnings: boolean;
  isAllPassed: boolean;
  errors: CheckResult[];
  warnings: CheckResult[];
  passes: CheckResult[];
  summaryMessage: string;
}

export function generatePrioritizedFeedback(
  results: CheckResult[]
): PrioritizedFeedback {
  const errors = results.filter((r) => r.status === 'fail');
  const warnings = results.filter((r) => r.status === 'warn');
  const passes = results.filter((r) => r.status === 'pass');

  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const isAllPassed = !hasErrors && !hasWarnings;

  let summaryMessage = '';
  if (hasErrors) {
    summaryMessage = `Ditemukan ${errors.length} masalah inkompatibilitas kritis yang harus diperbaiki.`;
  } else if (hasWarnings) {
    summaryMessage = `Seluruh komponen kompatibel, namun terdapat ${warnings.length} catatan optimasi.`;
  } else {
    summaryMessage = 'Luar biasa! Seluruh komponen terpasang kompatibel dan memenuhi spesifikasi.';
  }

  return {
    hasErrors,
    hasWarnings,
    isAllPassed,
    errors,
    warnings,
    passes,
    summaryMessage,
  };
}
