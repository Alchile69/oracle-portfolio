import React, { useState, useEffect } from 'react';
// Force rebuild - 19/07/2025 15:20 - Test cache bust
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, RotateCcw, Download, Clock, TrendingUp, PieChart, Activity, BarChart3, Globe, Eye, Table, Zap } from 'lucide-react';
import CountryCheckboxSelector from './components/CountryCheckboxSelector';
import ComparisonCharts from './components/ComparisonCharts';
import ComparisonTable from './components/ComparisonTable';
import HeatmapChart from './components/HeatmapChart';
import FilterPanel from './components/FilterPanel';
import './App.css';

function App() {
  const [selectedCountries, setSelectedCountries] = useState(['US', 'DE', 'FR', 'UK']);
  const [viewMode, setViewMode] = useState('charts');
  const [activeTab, setActiveTab] = useState('performance');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [filters, setFilters] = useState({
    period: '1Y',
    benchmark: 'local',
    indicators: ['performance', 'risk'],
    minReturn: 0,
    maxRisk: 100,
    showPositiveOnly: false,
    includeDrawdown: true,
    realTimeUpdate: true,
    darkMode: false,
    selectedCountries: ['US', 'DE', 'FR', 'UK']
  });

  // Mise à jour automatique toutes les 30 secondes si activée
  useEffect(() => {
    if (filters.realTimeUpdate) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [filters.realTimeUpdate]);

  // Mode sombre automatique selon l'heure
  useEffect(() => {
    const updateDarkMode = () => {
      const hour = new Date().getHours();
      const shouldBeDark = hour < 7 || hour > 19;
      setFilters(prev => ({ ...prev, darkMode: shouldBeDark }));
    };
    
    // Mise à jour initiale
    updateDarkMode();
    
    // Mise à jour toutes les heures
    const interval = setInterval(updateDarkMode, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCountryChange = (countries) => {
    try {
      if (Array.isArray(countries)) {
        setSelectedCountries(countries);
        setFilters(prev => ({ ...prev, selectedCountries: countries }));
      } else {
        console.error('handleCountryChange: countries n\'est pas un tableau', countries);
      }
    } catch (error) {
      console.error('Erreur lors du changement de pays:', error);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, selectedCountries });
  };

  const handleExport = async (format) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Export en format ${format} pour les pays:`, selectedCountries);
    alert(`Export ${format.toUpperCase()} généré avec succès !`);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'allocation': return <PieChart className="h-4 w-4" />;
      case 'indicators': return <Activity className="h-4 w-4" />;
      case 'backtesting': return <BarChart3 className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getViewModeIcon = (mode) => {
    switch (mode) {
      case 'charts': return <BarChart3 className="h-4 w-4" />;
      case 'table': return <Table className="h-4 w-4" />;
      case 'heatmap': return <Zap className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const renderContent = () => {
    if (selectedCountries.length === 0) {
      return (
        <Card className="col-span-3">
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucun pays sélectionné</h3>
              <p className="text-sm">Sélectionnez au moins un pays pour commencer la comparaison</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (viewMode) {
      case 'table':
        return (
          <div className="col-span-3">
            <ComparisonTable 
              selectedCountries={selectedCountries} 
              activeTab={activeTab}
              filters={filters}
            />
          </div>
        );
      case 'heatmap':
        return (
          <div className="col-span-3">
            <HeatmapChart 
              selectedCountries={selectedCountries} 
              activeTab={activeTab}
              filters={filters}
            />
          </div>
        );
      default:
        return (
          <div className="col-span-3">
            <ComparisonCharts 
              selectedCountries={selectedCountries} 
              activeTab={activeTab}
              filters={filters}
            />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      filters.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Oracle Portfolio
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vue Comparative Multi-Pays
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                {selectedCountries.length} pays sélectionnés
              </Badge>
              <Badge variant="secondary" className="hidden sm:flex">
                Dernière MAJ: {lastUpdate.toLocaleTimeString()}
              </Badge>
              {filters.realTimeUpdate && (
                <Badge variant="default" className="animate-pulse">
                  🔴 Live
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panneau de contrôle gauche */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sélecteur de pays avec checkboxes */}
            <CountryCheckboxSelector
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
              maxCountries={4}
            />

            {/* Mode de visualisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Mode de Vue</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { mode: 'charts', label: 'Graphiques' },
                    { mode: 'table', label: 'Tableau' },
                    { mode: 'heatmap', label: 'Heatmap' }
                  ].map(({ mode, label }) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'outline'}
                      onClick={() => setViewMode(mode)}
                      className="justify-start"
                    >
                      {getViewModeIcon(mode)}
                      <span className="ml-2">{label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filtres et contrôles */}
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onExport={handleExport}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          </div>

          {/* Zone principale */}
          <div className="lg:col-span-3 space-y-6">
            {/* Onglets de navigation */}
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-wrap border-b">
                  {[
                    { tab: 'performance', label: 'Performance', count: 15 },
                    { tab: 'allocation', label: 'Allocation', count: 14 },
                    { tab: 'indicators', label: 'Indicateurs', count: 8 },
                    { tab: 'backtesting', label: 'Backtesting', count: 16 }
                  ].map(({ tab, label, count }) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors
                        ${activeTab === tab
                          ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }
                      `}
                    >
                      {getTabIcon(tab)}
                      <span>{label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contenu principal */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

