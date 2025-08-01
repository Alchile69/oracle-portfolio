// Types pour Oracle Portfolio v4.3

export interface MarketStress {
  stress_level: string;
  vix: number;
  high_yield_spread: number;
  last_update: string;
}

export interface MarketData {
  market_data: {
    spy_price: number;
    tlt_price: number;
    gld_price: number;
    hyg_price: number;
  };
  last_update: string;
  timestamp?: string;
}

export interface Allocation {
  sector: string;
  allocation: number;
  performance: number;
  risk: string;
  confidence: number;
}

export interface RegimeData {
  regime: string;
  confidence: number;
  indicators: {
    growth: number;
    inflation: number;
  };
  sectors: string[];
  country: string;
  last_update: string;
}

export interface CountryData {
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

export interface BacktestingData {
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
}

