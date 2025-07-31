import React from 'react';
import { motion } from 'framer-motion';
import { RegimeData, REGIME_CHARACTERISTICS, RegimeType } from '@/lib/types/regime.types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RegimeIndicatorProps {
  data: RegimeData;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

const RegimeIndicator: React.FC<RegimeIndicatorProps> = ({
  data,
  showDetails = true,
  compact = false,
  className = '',
}) => {
  const characteristics = REGIME_CHARACTERISTICS[data.regime];

  // Progress bar component
  const ProgressBar = ({ label, value, color, unit = '%' }: {
    label: string;
    value: number;
    color: string;
    unit?: string;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-semibold">
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="w-full bg-background-tertiary rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(value) * 10, 100)}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );

  // Confidence gauge
  const ConfidenceGauge = ({ confidence }: { confidence: number }) => {
    const radius = 45;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (confidence / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={characteristics.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, delay: 0.5 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-text-primary">
            {confidence}%
          </span>
        </div>
      </div>
    );
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center space-x-3 bg-background-secondary rounded-lg p-3 border border-background-tertiary ${className}`}
      >
        <div className="text-2xl">{characteristics.icon}</div>
        <div className="flex-1">
          <h4 className={`font-bold ${characteristics.textColor}`}>
            {characteristics.name}
          </h4>
          <p className="text-sm text-text-secondary">
            Confiance: {data.confidence}%
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${characteristics.bgColor} ${characteristics.textColor}`}>
          {characteristics.riskLevel}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-background-secondary rounded-xl p-6 border border-background-tertiary ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{characteristics.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">
              Régime Économique
            </h3>
            <p className="text-sm text-text-secondary">
              Mis à jour: {formatDistanceToNow(data.lastUpdated, { 
                addSuffix: true, 
                locale: fr 
              })}
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${characteristics.bgColor} ${characteristics.textColor}`}>
          {characteristics.riskLevel}
        </div>
      </div>

      {/* Current Regime */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-2xl font-bold ${characteristics.textColor}`}>
            {characteristics.name.toUpperCase()}
          </h4>
          <ConfidenceGauge confidence={data.confidence} />
        </div>
        <p className="text-text-secondary text-sm mb-4">
          {characteristics.description}
        </p>
      </div>

      {showDetails && (
        <>
          {/* Economic Indicators */}
          <div className="space-y-4 mb-6">
            <h5 className="text-lg font-semibold text-text-primary">
              Indicateurs Économiques
            </h5>
            
            <ProgressBar
              label="Croissance"
              value={data.growthScore}
              color="#00ff88"
            />
            
            <ProgressBar
              label="Inflation"
              value={data.inflationScore}
              color="#ffa502"
            />
            
            {data.unemploymentScore && (
              <ProgressBar
                label="Chômage"
                value={data.unemploymentScore}
                color="#ff4757"
              />
            )}
          </div>

          {/* Optimal Sectors */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-text-primary mb-3">
              Secteurs Favorisés
            </h5>
            <div className="flex flex-wrap gap-2">
              {characteristics.optimalSectors.map((sector, index) => (
                <motion.span
                  key={sector}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${characteristics.bgColor} ${characteristics.textColor} border`}
                  style={{ borderColor: characteristics.color }}
                >
                  {sector}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-background-tertiary">
            <div>
              <p className="text-sm text-text-secondary">Pays</p>
              <p className="font-semibold text-text-primary">{data.country}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Détecté le</p>
              <p className="font-semibold text-text-primary">
                {new Date(data.detectedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default RegimeIndicator;

