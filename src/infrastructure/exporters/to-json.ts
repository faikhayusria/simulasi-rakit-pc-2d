import type { Scenario, PcComponent, AttemptLog, BuildEvaluation } from '@/domain/types';

export interface ExportDataPayload {
  exportDate: string;
  scenario: Scenario;
  selectedComponents: Partial<Record<string, PcComponent>>;
  rationale: Partial<Record<string, string>>;
  budget: {
    total: number;
    budget: number;
    remaining: number;
  };
  attempts: AttemptLog[];
  evaluation: BuildEvaluation;
}

export function exportToJson(data: ExportDataPayload, filename?: string) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute(
    'download',
    filename || `RakitPC2D_${data.scenario.id}_${Date.now()}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
