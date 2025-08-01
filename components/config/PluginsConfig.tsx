import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, 
  Download, 
  Upload, 
  Trash2, 
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Code,
  Package
} from 'lucide-react';

interface PluginsConfigProps {
  onChange?: () => void;
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  installed: boolean;
  category: string;
  size: string;
  lastUpdate: string;
  dependencies: string[];
  permissions: string[];
  config?: Record<string, any>;
}

const DEFAULT_PLUGINS: Plugin[] = [
  {
    id: 'advanced-charts',
    name: 'Advanced Charts',
    description: 'Graphiques avancés avec indicateurs techniques personnalisés',
    version: '2.1.0',
    author: 'Oracle Team',
    enabled: true,
    installed: true,
    category: 'Visualisation',
    size: '2.3 MB',
    lastUpdate: '2025-01-15',
    dependencies: ['recharts', 'framer-motion'],
    permissions: ['read-data', 'modify-charts'],
    config: {
      defaultTheme: 'dark',
      animationSpeed: 'normal',
      showTooltips: true
    }
  },
  {
    id: 'ai-predictions',
    name: 'AI Predictions',
    description: 'Prédictions basées sur l\'intelligence artificielle',
    version: '1.5.2',
    author: 'AI Labs',
    enabled: false,
    installed: true,
    category: 'Intelligence Artificielle',
    size: '15.7 MB',
    lastUpdate: '2025-01-10',
    dependencies: ['tensorflow', 'numpy'],
    permissions: ['read-data', 'write-predictions', 'network-access'],
    config: {
      model: 'gpt-4',
      confidence: 0.8,
      updateFrequency: 'daily'
    }
  },
  {
    id: 'risk-analyzer',
    name: 'Risk Analyzer',
    description: 'Analyse de risque avancée avec stress testing',
    version: '3.0.1',
    author: 'Risk Solutions',
    enabled: true,
    installed: true,
    category: 'Analyse',
    size: '5.1 MB',
    lastUpdate: '2025-01-20',
    dependencies: ['lodash', 'moment'],
    permissions: ['read-data', 'calculate-risk'],
    config: {
      riskModel: 'var',
      confidenceLevel: 0.95,
      timeHorizon: 30
    }
  },
  {
    id: 'social-sentiment',
    name: 'Social Sentiment',
    description: 'Analyse du sentiment des réseaux sociaux',
    version: '1.2.0',
    author: 'Social Analytics',
    enabled: false,
    installed: false,
    category: 'Données Externes',
    size: '8.9 MB',
    lastUpdate: '2025-01-05',
    dependencies: ['axios', 'sentiment'],
    permissions: ['network-access', 'read-social-data'],
    config: {
      sources: ['twitter', 'reddit'],
      updateInterval: 3600,
      language: 'fr'
    }
  }
];

