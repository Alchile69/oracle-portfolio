import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown, BarChart3, Target, Clock, DollarSign } from 'lucide-react';

interface BacktestingData {
  oraclePortfolio: {
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  benchmark: {
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  period: string;
  totalMonths: number;
}

interface BacktestingCardProps {
  data?: BacktestingData;
  isLoading?: boolean;
  error?: string | null;
}

const BacktestingCard: React.FC<BacktestingCardProps> = ({ 
  data, 
  isLoading = false, 
  error = null 
}) => {
  if (isLoading) {
    return (
      <Card 
        title="Backtesting Engine" 
        className="bg-gray-800 border-gray-700"
        isLoading={true}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        title="Backtesting Engine" 
        className="bg-gray-800 border-gray-700"
      >
        <div className="text-red-400 text-sm">
          Erreur de chargement des données de backtesting
        </div>
      </Card>
    );
  }

  // Données par défaut si aucune donnée n'est fournie
  const defaultData: BacktestingData = {
    oraclePortfolio: {
      annualizedReturn: 1.13,
      sharpeRatio: -0.17,
      maxDrawdown: 7.12,
      winRate: 48.33
    },
    benchmark: {
      annualizedReturn: 1.61,
      sharpeRatio: 0.83,
      maxDrawdown: 11.2
    },
    period: "2020-2024",
    totalMonths: 60
  };

  const backtestingData = data || defaultData;

  const isOracleOutperforming = backtestingData.oraclePortfolio.annualizedReturn > backtestingData.benchmark.annualizedReturn;

  return (
    <Card 
      title="Backtesting Engine"
      subtitle={`${backtestingData.period} (${backtestingData.totalMonths} mois)`}
      className="bg-gray-800 border-gray-700"
    >
      <div className="space-y-4">
        {/* Performance Oracle Portfolio vs Benchmark */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Oracle Portfolio</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rendement annuel:</span>
                <span className={`font-medium ${isOracleOutperforming ? 'text-green-400' : 'text-red-400'}`}>
                  {backtestingData.oraclePortfolio.annualizedReturn.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sharpe Ratio:</span>
                <span className={`font-medium ${backtestingData.oraclePortfolio.sharpeRatio > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {backtestingData.oraclePortfolio.sharpeRatio.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max Drawdown:</span>
                <span className="font-medium text-red-400">
                  -{backtestingData.oraclePortfolio.maxDrawdown.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Win Rate:</span>
                <span className="font-medium text-blue-400">
                  {backtestingData.oraclePortfolio.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Benchmark 60/40</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rendement annuel:</span>
                <span className="font-medium text-gray-300">
                  {backtestingData.benchmark.annualizedReturn.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sharpe Ratio:</span>
                <span className="font-medium text-gray-300">
                  {backtestingData.benchmark.sharpeRatio.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max Drawdown:</span>
                <span className="font-medium text-red-400">
                  -{backtestingData.benchmark.maxDrawdown.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateurs de performance */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {isOracleOutperforming ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className="text-xs text-gray-400">Performance</span>
            </div>
            <div className={`text-lg font-bold ${isOracleOutperforming ? 'text-green-400' : 'text-red-400'}`}>
              {isOracleOutperforming ? 'Surperforme' : 'Sous-performe'}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Information Ratio</span>
            </div>
            <div className="text-lg font-bold text-blue-400">
              {(backtestingData.oraclePortfolio.annualizedReturn - backtestingData.benchmark.annualizedReturn).toFixed(2)}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Durée</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">
              {backtestingData.totalMonths} mois
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-300">
            <strong>Résumé :</strong> Le portefeuille Oracle a généré un rendement annualisé de{' '}
            <span className={isOracleOutperforming ? 'text-green-400' : 'text-red-400'}>
              {backtestingData.oraclePortfolio.annualizedReturn.toFixed(2)}%
            </span>
            {' '}sur {backtestingData.totalMonths} mois, avec un taux de réussite de{' '}
            <span className="text-blue-400">{backtestingData.oraclePortfolio.winRate.toFixed(1)}%</span>
            {' '}et un drawdown maximum de{' '}
            <span className="text-red-400">{backtestingData.oraclePortfolio.maxDrawdown.toFixed(2)}%</span>.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BacktestingCard; 