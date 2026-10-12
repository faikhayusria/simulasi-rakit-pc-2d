import type { BuildRepository, StoredBuildData } from './build-repository';

const STORAGE_PREFIX = 'rakitpc_build_';

export class LocalStorageRepository implements BuildRepository {
  getBuild(scenarioId: string): StoredBuildData | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${scenarioId}`);
      if (!raw) return null;
      return JSON.parse(raw) as StoredBuildData;
    } catch (err) {
      console.error('Failed to read from localStorage:', err);
      return null;
    }
  }

  saveBuild(data: StoredBuildData): void {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${data.scenarioId}`,
        JSON.stringify(data)
      );
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }

  clearBuild(scenarioId: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${scenarioId}`);
    } catch (err) {
      console.error('Failed to clear from localStorage:', err);
    }
  }

  getAllBuilds(): Record<string, StoredBuildData> {
    const results: Record<string, StoredBuildData> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const scenarioId = key.replace(STORAGE_PREFIX, '');
          const val = this.getBuild(scenarioId);
          if (val) results[scenarioId] = val;
        }
      }
    } catch (err) {
      console.error('Failed to scan localStorage:', err);
    }
    return results;
  }
}

export const defaultBuildRepository = new LocalStorageRepository();
