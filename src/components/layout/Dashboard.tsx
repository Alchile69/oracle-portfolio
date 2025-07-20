// Dashboard.tsx — version corrigée complète
import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import { useCountryContext } from '../../hooks/CountryContext';
import AllocationsCard from '../widgets/AllocationsCard';
import ETFPricesCard from '../widgets/ETFPricesCard';
import RegimeCard from '../ui/RegimeCard';
import BacktestingCard from '../BacktestingCard';

// Limites dynamiques
const MIN_DATE = dayjs('2020-01-01');
const MAX_DATE = dayjs();

// Utilitaire pour parser intelligemment une date
function parseSmartDate(input: string | Dayjs | Date | null | undefined): Dayjs {
  if (!input) return MAX_DATE;
  if (dayjs.isDayjs(input)) return input;
  if (input instanceof Date) return dayjs(input);
  if (typeof input === 'string') {
    const lower = input.trim().toLowerCase();
    if (lower === 'today' || lower === "aujourd'hui") return MAX_DATE;
    const parsed = dayjs(input);
    if (parsed.isValid()) return parsed;
  }
  return MAX_DATE;
}

// Clamp une date entre les bornes
function clampDate(date: Dayjs): Dayjs {
  if (date.isBefore(MIN_DATE)) return MIN_DATE;
  if (date.isAfter(MAX_DATE)) return MAX_DATE;
  return date;
}

const Dashboard: React.FC = () => {
  const { selectedCountry } = useCountryContext();
  
  // Initialisation intelligente : 2 ans avant aujourd'hui → aujourd'hui
  const defaultStart = clampDate(MAX_DATE.subtract(2, 'year'));
  const defaultEnd = MAX_DATE;

  const [startDate, setStartDate] = useState<Dayjs>(defaultStart);
  const [endDate, setEndDate] = useState<Dayjs>(defaultEnd);
  const [error, setError] = useState<string | null>(null);

  // Validation robuste à chaque changement
  useEffect(() => {
    let validStart = clampDate(parseSmartDate(startDate));
    let validEnd = clampDate(parseSmartDate(endDate));
    if (validEnd.isBefore(validStart)) {
      // Corrige automatiquement : end = start
      validEnd = validStart;
    }
    setStartDate(validStart);
    setEndDate(validEnd);
  }, [startDate, endDate]);

  // Gestion d'erreur UI
  useEffect(() => {
    if (endDate.isBefore(startDate)) {
      setError('La date de fin ne peut pas précéder la date de début.');
    } else if (startDate.isBefore(MIN_DATE) || endDate.isAfter(MAX_DATE)) {
      setError('Les dates doivent être comprises entre 2020 et aujourd\'hui.');
    } else {
      setError(null);
    }
  }, [startDate, endDate]);

  // Handlers pour les inputs
  const handleStartDateChange = (value: string) => {
    setStartDate(parseSmartDate(value));
  };
  
  const handleEndDateChange = (value: string) => {
    setEndDate(parseSmartDate(value));
  };

  return (
    <div className="min-h-screen bg-background-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Oracle Portfolio Dashboard</h1>
          <p className="text-secondary-500">
            Analyse multi-pays des régimes économiques et allocations d'actifs
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="bg-background-secondary rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Période d'analyse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Date de début :
              </label>
              <input
                type="date"
                min={MIN_DATE.format('YYYY-MM-DD')}
                max={MAX_DATE.format('YYYY-MM-DD')}
                value={startDate.format('YYYY-MM-DD')}
                onChange={e => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-background-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date de fin :
              </label>
              <input
                type="date"
                min={MIN_DATE.format('YYYY-MM-DD')}
                max={MAX_DATE.format('YYYY-MM-DD')}
                value={endDate.format('YYYY-MM-DD')}
                onChange={e => handleEndDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-background-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Régime Économique */}
          <div className="lg:col-span-1">
            <RegimeCard />
          </div>

          {/* Allocations */}
          <div className="lg:col-span-1">
            <AllocationsCard />
          </div>

          {/* ETF Prices */}
          <div className="lg:col-span-1">
            <ETFPricesCard />
          </div>

          {/* Backtesting */}
          <div className="lg:col-span-2 xl:col-span-3">
            <BacktestingCard />
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-background-secondary rounded-lg">
          <h3 className="text-sm font-medium mb-2">Informations de debug</h3>
          <div className="text-xs text-secondary-500 space-y-1">
            <p>Pays sélectionné: {selectedCountry}</p>
            <p>Période: {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}</p>
            <p>Version: Oracle Portfolio v2.5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;