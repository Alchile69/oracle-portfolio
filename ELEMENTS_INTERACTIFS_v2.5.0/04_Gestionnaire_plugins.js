// 🔌 GESTIONNAIRE DE PLUGINS - ExtensibleConfigurationPanel.jsx
// 📅 Date : 4 Août 2025
// 🎯 Version : v2.5.0 (19 Juillet 2025)

// ========================================
// 1. CONFIGURATION DES PLUGINS
// ========================================

// ✅ Configuration initiale avec Map()
const pluginsConfig = {
  indicators: new Map(),
  formulas: new Map(),
  regimes: new Map()
};

// ✅ Structure d'un plugin
const pluginStructure = {
  id: '',
  name: '',
  version: '1.0.0',
  description: '',
  author: '',
  category: '', // 'indicator', 'formula', 'regime'
  enabled: true,
  dependencies: [],
  config: {},
  ui: {
    icon: '🔌',
    color: '#6b7280'
  },
  hooks: {
    onLoad: null,
    onUnload: null,
    onConfigChange: null
  }
};

// ========================================
// 2. CLASSE GESTIONNAIRE DE PLUGINS
// ========================================

class PluginManager {
  constructor() {
    this.plugins = {
      indicators: new Map(),
      formulas: new Map(),
      regimes: new Map()
    };
    this.loadedPlugins = new Set();
    this.pluginRegistry = new Map();
  }

  // ✅ Enregistrer un plugin
  registerPlugin(pluginData) {
    const { id, category } = pluginData;
    
    if (!this.plugins[category]) {
      throw new Error(`Catégorie de plugin invalide: ${category}`);
    }

    if (this.plugins[category].has(id)) {
      throw new Error(`Plugin déjà enregistré: ${id}`);
    }

    const plugin = {
      ...pluginStructure,
      ...pluginData,
      registeredAt: new Date(),
      status: 'registered'
    };

    this.plugins[category].set(id, plugin);
    this.pluginRegistry.set(id, plugin);
    
    console.log(`Plugin enregistré: ${id} (${category})`);
    return plugin;
  }

  // ✅ Charger un plugin
  async loadPlugin(pluginId) {
    const plugin = this.pluginRegistry.get(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin non trouvé: ${pluginId}`);
    }

    if (this.loadedPlugins.has(pluginId)) {
      console.log(`Plugin déjà chargé: ${pluginId}`);
      return plugin;
    }

    try {
      // Vérifier les dépendances
      await this.checkDependencies(plugin);
      
      // Exécuter le hook onLoad
      if (plugin.hooks.onLoad) {
        await plugin.hooks.onLoad(plugin);
      }

      plugin.status = 'loaded';
      plugin.loadedAt = new Date();
      this.loadedPlugins.add(pluginId);
      
      console.log(`Plugin chargé: ${pluginId}`);
      return plugin;
    } catch (error) {
      plugin.status = 'error';
      plugin.error = error.message;
      throw error;
    }
  }

  // ✅ Décharger un plugin
  async unloadPlugin(pluginId) {
    const plugin = this.pluginRegistry.get(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin non trouvé: ${pluginId}`);
    }

    if (!this.loadedPlugins.has(pluginId)) {
      console.log(`Plugin non chargé: ${pluginId}`);
      return;
    }

