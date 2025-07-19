// Données de test pour la vue comparative multi-pays Oracle Portfolio

export const countries = [
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', currency: 'USD' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR' },
  { code: 'UK', name: 'Royaume-Uni', flag: '🇬🇧', currency: 'GBP' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', currency: 'JPY' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', currency: 'AUD' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', currency: 'CHF' }
];

export const performanceData = {
  US: {
    cumulativeReturn: 12.5,
    annualizedReturn: 8.2,
    volatility: 15.3,
    sharpeRatio: 0.85,
    maxDrawdown: -8.2,
    avgDrawdown: -2.1,
    var95: -3.2,
    beta: 1.05,
    alpha: 2.1,
    informationRatio: 0.65,
    trackingError: 4.2,
    calmarRatio: 1.0,
    sortinoRatio: 1.2,
    treynorRatio: 7.8,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 108.5 },
      { date: '2024-03', value: 95.2 },
      { date: '2024-04', value: 125.8 },
      { date: '2024-05', value: 142.3 },
      { date: '2024-06', value: 158.7 },
      { date: '2024-07', value: 175.2 }
    ]
  },
  DE: {
    cumulativeReturn: 9.8,
    annualizedReturn: 6.5,
    volatility: 18.7,
    sharpeRatio: 0.62,
    maxDrawdown: -12.1,
    avgDrawdown: -3.2,
    var95: -4.1,
    beta: 1.15,
    alpha: 1.2,
    informationRatio: 0.45,
    trackingError: 5.8,
    calmarRatio: 0.54,
    sortinoRatio: 0.89,
    treynorRatio: 5.7,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 92.5 },
      { date: '2024-03', value: 78.2 },
      { date: '2024-04', value: 88.7 },
      { date: '2024-05', value: 115.3 },
      { date: '2024-06', value: 125.8 },
      { date: '2024-07', value: 135.4 }
    ]
  },
  FR: {
    cumulativeReturn: 8.3,
    annualizedReturn: 5.8,
    volatility: 16.9,
    sharpeRatio: 0.58,
    maxDrawdown: -10.5,
    avgDrawdown: -2.8,
    var95: -3.8,
    beta: 0.98,
    alpha: 0.9,
    informationRatio: 0.38,
    trackingError: 4.9,
    calmarRatio: 0.55,
    sortinoRatio: 0.82,
    treynorRatio: 5.9,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 110.5 },
      { date: '2024-03', value: 125.8 },
      { date: '2024-04', value: 118.2 },
      { date: '2024-05', value: 135.7 },
      { date: '2024-06', value: 148.3 },
      { date: '2024-07', value: 162.1 }
    ]
  },
  UK: {
    cumulativeReturn: 7.2,
    annualizedReturn: 4.9,
    volatility: 19.2,
    sharpeRatio: 0.48,
    maxDrawdown: -14.2,
    avgDrawdown: -4.1,
    var95: -4.8,
    beta: 1.08,
    alpha: 0.5,
    informationRatio: 0.28,
    trackingError: 6.2,
    calmarRatio: 0.35,
    sortinoRatio: 0.68,
    treynorRatio: 4.5,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 88.5 },
      { date: '2024-03', value: 72.8 },
      { date: '2024-04', value: 85.2 },
      { date: '2024-05', value: 98.7 },
      { date: '2024-06', value: 112.3 },
      { date: '2024-07', value: 128.9 }
    ]
  },
  JP: {
    cumulativeReturn: 6.2,
    annualizedReturn: 4.1,
    volatility: 22.1,
    sharpeRatio: 0.35,
    maxDrawdown: -16.8,
    avgDrawdown: -4.2,
    var95: -5.8,
    beta: 0.95,
    alpha: -0.8,
    informationRatio: 0.25,
    trackingError: 8.1,
    calmarRatio: 0.24,
    sortinoRatio: 0.42,
    treynorRatio: 4.3,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 95.2 },
      { date: '2024-03', value: 82.8 },
      { date: '2024-04', value: 97.5 },
      { date: '2024-05', value: 101.2 },
      { date: '2024-06', value: 103.8 },
      { date: '2024-07', value: 106.2 }
    ]
  },
  CA: {
    cumulativeReturn: 10.8,
    annualizedReturn: 7.2,
    volatility: 17.5,
    sharpeRatio: 0.68,
    maxDrawdown: -9.5,
    avgDrawdown: -2.8,
    var95: -3.8,
    beta: 1.08,
    alpha: 1.5,
    informationRatio: 0.52,
    trackingError: 5.2,
    calmarRatio: 0.76,
    sortinoRatio: 0.95,
    treynorRatio: 6.7,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 101.5 },
      { date: '2024-03', value: 87.2 },
      { date: '2024-04', value: 103.8 },
      { date: '2024-05', value: 116.2 },
      { date: '2024-06', value: 128.5 },
      { date: '2024-07', value: 140.8 }
    ]
  },
  AU: {
    cumulativeReturn: 11.5,
    annualizedReturn: 7.8,
    volatility: 19.2,
    sharpeRatio: 0.72,
    maxDrawdown: -11.2,
    avgDrawdown: -3.1,
    var95: -4.2,
    beta: 1.12,
    alpha: 1.8,
    informationRatio: 0.58,
    trackingError: 6.8,
    calmarRatio: 0.70,
    sortinoRatio: 1.02,
    treynorRatio: 7.0,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 102.8 },
      { date: '2024-03', value: 88.5 },
      { date: '2024-04', value: 105.2 },
      { date: '2024-05', value: 118.1 },
      { date: '2024-06', value: 130.2 },
      { date: '2024-07', value: 151.5 }
    ]
  },
  CH: {
    cumulativeReturn: 8.5,
    annualizedReturn: 5.8,
    volatility: 14.2,
    sharpeRatio: 0.58,
    maxDrawdown: -7.8,
    avgDrawdown: -2.2,
    var95: -3.1,
    beta: 0.88,
    alpha: 1.2,
    informationRatio: 0.48,
    trackingError: 4.8,
    calmarRatio: 0.74,
    sortinoRatio: 0.82,
    treynorRatio: 6.6,
    historicalData: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 101.2 },
      { date: '2024-03', value: 88.8 },
      { date: '2024-04', value: 102.5 },
      { date: '2024-05', value: 114.8 },
      { date: '2024-06', value: 126.2 },
      { date: '2024-07', value: 138.5 }
    ]
  }
};

