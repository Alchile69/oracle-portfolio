import React, { useEffect, useState } from 'react';
import { useCountryContext } from '../../hooks/CountryContext';
import { useRegime } from '../../hooks/useRegime';
import Card from '../ui/Card-fixed';
import Skeleton from '../ui/Skeleton-fixed';
import StatusIndicator from '../ui/StatusIndicator-fixed';
import { formatDateTime } from '../../utils/formatters';

interface RegimeData {
  success?: boolean;
  country?: string;
  regime?: string;
  confidence?: number;
  timestamp?: string;
}

const RegimeCard: React.FC = () => {
  const { selectedCountry } = useCountryContext();
  const { data, isLoading, error, refetch } = useRegime(selectedCountry);
  
  // Force le re-rendu quand selectedCountry change
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    console.log('RegimeCard - selectedCountry changed to:', selectedCountry);
    setKey(prev => prev + 1); // Force le re-rendu
    refetch(); // Force le refetch des données
  }, [selectedCountry, refetch]);

  useEffect(() => {
    console.log('RegimeCard - data updated:', data);
    console.log('RegimeCard - isLoading:', isLoading);
    console.log('RegimeCard - error:', error);
  }, [data, isLoading, error]);

  if (error) {
    return (
      <Card
        title="Régime Économique"
        onRefresh={refetch}
        isLoading={isLoading}
      >
        <div className="text-secondary-500 text-center py-4">
          Impossible de charger les données de régime. Veuillez réessayer.
          <br />
          <small>Pays sélectionné: {selectedCountry}</small>
        </div>
      </Card>
    );
  }
  
  return (
    <Card
      key={key} // Force le re-rendu complet du composant
      title="Régime Économique"
      subtitle={data && (data as RegimeData).timestamp ? `Mis à jour: ${formatDateTime((data as RegimeData).timestamp!)}` : 'Chargement...'}
      onRefresh={refetch}
      isLoading={isLoading}
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton height="h-20" />
          <Skeleton height="h-10" />
        </div>
      ) : data && (
        <div className="bg-background-dark rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xl">
              {(data as RegimeData).country}: {/* Afficher le code pays reçu de l'API */}
            </h4>
            <div className="flex items-center">
              <span className="mr-2 text-xl font-bold">
                {(data as RegimeData).regime}
              </span>
              <StatusIndicator 
                status={(data as RegimeData).regime || 'UNKNOWN'} 
              />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {/* Indice de confiance */}
            <div>
              <p className="text-sm text-gray-400">
                Indice de confiance: <span className="font-medium text-white">{((data as RegimeData).confidence! * 100).toFixed(0)}%</span>
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(data as RegimeData).confidence! * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Indicateurs détaillés */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Croissance</div>
                <div className="text-sm font-medium text-green-400">2.5%</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Inflation</div>
                <div className="text-sm font-medium text-yellow-400">2.8%</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Chômage</div>
                <div className="text-sm font-medium text-red-400">7.5%</div>
              </div>
            </div>

            {/* Description du régime */}
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-300">
                <strong>Description :</strong> {(data as RegimeData).regime === 'EXPANSION' ? 'Croissance économique forte avec inflation modérée. Conditions optimales pour les actifs risqués.' :
                  (data as RegimeData).regime === 'RECOVERY' ? 'Amélioration économique progressive après récession. Signaux mixtes.' :
                  (data as RegimeData).regime === 'STAGFLATION' ? 'Inflation élevée combinée à une croissance stagnante. Environnement difficile.' :
                  'Contraction économique avec déclin de l\'activité. Environnement défensif.'}
              </div>
            </div>

            {/* Informations de débogage */}
            <div className="mt-2 text-xs text-gray-500">
              Debug: Pays={selectedCountry}, API={(data as RegimeData).country}, Régime={(data as RegimeData).regime}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RegimeCard;
