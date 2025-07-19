import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const OriginalAnalytics = () => {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400 mb-8">Advanced portfolio analytics and insights</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Cette section intègre les analyses avancées de performance du portefeuille Oracle Portfolio.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-cyan-400">• Analyse de performance historique</p>
                <p className="text-sm text-cyan-400">• Métriques de risque avancées</p>
                <p className="text-sm text-cyan-400">• Comparaisons sectorielles</p>
                <p className="text-sm text-cyan-400">• Optimisation de portefeuille</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a2e] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">Risk Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Outils de gestion des risques et d'analyse de stress testing.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-cyan-400">• Value at Risk (VaR)</p>
                <p className="text-sm text-cyan-400">• Stress testing scenarios</p>
                <p className="text-sm text-cyan-400">• Correlation analysis</p>
                <p className="text-sm text-cyan-400">• Risk attribution</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a2e] border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-white">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Intelligence de marché et analyses macroéconomiques intégrées.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#2d2d44] p-4 rounded">
                  <h4 className="font-medium text-white mb-2">Economic Indicators</h4>
                  <p className="text-xs text-gray-400">Suivi des indicateurs économiques clés</p>
                </div>
                <div className="bg-[#2d2d44] p-4 rounded">
                  <h4 className="font-medium text-white mb-2">Sentiment Analysis</h4>
                  <p className="text-xs text-gray-400">Analyse du sentiment de marché</p>
                </div>
                <div className="bg-[#2d2d44] p-4 rounded">
                  <h4 className="font-medium text-white mb-2">Technical Signals</h4>
                  <p className="text-xs text-gray-400">Signaux techniques automatisés</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default OriginalAnalytics;

