import type { PcComponent, CheckResult, RuleMeta } from '../types';

export function checkCoolerSocketRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const cooler = selectedComponents['cooler'];
  const cpu = selectedComponents['cpu'];

  if (!cooler || !cpu) return null;

  const cpuSocket = cpu.specs.socket as string;
  const supportedSockets = (cooler.specs.socketSupport as string[]) || [];
  const isMatch = supportedSockets.includes(cpuSocket);

  return {
    ruleId: 'R-COOL-01',
    ruleName: ruleMeta?.name || 'Dukungan Socket Bracket Cooler CPU',
    severity: 'error',
    status: isMatch ? 'pass' : 'fail',
    involved: ['cooler', 'cpu'],
    message: isMatch
      ? `Bracket cooler mendukung socket CPU (${cpuSocket}).`
      : `Bracket Tidak Cocok: Cooler hanya mendukung socket [${supportedSockets.join(', ')}], sedangkan CPU menggunakan socket ${cpuSocket}.`,
    educationalNote:
      ruleMeta?.explanation ||
      'Pastikan pendingin prosesor menyertakan braket mounting yang sesuai dengan tipe soket motherboard dan prosesor Anda.',
    remedy: isMatch
      ? undefined
      : `Pilih pendingin CPU yang menyediakan braket mounting resmi untuk socket ${cpuSocket} (prosesor ${cpu.name}).`,
  };
}

export function checkCoolerTdpRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const cooler = selectedComponents['cooler'];
  const cpu = selectedComponents['cpu'];

  if (!cooler || !cpu) return null;

  const cpuTdp = Number(cpu.specs.tdp);
  const coolerTdp = Number(cooler.specs.tdpSupport);
  const isAdequate = coolerTdp >= cpuTdp;

  return {
    ruleId: 'R-COOL-03',
    ruleName: ruleMeta?.name || 'Kapasitas Disipasi Termal Cooler (TDP Rating)',
    severity: 'warning',
    status: isAdequate ? 'pass' : 'warn',
    involved: ['cooler', 'cpu'],
    message: isAdequate
      ? `Kapasitas pendinginan cooler (${coolerTdp}W) mencukupi TDP prosesor (${cpuTdp}W).`
      : `Peringatan Termal: Pendingin CPU berkapasitas ${coolerTdp}W berada di bawah TDP prosesor (${cpuTdp}W). Berisiko throttling suhu tinggi saat beban kerja penuh.`,
    educationalNote:
      ruleMeta?.explanation ||
      'Disarankan memilih pendingin dengan batas TDP lebih tinggi dari prosesor agar temperatur kerja tetap dingin dan senyap.',
    remedy: isAdequate
      ? undefined
      : `Tingkatkan pendingin CPU dengan kapasitas TDP minimal ${cpuTdp}W atau lebih tinggi agar suhu kerja prosesor tetap stabil.`,
  };
}
