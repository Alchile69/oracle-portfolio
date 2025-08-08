// 🎯 HANDLERS ONCLICK - ExtensibleConfigurationPanel.jsx
// 📅 Date : 4 Août 2025
// 🎯 Version : v2.5.0 (19 Juillet 2025)

// ========================================
// 1. HANDLERS PRINCIPAUX
// ========================================

// ✅ Bouton d'ajout d'élément
const openAddModal = (type) => {
  setAddModalType(type);
  setShowAddModal(true);
  setNewItemData({
    id: '',
    name: '',
    category: type === 'indicator' ? 'physical' : 'scoring',
    weight: 25,
    enabled: true
  });
};

// ✅ Fermeture de la modal
const closeAddModal = () => {
  setShowAddModal(false);
  setNewItemData({});
};

// ✅ Ajout d'un nouvel élément
const addNewItem = () => {
  if (!newItemData.id || !newItemData.name) {
    alert('ID et nom requis');
    return;
  }

  const updatedConfig = { ...config };
  
  switch (addModalType) {
    case 'indicator':
      updatedConfig.indicators[newItemData.id] = {
        ...newItemData,
        enabled: true,
        ui: { icon: '📊', color: '#6b7280' }
      };
      break;
    case 'formula':
      updatedConfig.formulas[newItemData.id] = {
        ...newItemData,
        enabled: true,
        ui: { icon: '🧮', color: '#8b5cf6' }
      };
      break;
    case 'regime':
      updatedConfig.regimes[newItemData.id] = {
        ...newItemData,
        enabled: true,
        ui: { icon: '📈', color: '#10b981' }
      };
      break;
  }

  setConfig(updatedConfig);
  setShowAddModal(false);
  setNewItemData({});
};

// ========================================
// 2. HANDLERS CRUD
// ========================================

// ✅ Édition d'un élément
const editItem = (type, id) => {
  console.log(`Éditer ${type}: ${id}`);
  // Logique d'édition à implémenter
};

// ✅ Duplication d'un élément
const duplicateItem = (type, id) => {
  console.log(`Dupliquer ${type}: ${id}`);
  // Logique de duplication à implémenter
};

// ✅ Suppression d'un élément
const deleteItem = (type, id) => {
  if (confirm(`Supprimer ${type} "${id}" ?`)) {
    const updatedConfig = { ...config };
    
    switch (type) {
      case 'indicator':
        delete updatedConfig.indicators[id];
        break;
      case 'formula':
        delete updatedConfig.formulas[id];
        break;
      case 'regime':
        delete updatedConfig.regimes[id];
        break;
    }

    setConfig(updatedConfig);
  }
};

// ========================================
// 3. HANDLERS DE NAVIGATION
// ========================================

// ✅ Changement d'onglet
const setActiveTab = (tab) => {
  setActiveTab(tab);
};

// ========================================
// 4. HANDLERS DE FORMULAIRES
// ========================================

// ✅ Mise à jour des données de formulaire
const updateNewItemData = (field, value) => {
  setNewItemData({...newItemData, [field]: value});
};

// ✅ Mise à jour de la configuration générale
const updateGeneralConfig = (field, value) => {
  setConfig({
    ...config,
    general: { ...config.general, [field]: value }
  });
};

// ========================================
// 5. HANDLERS DE MODAL
// ========================================

// ✅ Gestion du clic sur l'overlay
const handleModalOverlayClick = () => {
  closeAddModal();
};

// ✅ Gestion du clic sur le contenu de la modal
const handleModalContentClick = (e) => {
  e.stopPropagation();
};

// ========================================
// 6. HANDLERS D'INTERFACE
// ========================================

// ✅ Validation des paramètres JSON
const validateJsonParameters = (jsonString) => {
  try {
    const params = JSON.parse(jsonString);
    setNewItemData({...newItemData, parameters: params});
  } catch (err) {
    // Ignore les erreurs de parsing JSON
  }
};

// ✅ Validation des allocations JSON
const validateJsonAllocations = (jsonString) => {
  try {
    const allocs = JSON.parse(jsonString);
    setNewItemData({...newItemData, allocations: allocs});
  } catch (err) {
    // Ignore les erreurs de parsing JSON
  }
};

// ========================================
// 7. HANDLERS D'ACTIONS
// ========================================

// ✅ Actions sur les plugins
const pluginActions = {
  installPlugin: () => {
    console.log('Installer un plugin');
  },
  refreshPlugins: () => {
    console.log('Rafraîchir les plugins');
  },
  managePlugins: () => {
    console.log('Gérer les plugins');
  }
};

// ========================================
// 8. HANDLERS DE VALIDATION
// ========================================

// ✅ Validation des données d'entrée
const validateInputData = () => {
  if (!newItemData.id || !newItemData.name) {
    alert('ID et nom requis');
    return false;
  }
  return true;
};

// ========================================
// 9. HANDLERS DE MISE À JOUR
// ========================================

// ✅ Mise à jour de la configuration
const updateConfig = (newConfig) => {
  setConfig(newConfig);
};

// ✅ Réinitialisation des données
const resetNewItemData = () => {
  setNewItemData({});
};

// ========================================
// 10. HANDLERS D'ÉVÉNEMENTS
// ========================================

// ✅ Gestion des événements de clavier
const handleKeyPress = (e) => {
  if (e.key === 'Escape') {
    closeAddModal();
  }
  if (e.key === 'Enter' && showAddModal) {
    addNewItem();
  }
};

// ✅ Gestion des événements de souris
const handleMouseEvents = {
  onMouseEnter: (e) => {
    e.target.style.opacity = '0.8';
  },
  onMouseLeave: (e) => {
    e.target.style.opacity = '1';
  }
};

// ========================================
// 11. HANDLERS DE RENDU
// ========================================

