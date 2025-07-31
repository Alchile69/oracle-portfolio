import React from 'react';
import Head from 'next/head';
import ConfigurationTabs from '@/components/ConfigurationTabs';

export default function Configuration() {
  const handleSave = (config: any) => {
    console.log('Configuration sauvegardée:', config);
    // Ici on pourrait envoyer la config vers une API
  };

  const handleReset = () => {
    console.log('Configuration réinitialisée');
    // Réinitialiser toutes les configurations
  };

  const handleExport = () => {
    // Exporter toute la configuration
    const allConfig = {
      general: JSON.parse(localStorage.getItem('oracle-general-config') || '{}'),
      indicators: JSON.parse(localStorage.getItem('oracle-indicators-config') || '[]'),
      formulas: JSON.parse(localStorage.getItem('oracle-formulas-config') || '[]'),
      regimes: JSON.parse(localStorage.getItem('oracle-regimes-config') || '[]'),
      plugins: JSON.parse(localStorage.getItem('oracle-plugins-config') || '[]'),
      exportDate: new Date().toISOString(),
      version: '4.1.0'
    };

    const dataStr = JSON.stringify(allConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `oracle-portfolio-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        
        // Importer chaque section de configuration
        if (config.general) {
          localStorage.setItem('oracle-general-config', JSON.stringify(config.general));
        }
        if (config.indicators) {
          localStorage.setItem('oracle-indicators-config', JSON.stringify(config.indicators));
        }
        if (config.formulas) {
          localStorage.setItem('oracle-formulas-config', JSON.stringify(config.formulas));
        }
        if (config.regimes) {
          localStorage.setItem('oracle-regimes-config', JSON.stringify(config.regimes));
        }
        if (config.plugins) {
          localStorage.setItem('oracle-plugins-config', JSON.stringify(config.plugins));
        }

        alert('Configuration importée avec succès ! Rechargez la page pour voir les changements.');
        window.location.reload();
      } catch (error) {
        alert('Erreur lors de l\'import de la configuration');
        console.error('Erreur import:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Head>
        <title>Configuration - Oracle Portfolio v4.1</title>
        <meta name="description" content="Configuration avancée d'Oracle Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <ConfigurationTabs
        onSave={handleSave}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
      />
    </>
  );
}

