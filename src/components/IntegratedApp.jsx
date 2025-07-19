import React, { useState } from 'react';
import NavigationTabs from './NavigationTabs';
import MultiCountryComparison from './MultiCountryComparison';

// Composant placeholder pour les sections existantes
const ExistingDashboard = () => (
  <div className="min-h-screen bg-[#0f0f23] text-white">
    <div className="p-6">
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">
          📊 Dashboard Oracle Portfolio
        </h2>
        <p className="text-gray-400 mb-6">
          Cette section intègre le dashboard existant de l'application Oracle Portfolio.
        </p>
        <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-sm text-gray-300">
            Le dashboard existant sera préservé et intégré ici, incluant :
          </p>
          <ul className="text-left text-sm text-gray-400 mt-4 space-y-2">
            <li>• Sélection du pays</li>
            <li>• Régime économique</li>
            <li>• Market Stress Indicators</li>
            <li>• Backtesting Engine</li>
            <li>• Allocations de portefeuille</li>
            <li>• ETF Prices</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ExistingAnalytics = () => (
  <div className="min-h-screen bg-[#0f0f23] text-white">
    <div className="p-6">
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">
          📈 Analytics Oracle Portfolio
        </h2>
        <p className="text-gray-400 mb-6">
          Cette section intègre les analytics existants de l'application Oracle Portfolio.
        </p>
        <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-sm text-gray-300">
            Les analytics existants seront préservés et intégrés ici, incluant :
          </p>
          <ul className="text-left text-sm text-gray-400 mt-4 space-y-2">
            <li>• Analyses de performance</li>
            <li>• Métriques de risque</li>
            <li>• Corrélations</li>
            <li>• Indicateurs techniques</li>
            <li>• Rapports détaillés</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ExistingAccess = () => (
  <div className="min-h-screen bg-[#0f0f23] text-white">
    <div className="p-6">
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">
          🔐 Get Full Access
        </h2>
        <p className="text-gray-400 mb-6">
          Cette section intègre le système d'accès premium existant.
        </p>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-sm text-white">
            Le système d'authentification et d'accès premium sera préservé et intégré ici.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const IntegratedApp = () => {
  const [activeTab, setActiveTab] = useState('comparison'); // Démarrer sur notre nouveau module

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExistingDashboard />;
      case 'analytics':
        return <ExistingAnalytics />;
      case 'comparison':
        return <MultiCountryComparison />;
      case 'access':
        return <ExistingAccess />;
      default:
        return <MultiCountryComparison />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* En-tête de l'application */}
      <header className="bg-[#1a1a2e] border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo et titre */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Oracle Portfolio</h1>
                <p className="text-xs text-gray-400">v2.5.0 - Intégration Multi-Pays</p>
              </div>
            </div>

            {/* Informations de statut */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Dernière mise à jour</p>
                <p className="text-sm text-white">{new Date().toLocaleString('fr-FR')}</p>
              </div>
              
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Système opérationnel"></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {/* Contenu principal */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] border-t border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>© 2025 Oracle Portfolio - Tous droits réservés</span>
          <span>Intégration réussie du module Vue Comparative Multi-Pays</span>
        </div>
      </footer>
    </div>
  );
};

export default IntegratedApp;

