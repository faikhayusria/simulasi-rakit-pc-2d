import rawComponents from '@/data/components.json';
import rawScenarios from '@/data/scenarios.json';
import rawRulesMeta from '@/data/rules.meta.json';
import {
  ComponentsCatalogSchema,
  ScenariosListSchema,
  RulesMetaListSchema,
} from '@/data/schemas';
import type { PcComponent, Scenario, RuleMeta } from '@/domain/types';

export class CatalogLoader {
  private static cachedComponents: PcComponent[] | null = null;
  private static cachedScenarios: Scenario[] | null = null;
  private static cachedRulesMeta: RuleMeta[] | null = null;

  public static getComponents(): PcComponent[] {
    if (!this.cachedComponents) {
      const parsed = ComponentsCatalogSchema.safeParse(rawComponents);
      if (!parsed.success) {
        console.error('Validation error in components.json:', parsed.error);
        throw new Error(`Data komponen tidak valid: ${parsed.error.message}`);
      }
      this.cachedComponents = parsed.data as unknown as PcComponent[];
    }
    return this.cachedComponents;
  }

  public static getScenarios(): Scenario[] {
    if (!this.cachedScenarios) {
      const parsed = ScenariosListSchema.safeParse(rawScenarios);
      if (!parsed.success) {
        console.error('Validation error in scenarios.json:', parsed.error);
        throw new Error(`Data skenario tidak valid: ${parsed.error.message}`);
      }
      this.cachedScenarios = parsed.data as unknown as Scenario[];
    }
    return this.cachedScenarios;
  }

  public static getRulesMeta(): RuleMeta[] {
    if (!this.cachedRulesMeta) {
      const parsed = RulesMetaListSchema.safeParse(rawRulesMeta);
      if (!parsed.success) {
        console.error('Validation error in rules.meta.json:', parsed.error);
        throw new Error(`Data rules metadata tidak valid: ${parsed.error.message}`);
      }
      this.cachedRulesMeta = parsed.data as unknown as RuleMeta[];
    }
    return this.cachedRulesMeta;
  }

  public static getRuleMetaById(id: string): RuleMeta | undefined {
    return this.getRulesMeta().find((r) => r.id === id);
  }

  public static getComponentById(id: string): PcComponent | undefined {
    return this.getComponents().find((c) => c.id === id);
  }

  public static getScenarioById(id: string): Scenario | undefined {
    return this.getScenarios().find((s) => s.id === id);
  }
}
