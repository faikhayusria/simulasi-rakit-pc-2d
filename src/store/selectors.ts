import { CatalogLoader } from '@/infrastructure/catalog-loader';
import { calculateBudget } from '@/domain/budget';
import { evaluateAllRules, getCategoryStatusMap } from '@/domain/rules';
import { evaluateBuildScore } from '@/domain/scoring';
import type { BuildState } from './build-store';
import type { ComponentCategory, PcComponent } from '@/domain/types';

export const selectCurrentScenario = (state: BuildState) => {
  return (
    CatalogLoader.getScenarioById(state.currentScenarioId) ||
    CatalogLoader.getScenarios()[0]
  );
};

export const selectHydratedComponents = (
  state: BuildState
): Partial<Record<ComponentCategory, PcComponent>> => {
  const result: Partial<Record<ComponentCategory, PcComponent>> = {};
  for (const [cat, compId] of Object.entries(state.selectedComponents)) {
    if (compId) {
      const comp = CatalogLoader.getComponentById(compId);
      if (comp) result[cat as ComponentCategory] = comp;
    }
  }
  return result;
};

export const selectBudgetResult = (state: BuildState) => {
  const scenario = selectCurrentScenario(state);
  const hydrated = selectHydratedComponents(state);
  return calculateBudget(hydrated, scenario);
};

export const selectLiveRulesResult = (state: BuildState) => {
  const scenario = selectCurrentScenario(state);
  const hydrated = selectHydratedComponents(state);
  const rulesMeta = CatalogLoader.getRulesMeta();
  return evaluateAllRules(hydrated, scenario, rulesMeta, {
    strictSubmission: false,
  });
};

export const selectCategoryStatusMap = (state: BuildState) => {
  const liveResults = selectLiveRulesResult(state);
  return getCategoryStatusMap(liveResults);
};

export const selectBuildEvaluation = (state: BuildState) => {
  const hydrated = selectHydratedComponents(state);
  const scenario = selectCurrentScenario(state);
  const rulesMeta = CatalogLoader.getRulesMeta();
  const results = evaluateAllRules(hydrated, scenario, rulesMeta, {
    strictSubmission: true,
  });
  const budget = calculateBudget(hydrated, scenario);

  return evaluateBuildScore(
    results,
    budget,
    state.rationales,
    state.attempts.length
  );
};
