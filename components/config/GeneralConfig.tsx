import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Clock, 
  Database, 
  Shield, 
  Zap,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface GeneralConfigProps {
  onChange?: () => void;
}

interface GeneralSettings {
  appName: string;
  version: string;
  language: string;
  timezone: string;
  refreshInterval: number;
  apiTimeout: number;
  enableNotifications: boolean;
  enableAutoSave: boolean;
  enableDebugMode: boolean;
  maxHistoryDays: number;
  cacheSize: number;
  theme: string;
}

const DEFAULT_SETTINGS: GeneralSettings = {
  appName: 'Oracle Portfolio',
  version: '4.1.0',
  language: 'fr',
  timezone: 'Europe/Paris',
  refreshInterval: 30,
  apiTimeout: 10,
  enableNotifications: true,
  enableAutoSave: true,
  enableDebugMode: false,
  maxHistoryDays: 30,
  cacheSize: 100,
  theme: 'dark'
};

export default function GeneralConfig({ onChange }: GeneralConfigProps) {
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('oracle-general-config');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    }
  }, []);

  const handleSettingChange = (key: keyof GeneralSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleSave = () => {
    localStorage.setItem('oracle-general-config', JSON.stringify(settings));
    setIsDirty(false);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('oracle-general-config');
    setIsDirty(true);
    if (onChange) onChange();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-text-primary">Configuration Générale</h2>
        </div>
        <p className="text-text-secondary">
          Paramètres globaux de l'application Oracle Portfolio
        </p>
      </div>

      {/* Status */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="text-warning font-medium">Modifications non sauvegardées</p>
            <p className="text-warning/80 text-sm">N'oubliez pas de sauvegarder vos changements</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-warning text-background-primary rounded-lg hover:bg-warning/90 transition-colors"
          >
            Sauvegarder
          </button>
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Application Settings */}
        <section>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Info className="w-5 h-5 text-primary-400" />
            <span>Informations Application</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nom de l'application
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleSettingChange('appName', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Version
              </label>
              <input
                type="text"
                value={settings.version}
                onChange={(e) => handleSettingChange('version', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Langue
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Fuseau horaire
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </section>

        {/* Performance Settings */}
        <section>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary-400" />
            <span>Performance</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Intervalle de rafraîchissement (secondes)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={settings.refreshInterval}
                onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Timeout API (secondes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.apiTimeout}
                onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Historique maximum (jours)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.maxHistoryDays}
                onChange={(e) => handleSettingChange('maxHistoryDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Taille du cache (MB)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={settings.cacheSize}
                onChange={(e) => handleSettingChange('cacheSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </section>

        {/* Feature Toggles */}
        <section>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary-400" />
            <span>Fonctionnalités</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Notifications</h4>
                <p className="text-sm text-text-secondary">Recevoir des notifications système</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Sauvegarde automatique</h4>
                <p className="text-sm text-text-secondary">Sauvegarder automatiquement les modifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoSave}
                  onChange={(e) => handleSettingChange('enableAutoSave', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Mode debug</h4>
                <p className="text-sm text-text-secondary">Afficher les informations de débogage</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDebugMode}
                  onChange={(e) => handleSettingChange('enableDebugMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="pt-6 border-t border-background-tertiary">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
            >
              Réinitialiser
            </button>
            
            <div className="flex items-center space-x-3">
              {!isDirty && (
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Sauvegardé</span>
                </div>
              )}
              
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

