import React from 'react';
import Card from '../ui/Card-fixed';
import { Settings, Database, Globe, Shield, Clock, Activity } from 'lucide-react';

interface ConfigurationData {
  system: {
    version: string;
    lastUpdate: string;
    status: 'operational' | 'maintenance' | 'error';
  };
  dataSources: {
    fred: 'active' | 'inactive';
    alphaVantage: 'active' | 'inactive';
    eia: 'active' | 'inactive';
  };
  countries: string[];
  updateFrequency: string;
  apiEndpoints: number;
}

interface ConfigurationCardProps {
  data?: ConfigurationData;
  isLoading?: boolean;
  error?: string | null;
}

const ConfigurationCard: React.FC<ConfigurationCardProps> = ({ 
  data, 
  isLoading = false, 
  error = null 
}) => {
  if (isLoading) {
    return (
      <Card 
        title="Configuration Système" 
        className="bg-gray-800 border-gray-700"
        isLoading={true}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        title="Configuration Système" 
        className="bg-gray-800 border-gray-700"
      >
        <div className="text-red-400 text-sm">
          Erreur de chargement de la configuration
        </div>
      </Card>
    );
  }

  // Données par défaut si aucune donnée n'est fournie
  const defaultData: ConfigurationData = {
    system: {
      version: "4.2.0",
      lastUpdate: new Date().toISOString(),
      status: 'operational'
    },
    dataSources: {
      fred: 'active',
      alphaVantage: 'active',
      eia: 'active'
    },
    countries: ['France', 'États-Unis', 'Allemagne', 'Royaume-Uni'],
    updateFrequency: "5 minutes",
    apiEndpoints: 7
  };

  const configData = data || defaultData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'active':
        return 'text-green-400';
      case 'maintenance':
        return 'text-yellow-400';
      case 'error':
      case 'inactive':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'active':
        return '🟢';
      case 'maintenance':
        return '🟡';
      case 'error':
      case 'inactive':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <Card 
      title="Configuration Système"
      subtitle={`Version ${configData.system.version}`}
      className="bg-gray-800 border-gray-700"
    >
      <div className="space-y-4">
        {/* Statut système */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Statut Système</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">État général:</span>
            <span className={`text-sm font-medium ${getStatusColor(configData.system.status)}`}>
              {getStatusIcon(configData.system.status)} {configData.system.status === 'operational' ? 'Opérationnel' : 
                configData.system.status === 'maintenance' ? 'Maintenance' : 'Erreur'}
            </span>
          </div>
        </div>

        {/* Sources de données */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-white">Sources de Données</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">FRED API:</span>
              <span className={`text-sm font-medium ${getStatusColor(configData.dataSources.fred)}`}>
                {getStatusIcon(configData.dataSources.fred)} {configData.dataSources.fred === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Alpha Vantage:</span>
              <span className={`text-sm font-medium ${getStatusColor(configData.dataSources.alphaVantage)}`}>
                {getStatusIcon(configData.dataSources.alphaVantage)} {configData.dataSources.alphaVantage === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">EIA API:</span>
              <span className={`text-sm font-medium ${getStatusColor(configData.dataSources.eia)}`}>
                {getStatusIcon(configData.dataSources.eia)} {configData.dataSources.eia === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration générale */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Pays Supportés</span>
            </div>
            <div className="text-sm font-medium text-white">
              {configData.countries.length} pays
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Fréquence Mise à Jour</span>
            </div>
            <div className="text-sm font-medium text-white">
              {configData.updateFrequency}
            </div>
          </div>
        </div>

        {/* Endpoints API */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Endpoints API</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Fonctions Firebase:</span>
            <span className="text-sm font-medium text-purple-400">
              {configData.apiEndpoints} endpoints actifs
            </span>
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Dernière mise à jour:</span>
            <span className="text-sm text-gray-300">
              {new Date(configData.system.lastUpdate).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConfigurationCard; 