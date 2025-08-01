import { useState, useEffect, useCallback } from 'react';
import { 
  GeneralConfig, 
  Indicator, 
  Formula, 
  RegimeConfig, 
  Plugin,
  OracleConfig,
  ConfigHookResult 
} from '@/lib/types/config.types';

// Configuration par défaut
const DEFAULT_GENERAL_CONFIG: GeneralConfig = {
  appName: 'Oracle Portfolio',
  version: '4.1.0',
  language: 'fr',
  timezone: 'Europe/Paris',
  refreshInterval: 30,
  apiTimeout: 10,
  enableNotifications: true,
  enableAutoSave: true,
  enableDebugMode: false,
  maxHistoryDays: 30,
  cacheSize: 100,
  theme: 'dark'
};

// Hook pour la configuration générale
export function useGeneralConfig(): ConfigHookResult<GeneralConfig> {
  const [config, setConfig] = useState<GeneralConfig>(DEFAULT_GENERAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oracle-general-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig({ ...DEFAULT_GENERAL_CONFIG, ...parsed });
      }
    } catch (err) {
      setError('Erreur lors du chargement de la configuration générale');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<GeneralConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_GENERAL_CONFIG);
    localStorage.removeItem('oracle-general-config');
  }, []);

  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem('oracle-general-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  }, [config]);

  return { config, loading, error, updateConfig, resetConfig, saveConfig };
}

// Hook pour les indicateurs
export function useIndicatorsConfig(): ConfigHookResult<Indicator[]> {
  const [config, setConfig] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oracle-indicators-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      }
    } catch (err) {
      setError('Erreur lors du chargement des indicateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<Indicator[]>) => {
    setConfig(prev => {
      // Si newConfig est un array partiel, on le merge avec l'existant
      if (Array.isArray(newConfig)) {
        return [...prev, ...newConfig.filter(Boolean)];
      }
      // Si c'est un objet avec des indices, on met à jour les éléments correspondants
      const updated = [...prev];
      Object.entries(newConfig).forEach(([index, value]) => {
        if (value && !isNaN(Number(index))) {
          updated[Number(index)] = value;
        }
      });
      return updated;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig([]);
    localStorage.removeItem('oracle-indicators-config');
  }, []);

  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem('oracle-indicators-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  }, [config]);

  return { config, loading, error, updateConfig, resetConfig, saveConfig };
}

// Hook pour les formules
export function useFormulasConfig(): ConfigHookResult<Formula[]> {
  const [config, setConfig] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oracle-formulas-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      }
    } catch (err) {
      setError('Erreur lors du chargement des formules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<Formula[]>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig([]);
    localStorage.removeItem('oracle-formulas-config');
  }, []);

  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem('oracle-formulas-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  }, [config]);

  return { config, loading, error, updateConfig, resetConfig, saveConfig };
}

// Hook pour les régimes
export function useRegimesConfig(): ConfigHookResult<RegimeConfig[]> {
  const [config, setConfig] = useState<RegimeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oracle-regimes-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      }
    } catch (err) {
      setError('Erreur lors du chargement des régimes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<RegimeConfig[]>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig([]);
    localStorage.removeItem('oracle-regimes-config');
  }, []);

  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem('oracle-regimes-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  }, [config]);

  return { config, loading, error, updateConfig, resetConfig, saveConfig };
}

// Hook pour les plugins
export function usePluginsConfig(): ConfigHookResult<Plugin[]> {
  const [config, setConfig] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oracle-plugins-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      }
    } catch (err) {
      setError('Erreur lors du chargement des plugins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<Plugin[]>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig([]);
    localStorage.removeItem('oracle-plugins-config');
  }, []);

  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem('oracle-plugins-config', JSON.stringify(config));
      setError(null);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  }, [config]);

  return { config, loading, error, updateConfig, resetConfig, saveConfig };
}

// Hook principal pour toute la configuration
export function useOracleConfig() {
  const general = useGeneralConfig();
  const indicators = useIndicatorsConfig();
  const formulas = useFormulasConfig();
  const regimes = useRegimesConfig();
  const plugins = usePluginsConfig();

  const loading = general.loading || indicators.loading || formulas.loading || regimes.loading || plugins.loading;
  const error = general.error || indicators.error || formulas.error || regimes.error || plugins.error;

  const exportConfig = useCallback((): OracleConfig => {
    return {
      general: general.config,
      indicators: indicators.config,
      formulas: formulas.config,
      regimes: regimes.config,
      plugins: plugins.config,
      exportDate: new Date().toISOString(),
      version: '4.1.0'
    };
  }, [general.config, indicators.config, formulas.config, regimes.config, plugins.config]);

  const importConfig = useCallback((config: OracleConfig) => {
    if (config.general) {
      general.updateConfig(config.general);
      general.saveConfig();
    }
    if (config.indicators) {
      indicators.updateConfig(config.indicators);
      indicators.saveConfig();
    }
    if (config.formulas) {
      formulas.updateConfig(config.formulas);
      formulas.saveConfig();
    }
    if (config.regimes) {
      regimes.updateConfig(config.regimes);
      regimes.saveConfig();
    }
    if (config.plugins) {
      plugins.updateConfig(config.plugins);
      plugins.saveConfig();
    }
  }, [general, indicators, formulas, regimes, plugins]);

  const resetAllConfig = useCallback(() => {
    general.resetConfig();
    indicators.resetConfig();
    formulas.resetConfig();
    regimes.resetConfig();
    plugins.resetConfig();
  }, [general, indicators, formulas, regimes, plugins]);

  const saveAllConfig = useCallback(() => {
    general.saveConfig();
    indicators.saveConfig();
    formulas.saveConfig();
    regimes.saveConfig();
    plugins.saveConfig();
  }, [general, indicators, formulas, regimes, plugins]);

  return {
    general,
    indicators,
    formulas,
    regimes,
    plugins,
    loading,
    error,
    exportConfig,
    importConfig,
    resetAllConfig,
    saveAllConfig
  };
}

