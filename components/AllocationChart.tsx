import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SectorAllocation, SECTOR_NAMES, SECTOR_COLORS } from '@/lib/types/sector.types';

interface AllocationChartProps {
  allocations: SectorAllocation[];
  showLegend?: boolean;
  showTooltip?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  sector: string;
  performance: number;
  confidence: number;
}

const AllocationChart: React.FC<AllocationChartProps> = ({
  allocations,
  showLegend = true,
  showTooltip = true,
  size = 'medium',
  className = '',
}) => {
  // Transform data for chart
  const chartData: ChartData[] = allocations.map((allocation) => ({
    name: SECTOR_NAMES[allocation.sector],
    value: allocation.allocation,
    color: SECTOR_COLORS[allocation.sector],
    sector: allocation.sector,
    performance: allocation.performance,
    confidence: allocation.confidence,
  }));

  // Calculate total allocation and risk score
  const totalAllocation = allocations.reduce((sum, item) => sum + item.allocation, 0);
  const averageRiskScore = allocations.reduce((sum, item) => sum + item.riskScore, 0) / allocations.length;

  // Size configurations
  const sizeConfig = {
    small: { width: 200, height: 200, innerRadius: 40, outerRadius: 80 },
    medium: { width: 300, height: 300, innerRadius: 60, outerRadius: 120 },
    large: { width: 400, height: 400, innerRadius: 80, outerRadius: 160 },
  };

  const config = sizeConfig[size];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background-secondary border border-background-tertiary rounded-lg p-3 shadow-oracle"
        >
          <p className="text-text-primary font-semibold">{data.name}</p>
          <p className="text-primary-400">
            Allocation: <span className="font-bold">{data.value.toFixed(1)}%</span>
          </p>
          <p className="text-green-400">
            Performance: <span className="font-bold">{data.performance >= 0 ? '+' : ''}{data.performance.toFixed(2)}%</span>
          </p>
          <p className="text-text-secondary">
            Confiance: <span className="font-bold">{data.confidence}%</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  // Custom label
  const renderLabel = (entry: any) => {
    if (entry.value < 5) return ''; // Don't show labels for small slices
    return `${entry.value.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-background-secondary rounded-xl p-6 border border-background-tertiary ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-text-primary">
          📊 Allocation Sectorielle
        </h3>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Total</p>
          <p className="text-lg font-bold text-primary-400">{totalAllocation.toFixed(1)}%</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex flex-col items-center">
        <ResponsiveContainer width={config.width} height={config.height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={config.outerRadius}
              innerRadius={config.innerRadius}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px',
                  color: '#a0a0a0'
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-background-tertiary rounded-lg p-3 text-center"
          >
            <p className="text-sm text-text-secondary">Score de Risque</p>
            <p className={`text-lg font-bold ${
              averageRiskScore < 30 ? 'text-green-400' :
              averageRiskScore < 70 ? 'text-warning' : 'text-error'
            }`}>
              {averageRiskScore.toFixed(0)}/100
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-background-tertiary rounded-lg p-3 text-center"
          >
            <p className="text-sm text-text-secondary">Secteurs</p>
            <p className="text-lg font-bold text-primary-400">
              {allocations.length}
            </p>
          </motion.div>
        </div>

        {/* Performance Summary */}
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Performance Moyenne:</span>
            <span className={`font-bold ${
              allocations.reduce((sum, item) => sum + item.performance, 0) / allocations.length >= 0 
                ? 'text-success' : 'text-error'
            }`}>
              {allocations.reduce((sum, item) => sum + item.performance, 0) / allocations.length >= 0 ? '+' : ''}
              {(allocations.reduce((sum, item) => sum + item.performance, 0) / allocations.length).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AllocationChart;

