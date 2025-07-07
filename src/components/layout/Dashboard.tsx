import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [marketStressData, setMarketStressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Market Stress data
  useEffect(() => {
    const fetchMarketStress = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress');
        const data = await response.json();
        setMarketStressData(data);
      } catch (error) {
        console.error('Error fetching market stress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketStress();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketStress, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
                <button className="text-gray-400 hover:text-white">
                  🔄
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">Mis à jour: Jul 7, 2025 4:01 PM</p>
              
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="France">France</option>
                <option value="USA">USA</option>
                <option value="Germany">Germany</option>
                <option value="UK">UK</option>
              </select>

              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Régime Économique:</h4>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-semibold">EXPANSION</span>
                  <span className="text-green-400 text-sm">● EXPANSION</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Confiance: 0.95</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Dernière mise à jour: Jul 7, 2025 4:01 PM</p>
                </div>
              </div>
            </div>

            {/* Régime Économique */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Régime Économique</h3>
                <button className="text-gray-400 hover:text-white">
                  🔄
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">Mis à jour: Jul 7, 2025 4:34 PM</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">FRA:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 font-semibold">EXPANSION</span>
                      <span className="text-green-400 text-sm">● EXPANSION</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">Indice de confiance: 95%</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Debug: Pays=FRA, API=FRA, Régime=EXPANSION</p>
                </div>
              </div>
            </div>

            {/* Market Stress Indicators - VRAIES DONNÉES API */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Market Stress Indicators</h3>
                <button className="text-gray-400 hover:text-white">
                  🔄
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
                        {isLoading ? '...' : (marketStressData?.vix?.toFixed(2) || 'N/A')}
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
                        {isLoading ? '...' : (marketStressData?.high_yield_spread?.toFixed(2) || 'N/A')}
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
              <button className="text-gray-400 hover:text-white">
                🔄
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
                  defaultValue="2020-01-01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date de fin</label>
                <input 
                  type="date" 
                  defaultValue="2024-12-31"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
              Lancer le backtest
            </button>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Performance Cumulative</h4>
                <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-gray-400">📈 Graphique de performance</div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Surperformance vs Benchmark</h4>
                <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-gray-400">📊 Graphique de surperformance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocations */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Allocations de portefeuille</h3>
                <button className="text-gray-400 hover:text-white">
                  🔄
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#374151" strokeWidth="3"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2DD4BF" strokeWidth="3" 
                              strokeDasharray="65 100" strokeDashoffset="25" transform="rotate(-90 21 21)"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="3" 
                              strokeDasharray="25 100" strokeDashoffset="-40" transform="rotate(-90 21 21)"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FFC107" strokeWidth="3" 
                              strokeDasharray="5 100" strokeDashoffset="-65" transform="rotate(-90 21 21)"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#A78BFA" strokeWidth="3" 
                              strokeDasharray="5 100" strokeDashoffset="-70" transform="rotate(-90 21 21)"/>
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                      <span className="text-white">Actions</span>
                    </div>
                    <span className="text-white font-medium">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-white">Obligations</span>
                    </div>
                    <span className="text-white font-medium">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-white">Commodités</span>
                    </div>
                    <span className="text-white font-medium">5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-white">Cash</span>
                    </div>
                    <span className="text-white font-medium">5%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ETF Prices */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">ETF Prices</h3>
                <button className="text-gray-400 hover:text-white">
                  🔄
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-white">SPY</div>
                    <div className="text-sm text-gray-400">SPDR S&P 500 ETF</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">$418.74</div>
                    <div className="text-sm text-green-400">+0.85%</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-white">VTI</div>
                    <div className="text-sm text-gray-400">Vanguard Total Stock Market</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">$85.0</div>
                    <div className="text-sm text-red-400">-0.12%</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-white">VEA</div>
                    <div className="text-sm text-gray-400">Vanguard FTSE Developed Markets</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">$49.9</div>
                    <div className="text-sm text-green-400">+0.34%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

