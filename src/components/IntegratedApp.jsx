import React, { useState } from 'react';
import OriginalDashboard from './OriginalDashboard';
import OriginalAnalytics from './OriginalAnalytics';
import MultiCountryComparison from './MultiCountryComparison';

const IntegratedApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OriginalDashboard />;
      case 'analytics':
        return <OriginalAnalytics />;
      case 'comparison':
        return <MultiCountryComparison />;
      default:
        return <OriginalDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* Navigation Header */}
      <header className="bg-[#1a1a2e] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo et titre */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Oracle Portfolio</h1>
                <p className="text-xs text-gray-400">v2.4.0 - Validation période automatique</p>
              </div>
            </div>

            {/* Informations de statut */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Dernière mise à jour</span>
              </div>
              <span className="text-xs text-green-400 font-mono">
                {new Date().toLocaleString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-[#2d2d44] text-gray-300 hover:bg-[#3d3d54]'
              }`}
            >
              📊 Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-[#2d2d44] text-gray-300 hover:bg-[#3d3d54]'
              }`}
            >
              📈 Analytics
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
                activeTab === 'comparison'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-[#2d2d44] text-gray-300 hover:bg-[#3d3d54]'
              }`}
            >
              🌍 Comparaison
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Nouveau
              </span>
            </button>

            <button className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all">
              🔐 Get Full Access
            </button>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default IntegratedApp;

