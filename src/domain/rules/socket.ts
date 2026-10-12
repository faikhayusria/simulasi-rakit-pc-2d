import type { PcComponent, CheckResult, RuleMeta } from '../types';

export function checkSocketRule(
  selectedComponents: Partial<Record<string, PcComponent>>,
  ruleMeta?: RuleMeta
): CheckResult | null {
  const cpu = selectedComponents['cpu'];
  const motherboard = selectedComponents['motherboard'];

  if (!cpu || !motherboard) {
    return null; // Not ready to evaluate yet
  }

  const cpuSocket = cpu.specs.socket;
  const mbSocket = motherboard.specs.socket;
  const isMatch = cpuSocket === mbSocket;

  return {
    ruleId: 'R-SOCKET-01',
    ruleName: ruleMeta?.name || 'Kesesuaian Socket CPU & Motherboard',
    severity: 'error',
    status: isMatch ? 'pass' : 'fail',
    involved: ['cpu', 'motherboard'],
    message: isMatch
      ? `Socket CPU (${cpuSocket}) cocok dengan socket motherboard (${mbSocket}).`
      : `Ketidakcocokan Socket: CPU menggunakan socket ${cpuSocket}, sedangkan Motherboard menggunakan socket ${mbSocket}.`,
    educationalNote:
      ruleMeta?.explanation ||
      'Socket CPU harus sama persis dengan socket pada motherboard agar pin prosesor dapat terpasang dengan tepat dan tidak bengkok/rusak.',
    remedy: isMatch
      ? undefined
      : `Ganti motherboard dengan yang bertipe socket ${cpuSocket} (agar sesuai prosesor ${cpu.name}), ATAU ganti prosesor dengan socket ${mbSocket} (agar sesuai motherboard ${motherboard.name}).`,
  };
}
