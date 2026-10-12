export type ComponentCategory =
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler';

export interface CpuSpecs {
  socket: string; // e.g. 'AM-X', 'LGA-Z'
  tdp: number; // in Watts
  cores: number;
  threads: number;
  baseClockGhz: number;
  hasIntegratedGpu: boolean;
}

export interface MotherboardSpecs {
  socket: string; // e.g. 'AM-X', 'LGA-Z'
  ramType: 'DDR4' | 'DDR5';
  ramSlots: number;
  formFactor: 'ATX' | 'mATX' | 'Mini-ITX';
  m2Slots: number;
  sataPorts: number;
  pcieGen: number;
}

export interface RamSpecs {
  type: 'DDR4' | 'DDR5';
  capacityGB: number;
  speedMhz: number;
  modulesCount: number; // e.g. 1x16GB or 2x8GB
}

export interface GpuSpecs {
  lengthMM: number;
  tdp: number; // in Watts
  vramGB: number;
  powerConnector: 'none' | '6pin' | '8pin' | '12pin';
  minPsuWattage: number;
}

export interface StorageSpecs {
  interface: 'M.2 NVMe' | 'SATA 2.5';
  capacityGB: number;
  readSpeedMBs: number;
}

export interface PsuSpecs {
  wattage: number;
  efficiencyRating: '80+ White' | '80+ Bronze' | '80+ Gold';
  pcieConnectors: ('6pin' | '8pin' | '12pin')[];
  formFactor: 'ATX' | 'SFX';
}

export interface CaseSpecs {
  supportedFormFactors: ('ATX' | 'mATX' | 'Mini-ITX')[];
  maxGpuLengthMM: number;
  maxCoolerHeightMM: number;
  includedFans: number;
}

export interface CoolerSpecs {
  socketSupport: string[]; // e.g. ['AM-X', 'LGA-Z']
  heightMM: number;
  tdpSupport: number; // Watts of heat dissipation
  coolerType: 'Air Cooler' | 'AIO Liquid 240';
}

export type AnyComponentSpecs =
  | CpuSpecs
  | MotherboardSpecs
  | RamSpecs
  | GpuSpecs
  | StorageSpecs
  | PsuSpecs
  | CaseSpecs
  | CoolerSpecs
  | Record<string, string | number | boolean | string[]>;

export interface PcComponent {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  price: number; // in Indonesian Rupiah (IDR)
  illustration: string;
  shortDescription: string;
  specs: Record<string, any>;
}

export interface Scenario {
  id: string;
  title: string;
  brief: string;
  budget: number;
  difficulty: 'Pemula' | 'Menengah' | 'Tantangan';
  targetAudience: string;
  requiredCategories: ComponentCategory[];
  performanceHints: {
    minRamGB?: number;
    needsDedicatedGpu?: boolean;
    minStorageGB?: number;
    targetResolution?: string;
    description?: string;
  };
  learningObjectives: string[];
}

export interface RuleMeta {
  id: string;
  name: string;
  severity: 'error' | 'warning';
  description: string; // Deskripsi teknis
  explanation: string; // Penjelasan edukatif untuk siswa/ahli
  affectedCategories: ComponentCategory[];
}

export interface CheckResult {
  ruleId: string;
  ruleName: string;
  severity: 'error' | 'warning';
  status: 'pass' | 'fail' | 'warn';
  involved: ComponentCategory[];
  message: string;
  educationalNote: string;
  remedy?: string;
}

export interface BudgetResult {
  total: number;
  budget: number;
  remaining: number;
  status: 'within' | 'over';
  percentage: number;
}

export interface AttemptLog {
  attemptNumber: number;
  timestamp: string;
  passed: boolean;
  totalCost: number;
  errorCount: number;
  warningCount: number;
  componentsSummary?: { category: string; name: string; price: number }[];
  issues: {
    ruleId: string;
    ruleName: string;
    severity: 'error' | 'warning';
    message: string;
    educationalNote?: string;
    remedy?: string;
  }[];
}

export interface BuildEvaluation {
  isCompatible: boolean;
  isWithinBudget: boolean;
  score: number; // 0 - 100
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
  }[];
  verdict: string;
}
