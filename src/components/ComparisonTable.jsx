import React from 'react';
import { TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getComparisonData } from '../data/mockData';

const ComparisonTable = ({ selectedCountries, activeTab = 'performance', filters = {} }) => {
  if (!selectedCountries || selectedCountries.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">Aucun pays sélectionné</p>
            <p className="text-sm">Sélectionnez des pays pour voir le tableau comparatif</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  let comparisonData;
  try {
    comparisonData = getComparisonData(selectedCountries);
    if (!comparisonData || comparisonData.length === 0) {
      throw new Error('Données de comparaison vides');
    }
    
    // Appliquer les filtres
    if (filters.minReturn && filters.minReturn[0] > 0) {
      comparisonData = comparisonData.filter(country => 
        country.performance.annualizedReturn >= filters.minReturn[0]
      );
    }
    
    if (filters.maxRisk && filters.maxRisk[0] < 100) {
      comparisonData = comparisonData.filter(country => 
        country.performance.volatility <= filters.maxRisk[0]
      );
    }
    
    if (filters.showPositiveOnly) {
      comparisonData = comparisonData.filter(country => 
        country.performance.cumulativeReturn > 0
      );
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p className="text-sm">Erreur lors du chargement des données</p>
            <p className="text-xs mt-2">Veuillez actualiser la page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value, type = 'number', suffix = '') => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'percentage':
        return `${value.toFixed(2)}%${suffix}`;
      case 'currency':
        return `${value.toFixed(2)}${suffix}`;
      case 'ratio':
        return value.toFixed(3);
      default:
        return `${value.toFixed(2)}${suffix}`;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getBadgeVariant = (value, thresholds) => {
    if (value >= thresholds.good) return 'default';
    if (value >= thresholds.medium) return 'secondary';
    return 'destructive';
  };

  const exportToCSV = () => {
    // Logique d'export CSV à implémenter
    console.log('Export CSV déclenché');
  };

  const renderPerformanceTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Indicateur</th>
            {comparisonData.map(({ code, country }) => (
              <th key={code} className="text-center p-4 font-medium min-w-[120px]">
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Rendement Cumulé</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(performance.cumulativeReturn, { good: 10, medium: 5 })}>
                  {formatValue(performance.cumulativeReturn, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Rendement Annualisé</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(performance.annualizedReturn, { good: 8, medium: 5 })}>
                  {formatValue(performance.annualizedReturn, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Volatilité</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(20 - performance.volatility, { good: 5, medium: 2 })}>
                  {formatValue(performance.volatility, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Ratio de Sharpe</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(performance.sharpeRatio, { good: 0.8, medium: 0.5 })}>
                  {formatValue(performance.sharpeRatio, 'ratio')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Drawdown Maximum</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(-performance.maxDrawdown, { good: 10, medium: 5 })}>
                  {formatValue(performance.maxDrawdown, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">VaR 95%</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(-performance.var95, { good: 5, medium: 3 })}>
                  {formatValue(performance.var95, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Bêta</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                {formatValue(performance.beta, 'ratio')}
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Alpha</td>
            {comparisonData.map(({ code, performance }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(performance.alpha, { good: 1.5, medium: 0.5 })}>
                  {formatValue(performance.alpha, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderAllocationTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Allocation</th>
            {comparisonData.map(({ code, country }) => (
              <th key={code} className="text-center p-4 font-medium min-w-[120px]">
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Actions</td>
            {comparisonData.map(({ code, allocation }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant="default">
                  {formatValue(allocation.stocks, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Obligations</td>
            {comparisonData.map(({ code, allocation }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant="secondary">
                  {formatValue(allocation.bonds, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Matières Premières</td>
            {comparisonData.map(({ code, allocation }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant="outline">
                  {formatValue(allocation.commodities, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Liquidités</td>
            {comparisonData.map(({ code, allocation }) => (
              <td key={code} className="p-4 text-center">
                {formatValue(allocation.cash, 'percentage')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderIndicatorsTable = () => (
    <div className="space-y-6">
      {/* Indicateurs Physiques */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Indicateurs Physiques</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Indicateur</th>
                {comparisonData.map(({ code, country }) => (
                  <th key={code} className="text-center p-4 font-medium min-w-[120px]">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">Électricité</td>
                {comparisonData.map(({ code, physicalIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant={getBadgeVariant(physicalIndicators.electricity.value, { good: 80, medium: 60 })}>
                        {physicalIndicators.electricity.value}
                      </Badge>
                      {getTrendIcon(physicalIndicators.electricity.trend)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">PMI</td>
                {comparisonData.map(({ code, physicalIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant={getBadgeVariant(physicalIndicators.pmi.value, { good: 50, medium: 45 })}>
                        {formatValue(physicalIndicators.pmi.value, 'number')}
                      </Badge>
                      {getTrendIcon(physicalIndicators.pmi.trend)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">Maritime</td>
                {comparisonData.map(({ code, physicalIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant={getBadgeVariant(physicalIndicators.maritime.value, { good: 75, medium: 60 })}>
                        {physicalIndicators.maritime.value}
                      </Badge>
                      {getTrendIcon(physicalIndicators.maritime.trend)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">Énergie</td>
                {comparisonData.map(({ code, physicalIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant={getBadgeVariant(physicalIndicators.energy.value, { good: 80, medium: 65 })}>
                        {physicalIndicators.energy.value}
                      </Badge>
                      {getTrendIcon(physicalIndicators.energy.trend)}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Indicateurs Financiers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Indicateurs Financiers</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Indicateur</th>
                {comparisonData.map(({ code, country }) => (
                  <th key={code} className="text-center p-4 font-medium min-w-[120px]">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">Rendements</td>
                {comparisonData.map(({ code, financialIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="default">
                        {formatValue(financialIndicators.yields.value, 'percentage')}
                      </Badge>
                      {getTrendIcon(financialIndicators.yields.trend)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">Spreads</td>
                {comparisonData.map(({ code, financialIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="secondary">
                        {formatValue(financialIndicators.spreads.value, 'percentage')}
                      </Badge>
                      {getTrendIcon(financialIndicators.spreads.trend)}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">Volatilité</td>
                {comparisonData.map(({ code, financialIndicators }) => (
                  <td key={code} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="outline">
                        {formatValue(financialIndicators.volatility.value, 'percentage')}
                      </Badge>
                      {getTrendIcon(financialIndicators.volatility.trend)}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBacktestingTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Métrique</th>
            {comparisonData.map(({ code, country }) => (
              <th key={code} className="text-center p-4 font-medium min-w-[120px]">
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Rendement Total</td>
            {comparisonData.map(({ code, backtesting }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(backtesting.totalReturn, { good: 140, medium: 120 })}>
                  {formatValue(backtesting.totalReturn, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Taux de Gain</td>
            {comparisonData.map(({ code, backtesting }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(backtesting.winRate, { good: 65, medium: 55 })}>
                  {formatValue(backtesting.winRate, 'percentage')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Facteur de Profit</td>
            {comparisonData.map(({ code, backtesting }) => (
              <td key={code} className="p-4 text-center">
                <Badge variant={getBadgeVariant(backtesting.profitFactor, { good: 1.5, medium: 1.2 })}>
                  {formatValue(backtesting.profitFactor, 'ratio')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Transactions</td>
            {comparisonData.map(({ code, backtesting }) => (
              <td key={code} className="p-4 text-center">
                {backtesting.transactions}
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Frais</td>
            {comparisonData.map(({ code, backtesting }) => (
              <td key={code} className="p-4 text-center">
                {formatValue(backtesting.fees, 'percentage')}
              </td>
            ))}
          </tr>
          <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium">Turnover</td>
            {comparisonData.map(({ code, backtesting }) => (
              <td key={code} className="p-4 text-center">
                {formatValue(backtesting.turnover, 'percentage')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return renderPerformanceTable();
      case 'allocation':
        return renderAllocationTable();
      case 'indicators':
        return renderIndicatorsTable();
      case 'backtesting':
        return renderBacktestingTable();
      default:
        return renderPerformanceTable();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Comparaison Multi-Pays</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Exporter CSV</span>
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;

