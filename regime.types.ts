// Types pour les régimes économiques Oracle Portfolio v4.1

export type RegimeType = 'EXPANSION' | 'RECOVERY' | 'STAGFLATION' | 'RECESSION';

export interface RegimeData {
  regime: RegimeType;
  confidence: number; // 0-100
  growthScore: number; // Percentage
  inflationScore: number; // Percentage
  unemploymentScore?: number; // Percentage
  detectedAt: Date;
  lastUpdated: Date;
  country: string;
}

export interface RegimeCharacteristics {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  thresholds: {
    growth: { min: number; max: number };
    inflation: { min: number; max: number };
  };
  optimalSectors: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
}

export interface RegimeHistory {
  date: Date;
  regime: RegimeType;
  confidence: number;
  duration: number; // Days in this regime
}

export interface RegimeIndicatorProps {
  data: RegimeData;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

// Constants pour les régimes
export const REGIME_CHARACTERISTICS: Record<RegimeType, RegimeCharacteristics> = {
  EXPANSION: {
    name: 'Expansion',
    description: 'Croissance forte, inflation contrôlée',
    color: '#00ff88',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: '📈',
    thresholds: {
      growth: { min: 2, max: Infinity },
      inflation: { min: 0, max: 2.5 },
    },
    optimalSectors: ['Technology', 'Consumer Discretionary', 'Industrials'],
    riskLevel: 'LOW',
  },
  RECOVERY: {
    name: 'Reprise',
    description: 'Croissance modérée, reprise économique',
    color: '#40a9ff',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: '🔄',
    thresholds: {
      growth: { min: 1, max: 2 },
      inflation: { min: 0, max: 2 },
    },
    optimalSectors: ['Financials', 'Materials', 'Consumer Services'],
    riskLevel: 'MEDIUM',
  },
  STAGFLATION: {
    name: 'Stagflation',
    description: 'Croissance faible, inflation élevée',
    color: '#ffa502',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    icon: '⚠️',
    thresholds: {
      growth: { min: -Infinity, max: 1 },
      inflation: { min: 3, max: Infinity },
    },
    optimalSectors: ['Energy', 'Utilities', 'Healthcare'],
    riskLevel: 'HIGH',
  },
  RECESSION: {
    name: 'Récession',
    description: 'Contraction économique, déflation possible',
    color: '#ff4757',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    icon: '📉',
    thresholds: {
      growth: { min: -Infinity, max: 0 },
      inflation: { min: -Infinity, max: 2 },
    },
    optimalSectors: ['Consumer Staples', 'Healthcare', 'Utilities'],
    riskLevel: 'EXTREME',
  },
};

export const REGIME_COLORS = {
  EXPANSION: '#00ff88',
  RECOVERY: '#40a9ff',
  STAGFLATION: '#ffa502',
  RECESSION: '#ff4757',
} as const;