export const allocationData = {
  US: {
    stocks: 65,
    bonds: 25,
    commodities: 8,
    cash: 2,
    sectors: {
      technology: 28,
      healthcare: 15,
      financials: 12,
      consumer: 10,
      industrials: 8,
      energy: 7,
      utilities: 5,
      materials: 4,
      telecom: 3,
      realestate: 8
    },
    regions: {
      northAmerica: 70,
      europe: 15,
      asia: 10,
      emergingMarkets: 5
    }
  },
  DE: {
    stocks: 58,
    bonds: 32,
    commodities: 7,
    cash: 3,
    sectors: {
      technology: 18,
      healthcare: 12,
      financials: 16,
      consumer: 14,
      industrials: 15,
      energy: 8,
      utilities: 6,
      materials: 5,
      telecom: 3,
      realestate: 3
    },
    regions: {
      northAmerica: 25,
      europe: 60,
      asia: 10,
      emergingMarkets: 5
    }
  },
  FR: {
    stocks: 60,
    bonds: 30,
    commodities: 6,
    cash: 4,
    sectors: {
      technology: 15,
      healthcare: 14,
      financials: 18,
      consumer: 16,
      industrials: 12,
      energy: 9,
      utilities: 7,
      materials: 4,
      telecom: 3,
      realestate: 2
    },
    regions: {
      northAmerica: 20,
      europe: 65,
      asia: 10,
      emergingMarkets: 5
    }
  },
  UK: {
    stocks: 55,
    bonds: 35,
    commodities: 6,
    cash: 4,
    sectors: {
      technology: 12,
      healthcare: 10,
      financials: 22,
      consumer: 15,
      industrials: 10,
      energy: 12,
      utilities: 8,
      materials: 6,
      telecom: 3,
      realestate: 2
    },
    regions: {
      northAmerica: 30,
      europe: 55,
      asia: 10,
      emergingMarkets: 5
    }
  },
  JP: {
    stocks: 52,
    bonds: 38,
    commodities: 5,
    cash: 5,
    sectors: {
      technology: 22,
      healthcare: 8,
      financials: 14,
      consumer: 18,
      industrials: 16,
      energy: 6,
      utilities: 5,
      materials: 7,
      telecom: 2,
      realestate: 2
    },
    regions: {
      northAmerica: 15,
      europe: 10,
      asia: 70,
      emergingMarkets: 5
    }
  },
  CA: {
    stocks: 62,
    bonds: 28,
    commodities: 8,
    cash: 2,
    sectors: {
      technology: 20,
      healthcare: 12,
      financials: 18,
      consumer: 14,
      industrials: 10,
      energy: 12,
      utilities: 6,
      materials: 5,
      telecom: 2,
      realestate: 1
    },
    regions: {
      northAmerica: 75,
      europe: 12,
      asia: 8,
      emergingMarkets: 5
    }
  },
  AU: {
    stocks: 58,
    bonds: 30,
    commodities: 10,
    cash: 2,
    sectors: {
      technology: 16,
      healthcare: 10,
      financials: 20,
      consumer: 12,
      industrials: 8,
      energy: 8,
      utilities: 7,
      materials: 15,
      telecom: 2,
      realestate: 2
    },
    regions: {
      northAmerica: 25,
      europe: 15,
      asia: 55,
      emergingMarkets: 5
    }
  },
  CH: {
    stocks: 50,
    bonds: 40,
    commodities: 6,
    cash: 4,
    sectors: {
      technology: 18,
      healthcare: 16,
      financials: 22,
      consumer: 14,
      industrials: 12,
      energy: 5,
      utilities: 6,
      materials: 4,
      telecom: 2,
      realestate: 1
    },
    regions: {
      northAmerica: 35,
      europe: 50,
      asia: 10,
      emergingMarkets: 5
    }
  }
};

