import type {
  PcComponent,
  ComponentCategory,
  CheckResult,
  RuleMeta,
} from '../types';

export const ALL_CATEGORIES: ComponentCategory[] = [
  'cpu',
  'motherboard',
  'ram',
  'gpu',
  'storage',
  'psu',
  'case',
  'cooler',
];

export function checkCompletenessRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  requiredCategories: ComponentCategory[] = ALL_CATEGORIES,
  ruleMeta?: RuleMeta
): CheckResult {
  const missingCategories = requiredCategories.filter(
    (cat) => !selectedComponents[cat]
  );
  const isComplete = missingCategories.length === 0;

  const categoryLabels: Record<ComponentCategory, string> = {
    cpu: 'Prosesor (CPU)',
    motherboard: 'Motherboard',
    ram: 'Memori RAM',
    gpu: 'Kartu Grafis (GPU)',
    storage: 'Media Penyimpanan (SSD)',
    psu: 'Catu Daya (PSU)',
    case: 'Casing PC',
    cooler: 'Pendingin CPU (Cooler)',
  };

  const missingLabels = missingCategories
    .map((cat) => categoryLabels[cat] || cat)
    .join(', ');

  return {
    ruleId: 'R-COMP-01',
    ruleName: ruleMeta?.name || 'Kelengkapan 8 Komponen Utama PC',
    severity: 'error',
    status: isComplete ? 'pass' : 'fail',
    involved: missingCategories,
    message: isComplete
      ? 'Seluruh 8 komponen esensial PC telah terpasang dengan lengkap.'
      : `Rakitan Belum Lengkap: Masih terdapat ${missingCategories.length} slot komponen kosong (${missingLabels}).`,
    educationalNote:
      ruleMeta?.explanation ||
      'Sebuah unit komputer memerlukan seluruh 8 komponen penting agar dapat menyelesaikan proses Power-On Self-Test (POST) dan siap beroperasi.',
    remedy: isComplete
      ? undefined
      : `Lengkapi komponen yang masih kosong pada papan perakitan: ${missingLabels}.`,
  };
}
