import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  BarChart3, 
  Calculator, 
  TrendingUp, 
  Puzzle,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import GeneralConfig from './config/GeneralConfig';
import IndicatorsConfig from './config/IndicatorsConfig';
import FormulasConfig from './config/FormulasConfig';
import RegimesConfig from './config/RegimesConfig';
import PluginsConfig from './config/PluginsConfig';

interface ConfigurationTabsProps {
  onSave?: (config: any) => void;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
}

const TABS = [
  {
    id: 'general',
    label: 'Général',
    icon: Settings,
    description: 'Configuration générale du système'
  },
  {
    id: 'indicators',
    label: 'Indicateurs',
    icon: BarChart3,
    description: '7 indicateurs économiques configurables'
  },
  {
    id: 'formulas',
    label: 'Formules',
    icon: Calculator,
    description: 'Formules de calcul personnalisables'
  },
  {
    id: 'regimes',
    label: 'Régimes',
    icon: TrendingUp,
    description: '4 régimes économiques configurables'
  },
  {
    id: 'plugins',
    label: 'Plugins',
    icon: Puzzle,
    description: 'Gestionnaire de plugins extensibles'
  }
];

export default function ConfigurationTabs({ 
  onSave, 
  onReset, 
  onExport, 
  onImport 
}: ConfigurationTabsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (hasChanges) {
      const confirm = window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous continuer ?');
      if (!confirm) return;
    }
    setActiveTab(tabId);
    setHasChanges(false);
  };

  const handleConfigChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({});
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    const confirm = window.confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?');
    if (confirm && onReset) {
      onReset();
      setHasChanges(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
      setHasChanges(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralConfig onChange={handleConfigChange} />;
      case 'indicators':
        return <IndicatorsConfig onChange={handleConfigChange} />;
      case 'formulas':
        return <FormulasConfig onChange={handleConfigChange} />;
      case 'regimes':
        return <RegimesConfig onChange={handleConfigChange} />;
      case 'plugins':
        return <PluginsConfig onChange={handleConfigChange} />;
      default:
        return <GeneralConfig onChange={handleConfigChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
      {/* Header */}
      <div className="border-b border-background-tertiary bg-background-secondary/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">Configuration Oracle Portfolio</h1>
                <p className="text-xs text-text-secondary">Paramétrage avancé du système</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-warning/10 rounded-full">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span className="text-xs text-warning">Non sauvegardé</span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!hasChanges}
                className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
                title="Sauvegarder"
              >
                <Save className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExport}
                className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                title="Exporter"
              >
                <Download className="w-4 h-4" />
              </motion.button>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                  title="Importer"
                >
                  <Upload className="w-4 h-4" />
                </motion.div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-background-secondary rounded-xl border border-background-tertiary p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Modules</h3>
              <nav className="space-y-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'hover:bg-background-tertiary text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{tab.label}</p>
                          <p className="text-xs opacity-70 truncate">{tab.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background-secondary rounded-xl border border-background-tertiary"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

