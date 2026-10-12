import type {
  PcComponent,
  Scenario,
  BudgetResult,
  CheckResult,
  RuleMeta,
} from './types';

export function calculateBudget(
  selectedComponents: Partial<Record<string, PcComponent>>,
  scenario?: Scenario
): BudgetResult {
  const total = Object.values(selectedComponents).reduce(
    (sum, comp) => (comp ? sum + comp.price : sum),
    0
  );

  const budget = scenario ? scenario.budget : 0;
  const remaining = budget - total;
  const status = remaining >= 0 ? 'within' : 'over';
  const percentage = budget > 0 ? Math.min(Math.round((total / budget) * 100), 200) : 0;

  return {
    total,
    budget,
    remaining,
    status,
    percentage,
  };
}

export function checkBudgetRule(
  budgetResult: BudgetResult,
  ruleMeta?: RuleMeta
): CheckResult {
  const isWithin = budgetResult.status === 'within';
  const formatRp = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);

  return {
    ruleId: 'R-BUD-01',
    ruleName: ruleMeta?.name || 'Batas Maksimal Anggaran Biaya (Budget Cap)',
    severity: 'error',
    status: isWithin ? 'pass' : 'fail',
    involved: [],
    message: isWithin
      ? `Total biaya komponen (${formatRp(budgetResult.total)}) berada dalam batas anggaran (${formatRp(budgetResult.budget)}). Sisa anggaran: ${formatRp(budgetResult.remaining)}.`
      : `Anggaran Terlampaui: Total biaya (${formatRp(budgetResult.total)}) melebihi anggaran yang tersedia (${formatRp(budgetResult.budget)}) sebesar ${formatRp(Math.abs(budgetResult.remaining))}.`,
    educationalNote:
      ruleMeta?.explanation ||
      'Seorang perakit profesional harus mampu merancang spesifikasi yang efektif tanpa melebihi batas anggaran klien.',
    remedy: isWithin
      ? undefined
      : `Ganti atau turunkan tingkatan komponen sekunder (misal SSD, casing, cooler, atau RAM) agar total belanja kembali di bawah batas ${formatRp(budgetResult.budget)}.`,
  };
}
