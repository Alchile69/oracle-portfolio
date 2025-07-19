import React from 'react';
import { Calendar, Filter, Download, RefreshCw, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh,
  isLoading = false 
}) => {
  const periods = [
    { value: '1M', label: '1 Mois' },
    { value: '3M', label: '3 Mois' },
    { value: '6M', label: '6 Mois' },
    { value: '1Y', label: '1 An' },
    { value: '3Y', label: '3 Ans' },
    { value: '5Y', label: '5 Ans' },
    { value: 'ALL', label: 'Tout' }
  ];

  const benchmarks = [
    { value: 'local', label: 'Indices Locaux' },
    { value: 'msciWorld', label: 'MSCI World' },
    { value: 'sp500', label: 'S&P 500' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  const indicatorTypes = [
    { value: 'performance', label: 'Performance', icon: '📈' },
    { value: 'risk', label: 'Risque', icon: '⚠️' },
    { value: 'allocation', label: 'Allocation', icon: '🥧' },
    { value: 'physical', label: 'Indicateurs Physiques', icon: '🏭' },
    { value: 'financial', label: 'Indicateurs Financiers', icon: '💰' },
    { value: 'backtesting', label: 'Backtesting', icon: '🔄' }
  ];

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: '📊' },
    { value: 'excel', label: 'Excel', icon: '📋' },
    { value: 'pdf', label: 'PDF', icon: '📄' },
    { value: 'png', label: 'PNG', icon: '🖼️' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleIndicatorTypeToggle = (type) => {
    const currentTypes = filters.indicators || ['performance'];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('indicators', newTypes);
  };

  const handleExport = (format) => {
    onExport(format);
  };

  const resetFilters = () => {
    onFiltersChange({
      period: '1Y',
      benchmark: 'local',
      indicators: ['performance'],
      minReturn: [0],
      maxRisk: [100],
      showOnlyPositive: false,
      includeDrawdown: true,
      realTimeUpdate: false,
      darkMode: false
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres et Contrôles</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Période et Benchmark */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Période d'analyse</span>
            </label>
            <Select
              value={filters.period || '1Y'}
              onValueChange={(value) => handleFilterChange('period', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Benchmark de référence</span>
            </label>
            <Select
              value={filters.benchmark || 'local'}
              onValueChange={(value) => handleFilterChange('benchmark', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un benchmark" />
              </SelectTrigger>
              <SelectContent>
                {benchmarks.map((benchmark) => (
                  <SelectItem key={benchmark.value} value={benchmark.value}>
                    {benchmark.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Types d'indicateurs */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Types d'indicateurs à afficher</label>
          <div className="flex flex-wrap gap-2">
            {indicatorTypes.map((type) => {
              const isSelected = (filters.indicators || ['performance']).includes(type.value);
              return (
                <Badge
                  key={type.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => handleIndicatorTypeToggle(type.value)}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Filtres de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Rendement minimum: {filters.minReturn?.[0] || 0}%
            </label>
            <Slider
              value={filters.minReturn || [0]}
              onValueChange={(value) => handleFilterChange('minReturn', value)}
              max={20}
              min={-10}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Risque maximum: {filters.maxRisk?.[0] || 100}%
            </label>
            <Slider
              value={filters.maxRisk || [100]}
              onValueChange={(value) => handleFilterChange('maxRisk', value)}
              max={50}
              min={5}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Options avancées */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Options d'affichage</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">Afficher uniquement les performances positives</label>
              <Switch
                checked={filters.showOnlyPositive || false}
                onCheckedChange={(checked) => handleFilterChange('showOnlyPositive', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Inclure les données de drawdown</label>
              <Switch
                checked={filters.includeDrawdown !== false}
                onCheckedChange={(checked) => handleFilterChange('includeDrawdown', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Mise à jour temps réel</label>
              <Switch
                checked={filters.realTimeUpdate || false}
                onCheckedChange={(checked) => handleFilterChange('realTimeUpdate', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Mode sombre automatique</label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={filters.darkMode || false}
                  onCheckedChange={(checked) => handleFilterChange('darkMode', checked)}
                  disabled={true}
                />
                <span className="text-xs text-gray-500">
                  {new Date().getHours() < 7 || new Date().getHours() > 19 ? '🌙 Nuit' : '☀️ Jour'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions d'export */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter les données</span>
          </label>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Choisir le format d'export</span>
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Formats disponibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {exportFormats.map((format) => (
                <DropdownMenuCheckboxItem
                  key={format.value}
                  onClick={() => handleExport(format.value)}
                  className="flex items-center space-x-2"
                >
                  <span>{format.icon}</span>
                  <span>{format.label}</span>
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                onClick={() => handleExport('all')}
                className="flex items-center space-x-2 font-medium"
              >
                <span>📦</span>
                <span>Tous les formats</span>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Résumé des filtres actifs */}
        {(filters.indicatorTypes?.length > 1 || 
          filters.minReturn?.[0] > 0 || 
          filters.maxRisk?.[0] < 100 ||
          filters.showOnlyPositive ||
          !filters.includeDrawdown) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Filtres actifs</label>
            <div className="flex flex-wrap gap-2">
              {filters.indicatorTypes?.length > 1 && (
                <Badge variant="secondary">
                  {filters.indicatorTypes.length} types d'indicateurs
                </Badge>
              )}
              {filters.minReturn?.[0] > 0 && (
                <Badge variant="secondary">
                  Rendement ≥ {filters.minReturn[0]}%
                </Badge>
              )}
              {filters.maxRisk?.[0] < 100 && (
                <Badge variant="secondary">
                  Risque ≤ {filters.maxRisk[0]}%
                </Badge>
              )}
              {filters.showOnlyPositive && (
                <Badge variant="secondary">
                  Performances positives uniquement
                </Badge>
              )}
              {!filters.includeDrawdown && (
                <Badge variant="secondary">
                  Sans données de drawdown
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filters.selectedCountries?.length || 0}
            </div>
            <div className="text-xs text-gray-500">Pays sélectionnés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filters.indicatorTypes?.length || 1}
            </div>
            <div className="text-xs text-gray-500">Types d'indicateurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filters.period || '1Y'}
            </div>
            <div className="text-xs text-gray-500">Période d'analyse</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filters.benchmark || 'Local'}
            </div>
            <div className="text-xs text-gray-500">Benchmark</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;

