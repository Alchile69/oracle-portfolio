import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Code, 
  TestTube, 
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';

interface FormulasConfigProps {
  onChange?: () => void;
}

interface Formula {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: string[];
  enabled: boolean;
  testValue?: number;
  lastResult?: number;
}

const DEFAULT_FORMULAS: Formula[] = [
  {
    id: 'confidence',
    name: 'Formule de Confiance',
    description: 'Calcule le niveau de confiance global basé sur les indicateurs',
    formula: '(PMI * 0.3 + ELECTRICITY * 0.2 + MARITIME * 0.15 + ENERGY * 0.15 + YIELDS * 0.1 + SPREADS * 0.1) / 100',
    variables: ['PMI', 'ELECTRICITY', 'MARITIME', 'ENERGY', 'YIELDS', 'SPREADS'],
    enabled: true
  },
  {
    id: 'regime_score',
    name: 'Score de Régime',
    description: 'Détermine le régime économique actuel',
    formula: 'IF(CONFIDENCE > 0.7, "EXPANSION", IF(CONFIDENCE > 0.4, "RECOVERY", IF(CONFIDENCE > 0.2, "STAGFLATION", "RECESSION")))',
    variables: ['CONFIDENCE'],
    enabled: true
  }
];

export default function FormulasConfig({ onChange }: FormulasConfigProps) {
  const [formulas, setFormulas] = useState<Formula[]>(DEFAULT_FORMULAS);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<string>('confidence');
  const [showPreview, setShowPreview] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  useEffect(() => {
    // Charger les formules depuis localStorage
    const savedFormulas = localStorage.getItem('oracle-formulas-config');
    if (savedFormulas) {
      try {
        const parsed = JSON.parse(savedFormulas);
        setFormulas(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des formules:', error);
      }
    }
  }, []);

  const handleFormulaChange = (id: string, field: keyof Formula, value: any) => {
    setFormulas(prev => prev.map(formula => 
      formula.id === id 
        ? { ...formula, [field]: value }
        : formula
    ));
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleSave = () => {
    localStorage.setItem('oracle-formulas-config', JSON.stringify(formulas));
    setIsDirty(false);
  };

  const handleReset = () => {
    setFormulas(DEFAULT_FORMULAS);
    localStorage.removeItem('oracle-formulas-config');
    setIsDirty(true);
    if (onChange) onChange();
  };

  const handleTestFormula = (formulaId: string) => {
    const formula = formulas.find(f => f.id === formulaId);
    if (!formula) return;

    // Simulation de test avec des valeurs d'exemple
    const testData = {
      PMI: 52.5,
      ELECTRICITY: 3.2,
      MARITIME: -1.8,
      ENERGY: 8.5,
      YIELDS: 2.8,
      SPREADS: 150,
      CONFIDENCE: 0.65
    };

    try {
      // Simulation d'évaluation de formule
      let result;
      if (formulaId === 'confidence') {
        result = (testData.PMI * 0.3 + testData.ELECTRICITY * 0.2 + testData.MARITIME * 0.15 + 
                 testData.ENERGY * 0.15 + testData.YIELDS * 0.1 + testData.SPREADS * 0.1) / 100;
      } else if (formulaId === 'regime_score') {
        result = testData.CONFIDENCE > 0.7 ? 'EXPANSION' : 
                testData.CONFIDENCE > 0.4 ? 'RECOVERY' : 
                testData.CONFIDENCE > 0.2 ? 'STAGFLATION' : 'RECESSION';
      } else {
        result = Math.random() * 100; // Valeur aléatoire pour test
      }

      setTestResults(prev => ({
        ...prev,
        [formulaId]: {
          result,
          testData,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [formulaId]: {
          error: 'Erreur dans la formule',
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const selectedFormulaData = formulas.find(f => f.id === selectedFormula);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Calculator className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-text-primary">Configuration des Formules</h2>
        </div>
        <p className="text-text-secondary">
          Éditeur de formules mathématiques pour les calculs personnalisés
        </p>
      </div>

      {/* Status */}
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center space-x-3"
        >
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formula List */}
        <div className="lg:col-span-1">
          <div className="bg-background-tertiary rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Formules</h3>
            <div className="space-y-2">
              {formulas.map((formula) => (
                <motion.button
                  key={formula.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFormula(formula.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedFormula === formula.id
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'hover:bg-background-primary text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{formula.name}</p>
                      <p className="text-xs opacity-70 truncate">{formula.description}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${formula.enabled ? 'bg-success' : 'bg-error'}`} />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Formula Editor */}
        <div className="lg:col-span-2">
          {selectedFormulaData && (
            <div className="bg-background-tertiary rounded-lg p-6">
              {/* Formula Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{selectedFormulaData.name}</h3>
                  <p className="text-text-secondary">{selectedFormulaData.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
                    title={showPreview ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFormulaData.enabled}
                      onChange={(e) => handleFormulaChange(selectedFormulaData.id, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-background-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>

              {/* Variables */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Variables disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedFormulaData.variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-1 bg-primary-500/10 text-primary-400 rounded text-xs font-mono"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formula Editor */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Formule
                </label>
                <textarea
                  value={selectedFormulaData.formula}
                  onChange={(e) => handleFormulaChange(selectedFormulaData.id, 'formula', e.target.value)}
                  className="w-full h-32 px-3 py-2 bg-background-primary border border-background-primary rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Entrez votre formule ici..."
                />
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="mb-4 p-4 bg-background-primary rounded-lg">
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Aperçu de la formule</h4>
                  <code className="text-xs text-text-primary font-mono break-all">
                    {selectedFormulaData.formula}
                  </code>
                </div>
              )}

              {/* Test Section */}
              <div className="border-t border-background-primary pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-text-primary">Test de la formule</h4>
                  <button
                    onClick={() => handleTestFormula(selectedFormulaData.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Tester</span>
                  </button>
                </div>

                {/* Test Results */}
                {testResults[selectedFormulaData.id] && (
                  <div className="p-4 bg-background-primary rounded-lg">
                    {testResults[selectedFormulaData.id].error ? (
                      <div className="text-error">
                        <p className="font-medium">Erreur:</p>
                        <p className="text-sm">{testResults[selectedFormulaData.id].error}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-secondary">Résultat:</span>
                          <span className="text-text-primary font-mono">
                            {typeof testResults[selectedFormulaData.id].result === 'number' 
                              ? testResults[selectedFormulaData.id].result.toFixed(4)
                              : testResults[selectedFormulaData.id].result
                            }
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary">
                          Testé le {new Date(testResults[selectedFormulaData.id].timestamp).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <section className="pt-6 border-t border-background-tertiary mt-8">
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
  );
}

