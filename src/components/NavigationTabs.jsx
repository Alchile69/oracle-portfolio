import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Lock,
  Sparkles
} from 'lucide-react';

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Vue d\'ensemble financière'
    },
    {
      id: 'analytics', 
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Analyses avancées'
    },
    {
      id: 'comparison',
      label: 'Comparaison',
      icon: Globe,
      description: 'Vue comparative multi-pays',
      isNew: true
    },
    {
      id: 'access',
      label: 'Get Full Access',
      icon: Lock,
      description: 'Accès premium'
    }
  ];

  return (
    <div className="flex items-center justify-center gap-4 px-6 py-4 bg-[#0f0f23] border-b border-gray-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }
              ${tab.id === 'access' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700' : ''}
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
            
            {/* Badge "Nouveau" pour l'onglet Comparaison */}
            {tab.isNew && (
              <Badge 
                variant="secondary" 
                className="ml-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 animate-pulse"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Nouveau
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;