export const backtestingData = {
  US: {
    totalReturn: 145.2,
    annualizedReturn: 8.2,
    volatility: 15.3,
    sharpeRatio: 0.85,
    maxDrawdown: -8.2,
    winRate: 68,
    profitFactor: 1.85,
    transactions: 142,
    fees: 0.15,
    turnover: 25,
    periods: {
      '1Y': { return: 12.5, volatility: 15.3, sharpe: 0.85 },
      '3Y': { return: 8.8, volatility: 16.1, sharpe: 0.78 },
      '5Y': { return: 9.2, volatility: 15.8, sharpe: 0.82 }
    }
  },
  DE: {
    totalReturn: 128.5,
    annualizedReturn: 6.5,
    volatility: 18.7,
    sharpeRatio: 0.62,
    maxDrawdown: -12.1,
    winRate: 62,
    profitFactor: 1.52,
    transactions: 156,
    fees: 0.18,
    turnover: 32,
    periods: {
      '1Y': { return: 9.8, volatility: 18.7, sharpe: 0.62 },
      '3Y': { return: 7.2, volatility: 19.2, sharpe: 0.58 },
      '5Y': { return: 6.8, volatility: 18.9, sharpe: 0.60 }
    }
  },
  FR: {
    totalReturn: 122.8,
    annualizedReturn: 5.8,
    volatility: 16.9,
    sharpeRatio: 0.58,
    maxDrawdown: -10.5,
    winRate: 64,
    profitFactor: 1.48,
    transactions: 138,
    fees: 0.16,
    turnover: 28,
    periods: {
      '1Y': { return: 8.3, volatility: 16.9, sharpe: 0.58 },
      '3Y': { return: 6.5, volatility: 17.2, sharpe: 0.55 },
      '5Y': { return: 6.1, volatility: 17.0, sharpe: 0.57 }
    }
  },
  UK: {
    totalReturn: 115.2,
    annualizedReturn: 4.9,
    volatility: 19.2,
    sharpeRatio: 0.48,
    maxDrawdown: -14.2,
    winRate: 58,
    profitFactor: 1.32,
    transactions: 164,
    fees: 0.22,
    turnover: 35,
    periods: {
      '1Y': { return: 7.2, volatility: 19.2, sharpe: 0.48 },
      '3Y': { return: 5.8, volatility: 19.8, sharpe: 0.45 },
      '5Y': { return: 5.2, volatility: 19.5, sharpe: 0.47 }
    }
  },
  JP: {
    totalReturn: 108.2,
    annualizedReturn: 4.1,
    volatility: 22.1,
    sharpeRatio: 0.35,
    maxDrawdown: -16.8,
    winRate: 54,
    profitFactor: 1.25,
    transactions: 178,
    fees: 0.25,
    turnover: 42,
    periods: {
      '1Y': { return: 6.2, volatility: 22.1, sharpe: 0.35 },
      '3Y': { return: 4.8, volatility: 22.8, sharpe: 0.32 },
      '5Y': { return: 4.2, volatility: 22.5, sharpe: 0.34 }
    }
  },
  CA: {
    totalReturn: 135.8,
    annualizedReturn: 7.2,
    volatility: 17.5,
    sharpeRatio: 0.68,
    maxDrawdown: -9.5,
    winRate: 65,
    profitFactor: 1.72,
    transactions: 148,
    fees: 0.18,
    turnover: 28,
    periods: {
      '1Y': { return: 10.8, volatility: 17.5, sharpe: 0.68 },
      '3Y': { return: 8.2, volatility: 18.1, sharpe: 0.65 },
      '5Y': { return: 7.8, volatility: 17.8, sharpe: 0.67 }
    }
  },
  AU: {
    totalReturn: 142.5,
    annualizedReturn: 7.8,
    volatility: 19.2,
    sharpeRatio: 0.72,
    maxDrawdown: -11.2,
    winRate: 66,
    profitFactor: 1.78,
    transactions: 152,
    fees: 0.20,
    turnover: 32,
    periods: {
      '1Y': { return: 11.5, volatility: 19.2, sharpe: 0.72 },
      '3Y': { return: 8.8, volatility: 19.8, sharpe: 0.68 },
      '5Y': { return: 8.2, volatility: 19.5, sharpe: 0.70 }
    }
  },
  CH: {
    totalReturn: 125.8,
    annualizedReturn: 5.8,
    volatility: 14.2,
    sharpeRatio: 0.58,
    maxDrawdown: -7.8,
    winRate: 62,
    profitFactor: 1.55,
    transactions: 132,
    fees: 0.15,
    turnover: 22,
    periods: {
      '1Y': { return: 8.5, volatility: 14.2, sharpe: 0.58 },
      '3Y': { return: 6.8, volatility: 14.8, sharpe: 0.55 },
      '5Y': { return: 6.2, volatility: 14.5, sharpe: 0.57 }
    }
  }
};