    try {
      // Exécuter le hook onUnload
      if (plugin.hooks.onUnload) {
        await plugin.hooks.onUnload(plugin);
      }

      plugin.status = 'unloaded';
      plugin.unloadedAt = new Date();
      this.loadedPlugins.delete(pluginId);
      
      console.log(`Plugin déchargé: ${pluginId}`);
    } catch (error) {
      console.error(`Erreur lors du déchargement du plugin ${pluginId}:`, error);
      throw error;
    }
  }

  // ✅ Vérifier les dépendances
  async checkDependencies(plugin) {
    const { dependencies } = plugin;
    
    for (const depId of dependencies) {
      const depPlugin = this.pluginRegistry.get(depId);
      
      if (!depPlugin) {
        throw new Error(`Dépendance manquante: ${depId}`);
      }
      
      if (!this.loadedPlugins.has(depId)) {
        await this.loadPlugin(depId);
      }
    }
  }

  // ✅ Obtenir tous les plugins d'une catégorie
  getPluginsByCategory(category) {
    return Array.from(this.plugins[category].values());
  }

  // ✅ Obtenir un plugin par ID
  getPlugin(pluginId) {
    return this.pluginRegistry.get(pluginId);
  }

  // ✅ Obtenir les plugins chargés
  getLoadedPlugins() {
    return Array.from(this.loadedPlugins);
  }

  // ✅ Activer/Désactiver un plugin
  togglePlugin(pluginId, enabled) {
    const plugin = this.pluginRegistry.get(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin non trouvé: ${pluginId}`);
    }

    plugin.enabled = enabled;
    plugin.updatedAt = new Date();
    
    // Exécuter le hook onConfigChange
    if (plugin.hooks.onConfigChange) {
      plugin.hooks.onConfigChange(plugin);
    }
    
    console.log(`Plugin ${enabled ? 'activé' : 'désactivé'}: ${pluginId}`);
    return plugin;
  }

  // ✅ Mettre à jour la configuration d'un plugin
  updatePluginConfig(pluginId, config) {
    const plugin = this.pluginRegistry.get(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin non trouvé: ${pluginId}`);
    }

    plugin.config = { ...plugin.config, ...config };
    plugin.updatedAt = new Date();
    
    // Exécuter le hook onConfigChange
    if (plugin.hooks.onConfigChange) {
      plugin.hooks.onConfigChange(plugin);
    }
    
    console.log(`Configuration mise à jour pour le plugin: ${pluginId}`);
    return plugin;
  }

  // ✅ Supprimer un plugin
  async removePlugin(pluginId) {
    const plugin = this.pluginRegistry.get(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin non trouvé: ${pluginId}`);
    }

    // Décharger le plugin s'il est chargé
    if (this.loadedPlugins.has(pluginId)) {
      await this.unloadPlugin(pluginId);
    }

    // Supprimer des registres
    this.plugins[plugin.category].delete(pluginId);
    this.pluginRegistry.delete(pluginId);
    
    console.log(`Plugin supprimé: ${pluginId}`);
  }

  // ✅ Obtenir les statistiques des plugins
  getPluginStats() {
    const stats = {
      total: this.pluginRegistry.size,
      loaded: this.loadedPlugins.size,
      byCategory: {}
    };

    for (const category of Object.keys(this.plugins)) {
      const categoryPlugins = this.getPluginsByCategory(category);
      stats.byCategory[category] = {
        total: categoryPlugins.length,
        loaded: categoryPlugins.filter(p => this.loadedPlugins.has(p.id)).length,
        enabled: categoryPlugins.filter(p => p.enabled).length
      };
    }

    return stats;
  }
}

// ========================================
// 3. PLUGINS PRÉDÉFINIS
// ========================================

// ✅ Plugin d'indicateur personnalisé
const customIndicatorPlugin = {
  id: 'custom_indicator',
  name: 'Indicateur Personnalisé',
  version: '1.0.0',
  description: 'Permet de créer des indicateurs personnalisés',
  author: 'Oracle Portfolio',
  category: 'indicator',
  enabled: true,
  dependencies: [],
  config: {
    allowCustomSources: true,
    maxCustomIndicators: 10
  },
  ui: {
    icon: '📊',
    color: '#3b82f6'
  },
  hooks: {
    onLoad: async (plugin) => {
      console.log('Plugin indicateur personnalisé chargé');
    },
    onUnload: async (plugin) => {
      console.log('Plugin indicateur personnalisé déchargé');
    },
    onConfigChange: (plugin) => {
      console.log('Configuration du plugin indicateur mise à jour');
    }
  }
};

// ✅ Plugin de formule avancée
const advancedFormulaPlugin = {
  id: 'advanced_formula',
  name: 'Formules Avancées',
  version: '1.0.0',
  description: 'Formules mathématiques avancées avec validation',
  author: 'Oracle Portfolio',
  category: 'formula',
  enabled: true,
  dependencies: [],
  config: {
    enableValidation: true,
    allowCustomFunctions: true
  },
  ui: {
    icon: '🧮',
    color: '#8b5cf6'
  },
  hooks: {
    onLoad: async (plugin) => {
      console.log('Plugin formules avancées chargé');
    },
    onUnload: async (plugin) => {
      console.log('Plugin formules avancées déchargé');
    },
    onConfigChange: (plugin) => {
      console.log('Configuration du plugin formules mise à jour');
    }
  }
};

// ✅ Plugin de régime économique
const economicRegimePlugin = {
  id: 'economic_regime',
  name: 'Régimes Économiques',
  version: '1.0.0',
  description: 'Gestion des régimes économiques avancés',
  author: 'Oracle Portfolio',
  category: 'regime',
  enabled: true,
  dependencies: ['custom_indicator', 'advanced_formula'],
  config: {
    enableAutoDetection: true,
    maxRegimes: 10
  },
  ui: {
    icon: '📈',
    color: '#10b981'
  },
  hooks: {
    onLoad: async (plugin) => {
      console.log('Plugin régimes économiques chargé');
    },
    onUnload: async (plugin) => {
      console.log('Plugin régimes économiques déchargé');
    },
    onConfigChange: (plugin) => {
      console.log('Configuration du plugin régimes mise à jour');
    }
  }
};

// ========================================
// 4. FONCTIONS UTILITAIRES
// ========================================

// ✅ Créer une instance du gestionnaire
const createPluginManager = () => {
  const manager = new PluginManager();
  
  // Enregistrer les plugins prédefinis
  manager.registerPlugin(customIndicatorPlugin);
  manager.registerPlugin(advancedFormulaPlugin);
  manager.registerPlugin(economicRegimePlugin);
  
  return manager;
};

// ✅ Charger tous les plugins activés
const loadEnabledPlugins = async (manager) => {
  const enabledPlugins = Array.from(manager.pluginRegistry.values())
    .filter(plugin => plugin.enabled);
  
  for (const plugin of enabledPlugins) {
    try {
      await manager.loadPlugin(plugin.id);
    } catch (error) {
      console.error(`Erreur lors du chargement du plugin ${plugin.id}:`, error);
    }
  }
};

// ✅ Obtenir les plugins par statut
const getPluginsByStatus = (manager, status) => {
  return Array.from(manager.pluginRegistry.values())
    .filter(plugin => plugin.status === status);
};

// ✅ Valider la structure d'un plugin
const validatePluginStructure = (pluginData) => {
  const requiredFields = ['id', 'name', 'category'];
  const errors = [];
  
  for (const field of requiredFields) {
    if (!pluginData[field]) {
      errors.push(`Champ requis manquant: ${field}`);
    }
  }
  
  if (!['indicator', 'formula', 'regime'].includes(pluginData.category)) {
    errors.push('Catégorie invalide');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ========================================
// 5. HOOKS REACT POUR LES PLUGINS
// ========================================

// ✅ Hook pour utiliser le gestionnaire de plugins
const usePluginManager = () => {
  const [manager] = useState(() => createPluginManager());
  const [plugins, setPlugins] = useState({
    indicators: [],
    formulas: [],
    regimes: []
  });
  const [stats, setStats] = useState(manager.getPluginStats());

  // Mettre à jour les plugins
  const updatePlugins = useCallback(() => {
    setPlugins({
      indicators: manager.getPluginsByCategory('indicator'),
      formulas: manager.getPluginsByCategory('formula'),
      regimes: manager.getPluginsByCategory('regime')
    });
    setStats(manager.getPluginStats());
  }, [manager]);

  // Charger un plugin
  const loadPlugin = useCallback(async (pluginId) => {
    try {
      await manager.loadPlugin(pluginId);
      updatePlugins();
    } catch (error) {
      console.error('Erreur lors du chargement du plugin:', error);
      throw error;
    }
  }, [manager, updatePlugins]);

  // Décharger un plugin
  const unloadPlugin = useCallback(async (pluginId) => {
    try {
      await manager.unloadPlugin(pluginId);
      updatePlugins();
    } catch (error) {
      console.error('Erreur lors du déchargement du plugin:', error);
      throw error;
    }
  }, [manager, updatePlugins]);

  // Activer/Désactiver un plugin
  const togglePlugin = useCallback((pluginId, enabled) => {
    try {
      manager.togglePlugin(pluginId, enabled);
      updatePlugins();
    } catch (error) {
      console.error('Erreur lors de la modification du plugin:', error);
      throw error;
    }
  }, [manager, updatePlugins]);

  // Mettre à jour la configuration
  const updatePluginConfig = useCallback((pluginId, config) => {
    try {
      manager.updatePluginConfig(pluginId, config);
      updatePlugins();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration:', error);
      throw error;
    }
  }, [manager, updatePlugins]);

  // Supprimer un plugin
  const removePlugin = useCallback(async (pluginId) => {
    try {
      await manager.removePlugin(pluginId);
      updatePlugins();
    } catch (error) {
      console.error('Erreur lors de la suppression du plugin:', error);
      throw error;
    }
  }, [manager, updatePlugins]);

  // Initialiser les plugins au montage
  useEffect(() => {
    updatePlugins();
    loadEnabledPlugins(manager).then(() => {
      updatePlugins();
    });
  }, [manager, updatePlugins]);

  return {
    manager,
    plugins,
    stats,
    loadPlugin,
    unloadPlugin,
    togglePlugin,
    updatePluginConfig,
    removePlugin,
    updatePlugins
  };
};

// ========================================
// 6. COMPOSANT D'INTERFACE PLUGINS
// ========================================

const PluginManagerUI = () => {
  const {
    plugins,
    stats,
    loadPlugin,
    unloadPlugin,
    togglePlugin,
    updatePluginConfig,
    removePlugin
  } = usePluginManager();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleLoadPlugin = async (pluginId) => {
    try {
      await loadPlugin(pluginId);
    } catch (error) {
      alert(`Erreur lors du chargement: ${error.message}`);
    }
  };

  const handleUnloadPlugin = async (pluginId) => {
    try {
      await unloadPlugin(pluginId);
    } catch (error) {
      alert(`Erreur lors du déchargement: ${error.message}`);
    }
  };

  const handleTogglePlugin = (pluginId, enabled) => {
    try {
      togglePlugin(pluginId, enabled);
    } catch (error) {
      alert(`Erreur lors de la modification: ${error.message}`);
    }
  };

  const handleRemovePlugin = async (pluginId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plugin ?')) {
      try {
        await removePlugin(pluginId);
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    }
  };

  const renderPluginCard = (plugin) => (
    <div key={plugin.id} className="plugin-card">
      <div className="plugin-header">
        <span className="plugin-icon">{plugin.ui.icon}</span>
        <h4>{plugin.name}</h4>
        <div className="plugin-actions">
          <button
            onClick={() => handleTogglePlugin(plugin.id, !plugin.enabled)}
            className={`toggle-btn ${plugin.enabled ? 'enabled' : 'disabled'}`}
            title={plugin.enabled ? 'Désactiver' : 'Activer'}
          >
            {plugin.enabled ? '✅' : '❌'}
          </button>
          {plugin.status === 'loaded' ? (
            <button
              onClick={() => handleUnloadPlugin(plugin.id)}
              className="unload-btn"
              title="Décharger"
            >
              🔄
            </button>
          ) : (
            <button
              onClick={() => handleLoadPlugin(plugin.id)}
              className="load-btn"
              title="Charger"
            >
              ⬇️
            </button>
          )}
          <button
            onClick={() => handleRemovePlugin(plugin.id)}
            className="remove-btn"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="plugin-details">
        <p><strong>Version:</strong> {plugin.version}</p>
        <p><strong>Description:</strong> {plugin.description}</p>
        <p><strong>Statut:</strong> {plugin.status}</p>
        <p><strong>Catégorie:</strong> {plugin.category}</p>
        {plugin.dependencies.length > 0 && (
          <p><strong>Dépendances:</strong> {plugin.dependencies.join(', ')}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="plugin-manager-ui">
      <div className="plugin-header">
        <h3>Système de Plugins</h3>
        <div className="plugin-stats">
          <span>Total: {stats.total}</span>
          <span>Chargés: {stats.loaded}</span>
        </div>
        <button onClick={() => setShowInstallModal(true)} className="install-btn">
          📦 Installer un plugin
        </button>
      </div>

      <div className="plugin-categories">
        <button
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          Tous ({stats.total})
        </button>
        <button
          className={selectedCategory === 'indicator' ? 'active' : ''}
          onClick={() => setSelectedCategory('indicator')}
        >
          Indicateurs ({stats.byCategory.indicator?.total || 0})
        </button>
        <button
          className={selectedCategory === 'formula' ? 'active' : ''}
          onClick={() => setSelectedCategory('formula')}
        >
          Formules ({stats.byCategory.formula?.total || 0})
        </button>
        <button
          className={selectedCategory === 'regime' ? 'active' : ''}
          onClick={() => setSelectedCategory('regime')}
        >
          Régimes ({stats.byCategory.regime?.total || 0})
        </button>
      </div>

      <div className="plugins-grid">
        {Object.entries(plugins).map(([category, categoryPlugins]) => {
          if (selectedCategory !== 'all' && selectedCategory !== category) {
            return null;
          }
          return categoryPlugins.map(renderPluginCard);
        })}
      </div>
    </div>
  );
};

// ========================================
// 7. EXPORT DES FONCTIONS
// ========================================

export {
  PluginManager,
  createPluginManager,
  loadEnabledPlugins,
  getPluginsByStatus,
  validatePluginStructure,
  usePluginManager,
  PluginManagerUI,
  customIndicatorPlugin,
  advancedFormulaPlugin,
  economicRegimePlugin,
  pluginsConfig,
  pluginStructure
};

export default PluginManager; 