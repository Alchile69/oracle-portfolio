import React from 'react';
import { motion } from 'framer-motion';
import { Settings, TrendingUp, BarChart3, PieChart, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Composants
import AllocationChart from '@/components/AllocationChart';
import RegimeIndicator from '@/components/RegimeIndicator';
import SectorTable from '@/components/SectorTable';
import CountrySelector from '@/components/CountrySelector';

// Hooks
import { useAllocationData } from '@/hooks/useAllocationData';
import { useRegimeData } from '@/hooks/useRegimeData';
import { useCountrySelection } from '@/hooks/useCountrySelection';

export default function Home() {
  // Gestion du pays sélectionné
  const { selectedCountry, setSelectedCountry, isLoading: countryLoading } = useCountrySelection();
  
  // Données basées sur le pays sélectionné
  const { 
    allocations, 
    loading: allocationsLoading, 
    error: allocationsError, 
    refetch: refetchAllocations,
    totalAllocation,
    averagePerformance,
    averageRiskScore
  } = useAllocationData(selectedCountry);
  
  const { 
    regimeData, 
    loading: regimeLoading, 
    error: regimeError, 
    refetch: refetchRegime 
  } = useRegimeData(selectedCountry);

  const handleRefreshAll = () => {
    refetchAllocations();
    refetchRegime();
  };

  const isLoading = allocationsLoading || regimeLoading;
  const hasError = allocationsError || regimeError;

  return (
    <>
      <Head>
        <title>Oracle Portfolio v4.1 - Allocation Sectorielle Intelligente</title>
        <meta name="description" content="Application d'allocation sectorielle basée sur les régimes économiques" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary">
        {/* Header */}
        <header className="border-b border-background-tertiary bg-background-secondary/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">🔮</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-primary">Oracle Portfolio</h1>
                  <p className="text-xs text-text-secondary">v4.2.0 - Multi-Pays Complet</p>
                </div>
              </motion.div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-4">
                {/* Country Selector */}
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  compact={true}
                />

                {/* Health Status */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-success' : 'bg-error'}`} />
                  <span className="text-sm text-text-secondary">
                    {isHealthy ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>

                {/* Configuration Button */}
                <Link href="/configuration">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                    title="Configuration"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefreshAll}
                  disabled={isLoading}
                  className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Financial Dashboard
            </h2>
            <p className="text-text-secondary">
              Analyse en temps réel des marchés et allocation de portefeuille
            </p>
          </motion.div>

          {/* Error State */}
          {hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
              <div>
                <p className="text-error font-medium">Erreur de chargement</p>
                <p className="text-error/80 text-sm">
                  {allocationsError || regimeError}
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && !hasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 flex items-center justify-center py-12"
            >
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
                <span className="text-text-secondary">Chargement des données...</span>
              </div>
            </motion.div>
          )}

          {/* Dashboard Grid */}
          {!isLoading && !hasError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Regime Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {regimeData && (
                  <RegimeIndicator 
                    data={regimeData}
                    showDetails={true}
                  />
                )}
              </motion.div>

              {/* Allocation Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AllocationChart 
                  allocations={allocations}
                  size="medium"
                  showLegend={true}
                  showTooltip={true}
                />
              </motion.div>
            </div>
          )}

          {/* Performance Summary */}
          {!isLoading && !hasError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-background-secondary rounded-xl p-6 border border-background-tertiary">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Allocation Totale</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {totalAllocation.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary rounded-xl p-6 border border-background-tertiary">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Performance Moyenne</p>
                    <p className={`text-2xl font-bold ${averagePerformance >= 0 ? 'text-success' : 'text-error'}`}>
                      {averagePerformance >= 0 ? '+' : ''}{averagePerformance.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background-secondary rounded-xl p-6 border border-background-tertiary">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Secteurs Actifs</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {allocations.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sector Table */}
          {!isLoading && !hasError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SectorTable 
                allocations={allocations}
                showPerformance={true}
                showTrend={true}
                showRisk={true}
                compact={false}
              />
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-background-tertiary bg-background-secondary/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <p className="text-text-secondary text-sm">
                © 2025 Oracle Portfolio v4.1 - Allocation sectorielle intelligente
              </p>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>Plateforme d'analyse financière avec plugins dynamiques</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

