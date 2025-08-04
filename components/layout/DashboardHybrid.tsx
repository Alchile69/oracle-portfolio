import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Globe, 
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface CountryData {
  code: string;
  name: string;
  regime: string;
  confidence: number;
  allocations: {
    stocks: number;
    bonds: number;
    commodities: number;
    cash: number;
  };
  indicators: {
    growth: number;
    inflation: number;
    unemployment: number;
  };
  last_update: string;
}

interface ETFData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface BacktestingData {
  period: {
    start_date: string;
    end_date: string;
    total_months: number;
  };
  strategy: string;
  benchmark: string;
  metrics: {
    total_return: number;
    annualized_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
  };
  benchmark_metrics: {
    total_return: number;
    annualized_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
  };
  outperformance: {
    total_return: number;
    annualized_return: number;
  };
  performance_data: {
    monthly_returns: Array<{
      date: string;
      oracle_return: number;
      benchmark_return: number;
    }>;
    cumulative_performance: Array<{
      date: string;
      oracle_cumulative: number;
      benchmark_cumulative: number;
    }>;
  };
  data_quality: {
    source: string;
    total_months: number;
    missing_data: number;
    last_update: string;
    calculation_time: string;
  };
}

interface DashboardHybridProps {
  onNavigateToComparison?: () => void;
}