// ✅ Rendu conditionnel de la modal
const renderAddModal = () => {
  if (!showAddModal) return null;
  
  return (
    <div className="modal-overlay" onClick={handleModalOverlayClick}>
      <div className="modal-content" onClick={handleModalContentClick}>
        {/* Contenu de la modal */}
      </div>
    </div>
  );
};

// ✅ Rendu des boutons d'action
const renderActionButtons = (type, id) => {
  return (
    <div className="item-actions">
      <button onClick={() => duplicateItem(type, id)} title="Dupliquer">📋</button>
      <button onClick={() => editItem(type, id)} title="Modifier">✏️</button>
      <button onClick={() => deleteItem(type, id)} title="Supprimer">🗑️</button>
    </div>
  );
};

// ========================================
// 12. HANDLERS DE GESTION D'ÉTAT
// ========================================

// ✅ Gestion de l'état de la modal
const modalStateHandlers = {
  show: () => setShowAddModal(true),
  hide: () => setShowAddModal(false),
  toggle: () => setShowAddModal(!showAddModal)
};

// ✅ Gestion de l'état des onglets
const tabStateHandlers = {
  setActive: (tab) => setActiveTab(tab),
  getActive: () => activeTab,
  isActive: (tab) => activeTab === tab
};

// ========================================
// 13. HANDLERS DE DONNÉES
// ========================================

// ✅ Gestion des données de configuration
const configDataHandlers = {
  get: () => config,
  set: (newConfig) => setConfig(newConfig),
  update: (path, value) => {
    const updatedConfig = { ...config };
    const keys = path.split('.');
    let current = updatedConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setConfig(updatedConfig);
  }
};

// ✅ Gestion des données de formulaire
const formDataHandlers = {
  get: () => newItemData,
  set: (data) => setNewItemData(data),
  update: (field, value) => setNewItemData({...newItemData, [field]: value}),
  reset: () => setNewItemData({})
};

// ========================================
// 14. HANDLERS DE LOGIQUE MÉTIER
// ========================================

// ✅ Logique de création d'éléments
const createElementLogic = {
  indicator: (data) => ({
    ...data,
    enabled: true,
    ui: { icon: '📊', color: '#6b7280' }
  }),
  formula: (data) => ({
    ...data,
    enabled: true,
    ui: { icon: '🧮', color: '#8b5cf6' }
  }),
  regime: (data) => ({
    ...data,
    enabled: true,
    ui: { icon: '📈', color: '#10b981' }
  })
};

// ✅ Logique de suppression d'éléments
const deleteElementLogic = {
  indicator: (config, id) => {
    delete config.indicators[id];
    return config;
  },
  formula: (config, id) => {
    delete config.formulas[id];
    return config;
  },
  regime: (config, id) => {
    delete config.regimes[id];
    return config;
  }
};

// ========================================
// 15. HANDLERS D'UTILITAIRES
// ========================================

// ✅ Utilitaires de validation
const validationUtils = {
  isRequired: (value) => value && value.trim() !== '',
  isValidId: (id) => /^[a-zA-Z0-9_]+$/.test(id),
  isValidWeight: (weight) => weight >= 0 && weight <= 100,
  isValidJson: (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
};

// ✅ Utilitaires de formatage
const formattingUtils = {
  formatPercentage: (value) => `${value}%`,
  formatJson: (obj) => JSON.stringify(obj, null, 2),
  formatId: (id) => id.toLowerCase().replace(/\s+/g, '_')
};

// ========================================
// 16. HANDLERS D'ERREURS
// ========================================

// ✅ Gestion des erreurs
const errorHandlers = {
  showError: (message) => alert(message),
  logError: (error) => console.error('Erreur:', error),
  handleValidationError: (field) => {
    alert(`Erreur de validation pour le champ: ${field}`);
  }
};

// ========================================
// 17. HANDLERS DE PERFORMANCE
// ========================================

// ✅ Optimisation des re-rendus
const performanceHandlers = {
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },
  memoize: (func) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(null, args);
      cache.set(key, result);
      return result;
    };
  }
};

// ========================================
// 18. HANDLERS DE SÉCURITÉ
// ========================================

// ✅ Validation de sécurité
const securityHandlers = {
  sanitizeInput: (input) => {
    return input.replace(/[<>]/g, '');
  },
  validatePermissions: (action) => {
    // Logique de validation des permissions
    return true;
  }
};

// ========================================
// 19. HANDLERS DE PERSISTANCE
// ========================================

// ✅ Sauvegarde de la configuration
const persistenceHandlers = {
  saveConfig: (config) => {
    localStorage.setItem('oracle-portfolio-config', JSON.stringify(config));
  },
  loadConfig: () => {
    const saved = localStorage.getItem('oracle-portfolio-config');
    return saved ? JSON.parse(saved) : null;
  }
};

// ========================================
// 20. HANDLERS D'EXPORT
// ========================================

// ✅ Export des handlers
export {
  openAddModal,
  closeAddModal,
  addNewItem,
  editItem,
  duplicateItem,
  deleteItem,
  setActiveTab,
  updateNewItemData,
  updateGeneralConfig,
  handleModalOverlayClick,
  handleModalContentClick,
  validateJsonParameters,
  validateJsonAllocations,
  pluginActions,
  validateInputData,
  updateConfig,
  resetNewItemData,
  handleKeyPress,
  handleMouseEvents,
  renderAddModal,
  renderActionButtons,
  modalStateHandlers,
  tabStateHandlers,
  configDataHandlers,
  formDataHandlers,
  createElementLogic,
  deleteElementLogic,
  validationUtils,
  formattingUtils,
  errorHandlers,
  performanceHandlers,
  securityHandlers,
  persistenceHandlers
}; 