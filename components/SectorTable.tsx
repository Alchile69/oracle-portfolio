import React from 'react';
import { motion } from 'framer-motion';
import { SectorAllocation, SECTOR_NAMES, SECTOR_CHARACTERISTICS } from '@/lib/types/sector.types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SectorTableProps {
  allocations: SectorAllocation[];
  showPerformance?: boolean;
  showTrend?: boolean;
  showRisk?: boolean;
  compact?: boolean;
  className?: string;
}

const SectorTable: React.FC<SectorTableProps> = ({
  allocations,
  showPerformance = true,
  showTrend = true,
  showRisk = true,
  compact = false,
  className = '',
}) => {
  // Sort allocations by allocation percentage (descending)
  const sortedAllocations = [...allocations].sort((a, b) => b.allocation - a.allocation);

  // Trend icon component
  const TrendIcon = ({ trend }: { trend: 'UP' | 'DOWN' | 'STABLE' }) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'DOWN':
        return <TrendingDown className="w-4 h-4 text-error" />;
      case 'STABLE':
        return <Minus className="w-4 h-4 text-text-secondary" />;
    }
  };

  // Risk level badge
  const RiskBadge = ({ riskScore }: { riskScore: number }) => {
    const getRiskLevel = (score: number) => {
      if (score < 30) return { level: 'FAIBLE', color: 'text-success bg-green-500/10' };
      if (score < 70) return { level: 'MOYEN', color: 'text-warning bg-orange-500/10' };
      return { level: 'ÉLEVÉ', color: 'text-error bg-red-500/10' };
    };

    const risk = getRiskLevel(riskScore);
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.color}`}>
        {risk.level}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-background-secondary rounded-xl border border-background-tertiary overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-background-tertiary">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-text-primary">
            📈 Allocation par Secteur
          </h3>
          <div className="text-sm text-text-secondary">
            {sortedAllocations.length} secteurs
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-tertiary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Secteur
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Allocation
              </th>
              {showPerformance && (
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Performance
                </th>
              )}
              {showTrend && (
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Tendance
                </th>
              )}
              {showRisk && (
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Risque
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Confiance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-tertiary">
            {sortedAllocations.map((allocation, index) => {
              const characteristics = SECTOR_CHARACTERISTICS[allocation.sector];
              
              return (
                <motion.tr
                  key={allocation.sector}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-background-tertiary/50 transition-colors"
                >
                  {/* Sector Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{characteristics.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {SECTOR_NAMES[allocation.sector]}
                        </div>
                        {!compact && (
                          <div className="text-xs text-text-secondary">
                            {characteristics.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Allocation */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-text-primary">
                      {allocation.allocation.toFixed(1)}%
                    </div>
                    {!compact && (
                      <div className="w-full bg-background-tertiary rounded-full h-1 mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${allocation.allocation}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-1 rounded-full"
                          style={{ backgroundColor: characteristics.color }}
                        />
                      </div>
                    )}
                  </td>

                  {/* Performance */}
                  {showPerformance && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${
                        allocation.performance >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {allocation.performance >= 0 ? '+' : ''}
                        {allocation.performance.toFixed(2)}%
                      </span>
                    </td>
                  )}

                  {/* Trend */}
                  {showTrend && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <TrendIcon trend={allocation.trend} />
                    </td>
                  )}

                  {/* Risk */}
                  {showRisk && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <RiskBadge riskScore={allocation.riskScore} />
                    </td>
                  )}

                  {/* Confidence */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm text-text-secondary">
                        {allocation.confidence}%
                      </span>
                      <div className="w-12 bg-background-tertiary rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${allocation.confidence}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-2 rounded-full bg-primary-400"
                        />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="px-6 py-4 bg-background-tertiary/30 border-t border-background-tertiary">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary">
            Total allocation: {sortedAllocations.reduce((sum, item) => sum + item.allocation, 0).toFixed(1)}%
          </span>
          <span className="text-text-secondary">
            Performance moyenne: 
            <span className={`ml-1 font-semibold ${
              sortedAllocations.reduce((sum, item) => sum + item.performance, 0) / sortedAllocations.length >= 0 
                ? 'text-success' : 'text-error'
            }`}>
              {sortedAllocations.reduce((sum, item) => sum + item.performance, 0) / sortedAllocations.length >= 0 ? '+' : ''}
              {(sortedAllocations.reduce((sum, item) => sum + item.performance, 0) / sortedAllocations.length).toFixed(2)}%
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SectorTable;

