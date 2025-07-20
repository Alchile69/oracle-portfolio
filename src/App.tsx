import React, { useState } from 'react';

// Composant Card simplifié
const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

function App() {
  const [apiResult, setApiResult] = useState('Cliquez pour tester');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress');
      const data = await response.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResult('Erreur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Oracle Portfolio - Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Market Stress Test</h2>
          <button 
            onClick={testAPI}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded mb-4"
          >
            {isLoading ? 'Loading...' : 'Test Market Stress API'}
          </button>
          
          <pre className="bg-slate-800 p-3 rounded text-xs overflow-auto max-h-40">
            {apiResult}
          </pre>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>React:</span>
              <span className="text-green-400">✅ Fonctionnel</span>
            </div>
            <div className="flex justify-between">
              <span>API:</span>
              <span className="text-green-400">✅ Connectée</span>
            </div>
            <div className="flex justify-between">
              <span>Tailwind:</span>
              <span className="text-green-400">✅ Actif</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
          <ul className="space-y-1 text-sm">
            <li>✅ Configuration de base</li>
            <li>✅ Test API Market Stress</li>
            <li>🔄 Intégration composants</li>
            <li>⏳ Dashboard complet</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default App;