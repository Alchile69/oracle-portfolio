import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Zap, 
  Ship, 
  Fuel, 
  TrendingUp, 
  TrendingDown,
  Settings,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface IndicatorsConfigProps {
  onChange?: () => void;
}

interface Indicator {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  weight: number;
  enabled: boolean;
  threshold: {
    low: number;
    high: number;
  };
  source: string;
  updateFrequency: string;
  color: string;
}

const DEFAULT_INDICATORS: Indicator[] = [
  {
    id: 'electricity',
    name: 'Consommation Électricité',
    description: 'Indicateur de l\'activité économique via la consommation électrique',
    icon: Zap,
    weight: 15,
    enabled: true,
    threshold: { low: -5, high: 5 },
    source: 'RTE France',
    updateFrequency: 'Quotidien',
    color: '#F59E0B'
  },
  {
    id: 'pmi',
    name: 'PMI Manufacturing',
    description: 'Indice des directeurs d\'achat manufacturier',
    icon: BarChart3,
    weight: 20,
    enabled: true,
    threshold: { low: 45, high: 55 },
    source: 'S&P Global',
    updateFrequency: 'Mensuel',
    color: '#3B82F6'
  },
  {
    id: 'maritime',
    name: 'Trafic Maritime',
    description: 'Volume du commerce international via le trafic portuaire',
    icon: Ship,
    weight: 12,
    enabled: true,
    threshold: { low: -10, high: 10 },
    source: 'Ports Authority',
    updateFrequency: 'Hebdomadaire',
    color: '#06B6D4'
  },
  {
    id: 'energy',
    name: 'Prix Énergie',
    description: 'Évolution des prix de l\'énergie (pétrole, gaz)',
    icon: Fuel,
    weight: 18,
    enabled: true,
    threshold: { low: -15, high: 15 },
    source: 'Bloomberg',
    updateFrequency: 'Temps réel',
    color: '#DC2626'
  },
  {
    id: 'yields',
    name: 'Rendements Obligataires',
    description: 'Courbe des taux d\'intérêt gouvernementaux',
    icon: TrendingUp,
    weight: 16,
    enabled: true,
    threshold: { low: 1.5, high: 4.0 },
    source: 'Treasury',
    updateFrequency: 'Temps réel',
    color: '#10B981'
  },
  {
    id: 'spreads',
    name: 'Spreads Crédit',
    description: 'Écarts de crédit corporate vs gouvernemental',
    icon: TrendingDown,
    weight: 14,
    enabled: true,
    threshold: { low: 100, high: 300 },
    source: 'ICE BofA',
    updateFrequency: 'Quotidien',
    color: '#8B5CF6'
  },
  {
    id: 'volatility',
    name: 'Volatilité VIX',
    description: 'Indice de volatilité implicite des marchés',
    icon: AlertTriangle,
    weight: 5,
    enabled: true,
    threshold: { low: 15, high: 30 },
    source: 'CBOE',
    updateFrequency: 'Temps réel',
    color: '#EF4444'
  }
];

export default function IndicatorsConfig({ onChange }: IndicatorsConfigProps) {
  const [indicators, setIndicators] = useState<Indicator[]>(DEFAULT_INDICATORS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Charger les indicateurs depuis localStorage
    const savedIndicators = localStorage.getItem('oracle-indicators-config');
    if (savedIndicators) {
      try {
        const parsed = JSON.parse(savedIndicators);
        setIndicators(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des indicateurs:', error);
      }
    }
  }, []);

  const handleIndicatorChange = (id: string, field: keyof Indicator, value: any) => {
    setIndicators(prev => prev.map(indicator => 
      indicator.id === id 
        ? { ...indicator, [field]: value }
        : indicator
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleThresholdChange = (id: string, type: 'low' | 'high', value: number) => {
    setIndicators(prev => prev.map(indicator => 
      indicator.id === id 
        ? { 
            ...indicator, 
            threshold: { 
              ...indicator.threshold, 
              [type]: value 
            }
          }
        : indicator
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleSave = () => {
    localStorage.setItem('oracle-indicators-config', JSON.stringify(indicators));
    setIsDirty(false);
  };

  const handleReset = () => {
    setIndicators(DEFAULT_INDICATORS);
    localStorage.removeItem('oracle-indicators-config');
    setIsDirty(true);
    if (onChange) onChange();
  };

  const totalWeight = indicators.reduce((sum, indicator) => 
    indicator.enabled ? sum + indicator.weight : sum, 0
  );

  const isWeightValid = totalWeight === 100;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-text-primary">Configuration des Indicateurs</h2>
        </div>
        <p className="text-text-secondary">
          Paramétrage des 7 indicateurs économiques et de leurs pondérations
        </p>
      </div>

      {/* Weight Summary */}
      <div className="mb-6 p-4 bg-background-tertiary rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Pondération totale</span>
          <span className={`text-lg font-bold ${isWeightValid ? 'text-success' : 'text-error'}`}>
            {totalWeight}%
          </span>
        </div>
        <div className="w-full bg-background-primary rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              isWeightValid ? 'bg-success' : totalWeight > 100 ? 'bg-error' : 'bg-warning'
            }`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          />
        </div>
        {!isWeightValid && (
          <p className="text-xs text-error mt-1">
            La pondération totale doit être égale à 100%
          </p>
        )}
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
            disabled={!isWeightValid}
            className="px-4 py-2 bg-warning text-background-primary rounded-lg hover:bg-warning/90 transition-colors disabled:opacity-50"
          >
            Sauvegarder
          </button>
        </motion.div>
      )}

      {/* Indicators List */}
      <div className="space-y-6">
        {indicators.map((indicator) => {
          const Icon = indicator.icon;
          
          return (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg border transition-all ${
                indicator.enabled 
                  ? 'bg-background-tertiary border-background-tertiary' 
                  : 'bg-background-tertiary/50 border-background-tertiary/50 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${indicator.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: indicator.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{indicator.name}</h3>
                    <p className="text-sm text-text-secondary">{indicator.description}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indicator.enabled}
                    onChange={(e) => handleIndicatorChange(indicator.id, 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* Configuration */}
              {indicator.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Pondération (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={indicator.weight}
                      onChange={(e) => handleIndicatorChange(indicator.id, 'weight', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Low Threshold */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Seuil bas
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={indicator.threshold.low}
                      onChange={(e) => handleThresholdChange(indicator.id, 'low', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* High Threshold */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Seuil haut
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={indicator.threshold.high}
                      onChange={(e) => handleThresholdChange(indicator.id, 'high', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={indicator.source}
                      onChange={(e) => handleIndicatorChange(indicator.id, 'source', e.target.value)}
                      className="w-full px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-4 pt-4 border-t border-background-primary">
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>Fréquence: {indicator.updateFrequency}</span>
                  <span>Source: {indicator.source}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
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
              disabled={!isDirty || !isWeightValid}
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

