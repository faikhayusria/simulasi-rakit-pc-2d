import type { PcComponent, CheckResult, RuleMeta } from '../types';

export function checkMemoryRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const ram = selectedComponents['ram'];
  const motherboard = selectedComponents['motherboard'];

  if (!ram || !motherboard) {
    return null;
  }

  const ramType = ram.specs.type;
  const mbRamType = motherboard.specs.ramType;
  const isMatch = ramType === mbRamType;

  return {
    ruleId: 'R-RAM-01',
    ruleName: ruleMeta?.name || 'Generasi Tipe RAM (DDR4 / DDR5)',
    severity: 'error',
    status: isMatch ? 'pass' : 'fail',
    involved: ['ram', 'motherboard'],
    message: isMatch
      ? `Generasi RAM ${ramType} didukung oleh slot motherboard (${mbRamType}).`
      : `Inkompatibilitas RAM: RAM bertipe ${ramType}, tetapi Motherboard hanya mendukung memori ${mbRamType}.`,
    educationalNote:
      ruleMeta?.explanation ||
      'Tipe RAM (DDR4 atau DDR5) harus sesuai dengan slot pada motherboard karena bentuk fisik takik (notch) berbeda sehingga tidak dapat saling ditukar.',
    remedy: isMatch
      ? undefined
      : `Ganti modul RAM ke tipe ${mbRamType} agar sesuai dengan slot ${motherboard.name}, ATAU pilih motherboard yang mendukung memori ${ramType}.`,
  };
}
