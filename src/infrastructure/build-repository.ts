import type { ComponentCategory, AttemptLog } from '@/domain/types';

export interface StoredBuildData {
  version: number;
  scenarioId: string;
  selected: Partial<Record<ComponentCategory, string>>; // category -> componentId
  rationale: Partial<Record<ComponentCategory, string>>; // category -> rationale text
  attempts: AttemptLog[];
  startedAt: string;
  submittedAt?: string;
  isSubmitted: boolean;
}

export interface BuildRepository {
  getBuild(scenarioId: string): StoredBuildData | null;
  saveBuild(data: StoredBuildData): void;
  clearBuild(scenarioId: string): void;
  getAllBuilds(): Record<string, StoredBuildData>;
}
