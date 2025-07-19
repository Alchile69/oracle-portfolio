// Configuration des environnements Oracle Portfolio
export const environments = {
  production: {
    name: 'Production',
    branch: 'restore/elegant-full-version',
    firebase: {
      projectId: 'oracle-portfolio-prod',
      hosting: 'oracle-portfolio-prod'
    },
    url: 'https://oracle-portfolio-prod.web.app',
    features: {
      analytics: true,
      debugging: false,
      testMode: false,
      monitoring: true
    },
    api: {
      baseUrl: 'https://api.oracle-portfolio-prod.web.app',
      timeout: 10000,
      retries: 3
    }
  },
  
  staging: {
    name: 'Staging',
    branch: 'environments/staging',
    firebase: {
      projectId: 'oracle-portfolio-staging',
      hosting: 'oracle-portfolio-staging'
    },
    url: 'https://oracle-portfolio-staging.web.app',
    features: {
      analytics: false,
      debugging: true,
      testMode: true,
      monitoring: true
    },
    api: {
      baseUrl: 'https://api.oracle-portfolio-staging.web.app',
      timeout: 15000,
      retries: 2
    }
  },
  
  development: {
    name: 'Development',
    branch: 'environments/development',
    firebase: {
      projectId: 'oracle-portfolio-dev',
      hosting: 'oracle-portfolio-dev'
    },
    url: 'https://oracle-portfolio-dev.web.app',
    features: {
      analytics: false,
      debugging: true,
      testMode: true,
      monitoring: false
    },
    api: {
      baseUrl: 'https://api.oracle-portfolio-dev.web.app',
      timeout: 20000,
      retries: 1
    }
  },
  
  local: {
    name: 'Local Development',
    branch: 'current',
    url: 'http://localhost:5173',
    features: {
      analytics: false,
      debugging: true,
      testMode: true,
      monitoring: false
    },
    api: {
      baseUrl: 'http://localhost:3001',
      timeout: 30000,
      retries: 0
    }
  }
}

// Fonction pour obtenir la configuration de l'environnement actuel
export const getCurrentEnvironment = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  
  if (hostname.includes('oracle-portfolio-prod')) return environments.production
  if (hostname.includes('oracle-portfolio-staging')) return environments.staging
  if (hostname.includes('oracle-portfolio-dev')) return environments.development
  return environments.local
}

// Configuration par défaut
export const defaultConfig = {
  version: '2.5.0',
  buildDate: new Date().toISOString(),
  features: {
    multiCountryComparison: true,
    backtesting: true,
    extensibleConfiguration: true,
    realTimeData: true,
    authentication: true
  }
}

export default environments

