import React from 'react';

interface SectorAllocation {
  sector: string;
  allocation: number;
  performance: number;
}

interface SectorTableProps {
  allocations: SectorAllocation[];
}

export const SectorTable: React.FC<SectorTableProps> = ({ allocations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Secteur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Allocation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allocations.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.sector}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.allocation}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.performance}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

