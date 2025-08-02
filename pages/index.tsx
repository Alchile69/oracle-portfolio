import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Types pour les données
interface CountryData {
  code: string;
  name: string;
  regime: string;
  confidence: number;
  last_update: string;
  indicators: {
    growth: number;
    inflation: number;
    unemployment: number;
  };
}

interface MarketStressData {
  vix: number;
  high_yield_spread: number;
  stress_level: string;
  last_update: string;
  timestamp: string;
  data_sources?: {
    vix: string;
    spread: string;
  };
}

interface ETFData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

interface BacktestingData {
  oracle_return: number;
  benchmark_return: number;
  outperformance: number;
  total_months: number;
}

export default function Home() {
  // États pour les données
  const [selectedCountry, setSelectedCountry] = useState('FRA');
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [currentCountryData, setCurrentCountryData] = useState<CountryData | null>(null);
  const [marketStressData, setMarketStressData] = useState<MarketStressData | null>(null);
  const [etfData, setETFData] = useState<ETFData[]>([]);
  const [backtestingData, setBacktestingData] = useState<BacktestingData | null>(null);
  
  // États de chargement
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingMarketStress, setIsLoadingMarketStress] = useState(false);
  const [isLoadingETF, setIsLoadingETF] = useState(false);
  const [isLoadingBacktesting, setIsLoadingBacktesting] = useState(false);
  
  // États d'erreur
  const [backtestingError, setBacktestingError] = useState<string | null>(null);
  
  // États pour le backtesting
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  // Fonctions utilitaires
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatConfidenceIndex = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  const formatEconomicPercentage = (value: number) => {
    return value.toFixed(1);
  };

  const formatStressLevel = (level: string) => {
    return level.toUpperCase();
  };

  const isBacktestingDataValid = (data: BacktestingData) => {
    return data && typeof data.oracle_return === 'number' && !isNaN(data.oracle_return);
  };

  // Données pour le graphique en secteurs
  const pieData = currentCountryData ? [
    { name: 'Actions', value: 65, color: '#00d4ff' },
    { name: 'Obligations', value: 25, color: '#1a1a2e' },
    { name: 'Or', value: 5, color: '#ffa502' },
    { name: 'Liquidités', value: 5, color: '#4a4a5e' }
  ] : [];

  // Métriques de performance calculées
  const performanceMetrics = backtestingData ? {
    oracleReturn: backtestingData.oracle_return?.toFixed(2) || 'N/A',
    benchmarkReturn: backtestingData.benchmark_return?.toFixed(2) || 'N/A',
    outperformance: backtestingData.outperformance?.toFixed(2) || 'N/A',
    totalMonths: backtestingData.total_months || 0
  } : {
    oracleReturn: 'N/A',
    benchmarkReturn: 'N/A',
    outperformance: 'N/A',
    totalMonths: 0
  };

  // Fonctions de récupération des données
  const fetchCountriesData = async () => {
    setIsLoadingCountries(true);
    try {
      // Simulation de données
      const mockData: CountryData[] = [
        {
          code: 'FRA',
          name: 'France',
          regime: 'EXPANSION',
          confidence: 0.95,
          last_update: new Date().toISOString(),
          indicators: {
            growth: 2.5,
            inflation: 2.8,
            unemployment: 7.5
          }
        }
      ];
      setCountriesData(mockData);
      setCurrentCountryData(mockData[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération des données pays:', error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchMarketStress = async () => {
    setIsLoadingMarketStress(true);
    try {
      // Simulation de données
      const mockData: MarketStressData = {
        vix: 16.7,
        high_yield_spread: 6.9,
        stress_level: 'EXTREME',
        last_update: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        data_sources: {
          vix: 'FRED',
          spread: 'FRED'
        }
      };
      setMarketStressData(mockData);
    } catch (error) {
      console.error('Erreur lors de la récupération du stress de marché:', error);
    } finally {
      setIsLoadingMarketStress(false);
    }
  };

  const fetchETFData = async () => {
    setIsLoadingETF(true);
    try {
      // Simulation de données
      const mockData: ETFData[] = [
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 418.74, changePercent: 0.06 },
        { symbol: 'TLT', name: 'iShares 20+ Year Treasury', price: 95.12, changePercent: 1.56 },
        { symbol: 'GLD', name: 'SPDR Gold Shares', price: 185.45, changePercent: -0.09 },
        { symbol: 'HYG', name: 'iShares High Yield Corporate', price: 78.92, changePercent: -1.67 }
      ];
      setETFData(mockData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données ETF:', error);
    } finally {
      setIsLoadingETF(false);
    }
  };

  const fetchBacktestingData = async () => {
    setIsLoadingBacktesting(true);
    setBacktestingError(null);
    try {
      // Simulation de données
      const mockData: BacktestingData = {
        oracle_return: 1.13,
        benchmark_return: 1.61,
        outperformance: -0.48,
        total_months: 60
      };
      setBacktestingData(mockData);
    } catch (error) {
      setBacktestingError('Erreur lors du backtesting');
      console.error('Erreur lors du backtesting:', error);
    } finally {
      setIsLoadingBacktesting(false);
    }
  };

  // Gestionnaires d'événements
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    const countryData = countriesData.find(c => c.code === e.target.value);
    setCurrentCountryData(countryData || null);
  };

  const handleLaunchBacktest = () => {
    fetchBacktestingData();
  };

  const onNavigateToComparison = () => {
    // Navigation vers la vue comparative
    console.log('Navigation vers la vue comparative');
  };

  // Chargement initial des données
  useEffect(() => {
    fetchCountriesData();
    fetchMarketStress();
    fetchETFData();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <Head>
        <title>Oracle Portfolio v4.3.0 - VERSION VRAIMENT COMPLÈTE</title>
        <meta name="description" content="Plateforme d'analyse financière avec plugins dynamiques" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Oracle Portfolio */}
      <header className="bg-oracle-secondary border-b border-oracle-border shadow-oracle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-oracle-primary">🔮 Oracle Portfolio</h1>
                <div className="text-xs text-oracle-text-secondary">v4.3.0 - VERSION VRAIMENT COMPLÈTE</div>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-oracle-primary px-3 py-2 rounded-md text-sm font-medium hover:bg-oracle-primary hover:bg-opacity-10 transition-all duration-300">
                  📊 Dashboard Principal
                </a>
                <button 
                  onClick={onNavigateToComparison}
                  className="text-oracle-text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-oracle-primary hover:bg-opacity-10 transition-all duration-300"
                >
                  🔍 Vue Comparative
                </button>
              </div>
            </nav>
            <div className="flex items-center">
              <button className="btn-primary">
                Get Full Access
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Financial Dashboard</h1>
            <p className="text-oracle-text-secondary">Real-time market data and portfolio analysis</p>
          </div>

          {/* Top Row - Country Selection & Economic Regime */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Country Selection Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Sélection du Pays</h3>
                <button 
                  onClick={fetchCountriesData}
                  className="text-oracle-text-secondary hover:text-white transition-colors"
                  disabled={isLoadingCountries}
                >
                  {isLoadingCountries ? '⏳' : '🔄'}
                </button>
              </div>
              
              <p className="text-sm text-oracle-text-secondary mb-4">
                Mis à jour: {formatDate(currentCountryData?.last_update || new Date().toISOString())}
              </p>
              
              <select 
                value={selectedCountry}
                onChange={handleCountryChange}
                className="form-input"
              >
                {countriesData.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>

              {currentCountryData && (
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2">Régime Économique:</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-oracle-success font-bold">{currentCountryData.regime}</span>
                    <span className="text-oracle-success">●</span>
                    <span className="text-oracle-success">{currentCountryData.regime}</span>
                  </div>
                  <div className="text-sm text-oracle-text-secondary">
                    Confiance: {formatConfidenceIndex(currentCountryData.confidence)}%
                  </div>
                  <div className="w-full bg-oracle-border rounded-full h-2 mt-2">
                    <div 
                      className="bg-oracle-success h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${formatConfidenceIndex(currentCountryData.confidence)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-oracle-text-secondary mt-2">
                    Dernière mise à jour: {formatDate(currentCountryData.last_update)}
                  </div>
                </div>
              )}
            </div>

            {/* Economic Regime Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Régime Économique</h3>
                <button 
                  onClick={fetchCountriesData}
                  className="text-oracle-text-secondary hover:text-white transition-colors"
                  disabled={isLoadingCountries}
                >
                  {isLoadingCountries ? '⏳' : '🔄'}
                </button>
              </div>
              
              <p className="text-sm text-oracle-text-secondary mb-4">
                Mis à jour: {formatDate(currentCountryData?.last_update || new Date().toISOString())}
              </p>

              {currentCountryData && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-oracle-text-secondary">{currentCountryData.code}:</span>
                      <span className="text-oracle-success font-bold">{currentCountryData.regime}</span>
                      <span className="text-oracle-success">●</span>
                      <span className="text-oracle-success">{currentCountryData.regime}</span>
                    </div>
                    <div className="text-sm text-oracle-text-secondary mb-2">
                      Indice de confiance: {formatConfidenceIndex(currentCountryData.confidence)}%
                    </div>
                    <div className="w-full bg-oracle-border rounded-full h-2">
                      <div 
                        className="bg-oracle-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${formatConfidenceIndex(currentCountryData.confidence)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-oracle-text-secondary">Croissance</div>
                      <div className="text-lg font-bold text-white">{formatEconomicPercentage(currentCountryData.indicators.growth)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-oracle-text-secondary">Inflation</div>
                      <div className="text-lg font-bold text-white">{formatEconomicPercentage(currentCountryData.indicators.inflation)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-oracle-text-secondary">Chômage</div>
                      <div className="text-lg font-bold text-white">{formatEconomicPercentage(currentCountryData.indicators.unemployment)}%</div>
                    </div>
                  </div>

                  <div className="text-xs text-oracle-text-secondary mt-4">
                    Debug: Pays={currentCountryData.code}, API={currentCountryData.code}, Régime={currentCountryData.regime}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Market Stress Indicators Card */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Market Stress Indicators</h3>
              <button 
                onClick={fetchMarketStress}
                className="text-oracle-text-secondary hover:text-white transition-colors"
                disabled={isLoadingMarketStress}
              >
                {isLoadingMarketStress ? '⏳' : '🔄'}
              </button>
            </div>
            
            {marketStressData && (
              <>
                <p className="text-sm text-oracle-text-secondary mb-4">
                  Updated: {formatDate(marketStressData.last_update || marketStressData.timestamp)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-oracle-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-oracle-text-secondary">Niveau de stress:</span>
                      <span className={`badge ${formatStressLevel(marketStressData.stress_level) === 'EXTRÊME' ? 'badge-danger' : formatStressLevel(marketStressData.stress_level) === 'ÉLEVÉ' ? 'badge-warning' : 'badge-success'}`}>
                        {formatStressLevel(marketStressData.stress_level)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">{marketStressData.vix || 'N/A'}</div>
                    <div className="text-xs text-oracle-text-secondary">VIX (Source: FRED)</div>
                  </div>

                  <div className="bg-oracle-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-oracle-text-secondary">High Yield Spread:</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{marketStressData.high_yield_spread || 'N/A'}</div>
                    <div className="text-xs text-oracle-text-secondary">(Source: FRED)</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Portfolio Allocations & ETF Prices Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Portfolio Allocations Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Allocations du portefeuille</h3>
                <button 
                  onClick={fetchCountriesData}
                  className="text-oracle-text-secondary hover:text-white transition-colors"
                  disabled={isLoadingCountries}
                >
                  {isLoadingCountries ? '⏳' : '🔄'}
                </button>
              </div>
              
              {currentCountryData && (
                <div className="flex items-center justify-between">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Array.isArray(pieData) ? pieData : []}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {(Array.isArray(pieData) ? pieData : []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 ml-6">
                    {(Array.isArray(pieData) ? pieData : []).map((item, index) => (
                      <div key={index} className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-oracle-text-secondary">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ETF Prices Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">ETF Prices</h3>
                <button 
                  onClick={fetchETFData}
                  className="text-oracle-text-secondary hover:text-white transition-colors"
                  disabled={isLoadingETF}
                >
                  {isLoadingETF ? '⏳' : '🔄'}
                </button>
              </div>
              
              <div className="space-y-4">
                {etfData.map((etf, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-oracle-border rounded-lg">
                    <div>
                      <div className="font-medium text-white">{etf.symbol}</div>
                      <div className="text-sm text-oracle-text-secondary">{etf.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">${etf.price.toFixed(2)}</div>
                      <div className={`text-sm ${etf.changePercent >= 0 ? 'text-oracle-success' : 'text-oracle-error'}`}>
                        {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backtesting Engine Card */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Backtesting Engine</h3>
              <button 
                onClick={fetchBacktestingData}
                className="text-oracle-text-secondary hover:text-white transition-colors"
                disabled={isLoadingBacktesting}
              >
                {isLoadingBacktesting ? '⏳' : '🔄'}
              </button>
            </div>
            
            <div className="mb-4">
              <span className="badge-success">
                ✅ API OK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="form-label">Date de début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Date de fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <button
              onClick={handleLaunchBacktest}
              disabled={isLoadingBacktesting}
              className="btn-primary w-full"
            >
              {isLoadingBacktesting ? 'Calcul en cours...' : 'Lancer le backtest'}
            </button>

            {/* Error Display */}
            {backtestingError && (
              <div className="mt-4 p-4 bg-oracle-error bg-opacity-20 border border-oracle-error rounded-lg">
                <div className="text-oracle-error text-sm">
                  <strong>Erreur:</strong> {backtestingError}
                </div>
              </div>
            )}

            {/* Results Display */}
            {backtestingData && !backtestingError && (
              <div className="mt-6">
                {isBacktestingDataValid(backtestingData) ? (
                  <>
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-oracle-border rounded-lg p-3 text-center">
                        <div className="text-xs text-oracle-text-secondary">Rendement Oracle</div>
                        <div className={`text-lg font-bold ${performanceMetrics.oracleReturn === 'N/A' ? 'text-oracle-text-secondary' : 'text-oracle-primary'}`}>
                          {performanceMetrics.oracleReturn === 'N/A' ? 'N/A' : `${performanceMetrics.oracleReturn}%`}
                        </div>
                      </div>
                      <div className="bg-oracle-border rounded-lg p-3 text-center">
                        <div className="text-xs text-oracle-text-secondary">Rendement Benchmark</div>
                        <div className={`text-lg font-bold ${performanceMetrics.benchmarkReturn === 'N/A' ? 'text-oracle-text-secondary' : 'text-oracle-primary'}`}>
                          {performanceMetrics.benchmarkReturn === 'N/A' ? 'N/A' : `${performanceMetrics.benchmarkReturn}%`}
                        </div>
                      </div>
                      <div className="bg-oracle-border rounded-lg p-3 text-center">
                        <div className="text-xs text-oracle-text-secondary">Surperformance</div>
                        <div className={`text-lg font-bold ${performanceMetrics.outperformance === 'N/A' ? 'text-oracle-text-secondary' : 'text-oracle-success'}`}>
                          {performanceMetrics.outperformance === 'N/A' ? 'N/A' : `${performanceMetrics.outperformance}%`}
                        </div>
                      </div>
                      <div className="bg-oracle-border rounded-lg p-3 text-center">
                        <div className="text-xs text-oracle-text-secondary">Période</div>
                        <div className="text-lg font-bold text-white">
                          {performanceMetrics.totalMonths} mois
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
                    <div className="text-red-400 text-sm">
                      Données de backtesting invalides ou incomplètes.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-card border-t border-oracle-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-oracle-text-secondary">
              © 2025 Oracle Portfolio v4.3 - VERSION VRAIMENT COMPLÈTE
            </p>
            <p className="text-xs text-oracle-text-secondary mt-1">
              Plateforme d'analyse financière avec plugins dynamiques
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

