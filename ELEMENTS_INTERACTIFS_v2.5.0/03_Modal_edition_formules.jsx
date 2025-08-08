// 🧮 MODAL D'ÉDITION FORMULES - ExtensibleConfigurationPanel.jsx
// 📅 Date : 4 Août 2025
// 🎯 Version : v2.5.0 (19 Juillet 2025)

import React, { useState, useEffect } from 'react';

const FormulaEditModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  formula = null, 
  mode = 'add' 
}) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'scoring',
    expression: '',
    parameters: {},
    enabled: true,
    ui: { icon: '🧮', color: '#8b5cf6' }
  });

  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Initialisation des données si en mode édition
  useEffect(() => {
    if (formula && mode === 'edit') {
      setFormData({
        id: formula.id || '',
        name: formula.name || '',
        category: formula.category || 'scoring',
        expression: formula.expression || '',
        parameters: formula.parameters || {},
        enabled: formula.enabled !== undefined ? formula.enabled : true,
        ui: formula.ui || { icon: '🧮', color: '#8b5cf6' }
      });
    }
  }, [formula, mode]);

  // Validation en temps réel
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'id':
        if (!value) {
          newErrors.id = 'ID requis';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.id = 'ID doit contenir uniquement lettres, chiffres et underscore';
        } else {
          delete newErrors.id;
        }
        break;
        
      case 'name':
        if (!value) {
          newErrors.name = 'Nom requis';
        } else if (value.length < 2) {
          newErrors.name = 'Nom doit contenir au moins 2 caractères';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'expression':
        if (!value) {
          newErrors.expression = 'Expression requise';
        } else if (!isValidExpression(value)) {
          newErrors.expression = 'Expression mathématique invalide';
        } else {
          delete newErrors.expression;
        }
        break;
        
      case 'parameters':
        if (!isValidJson(value)) {
          newErrors.parameters = 'Paramètres JSON invalides';
        } else {
          delete newErrors.parameters;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation d'expression mathématique
  const isValidExpression = (expression) => {
    // Vérification basique des caractères autorisés
    const allowedChars = /^[a-zA-Z0-9\s\+\-\*\/\(\)\.\,\_\<\>\=\&\|]+$/;
    if (!allowedChars.test(expression)) {
      return false;
    }
    
    // Vérification des parenthèses équilibrées
    let parentheses = 0;
    for (let char of expression) {
      if (char === '(') parentheses++;
      if (char === ')') parentheses--;
      if (parentheses < 0) return false;
    }
    
    return parentheses === 0;
  };

  // Validation JSON
  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  // Gestion des changements de champs
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Gestion des paramètres JSON
  const handleParametersChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      parameters: isValidJson(value) ? JSON.parse(value) : prev.parameters 
    }));
    validateField('parameters', value);
  };

  // Sauvegarde de la formule
  const handleSave = async () => {
    setIsValidating(true);
    
    // Validation complète
    const fieldsToValidate = ['id', 'name', 'expression'];
    let isValid = true;
    
    for (const field of fieldsToValidate) {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    }
    
    if (!isValid) {
      setIsValidating(false);
      return;
    }
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ general: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsValidating(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    setFormData({
      id: '',
      name: '',
      category: 'scoring',
      expression: '',
      parameters: {},
      enabled: true,
      ui: { icon: '🧮', color: '#8b5cf6' }
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content formula-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {mode === 'add' ? '➕ Ajouter une formule' : '✏️ Modifier la formule'}
          </h3>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-body">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="formula-id">
              ID unique <span className="required">*</span>
            </label>
            <input
              id="formula-id"
              type="text"
              value={formData.id}
              onChange={e => handleFieldChange('id', e.target.value)}
              placeholder="ex: custom_formula"
              className={errors.id ? 'error' : ''}
              disabled={mode === 'edit'}
            />
            {errors.id && <span className="error-text">{errors.id}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="formula-name">
              Nom <span className="required">*</span>
            </label>
            <input
              id="formula-name"
              type="text"
              value={formData.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              placeholder="Nom de la formule"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="formula-category">Catégorie</label>
            <select
              id="formula-category"
              value={formData.category}
              onChange={e => handleFieldChange('category', e.target.value)}
            >
              <option value="scoring">Scoring</option>
              <option value="allocation">Allocation</option>
              <option value="risk">Gestion des risques</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="formula-expression">
              Expression mathématique <span className="required">*</span>
            </label>
            <textarea
              id="formula-expression"
              value={formData.expression}
              onChange={e => handleFieldChange('expression', e.target.value)}
              placeholder="ex: (indicator_score * 0.6) + (historical_accuracy * 0.4)"
              rows="4"
              className={errors.expression ? 'error' : ''}
            />
            {errors.expression && <span className="error-text">{errors.expression}</span>}
            <div className="help-text">
              Variables disponibles: indicator_score, historical_accuracy, volatility, threshold
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="formula-parameters">
              Paramètres (JSON)
            </label>
            <textarea
              id="formula-parameters"
              value={JSON.stringify(formData.parameters, null, 2)}
              onChange={e => handleParametersChange(e.target.value)}
              placeholder='{"param1": 0.5, "param2": 1.0}'
              rows="6"
              className={errors.parameters ? 'error' : ''}
            />
            {errors.parameters && <span className="error-text">{errors.parameters}</span>}
            <div className="help-text">
              Définissez les paramètres utilisés dans votre expression
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="formula-icon">Icône</label>
            <select
              id="formula-icon"
              value={formData.ui.icon}
              onChange={e => handleFieldChange('ui', { ...formData.ui, icon: e.target.value })}
            >
              <option value="🧮">🧮 Formule</option>
              <option value="🎯">🎯 Cible</option>
              <option value="📐">📐 Calcul</option>
              <option value="⚡">⚡ Performance</option>
              <option value="📊">📊 Statistiques</option>
              <option value="🔢">🔢 Mathématiques</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="formula-color">Couleur</label>
            <input
              id="formula-color"
              type="color"
              value={formData.ui.color}
              onChange={e => handleFieldChange('ui', { ...formData.ui, color: e.target.value })}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={e => handleFieldChange('enabled', e.target.checked)}
              />
              Activer cette formule
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={handleCancel}
            disabled={isValidating}
          >
            Annuler
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isValidating || Object.keys(errors).length > 0}
          >
            {isValidating ? 'Sauvegarde...' : (mode === 'add' ? 'Ajouter' : 'Modifier')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de prévisualisation de formule
const FormulaPreview = ({ formula }) => {
  if (!formula) return null;

  return (
    <div className="formula-preview">
      <h4>Prévisualisation</h4>
      <div className="preview-content">
        <div className="preview-header">
          <span className="preview-icon">{formula.ui.icon}</span>
          <span className="preview-name">{formula.name}</span>
          <span className={`preview-status ${formula.enabled ? 'enabled' : 'disabled'}`}>
            {formula.enabled ? 'Activée' : 'Désactivée'}
          </span>
        </div>
        
        <div className="preview-expression">
          <strong>Expression:</strong>
          <code>{formula.expression}</code>
        </div>
        
        {Object.keys(formula.parameters).length > 0 && (
          <div className="preview-parameters">
            <strong>Paramètres:</strong>
            <pre>{JSON.stringify(formula.parameters, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant de validation d'expression
const ExpressionValidator = ({ expression, onValidationChange }) => {
  const [validationResult, setValidationResult] = useState({
    isValid: false,
    errors: [],
    warnings: []
  });

  useEffect(() => {
    const validate = () => {
      const errors = [];
      const warnings = [];

      if (!expression) {
        errors.push('Expression vide');
      } else {
        // Vérification des caractères autorisés
        const allowedChars = /^[a-zA-Z0-9\s\+\-\*\/\(\)\.\,\_\<\>\=\&\|]+$/;
        if (!allowedChars.test(expression)) {
          errors.push('Caractères non autorisés détectés');
        }

        // Vérification des parenthèses
        let parentheses = 0;
        for (let char of expression) {
          if (char === '(') parentheses++;
          if (char === ')') parentheses--;
          if (parentheses < 0) {
            errors.push('Parenthèses mal équilibrées');
            break;
          }
        }
        if (parentheses !== 0) {
          errors.push('Parenthèses non fermées');
        }

        // Vérification des variables
        const variables = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
        const validVariables = ['indicator_score', 'historical_accuracy', 'volatility', 'threshold'];
        const invalidVariables = variables.filter(v => !validVariables.includes(v));
        
        if (invalidVariables.length > 0) {
          warnings.push(`Variables non reconnues: ${invalidVariables.join(', ')}`);
        }
      }

      const result = {
        isValid: errors.length === 0,
        errors,
        warnings
      };

      setValidationResult(result);
      onValidationChange(result);
    };

    validate();
  }, [expression, onValidationChange]);

  return (
    <div className="expression-validator">
      <div className={`validation-status ${validationResult.isValid ? 'valid' : 'invalid'}`}>
        {validationResult.isValid ? '✅ Valide' : '❌ Invalide'}
      </div>
      
      {validationResult.errors.length > 0 && (
        <div className="validation-errors">
          <strong>Erreurs:</strong>
          <ul>
            {validationResult.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validationResult.warnings.length > 0 && (
        <div className="validation-warnings">
          <strong>Avertissements:</strong>
          <ul>
            {validationResult.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Styles CSS pour la modal
const modalStyles = `
.formula-modal {
  max-width: 800px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.help-text {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.formula-preview {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.preview-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.preview-status.enabled {
  background-color: #10b981;
  color: white;
}

.preview-status.disabled {
  background-color: #6b7280;
  color: white;
}

.preview-expression,
.preview-parameters {
  margin-top: 0.5rem;
}

.preview-expression code,
.preview-parameters pre {
  display: block;
  padding: 0.5rem;
  background-color: #1f2937;
  color: #f9fafb;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.75rem;
  overflow-x: auto;
}

.expression-validator {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.validation-status.valid {
  color: #10b981;
}

.validation-status.invalid {
  color: #ef4444;
}

.validation-errors,
.validation-warnings {
  margin-top: 0.5rem;
}

.validation-errors {
  color: #ef4444;
}

.validation-warnings {
  color: #f59e0b;
}

.validation-errors ul,
.validation-warnings ul {
  margin: 0.25rem 0;
  padding-left: 1rem;
}
`;

export { FormulaEditModal, FormulaPreview, ExpressionValidator, modalStyles };
export default FormulaEditModal; 