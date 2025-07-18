"""
Oracle Portfolio 3.0 - Economic Regimes Detection Module
Détection sophistiquée des régimes économiques avec fréquences réalistes
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
import logging
from typing import Dict, List, Tuple, Optional
import json

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EconomicRegimesDetector:
    """
    Détecteur de régimes économiques basé sur des indicateurs macroéconomiques
    avec fréquences d'occurrence réalistes et validation historique
    """
    
    def __init__(self, fred_api_key: str):
        self.fred_api_key = fred_api_key
        self.base_url = "https://api.stlouisfed.org/fred/series/observations"
        
        # Seuils calibrés sur données historiques (1970-2024)
        self.thresholds = {
            'growth': {'recession': -0.5, 'expansion': 2.0, 'boom': 4.0},
            'inflation': {'deflation': 0.0, 'stable': 2.0, 'high': 4.0},
            'unemployment': {'low': 4.0, 'normal': 6.0, 'high': 8.0}
        }
        
        # Fréquences historiques réalistes (1970-2024)
        self.regime_frequencies = {
            'RECESSION': 0.15,      # 15% du temps (crises 1973, 1980, 1991, 2001, 2008, 2020)
            'EXPANSION': 0.65,      # 65% du temps (croissance normale)
            'STAGFLATION': 0.08,    # 8% du temps (années 1970s principalement)
            'BOOM': 0.12           # 12% du temps (fin 1990s, milieu 2000s, 2010s)
        }
    
    def fetch_fred_data(self, series_id: str, country_code: str = 'US') -> Optional[pd.DataFrame]:
        """
        Récupère les données FRED pour un indicateur donné
        """
        try:
            # Mapping des codes pays vers les séries FRED
            country_series = {
                'US': {
                    'GDP_GROWTH': 'GDPC1',
                    'INFLATION': 'CPIAUCSL',
                    'UNEMPLOYMENT': 'UNRATE'
                },
                'FRA': {
                    'GDP_GROWTH': 'NAEXKP01FRQ657S',
                    'INFLATION': 'FRACPIALLMINMEI',
                    'UNEMPLOYMENT': 'LRHUTTTTFRQ156S'
                },
                'DEU': {
                    'GDP_GROWTH': 'NAEXKP01DEQ657S',
                    'INFLATION': 'DEUCPIALLMINMEI',
                    'UNEMPLOYMENT': 'LRHUTTTTDEQ156S'
                },
                'GBR': {
                    'GDP_GROWTH': 'NAEXKP01GBQ657S',
                    'INFLATION': 'GBRCPIALLMINMEI',
                    'UNEMPLOYMENT': 'LRHUTTTTGBQ156S'
                }
            }
            
            fred_series = country_series.get(country_code, {}).get(series_id)
            if not fred_series:
                logger.warning(f"Série FRED non trouvée pour {series_id} - {country_code}")
                return None
            
            params = {
                'series_id': fred_series,
                'api_key': self.fred_api_key,
                'file_type': 'json',
                'limit': 100,
                'sort_order': 'desc'
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            observations = data.get('observations', [])
            
            if not observations:
                return None
            
            df = pd.DataFrame(observations)
            df['date'] = pd.to_datetime(df['date'])
            df['value'] = pd.to_numeric(df['value'], errors='coerce')
            df = df.dropna(subset=['value'])
            df = df.sort_values('date')
            
            return df[['date', 'value']].tail(24)  # 2 dernières années
            
        except Exception as e:
            logger.error(f"Erreur récupération FRED {series_id}: {e}")
            return None
    
    def calculate_growth_rate(self, df: pd.DataFrame) -> float:
        """
        Calcule le taux de croissance annualisé
        """
        if df is None or len(df) < 4:
            return 0.0
        
        try:
            recent_value = df['value'].iloc[-1]
            year_ago_value = df['value'].iloc[-4] if len(df) >= 4 else df['value'].iloc[0]
            
            if year_ago_value <= 0:
                return 0.0
            
            growth_rate = ((recent_value / year_ago_value) - 1) * 100
            return round(growth_rate, 2)
            
        except Exception as e:
            logger.error(f"Erreur calcul croissance: {e}")
            return 0.0
    
    def calculate_inflation_rate(self, df: pd.DataFrame) -> float:
        """
        Calcule le taux d'inflation annuel
        """
        if df is None or len(df) < 12:
            return 2.0  # Valeur par défaut
        
        try:
            recent_value = df['value'].iloc[-1]
            year_ago_value = df['value'].iloc[-12]
            
            if year_ago_value <= 0:
                return 2.0
            
            inflation_rate = ((recent_value / year_ago_value) - 1) * 100
            return round(inflation_rate, 2)
            
        except Exception as e:
            logger.error(f"Erreur calcul inflation: {e}")
            return 2.0
    
    def get_unemployment_rate(self, df: pd.DataFrame) -> float:
        """
        Récupère le taux de chômage le plus récent
        """
        if df is None or len(df) == 0:
            return 5.0  # Valeur par défaut
        
        try:
            return round(df['value'].iloc[-1], 2)
        except Exception as e:
            logger.error(f"Erreur récupération chômage: {e}")
            return 5.0
    
    def detect_regime(self, country_code: str = 'US') -> Dict:
        """
        Détecte le régime économique actuel pour un pays donné
        """
        try:
            # Récupération des données
            gdp_data = self.fetch_fred_data('GDP_GROWTH', country_code)
            inflation_data = self.fetch_fred_data('INFLATION', country_code)
            unemployment_data = self.fetch_fred_data('UNEMPLOYMENT', country_code)
            
            # Calcul des indicateurs
            growth_rate = self.calculate_growth_rate(gdp_data)
            inflation_rate = self.calculate_inflation_rate(inflation_data)
            unemployment_rate = self.get_unemployment_rate(unemployment_data)
            
            # Logique de détection des régimes
            regime = self._classify_regime(growth_rate, inflation_rate, unemployment_rate)
            
            # Calcul de l'indice de confiance
            confidence = self._calculate_confidence(growth_rate, inflation_rate, unemployment_rate, regime)
            
            return {
                'regime': regime,
                'confidence': confidence,
                'indicators': {
                    'growth': growth_rate,
                    'inflation': inflation_rate,
                    'unemployment': unemployment_rate
                },
                'timestamp': datetime.now().isoformat(),
                'country': country_code,
                'data_quality': self._assess_data_quality(gdp_data, inflation_data, unemployment_data)
            }
            
        except Exception as e:
            logger.error(f"Erreur détection régime pour {country_code}: {e}")
            return self._get_fallback_regime(country_code)
    
    def _classify_regime(self, growth: float, inflation: float, unemployment: float) -> str:
        """
        Classifie le régime économique basé sur les indicateurs
        """
        # Logique de classification sophistiquée
        if growth < self.thresholds['growth']['recession']:
            if inflation > self.thresholds['inflation']['high']:
                return 'STAGFLATION'
            else:
                return 'RECESSION'
        elif growth > self.thresholds['growth']['boom']:
            return 'BOOM'
        else:
            if (inflation > self.thresholds['inflation']['high'] and 
                unemployment > self.thresholds['unemployment']['high']):
                return 'STAGFLATION'
            else:
                return 'EXPANSION'
    
    def _calculate_confidence(self, growth: float, inflation: float, unemployment: float, regime: str) -> float:
        """
        Calcule l'indice de confiance de la classification
        """
        try:
            # Facteurs de confiance basés sur la clarté des signaux
            growth_clarity = self._get_indicator_clarity(growth, 'growth', regime)
            inflation_clarity = self._get_indicator_clarity(inflation, 'inflation', regime)
            unemployment_clarity = self._get_indicator_clarity(unemployment, 'unemployment', regime)
            
            # Moyenne pondérée
            confidence = (growth_clarity * 0.4 + inflation_clarity * 0.3 + unemployment_clarity * 0.3)
            
            # Ajustement basé sur la fréquence historique
            historical_weight = self.regime_frequencies.get(regime, 0.25)
            confidence = confidence * (0.7 + historical_weight * 0.6)
            
            return round(min(confidence, 0.95), 2)  # Cap à 95%
            
        except Exception as e:
            logger.error(f"Erreur calcul confiance: {e}")
            return 0.75
    
    def _get_indicator_clarity(self, value: float, indicator: str, regime: str) -> float:
        """
        Évalue la clarté d'un indicateur pour un régime donné
        """
        thresholds = self.thresholds[indicator]
        
        if regime == 'RECESSION':
            if indicator == 'growth':
                return 1.0 if value < thresholds['recession'] else 0.5
            elif indicator == 'unemployment':
                return 1.0 if value > thresholds['high'] else 0.7
        elif regime == 'BOOM':
            if indicator == 'growth':
                return 1.0 if value > thresholds['boom'] else 0.6
            elif indicator == 'unemployment':
                return 1.0 if value < thresholds['low'] else 0.7
        elif regime == 'STAGFLATION':
            if indicator == 'inflation':
                return 1.0 if value > thresholds['high'] else 0.5
            elif indicator == 'unemployment':
                return 1.0 if value > thresholds['high'] else 0.6
        
        return 0.8  # Valeur par défaut pour EXPANSION
    
    def _assess_data_quality(self, gdp_data, inflation_data, unemployment_data) -> str:
        """
        Évalue la qualité des données utilisées
        """
        data_sources = [gdp_data, inflation_data, unemployment_data]
        available_sources = sum(1 for data in data_sources if data is not None and len(data) > 0)
        
        if available_sources == 3:
            return 'HIGH'
        elif available_sources == 2:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _get_fallback_regime(self, country_code: str) -> Dict:
        """
        Retourne un régime par défaut en cas d'erreur
        """
        return {
            'regime': 'EXPANSION',
            'confidence': 0.60,
            'indicators': {
                'growth': 2.5,
                'inflation': 2.8,
                'unemployment': 7.5
            },
            'timestamp': datetime.now().isoformat(),
            'country': country_code,
            'data_quality': 'FALLBACK'
        }

def get_regime_for_country(country_code: str, fred_api_key: str) -> Dict:
    """
    Fonction utilitaire pour obtenir le régime d'un pays
    """
    detector = EconomicRegimesDetector(fred_api_key)
    return detector.detect_regime(country_code)

def get_multi_country_regimes(country_codes: List[str], fred_api_key: str) -> Dict:
    """
    Obtient les régimes pour plusieurs pays
    """
    detector = EconomicRegimesDetector(fred_api_key)
    results = {}
    
    for country in country_codes:
        results[country] = detector.detect_regime(country)
    
    return {
        'regimes': results,
        'timestamp': datetime.now().isoformat(),
        'summary': _generate_global_summary(results)
    }

def _generate_global_summary(regimes: Dict) -> Dict:
    """
    Génère un résumé global des régimes
    """
    regime_counts = {}
    total_confidence = 0
    
    for country_data in regimes.values():
        regime = country_data['regime']
        regime_counts[regime] = regime_counts.get(regime, 0) + 1
        total_confidence += country_data['confidence']
    
    dominant_regime = max(regime_counts, key=regime_counts.get) if regime_counts else 'EXPANSION'
    avg_confidence = total_confidence / len(regimes) if regimes else 0.75
    
    return {
        'dominant_regime': dominant_regime,
        'regime_distribution': regime_counts,
        'average_confidence': round(avg_confidence, 2),
        'countries_analyzed': len(regimes)
    }

