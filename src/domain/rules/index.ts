import type {
  PcComponent,
  Scenario,
  CheckResult,
  RuleMeta,
  ComponentCategory,
} from '../types';
import { checkSocketRule } from './socket';
import { checkMemoryRule } from './memory';
import {
  checkFormFactorRule,
  checkGpuLengthRule,
  checkCoolerHeightRule,
} from './physical-fit';
import { checkCoolerSocketRule, checkCoolerTdpRule } from './cooling';
import { checkPsuWattageRule, checkPsuPcieConnectorsRule } from './power';
import { checkStorageRule } from './storage';
import { checkCompletenessRule } from './completeness';
import { checkScenarioFitRule } from './scenario-fit';
import { calculateBudget, checkBudgetRule } from '../budget';

export interface EvaluateOptions {
  strictSubmission?: boolean;
}

export function evaluateAllRules(
  selectedComponents: Partial<Record<ComponentCategory, PcComponent>>,
  scenario?: Scenario,
  rulesMetaList: RuleMeta[] = [],
  options: EvaluateOptions = {}
): CheckResult[] {
  const getMeta = (id: string) => rulesMetaList.find((r) => r.id === id);
  const results: CheckResult[] = [];

  // 1. Socket rule
  const socketRes = checkSocketRule(selectedComponents, getMeta('R-SOCKET-01'));
  if (socketRes) results.push(socketRes);

  // 2. Memory rule
  const memoryRes = checkMemoryRule(selectedComponents, getMeta('R-RAM-01'));
  if (memoryRes) results.push(memoryRes);

  // 3. Physical fit rules
  const formRes = checkFormFactorRule(selectedComponents, getMeta('R-FORM-01'));
  if (formRes) results.push(formRes);

  const gpuLenRes = checkGpuLengthRule(selectedComponents, getMeta('R-GPU-01'));
  if (gpuLenRes) results.push(gpuLenRes);

  const coolHgtRes = checkCoolerHeightRule(selectedComponents, getMeta('R-COOL-02'));
  if (coolHgtRes) results.push(coolHgtRes);

  // 4. Cooling rules
  const coolSockRes = checkCoolerSocketRule(selectedComponents, getMeta('R-COOL-01'));
  if (coolSockRes) results.push(coolSockRes);

  const coolTdpRes = checkCoolerTdpRule(selectedComponents, getMeta('R-COOL-03'));
  if (coolTdpRes) results.push(coolTdpRes);

  // 5. Power rules
  const psuWattRes = checkPsuWattageRule(selectedComponents, getMeta('R-PSU-01'));
  if (psuWattRes) results.push(psuWattRes);

  const psuPcieRes = checkPsuPcieConnectorsRule(selectedComponents, getMeta('R-PSU-02'));
  if (psuPcieRes) results.push(psuPcieRes);

  // 6. Storage rule
  const storageRes = checkStorageRule(selectedComponents, getMeta('R-STOR-01'));
  if (storageRes) results.push(storageRes);

  // 7. Scenario fit rule
  const scenRes = checkScenarioFitRule(selectedComponents, scenario, getMeta('R-SCEN-01'));
  if (scenRes) results.push(scenRes);

  // 8. Completeness (always check, critical on submit)
  const compRes = checkCompletenessRule(
    selectedComponents,
    scenario?.requiredCategories,
    getMeta('R-COMP-01')
  );
  if (options.strictSubmission || compRes.status === 'fail') {
    results.push(compRes);
  }

  // 9. Budget rule
  if (scenario) {
    const budgetCalc = calculateBudget(selectedComponents, scenario);
    const budRes = checkBudgetRule(budgetCalc, getMeta('R-BUD-01'));
    if (options.strictSubmission || budRes.status === 'fail') {
      results.push(budRes);
    }
  }

  return results;
}

/**
 * Returns a lightweight map of affected category -> status for real-time visual hints
 */
export function getCategoryStatusMap(
  results: CheckResult[]
): Record<ComponentCategory, 'pass' | 'warn' | 'fail' | 'neutral'> {
  const map: Record<ComponentCategory, 'pass' | 'warn' | 'fail' | 'neutral'> = {
    cpu: 'neutral',
    motherboard: 'neutral',
    ram: 'neutral',
    gpu: 'neutral',
    storage: 'neutral',
    psu: 'neutral',
    case: 'neutral',
    cooler: 'neutral',
  };

  // Filter out completeness or overall budget from individual slot coloring unless specifically needed
  const componentRules = results.filter(
    (r) => r.ruleId !== 'R-COMP-01' && r.ruleId !== 'R-BUD-01'
  );

  for (const r of componentRules) {
    for (const cat of r.involved) {
      if (r.status === 'fail') {
        map[cat] = 'fail';
      } else if (r.status === 'warn' && map[cat] !== 'fail') {
        map[cat] = 'warn';
      } else if (r.status === 'pass' && map[cat] === 'neutral') {
        map[cat] = 'pass';
      }
    }
  }

  return map;
}
