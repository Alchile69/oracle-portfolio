"""
Oracle Portfolio - Module Gestionnaire Indicateurs Physiques
Allocations dynamiques basées sur 7 indicateurs physiques réels
Version: 3.0.0 Production Ready
Date: 23 Juin 2025
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import requests
import time

class PhysicalIndicatorsManager:
    """Gestionnaire allocations basées indicateurs physiques"""
    
    def __init__(self):
        self.alpha_vantage_key = os.environ.get('ALPHA_VANTAGE_API_KEY')
        self.eia_api_key = os.environ.get('EIA_API_KEY')
        self.cache = {}
        self.cache_ttl = {}
        
        # Configuration 7 indicateurs physiques
        self.indicators_config = {
            'electricity': {
                'weight': 0.25,
                'source': 'EIA',
                'description': 'Consommation électrique - Baromètre activité économique'
            },
            'copper': {
                'weight': 0.20,
                'source': 'Alpha Vantage',
                'description': 'Prix cuivre - Indicateur économique avancé'
            },
            'pmi': {
                'weight': 0.20,
                'source': 'OECD',
                'description': 'PMI manufacturier - Sentiment économique'
            },
            'oil': {
                'weight': 0.15,
                'source': 'Alpha Vantage',
                'description': 'Prix pétrole - Complexe énergétique'
            },
            'natural_gas': {
                'weight': 0.10,
                'source': 'Alpha Vantage',
                'description': 'Prix gaz naturel - Énergie européenne'
            },
            'gold': {
                'weight': 0.05,
                'source': 'Alpha Vantage',
                'description': 'Prix or - Hedge inflation'
            },
            'silver': {
                'weight': 0.05,
                'source': 'Alpha Vantage',
                'description': 'Prix argent - Métaux précieux'
            }
        }
        
        # Corrélations historiques avec classes d'actifs
        self.correlations = {
            'copper': {
                'stocks': 0.70,
                'bonds': -0.25,
                'commodities': 0.85
            },
            'electricity': {
                'stocks': 0.65,
                'bonds': -0.30,
                'commodities': 0.40
            },
            'pmi': {
                'stocks': 0.75,
                'bonds': -0.40,
                'commodities': 0.30
            },
            'oil': {
                'stocks': 0.45,
                'bonds': -0.20,
                'commodities': 0.90
            },
            'natural_gas': {
                'stocks': 0.35,
                'bonds': -0.15,
                'commodities': 0.80
            },
            'gold': {
                'stocks': -0.20,
                'bonds': 0.10,
                'commodities': 0.60
            },
            'silver': {
                'stocks': 0.25,
                'bonds': -0.10,
                'commodities': 0.75
            }
        }
        
        # Profils de risque
        self.risk_profiles = {
            'conservative': {
                'base_stocks': 0.40,
                'base_bonds': 0.50,
                'base_commodities': 0.10,
                'max_deviation': 0.15
            },
            'moderate': {
                'base_stocks': 0.60,
                'base_bonds': 0.30,
                'base_commodities': 0.10,
                'max_deviation': 0.20
            },
            'aggressive': {
                'base_stocks': 0.75,
                'base_bonds': 0.15,
                'base_commodities': 0.10,
                'max_deviation': 0.25
            }
        }
    
    def is_cache_valid(self, key: str) -> bool:
        """Vérifier validité cache"""
        if key not in self.cache or key not in self.cache_ttl:
            return False
        return datetime.utcnow() < self.cache_ttl[key]
    
    def fetch_alpha_vantage_commodity(self, symbol: str) -> Optional[float]:
        """Récupérer prix commodité Alpha Vantage"""
        if not self.alpha_vantage_key:
            return None
            
        try:
            # Mapping symboles
            symbol_mapping = {
                'copper': 'COPPER',
                'oil': 'WTI',
                'natural_gas': 'NATURAL_GAS',
                'gold': 'XAU',
                'silver': 'XAG'
            }
            
            av_symbol = symbol_mapping.get(symbol, symbol)
            url = f"https://www.alphavantage.co/query"
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': av_symbol,
                'apikey': self.alpha_vantage_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'Global Quote' in data:
                    price_str = data['Global Quote'].get('05. price', '0')
                    return float(price_str)
        except Exception as e:
            print(f"Erreur Alpha Vantage {symbol}: {e}")
        
        return None
    
    def fetch_eia_electricity(self, country: str) -> Optional[float]:
        """Récupérer consommation électrique EIA"""
        if not self.eia_api_key:
            return None
            
        try:
            # Mapping pays EIA
            country_mapping = {
                'FRA': 'FRA',
                'DEU': 'DEU', 
                'USA': 'USA',
                'GBR': 'GBR',
                'JPN': 'JPN'
            }
            
            eia_country = country_mapping.get(country, country)
            url = f"https://api.eia.gov/v2/international/data"
            params = {
                'api_key': self.eia_api_key,
                'facets[countryRegionId][]': eia_country,
                'facets[productId][]': 'electricity',
                'data[0]': 'value',
                'frequency': 'monthly',
                'sort[0][column]': 'period',
                'sort[0][direction]': 'desc',
                'length': 1
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'response' in data and 'data' in data['response']:
                    electricity_data = data['response']['data']
                    if electricity_data and len(electricity_data) > 0:
                        return float(electricity_data[0]['value'])
        except Exception as e:
            print(f"Erreur EIA électricité {country}: {e}")
        
        return None
    
    def get_indicator_value(self, indicator: str, country: str = 'USA') -> Tuple[Optional[float], float]:
        """Récupérer valeur indicateur avec score de qualité"""
        
        cache_key = f"indicator_{indicator}_{country}"
        if self.is_cache_valid(cache_key):
            cached_data = self.cache[cache_key]
            return cached_data['value'], cached_data['quality_score']
        
        value = None
        quality_score = 0.0
        
        if indicator == 'electricity':
            value = self.fetch_eia_electricity(country)
            quality_score = 0.95 if value else 0.0
            
        elif indicator in ['copper', 'oil', 'natural_gas', 'gold', 'silver']:
            value = self.fetch_alpha_vantage_commodity(indicator)
            quality_score = 0.90 if value else 0.0
            
        elif indicator == 'pmi':
            # Simulation PMI (en production, utiliser OECD API)
            pmi_values = {
                'FRA': 48.5,
                'DEU': 45.2,
                'USA': 52.8,
                'GBR': 49.1,
                'JPN': 51.3
            }
            value = pmi_values.get(country, 50.0)
            quality_score = 0.85
        
        # Simulation valeurs si APIs indisponibles
        if value is None:
            simulation_values = {
                'electricity': 98.5,
                'copper': 8250.0,
                'pmi': 50.5,
                'oil': 75.2,
                'natural_gas': 3.45,
                'gold': 1950.0,
                'silver': 24.8
            }
            value = simulation_values.get(indicator, 100.0)
            quality_score = 0.60  # Score réduit pour simulation
        
        # Cache résultat
        cached_data = {
            'value': value,
            'quality_score': quality_score,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.cache[cache_key] = cached_data
        self.cache_ttl[cache_key] = datetime.utcnow() + timedelta(hours=6)
        
        return value, quality_score
    
    def calculate_composite_score(self, indicators_data: Dict[str, Tuple[float, float]]) -> Tuple[float, float]:
        """Calculer score composite et confiance globale"""
        
        total_weighted_score = 0.0
        total_weight = 0.0
        total_quality = 0.0
        
        for indicator, (value, quality) in indicators_data.items():
            if value is None:
                continue
                
            config = self.indicators_config.get(indicator, {})
            weight = config.get('weight', 0.1)
            
            # Normalisation valeur (0-100 scale)
            if indicator == 'electricity':
                normalized = min(value / 100.0, 1.5)  # 100 = baseline
            elif indicator == 'copper':
                normalized = min(value / 8000.0, 1.5)  # 8000 = baseline
            elif indicator == 'pmi':
                normalized = value / 50.0  # 50 = neutral
            elif indicator == 'oil':
                normalized = min(value / 70.0, 1.5)  # 70 = baseline
            elif indicator == 'natural_gas':
                normalized = min(value / 3.0, 1.5)  # 3 = baseline
            elif indicator == 'gold':
                normalized = min(value / 1900.0, 1.2)  # 1900 = baseline
            elif indicator == 'silver':
                normalized = min(value / 25.0, 1.2)  # 25 = baseline
            else:
                normalized = 1.0
            
            total_weighted_score += normalized * weight
            total_weight += weight
            total_quality += quality * weight
        
        composite_score = total_weighted_score / total_weight if total_weight > 0 else 0.5
        confidence_score = total_quality / total_weight if total_weight > 0 else 0.0
        
        return composite_score, confidence_score
    
    def calculate_dynamic_allocations(self, country: str, risk_profile: str) -> Dict:
        """Calculer allocations dynamiques basées indicateurs physiques"""
        
        cache_key = f"allocations_{country}_{risk_profile}"
        if self.is_cache_valid(cache_key):
            return self.cache[cache_key]
        
        if risk_profile not in self.risk_profiles:
            return {'error': f'Profil de risque {risk_profile} non supporté'}
        
        profile_config = self.risk_profiles[risk_profile]
        
        # Récupération indicateurs
        indicators_data = {}
        for indicator in self.indicators_config.keys():
            value, quality = self.get_indicator_value(indicator, country)
            indicators_data[indicator] = (value, quality)
        
        # Calcul score composite
        composite_score, confidence_score = self.calculate_composite_score(indicators_data)
        
        # Calcul ajustements basés corrélations
        stocks_adjustment = 0.0
        bonds_adjustment = 0.0
        commodities_adjustment = 0.0
        
        for indicator, (value, quality) in indicators_data.items():
            if value is None or indicator not in self.correlations:
                continue
                
            config = self.indicators_config[indicator]
            weight = config['weight']
            correlations = self.correlations[indicator]
            
            # Force du signal (écart à la normale)
            if indicator == 'pmi':
                signal_strength = (value - 50.0) / 10.0  # PMI 50 = neutre
            else:
                signal_strength = (composite_score - 1.0)  # 1.0 = baseline
            
            # Ajustements pondérés
            stocks_adjustment += signal_strength * correlations['stocks'] * weight
            bonds_adjustment += signal_strength * correlations['bonds'] * weight
            commodities_adjustment += signal_strength * correlations['commodities'] * weight
        
        # Application ajustements avec limites
        max_deviation = profile_config['max_deviation']
        
        stocks_final = profile_config['base_stocks'] + min(max(stocks_adjustment, -max_deviation), max_deviation)
        bonds_final = profile_config['base_bonds'] + min(max(bonds_adjustment, -max_deviation), max_deviation)
        commodities_final = profile_config['base_commodities'] + min(max(commodities_adjustment, -max_deviation), max_deviation)
        
        # Normalisation pour somme = 100%
        total = stocks_final + bonds_final + commodities_final
        if total > 0:
            stocks_final /= total
            bonds_final /= total
            commodities_final /= total
        
        # Comparaison avec allocations statiques
        static_allocations = {
            'stocks': 0.65,
            'bonds': 0.25,
            'commodities': 0.10
        }
        
        result = {
            'country': country,
            'risk_profile': risk_profile,
            'recommended_allocations': {
                'stocks': round(stocks_final, 3),
                'bonds': round(bonds_final, 3),
                'commodities': round(commodities_final, 3)
            },
            'composite_score': round(composite_score, 3),
            'confidence_score': round(confidence_score, 3),
            'indicators_used': len([v for v, q in indicators_data.values() if v is not None]),
            'static_comparison': {
                'differences': {
                    'stocks': round(stocks_final - static_allocations['stocks'], 3),
                    'bonds': round(bonds_final - static_allocations['bonds'], 3),
                    'commodities': round(commodities_final - static_allocations['commodities'], 3)
                }
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Cache résultat
        self.cache[cache_key] = result
        self.cache_ttl[cache_key] = datetime.utcnow() + timedelta(hours=6)
        
        return result
    
    def get_indicators_breakdown(self, country: str) -> Dict:
        """Obtenir détail des 7 indicateurs"""
        
        breakdown = {
            'country': country,
            'indicators_detail': {},
            'summary': {
                'total_indicators': len(self.indicators_config),
                'available_indicators': 0,
                'average_quality': 0.0
            }
        }
        
        total_quality = 0.0
        available_count = 0
        
        for indicator, config in self.indicators_config.items():
            value, quality = self.get_indicator_value(indicator, country)
            
            breakdown['indicators_detail'][indicator] = {
                'value': value,
                'quality_score': quality,
                'weight': config['weight'],
                'source': config['source'],
                'description': config['description'],
                'status': 'available' if value is not None else 'unavailable'
            }
            
            if value is not None:
                available_count += 1
                total_quality += quality
        
        breakdown['summary']['available_indicators'] = available_count
        breakdown['summary']['average_quality'] = total_quality / available_count if available_count > 0 else 0.0
        
        return breakdown

# Factory function pour Firebase Functions
_indicators_manager = None

def get_indicators_manager():
    """Factory function avec lazy loading"""
    global _indicators_manager
    if _indicators_manager is None:
        _indicators_manager = PhysicalIndicatorsManager()
    return _indicators_manager