export const benchmarkData = {
  US: {
    sp500: { return: 11.2, volatility: 16.8, correlation: 0.92 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.88 },
    local: { return: 11.2, volatility: 16.8, correlation: 0.92 }
  },
  DE: {
    dax: { return: 8.5, volatility: 20.1, correlation: 0.89 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.82 },
    local: { return: 8.5, volatility: 20.1, correlation: 0.89 }
  },
  FR: {
    cac40: { return: 7.8, volatility: 18.5, correlation: 0.91 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.85 },
    local: { return: 7.8, volatility: 18.5, correlation: 0.91 }
  },
  UK: {
    ftse100: { return: 6.2, volatility: 18.9, correlation: 0.87 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.79 },
    local: { return: 6.2, volatility: 18.9, correlation: 0.87 }
  },
  JP: {
    nikkei: { return: 5.8, volatility: 21.5, correlation: 0.92 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.75 },
    local: { return: 5.8, volatility: 21.5, correlation: 0.92 }
  },
  CA: {
    tsx: { return: 9.2, volatility: 17.8, correlation: 0.88 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.85 },
    local: { return: 9.2, volatility: 17.8, correlation: 0.88 }
  },
  AU: {
    asx200: { return: 10.5, volatility: 18.5, correlation: 0.85 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.78 },
    local: { return: 10.5, volatility: 18.5, correlation: 0.85 }
  },
  CH: {
    smi: { return: 7.8, volatility: 14.8, correlation: 0.89 },
    msciWorld: { return: 9.8, volatility: 15.2, correlation: 0.82 },
    local: { return: 7.8, volatility: 14.8, correlation: 0.89 }
  }
};

