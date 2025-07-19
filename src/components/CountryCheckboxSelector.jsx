import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { countries } from '../data/mockData';

const CountryCheckboxSelector = ({ selectedCountries, onCountryChange, maxCountries = 4 }) => {
  const handleCountryToggle = (countryCode) => {
    if (selectedCountries.includes(countryCode)) {
      // Désélectionner le pays
      onCountryChange(selectedCountries.filter(code => code !== countryCode));
    } else if (selectedCountries.length < maxCountries) {
      // Ajouter le pays si on n'a pas atteint la limite
      onCountryChange([...selectedCountries, countryCode]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌍 Sélection des Pays
          <Badge variant="secondary">
            {selectedCountries.length}/{maxCountries} pays sélectionnés
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countries.map((country) => {
            const isSelected = selectedCountries.includes(country.code);
            const isDisabled = !isSelected && selectedCountries.length >= maxCountries;
            
            return (
              <div
                key={country.code}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer
                  ${isSelected 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }
                  ${isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => !isDisabled && handleCountryToggle(country.code)}
              >
                <input
                  type="checkbox"
                  id={country.code}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => handleCountryToggle(country.code)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{country.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {country.currency}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedCountries.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-sm">Sélectionnez au moins un pays pour commencer la comparaison</p>
          </div>
        )}
        
        {selectedCountries.length >= maxCountries && (
          <div className="text-center text-blue-600 dark:text-blue-400 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium">
              Limite atteinte ! Désélectionnez un pays pour en ajouter un autre.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryCheckboxSelector;