export default function PluginsConfig({ onChange }: PluginsConfigProps) {
  const [plugins, setPlugins] = useState<Plugin[]>(DEFAULT_PLUGINS);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<string>('advanced-charts');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Charger les plugins depuis localStorage
    const savedPlugins = localStorage.getItem('oracle-plugins-config');
    if (savedPlugins) {
      try {
        const parsed = JSON.parse(savedPlugins);
        setPlugins(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des plugins:', error);
      }
    }
  }, []);

  const handlePluginChange = (id: string, field: keyof Plugin, value: any) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === id 
        ? { ...plugin, [field]: value }
        : plugin
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleConfigChange = (id: string, configKey: string, value: any) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === id 
        ? { 
            ...plugin, 
            config: { 
              ...plugin.config, 
              [configKey]: value 
            }
          }
        : plugin
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleInstallPlugin = (id: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === id 
        ? { ...plugin, installed: true }
        : plugin
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleUninstallPlugin = (id: string) => {
    const confirm = window.confirm('Êtes-vous sûr de vouloir désinstaller ce plugin ?');
    if (confirm) {
      setPlugins(prev => prev.map(plugin => 
        plugin.id === id 
          ? { ...plugin, installed: false, enabled: false }
          : plugin
      ));
      setIsDirty(true);
      if (onChange) onChange();
    }
  };

  const handleSave = () => {
    localStorage.setItem('oracle-plugins-config', JSON.stringify(plugins));
    setIsDirty(false);
  };

  const handleReset = () => {
    setPlugins(DEFAULT_PLUGINS);
    localStorage.removeItem('oracle-plugins-config');
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const pluginData = JSON.parse(e.target?.result as string);
          // Ajouter le plugin importé
          setPlugins(prev => [...prev, { ...pluginData, installed: false, enabled: false }]);
          setIsDirty(true);
          if (onChange) onChange();
        } catch (error) {
          alert('Erreur lors de l\'import du plugin');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredPlugins = plugins.filter(plugin => {
    if (filter === 'all') return true;
    if (filter === 'installed') return plugin.installed;
    if (filter === 'enabled') return plugin.enabled;
    if (filter === 'available') return !plugin.installed;
    return plugin.category.toLowerCase() === filter.toLowerCase();
  });

  const selectedPluginData = plugins.find(p => p.id === selectedPlugin);
  const categories = Array.from(new Set(plugins.map(p => p.category)));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Puzzle className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-text-primary">Gestionnaire de Plugins</h2>
        </div>
        <p className="text-text-secondary">
          Installation et configuration des plugins extensibles
        </p>
      </div>

      {/* Status */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center space-x-3"
        >
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="text-warning font-medium">Modifications non sauvegardées</p>
            <p className="text-warning/80 text-sm">N'oubliez pas de sauvegarder vos changements</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-warning text-background-primary rounded-lg hover:bg-warning/90 transition-colors"
          >
            Sauvegarder
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plugins List */}
        <div className="lg:col-span-1">
          <div className="bg-background-tertiary rounded-lg p-4">
            {/* Filters */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">Filtrer par</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les plugins</option>
                <option value="installed">Installés</option>
                <option value="enabled">Activés</option>
                <option value="available">Disponibles</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Import Plugin */}
            <div className="mb-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <div className="w-full p-3 border-2 border-dashed border-background-primary rounded-lg text-center hover:border-primary-500 transition-colors">
                  <Upload className="w-5 h-5 mx-auto mb-1 text-text-secondary" />
                  <span className="text-sm text-text-secondary">Importer un plugin</span>
                </div>
              </label>
            </div>

            {/* Plugins List */}
            <h3 className="text-lg font-semibold text-text-primary mb-4">Plugins ({filteredPlugins.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPlugins.map((plugin) => (
                <motion.button
                  key={plugin.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlugin(plugin.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedPlugin === plugin.id
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'hover:bg-background-primary text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{plugin.name}</span>
                    <div className="flex items-center space-x-1">
                      {plugin.installed && (
                        <div className={`w-2 h-2 rounded-full ${plugin.enabled ? 'bg-success' : 'bg-warning'}`} />
                      )}
                      {!plugin.installed && (
                        <Package className="w-3 h-3 text-text-secondary" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-70 truncate">{plugin.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-text-secondary">{plugin.category}</span>
                    <span className="text-xs text-text-secondary">v{plugin.version}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Plugin Details */}
        <div className="lg:col-span-2">
          {selectedPluginData && (
            <div className="bg-background-tertiary rounded-lg p-6">
              {/* Plugin Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{selectedPluginData.name}</h3>
                  <p className="text-text-secondary">{selectedPluginData.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                    <span>v{selectedPluginData.version}</span>
                    <span>par {selectedPluginData.author}</span>
                    <span>{selectedPluginData.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedPluginData.installed ? (
                    <>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPluginData.enabled}
                          onChange={(e) => handlePluginChange(selectedPluginData.id, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                      
                      <button
                        onClick={() => handleUninstallPlugin(selectedPluginData.id)}
                        className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
                        title="Désinstaller"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleInstallPlugin(selectedPluginData.id)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Installer
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Plugin Info */}
                <section>
                  <h4 className="text-lg font-medium text-text-primary mb-4">Informations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background-primary rounded-lg">
                      <h5 className="font-medium text-text-primary mb-2">Catégorie</h5>
                      <p className="text-text-secondary">{selectedPluginData.category}</p>
                    </div>
                    <div className="p-4 bg-background-primary rounded-lg">
                      <h5 className="font-medium text-text-primary mb-2">Dernière mise à jour</h5>
                      <p className="text-text-secondary">{selectedPluginData.lastUpdate}</p>
                    </div>
                  </div>
                </section>

                {/* Dependencies */}
                <section>
                  <h4 className="text-lg font-medium text-text-primary mb-4">Dépendances</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPluginData.dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-2 py-1 bg-primary-500/10 text-primary-400 rounded text-xs font-mono"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Permissions */}
                <section>
                  <h4 className="text-lg font-medium text-text-primary mb-4">Permissions</h4>
                  <div className="space-y-2">
                    {selectedPluginData.permissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-text-secondary text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Configuration */}
                {selectedPluginData.config && selectedPluginData.installed && (
                  <section>
                    <h4 className="text-lg font-medium text-text-primary mb-4">Configuration</h4>
                    <div className="space-y-4">
                      {Object.entries(selectedPluginData.config).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="block text-sm font-medium text-text-secondary capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </label>
                          {typeof value === 'boolean' ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleConfigChange(selectedPluginData.id, key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                          ) : typeof value === 'number' ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleConfigChange(selectedPluginData.id, key, parseFloat(e.target.value) || 0)}
                              className="px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => handleConfigChange(selectedPluginData.id, key, e.target.value)}
                              className="px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <section className="pt-6 border-t border-background-tertiary mt-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
          >
            Réinitialiser
          </button>
          
          <div className="flex items-center space-x-3">
            {!isDirty && (
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Sauvegardé</span>
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

