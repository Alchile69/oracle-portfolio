import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Download, 
  TrendingUp, 
  PieChart, 
  Activity, 
  BarChart3,
  Globe,
  Eye,
  Table,
  Zap,
  Filter
} from 'lucide-react';

// Import des composants existants adaptés
import ComparisonCharts from './ComparisonCharts';
import ComparisonTable from './ComparisonTable';
import HeatmapChart from './HeatmapChart';
import FilterPanel from './FilterPanel';
import CountryCheckboxSelector from './CountryCheckboxSelector';

// Import des utilitaires
import { getComparisonData } from '../data/mockData';
import { exportData, exportFormats } from '../utils/exportUtils';

const MultiCountryComparison = () => {
  // États du composant
  const [selectedCountries, setSelectedCountries] = useState(['US', 'DE', 'FR', 'UK']);
  const [activeTab, setActiveTab] = useState('performance');
  const [filters, setFilters] = useState({
    minReturn: '',
    maxRisk: '',
    showPositiveOnly: false,
    benchmark: 'sp500'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Données de comparaison
  const comparisonData = getComparisonData(selectedCountries);

  // Gestion des pays sélectionnés
  const handleCountryChange = (countries) => {
    setSelectedCountries(countries);
    setLastUpdate(new Date());
  };

  // Gestion des filtres
  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, selectedCountries });
  };

  // Export des données
  const handleExport = async (format) => {
    setIsLoading(true);
    
    try {
      const result = await exportData(comparisonData, format, {
        filename: 'oracle-portfolio-comparison',
        includeHistorical: true,
        includeHeaders: true
      });
      
      if (result.success) {
        // Notification de succès (à adapter selon le système de notifications existant)
        console.log('✅ Export réussi:', result.message);
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('❌ Erreur d\'export:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualisation des données
  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  // Icônes des onglets
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'allocation': return <PieChart className="h-4 w-4" />;
      case 'indicators': return <Activity className="h-4 w-4" />;
      case 'backtesting': return <BarChart3 className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      {/* En-tête de la section */}
      <div className="border-b border-gray-800 bg-[#1a1a2e] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="h-6 w-6 text-cyan-400" />
              Vue Comparative Multi-Pays
            </h1>
            <p className="text-gray-400 mt-1">
              Analyse comparative des performances financières par pays
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              {selectedCountries.length} pays sélectionnés
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6 space-y-6">
        {/* Sélection des pays et contrôles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection des pays */}
          <Card className="lg:col-span-2 bg-[#1a1a2e] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                Sélection des Pays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CountryCheckboxSelector
                selectedCountries={selectedCountries}
                onCountryChange={handleCountryChange}
              />
            </CardContent>
          </Card>

          {/* Panneau de filtres */}
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-cyan-400" />
                Filtres et Contrôles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onExport={handleExport}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Informations de mise à jour */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Dernière mise à jour : {lastUpdate.toLocaleString('fr-FR')}
          </span>
          <span>
            {comparisonData.length} pays analysés
          </span>
        </div>

        {/* Onglets de visualisation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1a1a2e] border border-gray-700">
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300"
            >
              <div className="flex items-center gap-2">
                {getTabIcon('performance')}
                Performance
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="allocation" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300"
            >
              <div className="flex items-center gap-2">
                {getTabIcon('allocation')}
                Allocation
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="indicators" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300"
            >
              <div className="flex items-center gap-2">
                {getTabIcon('indicators')}
                Indicateurs
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="backtesting" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300"
            >
              <div className="flex items-center gap-2">
                {getTabIcon('backtesting')}
                Backtesting
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <div className="mt-6">
            <TabsContent value="performance" className="space-y-6">
              <ComparisonCharts
                selectedCountries={selectedCountries}
                activeTab="performance"
                filters={filters}
              />
            </TabsContent>

            <TabsContent value="allocation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComparisonCharts
                  selectedCountries={selectedCountries}
                  activeTab="allocation"
                  filters={filters}
                />
                <HeatmapChart
                  selectedCountries={selectedCountries}
                  filters={filters}
                />
              </div>
            </TabsContent>

            <TabsContent value="indicators" className="space-y-6">
              <ComparisonCharts
                selectedCountries={selectedCountries}
                activeTab="indicators"
                filters={filters}
              />
            </TabsContent>

            <TabsContent value="backtesting" className="space-y-6">
              <ComparisonCharts
                selectedCountries={selectedCountries}
                activeTab="backtesting"
                filters={filters}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Tableau de données détaillées */}
        <Card className="bg-[#1a1a2e] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Table className="h-5 w-5 text-cyan-400" />
              Données Détaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonTable
              selectedCountries={selectedCountries}
              filters={filters}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiCountryComparison;

