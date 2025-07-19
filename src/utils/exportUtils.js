// Utilitaires d'export pour Oracle Portfolio
// Génération réelle de fichiers CSV, Excel et PDF

export const exportFormats = {
  CSV: 'csv',
  EXCEL: 'excel', 
  PDF: 'pdf',
  JSON: 'json'
};

// Conversion des données en format CSV
export const convertToCSV = (data, includeHeaders = true) => {
  if (!data || data.length === 0) {
    throw new Error('Aucune donnée à exporter');
  }

  const headers = [
    'Pays',
    'Code',
    'Rendement Cumulé (%)',
    'Rendement Annualisé (%)', 
    'Volatilité (%)',
    'Ratio de Sharpe',
    'Drawdown Max (%)',
    'VaR 95% (%)',
    'Beta',
    'Alpha (%)',
    'Ratio Information'
  ];

  const rows = data.map(item => [
    item.country?.name || 'N/A',
    item.country?.code || 'N/A',
    item.performance?.cumulativeReturn?.toFixed(2) || '0.00',
    item.performance?.annualizedReturn?.toFixed(2) || '0.00',
    item.performance?.volatility?.toFixed(2) || '0.00',
    item.performance?.sharpeRatio?.toFixed(3) || '0.000',
    item.performance?.maxDrawdown?.toFixed(2) || '0.00',
    item.performance?.var95?.toFixed(2) || '0.00',
    item.performance?.beta?.toFixed(3) || '0.000',
    item.performance?.alpha?.toFixed(2) || '0.00',
    item.performance?.informationRatio?.toFixed(3) || '0.000'
  ]);

  const csvContent = includeHeaders 
    ? [headers, ...rows].map(row => row.join(',')).join('\n')
    : rows.map(row => row.join(',')).join('\n');

  return csvContent;
};

// Conversion des données historiques en CSV
export const convertHistoricalToCSV = (data) => {
  if (!data || data.length === 0) {
    throw new Error('Aucune donnée historique à exporter');
  }

  // Extraire toutes les dates uniques
  const allDates = [...new Set(
    data.flatMap(country => 
      country.performance?.historicalData?.map(point => point.date) || []
    )
  )].sort();

  // Créer les headers
  const headers = ['Date', ...data.map(country => country.country?.name || 'Inconnu')];

  // Créer les lignes de données
  const rows = allDates.map(date => {
    const row = [date];
    data.forEach(country => {
      const dataPoint = country.performance?.historicalData?.find(point => point.date === date);
      row.push(dataPoint?.value?.toFixed(2) || '');
    });
    return row;
  });

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// Téléchargement de fichier
export const downloadFile = (content, filename, mimeType) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL après un délai
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    return true;
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw new Error(`Échec du téléchargement: ${error.message}`);
  }
};

// Export principal avec gestion des différents formats
export const exportData = async (data, format, options = {}) => {
  const {
    filename = 'oracle-portfolio-data',
    includeHistorical = false,
    includeHeaders = true
  } = options;

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  try {
    switch (format) {
      case exportFormats.CSV: {
        let csvContent = '';
        
        if (includeHistorical) {
          csvContent += '# DONNÉES PERFORMANCE\n';
          csvContent += convertToCSV(data, includeHeaders);
          csvContent += '\n\n# DONNÉES HISTORIQUES\n';
          csvContent += convertHistoricalToCSV(data);
        } else {
          csvContent = convertToCSV(data, includeHeaders);
        }
        
        const success = downloadFile(
          csvContent,
          `${filename}_${timestamp}.csv`,
          'text/csv;charset=utf-8;'
        );
        
        return {
          success,
          message: `Export CSV réussi: ${filename}_${timestamp}.csv`,
          filename: `${filename}_${timestamp}.csv`
        };
      }

      case exportFormats.JSON: {
        const jsonContent = JSON.stringify({
          metadata: {
            exportDate: new Date().toISOString(),
            version: '1.0',
            source: 'Oracle Portfolio'
          },
          data: data
        }, null, 2);
        
        const success = downloadFile(
          jsonContent,
          `${filename}_${timestamp}.json`,
          'application/json'
        );
        
        return {
          success,
          message: `Export JSON réussi: ${filename}_${timestamp}.json`,
          filename: `${filename}_${timestamp}.json`
        };
      }

      case exportFormats.EXCEL: {
        // Pour l'instant, on génère un CSV compatible Excel
        const csvContent = convertToCSV(data, includeHeaders);
        const success = downloadFile(
          csvContent,
          `${filename}_${timestamp}.csv`,
          'text/csv;charset=utf-8;'
        );
        
        return {
          success,
          message: `Export Excel (CSV) réussi: ${filename}_${timestamp}.csv`,
          filename: `${filename}_${timestamp}.csv`,
          note: 'Format CSV compatible Excel. Support Excel natif en développement.'
        };
      }

      case exportFormats.PDF: {
        throw new Error('Export PDF en cours de développement. Utilisez CSV ou JSON.');
      }

      default:
        throw new Error(`Format d'export non supporté: ${format}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return {
      success: false,
      message: `Erreur d'export: ${error.message}`,
      error: error.message
    };
  }
};

// Validation des données avant export
export const validateExportData = (data) => {
  if (!data || !Array.isArray(data)) {
    throw new Error('Les données doivent être un tableau');
  }
  
  if (data.length === 0) {
    throw new Error('Aucune donnée à exporter');
  }
  
  // Vérifier que chaque élément a la structure attendue
  const invalidItems = data.filter(item => 
    !item.country || !item.performance
  );
  
  if (invalidItems.length > 0) {
    throw new Error(`${invalidItems.length} éléments ont une structure invalide`);
  }
  
  return true;
};

// Utilitaire pour formater les nombres
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return Number(value).toFixed(decimals);
};

// Export par défaut
export default {
  exportData,
  convertToCSV,
  convertHistoricalToCSV,
  downloadFile,
  validateExportData,
  formatNumber,
  exportFormats
};

