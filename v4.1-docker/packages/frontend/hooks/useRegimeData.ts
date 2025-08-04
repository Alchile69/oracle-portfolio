import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface RegimeData {
  id: string;
  country: string;
  regime: string;
  detectedAt: string;
  growthScore: number;
  inflationScore: number;
  confidence: number;
  indicators: any[];
  history?: any[];
}

interface UseRegimeDataReturn {
  data: RegimeData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useRegimeData = (
  country: string = 'US',
  days?: number
): UseRegimeDataReturn => {
  const [data, setData] = useState<RegimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = days 
        ? `https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getRegime?country=${country}`
        : `https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getRegime?country=${country}`;

      const response = await fetch(endpoint);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [country, days]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}; 