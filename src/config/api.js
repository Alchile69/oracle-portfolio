// Configuration des APIs hybrides Oracle Portfolio
// Architecture: Firebase Functions (Node.js) + Google Cloud Run (Python)

export const API_CONFIG = {
  // Backend Node.js - Firebase Functions (APIs historiques)
  FIREBASE_FUNCTIONS: {
    baseUrl: 'https://us-central1-oracle-portfolio-prod.cloudfunctions.net',
    endpoints: {
      getCountries: '/getCountries',
      getBacktesting: '/getBacktesting', 
      getMarketStress: '/getMarketStress',
      getMarketData: '/getMarketData',
      getAllocations: '/getAllocations',
      getHealth: '/getHealth',
      getRegime: '/getRegime'
    }
  },

  // Backend Python - Google Cloud Run (APIs IA et avancées)
  CLOUD_RUN_PYTHON: {
    baseUrl: 'https://vgh0i1cowmwm.manus.space',
    endpoints: {
      getSystemHealth: '/getSystemHealth',
      getRegimePython: '/getRegimePython', 
      getIndicatorsBreakdown: '/getIndicatorsBreakdown',
      getMultiRegime: '/getMultiRegime',
      getAllocationsPython: '/getAllocationsPython'
    }
  },

  // Configuration de fallback et retry
  FALLBACK_CONFIG: {
    retryAttempts: 3,
    retryDelay: 1000, // ms
    timeout: 10000, // ms
    enableFallback: true
  }
};

// Classe pour gérer les appels API hybrides avec fallback automatique
export class HybridAPIClient {
  constructor() {
    this.nodeJsBase = API_CONFIG.FIREBASE_FUNCTIONS.baseUrl;
    this.pythonBase = API_CONFIG.CLOUD_RUN_PYTHON.baseUrl;
    this.config = API_CONFIG.FALLBACK_CONFIG;
  }

  // Méthode générique pour appels API avec retry et fallback
  async apiCall(endpoint, options = {}) {
    const { method = 'GET', data = null, preferPython = false } = options;
    
    // Déterminer l'ordre de priorité des backends
    const backends = preferPython 
      ? [this.pythonBase, this.nodeJsBase]
      : [this.nodeJsBase, this.pythonBase];

    for (const baseUrl of backends) {
      try {
        const response = await this.makeRequest(baseUrl + endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: data ? JSON.stringify(data) : null,
          signal: AbortSignal.timeout(this.config.timeout)
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn(`API call failed for ${baseUrl}${endpoint}:`, error.message);
        
        // Si c'est le dernier backend, on lance l'erreur
        if (baseUrl === backends[backends.length - 1]) {
          throw new Error(`All API backends failed for ${endpoint}`);
        }
      }
    }
  }

  // Wrapper pour fetch avec retry
  async makeRequest(url, options, attempt = 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.makeRequest(url, options, attempt + 1);
      }
      throw error;
    }
  }

  // APIs spécifiques avec routage intelligent
  
  // Données de pays (Node.js prioritaire)
  async getCountries() {
    return this.apiCall('/getCountries');
  }

  // Données de marché (Node.js prioritaire) 
  async getMarketData(params) {
    return this.apiCall('/getMarketData', { data: params });
  }

  // Backtesting (Node.js prioritaire)
  async getBacktesting(params) {
    return this.apiCall('/getBacktesting', { data: params });
  }

  // Allocations (Python prioritaire pour IA)
  async getAllocations(params) {
    return this.apiCall('/getAllocationsPython', { 
      data: params, 
      preferPython: true 
    });
  }

  // Indicateurs avancés (Python prioritaire)
  async getIndicatorsBreakdown(params) {
    return this.apiCall('/getIndicatorsBreakdown', { 
      data: params, 
      preferPython: true 
    });
  }

  // Régimes de marché (Python prioritaire pour IA)
  async getRegime(params) {
    return this.apiCall('/getRegimePython', { 
      data: params, 
      preferPython: true 
    });
  }

  // Santé système (Python prioritaire)
  async getSystemHealth() {
    return this.apiCall('/getSystemHealth', { preferPython: true });
  }

  // Multi-régimes (Python exclusif)
  async getMultiRegime(params) {
    return this.apiCall('/getMultiRegime', { 
      data: params, 
      preferPython: true 
    });
  }

  // Test de connectivité
  async healthCheck() {
    const results = {
      nodejs: false,
      python: false,
      timestamp: new Date().toISOString()
    };

    try {
      await this.makeRequest(this.nodeJsBase + '/getHealth');
      results.nodejs = true;
    } catch (error) {
      console.warn('Node.js backend health check failed:', error.message);
    }

    try {
      await this.makeRequest(this.pythonBase + '/getSystemHealth');
      results.python = true;
    } catch (error) {
      console.warn('Python backend health check failed:', error.message);
    }

    return results;
  }
}

// Instance globale du client API
export const apiClient = new HybridAPIClient();

// Fonctions utilitaires pour compatibilité avec le code existant
export const getComparisonData = async (countries) => {
  try {
    return await apiClient.getMarketData({ countries });
  } catch (error) {
    console.error('Failed to fetch comparison data:', error);
    // Fallback vers données mockées en cas d'échec total
    return getMockComparisonData(countries);
  }
};

// Import des données mockées comme fallback ultime
import { getMockComparisonData } from '../data/mockData.js';

export default apiClient;

