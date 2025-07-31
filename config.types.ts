// Types pour la configuration générale
export interface GeneralConfig {
  appName: string;
  version: string;
  language: string;
  timezone: string;
  refreshInterval: number;
  apiTimeout: number;
  enableNotifications: boolean;
  enableAutoSave: boolean;
  enableDebugMode: boolean;
  maxHistoryDays: number;
  cacheSize: number;
  theme: string;
}

// Types pour les indicateurs
export interface IndicatorThreshold {
  low: number;
  high: number;
}

export interface Indicator {
  id: string;
  name: string;
  description: string;
  weight: number;
  enabled: boolean;
  threshold: IndicatorThreshold;
  source: string;
  updateFrequency: string;
  color: string;
}

// Types pour les formules
export interface Formula {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: string[];
  enabled: boolean;
  testValue?: number;
  lastResult?: number;
}

// Types pour les régimes
export interface RegimeThresholds {
  confidence: { min: number; max: number };
  growth: { min: number; max: number };
  inflation: { min: number; max: number };
}

export interface RegimeCharacteristics {
  growth: string;
  inflation: string;
  volatility: string;
  duration: string;
}

export interface RegimeAllocations {
  stocks: number;
  bonds: number;
  commodities: number;
  cash: number;
}

export interface RegimeConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  thresholds: RegimeThresholds;
  characteristics: RegimeCharacteristics;
  allocations: RegimeAllocations;
  enabled: boolean;
}

// Types pour les plugins
export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  installed: boolean;
  category: string;
  size: string;
  lastUpdate: string;
  dependencies: string[];
  permissions: string[];
  config?: Record<string, any>;
}

// Type pour la configuration complète
export interface OracleConfig {
  general: GeneralConfig;
  indicators: Indicator[];
  formulas: Formula[];
  regimes: RegimeConfig[];
  plugins: Plugin[];
  exportDate?: string;
  version?: string;
}

// Types pour les hooks de configuration
export interface ConfigHookResult<T> {
  config: T;
  loading: boolean;
  error: string | null;
  updateConfig: (newConfig: Partial<T>) => void;
  resetConfig: () => void;
  saveConfig: () => void;
}

// Types pour les événements de configuration
export interface ConfigChangeEvent {
  type: 'general' | 'indicators' | 'formulas' | 'regimes' | 'plugins';
  action: 'update' | 'reset' | 'save';
  data?: any;
  timestamp: string;
}

// Types pour la validation de configuration
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Types pour l'export/import de configuration
export interface ConfigExportOptions {
  includeGeneral: boolean;
  includeIndicators: boolean;
  includeFormulas: boolean;
  includeRegimes: boolean;
  includePlugins: boolean;
  format: 'json' | 'yaml';
}

export interface ConfigImportResult {
  success: boolean;
  imported: string[];
  skipped: string[];
  errors: string[];
}

