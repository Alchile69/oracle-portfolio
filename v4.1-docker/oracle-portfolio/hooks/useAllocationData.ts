import { useState, useEffect } from 'react';
import { SectorAllocation, SectorType } from '@/lib/types/sector.types';

interface UseAllocationDataReturn {
  allocations: SectorAllocation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalAllocation: number;
  averagePerformance: number;
  averageRiskScore: number;
}

// Configuration API v4.1 selon cahier des charges
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    CURRENT_REGIME: '/api/current-regime',
    SECTORS: '/api/sectors',
    HISTORICAL: '/api/historical',
  },
  TIMEOUT: 10000,
};

export const useAllocationData = (): UseAllocationDataReturn => {
  const [allocations, setAllocations] = useState<SectorAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel endpoint v4.1 selon cahier des charges
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CURRENT_REGIME}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format attendu selon cahier des charges v4.1:
      // { regime, allocations, timestamp }
      if (!data.allocations || !Array.isArray(data.allocations)) {
        throw new Error('Invalid data format: allocations array expected');
      }
      
      // Mapper les allocations vers notre format SectorAllocation
      const mappedAllocations: SectorAllocation[] = data.allocations.map((item: any) => ({
        sector: item.sector as SectorType,
        allocation: Number(item.allocation) || 0,
        performance: Number(item.performance) || 0,
        confidence: Number(item.confidence) || 85,
        lastUpdated: new Date(data.timestamp || Date.now()),
        trend: item.trend || 'STABLE',
        riskScore: Number(item.riskScore) || 50,
      }));
      
      // Validation des données
      const validAllocations = mappedAllocations.filter(allocation => 
        allocation.sector && 
        allocation.allocation >= 0 && 
        allocation.allocation <= 100
      );
      
      if (validAllocations.length === 0) {
        throw new Error('No valid allocations found');
      }
      
      setAllocations(validAllocations);
      
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Timeout: API not responding');
        } else {
          setError(`Loading error: ${err.message}`);
        }
      } else {
        setError('Unknown error loading allocations');
      }
      
      console.error('Error fetching allocations:', err);
      
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchAllocations();
  }, []);

  // Auto-refresh toutes les 5 minutes (comme spécifié dans le cahier des charges)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllocations();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Calculs dérivés
  const totalAllocation = allocations.reduce((sum, item) => sum + item.allocation, 0);
  const averagePerformance = allocations.length > 0 
    ? allocations.reduce((sum, item) => sum + item.performance, 0) / allocations.length 
    : 0;
  const averageRiskScore = allocations.length > 0
    ? allocations.reduce((sum, item) => sum + item.riskScore, 0) / allocations.length
    : 0;

  return {
    allocations,
    loading,
    error,
    refetch: fetchAllocations,
    totalAllocation,
    averagePerformance,
    averageRiskScore,
  };
};

