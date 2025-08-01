import type { NextApiRequest, NextApiResponse } from 'next';

// Types
interface RegimeData {
  country: string;
  regime: 'EXPANSION' | 'RECOVERY' | 'STAGFLATION' | 'RECESSION';
  confidence: number;
  growthScore: number;
  inflationScore: number;
  unemploymentRate: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  indicators: {
    electricity: number;
    pmi: number;
    maritime: number;
    energy: number;
    yields: number;
    spreads: number;
    vix: number;
  };
}

// Données simulées par pays
const regimeDataByCountry: Record<string, RegimeData> = {
  'France': {
    country: 'France',
    regime: 'EXPANSION',
    confidence: 85,
    growthScore: 2.5,
    inflationScore: 2.8,
    unemploymentRate: 7.5,
    lastUpdated: new Date().toISOString(),
    trend: 'up',
    indicators: {
      electricity: 2.3,
      pmi: 52.1,
      maritime: 1.8,
      energy: 5.2,
      yields: 3.85,
      spreads: -0.15,
      vix: 18.2
    }
  },
  'Germany': {
    country: 'Germany',
    regime: 'RECOVERY',
    confidence: 78,
    growthScore: 1.2,
    inflationScore: 1.5,
    unemploymentRate: 5.8,
    lastUpdated: new Date().toISOString(),
    trend: 'stable',
    indicators: {
      electricity: 1.8,
      pmi: 48.5,
      maritime: 2.1,
      energy: 3.8,
      yields: 2.95,
      spreads: 0.25,
      vix: 16.8
    }
  },
  'United States': {
    country: 'United States',
    regime: 'EXPANSION',
    confidence: 92,
    growthScore: 2.8,
    inflationScore: 4.2,
    unemploymentRate: 3.7,
    lastUpdated: new Date().toISOString(),
    trend: 'up',
    indicators: {
      electricity: 3.1,
      pmi: 54.2,
      maritime: 2.5,
      energy: 6.8,
      yields: 4.25,
      spreads: -0.35,
      vix: 15.4
    }
  },
  'United Kingdom': {
    country: 'United Kingdom',
    regime: 'RECESSION',
    confidence: 68,
    growthScore: -0.5,
    inflationScore: 1.2,
    unemploymentRate: 4.2,
    lastUpdated: new Date().toISOString(),
    trend: 'down',
    indicators: {
      electricity: -1.2,
      pmi: 45.8,
      maritime: 0.5,
      energy: 2.1,
      yields: 4.15,
      spreads: 0.85,
      vix: 22.1
    }
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { country } = req.query;

    try {
      if (country && typeof country === 'string') {
        // Retourner les données pour un pays spécifique
        const regimeData = regimeDataByCountry[country];
        
        if (!regimeData) {
          return res.status(404).json({ 
            error: 'Pays non trouvé',
            availableCountries: Object.keys(regimeDataByCountry)
          });
        }

        return res.status(200).json(regimeData);
      } else {
        // Retourner toutes les données
        return res.status(200).json(regimeDataByCountry);
      }
    } catch (error) {
      console.error('Erreur API régimes:', error);
      return res.status(500).json({ 
        error: 'Erreur serveur',
        message: 'Impossible de récupérer les données des régimes'
      });
    }
  }

  // Méthode non supportée
  res.setHeader('Allow', ['GET', 'OPTIONS']);
  res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
}

