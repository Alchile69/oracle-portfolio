import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = useState('FRA');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Utiliser votre API existante
        const response = await fetch(`https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getRegime?country=${selectedCountry}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Oracle Portfolio v4.1
              </h1>
              <p className="text-slate-600 mt-1">
                Allocation sectorielle basée sur les régimes économiques
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FRA">France</option>
                <option value="USA">États-Unis</option>
                <option value="DEU">Allemagne</option>
                <option value="GBR">Royaume-Uni</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Régime actuel */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Régime Économique Actuel
            </h3>
            {data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pays:</span>
                  <span className="font-medium">{data.country || selectedCountry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Régime:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {data.regime || 'Non détecté'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Confiance:</span>
                  <span className="font-medium">{data.confidence ? `${(data.confidence * 100).toFixed(1)}%` : 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Allocations */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Allocation Recommandée
            </h3>
            {data && data.allocations ? (
              <div className="space-y-3">
                {Object.entries(data.allocations).map(([sector, allocation]: [string, any]) => (
                  <div key={sector} className="flex items-center justify-between">
                    <span className="text-slate-600 capitalize">{sector}:</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${allocation}%` }}
                        />
                      </div>
                      <span className="font-medium">{allocation}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Aucune donnée d'allocation disponible</p>
            )}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Oracle Portfolio v4.1 - Test Local
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Cette version utilise votre API de production existante pour tester l'interface v4.1.
              Votre production reste intacte sur Firebase.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://oracle-portfolio-prod.web.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Voir la Production
              </a>
              <a 
                href="http://localhost:3001/health" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Health Check Backend
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 