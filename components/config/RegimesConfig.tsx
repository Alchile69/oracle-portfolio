import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  AlertTriangle,
  Save,
  RotateCcw,
  CheckCircle,
  Settings
} from 'lucide-react';

interface RegimesConfigProps {
  onChange?: () => void;
}

interface RegimeConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  thresholds: {
    confidence: { min: number; max: number };
    growth: { min: number; max: number };
    inflation: { min: number; max: number };
  };
  characteristics: {
    growth: string;
    inflation: string;
    volatility: string;
    duration: string;
  };
  allocations: {
    stocks: number;
    bonds: number;
    commodities: number;
    cash: number;
  };
  enabled: boolean;
}

const DEFAULT_REGIMES: RegimeConfig[] = [
  {
    id: 'expansion',
    name: 'Expansion',
    description: 'Croissance économique forte avec inflation modérée',
    icon: TrendingUp,
    color: '#10B981',
    thresholds: {
      confidence: { min: 70, max: 100 },
      growth: { min: 2.5, max: 10 },
      inflation: { min: 1, max: 3 }
    },
    characteristics: {
      growth: 'Forte croissance du PIB',
      inflation: 'Inflation modérée et stable',
      volatility: 'Volatilité faible à modérée',
      duration: '2-5 ans typiquement'
    },
    allocations: {
      stocks: 70,
      bonds: 20,
      commodities: 5,
      cash: 5
    },
    enabled: true
  },
  {
    id: 'recovery',
    name: 'Récupération',
    description: 'Sortie de récession avec reprise progressive',
    icon: BarChart,
    color: '#3B82F6',
    thresholds: {
      confidence: { min: 40, max: 70 },
      growth: { min: 0, max: 2.5 },
      inflation: { min: 0, max: 2 }
    },
    characteristics: {
      growth: 'Croissance progressive',
      inflation: 'Inflation faible',
      volatility: 'Volatilité modérée',
      duration: '6 mois - 2 ans'
    },
    allocations: {
      stocks: 60,
      bonds: 30,
      commodities: 5,
      cash: 5
    },
    enabled: true
  },
  {
    id: 'stagflation',
    name: 'Stagflation',
    description: 'Croissance faible avec inflation élevée',
    icon: AlertTriangle,
    color: '#F59E0B',
    thresholds: {
      confidence: { min: 20, max: 40 },
      growth: { min: -1, max: 1 },
      inflation: { min: 3, max: 10 }
    },
    characteristics: {
      growth: 'Croissance stagnante',
      inflation: 'Inflation élevée',
      volatility: 'Volatilité élevée',
      duration: '1-3 ans'
    },
    allocations: {
      stocks: 40,
      bonds: 20,
      commodities: 30,
      cash: 10
    },
    enabled: true
  },
  {
    id: 'recession',
    name: 'Récession',
    description: 'Contraction économique avec déflation possible',
    icon: TrendingDown,
    color: '#EF4444',
    thresholds: {
      confidence: { min: 0, max: 20 },
      growth: { min: -10, max: 0 },
      inflation: { min: -2, max: 1 }
    },
    characteristics: {
      growth: 'Contraction du PIB',
      inflation: 'Déflation ou inflation très faible',
      volatility: 'Volatilité très élevée',
      duration: '6 mois - 2 ans'
    },
    allocations: {
      stocks: 20,
      bonds: 50,
      commodities: 10,
      cash: 20
    },
    enabled: true
  }
];

