import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SectorAllocation {
  sector: string;
  allocation: number;
  confidence: number;
  weight: number;
}

interface AllocationChartProps {
  allocations?: SectorAllocation[];
  regime?: string;
}

const COLORS = [
  '#00d4ff', // primary blue
  '#00ff88', // success green
  '#ffa502', // warning orange
  '#ff4757', // error red
  '#9c88ff', // purple
  '#00d4ff', // cyan
  '#ff6b6b', // light red
  '#84CC16', // lime
];

const SECTOR_NAMES: { [key: string]: string } = {
  TECHNOLOGY: 'Technologie',
  FINANCE: 'Finance',
  ENERGY: 'Énergie',
  CONSUMER: 'Consommation',
  HEALTHCARE: 'Santé',
  INDUSTRIALS: 'Industriels',
  MATERIALS: 'Matériaux',
  UTILITIES: 'Services publics'
};

export const AllocationChart: React.FC<AllocationChartProps> = ({ allocations, regime }) => {
  if (!allocations || allocations.length === 0) {
    return (
      <div className="bg-background-card border border-border rounded-lg shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-border rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-border rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = allocations.map((allocation, index) => ({
    name: SECTOR_NAMES[allocation.sector] || allocation.sector,
    value: allocation.allocation,
    color: COLORS[index % COLORS.length],
    sector: allocation.sector,
    confidence: allocation.confidence
  }));

  const totalAllocation = allocations.reduce((sum, a) => sum + a.allocation, 0);
  const riskScore = allocations.reduce((sum, a) => sum + (a.weight * (1 - a.confidence)), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background-card p-3 border border-border rounded-lg shadow-card">
          <p className="font-medium text-text-primary">{data.name}</p>
          <p className="text-text-secondary">{data.value.toFixed(1)}%</p>
          <p className="text-xs text-text-secondary">
            Confiance: {Math.round(data.confidence * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background-card border border-border rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Allocation Sectorielle</h2>
        {regime && (
          <span className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-md border border-primary border-opacity-30">
            Régime: {regime}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique */}
        <div className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistiques */}
        <div className="space-y-4">
          <div className="bg-background-secondary rounded-lg p-4 border border-border">
            <h3 className="text-sm font-medium text-text-primary mb-2">Métriques</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">Total</span>
                <span className="text-sm font-medium text-text-primary">
                  {totalAllocation.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">Risque</span>
                <span className="text-sm font-medium text-text-primary">
                  {riskScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">Secteurs</span>
                <span className="text-sm font-medium text-text-primary">
                  {allocations.length}
                </span>
              </div>
            </div>
          </div>

          {/* Top 3 secteurs */}
          <div className="bg-background-secondary rounded-lg p-4 border border-border">
            <h3 className="text-sm font-medium text-text-primary mb-2">Top 3</h3>
            <div className="space-y-2">
              {allocations
                .sort((a, b) => b.allocation - a.allocation)
                .slice(0, 3)
                .map((allocation, index) => (
                  <div key={allocation.sector} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs text-text-secondary">
                        {SECTOR_NAMES[allocation.sector]}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      {allocation.allocation.toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Légende détaillée */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">Détail par secteur</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allocations.map((allocation, index) => (
            <div key={allocation.sector} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-text-primary truncate">
                  {SECTOR_NAMES[allocation.sector]}
                </div>
                <div className="text-xs text-text-secondary">
                  {allocation.allocation.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 