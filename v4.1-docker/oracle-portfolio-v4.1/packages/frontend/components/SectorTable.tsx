import React from 'react';
import { motion } from 'framer-motion';

interface Sector {
  name: string;
  allocation: number;
  performance: number;
  risk: 'low' | 'medium' | 'high';
  color: string;
}

interface SectorTableProps {
  allocations?: Sector[];
  regime?: string;
}

const mockSectors: Sector[] = [
  { name: 'Technologie', allocation: 25, performance: 12.5, risk: 'medium', color: '#00d4ff' },
  { name: 'Finance', allocation: 20, performance: 8.2, risk: 'low', color: '#00ff88' },
  { name: 'Énergie', allocation: 15, performance: -2.1, risk: 'high', color: '#ffa502' },
  { name: 'Consommation', allocation: 18, performance: 5.8, risk: 'medium', color: '#ff4757' },
  { name: 'Santé', allocation: 12, performance: 9.3, risk: 'low', color: '#9c88ff' },
  { name: 'Industriels', allocation: 10, performance: 3.2, risk: 'medium', color: '#00d4ff' },
];

export const SectorTable: React.FC<SectorTableProps> = ({ allocations = mockSectors, regime }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyen';
      case 'high': return 'Élevé';
      default: return 'N/A';
    }
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
          Table des secteurs
        </h3>
        <p className="text-text-secondary text-sm">
          Allocation recommandée basée sur le régime {regime || 'actuel'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-text-secondary font-medium text-sm">
                Secteur
              </th>
              <th className="text-right p-4 text-text-secondary font-medium text-sm">
                Allocation
              </th>
              <th className="text-right p-4 text-text-secondary font-medium text-sm">
                Performance
              </th>
              <th className="text-right p-4 text-text-secondary font-medium text-sm">
                Risque
              </th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((sector, index) => (
              <motion.tr
                key={sector.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-background-secondary transition-colors duration-200"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="text-text-primary font-medium">
                      {sector.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="text-text-primary font-semibold">
                    {sector.allocation}%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className={`font-semibold ${
                    sector.performance >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-sm font-medium ${getRiskColor(sector.risk)}`}>
                    {getRiskLabel(sector.risk)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-background-secondary border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">
            Total allocation: {allocations.reduce((sum, sector) => sum + sector.allocation, 0)}%
          </span>
          <span className="text-text-secondary">
            Performance moyenne: {(
              allocations.reduce((sum, sector) => sum + sector.performance, 0) / allocations.length
            ).toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}; 