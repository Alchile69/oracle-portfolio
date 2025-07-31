import { useState, useEffect } from 'react';
import { RegimeData, RegimeType } from '@/lib/types/regime.types';
import { CountryCode, getCountryRegimeData, COUNTRY_REGIME_DATA } from '@/lib/types/country.types';

interface UseRegimeDataReturn {
  regimeData: RegimeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isHealthy: boolean;
  lastUpdateAge: number; // Minutes since last update
}

// Configuration API v4.1 selon cahier des charges
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    CURRENT_REGIME: '/api/current-regime',
    HISTORICAL: '/api/historical',
  },
  TIMEOUT: 10000,
};

export const useRegimeData = (selectedCountry?: CountryCode): UseRegimeDataReturn => {
  const [regimeData, setRegimeData] = useState<RegimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegimeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si un pays est sélectionné, utiliser les données locales
      if (selectedCountry) {
        const countryData = getCountryRegimeData(selectedCountry);
        const mappedRegimeData: RegimeData = {
          regime: countryData.regime as RegimeType,
          confidence: countryData.confidence * 100, // Convertir en pourcentage
          growthScore: countryData.growthScore,
          inflationScore: countryData.inflationScore,
          unemploymentScore: undefined,
          detectedAt: countryData.lastUpdated,
          lastUpdated: countryData.lastUpdated,
          country: countryData.country,
        };
        
        setRegimeData(mappedRegimeData);
        setLoading(false);
        return;
      }
      
      // Fallback vers l'API si pas de pays sélectionné
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
      
      if (!data.regime) {
        throw new Error('Invalid data format: regime field expected');
      }
      
      const mappedRegimeData: RegimeData = {
        regime: data.regime as RegimeType,
        confidence: Number(data.confidence) || 85,
        growthScore: Number(data.growthScore) || 0,
        inflationScore: Number(data.inflationScore) || 0,
        unemploymentScore: Number(data.unemploymentScore),
        detectedAt: new Date(data.detectedAt || Date.now()),
        lastUpdated: new Date(data.timestamp || Date.now()),
        country: data.country || 'FRA',
      };
      
      if (!['EXPANSION', 'RECOVERY', 'STAGFLATION', 'RECESSION'].includes(mappedRegimeData.regime)) {
        throw new Error(`Invalid regime type: ${mappedRegimeData.regime}`);
      }
      
      if (mappedRegimeData.confidence < 0 || mappedRegimeData.confidence > 100) {
        throw new Error(`Invalid confidence value: ${mappedRegimeData.confidence}`);
      }
      
      setRegimeData(mappedRegimeData);
      
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Timeout: API not responding');
        } else {
          setError(`Loading error: ${err.message}`);
        }
      } else {
        setError('Unknown error loading regime data');
      }
      
      console.error('Error fetching regime data:', err);
      
      // En cas d'erreur, utiliser les données par défaut de la France
      const fallbackData = getCountryRegimeData('FRA');
      const mappedFallbackData: RegimeData = {
        regime: fallbackData.regime as RegimeType,
        confidence: fallbackData.confidence * 100,
        growthScore: fallbackData.growthScore,
        inflationScore: fallbackData.inflationScore,
        unemploymentScore: undefined,
        detectedAt: fallbackData.lastUpdated,
        lastUpdated: fallbackData.lastUpdated,
        country: fallbackData.country,
      };
      setRegimeData(mappedFallbackData);
      
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchRegimeData();
  }, []);

  // Auto-refresh toutes les 5 minutes (comme spécifié dans le cahier des charges)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRegimeData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Calculs dérivés
  const isHealthy = regimeData ? 
    (Date.now() - regimeData.lastUpdated.getTime()) < 30 * 60 * 1000 : // Less than 30 minutes old
    false;
    
  const lastUpdateAge = regimeData ? 
    Math.floor((Date.now() - regimeData.lastUpdated.getTime()) / (60 * 1000)) : // Minutes
    0;

  return {
    regimeData,
    loading,
    error,
    refetch: fetchRegimeData,
    isHealthy,
    lastUpdateAge,
  };
};

