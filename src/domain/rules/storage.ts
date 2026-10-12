import type { PcComponent, CheckResult, RuleMeta } from '../types';

export function checkStorageRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const storage = selectedComponents['storage'];
  const mb = selectedComponents['motherboard'];

  if (!storage || !mb) return null;

  const storageInterface = storage.specs.interface as string; // 'M.2 NVMe' | 'SATA 2.5'
  const m2Slots = Number(mb.specs.m2Slots) || 0;
  const sataPorts = Number(mb.specs.sataPorts) || 0;

  let isSupported = true;
  let detailMessage = '';

  if (storageInterface === 'M.2 NVMe') {
    isSupported = m2Slots > 0;
    detailMessage = isSupported
      ? `Motherboard memiliki ${m2Slots} slot M.2 NVMe untuk SSD ini.`
      : 'Motherboard tidak memiliki slot M.2 NVMe untuk memasang SSD bertipe M.2 ini.';
  } else if (storageInterface === 'SATA 2.5') {
    isSupported = sataPorts > 0;
    detailMessage = isSupported
      ? `Motherboard memiliki ${sataPorts} port SATA untuk SSD SATA 2.5 ini.`
      : 'Motherboard tidak memiliki port SATA yang tersedia.';
  }

  return {
    ruleId: 'R-STOR-01',
    ruleName: ruleMeta?.name || 'Dukungan Antarmuka Media Penyimpanan',
    severity: 'error',
    status: isSupported ? 'pass' : 'fail',
    involved: ['storage', 'motherboard'],
    message: detailMessage,
    educationalNote:
      ruleMeta?.explanation ||
      'Pastikan motherboard menyediakan antarmuka slot yang cocok (M.2 NVMe PCIe atau SATA) dengan media penyimpanan pilihan Anda.',
    remedy: isSupported
      ? undefined
      : storageInterface === 'M.2 NVMe'
      ? 'Ganti motherboard yang memiliki slot M.2 NVMe, ATAU gunakan media penyimpanan bertipe SATA 2.5" SSD.'
      : 'Ganti motherboard yang memiliki port SATA yang memadai.',
  };
}
