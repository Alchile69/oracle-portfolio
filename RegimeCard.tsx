import React, { useEffect } from 'react';
import { useCountryContext } from '../../hooks/CountryContext';
import { useRegime } from '../../hooks/useRegime';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import StatusIndicator from '../ui/StatusIndicator';
import { formatDateTime } from '../../utils/formatters';

const RegimeCard: React.FC = () => {
  const { selectedCountry } = useCountryContext();
  const { data, isLoading, error, refetch } = useRegime(selectedCountry);
  
  // Ajout de logs pour le débogage
  useEffect(() => {
    console.log('RegimeCard - selectedCountry:', selectedCountry);
    console.log('RegimeCard - data from useRegime:', data);
    console.log('RegimeCard - isLoading:', isLoading);
    console.log('RegimeCard - error:', error);
  }, [selectedCountry, data, isLoading, error]);

  if (error) {
    return (
      <Card
        title="Régime Économique"
        onRefresh={refetch}
        isLoading={isLoading}
      >
        <div className="text-secondary-500 text-center py-4">
          Impossible de charger les données de régime. Veuillez réessayer.
        </div>
      </Card>
    );
  }
  
  return (
    <Card
      title="Régime Économique"
      subtitle={data ? `Mis à jour: ${formatDateTime(data.timestamp)}` : 'Chargement...'}
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
              {data.country}: {/* Afficher le code pays reçu de l'API */}
            </h4>
            <div className="flex items-center">
              <span className="mr-2 text-xl font-bold">
                {data.regime}
              </span>
              <StatusIndicator 
                status={data.regime} 
                size="lg"
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm">
              Indice de confiance: <span className="font-medium">{(data.confidence * 100).toFixed(0)}%</span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${data.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RegimeCard;


