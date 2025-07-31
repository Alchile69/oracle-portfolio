import { useState, useEffect, useCallback } from 'react';
import { CountryCode } from '@/lib/types/country.types';

interface UseCountrySelectionReturn {
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'oracle-portfolio-selected-country';
const DEFAULT_COUNTRY: CountryCode = 'FRA';

export const useCountrySelection = (): UseCountrySelectionReturn => {
  const [selectedCountry, setSelectedCountryState] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le pays sélectionné depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem(STORAGE_KEY);
      if (savedCountry && ['FRA', 'DEU', 'USA', 'GBR'].includes(savedCountry)) {
        setSelectedCountryState(savedCountry as CountryCode);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du pays sélectionné:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour changer le pays sélectionné
  const setSelectedCountry = useCallback((country: CountryCode) => {
    try {
      setSelectedCountryState(country);
      localStorage.setItem(STORAGE_KEY, country);
      
      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('countryChanged', { 
        detail: { country } 
      }));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du pays sélectionné:', error);
    }
  }, []);

  return {
    selectedCountry,
    setSelectedCountry,
    isLoading
  };
};

