import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ComponentCategory,
  AttemptLog,
  CheckResult,
} from '@/domain/types';
import { CatalogLoader } from '@/infrastructure/catalog-loader';
import { evaluateAllRules } from '@/domain/rules';
import { calculateBudget } from '@/domain/budget';

export interface BuildState {
  currentScenarioId: string;
  selectedComponents: Partial<Record<ComponentCategory, string>>; // category -> componentId
  rationales: Partial<Record<ComponentCategory, string>>; // category -> string
  attempts: AttemptLog[];
  lastCheckResults: CheckResult[] | null;
  isSubmitted: boolean;
  hasCheckedAtLeastOnce: boolean;
  activeFilterCategory: string; // for palette UI: 'all' | category

  // Actions
  setScenario: (scenarioId: string) => void;
  selectComponent: (category: ComponentCategory, componentId: string) => void;
  removeComponent: (category: ComponentCategory) => void;
  setRationale: (category: ComponentCategory, text: string) => void;
  setFilterCategory: (category: string) => void;
  runFullCheck: () => CheckResult[];
  submitBuild: () => boolean;
  resetCurrentBuild: () => void;
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      currentScenarioId: 'scenario-office-student',
      selectedComponents: {},
      rationales: {},
      attempts: [],
      lastCheckResults: null,
      isSubmitted: false,
      hasCheckedAtLeastOnce: false,
      activeFilterCategory: 'all',

      setScenario: (scenarioId: string) => {
        // If changing scenario, change scenario id. Keep previous build in localStorage
        set({
          currentScenarioId: scenarioId,
          lastCheckResults: null,
          isSubmitted: false,
        });
      },

      selectComponent: (category: ComponentCategory, componentId: string) => {
        set((state) => ({
          selectedComponents: {
            ...state.selectedComponents,
            [category]: componentId,
          },
          isSubmitted: false, // Invalidate previous submit if modified
        }));
      },

      removeComponent: (category: ComponentCategory) => {
        set((state) => {
          const next = { ...state.selectedComponents };
          delete next[category];
          return {
            selectedComponents: next,
            isSubmitted: false,
          };
        });
      },

      setRationale: (category: ComponentCategory, text: string) => {
        set((state) => ({
          rationales: {
            ...state.rationales,
            [category]: text,
          },
        }));
      },

      setFilterCategory: (category: string) => {
        set({ activeFilterCategory: category });
      },

      runFullCheck: () => {
        const state = get();
        const scenario = CatalogLoader.getScenarioById(state.currentScenarioId);
        const rulesMeta = CatalogLoader.getRulesMeta();

        // Hydrate component objects
        const hydrated: Partial<Record<ComponentCategory, any>> = {};
        for (const [cat, compId] of Object.entries(state.selectedComponents)) {
          if (compId) {
            hydrated[cat as ComponentCategory] = CatalogLoader.getComponentById(compId);
          }
        }

        const results = evaluateAllRules(hydrated, scenario, rulesMeta, {
          strictSubmission: true,
        });

        const budget = calculateBudget(hydrated, scenario);
        const errorCount = results.filter((r) => r.status === 'fail').length;
        const warningCount = results.filter((r) => r.status === 'warn').length;
        const passed = errorCount === 0 && budget.status === 'within';

        const componentsSummary = Object.entries(hydrated)
          .filter(([_, comp]) => !!comp)
          .map(([cat, comp]) => ({
            category: cat,
            name: comp.name,
            price: comp.price,
          }));

        const newAttempt: AttemptLog = {
          attemptNumber: state.attempts.length + 1,
          timestamp: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          passed,
          totalCost: budget.total,
          errorCount,
          warningCount,
          componentsSummary,
          issues: results
            .filter((r) => r.status !== 'pass')
            .map((r) => ({
              ruleId: r.ruleId,
              ruleName: r.ruleName,
              severity: r.severity,
              message: r.message,
              educationalNote: r.educationalNote,
              remedy: r.remedy,
            })),
        };

        set((prevState) => ({
          lastCheckResults: results,
          hasCheckedAtLeastOnce: true,
          attempts: [newAttempt, ...prevState.attempts],
        }));

        return results;
      },

      submitBuild: () => {
        const results = get().runFullCheck();
        const hasErrors = results.some((r) => r.status === 'fail');
        if (!hasErrors) {
          set({ isSubmitted: true });
          return true;
        }
        return false;
      },

      resetCurrentBuild: () => {
        set({
          selectedComponents: {},
          rationales: {},
          lastCheckResults: null,
          isSubmitted: false,
          hasCheckedAtLeastOnce: false,
        });
      },
    }),
    {
      name: 'rakitpc_app_state_v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Future migration logic if needed
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);
