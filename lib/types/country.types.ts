// Types pour la gestion multi-pays Oracle Portfolio v4.1

export type CountryCode = 'FRA' | 'DEU' | 'USA' | 'GBR';

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  timezone: string;
  market: string;
  language: string;
}

export interface CountryRegimeData {
  country: CountryCode;
  regime: 'EXPANSION' | 'RECOVERY' | 'STAGFLATION' | 'RECESSION';
  growthScore: number;
  inflationScore: number;
  confidence: number;
  lastUpdated: Date;
}

export interface CountrySectorAllocations {
  country: CountryCode;
  allocations: {
    TECHNOLOGY: number;
    HEALTHCARE: number;
    FINANCIALS: number;
    ENERGY: number;
    CONSUMER_DISCRETIONARY: number;
    CONSUMER_STAPLES: number;
    INDUSTRIALS: number;
    MATERIALS: number;
    UTILITIES: number;
    REAL_ESTATE: number;
    COMMUNICATION_SERVICES: number;
  };
}

export interface CountryIndicators {
  country: CountryCode;
  electricity: {
    value: number;
    source: string;
    unit: string;
  };
  pmi: {
    value: number;
    source: string;
    unit: string;
  };
  maritime: {
    value: number;
    source: string;
    unit: string;
  };
  energy: {
    value: number;
    source: string;
    unit: string;
  };
  yields: {
    value: number;
    source: string;
    unit: string;
  };
  spreads: {
    value: number;
    source: string;
    unit: string;
  };
  vix: {
    value: number;
    source: string;
    unit: string;
  };
}

// Configuration des 4 pays
export const COUNTRIES: Record<CountryCode, Country> = {
  FRA: {
    code: 'FRA',
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    market: 'CAC 40',
    language: 'fr'
  },
  DEU: {
    code: 'DEU',
    name: 'Allemagne',
    flag: '🇩🇪',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    market: 'DAX',
    language: 'de'
  },
  USA: {
    code: 'USA',
    name: 'États-Unis',
    flag: '🇺🇸',
    currency: 'USD',
    timezone: 'America/New_York',
    market: 'S&P 500',
    language: 'en'
  },
  GBR: {
    code: 'GBR',
    name: 'Royaume-Uni',
    flag: '🇬🇧',
    currency: 'GBP',
    timezone: 'Europe/London',
    market: 'FTSE 100',
    language: 'en'
  }
};

// Données de régimes par pays (basées sur init-db.sql)
export const COUNTRY_REGIME_DATA: Record<CountryCode, CountryRegimeData> = {
  FRA: {
    country: 'FRA',
    regime: 'EXPANSION',
    growthScore: 2.5,
    inflationScore: 1.8,
    confidence: 0.85,
    lastUpdated: new Date()
  },
  DEU: {
    country: 'DEU',
    regime: 'RECOVERY',
    growthScore: 1.2,
    inflationScore: 1.5,
    confidence: 0.78,
    lastUpdated: new Date()
  },
  USA: {
    country: 'USA',
    regime: 'STAGFLATION',
    growthScore: 0.8,
    inflationScore: 4.2,
    confidence: 0.92,
    lastUpdated: new Date()
  },
  GBR: {
    country: 'GBR',
    regime: 'RECESSION',
    growthScore: -0.5,
    inflationScore: 1.2,
    confidence: 0.88,
    lastUpdated: new Date()
  }
};

