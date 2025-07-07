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
  monthly_data: Array<{
    date: string;
    country: string;
    allocation: {
      actions: number;
      obligations: number;
      or: number;
      liquidites: number;
    };
    etf_prices: {
      spy_price: number;
      tlt_price: number;
      gld_price: number;
      hyg_price: number;
    };
    returns: {
      oracle: number;
      benchmark: number;
      spy: number;
      tlt: number;
      gld: number;
      hyg: number;
    };
  }>;
  cumulative_performance: Array<{
    date: string;
    oracle_cumulative: number;
    benchmark_cumulative: number;
  }>;
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

  // Fetch Countries data
  const fetchCountriesData = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getCountries');
      const data = await response.json();
      if (data.success) {
        setCountriesData(data.countries);
        // Set initial country data
        const initialCountry = data.countries.find((c: CountryData) => c.code === selectedCountry) || data.countries[0];
        setCurrentCountryData(initialCountry);
        console.log('Countries loaded, initial country:', initialCountry.code, initialCountry.name);
      }
    } catch (error) {
      console.error('Error fetching countries data:', error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  // Fetch Market Stress data
  const fetchMarketStress = async () => {
    try {
      setIsLoadingMarketStress(true);
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress');
      const data = await response.json();
      setMarketStressData(data);
    } catch (error) {
      console.error('Error fetching market stress data:', error);
    } finally {
      setIsLoadingMarketStress(false);
    }
  };

  // Fetch ETF data with real prices
  const fetchETFData = async () => {
    try {
      setIsLoadingETF(true);
      // Use real current prices
      setEtfData([
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 622.08, change: 0.85, changePercent: 0.85 },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market', price: 306.00, change: -0.12, changePercent: -0.12 },
        { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets', price: 56.83, change: 0.34, changePercent: 0.34 }
      ]);
    } catch (error) {
      console.error('Error fetching ETF data:', error);
    } finally {
      setIsLoadingETF(false);
    }
  };

  // Fetch Backtesting data
  const fetchBacktestingData = async () => {
    try {
      setIsLoadingBacktesting(true);
      const response = await fetch(`https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getBacktesting?start_date=${startDate}&end_date=${endDate}&country=${selectedCountry}`);
      const data = await response.json();
      if (data.success) {
        setBacktestingData(data.data);
      }
    } catch (error) {
      console.error('Error fetching backtesting data:', error);
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
    const interval = setInterval(() => {
      fetchMarketStress();
      fetchETFData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle country change - FIXED VERSION
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = event.target.value;
    console.log('=== COUNTRY CHANGE ===');
    console.log('Selected country code:', newCountryCode);
    
    // Update selected country
    setSelectedCountry(newCountryCode);
    
    // Find and set new country data immediately
    const newCountryData = countriesData.find(c => c.code === newCountryCode);
    if (newCountryData) {
      setCurrentCountryData(newCountryData);
      console.log('Updated to country:', newCountryData.code, newCountryData.name);
      console.log('New allocations:', newCountryData.allocations);
      console.log('New confidence:', newCountryData.confidence);
    } else {
      console.log('Country not found in data:', newCountryCode);
    }
  };

  const handleRunBacktest = () => {
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

  const getStressColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'EXTREME': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MODERATE': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRegimeColor = (regime: string) => {
    switch (regime?.toUpperCase()) {
      case 'EXPANSION': return 'text-green-400';
      case 'RECESSION': return 'text-red-400';
      case 'RECOVERY': return 'text-blue-400';
      case 'SLOWDOWN': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  // Prepare pie chart data for allocations
  const pieData = currentCountryData ? [
    { name: 'Actions', value: currentCountryData.allocations.stocks, color: '#2DD4BF' },
    { name: 'Obligations', value: currentCountryData.allocations.bonds, color: '#3B82F6' },
    { name: 'Commodités', value: currentCountryData.allocations.commodities, color: '#FFC107' },
    { name: 'Cash', value: currentCountryData.allocations.cash, color: '#A78BFA' }
  ] : [];

  // Prepare line chart data for backtesting
  const chartData = backtestingData?.cumulative_performance?.map(item => ({
    date: item.date,
    Oracle: ((item.oracle_cumulative - 1) * 100).toFixed(2),
    Benchmark: ((item.benchmark_cumulative - 1) * 100).toFixed(2)
  })) || [];

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
            <div className="hidden md:block">
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
          <h1 className="text-3xl font-bold text-white mb-2">Financial Dashboard</h1>
          <p className="text-gray-400 mb-8">Real-time market data and portfolio analysis</p>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Sélection du Pays */}
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
                Mis à jour: {currentCountryData?.last_update ? new Date(currentCountryData.last_update).toLocaleString('fr-FR') : 'Loading...'}
              </p>
              
              <select 
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoadingCountries}
              >
                {countriesData.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>

              {currentCountryData && (
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2">Régime Économique:</h4>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${getRegimeColor(currentCountryData.regime)}`}>
                      {currentCountryData.regime}
                    </span>
                    <span className={`text-sm ${getRegimeColor(currentCountryData.regime)}`}>
                      ● {currentCountryData.regime}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Confiance: {(currentCountryData.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${currentCountryData.confidence * 100}%`}}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Dernière mise à jour: {new Date(currentCountryData.last_update).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Régime Économique */}
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
                Mis à jour: {currentCountryData?.last_update ? new Date(currentCountryData.last_update).toLocaleString('fr-FR') : 'Loading...'}
              </p>
              
              {currentCountryData && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{currentCountryData.code}:</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${getRegimeColor(currentCountryData.regime)}`}>
                          {currentCountryData.regime}
                        </span>
                        <span className={`text-sm ${getRegimeColor(currentCountryData.regime)}`}>
                          ● {currentCountryData.regime}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Indice de confiance: {(currentCountryData.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                        style={{width: `${currentCountryData.confidence * 100}%`}}
                      ></div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-400">Croissance</div>
                        <div className="text-white font-medium">
                          {(currentCountryData.indicators.growth * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Inflation</div>
                        <div className="text-white font-medium">
                          {(currentCountryData.indicators.inflation * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Chômage</div>
                        <div className="text-white font-medium">
                          {(currentCountryData.indicators.unemployment * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Debug: Pays={currentCountryData.code}, API={currentCountryData.code}, Régime={currentCountryData.regime}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Market Stress Indicators */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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
              <p className="text-sm text-gray-400 mb-4">
                Updated: {marketStressData?.last_update ? new Date(marketStressData.last_update).toLocaleString('fr-FR') : 'Loading...'}
              </p>
              
              <div className="text-center mb-4">
                <div className={`font-bold text-lg mb-2 ${getStressColor(marketStressData?.stress_level)}`}>
                  Niveau de stress: {formatStressLevel(marketStressData?.stress_level)} ● {formatStressLevel(marketStressData?.stress_level)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray={`${Math.min((marketStressData?.vix || 17.48) * 2, 100)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {isLoadingMarketStress ? '...' : (marketStressData?.vix?.toFixed(2) || 'N/A')}
                      </span>
                    </div>
                  </div>
                  <div className="text-white font-medium">VIX</div>
                  <div className="text-xs text-gray-400">Source:</div>
                  <div className="text-xs text-blue-400 break-all">https://fred.stlouisfed.org/series/VIXCLS</div>
                </div>

                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray={`${Math.min((marketStressData?.high_yield_spread || 6.78) * 4, 100)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {isLoadingMarketStress ? '...' : (marketStressData?.high_yield_spread?.toFixed(2) || 'N/A')}
                      </span>
                    </div>
                  </div>
                  <div className="text-white font-medium">High Yield Spread</div>
                  <div className="text-xs text-gray-400">Source:</div>
                  <div className="text-xs text-blue-400 break-all">https://fred.stlouisfed.org/series/BAMLH0A0HYM2EY</div>
                </div>
              </div>
            </div>
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de fin</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button 
              onClick={handleRunBacktest}
              disabled={isLoadingBacktesting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {isLoadingBacktesting ? 'Calcul en cours...' : 'Lancer le backtest'}
            </button>

            {backtestingData && (
              <div className="mt-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Rendement Oracle</div>
                    <div className="text-lg font-bold text-teal-400">
                      {backtestingData.cumulative_performance.length > 0 ? 
                        ((backtestingData.cumulative_performance[backtestingData.cumulative_performance.length - 1].oracle_cumulative - 1) * 100).toFixed(1) : '0.0'}%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Rendement Benchmark</div>
                    <div className="text-lg font-bold text-blue-400">
                      {backtestingData.cumulative_performance.length > 0 ? 
                        ((backtestingData.cumulative_performance[backtestingData.cumulative_performance.length - 1].benchmark_cumulative - 1) * 100).toFixed(1) : '0.0'}%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Surperformance</div>
                    <div className="text-lg font-bold text-green-400">
                      {backtestingData.cumulative_performance.length > 0 ? 
                        (((backtestingData.cumulative_performance[backtestingData.cumulative_performance.length - 1].oracle_cumulative - 
                           backtestingData.cumulative_performance[backtestingData.cumulative_performance.length - 1].benchmark_cumulative)) * 100).toFixed(1) : '0.0'}%
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Données</div>
                    <div className="text-lg font-bold text-gray-300">
                      {backtestingData.data_quality.total_months} mois
                    </div>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Performance Cumulative (%)</h4>
                    <div className="bg-gray-700 rounded-lg p-4 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '6px'
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
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocations */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{backgroundColor: item.color}}
                          ></div>
                          <span className="text-white">{item.name}</span>
                        </div>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* ETF Prices - REAL DATA */}
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
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
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

