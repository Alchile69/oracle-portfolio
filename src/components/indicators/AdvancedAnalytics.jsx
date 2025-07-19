import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ScatterChart, Scatter
} from 'recharts';
import { 
  technicalIndicators, 
  riskIndicators, 
  sentimentIndicators,
  macroIndicators,
  calculationUtils
} from '../../utils/financialIndicators';

const AdvancedAnalytics = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [riskMetrics, setRiskMetrics] = useState({});
  const [marketRegime, setMarketRegime] = useState('expansion');
  const [confidenceScore, setConfidenceScore] = useState(75);

  // Génération de données de portfolio simulées
  useEffect(() => {
    const generatePortfolioData = () => {
      const data = [];
      let portfolioValue = 1000000;
      let spyValue = 100;
      
      for (let i = 0; i < 252; i++) { // 1 année de données
        const date = new Date();
        date.setDate(date.getDate() - (252 - i));
        
        // Simulation des rendements corrélés
        const marketReturn = (Math.random() - 0.5) * 0.04;
        const portfolioReturn = marketReturn * 0.8 + (Math.random() - 0.5) * 0.02;
        
        portfolioValue *= (1 + portfolioReturn);
        spyValue *= (1 + marketReturn);
        
        data.push({
          date: date.toISOString().split('T')[0],
          portfolioValue: portfolioValue,
          spyValue: spyValue,
          portfolioReturn: portfolioReturn,
          marketReturn: marketReturn,
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      }
      return data;
    };
    
    setPortfolioData(generatePortfolioData());
  }, []);

  // Calcul des analytics avancés
  useEffect(() => {
    if (portfolioData.length > 0) {
      const returns = portfolioData.map(d => d.portfolioReturn);
      const marketReturns = portfolioData.map(d => d.marketReturn);
      const prices = portfolioData.map(d => d.portfolioValue);
      
      // Calculs de risque
      const var95 = riskIndicators.valueAtRisk(returns, 0.05);
      const cvar95 = riskIndicators.conditionalVaR(returns, 0.05);
      const maxDD = riskIndicators.maxDrawdown(prices);
      const sharpe = riskIndicators.sharpeRatio(returns);
      const sortino = riskIndicators.sortinoRatio(returns);
      const beta = riskIndicators.beta(returns, marketReturns);
      
      setRiskMetrics({
        var95: var95 * 100,
        cvar95: cvar95 * 100,
        maxDrawdown: maxDD,
        sharpeRatio: sharpe,
        sortinoRatio: sortino,
        beta: beta,
        volatility: returns.reduce((sum, r) => sum + r * r, 0) / returns.length * Math.sqrt(252) * 100
      });

      // Analytics techniques
      const rsi = technicalIndicators.rsi(prices.slice(-50), 14);
      const macd = technicalIndicators.macd(prices.slice(-50));
      const bollinger = technicalIndicators.bollingerBands(prices.slice(-50));
      
      // Sentiment simulé
      const fearGreed = sentimentIndicators.fearGreedIndex(
        Math.random() * 40 + 10, // VIX
        Math.random() * 100,     // Momentum
        Math.random() * 100,     // Demand
        Math.random() * 100,     // Breadth
        Math.random() * 100,     // Options
        Math.random() * 100,     // Bonds
        Math.random() * 100      // Safe Haven
      );
      
      setAnalytics({
        rsi: rsi,
        macd: macd,
        bollinger: bollinger,
        fearGreedIndex: fearGreed,
        trendStrength: Math.abs(returns.slice(-20).reduce((sum, r) => sum + r, 0)) * 100,
        momentum: returns.slice(-5).reduce((sum, r) => sum + r, 0) * 100
      });

      // Détection du régime de marché
      const recentVolatility = returns.slice(-30).reduce((sum, r) => sum + r * r, 0) / 30 * Math.sqrt(252);
      const recentReturn = returns.slice(-30).reduce((sum, r) => sum + r, 0) / 30 * 252;
      
      if (recentReturn > 0.1 && recentVolatility < 0.2) {
        setMarketRegime('expansion');
      } else if (recentReturn < -0.05 && recentVolatility > 0.25) {
        setMarketRegime('recession');
      } else if (recentReturn > 0 && recentVolatility > 0.3) {
        setMarketRegime('stagflation');
      } else {
        setMarketRegime('transition');
      }

      // Score de confiance basé sur plusieurs facteurs
      const confidence = Math.min(100, Math.max(0, 
        50 + 
        (sharpe > 1 ? 20 : sharpe > 0.5 ? 10 : -10) +
        (maxDD < 10 ? 15 : maxDD < 20 ? 5 : -15) +
        (Math.abs(beta - 1) < 0.2 ? 10 : -5) +
        (rsi > 30 && rsi < 70 ? 10 : -5)
      ));
      setConfidenceScore(confidence);
    }
  }, [portfolioData]);

  const getRegimeColor = (regime) => {
    const colors = {
      expansion: 'bg-green-100 text-green-800',
      recession: 'bg-red-100 text-red-800',
      stagflation: 'bg-yellow-100 text-yellow-800',
      transition: 'bg-blue-100 text-blue-800'
    };
    return colors[regime] || colors.transition;
  };

  const getRegimeIcon = (regime) => {
    const icons = {
      expansion: '🚀',
      recession: '📉',
      stagflation: '🔥',
      transition: '🔄'
    };
    return icons[regime] || icons.transition;
  };

  const getRiskLevel = (value, thresholds) => {
    if (value <= thresholds.low) return { level: 'Faible', color: 'text-green-600' };
    if (value <= thresholds.medium) return { level: 'Modéré', color: 'text-yellow-600' };
    return { level: 'Élevé', color: 'text-red-600' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Avancés</h1>
          <p className="text-gray-600 mt-2">
            Analyse approfondie avec indicateurs techniques, risques et sentiment
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getRegimeColor(marketRegime)}>
            {getRegimeIcon(marketRegime)} {marketRegime.charAt(0).toUpperCase() + marketRegime.slice(1)}
          </Badge>
          <div className="text-right">
            <div className="text-sm text-gray-600">Score de Confiance</div>
            <div className="text-2xl font-bold text-blue-600">{confidenceScore}%</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="risk" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risk">Analyse de Risque</TabsTrigger>
          <TabsTrigger value="technical">Indicateurs Techniques</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment de Marché</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">VaR 95%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {riskMetrics.var95?.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Perte maximale probable (95% confiance)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {riskMetrics.maxDrawdown?.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Plus grande perte depuis un pic
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ratio de Sharpe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {riskMetrics.sharpeRatio?.toFixed(2)}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Rendement ajusté du risque
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bêta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {riskMetrics.beta?.toFixed(2)}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Sensibilité au marché
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des Rendements</CardTitle>
                <CardDescription>
                  Analyse de la distribution des rendements quotidiens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={portfolioData.slice(-60).map((d, i) => ({
                    day: i + 1,
                    return: d.portfolioReturn * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Rendement']} />
                    <Bar dataKey="return" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques de Risque</CardTitle>
                <CardDescription>
                  Évaluation multidimensionnelle du risque
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Volatilité Annualisée</span>
                    <span className="font-mono">{riskMetrics.volatility?.toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.min(100, riskMetrics.volatility || 0)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>CVaR 95%</span>
                    <span className="font-mono text-red-600">{riskMetrics.cvar95?.toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.min(100, Math.abs(riskMetrics.cvar95 || 0) * 10)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Ratio de Sortino</span>
                    <span className="font-mono text-green-600">{riskMetrics.sortinoRatio?.toFixed(2)}</span>
                  </div>
                  <Progress value={Math.min(100, Math.max(0, (riskMetrics.sortinoRatio || 0) * 20 + 50))} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">RSI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.rsi?.toFixed(0)}
                </div>
                <div className="mt-2">
                  <Progress value={analytics.rsi || 0} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Survente (30)</span>
                    <span>Surachat (70)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Force de Tendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.trendStrength?.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Intensité de la tendance actuelle
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Momentum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${analytics.momentum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.momentum > 0 ? '+' : ''}{analytics.momentum?.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Momentum sur 5 jours
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analyse Technique Avancée</CardTitle>
              <CardDescription>
                Combinaison d'indicateurs techniques pour l'analyse de tendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={portfolioData.slice(-60).map((d, i) => ({
                  date: d.date,
                  price: d.portfolioValue / 1000,
                  sma20: i >= 19 ? portfolioData.slice(i-19, i+1).reduce((sum, item) => sum + item.portfolioValue, 0) / 20 / 1000 : null,
                  volume: d.volume / 1000000
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="price" orientation="left" />
                  <YAxis yAxisId="volume" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="volume" type="monotone" dataKey="volume" fill="#e5e7eb" fillOpacity={0.3} />
                  <Line yAxisId="price" type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
                  <Line yAxisId="price" type="monotone" dataKey="sma20" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Indice Fear & Greed</CardTitle>
                <CardDescription>
                  Sentiment composite du marché (0 = Peur extrême, 100 = Cupidité extrême)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {analytics.fearGreedIndex?.toFixed(0)}
                  </div>
                  <Progress value={analytics.fearGreedIndex || 0} className="h-4" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Peur Extrême</span>
                    <span>Neutre</span>
                    <span>Cupidité Extrême</span>
                  </div>
                  <Badge className={
                    analytics.fearGreedIndex < 25 ? 'bg-red-100 text-red-800' :
                    analytics.fearGreedIndex < 45 ? 'bg-orange-100 text-orange-800' :
                    analytics.fearGreedIndex < 55 ? 'bg-yellow-100 text-yellow-800' :
                    analytics.fearGreedIndex < 75 ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {analytics.fearGreedIndex < 25 ? '😨 Peur Extrême' :
                     analytics.fearGreedIndex < 45 ? '😟 Peur' :
                     analytics.fearGreedIndex < 55 ? '😐 Neutre' :
                     analytics.fearGreedIndex < 75 ? '😊 Cupidité' :
                     '🤑 Cupidité Extrême'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Régime de Marché</CardTitle>
                <CardDescription>
                  Classification automatique du régime économique actuel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">{getRegimeIcon(marketRegime)}</div>
                  <div className="text-2xl font-bold capitalize">{marketRegime}</div>
                  <Badge className={getRegimeColor(marketRegime)} variant="outline">
                    Régime Détecté
                  </Badge>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="text-sm font-medium">Caractéristiques:</div>
                  {marketRegime === 'expansion' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Croissance économique forte</li>
                      <li>• Volatilité modérée</li>
                      <li>• Sentiment positif</li>
                    </ul>
                  )}
                  {marketRegime === 'recession' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Contraction économique</li>
                      <li>• Volatilité élevée</li>
                      <li>• Sentiment négatif</li>
                    </ul>
                  )}
                  {marketRegime === 'stagflation' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Croissance faible</li>
                      <li>• Inflation élevée</li>
                      <li>• Incertitude élevée</li>
                    </ul>
                  )}
                  {marketRegime === 'transition' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Signaux mixtes</li>
                      <li>• Volatilité variable</li>
                      <li>• Direction incertaine</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertDescription>
              Les indicateurs de sentiment sont basés sur des données simulées. 
              En production, ils seraient alimentés par des sources de données réelles 
              (VIX, ratios put/call, enquêtes de sentiment, etc.).
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance vs Benchmark</CardTitle>
                <CardDescription>
                  Comparaison avec l'indice de référence (SPY)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioData.map((d, i) => ({
                    date: d.date,
                    portfolio: ((d.portfolioValue / portfolioData[0].portfolioValue) - 1) * 100,
                    benchmark: ((d.spyValue / portfolioData[0].spyValue) - 1) * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, '']} />
                    <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={2} name="Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="#ef4444" strokeWidth={2} name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse de Performance</CardTitle>
                <CardDescription>
                  Métriques de performance détaillées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Rendement Total</div>
                    <div className="text-lg font-bold text-green-600">
                      {((portfolioData[portfolioData.length - 1]?.portfolioValue / portfolioData[0]?.portfolioValue - 1) * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Rendement Annualisé</div>
                    <div className="text-lg font-bold text-blue-600">
                      {(Math.pow(portfolioData[portfolioData.length - 1]?.portfolioValue / portfolioData[0]?.portfolioValue, 252 / portfolioData.length) - 1).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Alpha</div>
                    <div className="text-lg font-bold text-purple-600">
                      {((portfolioData[portfolioData.length - 1]?.portfolioValue / portfolioData[0]?.portfolioValue) - 
                        (portfolioData[portfolioData.length - 1]?.spyValue / portfolioData[0]?.spyValue)).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Information Ratio</div>
                    <div className="text-lg font-bold text-indigo-600">
                      {(riskMetrics.sharpeRatio / Math.sqrt(riskMetrics.beta || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;

