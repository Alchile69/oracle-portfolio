import React, { useState, useEffect } from 'react';

const ExtensibleConfigurationPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState('');
  const [newItemData, setNewItemData] = useState({});
  
  const [config, setConfig] = useState({
    general: {
      projectName: 'Oracle Portfolio',
      environment: 'production',
      region: 'europe-west1',
      logLevel: 'info'
    },
    // Configuration extensible avec plugins
    plugins: {
      indicators: new Map(),
      formulas: new Map(),
      regimes: new Map()
    },
    // Indicateurs existants + nouveaux
    indicators: {
      // Indicateurs physiques
      electricity: {
        id: 'electricity',
        name: 'Électricité',
        category: 'physical',
        weight: 25,
        enabled: true,
        sources: ['EIA', 'Eurostat'],
        ui: { icon: '⚡', color: '#fbbf24' }
      },
      pmi: {
        id: 'pmi',
        name: 'PMI',
        category: 'physical',
        weight: 30,
        enabled: true,
        sources: ['Markit', 'ISM'],
        ui: { icon: '🏭', color: '#3b82f6' }
      },
      maritime: {
        id: 'maritime',
        name: 'Maritime',
        category: 'physical',
        weight: 20,
        enabled: true,
        sources: ['Baltic Exchange'],
        ui: { icon: '🚢', color: '#06b6d4' }
      },
      energy: {
        id: 'energy',
        name: 'Énergie',
        category: 'physical',
        weight: 25,
        enabled: true,
        sources: ['IEA', 'OPEC'],
        ui: { icon: '⛽', color: '#dc2626' }
      },
      // Indicateurs financiers
      yields: {
        id: 'yields',
        name: 'Yields',
        category: 'financial',
        weight: 40,
        enabled: true,
        sources: ['Bloomberg', 'Reuters'],
        ui: { icon: '📈', color: '#10b981' }
      },
      spreads: {
        id: 'spreads',
        name: 'Spreads',
        category: 'financial',
        weight: 30,
        enabled: true,
        sources: ['Bloomberg'],
        ui: { icon: '📊', color: '#8b5cf6' }
      },
      volatility: {
        id: 'volatility',
        name: 'Volatility',
        category: 'financial',
        weight: 30,
        enabled: true,
        sources: ['CBOE', 'Bloomberg'],
        ui: { icon: '📉', color: '#ef4444' }
      }
    },
    // Formules extensibles
    formulas: {
      confidence: {
        id: 'confidence',
        name: 'Formule de Confiance',
        category: 'scoring',
        expression: '(indicator_score * 0.6) + (historical_accuracy * 0.4)',
        parameters: {
          indicator_weight: 0.6,
          accuracy_weight: 0.4,
          min_confidence: 0.5,
          max_confidence: 1.0
        },
        enabled: true,
        ui: { icon: '🎯', color: '#059669' }
      },
      regime_score: {
        id: 'regime_score',
        name: 'Score de Régime',
        category: 'scoring',
        expression: 'sigmoid((weighted_indicators - threshold) / volatility)',
        parameters: {
          threshold: 0.5,
          volatility_factor: 0.1,
          sigmoid_steepness: 5.0
        },
        enabled: true,
        ui: { icon: '📐', color: '#7c3aed' }
      }
    },
    // Régimes économiques
    regimes: {
      expansion: {
        id: 'expansion',
        name: 'Expansion',
        description: 'Croissance économique forte',
        conditions: {
          pmi: { min: 50, weight: 0.3 },
          yields: { min: 2.5, weight: 0.2 },
          volatility: { max: 20, weight: 0.1 }
        },
        allocations: {
          stocks: 70,
          bonds: 20,
          commodities: 10
        },
        enabled: true,
        ui: { icon: '🚀', color: '#10b981' }
      },
      stagflation: {
        id: 'stagflation',
        name: 'Stagflation',
        description: 'Inflation élevée, croissance faible',
        conditions: {
          pmi: { max: 50, weight: 0.3 },
          yields: { min: 3.0, weight: 0.3 },
          volatility: { min: 25, weight: 0.2 }
        },
        allocations: {
          stocks: 40,
          bonds: 30,
          commodities: 30
        },
        enabled: true,
        ui: { icon: '🔥', color: '#f59e0b' }
      },
      recession: {
        id: 'recession',
        name: 'Récession',
        description: 'Contraction économique',
        conditions: {
          pmi: { max: 45, weight: 0.4 },
          yields: { max: 2.0, weight: 0.3 },
          volatility: { min: 30, weight: 0.2 }
        },
        allocations: {
          stocks: 30,
          bonds: 60,
          commodities: 10
        },
        enabled: true,
        ui: { icon: '📉', color: '#ef4444' }
      },
      deflation: {
        id: 'deflation',
        name: 'Déflation',
        description: 'Baisse des prix généralisée',
        conditions: {
          pmi: { max: 40, weight: 0.3 },
          yields: { max: 1.0, weight: 0.4 },
          volatility: { max: 15, weight: 0.1 }
        },
        allocations: {
          stocks: 20,
          bonds: 70,
          commodities: 10
        },
        enabled: true,
        ui: { icon: '❄️', color: '#3b82f6' }
      }
    }
  });

  // Fonctions CRUD pour les éléments
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

  const editItem = (type, id) => {
    console.log(`Éditer ${type}: ${id}`);
    // Logique d'édition à implémenter
  };

  const duplicateItem = (type, id) => {
    console.log(`Dupliquer ${type}: ${id}`);
    // Logique de duplication à implémenter
  };

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

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItemData({});
  };

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="modal-overlay" onClick={closeAddModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h3>Ajouter un {addModalType === 'indicator' ? 'indicateur' : addModalType === 'formula' ? 'formule' : 'régime'}</h3>
          
          <div className="form-group">
            <label>ID unique:</label>
            <input
              type="text"
              value={newItemData.id || ''}
              onChange={e => setNewItemData({...newItemData, id: e.target.value})}
              placeholder="ex: custom_indicator"
            />
          </div>

          <div className="form-group">
            <label>Nom:</label>
            <input
              type="text"
              value={newItemData.name || ''}
              onChange={e => setNewItemData({...newItemData, name: e.target.value})}
              placeholder="Nom affiché"
            />
          </div>

          <div className="form-group">
            <label>Catégorie:</label>
            <select
              value={newItemData.category || ''}
              onChange={e => setNewItemData({...newItemData, category: e.target.value})}
            >
              {addModalType === 'indicator' ? (
                <>
                  <option value="physical">Physique</option>
                  <option value="financial">Financier</option>
                </>
              ) : (
                <>
                  <option value="scoring">Scoring</option>
                  <option value="allocation">Allocation</option>
                </>
              )}
            </select>
          </div>

          {addModalType === 'indicator' && (
            <div className="form-group">
              <label>Pondération (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newItemData.weight || 25}
                onChange={e => setNewItemData({...newItemData, weight: parseInt(e.target.value)})}
              />
            </div>
          )}

          {addModalType === 'formula' && (
            <>
              <div className="form-group">
                <label>Expression mathématique:</label>
                <textarea
                  value={newItemData.expression || ''}
                  onChange={e => setNewItemData({...newItemData, expression: e.target.value})}
                  placeholder="ex: (indicator_score * 0.6) + (historical_accuracy * 0.4)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Paramètres (JSON):</label>
                <textarea
                  value={newItemData.parameters ? JSON.stringify(newItemData.parameters, null, 2) : ''}
                  onChange={e => {
                    try {
                      const params = JSON.parse(e.target.value);
                      setNewItemData({...newItemData, parameters: params});
                    } catch (err) {
                      // Ignore les erreurs de parsing JSON
                    }
                  }}
                  placeholder='{"param1": 0.5, "param2": 1.0}'
                  rows="4"
                />
              </div>
            </>
          )}

          {addModalType === 'regime' && (
            <>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newItemData.description || ''}
                  onChange={e => setNewItemData({...newItemData, description: e.target.value})}
                  placeholder="Description du régime économique"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Allocations (JSON):</label>
                <textarea
                  value={newItemData.allocations ? JSON.stringify(newItemData.allocations, null, 2) : ''}
                  onChange={e => {
                    try {
                      const allocs = JSON.parse(e.target.value);
                      setNewItemData({...newItemData, allocations: allocs});
                    } catch (err) {
                      // Ignore les erreurs de parsing JSON
                    }
                  }}
                  placeholder='{"stocks": 70, "bonds": 20, "commodities": 10}'
                  rows="3"
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button onClick={closeAddModal}>Annuler</button>
            <button onClick={addNewItem}>Ajouter</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content">
            <h3>Configuration Générale</h3>
            <div className="config-grid">
              <div className="config-item">
                <label>Nom du projet:</label>
                <input
                  type="text"
                  value={config.general.projectName}
                  onChange={e => setConfig({
                    ...config,
                    general: { ...config.general, projectName: e.target.value }
                  })}
                />
              </div>
              <div className="config-item">
                <label>Environnement:</label>
                <select
                  value={config.general.environment}
                  onChange={e => setConfig({
                    ...config,
                    general: { ...config.general, environment: e.target.value }
                  })}
                >
                  <option value="development">Développement</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
              <div className="config-item">
                <label>Région:</label>
                <input
                  type="text"
                  value={config.general.region}
                  onChange={e => setConfig({
                    ...config,
                    general: { ...config.general, region: e.target.value }
                  })}
                />
              </div>
              <div className="config-item">
                <label>Niveau de log:</label>
                <select
                  value={config.general.logLevel}
                  onChange={e => setConfig({
                    ...config,
                    general: { ...config.general, logLevel: e.target.value }
                  })}
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'indicators':
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Indicateurs ({Object.keys(config.indicators).length})</h3>
              <button onClick={() => openAddModal('indicator')} className="add-button">
                ➕ Ajouter un indicateur
              </button>
            </div>
            <div className="items-grid">
              {Object.entries(config.indicators).map(([id, indicator]) => (
                <div key={id} className="item-card">
                  <div className="item-header">
                    <span className="item-icon">{indicator.ui.icon}</span>
                    <h4>{indicator.name}</h4>
                    <div className="item-actions">
                      <button onClick={() => duplicateItem('indicator', id)} title="Dupliquer">📋</button>
                      <button onClick={() => editItem('indicator', id)} title="Modifier">✏️</button>
                      <button onClick={() => deleteItem('indicator', id)} title="Supprimer">🗑️</button>
                    </div>
                  </div>
                  <div className="item-details">
                    <p><strong>ID:</strong> {indicator.id}</p>
                    <p><strong>Catégorie:</strong> {indicator.category}</p>
                    <p><strong>Pondération:</strong> {indicator.weight}%</p>
                    <p><strong>Sources:</strong> {indicator.sources.join(', ')}</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${indicator.weight}%`, backgroundColor: indicator.ui.color}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'formulas':
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Formules ({Object.keys(config.formulas).length})</h3>
              <button onClick={() => openAddModal('formula')} className="add-button">
                ➕ Ajouter une formule
              </button>
            </div>
            <div className="items-grid">
              {Object.entries(config.formulas).map(([id, formula]) => (
                <div key={id} className="item-card">
                  <div className="item-header">
                    <span className="item-icon">{formula.ui.icon}</span>
                    <h4>{formula.name}</h4>
                    <div className="item-actions">
                      <button onClick={() => duplicateItem('formula', id)} title="Dupliquer">📋</button>
                      <button onClick={() => editItem('formula', id)} title="Modifier">✏️</button>
                      <button onClick={() => deleteItem('formula', id)} title="Supprimer">🗑️</button>
                    </div>
                  </div>
                  <div className="item-details">
                    <p><strong>ID:</strong> {formula.id}</p>
                    <p><strong>Catégorie:</strong> {formula.category}</p>
                    <p><strong>Expression:</strong></p>
                    <code className="formula-expression">{formula.expression}</code>
                    <p><strong>Paramètres:</strong></p>
                    <pre className="formula-params">{JSON.stringify(formula.parameters, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'regimes':
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Régimes ({Object.keys(config.regimes).length})</h3>
              <button onClick={() => openAddModal('regime')} className="add-button">
                ➕ Ajouter un régime
              </button>
            </div>
            <div className="items-grid">
              {Object.entries(config.regimes).map(([id, regime]) => (
                <div key={id} className="item-card">
                  <div className="item-header">
                    <span className="item-icon">{regime.ui.icon}</span>
                    <h4>{regime.name}</h4>
                    <div className="item-actions">
                      <button onClick={() => duplicateItem('regime', id)} title="Dupliquer">📋</button>
                      <button onClick={() => editItem('regime', id)} title="Modifier">✏️</button>
                      <button onClick={() => deleteItem('regime', id)} title="Supprimer">🗑️</button>
                    </div>
                  </div>
                  <div className="item-details">
                    <p><strong>ID:</strong> {regime.id}</p>
                    <p><strong>Description:</strong> {regime.description}</p>
                    <p><strong>Allocations:</strong></p>
                    <div className="allocations-display">
                      <div className="allocation-item">
                        <span>Stocks: {regime.allocations.stocks}%</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${regime.allocations.stocks}%`, backgroundColor: '#10b981'}}
                          ></div>
                        </div>
                      </div>
                      <div className="allocation-item">
                        <span>Bonds: {regime.allocations.bonds}%</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${regime.allocations.bonds}%`, backgroundColor: '#3b82f6'}}
                          ></div>
                        </div>
                      </div>
                      <div className="allocation-item">
                        <span>Commodities: {regime.allocations.commodities}%</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${regime.allocations.commodities}%`, backgroundColor: '#f59e0b'}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'plugins':
        return (
          <div className="tab-content">
            <h3>Système de Plugins</h3>
            <div className="plugins-info">
              <p>Le système de plugins permet d'étendre dynamiquement les fonctionnalités :</p>
              <ul>
                <li><strong>Indicateurs:</strong> {config.plugins.indicators.size} plugins chargés</li>
                <li><strong>Formules:</strong> {config.plugins.formulas.size} plugins chargés</li>
                <li><strong>Régimes:</strong> {config.plugins.regimes.size} plugins chargés</li>
              </ul>
              <div className="plugin-actions">
                <button className="plugin-button">📦 Installer un plugin</button>
                <button className="plugin-button">🔄 Rafraîchir les plugins</button>
                <button className="plugin-button">⚙️ Gérer les plugins</button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Onglet non trouvé</div>;
    }
  };

  return (
    <div className="extensible-config-panel">
      <div className="config-header">
        <h2>⚙️ Configuration Oracle Portfolio</h2>
        <p>Gestion complète des paramètres et extensions</p>
      </div>

      <div className="config-tabs">
        <button 
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          ⚙️ Général
        </button>
        <button 
          className={`tab-button ${activeTab === 'indicators' ? 'active' : ''}`}
          onClick={() => setActiveTab('indicators')}
        >
          🔬 Indicateurs
        </button>
        <button 
          className={`tab-button ${activeTab === 'formulas' ? 'active' : ''}`}
          onClick={() => setActiveTab('formulas')}
        >
          🧮 Formules
        </button>
        <button 
          className={`tab-button ${activeTab === 'regimes' ? 'active' : ''}`}
          onClick={() => setActiveTab('regimes')}
        >
          📊 Régimes
        </button>
        <button 
          className={`tab-button ${activeTab === 'plugins' ? 'active' : ''}`}
          onClick={() => setActiveTab('plugins')}
        >
          🔌 Plugins
        </button>
      </div>

      <div className="config-content">
        {renderTabContent()}
      </div>

      {renderAddModal()}
    </div>
  );
};

export default ExtensibleConfigurationPanel; 