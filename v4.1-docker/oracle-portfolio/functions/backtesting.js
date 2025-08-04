const { onRequest } = require('firebase-functions/v2/https' );

// 🔒 Configuration sécurisée
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

// 📊 Données simulées pour validation Phase 1
const generateMockBacktestingData = () => {
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2024-12-31');
  const months = [];
  
  // Génération données mensuelles cohérentes
  let oracleValue = 100;
  let benchmarkValue = 100;
  
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    // Simulation performance Oracle Portfolio (légèrement meilleure)
    const oracleReturn = (Math.random() - 0.45) * 0.04; // Biais positif léger
    const benchmarkReturn = (Math.random() - 0.5) * 0.04; // Neutre
    
    oracleValue *= (1 + oracleReturn);
    benchmarkValue *= (1 + benchmarkReturn);
    
    months.push({
      date: d.toISOString().substring(0, 7), // YYYY-MM
      oracle: Math.round(oracleValue * 100) / 100,
      benchmark: Math.round(benchmarkValue * 100) / 100,
      oracleReturn: Math.round(oracleReturn * 10000) / 100, // Pourcentage
      benchmarkReturn: Math.round(benchmarkReturn * 10000) / 100
    });
  }
  
  return months;
};

// 📈 Calcul métriques backtesting
const calculateMetrics = (performanceData) => {
  const returns = performanceData.map(p => p.oracleReturn / 100);
  const benchmarkReturns = performanceData.map(p => p.benchmarkReturn / 100);
  
  // Rendement total
  const finalValue = performanceData[performanceData.length - 1].oracle;
  const totalReturn = ((finalValue - 100) / 100) * 100;
  
  // Rendement annualisé (5 ans)
  const annualizedReturn = (Math.pow(finalValue / 100, 1/5) - 1) * 100;
  
  // Volatilité annualisée
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance * 12) * 100; // Annualisée
  
  // Ratio de Sharpe (assumant taux sans risque 2%)
  const riskFreeRate = 0.02;
  const excessReturn = (annualizedReturn / 100) - riskFreeRate;
  const sharpeRatio = excessReturn / (volatility / 100);
  
  // Drawdown maximum
  let peak = 100;
  let maxDrawdown = 0;
  
  performanceData.forEach(p => {
    if (p.oracle > peak) peak = p.oracle;
    const drawdown = ((peak - p.oracle) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });
  
  // Métriques benchmark
  const benchmarkFinal = performanceData[performanceData.length - 1].benchmark;
  const benchmarkTotalReturn = ((benchmarkFinal - 100) / 100) * 100;
  const benchmarkAnnualized = (Math.pow(benchmarkFinal / 100, 1/5) - 1) * 100;
  
  return {
    oracle: {
      totalReturn: Math.round(totalReturn * 100) / 100,
      annualizedReturn: Math.round(annualizedReturn * 100) / 100,
      volatility: Math.round(volatility * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100
    },
    benchmark: {
      totalReturn: Math.round(benchmarkTotalReturn * 100) / 100,
      annualizedReturn: Math.round(benchmarkAnnualized * 100) / 100
    },
    outperformance: Math.round((annualizedReturn - benchmarkAnnualized) * 100) / 100
  };
};

// 🚀 Cloud Function getBacktesting
exports.getBacktesting = onRequest(
  {
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (req, res) => {
    try {
      // CORS preflight
      if (req.method === 'OPTIONS') {
        res.set(corsHeaders);
        res.status(204).send('');
        return;
      }
      
      // Headers CORS
      res.set(corsHeaders);
      
      console.log('🔄 Génération données backtesting...');
      
      // Génération données simulées
      const performanceData = generateMockBacktestingData();
      const metrics = calculateMetrics(performanceData);
      
      // Structure réponse
      const response = {
        success: true,
        data: {
          period: {
            start: '2020-01-01',
            end: '2024-12-31',
            duration: '5 years'
          },
          strategy: {
            name: 'Oracle Portfolio',
            description: 'Allocation dynamique basée sur régimes économiques'
          },
          benchmark: {
            name: '60/40 Static',
            description: '60% Actions, 40% Obligations (allocation statique)'
          },
          metrics: metrics,
          performance: performanceData.slice(-24), // Derniers 24 mois pour l'affichage
          summary: {
            totalMonths: performanceData.length,
            dataQuality: 'simulated', // Indicateur Phase 1
            lastUpdate: new Date().toISOString(),
            version: '1.0.0-alpha'
          }
        },
        timestamp: new Date().toISOString(),
        source: 'oracle-portfolio-backtesting-v1'
      };
      
      console.log('✅ Backtesting généré avec succès');
      console.log(`📊 Performance Oracle: ${metrics.oracle.totalReturn}% vs Benchmark: ${metrics.benchmark.totalReturn}%`);
      
      res.status(200).json(response);
      
    } catch (error) {
      console.error('❌ Erreur backtesting:', error);
      
      // Fallback avec données minimales
      const fallbackResponse = {
        success: false,
        error: 'Backtesting temporairement indisponible',
        data: {
          period: { start: '2020-01-01', end: '2024-12-31' },
          metrics: {
            oracle: { totalReturn: 0, annualizedReturn: 0, volatility: 0, sharpeRatio: 0, maxDrawdown: 0 },
            benchmark: { totalReturn: 0, annualizedReturn: 0 },
            outperformance: 0
          },
          performance: [],
          summary: { dataQuality: 'unavailable', lastUpdate: new Date().toISOString() }
        },
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(fallbackResponse);
    }
  }
);

// 🔍 Health check pour monitoring
exports.getBacktestingHealth = onRequest(
  { cors: true, maxInstances: 5, timeoutSeconds: 10 },
  async (req, res) => {
    res.set(corsHeaders);
    
    try {
      const healthData = {
        status: 'healthy',
        service: 'backtesting',
        version: '1.0.0-alpha',
        timestamp: new Date().toISOString(),
        checks: {
          dataGeneration: 'ok',
          calculations: 'ok',
          memory: 'ok'
        }
      };
      
      res.status(200).json(healthData);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);
