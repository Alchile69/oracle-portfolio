import React, { useState, useEffect } from 'react';

function App() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress');
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Erreur API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Oracle Portfolio | Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market Stress Card */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Market Stress Indicators</h3>
          {loading ? (
            <div className="text-gray-400">Chargement...</div>
          ) : marketData ? (
            <>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {marketData.data?.metrics?.vix || 'N/A'}
                </div>
                <div className="text-sm text-gray-400">VIX</div>
              </div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">
                  {marketData.data?.metrics?.high_yield_spread || 'N/A'}
                </div>
                <div className="text-sm text-gray-400">High Yield Spread</div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-300">Niveau de stress: </span>
                <span className={`font-bold ${
                  marketData.data?.stress_level === 'EXTRÊME' ? 'text-red-400' :
                  marketData.data?.stress_level === 'ÉLEVÉ' ? 'text-orange-400' :
                  marketData.data?.stress_level === 'MODÉRÉ' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {marketData.data?.stress_level || 'N/A'}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Sources: {marketData.data?.sources?.join(', ') || 'FRED API'}
              </div>
            </>
          ) : (
            <div className="text-red-400">Erreur de chargement</div>
          )}
        </div>
        
        {/* Economic Regime */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Economic Regime</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">EXPANSION</div>
            <div className="text-sm text-gray-400 mb-4">France</div>
            <div className="text-sm text-gray-300">Confiance: <span className="font-bold">95%</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-green-400 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
          </div>
        </div>
        
        {/* Portfolio Allocations */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Portfolio Allocations</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Actions</span>
              <span className="font-bold text-white">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Obligations</span>
              <span className="font-bold text-white">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Commodités</span>
              <span className="font-bold text-white">5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Cash</span>
              <span className="font-bold text-white">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

