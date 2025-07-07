import React, { useState, useEffect } from 'react';

// Hook useMarketStress simplifié
const useMarketStress = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress');
      const result = await response.json();
      
      // Adapter la structure des données
      setData({
        stress_level: result.stress_level,
        vix: result.vix,
        high_yield_spread: result.high_yield_spread,
        last_update: result.last_update || result.timestamp,
        data_sources: {
          vix: result.data_sources?.vix || 'FRED',
          spread: result.data_sources?.spread || 'FRED'
        }
      });
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Error fetching market stress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

// Composant MarketStressCard simplifié
const MarketStressCard = () => {
  const { data, isLoading, error, refetch } = useMarketStress();
  
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Market Stress Indicators</h3>
        <div className="text-red-400 text-center py-8">
          Failed to load market stress data. Please try again.
          <button onClick={refetch} className="block mt-2 text-blue-400 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Market Stress Indicators</h3>
        <button onClick={refetch} className="text-gray-400 hover:text-white">
          🔄
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-gray-400">Chargement...</div>
      ) : data ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h4 className="font-bold text-lg text-white">
                Niveau de stress: 
              </h4>
              <span className={`ml-2 font-bold ${
                data.stress_level === 'EXTRÊME' ? 'text-red-400' :
                data.stress_level === 'ÉLEVÉ' ? 'text-orange-400' :
                data.stress_level === 'MODÉRÉ' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {data.stress_level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* VIX Gauge */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(data.vix / 50) * 251.2} 251.2`}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{data.vix}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">VIX</p>
              <p className="text-xs text-gray-500">Source: {data.data_sources?.vix || 'FRED'}</p>
            </div>

            {/* High Yield Spread Gauge */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(data.high_yield_spread / 15) * 251.2} 251.2`}
                    className="text-red-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{data.high_yield_spread}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">High Yield Spread</p>
              <p className="text-xs text-gray-500">Source: {data.data_sources?.spread || 'FRED'}</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Updated: {new Date(data.last_update).toLocaleString('fr-FR')}
          </div>
        </>
      ) : (
        <div className="text-red-400">No data available</div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Oracle Portfolio | Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market Stress Card avec vraies données */}
        <MarketStressCard />
        
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

