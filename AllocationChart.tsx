import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SectorAllocation {
  sector: string;
  allocation: number;
  performance: number;
  confidence?: number;
}

interface AllocationChartProps {
  allocations: SectorAllocation[];
  regime?: string;
}

const SECTOR_NAMES: Record<string, string> = {
  technology: 'Technologie',
  healthcare: 'Santé',
  finance: 'Finance', 
  energy: 'Énergie',
  consumer: 'Consommation',
  industrial: 'Industriel',
  materials: 'Matériaux',
  utilities: 'Services'
};

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16'  // lime
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">
          {SECTOR_NAMES[data.sector] || data.sector}
        </p>
        <p className="text-sm text-gray-600">
          Allocation: <span className="font-semibold">{data.allocation.toFixed(1)}%</span>
        </p>
        <p className="text-sm text-gray-600">
          Performance: <span className={`font-semibold ${data.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.performance >= 0 ? '+' : ''}{data.performance.toFixed(1)}%
          </span>
        </p>
        {data.confidence && (
          <p className="text-sm text-gray-600">
            Confiance: <span className="font-semibold">{Math.round(data.confidence * 100)}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const AllocationChart: React.FC<AllocationChartProps> = ({ allocations, regime }) => {
  if (!allocations || allocations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition Sectorielle
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  const chartData = allocations.map((allocation, index) => ({
    ...allocation,
    name: SECTOR_NAMES[allocation.sector] || allocation.sector,
    color: COLORS[index % COLORS.length]
  }));

  const totalAllocation = allocations.reduce((sum, a) => sum + a.allocation, 0);
  const riskScore = allocations.reduce((sum, a) => sum + (a.allocation * (1 - (a.confidence || 0.8))), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Répartition Sectorielle
          </h3>
          {regime && (
            <p className="text-sm text-gray-600 mt-1">
              Régime: <span className="font-medium">{regime}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique */}
        <div className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="allocation"
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

        {/* Statistiques */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Métriques</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Total:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalAllocation.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Risque:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {(riskScore * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Top Secteurs</h4>
            {chartData
              .sort((a, b) => b.allocation - a.allocation)
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {item.allocation.toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

