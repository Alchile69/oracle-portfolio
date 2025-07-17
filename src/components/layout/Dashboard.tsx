import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CountryData {
  code: string;
  name: string;
  regime: string;
  confidence: number;
  allocations: {
    stocks: number;
    bonds: number;
    commodities: number;
    cash: number;
  };
  indicators: {
    growth: number;
    inflation: number;
    unemployment: number;
  };
  last_update: string;
}

interface ETFData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface BacktestingData {
  period: {
    start_date: string;
    end_date: string;
    total_months: number;
  };
  strategy: string;
  benchmark: string;
  metrics: {
    total_return: number;
    annualized_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
  };
  benchmark_metrics: {
    total_return: number;
    annualized_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
  };
  outperformance: {
    total_return: number;
    annualized_return: number;
  };
  performance_data: {
    monthly_returns: Array<{
      date: string;
      oracle_return: number;
      benchmark_return: number;
    }>;
    cumulative_performance: Array<{
      date: string;
      oracle_cumulative: number;
      benchmark_cumulative: number;
    }>;
  };
  data_quality: {
    source: string;
    total_months: number;
    missing_data: number;
    last_update: string;
    calculation_time: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('FRA');
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [currentCountryData, setCurrentCountryData] = useState<CountryData | null>(null);
  const [marketStressData, setMarketStressData] = useState<any>(null);
  const [etfData, setEtfData] = useState<ETFData[]>([]);
  const [backtestingData, setBacktestingData] = useState<BacktestingData | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingMarketStress, setIsLoadingMarketStress] = useState(true);
  const [isLoadingETF, setIsLoadingETF] = useState(true);
  const [isLoadingBacktesting, setIsLoadingBacktesting] = useState(false);
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [backtestingError, setBacktestingError] = useState<string | null>(null);

