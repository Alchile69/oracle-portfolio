import React from 'react';
import { motion } from 'framer-motion';

interface RegimeIndicatorProps {
  regime?: {
    regime: string;
    confidence: number;
    growthScore: number;
    inflationScore: number;
    detectedAt: string;
  };
}

export const RegimeIndicator: React.FC<RegimeIndicatorProps> = ({ regime }) => {
  if (!regime) {
    return (
      <div className="bg-background-card border border-border rounded-lg shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-border rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-border rounded"></div>
        </div>
      </div>
    );
  }

  const getRegimeColor = (regimeType: string) => {
    switch (regimeType.toUpperCase()) {
      case 'EXPANSION': return 'bg-regime-expansion';
      case 'RECOVERY': return 'bg-regime-recovery';
      case 'STAGFLATION': return 'bg-regime-stagflation';
      case 'RECESSION': return 'bg-regime-recession';
      default: return 'bg-text-secondary';
    }
  };

  const getRegimeDescription = (regimeType: string) => {
    switch (regimeType.toUpperCase()) {
      case 'EXPANSION': return 'Croissance économique soutenue avec inflation maîtrisée';
      case 'RECOVERY': return 'Reprise post-récession avec taux d\'intérêt en baisse';
      case 'STAGFLATION': return 'Inflation élevée avec croissance économique faible';
      case 'RECESSION': return 'Contraction économique avec chômage en hausse';
      default: return 'Régime économique non défini';
    }
  };

  const confidenceColor = regime.confidence > 0.8 ? 'text-success' : 
                         regime.confidence > 0.6 ? 'text-warning' : 'text-error';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background-card border border-border rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Régime Économique</h2>
        <span className={`px-3 py-1 rounded-md text-sm font-bold text-white ${getRegimeColor(regime.regime)}`}>
          {regime.regime}
        </span>
      </div>

      <div className="space-y-4">
        {/* Description du régime */}
        <div>
          <p className="text-text-secondary text-sm mb-2">
            {getRegimeDescription(regime.regime)}
          </p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background-secondary rounded-lg p-3 border border-border">
            <div className="text-xs text-text-secondary mb-1">Croissance</div>
            <div className="text-lg font-semibold text-text-primary">
              {regime.growthScore > 0 ? '+' : ''}{regime.growthScore.toFixed(2)}%
            </div>
          </div>
          <div className="bg-background-secondary rounded-lg p-3 border border-border">
            <div className="text-xs text-text-secondary mb-1">Inflation</div>
            <div className="text-lg font-semibold text-text-primary">
              {regime.inflationScore.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Confiance */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Niveau de confiance</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-border rounded-full h-2">
              <motion.div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${regime.confidence * 100}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              ></motion.div>
            </div>
            <span className={`text-sm font-medium ${confidenceColor}`}>
              {Math.round(regime.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Secteurs favorisés */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">Secteurs favorisés</h4>
          <div className="flex flex-wrap gap-2">
            {['Technologie', 'Finance', 'Santé'].map((sector) => (
              <span 
                key={sector}
                className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-md border border-primary border-opacity-30"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="text-xs text-text-secondary pt-2 border-t border-border">
          Dernière mise à jour: {new Date(regime.detectedAt).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </motion.div>
  );
}; 