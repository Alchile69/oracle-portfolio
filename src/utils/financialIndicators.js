// Oracle Portfolio - Bibliothèque d'Indicateurs Financiers Étendus
// Indicateurs techniques, fondamentaux et macroéconomiques avancés

/**
 * Indicateurs Techniques Avancés
 */
export const technicalIndicators = {
  // Moyennes mobiles
  sma: (data, period) => {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    return result;
  },

  ema: (data, period) => {
    const multiplier = 2 / (period + 1);
    const result = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      result.push((data[i] * multiplier) + (result[i - 1] * (1 - multiplier)));
    }
    return result;
  },

  // RSI (Relative Strength Index)
  rsi: (data, period = 14) => {
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  },

  // MACD (Moving Average Convergence Divergence)
  macd: (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    const emaFast = technicalIndicators.ema(data, fastPeriod);
    const emaSlow = technicalIndicators.ema(data, slowPeriod);
    
    const macdLine = emaFast.map((fast, i) => fast - emaSlow[i]).filter(v => !isNaN(v));
    const signalLine = technicalIndicators.ema(macdLine, signalPeriod);
    const histogram = macdLine.map((macd, i) => macd - (signalLine[i] || 0));
    
    return { macdLine, signalLine, histogram };
  },

  // Bollinger Bands
  bollingerBands: (data, period = 20, stdDev = 2) => {
    const sma = technicalIndicators.sma(data, period);
    const bands = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      bands.push({
        upper: mean + (standardDeviation * stdDev),
        middle: mean,
        lower: mean - (standardDeviation * stdDev)
      });
    }
    return bands;
  },

  // Stochastic Oscillator
  stochastic: (high, low, close, kPeriod = 14, dPeriod = 3) => {
    const k = [];
    
    for (let i = kPeriod - 1; i < close.length; i++) {
      const highestHigh = Math.max(...high.slice(i - kPeriod + 1, i + 1));
      const lowestLow = Math.min(...low.slice(i - kPeriod + 1, i + 1));
      k.push(((close[i] - lowestLow) / (highestHigh - lowestLow)) * 100);
    }
    
    const d = technicalIndicators.sma(k, dPeriod);
    return { k, d };
  }
};

/**
 * Indicateurs Fondamentaux
 */
export const fundamentalIndicators = {
  // Price-to-Earnings Ratio
  peRatio: (price, earnings) => price / earnings,

  // Price-to-Book Ratio
  pbRatio: (price, bookValue) => price / bookValue,

  // Debt-to-Equity Ratio
  debtToEquity: (totalDebt, totalEquity) => totalDebt / totalEquity,

  // Return on Equity
  roe: (netIncome, shareholdersEquity) => (netIncome / shareholdersEquity) * 100,

  // Return on Assets
  roa: (netIncome, totalAssets) => (netIncome / totalAssets) * 100,

  // Current Ratio
  currentRatio: (currentAssets, currentLiabilities) => currentAssets / currentLiabilities,

  // Quick Ratio
  quickRatio: (currentAssets, inventory, currentLiabilities) => 
    (currentAssets - inventory) / currentLiabilities,

  // Gross Margin
  grossMargin: (revenue, cogs) => ((revenue - cogs) / revenue) * 100,

  // Operating Margin
  operatingMargin: (operatingIncome, revenue) => (operatingIncome / revenue) * 100,

  // Free Cash Flow Yield
  fcfYield: (freeCashFlow, marketCap) => (freeCashFlow / marketCap) * 100
};

/**
 * Indicateurs Macroéconomiques
 */
export const macroIndicators = {
  // Yield Curve Analysis
  yieldCurveSlope: (longTermYield, shortTermYield) => longTermYield - shortTermYield,

  // Real Interest Rate
  realInterestRate: (nominalRate, inflationRate) => nominalRate - inflationRate,

  // Economic Surprise Index
  economicSurprise: (actual, forecast) => ((actual - forecast) / forecast) * 100,

  // Purchasing Power Parity
  ppp: (domesticPrice, foreignPrice, exchangeRate) => 
    domesticPrice / (foreignPrice * exchangeRate),

  // Taylor Rule
  taylorRule: (neutralRate, inflation, targetInflation, outputGap) => 
    neutralRate + inflation + 0.5 * (inflation - targetInflation) + 0.5 * outputGap,

  // Sahm Rule (Recession Indicator)
  sahmRule: (currentUnemployment, minUnemployment12Months) => 
    currentUnemployment - minUnemployment12Months >= 0.5,

  // Misery Index
  miseryIndex: (unemploymentRate, inflationRate) => unemploymentRate + inflationRate
};

