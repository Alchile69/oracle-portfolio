import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import IndicatorLibrary from './IndicatorLibrary';
import AdvancedAnalytics from './AdvancedAnalytics';

const IndicatorDashboard = () => {
  const [marketOverview, setMarketOverview] = useState({});
  const [indicatorSignals, setIndicatorSignals] = useState([]);
  const [alertLevel, setAlertLevel] = useState('normal');

  // Simulation des données de marché en temps réel
  useEffect(() => {
    const updateMarketData = () => {
      // Simulation des indicateurs principaux
      const vix = Math.random() * 40 + 10;
      const spyPrice = 400 + Math.random() * 100;
      const yieldCurve = Math.random() * 2 - 0.5;
      const dxy = 100 + Math.random() * 10;
      const gold = 1800 + Math.random() * 200;
      const oil = 70 + Math.random() * 30;
      
      setMarketOverview({
        vix: vix,
        spyPrice: spyPrice,
        yieldCurve: yieldCurve,
        dxy: dxy,
        gold: gold,
        oil: oil,
        lastUpdate: new Date()
      });

      // Génération des signaux d'indicateurs
      const signals = [
        {
          id: 'rsi_spy',
          name: 'RSI S&P 500',
          value: Math.random() * 100,
          signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
          strength: Math.random() * 100,
          category: 'technical'
        },
        {
          id: 'macd_spy',
          name: 'MACD S&P 500',
          value: (Math.random() - 0.5) * 10,
          signal: Math.random() > 0.5 ? 'bullish' : 'bearish',
          strength: Math.random() * 100,
          category: 'technical'
        },
        {
          id: 'yield_curve',
          name: 'Courbe des Taux',
          value: yieldCurve,
          signal: yieldCurve > 0 ? 'bullish' : 'bearish',
          strength: Math.abs(yieldCurve) * 50,
          category: 'macro'
        },
        {
          id: 'vix_level',
          name: 'Niveau VIX',
          value: vix,
          signal: vix > 25 ? 'bearish' : vix < 15 ? 'bullish' : 'neutral',
          strength: Math.abs(vix - 20) * 5,
          category: 'volatility'
        },
        {
          id: 'dollar_strength',
          name: 'Force du Dollar',
          value: dxy,
          signal: dxy > 105 ? 'bearish' : dxy < 95 ? 'bullish' : 'neutral',
          strength: Math.abs(dxy - 100) * 10,
          category: 'currency'
        }
      ];

      setIndicatorSignals(signals);

      // Détermination du niveau d'alerte global
      const bearishSignals = signals.filter(s => s.signal === 'bearish').length;
      const totalSignals = signals.length;
      
      if (bearishSignals / totalSignals > 0.6) {
        setAlertLevel('high');
      } else if (bearishSignals / totalSignals > 0.4) {
        setAlertLevel('medium');
      } else {
        setAlertLevel('normal');
      }
    };

    updateMarketData();
    const interval = setInterval(updateMarketData, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'bullish': return 'text-green-600 bg-green-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      case 'neutral': return '➡️';
      default: return '❓';
    }
  };

  const getAlertConfig = (level) => {
    switch (level) {
      case 'high':
        return {
          color: 'border-red-500 bg-red-50',
          textColor: 'text-red-800',
          icon: '🚨',
          title: 'Alerte Élevée',
          description: 'Plusieurs indicateurs montrent des signaux baissiers'
        };
      case 'medium':
        return {
          color: 'border-yellow-500 bg-yellow-50',
          textColor: 'text-yellow-800',
          icon: '⚠️',
          title: 'Vigilance Requise',
          description: 'Signaux mixtes détectés sur le marché'
        };
      default:
        return {
          color: 'border-green-500 bg-green-50',
          textColor: 'text-green-800',
          icon: '✅',
          title: 'Conditions Normales',
          description: 'Les indicateurs montrent des conditions de marché stables'
        };
    }
  };

  const alertConfig = getAlertConfig(alertLevel);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard des Indicateurs</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble complète des indicateurs financiers et signaux de marché
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Dernière mise à jour</div>
          <div className="text-sm font-mono">
            {marketOverview.lastUpdate?.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Alerte Globale */}
      <Alert className={alertConfig.color}>
        <AlertDescription className={alertConfig.textColor}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{alertConfig.icon}</span>
            <div>
              <div className="font-semibold">{alertConfig.title}</div>
              <div className="text-sm">{alertConfig.description}</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Vue d'ensemble du marché */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIX</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">
              {marketOverview.vix?.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Volatilité</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              ${marketOverview.spyPrice?.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Prix</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Courbe 10Y-2Y</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${marketOverview.yieldCurve > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marketOverview.yieldCurve > 0 ? '+' : ''}{marketOverview.yieldCurve?.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-600">Spread</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DXY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">
              {marketOverview.dxy?.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Dollar Index</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Or</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-600">
              ${marketOverview.gold?.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Once</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pétrole</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">
              ${marketOverview.oil?.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Baril</div>
          </CardContent>
        </Card>
      </div>

      {/* Signaux d'Indicateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Signaux d'Indicateurs en Temps Réel</CardTitle>
          <CardDescription>
            Synthèse des principaux signaux techniques et macroéconomiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indicatorSignals.map((indicator) => (
              <div key={indicator.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{indicator.name}</div>
                  <Badge className={getSignalColor(indicator.signal)}>
                    {getSignalIcon(indicator.signal)} {indicator.signal}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2">
                  {typeof indicator.value === 'number' ? indicator.value.toFixed(2) : indicator.value}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Force du signal</span>
                    <span>{indicator.strength.toFixed(0)}%</span>
                  </div>
                  <Progress value={indicator.strength} className="h-2" />
                </div>
                <Badge variant="outline" className="mt-2 text-xs">
                  {indicator.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Onglets pour les analyses détaillées */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Avancés</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des Signaux</CardTitle>
                <CardDescription>
                  Répartition des signaux par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['technical', 'macro', 'volatility', 'currency'].map((category) => {
                    const categorySignals = indicatorSignals.filter(s => s.category === category);
                    const bullishCount = categorySignals.filter(s => s.signal === 'bullish').length;
                    const bearishCount = categorySignals.filter(s => s.signal === 'bearish').length;
                    const neutralCount = categorySignals.filter(s => s.signal === 'neutral').length;
                    const total = categorySignals.length;

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium">{category}</span>
                          <span className="text-sm text-gray-600">{total} indicateurs</span>
                        </div>
                        <div className="flex space-x-1 h-4 rounded overflow-hidden">
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${(bullishCount / total) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500" 
                            style={{ width: `${(bearishCount / total) * 100}%` }}
                          />
                          <div 
                            className="bg-yellow-500" 
                            style={{ width: `${(neutralCount / total) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>🟢 {bullishCount}</span>
                          <span>🔴 {bearishCount}</span>
                          <span>🟡 {neutralCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>
                  Actions suggérées basées sur l'analyse des indicateurs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertLevel === 'high' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      <div className="font-semibold mb-1">🚨 Action Immédiate Requise</div>
                      <ul className="text-sm space-y-1">
                        <li>• Réduire l'exposition aux actifs risqués</li>
                        <li>• Augmenter les positions défensives</li>
                        <li>• Surveiller étroitement les niveaux de support</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {alertLevel === 'medium' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-800">
                      <div className="font-semibold mb-1">⚠️ Vigilance Recommandée</div>
                      <ul className="text-sm space-y-1">
                        <li>• Maintenir une allocation équilibrée</li>
                        <li>• Surveiller l'évolution des indicateurs</li>
                        <li>• Préparer des stratégies de couverture</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {alertLevel === 'normal' && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      <div className="font-semibold mb-1">✅ Conditions Favorables</div>
                      <ul className="text-sm space-y-1">
                        <li>• Maintenir l'allocation stratégique</li>
                        <li>• Considérer des opportunités de croissance</li>
                        <li>• Continuer le monitoring régulier</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Prochaines Actions</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• Révision hebdomadaire des allocations</div>
                    <div>• Mise à jour des seuils de risque</div>
                    <div>• Analyse des corrélations inter-actifs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <IndicatorLibrary />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndicatorDashboard;

