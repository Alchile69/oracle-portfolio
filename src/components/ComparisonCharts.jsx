import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart,
  Brush
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getComparisonData } from '../data/mockData';

const ComparisonCharts = ({ selectedCountries, activeTab = 'performance', filters = {} }) => {
  const [zoomDomain, setZoomDomain] = useState(null);
  const [yAxisDomain, setYAxisDomain] = useState(['dataMin - 5', 'dataMax + 5']);

  if (!selectedCountries || selectedCountries.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">Sélectionnez des pays pour voir les graphiques</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-red-500">
              <p className="text-sm">Erreur lors du chargement des données</p>
              <p className="text-xs mt-2">Veuillez actualiser la page</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Couleurs pour les pays
  const countryColors = {
    US: '#3b82f6', // Bleu
    DE: '#ef4444', // Rouge
    FR: '#10b981', // Vert
    UK: '#f59e0b', // Orange
    JP: '#8b5cf6', // Violet
    CA: '#06b6d4', // Cyan
    AU: '#f97316', // Orange foncé
    CH: '#84cc16'  // Lime
  };

  // Fonctions de zoom
  const handleZoomIn = () => {
    setYAxisDomain(prev => {
      const [min, max] = prev;
      const minVal = typeof min === 'string' ? 90 : min;
      const maxVal = typeof max === 'string' ? 120 : max;
      const range = maxVal - minVal;
      const newRange = range * 0.7; // Zoom de 30%
      const center = (minVal + maxVal) / 2;
      return [center - newRange/2, center + newRange/2];
    });
  };

  const handleZoomOut = () => {
    setYAxisDomain(prev => {
      const [min, max] = prev;
      const minVal = typeof min === 'string' ? 90 : min;
      const maxVal = typeof max === 'string' ? 120 : max;
      const range = maxVal - minVal;
      const newRange = range * 1.4; // Dézoom de 40%
      const center = (minVal + maxVal) / 2;
      return [center - newRange/2, center + newRange/2];
    });
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
    setYAxisDomain(['dataMin - 5', 'dataMax + 5']);
  };

  // Données pour le graphique de performance historique avec échelle améliorée
  const performanceHistoryData = comparisonData[0]?.performance.historicalData.map((item, index) => {
    const dataPoint = { date: item.date };
    comparisonData.forEach(({ code, performance }) => {
      dataPoint[code] = performance.historicalData[index]?.value || 0;
    });
    return dataPoint;
  }) || [];

  // Données pour le graphique en barres des métriques de performance
  const performanceMetricsData = [
    {
      metric: 'Rendement Annualisé',
      ...comparisonData.reduce((acc, { code, performance }) => {
        acc[code] = performance.annualizedReturn;
        return acc;
      }, {})
    },
    {
      metric: 'Volatilité',
      ...comparisonData.reduce((acc, { code, performance }) => {
        acc[code] = performance.volatility;
        return acc;
      }, {})
    },
    {
      metric: 'Ratio de Sharpe',
      ...comparisonData.reduce((acc, { code, performance }) => {
        acc[code] = performance.sharpeRatio * 10; // Multiplié pour la visualisation
        return acc;
      }, {})
    },
    {
      metric: 'Max Drawdown',
      ...comparisonData.reduce((acc, { code, performance }) => {
        acc[code] = Math.abs(performance.maxDrawdown);
        return acc;
      }, {})
    }
  ];

  // Données pour les graphiques en secteurs (allocation)
  const getAllocationPieData = (countryCode) => {
    const country = comparisonData.find(c => c.code === countryCode);
    if (!country) return [];
    
    return [
      { name: 'Actions', value: country.allocation.stocks, color: '#3b82f6' },
      { name: 'Obligations', value: country.allocation.bonds, color: '#10b981' },
      { name: 'Matières Premières', value: country.allocation.commodities, color: '#f59e0b' },
      { name: 'Liquidités', value: country.allocation.cash, color: '#6b7280' }
    ];
  };

  // Données pour le graphique radar des indicateurs
  const getRadarData = () => {
    return [
      {
        indicator: 'Rendement',
        ...comparisonData.reduce((acc, { code, performance }) => {
          acc[code] = (performance.annualizedReturn / 15) * 100; // Normalisé sur 100
          return acc;
        }, {})
      },
      {
        indicator: 'Sharpe',
        ...comparisonData.reduce((acc, { code, performance }) => {
          acc[code] = (performance.sharpeRatio / 1.5) * 100; // Normalisé sur 100
          return acc;
        }, {})
      },
      {
        indicator: 'Stabilité',
        ...comparisonData.reduce((acc, { code, performance }) => {
          acc[code] = ((25 - performance.volatility) / 25) * 100; // Inversé et normalisé
          return acc;
        }, {})
      },
      {
        indicator: 'Résilience',
        ...comparisonData.reduce((acc, { code, performance }) => {
          acc[code] = ((20 + performance.maxDrawdown) / 20) * 100; // Inversé et normalisé
          return acc;
        }, {})
      },
      {
        indicator: 'Alpha',
        ...comparisonData.reduce((acc, { code, performance }) => {
          acc[code] = ((performance.alpha + 2) / 4) * 100; // Normalisé sur 100
          return acc;
        }, {})
      }
    ];
  };

  // Données pour les indicateurs physiques et financiers
  const getIndicatorsData = () => {
    return [
      {
        name: 'Électricité',
        ...comparisonData.reduce((acc, { code, physicalIndicators }) => {
          acc[code] = physicalIndicators?.electricity?.value || 0;
          return acc;
        }, {})
      },
      {
        name: 'PMI',
        ...comparisonData.reduce((acc, { code, physicalIndicators }) => {
          acc[code] = physicalIndicators?.pmi?.value || 0;
          return acc;
        }, {})
      },
      {
        name: 'Maritime',
        ...comparisonData.reduce((acc, { code, physicalIndicators }) => {
          acc[code] = physicalIndicators?.maritime?.value || 0;
          return acc;
        }, {})
      },
      {
        name: 'Énergie',
        ...comparisonData.reduce((acc, { code, physicalIndicators }) => {
          acc[code] = physicalIndicators?.energy?.value || 0;
          return acc;
        }, {})
      }
    ];
  };

  // Données pour le backtesting
  const getBacktestingData = () => {
    return [
      {
        metric: 'Rendement Total',
        ...comparisonData.reduce((acc, { code, backtesting }) => {
          acc[code] = backtesting.totalReturn;
          return acc;
        }, {})
      },
      {
        metric: 'Taux de Gain',
        ...comparisonData.reduce((acc, { code, backtesting }) => {
          acc[code] = backtesting.winRate;
          return acc;
        }, {})
      },
      {
        metric: 'Facteur de Profit',
        ...comparisonData.reduce((acc, { code, backtesting }) => {
          acc[code] = backtesting.profitFactor * 50; // Multiplié pour la visualisation
          return acc;
        }, {})
      }
    ];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPerformanceCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique de performance historique avec zoom */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Historique Comparative</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="flex items-center gap-1"
            >
              <ZoomIn className="h-4 w-4" />
              Zoom +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="flex items-center gap-1"
            >
              <ZoomOut className="h-4 w-4" />
              Zoom -
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={performanceHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#ccc' }}
              />
              <YAxis 
                domain={yAxisDomain}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#ccc' }}
                label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedCountries.map((countryCode) => (
                <Line
                  key={countryCode}
                  type="monotone"
                  dataKey={countryCode}
                  stroke={countryColors[countryCode]}
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
              ))}
              <Brush 
                dataKey="date" 
                height={60}
                stroke="#8884d8"
                fill="#f0f0f0"
                tickFormatter={(value) => value}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique en barres des métriques */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedCountries.map((countryCode) => (
                <Bar
                  key={countryCode}
                  dataKey={countryCode}
                  fill={countryColors[countryCode]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique radar */}
      <Card>
        <CardHeader>
          <CardTitle>Profil de Risque-Rendement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={getRadarData()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="indicator" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              {selectedCountries.map((countryCode) => (
                <Radar
                  key={countryCode}
                  name={countryCode}
                  dataKey={countryCode}
                  stroke={countryColors[countryCode]}
                  fill={countryColors[countryCode]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderAllocationCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {comparisonData.map(({ code, country }) => (
        <Card key={code}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">{country.flag}</span>
              <span>{country.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getAllocationPieData(code)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {getAllocationPieData(code).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderIndicatorsCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Indicateurs Physiques */}
      <Card>
        <CardHeader>
          <CardTitle>Indicateurs Physiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getIndicatorsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedCountries.map((countryCode) => (
                <Bar
                  key={countryCode}
                  dataKey={countryCode}
                  fill={countryColors[countryCode]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap des indicateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Matrice de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {['Électricité', 'PMI', 'Maritime', 'Énergie'].map((indicator) => (
              <div key={indicator} className="text-center">
                <div className="text-xs font-medium mb-2">{indicator}</div>
                {comparisonData.map(({ code, country, physicalIndicators }) => {
                  // Vérification de sécurité pour éviter le plantage
                  if (!physicalIndicators || !physicalIndicators[indicator.toLowerCase()]) {
                    return (
                      <div
                        key={code}
                        className="h-8 mb-1 rounded flex items-center justify-center text-xs font-medium text-white bg-gray-400"
                      >
                        {country.flag} N/A
                      </div>
                    );
                  }
                  
                  const value = physicalIndicators[indicator.toLowerCase()].value;
                  const intensity = value / 100;
                  return (
                    <div
                      key={code}
                      className="h-8 mb-1 rounded flex items-center justify-center text-xs font-medium text-white"
                      style={{
                        backgroundColor: countryColors[code],
                        opacity: intensity
                      }}
                    >
                      {country.flag} {value}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBacktestingCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Paramètres de backtesting */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Paramètres de Backtesting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Période d'analyse</label>
              <div className="text-lg font-semibold text-blue-600">7 mois</div>
              <div className="text-xs text-gray-500">Jan 2024 - Jul 2024</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fréquence de rééquilibrage</label>
              <div className="text-lg font-semibold text-green-600">Mensuelle</div>
              <div className="text-xs text-gray-500">Premier jour du mois</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Capital initial</label>
              <div className="text-lg font-semibold text-purple-600">100 000 €</div>
              <div className="text-xs text-gray-500">Par portefeuille</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frais de transaction</label>
              <div className="text-lg font-semibold text-orange-600">0.15%</div>
              <div className="text-xs text-gray-500">Par transaction</div>
            </div>
          </div>
          
          {/* Paramètres avancés */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Configuration Avancée</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Modèle de risque</label>
                <div className="text-sm text-gray-600">VaR 95% + CVaR</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Optimisation</label>
                <div className="text-sm text-gray-600">Mean-Variance</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraintes</label>
                <div className="text-sm text-gray-600">Long-only, Max 10% par actif</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Benchmark</label>
                <div className="text-sm text-gray-600">Indices locaux + MSCI World</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slippage</label>
                <div className="text-sm text-gray-600">0.05% (impact marché)</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Liquidité</label>
                <div className="text-sm text-gray-600">Min 1M€ volume quotidien</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques de backtesting */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats de Backtesting</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getBacktestingData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedCountries.map((countryCode) => (
                <Bar
                  key={countryCode}
                  dataKey={countryCode}
                  fill={countryColors[countryCode]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques Détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonData.map(({ code, country, backtesting }) => (
              <div key={code} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-semibold">{country.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nombre de trades:</span>
                    <span className="ml-2 font-medium">{backtesting.totalTrades}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Durée moyenne:</span>
                    <span className="ml-2 font-medium">28 jours</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Meilleur trade:</span>
                    <span className="ml-2 font-medium text-green-600">+{backtesting.bestTrade}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pire trade:</span>
                    <span className="ml-2 font-medium text-red-600">{backtesting.worstTrade}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Pertes consécutives max:</span>
                    <span className="ml-2 font-medium">{backtesting.maxConsecutiveLosses}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Trade moyen:</span>
                    <span className="ml-2 font-medium">+{backtesting.avgTrade}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Exposition moyenne:</span>
                    <span className="ml-2 font-medium">87.5%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Turnover annuel:</span>
                    <span className="ml-2 font-medium">145%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Frais totaux:</span>
                    <span className="ml-2 font-medium text-orange-600">0.89%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Corrélation benchmark:</span>
                    <span className="ml-2 font-medium">0.85</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Information Ratio:</span>
                    <span className="ml-2 font-medium">0.65</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Calmar Ratio:</span>
                    <span className="ml-2 font-medium">1.2</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique combiné rendement vs risque */}
      <Card>
        <CardHeader>
          <CardTitle>Rendement vs Risque</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={comparisonData.map(({ code, country, performance }) => ({
                name: country.name,
                code: code,
                rendement: performance.annualizedReturn,
                volatilite: performance.volatility,
                sharpe: performance.sharpeRatio * 10
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="rendement" fill="#3b82f6" name="Rendement %" />
              <Bar dataKey="volatilite" fill="#ef4444" name="Volatilité %" />
              <Line type="monotone" dataKey="sharpe" stroke="#10b981" strokeWidth={3} name="Sharpe x10" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return renderPerformanceCharts();
      case 'allocation':
        return renderAllocationCharts();
      case 'indicators':
        return renderIndicatorsCharts();
      case 'backtesting':
        return renderBacktestingCharts();
      default:
        return renderPerformanceCharts();
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default ComparisonCharts;

