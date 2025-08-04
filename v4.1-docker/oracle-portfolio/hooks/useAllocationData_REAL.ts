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

// Configuration API - À adapter selon vos endpoints
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    ALLOCATIONS: '/api/allocations',
    SECTORS: '/api/sectors',
  },
  TIMEOUT: 10000, // 10 secondes
};

export const useAllocationData = (): UseAllocationDataReturn => {
  const [allocations, setAllocations] = useState<SectorAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour appeler l'API réelle
  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel API avec timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALLOCATIONS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validation et transformation des données
      if (!Array.isArray(data)) {
        throw new Error('Format de données invalide: array attendu');
      }
      
      // Mapper les données API vers notre format
      const mappedAllocations: SectorAllocation[] = data.map((item: any) => ({
        sector: item.sector as SectorType,
        allocation: Number(item.allocation) || 0,
        performance: Number(item.performance) || 0,
        confidence: Number(item.confidence) || 0,
        lastUpdated: new Date(item.lastUpdated || Date.now()),
        trend: item.trend || 'STABLE',
        riskScore: Number(item.riskScore) || 50,
      }));
      
      // Validation des secteurs
      const validAllocations = mappedAllocations.filter(allocation => 
        allocation.sector && 
        allocation.allocation >= 0 && 
        allocation.allocation <= 100
      );
      
      if (validAllocations.length === 0) {
        throw new Error('Aucune allocation valide trouvée');
      }
      
      setAllocations(validAllocations);
      
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Timeout: L\'API ne répond pas');
        } else {
          setError(`Erreur de chargement: ${err.message}`);
        }
      } else {
        setError('Erreur inconnue lors du chargement des allocations');
      }
      
      console.error('Error fetching allocations:', err);
      
      // En cas d'erreur, garder les anciennes données si disponibles
      // setAllocations([]); // Décommentez si vous voulez vider en cas d'erreur
      
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchAllocations();
  }, []);

  // Auto-refresh toutes les 5 minutes (comme la v2.4.0)
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

// Hook alternatif pour utiliser les mêmes endpoints que la v2.4.0
export const useAllocationDataFromProd = (): UseAllocationDataReturn => {
  const [allocations, setAllocations] = useState<SectorAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFromProduction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser les mêmes endpoints que votre v2.4.0 en production
      // Remplacez par vos vraies URLs
      const response = await fetch('https://oracle-portfolio-prod.web.app/api/allocations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur production API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Adapter le format de votre API production
      const adaptedData: SectorAllocation[] = data.map((item: any) => ({
        sector: item.sector,
        allocation: item.allocation,
        performance: item.performance,
        confidence: item.confidence || 85,
        lastUpdated: new Date(item.lastUpdated || Date.now()),
        trend: item.trend || 'STABLE',
        riskScore: item.riskScore || 50,
      }));
      
      setAllocations(adaptedData);
      
    } catch (err) {
      setError('Erreur de connexion à l\'API de production');
      console.error('Production API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromProduction();
  }, []);

  // Calculs
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
    refetch: fetchFromProduction,
    totalAllocation,
    averagePerformance,
    averageRiskScore,
  };
};

