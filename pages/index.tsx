import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Settings, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Composants v4.3
import MarketStressCard from '@/components/cards/MarketStressCard';
import ETFPricesCard from '@/components/cards/ETFPricesCard';
import BacktestingCard from '@/components/cards/BacktestingCard';
import AllocationsCard from '@/components/cards/AllocationsCard';
import RegimeCard from '@/components/cards/RegimeCard';
import CountrySelector from '@/components/CountrySelector';

// Hooks
import { useCountrySelection } from '@/hooks/useCountrySelection';

export default function Home() {
  // Gestion du pays sélectionné
  const { selectedCountry, setSelectedCountry, isLoading: countryLoading } = useCountrySelection();

  return (
    <>
      <Head>
        <title>Oracle Portfolio v4.3 - VERSION VRAIMENT COMPLÈTE</title>
        <meta name="description" content="Oracle Portfolio v4.3 avec Market Stress, ETF Prices, Backtesting Engine et Multi-pays" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">🔮</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Oracle Portfolio</h1>
                  <p className="text-xs text-gray-400">v4.3.0 - VERSION VRAIMENT COMPLÈTE</p>
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
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-gray-400">En ligne</span>
                </div>

                {/* Configuration Button */}
                <Link href="/configuration">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Configuration"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                </Link>

                {/* Get Full Access Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  Get Full Access
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
            <h2 className="text-3xl font-bold text-white mb-2">
              Financial Dashboard
            </h2>
            <p className="text-gray-400">
              Real-time market data and portfolio analysis
            </p>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Première ligne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  🌍 Sélection du Pays
                </h3>
                <p className="text-sm text-gray-400 mb-4">Mis à jour: 18:35:24</p>
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  compact={false}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RegimeCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MarketStressCard />
            </motion.div>

            {/* Deuxième ligne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AllocationsCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ETFPricesCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <BacktestingCard />
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-700 bg-gray-800/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                © 2025 Oracle Portfolio v4.3 - VERSION VRAIMENT COMPLÈTE
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Plateforme d'analyse financière avec plugins dynamiques</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

