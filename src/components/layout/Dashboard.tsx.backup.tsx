import React, { useState } from 'react';
// Tous les imports utilisent l'alias @ et l'extension .tsx explicite pour les composants
// Les chemins sont ajustés pour refléter la structure réelle sous src/components/
import Header from '@/components/layout/Header.tsx';
import MarketStressCard from '@/components/widgets/MarketStressCard.tsx';
import ETFPricesCard from '@/components/widgets/ETFPricesCard.tsx';
import AllocationsCard from '@/components/widgets/AllocationsCard.tsx';
import CountrySelector from '@/components/ui/CountrySelector.tsx';
import RegimeCard from '@/components/ui/RegimeCard.tsx';
import { CountryProvider } from '@/hooks/CountryContext.tsx'; // CountryContext est bien .tsx
import BacktestingCard from '@/components/BacktestingCard.tsx';

import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';


const Dashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <CountryProvider>
      <div className="min-h-screen bg-background-dark">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />

        <main className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h2 className="text-2xl font-bold text-white">Financial Dashboard</h2>
            <p className="text-gray-400">Real-time market data and portfolio analysis</p>
          </motion.div>

          {/* Grille avec CountrySelector, RegimeCard et MarketStressCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <CountrySelector />
            <RegimeCard />
            <MarketStressCard />
          </div>

          {/* Nouvelle section pour le BacktestingCard */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <BacktestingCard className="col-span-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AllocationsCard />
            <ETFPricesCard />
          </div>
        </main>

        <footer className="bg-background-card py-4 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <PieChart size={20} className="text-primary-500 mr-2" />
                <span className="text-gray-400 text-sm">© 2025 Oracle Portfolio. All rights reserved.</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CountryProvider>
  );
};

export default Dashboard;
