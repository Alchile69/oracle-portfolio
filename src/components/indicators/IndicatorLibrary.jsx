import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  technicalIndicators, 
  fundamentalIndicators, 
  macroIndicators,
  volatilityIndicators,
  sentimentIndicators,
  riskIndicators,
  sectorIndicators,
  calculationUtils
} from '../../utils/financialIndicators';

const IndicatorLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [selectedIndicator, setSelectedIndicator] = useState('rsi');
  const [calculationResult, setCalculationResult] = useState(null);
  const [sampleData, setSampleData] = useState([]);
  const [parameters, setParameters] = useState({});

  // Génération de données d'exemple
  useEffect(() => {
    const generateSampleData = () => {
      const data = [];
      let price = 100;
      for (let i = 0; i < 100; i++) {
        price += (Math.random() - 0.5) * 4;
        data.push({
          date: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: Math.max(50, Math.min(150, price)),
          volume: Math.floor(Math.random() * 1000000) + 500000,
          high: price + Math.random() * 2,
          low: price - Math.random() * 2,
          close: price
        });
      }
      return data;
    };
    setSampleData(generateSampleData());
  }, []);

  // Configuration des indicateurs
  const indicatorCategories = {
    technical: {
      name: 'Indicateurs Techniques',
      icon: '📈',
      color: 'bg-blue-100 text-blue-800',
      indicators: {
        rsi: {
          name: 'RSI (Relative Strength Index)',
          description: 'Oscillateur de momentum qui mesure la vitesse et l\'amplitude des changements de prix',
          parameters: { period: 14 },
          calculate: (data, params) => technicalIndicators.rsi(data.map(d => d.price), params.period)
        },
        sma: {
          name: 'SMA (Simple Moving Average)',
          description: 'Moyenne mobile simple pour identifier les tendances',
          parameters: { period: 20 },
          calculate: (data, params) => technicalIndicators.sma(data.map(d => d.price), params.period)
        },
        ema: {
          name: 'EMA (Exponential Moving Average)',
          description: 'Moyenne mobile exponentielle qui donne plus de poids aux prix récents',
          parameters: { period: 12 },
          calculate: (data, params) => technicalIndicators.ema(data.map(d => d.price), params.period)
        },
        macd: {
          name: 'MACD (Moving Average Convergence Divergence)',
          description: 'Indicateur de momentum basé sur la convergence/divergence des moyennes mobiles',
          parameters: { fast: 12, slow: 26, signal: 9 },
          calculate: (data, params) => technicalIndicators.macd(data.map(d => d.price), params.fast, params.slow, params.signal)
        },
        bollinger: {
          name: 'Bandes de Bollinger',
          description: 'Bandes de volatilité basées sur l\'écart-type',
          parameters: { period: 20, stdDev: 2 },
          calculate: (data, params) => technicalIndicators.bollingerBands(data.map(d => d.price), params.period, params.stdDev)
        }
      }
    },
    volatility: {
      name: 'Indicateurs de Volatilité',
      icon: '📊',
      color: 'bg-purple-100 text-purple-800',
      indicators: {
        historicalVol: {
          name: 'Volatilité Historique',
          description: 'Mesure de la volatilité basée sur les rendements historiques',
          parameters: { period: 252 },
          calculate: (data, params) => {
            const returns = [];
            for (let i = 1; i < data.length; i++) {
              returns.push((data[i].price - data[i-1].price) / data[i-1].price);
            }
            return volatilityIndicators.historicalVolatility(returns, params.period);
          }
        },
        atr: {
          name: 'ATR (Average True Range)',
          description: 'Mesure de la volatilité basée sur les ranges de trading',
          parameters: { period: 14 },
          calculate: (data, params) => volatilityIndicators.atr(
            data.map(d => d.high), 
            data.map(d => d.low), 
            data.map(d => d.close), 
            params.period
          )
        }
      }
    },
    risk: {
      name: 'Indicateurs de Risque',
      icon: '⚠️',
      color: 'bg-red-100 text-red-800',
      indicators: {
        var: {
          name: 'VaR (Value at Risk)',
          description: 'Perte potentielle maximale avec un niveau de confiance donné',
          parameters: { confidenceLevel: 0.05 },
          calculate: (data, params) => {
            const returns = [];
            for (let i = 1; i < data.length; i++) {
              returns.push((data[i].price - data[i-1].price) / data[i-1].price);
            }
            return riskIndicators.valueAtRisk(returns, params.confidenceLevel);
          }
        },
        maxDrawdown: {
          name: 'Maximum Drawdown',
          description: 'Plus grande perte depuis un pic historique',
          parameters: {},
          calculate: (data, params) => riskIndicators.maxDrawdown(data.map(d => d.price))
        },
        sharpe: {
          name: 'Ratio de Sharpe',
          description: 'Rendement ajusté du risque',
          parameters: { riskFreeRate: 0.02 },
          calculate: (data, params) => {
            const returns = [];
            for (let i = 1; i < data.length; i++) {
              returns.push((data[i].price - data[i-1].price) / data[i-1].price);
            }
            return riskIndicators.sharpeRatio(returns, params.riskFreeRate);
          }
        }
      }
    },
    sentiment: {
      name: 'Indicateurs de Sentiment',
      icon: '🎭',
      color: 'bg-yellow-100 text-yellow-800',
      indicators: {
        fearGreed: {
          name: 'Indice Fear & Greed',
          description: 'Composite de plusieurs indicateurs de sentiment du marché',
          parameters: {},
          calculate: (data, params) => {
            // Simulation avec des valeurs aléatoires
            const vix = Math.random() * 40 + 10;
            const momentum = Math.random() * 100;
            const demand = Math.random() * 100;
            const breadth = Math.random() * 100;
            const options = Math.random() * 100;
            const bonds = Math.random() * 100;
            const safe = Math.random() * 100;
            return sentimentIndicators.fearGreedIndex(vix, momentum, demand, breadth, options, bonds, safe);
          }
        },
        putCall: {
          name: 'Ratio Put/Call',
          description: 'Ratio entre le volume des options de vente et d\'achat',
          parameters: {},
          calculate: (data, params) => {
            // Simulation
            const putVolume = Math.random() * 1000000 + 500000;
            const callVolume = Math.random() * 1000000 + 500000;
            return sentimentIndicators.putCallRatio(putVolume, callVolume);
          }
        }
      }
    },
    macro: {
      name: 'Indicateurs Macroéconomiques',
      icon: '🌍',
      color: 'bg-green-100 text-green-800',
      indicators: {
        yieldCurve: {
          name: 'Pente de la Courbe des Taux',
          description: 'Différence entre les taux longs et courts',
          parameters: { longTerm: 10, shortTerm: 2 },
          calculate: (data, params) => {
            // Simulation
            const longYield = Math.random() * 3 + 2;
            const shortYield = Math.random() * 2 + 1;
            return macroIndicators.yieldCurveSlope(longYield, shortYield);
          }
        },
        realRate: {
          name: 'Taux d\'Intérêt Réel',
          description: 'Taux nominal ajusté de l\'inflation',
          parameters: { nominalRate: 5, inflationRate: 3 },
          calculate: (data, params) => macroIndicators.realInterestRate(params.nominalRate, params.inflationRate)
        },
        miseryIndex: {
          name: 'Indice de Misère',
          description: 'Somme du taux de chômage et d\'inflation',
          parameters: { unemployment: 5, inflation: 3 },
          calculate: (data, params) => macroIndicators.miseryIndex(params.unemployment, params.inflation)
        }
      }
    }
  };

  // Calcul de l'indicateur sélectionné
  useEffect(() => {
    if (sampleData.length > 0 && selectedCategory && selectedIndicator) {
      const category = indicatorCategories[selectedCategory];
      const indicator = category.indicators[selectedIndicator];
      
      try {
        const result = indicator.calculate(sampleData, parameters);
        setCalculationResult(result);
      } catch (error) {
        console.error('Erreur de calcul:', error);
        setCalculationResult(null);
      }
    }
  }, [selectedCategory, selectedIndicator, sampleData, parameters]);

  // Mise à jour des paramètres par défaut
  useEffect(() => {
    if (selectedCategory && selectedIndicator) {
      const indicator = indicatorCategories[selectedCategory].indicators[selectedIndicator];
      setParameters(indicator.parameters);
    }
  }, [selectedCategory, selectedIndicator]);

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: parseFloat(value) || value
    }));
  };

  const renderChart = () => {
    if (!calculationResult || !sampleData.length) return null;

    const chartData = sampleData.map((item, index) => ({
      date: item.date,
      price: item.price,
      indicator: Array.isArray(calculationResult) ? calculationResult[index] : calculationResult
    })).filter(item => item.indicator !== undefined);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="price" orientation="left" />
          <YAxis yAxisId="indicator" orientation="right" />
          <Tooltip />
          <Line yAxisId="price" type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
          <Line yAxisId="indicator" type="monotone" dataKey="indicator" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderIndicatorResult = () => {
    if (!calculationResult) return null;

    if (typeof calculationResult === 'number') {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Résultat</h4>
          <div className="text-2xl font-bold text-blue-600">
            {calculationResult.toFixed(4)}
          </div>
        </div>
      );
    }

    if (Array.isArray(calculationResult)) {
      const latest = calculationResult[calculationResult.length - 1];
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Valeur Actuelle</h4>
          <div className="text-2xl font-bold text-blue-600">
            {typeof latest === 'number' ? latest.toFixed(4) : 'N/A'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {calculationResult.length} points de données
          </div>
        </div>
      );
    }

    if (typeof calculationResult === 'object') {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Résultats</h4>
          {Object.entries(calculationResult).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center mb-1">
              <span className="capitalize">{key}:</span>
              <span className="font-mono">
                {Array.isArray(value) ? value[value.length - 1]?.toFixed(4) : value?.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bibliothèque d'Indicateurs Financiers</h1>
          <p className="text-gray-600 mt-2">
            Collection complète d'indicateurs techniques, fondamentaux et macroéconomiques
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {Object.keys(indicatorCategories).reduce((total, cat) => 
            total + Object.keys(indicatorCategories[cat].indicators).length, 0
          )} Indicateurs
        </Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(indicatorCategories).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(indicatorCategories).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sélection d'indicateur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez un indicateur à calculer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un indicateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(category.indicators).map(([key, indicator]) => (
                        <SelectItem key={key} value={key}>
                          {indicator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedIndicator && category.indicators[selectedIndicator] && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          {category.indicators[selectedIndicator].description}
                        </p>
                      </div>

                      {/* Paramètres */}
                      {Object.entries(parameters).map(([param, value]) => (
                        <div key={param}>
                          <label className="block text-sm font-medium mb-1 capitalize">
                            {param.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </label>
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => handleParameterChange(param, e.target.value)}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Résultat */}
              <Card>
                <CardHeader>
                  <CardTitle>Calcul en Temps Réel</CardTitle>
                  <CardDescription>
                    Résultat basé sur les données d'exemple
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderIndicatorResult()}
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Points de données:</span>
                    <span className="font-mono">{sampleData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix actuel:</span>
                    <span className="font-mono">
                      ${sampleData[sampleData.length - 1]?.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variation:</span>
                    <span className={`font-mono ${
                      sampleData.length > 1 && 
                      sampleData[sampleData.length - 1]?.price > sampleData[sampleData.length - 2]?.price
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sampleData.length > 1 ? (
                        ((sampleData[sampleData.length - 1]?.price - sampleData[sampleData.length - 2]?.price) / 
                         sampleData[sampleData.length - 2]?.price * 100).toFixed(2)
                      ) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphique */}
            <Card>
              <CardHeader>
                <CardTitle>Visualisation</CardTitle>
                <CardDescription>
                  Prix de l'actif et indicateur sélectionné
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderChart()}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default IndicatorLibrary;

