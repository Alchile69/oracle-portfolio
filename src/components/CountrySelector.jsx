import React, { useState, useCallback } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { countries } from '../data/mockData';

const CountrySelector = ({ selectedCountries = [], onCountryChange, maxSelection = 4 }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction de gestion sécurisée des changements
  const handleCountryToggle = useCallback((countryCode) => {
    try {
      // Vérifications de sécurité
      if (!Array.isArray(selectedCountries)) {
        console.error('selectedCountries n\'est pas un tableau:', selectedCountries);
        return;
      }
      
      if (typeof onCountryChange !== 'function') {
        console.error('onCountryChange n\'est pas une fonction:', onCountryChange);
        return;
      }

      let newCountries;
      const isCurrentlySelected = selectedCountries.includes(countryCode);
      
      if (isCurrentlySelected) {
        // Retirer le pays
        newCountries = selectedCountries.filter(code => code !== countryCode);
      } else if (selectedCountries.length < maxSelection) {
        // Ajouter le pays si on n'a pas atteint la limite
        newCountries = [...selectedCountries, countryCode];
      } else {
        // Limite atteinte, ne rien faire
        return;
      }
      
      // Appeler la fonction de callback
      onCountryChange(newCountries);
    } catch (error) {
      console.error('Erreur dans handleCountryToggle:', error);
    }
  }, [selectedCountries, onCountryChange, maxSelection]);

  // Vérifier que selectedCountries est valide
  if (!Array.isArray(selectedCountries)) {
    return (
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-red-500">
          Erreur: Données de pays invalides
        </label>
      </div>
    );
  }

  const selectedCountryNames = selectedCountries
    .map(code => countries.find(c => c.code === code))
    .filter(Boolean)
    .map(country => `${country.flag} ${country.name}`)
    .join(', ');

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Sélectionner les pays à comparer (max {maxSelection})
      </label>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between min-h-[2.5rem] h-auto"
          >
            <span className="truncate">
              {selectedCountries.length === 0 
                ? "Choisir les pays..." 
                : selectedCountryNames
              }
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80">
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country.code);
            const isDisabled = !isSelected && selectedCountries.length >= maxSelection;
            
            return (
              <div
                key={country.code}
                className={`flex items-center space-x-3 px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isDisabled) {
                    handleCountryToggle(country.code);
                  }
                }}
              >
                <div className="flex items-center justify-center w-4 h-4">
                  {isSelected && <Check className="h-4 w-4 text-green-600" />}
                </div>
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{country.name}</div>
                  <div className="text-xs text-gray-500">{country.currency}</div>
                </div>
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {selectedCountries.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedCountries.length}/{maxSelection} pays sélectionnés
        </div>
      )}
    </div>
  );
};

export default CountrySelector;

