import type { PcComponent, CheckResult, RuleMeta } from '../types';

export function checkFormFactorRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const mb = selectedComponents['motherboard'];
  const pcCase = selectedComponents['case'];

  if (!mb || !pcCase) return null;

  const mbFormFactor = mb.specs.formFactor as string;
  const supportedFactors = (pcCase.specs.supportedFormFactors as string[]) || [];
  const isMatch = supportedFactors.includes(mbFormFactor);

  return {
    ruleId: 'R-FORM-01',
    ruleName: ruleMeta?.name || 'Kesesuaian Form Factor Motherboard di Casing',
    severity: 'error',
    status: isMatch ? 'pass' : 'fail',
    involved: ['motherboard', 'case'],
    message: isMatch
      ? `Form factor motherboard (${mbFormFactor}) muat di dalam casing (dukung: ${supportedFactors.join(', ')}).`
      : `Ukuran Motherboard Tidak Muat: Motherboard berukuran ${mbFormFactor}, tetapi casing hanya mendukung: ${supportedFactors.join(', ')}.`,
    educationalNote:
      ruleMeta?.explanation ||
      'Motherboard ATX membutuhkan casing yang memiliki ruang vertikal dan dudukan baut standoff yang sesuai.',
    remedy: isMatch
      ? undefined
      : `Ganti casing dengan model yang mendukung form factor ${mbFormFactor} ATAU pilih motherboard dengan ukuran yang lebih ringkas (${supportedFactors.join(' / ')}).`,
  };
}

export function checkGpuLengthRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const gpu = selectedComponents['gpu'];
  const pcCase = selectedComponents['case'];

  if (!gpu || !pcCase) return null;

  const gpuLength = Number(gpu.specs.lengthMM);
  const maxGpuLength = Number(pcCase.specs.maxGpuLengthMM);
  const isFit = gpuLength <= maxGpuLength;

  return {
    ruleId: 'R-GPU-01',
    ruleName: ruleMeta?.name || 'Panjang Maksimal Kartu Grafis (GPU Clearance)',
    severity: 'error',
    status: isFit ? 'pass' : 'fail',
    involved: ['gpu', 'case'],
    message: isFit
      ? `Panjang kartu grafis (${gpuLength}mm) muat di dalam batas ruang casing (${maxGpuLength}mm).`
      : `Kartu Grafis Terlalu Panjang: Panjang GPU ${gpuLength}mm melebihi batas clearance casing (${maxGpuLength}mm).`,
    educationalNote:
      ruleMeta?.explanation ||
      'Pastikan clearance kartu grafis tidak terhalang oleh kipas depan, radiator, atau sangkar drive hard disk.',
    remedy: isFit
      ? undefined
      : `Pilih kartu grafis dengan panjang maksimal ${maxGpuLength}mm ATAU ganti casing dengan ruang clearance GPU yang lebih luas.`,
  };
}

export function checkCoolerHeightRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const cooler = selectedComponents['cooler'];
  const pcCase = selectedComponents['case'];

  if (!cooler || !pcCase) return null;

  const coolerHeight = Number(cooler.specs.heightMM);
  const maxCoolerHeight = Number(pcCase.specs.maxCoolerHeightMM);
  const isFit = coolerHeight <= maxCoolerHeight;

  return {
    ruleId: 'R-COOL-02',
    ruleName: ruleMeta?.name || 'Tinggi Maksimal Pendingin CPU (Cooler Height)',
    severity: 'error',
    status: isFit ? 'pass' : 'fail',
    involved: ['cooler', 'case'],
    message: isFit
      ? `Tinggi pendingin CPU (${coolerHeight}mm) aman di dalam batas lebar casing (${maxCoolerHeight}mm).`
      : `Cooler Terlalu Tinggi: Ketinggian pendingin CPU ${coolerHeight}mm melebihi batas ruang samping casing (${maxCoolerHeight}mm).`,
    educationalNote:
      ruleMeta?.explanation ||
      'Tinggi tower cooler yang melebihi batas akan menyebabkan panel kaca atau penutup samping casing tidak bisa ditutup rapat.',
    remedy: isFit
      ? undefined
      : `Pilih pendingin CPU dengan tinggi di bawah ${maxCoolerHeight}mm ATAU gunakan pendingin AIO Liquid Cooler / casing yang lebih lebar.`,
  };
}
