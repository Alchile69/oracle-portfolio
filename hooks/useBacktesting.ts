import { useState, useEffect } from 'react';

export interface BacktestingData {
  oraclePortfolio: {
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  benchmark: {
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  period: string;
  totalMonths: number;
}

export interface BacktestingResponse {
  success: boolean;
  data?: BacktestingData;
  error?: string;
}

export const useBacktesting = () => {
  const [data, setData] = useState<BacktestingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBacktestingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://us-central1-oracle-portfolio-prod.cloudfunctions.net/getBacktesting');
      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        setData(responseData.data);
      } else {
        throw new Error(responseData.error || 'Erreur lors du chargement des données de backtesting');
      }
    } catch (err) {
      console.error('Erreur useBacktesting:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // Fallback avec données par défaut
      setData({
        oraclePortfolio: {
          annualizedReturn: 1.13,
          sharpeRatio: -0.17,
          maxDrawdown: 7.12,
          winRate: 48.33
        },
        benchmark: {
          annualizedReturn: 1.61,
          sharpeRatio: 0.83,
          maxDrawdown: 11.2
        },
        period: "2020-2024",
        totalMonths: 60
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBacktestingData();
  }, []);

  const retry = () => {
    fetchBacktestingData();
  };

  return {
    data,
    isLoading,
    error,
    retry
  };
};