/**
 * Indicateurs de Volatilité
 */
export const volatilityIndicators = {
  // Historical Volatility
  historicalVolatility: (returns, period = 252) => {
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (returns.length - 1);
    return Math.sqrt(variance * period) * 100;
  },

  // Average True Range
  atr: (high, low, close, period = 14) => {
    const trueRanges = [];
    
    for (let i = 1; i < high.length; i++) {
      const tr1 = high[i] - low[i];
      const tr2 = Math.abs(high[i] - close[i - 1]);
      const tr3 = Math.abs(low[i] - close[i - 1]);
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }
    
    return technicalIndicators.sma(trueRanges, period);
  },

  // VIX-like Volatility Index
  vixCalculation: (optionPrices, strikes, timeToExpiry) => {
    // Simplified VIX calculation
    const variance = optionPrices.reduce((sum, price, i) => {
      const contribution = (2 / strikes[i]) * price;
      return sum + contribution;
    }, 0);
    
    return Math.sqrt(variance / timeToExpiry) * 100;
  }
};

/**
 * Indicateurs de Sentiment
 */
export const sentimentIndicators = {
  // Fear & Greed Index Components
  fearGreedIndex: (vix, momentum, demand, breadth, options, bonds, safe) => {
    const components = [vix, momentum, demand, breadth, options, bonds, safe];
    const average = components.reduce((sum, val) => sum + val, 0) / components.length;
    return Math.max(0, Math.min(100, average));
  },

  // Put/Call Ratio
  putCallRatio: (putVolume, callVolume) => putVolume / callVolume,

  // Advance/Decline Ratio
  advanceDeclineRatio: (advancing, declining) => advancing / declining,

  // High-Low Index
  highLowIndex: (newHighs, newLows) => newHighs / (newHighs + newLows) * 100,

  // Insider Trading Ratio
  insiderRatio: (insiderBuys, insiderSells) => insiderBuys / (insiderBuys + insiderSells)
};

/**
 * Indicateurs de Risque
 */
export const riskIndicators = {
  // Value at Risk (VaR)
  valueAtRisk: (returns, confidenceLevel = 0.05) => {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor(returns.length * confidenceLevel);
    return sortedReturns[index];
  },

  // Conditional Value at Risk (CVaR)
  conditionalVaR: (returns, confidenceLevel = 0.05) => {
    const var95 = riskIndicators.valueAtRisk(returns, confidenceLevel);
    const tailReturns = returns.filter(ret => ret <= var95);
    return tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length;
  },

  // Maximum Drawdown
  maxDrawdown: (prices) => {
    let maxDD = 0;
    let peak = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
      } else {
        const drawdown = (peak - prices[i]) / peak;
        maxDD = Math.max(maxDD, drawdown);
      }
    }
    return maxDD * 100;
  },

  // Sharpe Ratio
  sharpeRatio: (returns, riskFreeRate = 0.02) => {
    const excessReturns = returns.map(ret => ret - riskFreeRate / 252);
    const avgExcessReturn = excessReturns.reduce((sum, ret) => sum + ret, 0) / excessReturns.length;
    const volatility = volatilityIndicators.historicalVolatility(excessReturns);
    return (avgExcessReturn * 252) / (volatility / 100);
  },

  // Sortino Ratio
  sortinoRatio: (returns, targetReturn = 0) => {
    const excessReturns = returns.map(ret => ret - targetReturn);
    const avgExcessReturn = excessReturns.reduce((sum, ret) => sum + ret, 0) / excessReturns.length;
    const downside = excessReturns.filter(ret => ret < 0);
    const downsideDeviation = Math.sqrt(downside.reduce((sum, ret) => sum + ret * ret, 0) / downside.length);
    return avgExcessReturn / downsideDeviation;
  },

  // Beta Calculation
  beta: (assetReturns, marketReturns) => {
    const n = Math.min(assetReturns.length, marketReturns.length);
    const assetMean = assetReturns.slice(0, n).reduce((sum, ret) => sum + ret, 0) / n;
    const marketMean = marketReturns.slice(0, n).reduce((sum, ret) => sum + ret, 0) / n;
    
    let covariance = 0;
    let marketVariance = 0;
    
    for (let i = 0; i < n; i++) {
      covariance += (assetReturns[i] - assetMean) * (marketReturns[i] - marketMean);
      marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
    }
    
    return covariance / marketVariance;
  }
};

