import React from 'react';
import { motion } from 'framer-motion';

interface RegimeEvent {
  date: string;
  regime: string;
  confidence: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface RegimeTimelineProps {
  days?: number;
  events?: RegimeEvent[];
}

const mockEvents: RegimeEvent[] = [
  {
    date: '2025-01-15',
    regime: 'EXPANSION',
    confidence: 85,
    description: 'Croissance économique soutenue, inflation maîtrisée',
    impact: 'positive'
  },
  {
    date: '2025-01-10',
    regime: 'RECOVERY',
    confidence: 72,
    description: 'Reprise post-récession, taux d\'intérêt en baisse',
    impact: 'positive'
  },
  {
    date: '2025-01-05',
    regime: 'STAGFLATION',
    confidence: 45,
    description: 'Inflation élevée, croissance faible',
    impact: 'negative'
  },
  {
    date: '2024-12-28',
    regime: 'RECESSION',
    confidence: 78,
    description: 'Contraction économique, chômage en hausse',
    impact: 'negative'
  },
  {
    date: '2024-12-20',
    regime: 'EXPANSION',
    confidence: 82,
    description: 'Période de croissance stable',
    impact: 'positive'
  }
];

export const RegimeTimeline: React.FC<RegimeTimelineProps> = ({ days = 30, events = mockEvents }) => {
  const getRegimeColor = (regime: string) => {
    switch (regime.toUpperCase()) {
      case 'EXPANSION': return 'bg-regime-expansion';
      case 'RECOVERY': return 'bg-regime-recovery';
      case 'STAGFLATION': return 'bg-regime-stagflation';
      case 'RECESSION': return 'bg-regime-recession';
      default: return 'bg-text-secondary';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return '↗️';
      case 'negative': return '↘️';
      case 'neutral': return '→';
      default: return '→';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      case 'neutral': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background-card border border-border rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Timeline des régimes
        </h3>
        <p className="text-text-secondary text-sm">
          Évolution des régimes économiques sur les {days} derniers jours
        </p>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Ligne de temps verticale */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Point sur la timeline */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full ${getRegimeColor(event.regime)} border-2 border-background-card`}></div>
                </div>

                {/* Contenu de l'événement */}
                <div className="flex-1 bg-background-secondary rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-semibold px-2 py-1 rounded ${getRegimeColor(event.regime)} text-white`}>
                        {event.regime}
                      </span>
                      <span className="text-text-secondary text-sm">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${getImpactColor(event.impact)}`}>
                        {getImpactIcon(event.impact)}
                      </span>
                      <span className="text-text-primary font-semibold">
                        {event.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-text-primary text-sm leading-relaxed">
                    {event.description}
                  </p>
                  
                  {/* Barre de confiance */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                      <span>Confiance</span>
                      <span>{event.confidence}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${event.confidence}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className={`h-2 rounded-full ${getRegimeColor(event.regime)}`}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="p-4 bg-background-secondary border-t border-border">
        <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-regime-expansion"></div>
            <span className="text-text-secondary">Expansion</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-regime-recovery"></div>
            <span className="text-text-secondary">Recovery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-regime-stagflation"></div>
            <span className="text-text-secondary">Stagflation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-regime-recession"></div>
            <span className="text-text-secondary">Récession</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 