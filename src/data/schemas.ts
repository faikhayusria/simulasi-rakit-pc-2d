import { z } from 'zod';

export const ComponentCategorySchema = z.enum([
  'cpu',
  'motherboard',
  'ram',
  'gpu',
  'storage',
  'psu',
  'case',
  'cooler',
]);

export const PcComponentSchema = z.object({
  id: z.string(),
  category: ComponentCategorySchema,
  name: z.string(),
  brand: z.string(),
  price: z.number().positive(),
  illustration: z.string(),
  shortDescription: z.string(),
  specs: z.record(z.any()),
});

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  brief: z.string(),
  budget: z.number().positive(),
  difficulty: z.enum(['Pemula', 'Menengah', 'Tantangan']),
  targetAudience: z.string(),
  requiredCategories: z.array(ComponentCategorySchema),
  performanceHints: z.object({
    minRamGB: z.number().optional(),
    needsDedicatedGpu: z.boolean().optional(),
    minStorageGB: z.number().optional(),
    targetResolution: z.string().optional(),
    description: z.string().optional(),
  }),
  learningObjectives: z.array(z.string()),
});

export const RuleMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: z.enum(['error', 'warning']),
  description: z.string(),
  explanation: z.string(),
  affectedCategories: z.array(ComponentCategorySchema),
});

export const ComponentsCatalogSchema = z.array(PcComponentSchema);
export const ScenariosListSchema = z.array(ScenarioSchema);
export const RulesMetaListSchema = z.array(RuleMetaSchema);
