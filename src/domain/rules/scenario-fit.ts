import type {
  PcComponent,
  Scenario,
  CheckResult,
  RuleMeta,
  ComponentCategory,
} from '../types';

export function checkScenarioFitRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  scenario?: Scenario,
  ruleMeta?: RuleMeta
): CheckResult | null {
  if (!scenario) return null;

  const hints = scenario.performanceHints;
  const involved: ComponentCategory[] = [];
  const issues: string[] = [];

  // Check RAM capacity
  const ram = selectedComponents['ram'];
  if (ram && hints.minRamGB) {
    const ramCapacity = Number(ram.specs.capacityGB) || 0;
    if (ramCapacity < hints.minRamGB) {
      involved.push('ram');
      issues.push(
        `Kapasitas RAM (${ramCapacity}GB) di bawah anjuran skenario (minimal ${hints.minRamGB}GB).`
      );
    }
  }

  // Check Storage capacity
  const storage = selectedComponents['storage'];
  if (storage && hints.minStorageGB) {
    const storageCapacity = Number(storage.specs.capacityGB) || 0;
    if (storageCapacity < hints.minStorageGB) {
      involved.push('storage');
      issues.push(
        `Kapasitas penyimpanan (${storageCapacity}GB) di bawah anjuran skenario (minimal ${hints.minStorageGB}GB).`
      );
    }
  }

  // Check GPU
  const gpu = selectedComponents['gpu'];
  if (hints.needsDedicatedGpu && !gpu) {
    involved.push('gpu');
    issues.push('Skenario ini membutuhkan kartu grafis diskrit (dedicated GPU).');
  }

  const isFitted = issues.length === 0;

  return {
    ruleId: 'R-SCEN-01',
    ruleName: ruleMeta?.name || 'Kesesuaian Spesifikasi Terhadap Kebutuhan Skenario',
    severity: 'warning',
    status: isFitted ? 'pass' : 'warn',
    involved,
    message: isFitted
      ? `Spesifikasi rakitan telah memenuhi seluruh rekomendasi skenario "${scenario.title}".`
      : `Catatan Optimasi Skenario: ${issues.join(' ')}`,
    educationalNote:
      ruleMeta?.explanation ||
      'Pastikan spesifikasi perangkat keras sesuai dengan profil beban kerja pengguna pada skenario.',
    remedy: isFitted
      ? undefined
      : `Sesuaikan komponen dengan rekomendasi skenario: ${issues.join(' ')}`,
  };
}
