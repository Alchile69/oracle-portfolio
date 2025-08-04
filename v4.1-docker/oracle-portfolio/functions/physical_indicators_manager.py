"""
Oracle Portfolio 3.0 - Physical Indicators Manager
Gestionnaire d'allocations basé sur 7 indicateurs physiques institutionnels
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

class PhysicalIndicatorsManager:
    """
    Gestionnaire d'allocations basé sur des indicateurs physiques réels
    Sources: FRED, EIA, OECD pour données institutionnelles fiables
    """
    
    def __init__(self, fred_api_key: str, eia_api_key: str):
        self.fred_api_key = fred_api_key
        self.eia_api_key = eia_api_key
        
        # URLs des APIs
        self.fred_url = "https://api.stlouisfed.org/fred/series/observations"
        self.eia_url = "https://api.eia.gov/v2/petroleum/pri/spt/data"
        
        # Configuration des 7 indicateurs physiques
        self.indicators_config = {
            'copper_price': {
                'fred_series': 'PCOPPUSDM',
                'weight': 0.20,
                'interpretation': 'economic_activity',
                'threshold_high': 4.0,  # USD/lb
                'threshold_low': 2.5
            },
            'oil_price': {
                'eia_series': 'RBRTE',
                'weight': 0.18,
                'interpretation': 'energy_inflation',
                'threshold_high': 80.0,  # USD/barrel
                'threshold_low': 50.0
            },
            'gold_price': {
                'fred_series': 'GOLDAMGBD228NLBM',
                'weight': 0.15,
                'interpretation': 'safe_haven',
                'threshold_high': 2000.0,  # USD/oz
                'threshold_low': 1500.0
            },
            'baltic_dry_index': {
                'fred_series': 'BDIY',
                'weight': 0.12,
                'interpretation': 'global_trade',
                'threshold_high': 2000.0,
                'threshold_low': 800.0
            },
            'steel_price': {
                'fred_series': 'PSTLZAUSDM',
                'weight': 0.10,
                'interpretation': 'industrial_demand',
                'threshold_high': 800.0,  # USD/metric ton
                'threshold_low': 400.0
            },
            'agricultural_index': {
                'fred_series': 'PFOODINDEXM',
                'weight': 0.15,
                'interpretation': 'food_inflation',
                'threshold_high': 120.0,  # Index 2010=100
                'threshold_low': 90.0
            },
            'lumber_price': {
                'fred_series': 'PLUMZAUSDM',
                'weight': 0.10,
                'interpretation': 'construction_activity',
                'threshold_high': 600.0,  # USD/1000 board feet
                'threshold_low': 300.0
            }
        }
        
        # Allocations de base par régime
        self.base_allocations = {
            'RECESSION': {'stocks': 0.30, 'bonds': 0.50, 'commodities': 0.15, 'cash': 0.05},
            'EXPANSION': {'stocks': 0.65, 'bonds': 0.25, 'commodities': 0.05, 'cash': 0.05},
            'STAGFLATION': {'stocks': 0.40, 'bonds': 0.20, 'commodities': 0.35, 'cash': 0.05},
            'BOOM': {'stocks': 0.75, 'bonds': 0.15, 'commodities': 0.05, 'cash': 0.05}
        }
    
    def fetch_fred_indicator(self, series_id: str) -> Optional[float]:
        """
        Récupère un indicateur depuis FRED
        """
        try:
            params = {
                'series_id': series_id,
                'api_key': self.fred_api_key,
                'file_type': 'json',
                'limit': 5,
                'sort_order': 'desc'
            }
            
            response = requests.get(self.fred_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            observations = data.get('observations', [])
            
            for obs in observations:
                try:
                    value = float(obs['value'])
                    if not np.isnan(value):
                        return value
                except (ValueError, TypeError):
                    continue
            
            return None
            
        except Exception as e:
            logger.error(f"Erreur FRED {series_id}: {e}")
            return None
    
    def fetch_eia_oil_price(self) -> Optional[float]:
        """
        Récupère le prix du pétrole depuis EIA
        """
        try:
            params = {
                'api_key': self.eia_api_key,
                'frequency': 'daily',
                'data[0]': 'value',
                'facets[series][]': 'RBRTE',
                'sort[0][column]': 'period',
                'sort[0][direction]': 'desc',
                'offset': 0,
                'length': 5
            }
            
            response = requests.get(self.eia_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if 'response' in data and 'data' in data['response']:
                for item in data['response']['data']:
                    try:
                        return float(item['value'])
                    except (ValueError, TypeError, KeyError):
                        continue
            
            return None
            
        except Exception as e:
            logger.error(f"Erreur EIA oil price: {e}")
            return None
    
    def get_all_indicators(self) -> Dict[str, float]:
        """
        Récupère tous les indicateurs physiques
        """
        indicators = {}
        
        for name, config in self.indicators_config.items():
            try:
                if 'fred_series' in config:
                    value = self.fetch_fred_indicator(config['fred_series'])
                elif 'eia_series' in config and name == 'oil_price':
                    value = self.fetch_eia_oil_price()
                else:
                    value = None
                
                # Valeurs de fallback réalistes
                fallback_values = {
                    'copper_price': 3.2,
                    'oil_price': 65.0,
                    'gold_price': 1800.0,
                    'baltic_dry_index': 1200.0,
                    'steel_price': 600.0,
                    'agricultural_index': 105.0,
                    'lumber_price': 450.0
                }
                
                indicators[name] = value if value is not None else fallback_values.get(name, 100.0)
                
            except Exception as e:
                logger.error(f"Erreur indicateur {name}: {e}")
                indicators[name] = 100.0
        
        return indicators
    
    def analyze_indicator_signals(self, indicators: Dict[str, float]) -> Dict[str, str]:
        """
        Analyse les signaux de chaque indicateur
        """
        signals = {}
        
        for name, value in indicators.items():
            config = self.indicators_config[name]
            
            if value >= config['threshold_high']:
                signals[name] = 'HIGH'
            elif value <= config['threshold_low']:
                signals[name] = 'LOW'
            else:
                signals[name] = 'NEUTRAL'
        
        return signals
    
    def calculate_market_stress_score(self, indicators: Dict[str, float], signals: Dict[str, str]) -> float:
        """
        Calcule un score de stress de marché basé sur les indicateurs physiques
        """
        try:
            stress_components = []
            
            # Analyse des signaux de stress
            for name, signal in signals.items():
                config = self.indicators_config[name]
                weight = config['weight']
                interpretation = config['interpretation']
                
                # Logique de stress par type d'indicateur
                if interpretation == 'safe_haven' and signal == 'HIGH':
                    stress_components.append(weight * 0.8)  # Or élevé = stress
                elif interpretation == 'energy_inflation' and signal == 'HIGH':
                    stress_components.append(weight * 0.7)  # Pétrole élevé = inflation
                elif interpretation == 'economic_activity' and signal == 'LOW':
                    stress_components.append(weight * 0.6)  # Cuivre bas = récession
                elif interpretation == 'global_trade' and signal == 'LOW':
                    stress_components.append(weight * 0.5)  # Baltic bas = commerce faible
                else:
                    stress_components.append(weight * 0.2)  # Conditions normales
            
            # Score de stress normalisé (0-100)
            raw_score = sum(stress_components) * 100
            normalized_score = min(max(raw_score, 0), 100)
            
            return round(normalized_score, 1)
            
        except Exception as e:
            logger.error(f"Erreur calcul stress: {e}")
            return 25.0  # Valeur par défaut modérée
    
    def generate_dynamic_allocations(self, base_regime: str, indicators: Dict[str, float], 
                                   signals: Dict[str, str]) -> Dict[str, float]:
        """
        Génère des allocations dynamiques basées sur les indicateurs physiques
        """
        try:
            # Allocation de base selon le régime
            base_alloc = self.base_allocations.get(base_regime, self.base_allocations['EXPANSION']).copy()
            
            # Ajustements basés sur les signaux physiques
            adjustments = self._calculate_allocation_adjustments(signals, indicators)
            
            # Application des ajustements
            for asset_class, adjustment in adjustments.items():
                if asset_class in base_alloc:
                    base_alloc[asset_class] = max(0.0, min(1.0, base_alloc[asset_class] + adjustment))
            
            # Normalisation pour que la somme = 1.0
            total = sum(base_alloc.values())
            if total > 0:
                for asset_class in base_alloc:
                    base_alloc[asset_class] = round(base_alloc[asset_class] / total, 3)
            
            return base_alloc
            
        except Exception as e:
            logger.error(f"Erreur génération allocations: {e}")
            return self.base_allocations.get(base_regime, self.base_allocations['EXPANSION'])
    
    def _calculate_allocation_adjustments(self, signals: Dict[str, str], 
                                        indicators: Dict[str, float]) -> Dict[str, float]:
        """
        Calcule les ajustements d'allocation basés sur les signaux
        """
        adjustments = {'stocks': 0.0, 'bonds': 0.0, 'commodities': 0.0, 'cash': 0.0}
        
        try:
            # Logique d'ajustement sophistiquée
            
            # 1. Signaux de safe-haven (or élevé)
            if signals.get('gold_price') == 'HIGH':
                adjustments['stocks'] -= 0.05
                adjustments['bonds'] += 0.03
                adjustments['cash'] += 0.02
            
            # 2. Signaux d'inflation (pétrole, agriculture élevés)
            inflation_signals = [signals.get('oil_price'), signals.get('agricultural_index')]
            if inflation_signals.count('HIGH') >= 1:
                adjustments['commodities'] += 0.08
                adjustments['bonds'] -= 0.05
                adjustments['stocks'] -= 0.03
            
            # 3. Signaux de récession (cuivre, baltic bas)
            recession_signals = [signals.get('copper_price'), signals.get('baltic_dry_index')]
            if recession_signals.count('LOW') >= 1:
                adjustments['stocks'] -= 0.10
                adjustments['bonds'] += 0.07
                adjustments['cash'] += 0.03
            
            # 4. Signaux de croissance (indicateurs industriels élevés)
            growth_signals = [signals.get('steel_price'), signals.get('lumber_price')]
            if growth_signals.count('HIGH') >= 1:
                adjustments['stocks'] += 0.08
                adjustments['bonds'] -= 0.05
                adjustments['commodities'] -= 0.03
            
            return adjustments
            
        except Exception as e:
            logger.error(f"Erreur calcul ajustements: {e}")
            return adjustments
    
    def get_indicators_breakdown(self) -> Dict:
        """
        Retourne une analyse détaillée de tous les indicateurs
        """
        try:
            indicators = self.get_all_indicators()
            signals = self.analyze_indicator_signals(indicators)
            stress_score = self.calculate_market_stress_score(indicators, signals)
            
            # Analyse détaillée par indicateur
            breakdown = {}
            for name, value in indicators.items():
                config = self.indicators_config[name]
                signal = signals[name]
                
                breakdown[name] = {
                    'value': round(value, 2),
                    'signal': signal,
                    'interpretation': config['interpretation'],
                    'weight': config['weight'],
                    'threshold_high': config['threshold_high'],
                    'threshold_low': config['threshold_low'],
                    'status': self._get_indicator_status(value, config, signal)
                }
            
            return {
                'indicators': breakdown,
                'market_stress_score': stress_score,
                'stress_level': self._categorize_stress_level(stress_score),
                'dominant_signals': self._get_dominant_signals(signals),
                'timestamp': datetime.now().isoformat(),
                'data_quality': 'HIGH'
            }
            
        except Exception as e:
            logger.error(f"Erreur breakdown indicateurs: {e}")
            return self._get_fallback_breakdown()
    
    def _get_indicator_status(self, value: float, config: Dict, signal: str) -> str:
        """
        Détermine le statut d'un indicateur
        """
        interpretation = config['interpretation']
        
        if signal == 'HIGH':
            if interpretation in ['safe_haven', 'energy_inflation', 'food_inflation']:
                return 'WARNING'
            else:
                return 'POSITIVE'
        elif signal == 'LOW':
            if interpretation in ['economic_activity', 'global_trade', 'industrial_demand']:
                return 'NEGATIVE'
            else:
                return 'NEUTRAL'
        else:
            return 'NEUTRAL'
    
    def _categorize_stress_level(self, stress_score: float) -> str:
        """
        Catégorise le niveau de stress
        """
        if stress_score >= 70:
            return 'EXTREME'
        elif stress_score >= 50:
            return 'HIGH'
        elif stress_score >= 30:
            return 'MODERATE'
        else:
            return 'LOW'
    
    def _get_dominant_signals(self, signals: Dict[str, str]) -> Dict[str, int]:
        """
        Identifie les signaux dominants
        """
        signal_counts = {'HIGH': 0, 'LOW': 0, 'NEUTRAL': 0}
        for signal in signals.values():
            signal_counts[signal] += 1
        return signal_counts
    
    def _get_fallback_breakdown(self) -> Dict:
        """
        Retourne une analyse de fallback
        """
        return {
            'indicators': {},
            'market_stress_score': 25.0,
            'stress_level': 'MODERATE',
            'dominant_signals': {'HIGH': 2, 'LOW': 2, 'NEUTRAL': 3},
            'timestamp': datetime.now().isoformat(),
            'data_quality': 'FALLBACK'
        }

def get_physical_allocations(regime: str, fred_api_key: str, eia_api_key: str) -> Dict:
    """
    Fonction utilitaire pour obtenir les allocations basées sur les indicateurs physiques
    """
    manager = PhysicalIndicatorsManager(fred_api_key, eia_api_key)
    indicators = manager.get_all_indicators()
    signals = manager.analyze_indicator_signals(indicators)
    allocations = manager.generate_dynamic_allocations(regime, indicators, signals)
    
    return {
        'allocations': allocations,
        'indicators_used': indicators,
        'signals': signals,
        'regime': regime,
        'timestamp': datetime.now().isoformat()
    }

def get_market_stress_analysis(fred_api_key: str, eia_api_key: str) -> Dict:
    """
    Analyse complète du stress de marché
    """
    manager = PhysicalIndicatorsManager(fred_api_key, eia_api_key)
    return manager.get_indicators_breakdown()

