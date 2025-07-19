import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getComparisonData } from '../data/mockData';

const HeatmapChart = ({ selectedCountries, filters = {} }) => {
  if (!selectedCountries || selectedCountries.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">Heatmap de Performance</p>
            <p className="text-sm">Sélectionnez des pays pour voir la heatmap</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  let comparisonData;
  try {
    comparisonData = getComparisonData(selectedCountries);
    if (!comparisonData || comparisonData.length === 0) {
      throw new Error('Données de comparaison vides');
    }
    
    // Appliquer les filtres
    if (filters.minReturn && filters.minReturn[0] > 0) {
      comparisonData = comparisonData.filter(country => 
        country.performance.annualizedReturn >= filters.minReturn[0]
      );
    }
    
    if (filters.maxRisk && filters.maxRisk[0] < 100) {
      comparisonData = comparisonData.filter(country => 
        country.performance.volatility <= filters.maxRisk[0]
      );
    }
    
    if (filters.showPositiveOnly) {
      comparisonData = comparisonData.filter(country => 
        country.performance.cumulativeReturn > 0
      );
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p className="text-sm">Erreur lors du chargement des données</p>
            <p className="text-xs mt-2">Veuillez actualiser la page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Définir les métriques à afficher dans la heatmap
  const metrics = [
    {
      key: 'annualizedReturn',
      label: 'Rendement Annualisé',
      getValue: (data) => data.performance.annualizedReturn,
      format: (value) => `${value.toFixed(1)}%`,
      thresholds: { excellent: 8, good: 6, average: 4, poor: 2 }
    },
    {
      key: 'volatility',
      label: 'Volatilité',
      getValue: (data) => data.performance.volatility,
      format: (value) => `${value.toFixed(1)}%`,
      thresholds: { excellent: 12, good: 16, average: 20, poor: 25 },
      inverse: true // Plus bas = mieux
    },
    {
      key: 'sharpeRatio',
      label: 'Ratio de Sharpe',
      getValue: (data) => data.performance.sharpeRatio,
      format: (value) => value.toFixed(2),
      thresholds: { excellent: 0.8, good: 0.6, average: 0.4, poor: 0.2 }
    },
    {
      key: 'maxDrawdown',
      label: 'Max Drawdown',
      getValue: (data) => Math.abs(data.performance.maxDrawdown),
      format: (value) => `-${value.toFixed(1)}%`,
      thresholds: { excellent: 5, good: 8, average: 12, poor: 15 },
      inverse: true
    },
    {
      key: 'alpha',
      label: 'Alpha',
      getValue: (data) => data.performance.alpha,
      format: (value) => `${value.toFixed(1)}%`,
      thresholds: { excellent: 2, good: 1, average: 0, poor: -1 }
    },
    {
      key: 'informationRatio',
      label: 'Information Ratio',
      getValue: (data) => data.performance.informationRatio,
      format: (value) => value.toFixed(2),
      thresholds: { excellent: 0.6, good: 0.4, average: 0.2, poor: 0 }
    },
    {
      key: 'calmarRatio',
      label: 'Calmar Ratio',
      getValue: (data) => data.performance.calmarRatio,
      format: (value) => value.toFixed(2),
      thresholds: { excellent: 0.8, good: 0.6, average: 0.4, poor: 0.2 }
    },
    {
      key: 'sortinoRatio',
      label: 'Sortino Ratio',
      getValue: (data) => data.performance.sortinoRatio,
      format: (value) => value.toFixed(2),
      thresholds: { excellent: 1.0, good: 0.8, average: 0.6, poor: 0.4 }
    }
  ];

  // Fonction pour déterminer la couleur basée sur la performance
  const getPerformanceColor = (value, metric) => {
    const { thresholds, inverse } = metric;
    
    let level;
    if (inverse) {
      if (value <= thresholds.excellent) level = 'excellent';
      else if (value <= thresholds.good) level = 'good';
      else if (value <= thresholds.average) level = 'average';
      else level = 'poor';
    } else {
      if (value >= thresholds.excellent) level = 'excellent';
      else if (value >= thresholds.good) level = 'good';
      else if (value >= thresholds.average) level = 'average';
      else level = 'poor';
    }

    const colors = {
      excellent: 'bg-green-500 text-white',
      good: 'bg-green-300 text-green-900',
      average: 'bg-yellow-300 text-yellow-900',
      poor: 'bg-red-300 text-red-900'
    };

    return colors[level];
  };

  // Fonction pour obtenir l'intensité de la couleur (pour les dégradés)
  const getIntensity = (value, metric) => {
    const { thresholds, inverse } = metric;
    const max = Math.max(...Object.values(thresholds));
    const min = Math.min(...Object.values(thresholds));
    
    if (inverse) {
      return Math.max(0, Math.min(1, (max - value) / (max - min)));
    } else {
      return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }
  };

  // Calculer les scores globaux pour chaque pays
  const getOverallScore = (countryData) => {
    let totalScore = 0;
    let totalWeight = 0;

    metrics.forEach((metric) => {
      const value = metric.getValue(countryData);
      const intensity = getIntensity(value, metric);
      const weight = 1; // Tous les métriques ont le même poids pour l'instant
      
      totalScore += intensity * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Heatmap principale */}
      <Card>
        <CardHeader>
          <CardTitle>Heatmap de Performance Multi-Pays</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comparaison visuelle des métriques clés. Vert = Excellent, Jaune = Moyen, Rouge = Faible
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 font-medium border-b">Métrique</th>
                  {comparisonData.map(({ code, country }) => (
                    <th key={code} className="text-center p-3 font-medium border-b min-w-[120px]">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-sm">{country.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.key} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">{metric.label}</td>
                    {comparisonData.map(({ code, ...countryData }) => {
                      const value = metric.getValue(countryData);
                      const colorClass = getPerformanceColor(value, metric);
                      
                      return (
                        <td key={code} className="p-3 text-center">
                          <div className={`px-3 py-2 rounded-lg font-medium ${colorClass}`}>
                            {metric.format(value)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scores globaux */}
      <Card>
        <CardHeader>
          <CardTitle>Scores Globaux de Performance</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Score composite basé sur toutes les métriques (0-100)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonData
              .map((countryData) => ({
                ...countryData,
                score: getOverallScore(countryData)
              }))
              .sort((a, b) => b.score - a.score)
              .map(({ code, country, score }, index) => {
                const getBadgeVariant = (score) => {
                  if (score >= 80) return 'default';
                  if (score >= 60) return 'secondary';
                  if (score >= 40) return 'outline';
                  return 'destructive';
                };

                const getRankEmoji = (rank) => {
                  switch (rank) {
                    case 0: return '🥇';
                    case 1: return '🥈';
                    case 2: return '🥉';
                    default: return '📊';
                  }
                };

                return (
                  <Card key={code} className="text-center">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getRankEmoji(index)}</span>
                          <span className="text-3xl">{country.flag}</span>
                        </div>
                        <h3 className="font-semibold">{country.name}</h3>
                        <Badge 
                          variant={getBadgeVariant(score)}
                          className="text-lg px-3 py-1"
                        >
                          {score.toFixed(0)}/100
                        </Badge>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Analyse des forces et faiblesses */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des Forces et Faiblesses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparisonData.map(({ code, country, ...countryData }) => {
              // Calculer les forces et faiblesses
              const analysis = metrics.map((metric) => {
                const value = metric.getValue(countryData);
                const intensity = getIntensity(value, metric);
                return {
                  metric: metric.label,
                  value: metric.format(value),
                  intensity,
                  isStrength: intensity >= 0.7,
                  isWeakness: intensity <= 0.3
                };
              });

              const strengths = analysis.filter(a => a.isStrength);
              const weaknesses = analysis.filter(a => a.isWeakness);

              return (
                <Card key={code}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">{country.flag}</span>
                      <span>{country.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Forces */}
                    <div>
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">
                        💪 Forces ({strengths.length})
                      </h4>
                      {strengths.length > 0 ? (
                        <div className="space-y-1">
                          {strengths.map((strength) => (
                            <div key={strength.metric} className="flex justify-between items-center">
                              <span className="text-sm">{strength.metric}</span>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                {strength.value}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Aucune force notable</p>
                      )}
                    </div>

                    {/* Faiblesses */}
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">
                        ⚠️ Faiblesses ({weaknesses.length})
                      </h4>
                      {weaknesses.length > 0 ? (
                        <div className="space-y-1">
                          {weaknesses.map((weakness) => (
                            <div key={weakness.metric} className="flex justify-between items-center">
                              <span className="text-sm">{weakness.metric}</span>
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                {weakness.value}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Aucune faiblesse notable</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapChart;

