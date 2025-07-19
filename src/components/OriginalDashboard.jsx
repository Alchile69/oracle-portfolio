import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const OriginalDashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState('France');
  const [regimeData, setRegimeData] = useState(null);
  const [marketStress, setMarketStress] = useState(null);
  const [allocations, setAllocations] = useState(null);
  const [etfPrices, setETFPrices] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString('fr-FR'));

  // Simulation des données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleString('fr-FR'));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Données simulées pour le régime économique
  useEffect(() => {
    setRegimeData({
      country: selectedCountry,
      regime: 'EXPANSION',
      confidence: 95,
      growth: 2.5,
      inflation: 2.8,
      unemployment: 7.5
    });
  }, [selectedCountry]);

  // Données simulées pour Market Stress
  useEffect(() => {
    setMarketStress({
      level: 'EXTRÊME',
      vix: 16.52,
      highYieldSpread: 6.92
    });
  }, []);

  // Données simulées pour les allocations
  useEffect(() => {
    setAllocations({
      stocks: 65,
      bonds: 25,
      commodities: 5,
      cash: 5
    });
  }, []);

  // Données simulées pour les ETF
  useEffect(() => {
    setETFPrices([
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 622.08, change: '+0.85%' },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market', price: 306.00, change: '-0.12%' },
      { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets', price: 56.83, change: '+0.34%' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-gray-400 mb-8">Real-time market data and portfolio analysis</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Sélection du Pays */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Sélection du Pays</CardTitle>
              <button className="text-cyan-400 hover:text-cyan-300">🔄</button>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 mb-4">Mis à jour: {lastUpdate}</p>
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-[#2d2d44] border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option>France</option>
                <option>Germany</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
            </CardContent>
          </Card>

          {/* Régime Économique */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Régime Économique</CardTitle>
              <button className="text-cyan-400 hover:text-cyan-300">🔄</button>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 mb-4">Mis à jour: {lastUpdate}</p>
              {regimeData && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{regimeData.country}:</span>
                    <span className="text-green-400 font-bold">{regimeData.regime}</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-green-400 font-bold">{regimeData.regime}</span>
                  </div>
                  <p className="text-sm">Indice de confiance: {regimeData.confidence}%</p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Croissance</p>
                      <p className="font-bold text-green-400">{regimeData.growth}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Inflation</p>
                      <p className="font-bold text-yellow-400">{regimeData.inflation}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Chômage</p>
                      <p className="font-bold text-red-400">{regimeData.unemployment}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Debug: Pays={regimeData.country}, API={regimeData.country}, Régime={regimeData.regime}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Stress Indicators */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Market Stress Indicators</CardTitle>
              <button className="text-cyan-400 hover:text-cyan-300">🔄</button>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400 mb-4">Updated: {lastUpdate}</p>
              {marketStress && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Niveau de stress:</span>
                    <span className="text-red-400 font-bold">{marketStress.level}</span>
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span className="text-red-400 font-bold">{marketStress.level}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <div className="w-full h-full rounded-full border-4 border-gray-600 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-400">{marketStress.vix}</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium">VIX</p>
                      <p className="text-xs text-gray-400">Source:</p>
                      <p className="text-xs text-blue-400">https://fred.stlouisfed.org/series/VIXCLS</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <div className="w-full h-full rounded-full border-4 border-gray-600 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-red-400">{marketStress.highYieldSpread}</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium">High Yield Spread</p>
                      <p className="text-xs text-gray-400">Source:</p>
                      <p className="text-xs text-blue-400">https://fred.stlouisfed.org/series/BAMLH0A0HYM2EY</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Backtesting Engine */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Backtesting Engine</CardTitle>
              <button className="text-cyan-400 hover:text-cyan-300">🔄</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-green-400 text-sm font-medium">API OK</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Date de début</label>
                    <input type="date" className="w-full bg-[#2d2d44] border border-gray-600 rounded px-2 py-1 text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Date de fin</label>
                    <input type="date" className="w-full bg-[#2d2d44] border border-gray-600 rounded px-2 py-1 text-white text-sm" />
                  </div>
                </div>
                
                <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded font-medium">
                  Lancer le backtest
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Allocations de portefeuille */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Allocations de portefeuille</CardTitle>
              <button className="text-cyan-400 hover:text-cyan-300">🔄</button>
            </CardHeader>
            <CardContent>
              {allocations && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Actions</span>
                    <span className="font-bold text-green-400">{allocations.stocks}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Obligations</span>
                    <span className="font-bold text-blue-400">{allocations.bonds}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commodités</span>
                    <span className="font-bold text-yellow-400">{allocations.commodities}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cash</span>
                    <span className="font-bold text-gray-400">{allocations.cash}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ETF Prices */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">ETF Prices</CardTitle>
              <button className="text-cyan-400 hover:text-cyan-300">🔄</button>
            </CardHeader>
            <CardContent>
              {etfPrices && (
                <div className="space-y-3">
                  {etfPrices.map((etf, index) => (
                    <div key={index} className="border-b border-gray-700 pb-2 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white">{etf.symbol}</p>
                          <p className="text-xs text-gray-400">{etf.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">${etf.price}</p>
                          <p className={`text-xs ${etf.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {etf.change}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default OriginalDashboard;

