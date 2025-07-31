// Types pour les secteurs d'activité Oracle Portfolio v4.1

export type SectorType = 
  | 'TECHNOLOGY'
  | 'HEALTHCARE' 
  | 'FINANCIALS'
  | 'ENERGY'
  | 'CONSUMER_DISCRETIONARY'
  | 'CONSUMER_STAPLES'
  | 'INDUSTRIALS'
  | 'MATERIALS'
  | 'UTILITIES'
  | 'REAL_ESTATE'
  | 'COMMUNICATION_SERVICES';

export interface SectorAllocation {
  sector: SectorType;
  allocation: number; // Percentage (0-100)
  performance: number; // Percentage return
  confidence: number; // 0-100
  lastUpdated: Date;
  trend: 'UP' | 'DOWN' | 'STABLE';
  riskScore: number; // 0-100
}

export interface SectorData {
  sector: SectorType;
  name: string;
  allocation: number;
  performance: number;
  confidence: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  riskScore: number;
  marketCap: number;
  volume: number;
  lastUpdated: Date;
}

export interface SectorCharacteristics {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  cyclical: boolean;
  defensive: boolean;
}

export interface SectorTableProps {
  allocations: SectorAllocation[];
  showPerformance?: boolean;
  showTrend?: boolean;
  showRisk?: boolean;
  compact?: boolean;
  className?: string;
}

// Constants pour les secteurs
export const SECTOR_NAMES: Record<SectorType, string> = {
  TECHNOLOGY: 'Technologie',
  HEALTHCARE: 'Santé',
  FINANCIALS: 'Services Financiers',
  ENERGY: 'Énergie',
  CONSUMER_DISCRETIONARY: 'Consommation Discrétionnaire',
  CONSUMER_STAPLES: 'Consommation de Base',
  INDUSTRIALS: 'Industriels',
  MATERIALS: 'Matériaux',
  UTILITIES: 'Services Publics',
  REAL_ESTATE: 'Immobilier',
  COMMUNICATION_SERVICES: 'Services de Communication',
};

export const SECTOR_CHARACTERISTICS: Record<SectorType, SectorCharacteristics> = {
  TECHNOLOGY: {
    name: 'Technologie',
    description: 'Logiciels, semiconducteurs, équipements tech',
    color: '#00d4ff',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    icon: '💻',
    riskLevel: 'HIGH',
    cyclical: true,
    defensive: false,
  },
  HEALTHCARE: {
    name: 'Santé',
    description: 'Pharmaceutique, biotechnologies, équipements médicaux',
    color: '#00ff88',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: '🏥',
    riskLevel: 'LOW',
    cyclical: false,
    defensive: true,
  },
  FINANCIALS: {
    name: 'Services Financiers',
    description: 'Banques, assurances, services financiers',
    color: '#ffa502',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    icon: '🏦',
    riskLevel: 'MEDIUM',
    cyclical: true,
    defensive: false,
  },
  ENERGY: {
    name: 'Énergie',
    description: 'Pétrole, gaz, énergies renouvelables',
    color: '#ff6b6b',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    icon: '⚡',
    riskLevel: 'HIGH',
    cyclical: true,
    defensive: false,
  },
  CONSUMER_DISCRETIONARY: {
    name: 'Consommation Discrétionnaire',
    description: 'Automobile, retail, loisirs, luxe',
    color: '#4ecdc4',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
    icon: '🛍️',
    riskLevel: 'MEDIUM',
    cyclical: true,
    defensive: false,
  },
  CONSUMER_STAPLES: {
    name: 'Consommation de Base',
    description: 'Alimentation, boissons, produits ménagers',
    color: '#45b7d1',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: '🛒',
    riskLevel: 'LOW',
    cyclical: false,
    defensive: true,
  },
  INDUSTRIALS: {
    name: 'Industriels',
    description: 'Aéronautique, transport, construction',
    color: '#96ceb4',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    icon: '🏭',
    riskLevel: 'MEDIUM',
    cyclical: true,
    defensive: false,
  },
  MATERIALS: {
    name: 'Matériaux',
    description: 'Métaux, chimie, matériaux de construction',
    color: '#feca57',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    icon: '🔩',
    riskLevel: 'HIGH',
    cyclical: true,
    defensive: false,
  },
  UTILITIES: {
    name: 'Services Publics',
    description: 'Électricité, gaz, eau, télécommunications',
    color: '#ff9ff3',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    icon: '🔌',
    riskLevel: 'LOW',
    cyclical: false,
    defensive: true,
  },
  REAL_ESTATE: {
    name: 'Immobilier',
    description: 'REITs, développement immobilier',
    color: '#54a0ff',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
    icon: '🏢',
    riskLevel: 'MEDIUM',
    cyclical: true,
    defensive: false,
  },
  COMMUNICATION_SERVICES: {
    name: 'Services de Communication',
    description: 'Télécoms, médias, réseaux sociaux',
    color: '#5f27cd',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    icon: '📡',
    riskLevel: 'MEDIUM',
    cyclical: true,
    defensive: false,
  },
};

export const SECTOR_COLORS = {
  TECHNOLOGY: '#00d4ff',
  HEALTHCARE: '#00ff88',
  FINANCIALS: '#ffa502',
  ENERGY: '#ff6b6b',
  CONSUMER_DISCRETIONARY: '#4ecdc4',
  CONSUMER_STAPLES: '#45b7d1',
  INDUSTRIALS: '#96ceb4',
  MATERIALS: '#feca57',
  UTILITIES: '#ff9ff3',
  REAL_ESTATE: '#54a0ff',
  COMMUNICATION_SERVICES: '#5f27cd',
} as const;

