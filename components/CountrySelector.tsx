import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { CountryCode, Country, COUNTRIES, getAllCountries } from '@/lib/types/country.types';

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  className?: string;
  compact?: boolean;
}

export default function CountrySelector({ 
  selectedCountry, 
  onCountryChange, 
  className = '',
  compact = false 
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const countries = getAllCountries();
  const selectedCountryData = COUNTRIES[selectedCountry];

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (countryCode: CountryCode) => {
    onCountryChange(countryCode);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg
          bg-background-tertiary hover:bg-background-primary
          border border-background-tertiary hover:border-primary-500/30
          text-text-primary transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/50
          ${compact ? 'text-sm' : 'text-base'}
          ${isOpen ? 'ring-2 ring-primary-500/50 border-primary-500/30' : ''}
        `}
        aria-label="Sélectionner un pays"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Flag and Country */}
        <div className="flex items-center space-x-2">
          <span className={`${compact ? 'text-lg' : 'text-xl'}`}>
            {selectedCountryData.flag}
          </span>
          {!compact && (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedCountryData.name}</span>
              <span className="text-xs text-text-secondary">{selectedCountryData.market}</span>
            </div>
          )}
          {compact && (
            <span className="font-medium">{selectedCountryData.code}</span>
          )}
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute top-full left-0 mt-2 w-full min-w-[200px]
              bg-background-tertiary border border-background-primary
              rounded-lg shadow-lg z-50 overflow-hidden
            `}
            role="listbox"
            aria-label="Liste des pays"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-background-primary">
              <div className="flex items-center space-x-2 text-text-secondary">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Sélectionner un pays</span>
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-64 overflow-y-auto">
              {countries.map((country) => (
                <motion.button
                  key={country.code}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-3
                    text-left transition-colors duration-150
                    hover:bg-primary-500/10 focus:bg-primary-500/10
                    focus:outline-none
                    ${selectedCountry === country.code 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'text-text-primary hover:text-primary-400'
                    }
                  `}
                  role="option"
                  aria-selected={selectedCountry === country.code}
                >
                  {/* Flag */}
                  <span className="text-xl flex-shrink-0">{country.flag}</span>
                  
                  {/* Country Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{country.name}</span>
                      <span className="text-xs text-text-secondary ml-2">
                        {country.code}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-secondary">
                        {country.market}
                      </span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-text-secondary">
                        {country.currency}
                      </span>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedCountry === country.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-background-primary">
              <p className="text-xs text-text-secondary">
                {countries.length} pays disponibles
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