export default function RegimesConfig({ onChange }: RegimesConfigProps) {
  const [regimes, setRegimes] = useState<RegimeConfig[]>(DEFAULT_REGIMES);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedRegime, setSelectedRegime] = useState<string>('expansion');

  useEffect(() => {
    // Charger les régimes depuis localStorage
    const savedRegimes = localStorage.getItem('oracle-regimes-config');
    if (savedRegimes) {
      try {
        const parsed = JSON.parse(savedRegimes);
        setRegimes(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des régimes:', error);
      }
    }
  }, []);

  const handleRegimeChange = (id: string, field: string, value: any) => {
    setRegimes(prev => prev.map(regime => {
      if (regime.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...regime,
            [parent]: {
              ...(regime[parent as keyof RegimeConfig] as object || {}),
              [child]: value
            }
          };
        } else {
          return { ...regime, [field]: value };
        }
      }
      return regime;
    }));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleThresholdChange = (id: string, category: string, type: string, value: number) => {
    setRegimes(prev => prev.map(regime => 
      regime.id === id 
        ? {
            ...regime,
            thresholds: {
              ...regime.thresholds,
              [category]: {
                ...regime.thresholds[category as keyof typeof regime.thresholds],
                [type]: value
              }
            }
          }
        : regime
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleAllocationChange = (id: string, asset: string, value: number) => {
    setRegimes(prev => prev.map(regime => 
      regime.id === id 
        ? {
            ...regime,
            allocations: {
              ...regime.allocations,
              [asset]: value
            }
          }
        : regime
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleSave = () => {
    localStorage.setItem('oracle-regimes-config', JSON.stringify(regimes));
    setIsDirty(false);
  };

  const handleReset = () => {
    setRegimes(DEFAULT_REGIMES);
    localStorage.removeItem('oracle-regimes-config');
    setIsDirty(true);
    if (onChange) onChange();
  };

  const selectedRegimeData = regimes.find(r => r.id === selectedRegime);
  const totalAllocation = selectedRegimeData ? 
    Object.values(selectedRegimeData.allocations).reduce((sum, val) => sum + val, 0) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-text-primary">Configuration des Régimes</h2>
        </div>
        <p className="text-text-secondary">
          Paramétrage des 4 régimes économiques et de leurs caractéristiques
        </p>
      </div>

      {/* Status */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center space-x-3"
        >
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="text-warning font-medium">Modifications non sauvegardées</p>
            <p className="text-warning/80 text-sm">N'oubliez pas de sauvegarder vos changements</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-warning text-background-primary rounded-lg hover:bg-warning/90 transition-colors"
          >
            Sauvegarder
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regimes List */}
        <div className="lg:col-span-1">
          <div className="bg-background-tertiary rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Régimes Économiques</h3>
            <div className="space-y-2">
              {regimes.map((regime) => {
                const Icon = regime.icon;
                return (
                  <motion.button
                    key={regime.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRegime(regime.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedRegime === regime.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'hover:bg-background-primary text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${regime.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: regime.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{regime.name}</p>
                        <p className="text-xs opacity-70 truncate">{regime.description}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${regime.enabled ? 'bg-success' : 'bg-error'}`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Regime Configuration */}
        <div className="lg:col-span-2">
          {selectedRegimeData && (
            <div className="bg-background-tertiary rounded-lg p-6">
              {/* Regime Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedRegimeData.color}20` }}
                  >
                    <selectedRegimeData.icon className="w-6 h-6" style={{ color: selectedRegimeData.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{selectedRegimeData.name}</h3>
                    <p className="text-text-secondary">{selectedRegimeData.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRegimeData.enabled}
                    onChange={(e) => handleRegimeChange(selectedRegimeData.id, 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="space-y-6">
                {/* Thresholds */}
                <section>
                  <h4 className="text-lg font-medium text-text-primary mb-4">Seuils de Détection</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Confidence */}
                    <div className="p-4 bg-background-primary rounded-lg">
                      <h5 className="font-medium text-text-primary mb-3">Confiance (%)</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Minimum</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={selectedRegimeData.thresholds.confidence.min}
                            onChange={(e) => handleThresholdChange(selectedRegimeData.id, 'confidence', 'min', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Maximum</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={selectedRegimeData.thresholds.confidence.max}
                            onChange={(e) => handleThresholdChange(selectedRegimeData.id, 'confidence', 'max', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Growth */}
                    <div className="p-4 bg-background-primary rounded-lg">
                      <h5 className="font-medium text-text-primary mb-3">Croissance (%)</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Minimum</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedRegimeData.thresholds.growth.min}
                            onChange={(e) => handleThresholdChange(selectedRegimeData.id, 'growth', 'min', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Maximum</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedRegimeData.thresholds.growth.max}
                            onChange={(e) => handleThresholdChange(selectedRegimeData.id, 'growth', 'max', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inflation */}
                    <div className="p-4 bg-background-primary rounded-lg">
                      <h5 className="font-medium text-text-primary mb-3">Inflation (%)</h5>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Minimum</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedRegimeData.thresholds.inflation.min}
                            onChange={(e) => handleThresholdChange(selectedRegimeData.id, 'inflation', 'min', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-text-secondary mb-1">Maximum</label>
                          <input
                            type="number"
                            step="0.1"
                            value={selectedRegimeData.thresholds.inflation.max}
                            onChange={(e) => handleThresholdChange(selectedRegimeData.id, 'inflation', 'max', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Allocations */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-text-primary">Allocation Recommandée</h4>
                    <span className={`text-sm font-medium ${totalAllocation === 100 ? 'text-success' : 'text-error'}`}>
                      Total: {totalAllocation}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedRegimeData.allocations).map(([asset, value]) => (
                      <div key={asset} className="p-4 bg-background-primary rounded-lg">
                        <label className="block text-sm font-medium text-text-secondary mb-2 capitalize">
                          {asset === 'stocks' ? 'Actions' : 
                           asset === 'bonds' ? 'Obligations' :
                           asset === 'commodities' ? 'Matières premières' : 'Liquidités'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => handleAllocationChange(selectedRegimeData.id, asset, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="mt-2 w-full bg-background-tertiary rounded-full h-1">
                          <div 
                            className="h-1 rounded-full transition-all"
                            style={{ 
                              width: `${value}%`,
                              backgroundColor: selectedRegimeData.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Characteristics */}
                <section>
                  <h4 className="text-lg font-medium text-text-primary mb-4">Caractéristiques</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedRegimeData.characteristics).map(([key, value]) => (
                      <div key={key} className="p-3 bg-background-primary rounded-lg">
                        <label className="block text-sm font-medium text-text-secondary mb-1 capitalize">
                          {key === 'growth' ? 'Croissance' :
                           key === 'inflation' ? 'Inflation' :
                           key === 'volatility' ? 'Volatilité' : 'Durée'}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleRegimeChange(selectedRegimeData.id, `characteristics.${key}`, e.target.value)}
                          className="w-full px-2 py-1 bg-background-tertiary border border-background-tertiary rounded text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <section className="pt-6 border-t border-background-tertiary mt-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
          >
            Réinitialiser
          </button>
          
          <div className="flex items-center space-x-3">
            {!isDirty && (
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Sauvegardé</span>
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