export const physicalIndicators = {
  US: {
    electricity: { value: 85, trend: 'up', weight: 25 },
    pmi: { value: 52.1, trend: 'stable', weight: 30 },
    maritime: { value: 78, trend: 'up', weight: 20 },
    energy: { value: 82, trend: 'down', weight: 25 }
  },
  DE: {
    electricity: { value: 72, trend: 'down', weight: 25 },
    pmi: { value: 48.5, trend: 'down', weight: 30 },
    maritime: { value: 65, trend: 'stable', weight: 20 },
    energy: { value: 68, trend: 'down', weight: 25 }
  },
  FR: {
    electricity: { value: 78, trend: 'stable', weight: 25 },
    pmi: { value: 49.8, trend: 'down', weight: 30 },
    maritime: { value: 71, trend: 'up', weight: 20 },
    energy: { value: 75, trend: 'stable', weight: 25 }
  },
  UK: {
    electricity: { value: 69, trend: 'down', weight: 25 },
    pmi: { value: 47.2, trend: 'down', weight: 30 },
    maritime: { value: 58, trend: 'down', weight: 20 },
    energy: { value: 62, trend: 'down', weight: 25 }
  },
  JP: {
    electricity: { value: 74, trend: 'stable', weight: 25 },
    pmi: { value: 49.5, trend: 'stable', weight: 30 },
    maritime: { value: 82, trend: 'up', weight: 20 },
    energy: { value: 71, trend: 'down', weight: 25 }
  },
  CA: {
    electricity: { value: 88, trend: 'up', weight: 25 },
    pmi: { value: 53.2, trend: 'up', weight: 30 },
    maritime: { value: 76, trend: 'stable', weight: 20 },
    energy: { value: 85, trend: 'up', weight: 25 }
  },
  AU: {
    electricity: { value: 81, trend: 'up', weight: 25 },
    pmi: { value: 51.8, trend: 'up', weight: 30 },
    maritime: { value: 79, trend: 'up', weight: 20 },
    energy: { value: 83, trend: 'stable', weight: 25 }
  },
  CH: {
    electricity: { value: 76, trend: 'stable', weight: 25 },
    pmi: { value: 50.5, trend: 'stable', weight: 30 },
    maritime: { value: 68, trend: 'stable', weight: 20 },
    energy: { value: 72, trend: 'stable', weight: 25 }
  }
};

export const financialIndicators = {
  US: {
    yields: { value: 4.2, trend: 'up', weight: 40 },
    spreads: { value: 1.8, trend: 'stable', weight: 30 },
    volatility: { value: 15.3, trend: 'down', weight: 30 }
  },
  DE: {
    yields: { value: 2.8, trend: 'up', weight: 40 },
    spreads: { value: 2.1, trend: 'up', weight: 30 },
    volatility: { value: 18.7, trend: 'up', weight: 30 }
  },
  FR: {
    yields: { value: 3.1, trend: 'up', weight: 40 },
    spreads: { value: 1.9, trend: 'stable', weight: 30 },
    volatility: { value: 16.9, trend: 'stable', weight: 30 }
  },
  UK: {
    yields: { value: 4.5, trend: 'up', weight: 40 },
    spreads: { value: 2.3, trend: 'up', weight: 30 },
    volatility: { value: 19.2, trend: 'up', weight: 30 }
  },
  JP: {
    yields: { value: 0.8, trend: 'up', weight: 40 },
    spreads: { value: 1.2, trend: 'stable', weight: 30 },
    volatility: { value: 22.1, trend: 'up', weight: 30 }
  },
  CA: {
    yields: { value: 3.8, trend: 'up', weight: 40 },
    spreads: { value: 1.6, trend: 'stable', weight: 30 },
    volatility: { value: 17.5, trend: 'stable', weight: 30 }
  },
  AU: {
    yields: { value: 4.1, trend: 'up', weight: 40 },
    spreads: { value: 1.9, trend: 'up', weight: 30 },
    volatility: { value: 19.2, trend: 'stable', weight: 30 }
  },
  CH: {
    yields: { value: 1.2, trend: 'up', weight: 40 },
    spreads: { value: 0.8, trend: 'stable', weight: 30 },
    volatility: { value: 14.2, trend: 'down', weight: 30 }
  }
};

// Fonction utilitaire pour obtenir les données d'un pays
export const getCountryData = (countryCode) => {
  return {
    country: countries.find(c => c.code === countryCode),
    performance: performanceData[countryCode],
    allocation: allocationData[countryCode],
    backtesting: backtestingData[countryCode],
    benchmark: benchmarkData[countryCode],
    physicalIndicators: physicalIndicators[countryCode],
    financialIndicators: financialIndicators[countryCode]
  };
};

// Fonction pour obtenir les données de comparaison
export const getComparisonData = (countryCodes) => {
  return countryCodes.map(code => ({
    code,
    ...getCountryData(code)
  }));
};