const DashboardHybrid: React.FC<DashboardHybridProps> = ({ onNavigateToComparison }) => {
  const [selectedCountry, setSelectedCountry] = useState('FRA');
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [currentCountryData, setCurrentCountryData] = useState<CountryData | null>(null);
  const [marketStressData, setMarketStressData] = useState<any>(null);
  const [etfData, setEtfData] = useState<ETFData[]>([]);
  const [backtestingData, setBacktestingData] = useState<BacktestingData | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingMarketStress, setIsLoadingMarketStress] = useState(true);
  const [isLoadingETF, setIsLoadingETF] = useState(true);
  const [isLoadingBacktesting, setIsLoadingBacktesting] = useState(false);
  const [backtestingError, setBacktestingError] = useState<string | null>(null);
  const [startDate, setStartDate] = React.useState('2023-01-01');
  const [endDate, setEndDate] = React.useState('2024-12-31');
  
  // États pour l'architecture hybride
  const [backendHealth, setBackendHealth] = useState<{
    nodejs: boolean;
    python: boolean;
    timestamp: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fonction pour obtenir la couleur du régime
  const getRegimeColor = (regime: string) => {
    switch (regime.toLowerCase()) {
      case 'expansion':
        return 'text-oracle-success';
      case 'recession':
        return 'text-oracle-error';
      case 'recovery':
        return 'text-oracle-warning';
      default:
        return 'text-oracle-text-secondary';
    }
  };

  // Fonction pour obtenir l'icône du régime
  const getRegimeIcon = (regime: string) => {
    switch (regime.toLowerCase()) {
      case 'expansion':
        return <TrendingUp className="w-5 h-5 text-oracle-success" />;
      case 'recession':
        return <TrendingDown className="w-5 h-5 text-oracle-error" />;
      case 'recovery':
        return <Activity className="w-5 h-5 text-oracle-warning" />;
      default:
        return <BarChart3 className="w-5 h-5 text-oracle-text-secondary" />;
    }
  };

  // Vérifier la santé du backend
  const checkBackendHealth = async () => {
    try {
      // Test Node.js backend
      const nodejsHealth = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getHealth')
        .then(() => true)
        .catch(() => false);
      
      // Test Python backend
      const pythonHealth = await fetch('https://vgh0i1cowmwm.manus.space/getSystemHealth')
        .then(() => true)
        .catch(() => false);

      setBackendHealth({
        nodejs: nodejsHealth,
        python: pythonHealth,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de la santé du backend:', error);
    }
  };

  // Charger les données des pays
  const fetchCountriesData = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getCountries');
      if (response.ok) {
        const data = await response.json();
        // Vérifier que data est un tableau
        if (Array.isArray(data)) {
          setCountriesData(data);
          if (data.length > 0) {
            setCurrentCountryData(data[0]);
          }
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setCountriesData([]);
        }
      } else {
        console.error('Erreur HTTP:', response.status);
        setCountriesData([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
      setCountriesData([]);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  // Charger les données de stress de marché
  const fetchMarketStress = async () => {
    setIsLoadingMarketStress(true);
    try {
      const response = await fetch(`https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketStress?country=${selectedCountry}`);
      if (response.ok) {
        const data = await response.json();
        // Vérifier que data est un objet valide
        if (data && typeof data === 'object') {
          setMarketStressData(data);
        } else {
          console.error('Les données de stress de marché ne sont pas un objet valide:', data);
          setMarketStressData(null);
        }
      } else {
        console.error('Erreur HTTP stress de marché:', response.status);
        setMarketStressData(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du stress de marché:', error);
      setMarketStressData(null);
    } finally {
      setIsLoadingMarketStress(false);
    }
  };

  // Charger les données ETF
  const fetchETFData = async () => {
    setIsLoadingETF(true);
    try {
      const response = await fetch(`https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getMarketData?country=${selectedCountry}`);
      if (response.ok) {
        const data = await response.json();
        // Vérifier que data.etfs est un tableau
        if (data && Array.isArray(data.etfs)) {
          setEtfData(data.etfs);
        } else {
          console.error('Les données ETF reçues ne sont pas un tableau:', data);
          setEtfData([]);
        }
      } else {
        console.error('Erreur HTTP ETF:', response.status);
        setEtfData([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données ETF:', error);
      setEtfData([]);
    } finally {
      setIsLoadingETF(false);
    }
  };

  // Charger les données de backtesting
  const fetchBacktestingData = async () => {
    setIsLoadingBacktesting(true);
    setBacktestingError(null);
    try {
      const response = await fetch(`https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getBacktesting?country=${selectedCountry}&startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setBacktestingData(data);
      } else {
        setBacktestingError('Erreur lors du chargement des données de backtesting');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du backtesting:', error);
      setBacktestingError('Erreur de connexion au serveur');
    } finally {
      setIsLoadingBacktesting(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchCountriesData();
    fetchMarketStress();
    fetchETFData();
    checkBackendHealth();
  }, [selectedCountry]);

  // Vérifier la santé du backend périodiquement
  useEffect(() => {
    const interval = setInterval(checkBackendHealth, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  // Rafraîchir toutes les données
  const refreshAllData = async () => {
    await Promise.all([
      fetchCountriesData(),
      fetchMarketStress(),
      fetchETFData(),
      fetchBacktestingData()
    ]);
  };

  return (
    <div className="min-h-screen bg-background-dark text-white p-4 md:p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-oracle-primary mb-2">
              Oracle Portfolio v4.3
            </h1>
            <p className="text-oracle-text-secondary">
              Architecture Hybride - Allocation sectorielle intelligente
            </p>
          </div>
          
          {/* Status des backends */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-oracle-text-secondary">Backends:</span>
              {backendHealth ? (
                <>
                  <div className="flex items-center gap-1">
                    {backendHealth.nodejs ? (
                      <CheckCircle className="w-4 h-4 text-oracle-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-oracle-error" />
                    )}
                    <span className="text-xs">Node.js</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {backendHealth.python ? (
                      <CheckCircle className="w-4 h-4 text-oracle-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-oracle-error" />
                    )}
                    <span className="text-xs">Python</span>
                  </div>
                </>
              ) : (
                <AlertTriangle className="w-4 h-4 text-oracle-warning" />
              )}
            </div>
            
            <button
              onClick={refreshAllData}
              className="btn-primary flex items-center gap-2"
              disabled={isLoadingCountries || isLoadingMarketStress || isLoadingETF || isLoadingBacktesting}
            >
              <RefreshCw className={`w-4 h-4 ${(isLoadingCountries || isLoadingMarketStress || isLoadingETF || isLoadingBacktesting) ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* Sélection de pays */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Sélection du pays
          </h3>
        </div>
        
        {isLoadingCountries ? (
          <div className="text-center py-8">
            <div className="loading w-8 h-8 mx-auto mb-4"></div>
            <p className="text-oracle-text-secondary">Chargement des pays...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {countriesData && countriesData.length > 0 ? countriesData.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country.code)}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  selectedCountry === country.code
                    ? 'border-oracle-primary bg-oracle-primary bg-opacity-10 text-oracle-primary'
                    : 'border-oracle-border bg-oracle-border hover:border-oracle-primary hover:text-oracle-primary'
                }`}
              >
                <div className="text-sm font-medium">{country.code}</div>
                <div className="text-xs text-oracle-text-secondary">{country.name}</div>
              </button>
            )) : (
              <div className="col-span-full text-center py-8">
                <AlertTriangle className="w-8 h-8 text-oracle-warning mx-auto mb-2" />
                <p className="text-oracle-text-secondary">Aucun pays disponible</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation par onglets */}
      <div className="nav-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('backtesting')}
          className={`nav-tab ${activeTab === 'backtesting' ? 'active' : ''}`}
        >
          Backtesting Engine
        </button>
        <button
          onClick={() => setActiveTab('stress')}
          className={`nav-tab ${activeTab === 'stress' ? 'active' : ''}`}
        >
          Stress de marché
        </button>
        <button
          onClick={() => setActiveTab('configuration')}
          className={`nav-tab ${activeTab === 'configuration' ? 'active' : ''}`}
        >
          Configuration
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="grid-dashboard grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Régime économique */}
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Régime économique</h4>
              </div>
              
              {currentCountryData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-oracle-text-secondary">Régime:</span>
                    <div className="flex items-center gap-2">
                      {getRegimeIcon(currentCountryData.regime)}
                      <span className={`font-semibold ${getRegimeColor(currentCountryData.regime)}`}>
                        {currentCountryData.regime.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-oracle-text-secondary">Confiance:</span>
                    <span className="font-semibold text-white">{currentCountryData.confidence}%</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-oracle-border">
                    <div className="text-center">
                      <div className="stat-value">{currentCountryData.indicators.growth}%</div>
                      <div className="stat-label">Croissance</div>
                    </div>
                    <div className="text-center">
                      <div className="stat-value">{currentCountryData.indicators.inflation}%</div>
                      <div className="stat-label">Inflation</div>
                    </div>
                    <div className="text-center">
                      <div className="stat-value">{currentCountryData.indicators.unemployment}%</div>
                      <div className="stat-label">Chômage</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-8 h-8 text-oracle-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-oracle-text-secondary">Aucune donnée</p>
                </div>
              )}
            </div>

            {/* Stress de marché */}
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Stress de marché</h4>
              </div>
              
              {isLoadingMarketStress ? (
                <div className="text-center py-8">
                  <div className="loading w-6 h-6 mx-auto mb-2"></div>
                  <p className="text-sm text-oracle-text-secondary">Chargement...</p>
                </div>
              ) : marketStressData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-oracle-text-secondary">Niveau de stress:</span>
                    <span className="font-semibold text-oracle-warning">
                      {marketStressData.stressLevel || 'N/A'}/100
                    </span>
                  </div>
                  
                  <div className="w-full bg-oracle-border rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300 bg-oracle-warning"
                      style={{ width: `${marketStressData.stressLevel || 0}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-oracle-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-oracle-text-secondary">Aucune donnée</p>
                </div>
              )}
            </div>

            {/* Allocations */}
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Allocations sectorielles</h4>
              </div>
              
              {currentCountryData ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-oracle-text-secondary">Actions:</span>
                      <span className="font-medium text-white">{currentCountryData.allocations.stocks}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-oracle-text-secondary">Obligations:</span>
                      <span className="font-medium text-white">{currentCountryData.allocations.bonds}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-oracle-text-secondary">Matières premières:</span>
                      <span className="font-medium text-white">{currentCountryData.allocations.commodities}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-oracle-text-secondary">Liquidités:</span>
                      <span className="font-medium text-white">{currentCountryData.allocations.cash}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-8 h-8 text-oracle-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-oracle-text-secondary">Aucune donnée</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configuration */}
        {activeTab === 'configuration' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration du système
              </h3>
            </div>
            
            <div className="space-y-6">
              {/* Configuration des backends */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Configuration des backends</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-oracle-border rounded-lg">
                    <h5 className="font-medium text-white mb-2">Backend Node.js</h5>
                    <p className="text-sm text-oracle-text-secondary mb-2">
                      Firebase Functions
                    </p>
                    <div className="flex items-center gap-2">
                      {backendHealth?.nodejs ? (
                        <CheckCircle className="w-4 h-4 text-oracle-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-oracle-error" />
                      )}
                      <span className="text-sm">
                        {backendHealth?.nodejs ? 'Connecté' : 'Déconnecté'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-oracle-border rounded-lg">
                    <h5 className="font-medium text-white mb-2">Backend Python</h5>
                    <p className="text-sm text-oracle-text-secondary mb-2">
                      Google Cloud Run
                    </p>
                    <div className="flex items-center gap-2">
                      {backendHealth?.python ? (
                        <CheckCircle className="w-4 h-4 text-oracle-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-oracle-error" />
                      )}
                      <span className="text-sm">
                        {backendHealth?.python ? 'Connecté' : 'Déconnecté'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Paramètres de l'application */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Paramètres de l'application</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Stratégie de fallback</label>
                    <select className="form-input">
                      <option value="nodejs-first">Node.js en premier</option>
                      <option value="python-first">Python en premier</option>
                      <option value="round-robin">Round-robin</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Timeout des requêtes (ms)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      defaultValue="10000"
                      min="1000"
                      max="30000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nombre de tentatives</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      defaultValue="3"
                      min="1"
                      max="5"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Intervalle de vérification (s)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      defaultValue="30"
                      min="10"
                      max="60"
                    />
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-oracle-border">
                <button className="btn-primary">
                  Sauvegarder la configuration
                </button>
                <button className="btn-secondary">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHybrid; 