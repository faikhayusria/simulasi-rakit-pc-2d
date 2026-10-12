import type { PcComponent, CheckResult, RuleMeta } from '../types';

export function checkPsuWattageRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const psu = selectedComponents['psu'];
  const cpu = selectedComponents['cpu'];
  const gpu = selectedComponents['gpu'];

  if (!psu || !cpu) return null;

  const psuWattage = Number(psu.specs.wattage);
  const cpuTdp = Number(cpu.specs.tdp) || 65;
  const gpuTdp = gpu ? Number(gpu.specs.tdp) || 0 : 0;
  const systemMargin = 100; // Fans, RAM, motherboard, storage, USB
  const estimatedPeakPower = cpuTdp + gpuTdp + systemMargin;
  const safeHeadroom = Math.round(estimatedPeakPower * 1.15);

  // Let's check recommended min PSU wattage:
  // If peak power > psuWattage: fail error
  // If psuWattage is between peakPower and peakPower * 1.15: warning (low headroom)
  if (psuWattage < estimatedPeakPower) {
    return {
      ruleId: 'R-PSU-01',
      ruleName: ruleMeta?.name || 'Kecukupan Daya Catu Daya (PSU Wattage)',
      severity: 'error',
      status: 'fail',
      involved: ['psu', 'cpu', 'gpu'].filter(
        (c) => !!selectedComponents[c]
      ) as any,
      message: `Daya PSU Kurang: Daya PSU (${psuWattage}W) tidak mencukupi estimasi beban puncak sistem (${estimatedPeakPower}W: CPU ${cpuTdp}W + GPU ${gpuTdp}W + Sistem 100W).`,
      educationalNote:
        ruleMeta?.explanation ||
        'Unit Catu Daya (PSU) yang kekurangan daya dapat menyebabkan komputer mati mendadak atau memicu proteksi trip.',
      remedy: `Ganti PSU dengan kapasitas minimal ${Math.max(safeHeadroom, 550)}W untuk menyuplai beban puncak sistem (${estimatedPeakPower}W) dengan aman.`,
    };
  }

  if (psuWattage < safeHeadroom) {
    return {
      ruleId: 'R-PSU-01',
      ruleName: ruleMeta?.name || 'Kecukupan Daya Catu Daya (PSU Wattage)',
      severity: 'warning',
      status: 'warn',
      involved: ['psu', 'cpu', 'gpu'].filter(
        (c) => !!selectedComponents[c]
      ) as any,
      message: `Headroom Daya Tipis: Daya PSU (${psuWattage}W) mencukupi estimasi puncak (${estimatedPeakPower}W), namun disarankan minimal ${safeHeadroom}W untuk efisiensi dan keawetan umur komponen catu daya.`,
      educationalNote:
        ruleMeta?.explanation ||
        'Disarankan memberi cadangan (headroom) 15-20% di atas konsumsi puncak sistem.',
      remedy: `Pertimbangkan untuk meningkatkan PSU ke ${safeHeadroom}W atau lebih agar efisiensi 80-Plus optimal dan catu daya tidak cepat panas.`,
    };
  }

  return {
    ruleId: 'R-PSU-01',
    ruleName: ruleMeta?.name || 'Kecukupan Daya Catu Daya (PSU Wattage)',
    severity: 'error',
    status: 'pass',
    involved: ['psu', 'cpu', 'gpu'].filter(
      (c) => !!selectedComponents[c]
    ) as any,
    message: `Kapasitas daya PSU (${psuWattage}W) aman melampaui estimasi kebutuhan sistem (${estimatedPeakPower}W).`,
    educationalNote:
      ruleMeta?.explanation ||
      'PSU dengan kapasitas aman menjaga efisiensi kurva 80-Plus dan kestabilan tegangan daya.',
  };
}

export function checkPsuPcieConnectorsRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const psu = selectedComponents['psu'];
  const gpu = selectedComponents['gpu'];

  if (!psu || !gpu) return null;

  const gpuConnector = gpu.specs.powerConnector as string; // 'none' | '8pin' | '12pin'
  const psuConnectors = (psu.specs.pcieConnectors as string[]) || [];

  if (!gpuConnector || gpuConnector === 'none') {
    return {
      ruleId: 'R-PSU-02',
      ruleName: ruleMeta?.name || 'Ketersediaan Konektor Daya Eksternal GPU',
      severity: 'error',
      status: 'pass',
      involved: ['psu', 'gpu'],
      message: 'Kartu grafis tidak memerlukan konektor daya eksternal tambahan (daya via slot PCIe).',
      educationalNote:
        ruleMeta?.explanation ||
        'Kartu grafis berdaya rendah mengambil daya langsung dari motherboard.',
    };
  }

  const hasConnector = psuConnectors.includes(gpuConnector);

  return {
    ruleId: 'R-PSU-02',
    ruleName: ruleMeta?.name || 'Ketersediaan Konektor Daya Eksternal GPU',
    severity: 'error',
    status: hasConnector ? 'pass' : 'fail',
    involved: ['psu', 'gpu'],
    message: hasConnector
      ? `PSU menyediakan kabel konektor daya yang dibutuhkan kartu grafis (${gpuConnector}).`
      : `Kabel Daya GPU Tidak Tersedia: Kartu grafis membutuhkan kabel daya ${gpuConnector}, tetapi PSU hanya menyediakan [${psuConnectors.join(', ')}].`,
    educationalNote:
      ruleMeta?.explanation ||
      'Pastikan PSU menyediakan kabel daya PCIe yang tepat (seperti 8-pin atau 12-pin 12VHPWR) untuk menghindari kabel konverter yang rawan meleleh.',
    remedy: hasConnector
      ? undefined
      : `Pilih catu daya (PSU) yang memiliki kabel konektor PCIe ${gpuConnector} ATAU pilih kartu grafis yang sesuai dengan konektor PSU yang tersedia.`,
  };
}
