import { describe, it, expect } from 'vitest';
import { CatalogLoader } from '@/infrastructure/catalog-loader';
import { evaluateAllRules } from '../rules';
import { calculateBudget } from '../budget';
import type { ComponentCategory, PcComponent } from '../types';

describe('Domain Rules Engine Unit Tests', () => {
  const components = CatalogLoader.getComponents();
  const scenarios = CatalogLoader.getScenarios();
  const rulesMeta = CatalogLoader.getRulesMeta();

  const getComp = (id: string) => {
    const c = components.find((item) => item.id === id);
    if (!c) throw new Error(`Component ${id} not found`);
    return c;
  };

  it('R-SOCKET-01: harus lolos jika CPU dan Motherboard bersoket sama', () => {
    const selected: Partial<Record<ComponentCategory, PcComponent>> = {
      cpu: getComp('cpu-zenith-3'), // AM-X
      motherboard: getComp('mb-zenith-b550'), // AM-X
    };
    const results = evaluateAllRules(selected, undefined, rulesMeta);
    const socketRes = results.find((r) => r.ruleId === 'R-SOCKET-01');
    expect(socketRes).toBeDefined();
    expect(socketRes?.status).toBe('pass');
  });

  it('R-SOCKET-01: harus gagal jika CPU dan Motherboard beda soket', () => {
    const selected: Partial<Record<ComponentCategory, PcComponent>> = {
      cpu: getComp('cpu-aurora-7'), // LGA-Z
      motherboard: getComp('mb-zenith-b550'), // AM-X
    };
    const results = evaluateAllRules(selected, undefined, rulesMeta);
    const socketRes = results.find((r) => r.ruleId === 'R-SOCKET-01');
    expect(socketRes).toBeDefined();
    expect(socketRes?.status).toBe('fail');
  });

  it('R-RAM-01: harus gagal jika RAM DDR5 dipasang di motherboard DDR4', () => {
    const selected: Partial<Record<ComponentCategory, PcComponent>> = {
      ram: getComp('ram-corsair-ddr5-32'), // DDR5
      motherboard: getComp('mb-zenith-b550'), // DDR4
    };
    const results = evaluateAllRules(selected, undefined, rulesMeta);
    const ramRes = results.find((r) => r.ruleId === 'R-RAM-01');
    expect(ramRes).toBeDefined();
    expect(ramRes?.status).toBe('fail');
  });

  it('R-FORM-01: harus gagal jika motherboard ATX dipasang di casing mATX', () => {
    const selected: Partial<Record<ComponentCategory, PcComponent>> = {
      motherboard: getComp('mb-titan-z790'), // ATX
      case: getComp('case-nexus-compact'), // mATX only
    };
    const results = evaluateAllRules(selected, undefined, rulesMeta);
    const formRes = results.find((r) => r.ruleId === 'R-FORM-01');
    expect(formRes).toBeDefined();
    expect(formRes?.status).toBe('fail');
  });

  it('R-GPU-01: harus gagal jika panjang GPU melebihi batas casing', () => {
    const selected: Partial<Record<ComponentCategory, PcComponent>> = {
      gpu: getComp('gpu-phantom-rtx4070'), // 325mm
      case: getComp('case-nexus-compact'), // max 290mm
    };
    const results = evaluateAllRules(selected, undefined, rulesMeta);
    const gpuRes = results.find((r) => r.ruleId === 'R-GPU-01');
    expect(gpuRes).toBeDefined();
    expect(gpuRes?.status).toBe('fail');
  });

  it('R-PSU-02: harus gagal jika kabel konektor GPU tidak ada di PSU', () => {
    const selected: Partial<Record<ComponentCategory, PcComponent>> = {
      gpu: getComp('gpu-phantom-rtx4070'), // 12pin
      psu: getComp('psu-volt-500w'), // 8pin only
    };
    const results = evaluateAllRules(selected, undefined, rulesMeta);
    const psuPcieRes = results.find((r) => r.ruleId === 'R-PSU-02');
    expect(psuPcieRes).toBeDefined();
    expect(psuPcieRes?.status).toBe('fail');
  });

  it('Verifikasi integritas: setiap skenario wajib memiliki minimal 1 solusi rakitan valid', () => {
    for (const scenario of scenarios) {
      let foundValid = false;

      // Filter by category
      const cpus = components.filter((c) => c.category === 'cpu');
      const mbs = components.filter((c) => c.category === 'motherboard');
      const rams = components.filter((c) => c.category === 'ram');
      const gpus = components.filter((c) => c.category === 'gpu');
      const storages = components.filter((c) => c.category === 'storage');
      const psus = components.filter((c) => c.category === 'psu');
      const cases = components.filter((c) => c.category === 'case');
      const coolers = components.filter((c) => c.category === 'cooler');

      // Test combinations
      for (const cpu of cpus) {
        for (const mb of mbs) {
          for (const ram of rams) {
            for (const gpu of gpus) {
              for (const storage of storages) {
                for (const psu of psus) {
                  for (const pcCase of cases) {
                    for (const cooler of coolers) {
                      const build: Record<ComponentCategory, PcComponent> = {
                        cpu,
                        motherboard: mb,
                        ram,
                        gpu,
                        storage,
                        psu,
                        case: pcCase,
                        cooler,
                      };

                      const results = evaluateAllRules(
                        build,
                        scenario,
                        rulesMeta,
                        { strictSubmission: true }
                      );
                      const budgetCalc = calculateBudget(build, scenario);
                      const hasErrors = results.some((r) => r.status === 'fail');

                      if (!hasErrors && budgetCalc.status === 'within') {
                        foundValid = true;
                        break;
                      }
                    }
                    if (foundValid) break;
                  }
                  if (foundValid) break;
                }
                if (foundValid) break;
              }
              if (foundValid) break;
            }
            if (foundValid) break;
          }
          if (foundValid) break;
        }
        if (foundValid) break;
      }

      expect(
        foundValid,
        `Skenario "${scenario.title}" harus memiliki setidaknya satu kombinasi yang 100% lulus dan dalam anggaran`
      ).toBe(true);
    }
  });
});