// Allocations sectorielles par pays
export const COUNTRY_SECTOR_ALLOCATIONS: Record<CountryCode, CountrySectorAllocations> = {
  FRA: {
    country: 'FRA',
    allocations: {
      TECHNOLOGY: 18,
      HEALTHCARE: 15,
      FINANCIALS: 20,
      ENERGY: 12,
      CONSUMER_DISCRETIONARY: 10,
      CONSUMER_STAPLES: 8,
      INDUSTRIALS: 7,
      MATERIALS: 4,
      UTILITIES: 3,
      REAL_ESTATE: 2,
      COMMUNICATION_SERVICES: 1
    }
  },
  DEU: {
    country: 'DEU',
    allocations: {
      INDUSTRIALS: 28,
      TECHNOLOGY: 18,
      FINANCIALS: 15,
      HEALTHCARE: 12,
      MATERIALS: 10,
      ENERGY: 8,
      CONSUMER_DISCRETIONARY: 5,
      UTILITIES: 2,
      CONSUMER_STAPLES: 1,
      REAL_ESTATE: 1,
      COMMUNICATION_SERVICES: 0
    }
  },
  USA: {
    country: 'USA',
    allocations: {
      TECHNOLOGY: 25,
      HEALTHCARE: 15,
      FINANCIALS: 13,
      CONSUMER_DISCRETIONARY: 12,
      COMMUNICATION_SERVICES: 10,
      INDUSTRIALS: 8,
      CONSUMER_STAPLES: 7,
      ENERGY: 4,
      UTILITIES: 3,
      REAL_ESTATE: 2,
      MATERIALS: 1
    }
  },
  GBR: {
    country: 'GBR',
    allocations: {
      FINANCIALS: 25,
      CONSUMER_STAPLES: 15,
      ENERGY: 12,
      HEALTHCARE: 12,
      INDUSTRIALS: 10,
      MATERIALS: 8,
      TECHNOLOGY: 8,
      UTILITIES: 5,
      CONSUMER_DISCRETIONARY: 3,
      REAL_ESTATE: 2,
      COMMUNICATION_SERVICES: 0
    }
  }
};

// Indicateurs économiques par pays
export const COUNTRY_INDICATORS: Record<CountryCode, CountryIndicators> = {
  FRA: {
    country: 'FRA',
    electricity: { value: 2.3, source: 'RTE France', unit: '% variation' },
    pmi: { value: 52.1, source: 'Markit France', unit: 'index' },
    maritime: { value: 1.8, source: 'Port du Havre', unit: '% variation' },
    energy: { value: 85.2, source: 'Brent', unit: '$/barrel' },
    yields: { value: 2.85, source: 'OAT 10 ans', unit: '%' },
    spreads: { value: 45, source: 'vs Bund', unit: 'bps' },
    vix: { value: 18.5, source: 'CBOE', unit: 'index' }
  },
  DEU: {
    country: 'DEU',
    electricity: { value: 1.9, source: 'Bundesnetzagentur', unit: '% variation' },
    pmi: { value: 48.7, source: 'Markit Germany', unit: 'index' },
    maritime: { value: -0.5, source: 'Port de Hambourg', unit: '% variation' },
    energy: { value: 85.2, source: 'Brent', unit: '$/barrel' },
    yields: { value: 2.40, source: 'Bund 10 ans', unit: '%' },
    spreads: { value: 0, source: 'Référence', unit: 'bps' },
    vix: { value: 18.5, source: 'CBOE', unit: 'index' }
  },
  USA: {
    country: 'USA',
    electricity: { value: 3.1, source: 'EIA', unit: '% variation' },
    pmi: { value: 49.2, source: 'ISM Manufacturing', unit: 'index' },
    maritime: { value: 2.7, source: 'Port de Los Angeles', unit: '% variation' },
    energy: { value: 82.1, source: 'WTI', unit: '$/barrel' },
    yields: { value: 4.25, source: 'Treasury 10Y', unit: '%' },
    spreads: { value: 185, source: 'vs Treasury', unit: 'bps' },
    vix: { value: 22.3, source: 'CBOE VIX', unit: 'index' }
  },
  GBR: {
    country: 'GBR',
    electricity: { value: -1.2, source: 'National Grid', unit: '% variation' },
    pmi: { value: 47.8, source: 'Markit UK', unit: 'index' },
    maritime: { value: -2.1, source: 'Port de Felixstowe', unit: '% variation' },
    energy: { value: 85.2, source: 'Brent', unit: '$/barrel' },
    yields: { value: 3.95, source: 'Gilt 10Y', unit: '%' },
    spreads: { value: 155, source: 'vs Bund', unit: 'bps' },
    vix: { value: 18.5, source: 'CBOE', unit: 'index' }
  }
};

// Utilitaires
export const getCountryByCode = (code: CountryCode): Country => COUNTRIES[code];
export const getCountryRegimeData = (code: CountryCode): CountryRegimeData => COUNTRY_REGIME_DATA[code];
export const getCountrySectorAllocations = (code: CountryCode): CountrySectorAllocations => COUNTRY_SECTOR_ALLOCATIONS[code];
export const getCountryIndicators = (code: CountryCode): CountryIndicators => COUNTRY_INDICATORS[code];

export const getAllCountries = (): Country[] => Object.values(COUNTRIES);
export const getCountryCodes = (): CountryCode[] => Object.keys(COUNTRIES) as CountryCode[];

