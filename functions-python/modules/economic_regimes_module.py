"""
Oracle Portfolio - Module de Détection des Régimes Économiques
Intégration Firebase Functions pour enrichir getRegime
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class RegimeDetector:
    """
    Détecteur de régimes économiques dynamique pour Oracle Portfolio
    Remplace la logique fixe "EXPANSION" par une analyse sophistiquée
    """
    
    def __init__(self):
        # Matrice des régimes économiques (validée)
        self.regime_matrix = {
            'EXPANSION': {
                'pmi_range': (52, 100),
                'electricity_growth': (2, 15),
                'confidence_threshold': 0.75,
                'allocations': {'stocks': 0.70, 'bonds': 0.20, 'commodities': 0.10}
            },
            'SLOWDOWN': {
                'pmi_range': (48, 52),
                'electricity_growth': (-2, 2),
                'confidence_threshold': 0.65,
                'allocations': {'stocks': 0.50, 'bonds': 0.40, 'commodities': 0.10}
            },
            'CONTRACTION': {
                'pmi_range': (0, 48),
                'electricity_growth': (-15, -2),
                'confidence_threshold': 0.70,
                'allocations': {'stocks': 0.30, 'bonds': 0.60, 'commodities': 0.10}
            },
            'RECOVERY': {
                'pmi_range': (48, 55),
                'electricity_growth': (0, 8),
                'confidence_threshold': 0.60,
                'allocations': {'stocks': 0.65, 'bonds': 0.25, 'commodities': 0.10}
            }
        }
        
        # Mapping pays supportés
        self.supported_countries = {
            'FRA': 'France',
            'DEU': 'Germany', 
            'GBR': 'United Kingdom',
            'USA': 'United States',
            'JPN': 'Japan',
            'ITA': 'Italy',
            'ESP': 'Spain',
            'CAN': 'Canada'
        }
        
        logger.info(f"RegimeDetector initialisé - {len(self.supported_countries)} pays supportés")
    
    def analyze_country_regime(self, country_code: str) -> Dict:
        """
        Analyse le régime économique d'un pays
        
        Args:
            country_code: Code pays (ex: 'FRA', 'USA')
            
        Returns:
            Dict avec régime détecté, confiance, position matrice, allocations
        """
        
        if country_code not in self.supported_countries:
            logger.warning(f"Pays {country_code} non supporté")
            return self._get_default_regime(country_code)
        
        try:
            # Récupération des indicateurs économiques
            indicators = self._fetch_economic_indicators(country_code)
            
            # Détection du régime basée sur les indicateurs
            regime_analysis = self._detect_regime(indicators, country_code)
            
            # Calcul de la confiance
            confidence_score = self._calculate_confidence(indicators, regime_analysis['regime'])
            
            # Position dans la matrice économique
            matrix_position = self._get_matrix_position(indicators)
            
            # Allocations recommandées
            allocations = self._get_recommended_allocations(regime_analysis['regime'], country_code)
            
            return {
                'country_code': country_code,
                'country_name': self.supported_countries[country_code],
                'current_regime': regime_analysis['regime'],
                'confidence_score': round(confidence_score, 2),
                'matrix_position': matrix_position,
                'recommended_allocations': allocations,
                'indicators': indicators,
                'analysis_date': datetime.utcnow().isoformat(),
                'methodology': 'PMI + Electricity Growth + Economic Matrix'
            }
            
        except Exception as e:
            logger.error(f"Erreur analyse régime {country_code}: {str(e)}")
            return self._get_default_regime(country_code)
    
    def _fetch_economic_indicators(self, country_code: str) -> Dict:
        """
        Récupère les indicateurs économiques pour un pays
        
        En production: connecter aux vraies APIs (OECD PMI, EIA, etc.)
        En démo: données simulées réalistes
        """
        
        # Simulation de données réalistes basées sur tendances actuelles
        base_indicators = {
            'FRA': {'pmi': 44.8, 'electricity_growth': -1.2, 'unemployment': 7.3},
            'DEU': {'pmi': 45.2, 'electricity_growth': -2.1, 'unemployment': 5.9},
            'GBR': {'pmi': 47.3, 'electricity_growth': -0.8, 'unemployment': 4.2},
            'USA': {'pmi': 48.8, 'electricity_growth': 1.5, 'unemployment': 3.7},
            'JPN': {'pmi': 49.1, 'electricity_growth': 0.3, 'unemployment': 2.6},
            'ITA': {'pmi': 46.5, 'electricity_growth': -1.8, 'unemployment': 8.1},
            'ESP': {'pmi': 48.2, 'electricity_growth': -0.5, 'unemployment': 12.1},
            'CAN': {'pmi': 49.7, 'electricity_growth': 2.1, 'unemployment': 5.8}
        }
        
        indicators = base_indicators.get(country_code, base_indicators['FRA'])
        
        # Ajout de variation aléatoire réaliste
        import random
        indicators['pmi'] += random.uniform(-1.0, 1.0)
        indicators['electricity_growth'] += random.uniform(-0.5, 0.5)
        
        # Indicateurs dérivés
        indicators['pmi_trend'] = 'improving' if indicators['pmi'] > 48 else 'deteriorating'
        indicators['growth_momentum'] = 'positive' if indicators['electricity_growth'] > 0 else 'negative'
        
        logger.info(f"Indicateurs {country_code}: PMI={indicators['pmi']:.1f}, Elec={indicators['electricity_growth']:.1f}%")
        
        return indicators
    
    def _detect_regime(self, indicators: Dict, country_code: str) -> Dict:
        """
        Détecte le régime économique basé sur les indicateurs
        """
        
        pmi = indicators['pmi']
        electricity_growth = indicators['electricity_growth']
        
        # Logique de détection sophistiquée
        regime_scores = {}
        
        for regime_name, regime_config in self.regime_matrix.items():
            pmi_min, pmi_max = regime_config['pmi_range']
            elec_min, elec_max = regime_config['electricity_growth']
            
            # Score PMI (0-1)
            if pmi_min <= pmi <= pmi_max:
                pmi_score = 1.0
            else:
                # Distance pondérée si hors range
                distance = min(abs(pmi - pmi_min), abs(pmi - pmi_max))
                pmi_score = max(0, 1 - (distance / 10))
            
            # Score électricité (0-1)
            if elec_min <= electricity_growth <= elec_max:
                elec_score = 1.0
            else:
                distance = min(abs(electricity_growth - elec_min), abs(electricity_growth - elec_max))
                elec_score = max(0, 1 - (distance / 5))
            
            # Score composite pondéré
            regime_scores[regime_name] = (pmi_score * 0.7) + (elec_score * 0.3)
        
        # Régime avec le score le plus élevé
        best_regime = max(regime_scores, key=regime_scores.get)
        best_score = regime_scores[best_regime]
        
        logger.info(f"Régime détecté {country_code}: {best_regime} (score: {best_score:.2f})")
        
        return {
            'regime': best_regime,
            'score': best_score,
            'all_scores': regime_scores
        }
    
    def _calculate_confidence(self, indicators: Dict, regime: str) -> float:
        """
        Calcule le score de confiance de la détection
        """
        
        pmi = indicators['pmi']
        electricity_growth = indicators['electricity_growth']
        
        regime_config = self.regime_matrix[regime]
        
        # Confiance basée sur la position dans les ranges
        pmi_min, pmi_max = regime_config['pmi_range']
        elec_min, elec_max = regime_config['electricity_growth']
        
        # Distance au centre des ranges (plus proche = plus confiant)
        pmi_center = (pmi_min + pmi_max) / 2
        elec_center = (elec_min + elec_max) / 2
        
        pmi_distance = abs(pmi - pmi_center) / ((pmi_max - pmi_min) / 2)
        elec_distance = abs(electricity_growth - elec_center) / ((elec_max - elec_min) / 2)
        
        # Confiance inverse de la distance (0-1)
        pmi_confidence = max(0, 1 - pmi_distance)
        elec_confidence = max(0, 1 - elec_distance)
        
        # Confiance composite
        confidence = (pmi_confidence * 0.7) + (elec_confidence * 0.3)
        
        # Ajustement pour cohérence des indicateurs
        if indicators['pmi_trend'] == indicators['growth_momentum']:
            confidence += 0.1  # Bonus cohérence
        
        return min(1.0, confidence)
    
    def _get_matrix_position(self, indicators: Dict) -> Dict:
        """
        Détermine la position dans la matrice économique
        """
        
        pmi = indicators['pmi']
        electricity_growth = indicators['electricity_growth']
        
        # Quadrants de la matrice économique
        if pmi >= 50 and electricity_growth >= 0:
            quadrant = 'EXPANSION'
            position = 'top_right'
        elif pmi >= 50 and electricity_growth < 0:
            quadrant = 'SLOWDOWN'
            position = 'top_left'
        elif pmi < 50 and electricity_growth < 0:
            quadrant = 'CONTRACTION'
            position = 'bottom_left'
        else:  # pmi < 50 and electricity_growth >= 0
            quadrant = 'RECOVERY'
            position = 'bottom_right'
        
        return {
            'quadrant': quadrant,
            'position': position,
            'pmi_level': 'above_50' if pmi >= 50 else 'below_50',
            'growth_direction': 'positive' if electricity_growth >= 0 else 'negative',
            'coordinates': {
                'x': round((pmi - 40) / 20, 2),  # Normalisation 40-60 → 0-1
                'y': round((electricity_growth + 10) / 20, 2)  # Normalisation -10/+10 → 0-1
            }
        }
    
    def _get_recommended_allocations(self, regime: str, country_code: str) -> Dict:
        """
        Retourne les allocations recommandées pour le régime détecté
        """
        
        base_allocations = self.regime_matrix[regime]['allocations'].copy()
        
        # Ajustements spécifiques par pays (optionnel)
        country_adjustments = {
            'JPN': {'bonds': +0.05, 'stocks': -0.05},  # Préférence obligations Japon
            'USA': {'stocks': +0.05, 'bonds': -0.05},  # Préférence actions USA
            'DEU': {'commodities': +0.02, 'stocks': -0.02}  # Exposition commodités Allemagne
        }
        
        if country_code in country_adjustments:
            adjustments = country_adjustments[country_code]
            for asset, adjustment in adjustments.items():
                if asset in base_allocations:
                    base_allocations[asset] = max(0, min(1, base_allocations[asset] + adjustment))
        
        # Normalisation pour s'assurer que la somme = 1
        total = sum(base_allocations.values())
        normalized_allocations = {k: round(v/total, 3) for k, v in base_allocations.items()}
        
        return {
            'allocations': normalized_allocations,
            'regime_basis': regime,
            'country_adjusted': country_code in country_adjustments,
            'risk_level': self._get_risk_level(regime),
            'rebalancing_frequency': self._get_rebalancing_frequency(regime)
        }
    
    def _get_risk_level(self, regime: str) -> str:
        """Détermine le niveau de risque selon le régime"""
        risk_mapping = {
            'EXPANSION': 'moderate_high',
            'SLOWDOWN': 'moderate',
            'CONTRACTION': 'low',
            'RECOVERY': 'moderate_high'
        }
        return risk_mapping.get(regime, 'moderate')
    
    def _get_rebalancing_frequency(self, regime: str) -> str:
        """Détermine la fréquence de rééquilibrage selon le régime"""
        frequency_mapping = {
            'EXPANSION': 'quarterly',
            'SLOWDOWN': 'monthly',
            'CONTRACTION': 'monthly',
            'RECOVERY': 'bi_monthly'
        }
        return frequency_mapping.get(regime, 'quarterly')
    
    def _get_default_regime(self, country_code: str) -> Dict:
        """Retourne un régime par défaut en cas d'erreur"""
        
        return {
            'country_code': country_code,
            'country_name': self.supported_countries.get(country_code, 'Unknown'),
            'current_regime': 'SLOWDOWN',  # Régime conservateur par défaut
            'confidence_score': 0.50,
            'matrix_position': {
                'quadrant': 'SLOWDOWN',
                'position': 'center',
                'coordinates': {'x': 0.5, 'y': 0.5}
            },
            'recommended_allocations': {
                'allocations': {'stocks': 0.50, 'bonds': 0.40, 'commodities': 0.10},
                'regime_basis': 'SLOWDOWN',
                'risk_level': 'moderate'
            },
            'indicators': {'pmi': 50.0, 'electricity_growth': 0.0},
            'analysis_date': datetime.utcnow().isoformat(),
            'error': 'Données non disponibles - régime par défaut'
        }
    
    def get_regime_history(self, country_code: str, months: int = 12) -> List[Dict]:
        """
        Récupère l'historique des régimes pour un pays
        
        Args:
            country_code: Code pays
            months: Nombre de mois d'historique
            
        Returns:
            Liste des régimes historiques
        """
        
        history = []
        current_date = datetime.utcnow()
        
        for i in range(months):
            month_date = current_date - timedelta(days=i * 30)
            
            # Simulation d'historique réaliste
            # En production: récupérer depuis base de données
            regime_data = self.analyze_country_regime(country_code)
            regime_data['analysis_date'] = month_date.isoformat()
            
            history.append(regime_data)
        
        return sorted(history, key=lambda x: x['analysis_date'], reverse=True)
    
    def get_multi_country_analysis(self, country_codes: List[str]) -> Dict:
        """
        Analyse les régimes pour plusieurs pays
        
        Args:
            country_codes: Liste des codes pays
            
        Returns:
            Dict avec analyses par pays et synthèse globale
        """
        
        results = {}
        regime_distribution = {}
        
        for country in country_codes:
            if country in self.supported_countries:
                analysis = self.analyze_country_regime(country)
                results[country] = analysis
                
                regime = analysis['current_regime']
                regime_distribution[regime] = regime_distribution.get(regime, 0) + 1
        
        # Synthèse globale
        total_countries = len(results)
        dominant_regime = max(regime_distribution, key=regime_distribution.get) if regime_distribution else 'UNKNOWN'
        
        global_synthesis = {
            'dominant_regime': dominant_regime,
            'regime_distribution': regime_distribution,
            'countries_analyzed': total_countries,
            'global_confidence': sum(r['confidence_score'] for r in results.values()) / total_countries if results else 0,
            'analysis_date': datetime.utcnow().isoformat()
        }
        
        return {
            'countries': results,
            'global_synthesis': global_synthesis,
            'methodology': 'Multi-country regime analysis'
        }

# Fonction utilitaire pour Firebase Functions
def create_regime_detector():
    """Factory function pour créer une instance RegimeDetector"""
    return RegimeDetector()

# Test du module
if __name__ == "__main__":
    detector = RegimeDetector()
    
    # Test analyse France
    result = detector.analyze_country_regime('FRA')
    print(f"Régime France: {result['current_regime']} (confiance: {result['confidence_score']})")
    
    # Test multi-pays
    countries = ['FRA', 'DEU', 'USA', 'JPN']
    multi_analysis = detector.get_multi_country_analysis(countries)
    print(f"Régime dominant: {multi_analysis['global_synthesis']['dominant_regime']}")