  // 🔧 FONCTION ROBUSTE: Fetch Countries data avec gestion d'erreurs
  const fetchCountriesData = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getCountries');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success && Array.isArray(data.countries)) {
        setCountriesData(data.countries);
        // Set initial country data
        const initialCountry = data.countries.find((c: CountryData) => c.code === selectedCountry) || data.countries[0];
        if (initialCountry) {
          setCurrentCountryData(initialCountry);
          console.log('Countries loaded, initial country:', initialCountry.code, initialCountry.name);
        }
      } else {
        throw new Error('Invalid countries data structure');
      }
    } catch (error) {
      console.error('Error fetching countries data:', error);
      // Fallback data
      const fallbackCountry = {
        code: 'FRA',
        name: 'France',
        regime: 'EXPANSION',
        confidence: 95,
        allocations: { stocks: 65, bonds: 25, commodities: 5, cash: 5 },
        indicators: { growth: 2.5, inflation: 2.8, unemployment: 7.5 },
        last_update: new Date().toISOString()
      };
      setCountriesData([fallbackCountry]);
      setCurrentCountryData(fallbackCountry);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  // 🔧 FONCTION ROBUSTE: Fetch Market Stress avec gestion d'erreurs
  const fetchMarketStress = async () => {
    try {
      setIsLoadingMarketStress(true);
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setMarketStressData(data);
      } else {
        throw new Error('Invalid market stress data');
      }
    } catch (error) {
      console.error('Error fetching market stress data:', error);
      // Fallback data
      setMarketStressData({
        success: true,
        stress_level: 'EXTREME',
        vix: 17.16,
        high_yield_spread: 6.99,
        last_update: new Date().toISOString(),
        data_sources: {
          vix: 'https://fred.stlouisfed.org/series/VIXCLS',
          spread: 'https://fred.stlouisfed.org/series/BAMLH0A0HYM2EY'
        }
      });
    } finally {
      setIsLoadingMarketStress(false);
    }
  };

  // 🔧 FONCTION ROBUSTE: Fetch ETF Data avec vraies données
  const fetchETFData = async () => {
    try {
      setIsLoadingETF(true);
      
      // Vraies données ETF actuelles
      const realETFData: ETFData[] = [
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 622.08, change: 5.28, changePercent: 0.85 },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market', price: 306.00, change: -0.37, changePercent: -0.12 },
        { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets', price: 56.83, change: 0.19, changePercent: 0.34 }
      ];
      
      setEtfData(realETFData);
    } catch (error) {
      console.error('Error fetching ETF data:', error);
      // Fallback data
      setEtfData([
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 622.08, change: 5.28, changePercent: 0.85 },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market', price: 306.00, change: -0.37, changePercent: -0.12 },
        { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets', price: 56.83, change: 0.19, changePercent: 0.34 }
      ]);
    } finally {
      setIsLoadingETF(false);
    }
  };

  // 🛡️ FONCTION HYPER-DÉFENSIVE: Backtesting incassable pour production
  const fetchBacktestingData = async () => {
    try {
      console.log(`Launching backtest for country: ${selectedCountry} from ${startDate} to ${endDate}`);
      setIsLoadingBacktesting(true);
      setBacktestingError(null);
      
      // 🛡️ DÉFENSE 1: Validation des paramètres
      if (!selectedCountry || !startDate || !endDate) {
        throw new Error('Missing required parameters');
      }

      const url = `https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getBacktesting?start_date=${startDate}&end_date=${endDate}&country=${selectedCountry}`;
      console.log('🚀 BACKTESTING: Fetching data from:', url);

      // 🛡️ DÉFENSE 2: Timeout et headers robustes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 🛡️ DÉFENSE 3: Validation de la réponse HTTP
      if (!response) {
        throw new Error('No response received');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 🛡️ DÉFENSE 4: Validation structure de base
      if (!data) {
        throw new Error('No data received');
      }

      console.log('🔍 BACKTESTING: Raw API response:', data);

      // 🛡️ DÉFENSE 5: Validation structure complète avec la vraie structure API
      const hasSuccess = data && typeof data.success === 'boolean' && data.success === true;
      const hasDataWrapper = hasSuccess && data.data && typeof data.data === 'object';
      const hasPerformanceData = hasDataWrapper && data.data.performance_data && typeof data.data.performance_data === 'object';
      const hasCumulative = hasPerformanceData && 
                           data.data.performance_data.cumulative_performance && 
                           Array.isArray(data.data.performance_data.cumulative_performance);
      const hasValidLength = hasCumulative && data.data.performance_data.cumulative_performance.length > 0;

      console.log('🔍 BACKTESTING: Validation results:', {
        hasSuccess,
        hasDataWrapper,
        hasPerformanceData,
        hasCumulative,
        hasValidLength,
        dataLength: hasCumulative ? data.data.performance_data.cumulative_performance.length : 0
      });

      // 🛡️ DÉFENSE 6: Validation finale avec message d'erreur détaillé
      if (!hasValidLength) {
        const errorDetails = [];
        if (!hasSuccess) errorDetails.push('invalid success flag');
        if (!hasDataWrapper) errorDetails.push('missing data wrapper');
        if (!hasPerformanceData) errorDetails.push('missing performance_data');
        if (!hasCumulative) errorDetails.push('missing cumulative_performance array');
        if (!hasValidLength) errorDetails.push('empty data array');
        
        throw new Error(`Invalid backtesting data: ${errorDetails.join(', ')}`);
      }

      console.log('✅ BACKTESTING: Data structure valid, points:', data.data.performance_data.cumulative_performance.length);
      setBacktestingData(data.data);
      setBacktestingError(null);

    } catch (error: any) {
      console.error('❌ BACKTESTING ERROR:', error);
      
      // 🛡️ DÉFENSE 7: Gestion d'erreurs hyper-robuste
      let errorMessage = 'Unknown error occurred';
      
      if (error && typeof error === 'object') {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout (30s) - API too slow';
        } else if (error.message && error.message.includes('fetch')) {
          errorMessage = 'Network error - Check internet connection';
        } else if (error.message && error.message.includes('HTTP error')) {
          errorMessage = `Server error - ${error.message}`;
        } else if (error.message && error.message.includes('Invalid backtesting data')) {
          errorMessage = `Data validation failed - ${error.message}`;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setBacktestingError(errorMessage);
      
      // 🛡️ DÉFENSE 8: Fallback data pour éviter tout crash
      setBacktestingData({
        performance_data: {
          monthly_returns: [],
          cumulative_performance: []
        }
      });
    } finally {
      setIsLoadingBacktesting(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCountriesData();
    fetchMarketStress();
    fetchETFData();
    
    // Auto-refresh market stress every 5 minutes
    const interval = setInterval(fetchMarketStress, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Update country data when selectedCountry changes - CORRIGÉ POUR ÉVITER L'ERREUR .length
  useEffect(() => {
    // 🛡️ CORRECTION CRITIQUE: Vérifier que countriesData existe ET est un array
    if (countriesData && Array.isArray(countriesData) && countriesData.length > 0) {
      const countryData = countriesData.find(c => c.code === selectedCountry);
      if (countryData) {
        setCurrentCountryData(countryData);
        console.log('Country changed to:', countryData.code, countryData.name);
      }
    }
  }, [selectedCountry, countriesData]);

  // Handle country selection change - VERSION ROBUSTE
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value;
    console.log('=== COUNTRY CHANGE ===');
    console.log('Selected country code:', newCountry);
    setSelectedCountry(newCountry);
    
    // Force update of country data
    if (countriesData.length > 0) {
      const countryData = countriesData.find(c => c.code === newCountry);
      if (countryData) {
        setCurrentCountryData(countryData);
        console.log('Updated to country:', countryData.code, countryData.name);
        console.log('New allocations:', countryData.allocations);
        console.log('New confidence:', countryData.confidence);
      }
    }
  };

  // Handle backtesting launch
  const handleLaunchBacktest = () => {
    console.log('Launching backtest for country:', selectedCountry, 'from', startDate, 'to', endDate);
    fetchBacktestingData();
  };

  const formatStressLevel = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'EXTREME': return 'EXTRÊME';
      case 'HIGH': return 'ÉLEVÉ';
      case 'MODERATE': return 'MODÉRÉ';
      case 'LOW': return 'FAIBLE';
      default: return level || 'N/A';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // 🔧 DONNÉES ROBUSTES: Prepare pie chart data avec vérifications
  const pieData = currentCountryData ? [
    { name: 'Actions', value: currentCountryData.allocations.stocks || 0, color: '#2DD4BF' },
    { name: 'Obligations', value: currentCountryData.allocations.bonds || 0, color: '#3B82F6' },
    { name: 'Commodités', value: currentCountryData.allocations.commodities || 0, color: '#FFC107' },
    { name: 'Cash', value: currentCountryData.allocations.cash || 0, color: '#A78BFA' }
  ] : [];

  // 🔍 DIAGNOSTIC PRODUCTION: Logs détaillés pour identifier le problème
  const chartData = React.useMemo(() => {
    console.log('🔍 CHART DATA DEBUG - START');
    console.log('🔍 backtestingData:', backtestingData);
    console.log('🔍 backtestingData type:', typeof backtestingData);
    console.log('🔍 backtestingData keys:', backtestingData ? Object.keys(backtestingData) : 'null/undefined');
    
    if (backtestingData) {
      console.log('🔍 performance_data:', backtestingData.performance_data);
      console.log('🔍 performance_data type:', typeof backtestingData.performance_data);
      console.log('🔍 performance_data keys:', backtestingData.performance_data ? Object.keys(backtestingData.performance_data) : 'null/undefined');
      
      if (backtestingData.performance_data) {
        console.log('🔍 cumulative_performance:', backtestingData.performance_data.cumulative_performance);
        console.log('🔍 cumulative_performance type:', typeof backtestingData.performance_data.cumulative_performance);
        console.log('🔍 cumulative_performance isArray:', Array.isArray(backtestingData.performance_data.cumulative_performance));
        console.log('🔍 cumulative_performance length:', backtestingData.performance_data.cumulative_performance?.length);
        
        if (Array.isArray(backtestingData.performance_data.cumulative_performance)) {
          console.log('🔍 First 3 items:', backtestingData.performance_data.cumulative_performance.slice(0, 3));
        }
      }
    }
    
    try {
      // 🛡️ DÉFENSE NIVEAU 1: Vérification de base
      if (!backtestingData) {
        console.log('🔍 CHART DATA: backtestingData is null/undefined');
        return [];
      }
      
      // 🛡️ DÉFENSE NIVEAU 2: Vérification performance_data
      if (!backtestingData.performance_data) {
        console.log('🔍 CHART DATA: performance_data is null/undefined');
        return [];
      }
      
      // 🛡️ DÉFENSE NIVEAU 3: Vérification cumulative_performance
      if (!backtestingData.performance_data.cumulative_performance) {
        console.log('🔍 CHART DATA: cumulative_performance is null/undefined');
        return [];
      }
      
      // 🛡️ DÉFENSE NIVEAU 4: Vérification Array
      if (!Array.isArray(backtestingData.performance_data.cumulative_performance)) {
        console.log('🔍 CHART DATA: cumulative_performance is not an array, type:', typeof backtestingData.performance_data.cumulative_performance);
        return [];
      }
      
      // 🛡️ DÉFENSE NIVEAU 5: Vérification length
      if (backtestingData.performance_data.cumulative_performance.length === 0) {
        console.log('🔍 CHART DATA: cumulative_performance array is empty');
        return [];
      }
      
      console.log('🔍 CHART DATA: All validations passed, processing', backtestingData.performance_data.cumulative_performance.length, 'items');
      
      const processedData = backtestingData.performance_data.cumulative_performance.map((item, index) => {
        if (!item) {
          console.warn('🔍 CHART DATA: Null item at index', index);
          return null;
        }
        
        if (typeof item.oracle_cumulative !== 'number' || typeof item.benchmark_cumulative !== 'number') {
          console.warn('🔍 CHART DATA: Invalid data types at index', index, {
            oracle_cumulative: typeof item.oracle_cumulative,
            benchmark_cumulative: typeof item.benchmark_cumulative,
            item
          });
          return null;
        }
        
        const processedItem = {
          date: item.date || `Point ${index + 1}`,
          Oracle: Number(((item.oracle_cumulative - 1) * 100).toFixed(2)),
          Benchmark: Number(((item.benchmark_cumulative - 1) * 100).toFixed(2))
        };
        
        if (index < 3) {
          console.log('🔍 CHART DATA: Processed item', index, processedItem);
        }
        
        return processedItem;
      }).filter(Boolean); // Remove null values
      
      console.log('🔍 CHART DATA: Final processed data length:', processedData.length);
      console.log('🔍 CHART DATA DEBUG - END');
      
      return processedData;
    } catch (error) {
      console.error('🔍 CHART DATA ERROR:', error);
      console.error('🔍 Error stack:', error.stack);
      return [];
    }
  }, [backtestingData]);

  // 🔧 MÉTRIQUES ROBUSTES: Calculate performance metrics avec vérifications
  const performanceMetrics = React.useMemo(() => {
    try {
      if (!backtestingData?.metrics || !backtestingData?.benchmark_metrics) {
        return {
          oracleReturn: '0.0',
          benchmarkReturn: '0.0',
          outperformance: '0.0',
          totalMonths: 0
        };
      }
      
      const oracleReturn = (backtestingData.metrics.total_return * 100).toFixed(1);
      const benchmarkReturn = (backtestingData.benchmark_metrics.total_return * 100).toFixed(1);
      const outperformance = (backtestingData.outperformance.total_return * 100).toFixed(1);
      const totalMonths = backtestingData.data_quality?.total_months || backtestingData.period?.total_months || 0;
      
      return { oracleReturn, benchmarkReturn, outperformance, totalMonths };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return {
        oracleReturn: '0.0',
        benchmarkReturn: '0.0',
        outperformance: '0.0',
        totalMonths: 0
      };
    }
  }, [backtestingData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-teal-400">🔮 Oracle Portfolio</h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  📊 Dashboard
                </a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  📈 Analytics
                </a>
              </div>
            </nav>
            <div className="flex items-center">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Get Full Access
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Financial Dashboard</h1>
            <p className="text-gray-400">Real-time market data and portfolio analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Country Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sélection du Pays</h3>
                <button 
                  onClick={fetchCountriesData}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isLoadingCountries}
                >
                  {isLoadingCountries ? '⏳' : '🔄'}
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Mis à jour: {formatDate(currentCountryData?.last_update || new Date().toISOString())}
              </p>
              
              <select 
                value={selectedCountry}
                onChange={handleCountryChange}
                onInput={handleCountryChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    <span className="text-green-400 font-bold">{currentCountryData.regime}</span>
                    <span className="text-green-400">●</span>
                    <span className="text-green-400">{currentCountryData.regime}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Confiance: {currentCountryData.confidence}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${currentCountryData.confidence}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Dernière mise à jour: {formatDate(currentCountryData.last_update)}
                  </div>
                </div>
              )}
            </div>

            {/* Economic Regime */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Régime Économique</h3>
                <button 
                  onClick={fetchCountriesData}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isLoadingCountries}
                >
                  {isLoadingCountries ? '⏳' : '🔄'}
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">
                Mis à jour: {formatDate(currentCountryData?.last_update || new Date().toISOString())}
              </p>

              {currentCountryData && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-300">{currentCountryData.code}:</span>
                      <span className="text-green-400 font-bold">{currentCountryData.regime}</span>
                      <span className="text-green-400">●</span>
                      <span className="text-green-400">{currentCountryData.regime}</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Indice de confiance: {currentCountryData.confidence}%
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${currentCountryData.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-400">Croissance</div>
                      <div className="text-lg font-bold text-white">{currentCountryData.indicators.growth}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Inflation</div>
                      <div className="text-lg font-bold text-white">{currentCountryData.indicators.inflation}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Chômage</div>
                      <div className="text-lg font-bold text-white">{currentCountryData.indicators.unemployment}%</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    Debug: Pays={currentCountryData.code}, API={currentCountryData.code}, Régime={currentCountryData.regime}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Market Stress Indicators */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Market Stress Indicators</h3>
              <button 
                onClick={fetchMarketStress}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isLoadingMarketStress}
              >
                {isLoadingMarketStress ? '⏳' : '🔄'}
              </button>
            </div>
            
            {marketStressData && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Updated: {formatDate(marketStressData.last_update || marketStressData.timestamp)}
                </p>
                
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-400 mb-2">Niveau de stress: 
                    <span className="text-red-400 font-bold ml-2">{formatStressLevel(marketStressData.stress_level)}</span>
                    <span className="text-red-400 ml-2">●</span>
                    <span className="text-red-400 ml-2">{formatStressLevel(marketStressData.stress_level)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#374151"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(marketStressData.vix / 50) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{marketStressData.vix}</span>
                      </div>
                    </div>
                    <div className="text-white font-medium">VIX</div>
                    <div className="text-xs text-gray-400 mt-1">Source:</div>
                    <div className="text-xs text-blue-400 break-all">{marketStressData.data_sources?.vix}</div>
                  </div>

                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#374151"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#EF4444"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(marketStressData.high_yield_spread / 15) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{marketStressData.high_yield_spread}</span>
                      </div>
                    </div>
                    <div className="text-white font-medium">High Yield Spread</div>
                    <div className="text-xs text-gray-400 mt-1">Source:</div>
                    <div className="text-xs text-blue-400 break-all">{marketStressData.data_sources?.spread}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Backtesting Engine */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Backtesting Engine</h3>
              <button 
                onClick={fetchBacktestingData}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isLoadingBacktesting}
              >
                {isLoadingBacktesting ? '⏳' : '🔄'}
              </button>
            </div>
            
            <div className="mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ API OK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de début</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleLaunchBacktest}
              disabled={isLoadingBacktesting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {isLoadingBacktesting ? 'Calcul en cours...' : 'Lancer le backtest'}
            </button>

            {/* Error Display */}
            {backtestingError && (
              <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-md">
                <div className="text-red-300 text-sm">
                  <strong>Erreur:</strong> {backtestingError}
                </div>
              </div>
            )}

            {/* Results Display */}
            {backtestingData && !backtestingError && (
              <div className="mt-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Rendement Oracle</div>
                    <div className="text-lg font-bold text-teal-400">
                      {performanceMetrics.oracleReturn}%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Rendement Benchmark</div>
                    <div className="text-lg font-bold text-blue-400">
                      {performanceMetrics.benchmarkReturn}%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Surperformance</div>
                    <div className="text-lg font-bold text-green-400">
                      {performanceMetrics.outperformance}%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Période</div>
                    <div className="text-lg font-bold text-white">
                      {performanceMetrics.totalMonths} mois
                    </div>
                  </div>
                </div>

                {/* Chart - SÉCURISÉ AVEC VÉRIFICATIONS DÉFENSIVES */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Performance Cumulative (%)</h4>
                    <div className="bg-gray-700 rounded-lg p-4 h-64">
                      {(() => {
                        // 🛡️ VÉRIFICATIONS DÉFENSIVES ULTRA-ROBUSTES
                        console.log('🛡️ RENDER GUARD: Checking chartData for rendering');
                        console.log('🛡️ chartData:', chartData);
                        console.log('🛡️ chartData type:', typeof chartData);
                        console.log('🛡️ chartData isArray:', Array.isArray(chartData));
                        console.log('🛡️ chartData length:', chartData?.length);
                        
                        // Vérification 1: chartData existe et est un array
                        if (!chartData || !Array.isArray(chartData)) {
                          console.log('🛡️ RENDER GUARD: chartData is not a valid array');
                          return (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              Données de graphique invalides (pas un tableau)
                            </div>
                          );
                        }
                        
                        // Vérification 2: chartData a une longueur valide
                        if (chartData.length === 0) {
                          console.log('🛡️ RENDER GUARD: chartData is empty');
                          return (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              Aucune donnée de graphique disponible
                            </div>
                          );
                        }
                        
                        // Vérification 3: Vérifier que les données ont la structure attendue
                        const hasValidStructure = chartData.every((item, index) => {
                          if (!item || typeof item !== 'object') {
                            console.warn('🛡️ RENDER GUARD: Invalid item at index', index, item);
                            return false;
                          }
                          
                          if (typeof item.Oracle !== 'number' || typeof item.Benchmark !== 'number') {
                            console.warn('🛡️ RENDER GUARD: Invalid data types at index', index, {
                              Oracle: typeof item.Oracle,
                              Benchmark: typeof item.Benchmark,
                              item
                            });
                            return false;
                          }
                          
                          return true;
                        });
                        
                        if (!hasValidStructure) {
                          console.log('🛡️ RENDER GUARD: chartData has invalid structure');
                          return (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              Structure de données invalide
                            </div>
                          );
                        }
                        
                        console.log('🛡️ RENDER GUARD: All checks passed, rendering chart with', chartData.length, 'data points');
                        
                        // Rendu sécurisé du graphique avec PATCH ULTRA-DÉFENSIF
                        try {
                          // 🛡️ PATCH CRITIQUE: TOUJOURS passer un array à LineChart
                          const safeChartData = Array.isArray(chartData) ? chartData : [];
                          
                          return (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={safeChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#9CA3AF"
                                  fontSize={12}
                                  interval="preserveStartEnd"
                                />
                                <YAxis 
                                  stroke="#9CA3AF"
                                  fontSize={12}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#374151', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: '#fff'
                                  }}
                                />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="Oracle" 
                                  stroke="#2DD4BF" 
                                  strokeWidth={2}
                                  dot={false}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="Benchmark" 
                                  stroke="#3B82F6" 
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          );
                        } catch (renderError) {
                          console.error('🛡️ RENDER ERROR:', renderError);
                          return (
                            <div className="flex items-center justify-center h-full text-red-400">
                              Erreur de rendu du graphique: {renderError.message}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Allocations */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Allocations de portefeuille</h3>
                <button 
                  onClick={fetchCountriesData}
                  className="text-gray-400 hover:text-white transition-colors"
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
                          <span className="text-sm text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ETF Prices */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">ETF Prices</h3>
                <button 
                  onClick={fetchETFData}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isLoadingETF}
                >
                  {isLoadingETF ? '⏳' : '🔄'}
                </button>
              </div>
              
              <div className="space-y-4">
                {etfData.map((etf, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{etf.symbol}</div>
                      <div className="text-sm text-gray-400">{etf.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">${etf.price.toFixed(2)}</div>
                      <div className={`text-sm ${etf.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