/**
 * Indicateurs Sectoriels
 */
export const sectorIndicators = {
  // Sector Rotation Model
  sectorMomentum: (sectorReturns, period = 63) => {
    return sectorReturns.map(returns => {
      const recentReturns = returns.slice(-period);
      return recentReturns.reduce((sum, ret) => sum + ret, 0);
    });
  },

  // Relative Strength vs Market
  relativeStrength: (sectorReturns, marketReturns) => {
    const sectorPerf = sectorReturns.reduce((sum, ret) => sum + ret, 0);
    const marketPerf = marketReturns.reduce((sum, ret) => sum + ret, 0);
    return (sectorPerf / marketPerf - 1) * 100;
  },

  // Sector Correlation Matrix
  sectorCorrelation: (sector1Returns, sector2Returns) => {
    const n = Math.min(sector1Returns.length, sector2Returns.length);
    const mean1 = sector1Returns.slice(0, n).reduce((sum, ret) => sum + ret, 0) / n;
    const mean2 = sector2Returns.slice(0, n).reduce((sum, ret) => sum + ret, 0) / n;
    
    let covariance = 0;
    let variance1 = 0;
    let variance2 = 0;
    
    for (let i = 0; i < n; i++) {
      const diff1 = sector1Returns[i] - mean1;
      const diff2 = sector2Returns[i] - mean2;
      covariance += diff1 * diff2;
      variance1 += diff1 * diff1;
      variance2 += diff2 * diff2;
    }
    
    return covariance / Math.sqrt(variance1 * variance2);
  }
};

/**
 * Indicateurs Crypto/Alternatifs
 */
export const cryptoIndicators = {
  // Network Value to Transactions
  nvt: (marketCap, transactionVolume) => marketCap / transactionVolume,

  // Realized Volatility
  realizedVolatility: (prices, period = 30) => {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    return volatilityIndicators.historicalVolatility(returns.slice(-period), period);
  },

  // Hash Rate Momentum
  hashRateMomentum: (hashRates, period = 14) => {
    if (hashRates.length < period + 1) return 0;
    const current = hashRates[hashRates.length - 1];
    const past = hashRates[hashRates.length - 1 - period];
    return ((current - past) / past) * 100;
  },

  // Funding Rate Analysis
  fundingRateSignal: (fundingRates) => {
    const recent = fundingRates.slice(-7);
    const average = recent.reduce((sum, rate) => sum + rate, 0) / recent.length;
    return average > 0.01 ? 'bearish' : average < -0.01 ? 'bullish' : 'neutral';
  }
};

/**
 * Utilitaires de Calcul
 */
export const calculationUtils = {
  // Normalisation des données
  normalize: (data, min = 0, max = 100) => {
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    return data.map(val => min + ((val - dataMin) / (dataMax - dataMin)) * (max - min));
  },

  // Z-Score
  zScore: (data) => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    return data.map(val => (val - mean) / stdDev);
  },

  // Percentile Rank
  percentileRank: (value, data) => {
    const sorted = [...data].sort((a, b) => a - b);
    let rank = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] < value) rank++;
    }
    return (rank / sorted.length) * 100;
  },

  // Smoothing (Exponential)
  exponentialSmoothing: (data, alpha = 0.3) => {
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }
};

/**
 * Configuration des Indicateurs par Défaut
 */
export const defaultIndicatorConfig = {
  technical: {
    rsi: { period: 14, overbought: 70, oversold: 30 },
    macd: { fast: 12, slow: 26, signal: 9 },
    bollinger: { period: 20, stdDev: 2 },
    stochastic: { kPeriod: 14, dPeriod: 3 }
  },
  risk: {
    var: { confidenceLevel: 0.05 },
    sharpe: { riskFreeRate: 0.02 },
    beta: { benchmarkIndex: 'SPY' }
  },
  macro: {
    yieldCurve: { shortTerm: '2Y', longTerm: '10Y' },
    taylorRule: { neutralRate: 2.5, targetInflation: 2.0 }
  }
};

export default {
  technicalIndicators,
  fundamentalIndicators,
  macroIndicators,
  volatilityIndicators,
  sentimentIndicators,
  riskIndicators,
  sectorIndicators,
  cryptoIndicators,
  calculationUtils,
  defaultIndicatorConfig
};

