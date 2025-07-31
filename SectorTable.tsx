import React from 'react';

interface SectorAllocation {
  sector: string;
  allocation: number;
  performance: number;
  confidence?: number;
}

interface SectorTableProps {
  allocations: SectorAllocation[];
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

export const SectorTable: React.FC<SectorTableProps> = ({ allocations }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Allocation Sectorielle
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Répartition par secteur d'activité
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confiance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 bg-blue-${(index % 3 + 4) * 100}`}></div>
                    <div className="text-sm font-medium text-gray-900">
                      {SECTOR_NAMES[item.sector] || item.sector}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">
                    {item.allocation.toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(item.allocation, 100)}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.performance >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.performance >= 0 ? '+' : ''}{item.performance.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.confidence ? (
                    <div className="flex items-center">
                      <div className="text-sm font-medium">
                        {Math.round(item.confidence * 100)}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${item.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {allocations.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-500 text-sm">
            Aucune donnée sectorielle disponible
          </div>
        </div>
      )}
    </div>
  );
};

