import React from 'react';

export type RegimeType = 'EXPANSION' | 'RECOVERY' | 'STAGFLATION' | 'RECESSION';

interface RegimeData {
  regime: RegimeType;
  confidence: number;
  growthScore: number;
  inflationScore: number;
  detectedAt: string;
}

interface RegimeIndicatorProps {
  regime?: RegimeData;
}

const REGIME_CHARACTERISTICS: Record<RegimeType, {
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  EXPANSION: {
    description: 'Croissance forte, inflation modérée',
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  RECOVERY: {
    description: 'Reprise économique en cours',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  STAGFLATION: {
    description: 'Croissance faible, inflation élevée',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  RECESSION: {
    description: 'Contraction économique',
    color: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  }
};

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(Math.max(value * 10, 0), 100)}%` }}
      ></div>
    </div>
  </div>
);

export const RegimeIndicator: React.FC<RegimeIndicatorProps> = ({ regime }) => {
  if (!regime) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Régime Économique
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Données en cours de chargement...
        </div>
      </div>
    );
  }

  const characteristics = REGIME_CHARACTERISTICS[regime.regime];
  const confidenceColor = regime.confidence > 0.8 ? 'text-green-600' : 
                         regime.confidence > 0.6 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Régime Économique
        </h3>
        <div className="text-xs text-gray-500">
          Mis à jour: {new Date(regime.detectedAt).toLocaleDateString('fr-FR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Régime actuel */}
        <div className={`rounded-lg p-4 border ${characteristics.bgColor}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${characteristics.color}`}>
              {regime.regime}
            </span>
            <span className={`text-lg font-bold ${confidenceColor}`}>
              {Math.round(regime.confidence * 100)}%
            </span>
          </div>
          
          <p className={`text-sm ${characteristics.textColor} mb-4`}>
            {characteristics.description}
          </p>

          <div className="text-xs text-gray-600">
            Confiance: {Math.round(regime.confidence * 100)}%
          </div>
        </div>

        {/* Scores détaillés */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Indicateurs</h4>
          
          <ScoreBar 
            label="Croissance" 
            value={regime.growthScore} 
            color="bg-blue-500"
          />
          
          <ScoreBar 
            label="Inflation" 
            value={regime.inflationScore} 
            color="bg-orange-500"
          />
          
          <ScoreBar 
            label="Confiance" 
            value={regime.confidence * 10} 
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Détails supplémentaires */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {regime.growthScore > 7 ? '+' : ''}{regime.growthScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Croissance</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {regime.inflationScore.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Inflation</div>
          </div>
          <div>
            <div className={`text-lg font-semibold ${confidenceColor}`}>
              {Math.round(regime.confidence * 100)}%
            </div>
            <div className="text-xs text-gray-500">Confiance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

