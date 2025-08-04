"""
Oracle Portfolio - Module d'Ajustement Saisonnier
Intégration Firebase Functions pour améliorer précision prédictions
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class SeasonalAdjustmentEngine:
    """
    Moteur d'ajustement saisonnier pour Oracle Portfolio
    Améliore la précision des indicateurs en tenant compte des variations saisonnières
    """
    
    def __init__(self):
        # Patterns saisonniers par type d'indicateur
        self.seasonal_patterns = {
            'electricity_consumption': {
                'pattern_type': 'winter_peak',
                'peak_months': [12, 1, 2],  # Décembre, Janvier, Février
                'low_months': [5, 6, 7, 8, 9],  # Mai à Septembre
                'amplitude': 0.25  # 25% de variation saisonnière
            },
            'pmi_manufacturing': {
                'pattern_type': 'post_holiday_dip',
                'peak_months': [3, 4, 10, 11],  # Mars, Avril, Octobre, Novembre
                'low_months': [1, 7, 8],  # Janvier, Juillet, Août
                'amplitude': 0.08  # 8% de variation saisonnière
            },
            'maritime_trade': {
                'pattern_type': 'pre_holiday_surge',
                'peak_months': [9, 10, 11],  # Septembre à Novembre
                'low_months': [1, 2],  # Janvier, Février
                'amplitude': 0.15  # 15% de variation saisonnière
            },
            'commodity_prices': {
                'pattern_type': 'harvest_cycle',
                'peak_months': [6, 7, 8],  # Juin à Août
                'low_months': [11, 12, 1],  # Novembre à Janvier
                'amplitude': 0.12  # 12% de variation saisonnière
            }
        }
        
        # Ajustements spécifiques par pays
        self.country_seasonal_adjustments = {
            'FRA': {
                'electricity': {'winter_heating': 1.3, 'summer_cooling': 0.8},
                'pmi': {'august_shutdown': 0.85, 'september_restart': 1.1},
                'tourism_impact': {'summer_months': [6, 7, 8], 'factor': 1.15}
            },
            'DEU': {
                'electricity': {'industrial_shutdown': {'july': 0.9, 'august': 0.85}},
                'pmi': {'export_seasonality': {'q4': 1.1, 'q1': 0.95}},
                'renewable_impact': {'winter_low': 0.7, 'summer_high': 1.2}
            },
            'GBR': {
                'electricity': {'heating_demand': {'winter': 1.4, 'summer': 0.7}},
                'pmi': {'brexit_uncertainty': {'q1': 0.95, 'q4': 1.05}},
                'financial_services': {'bonus_season': {'q1': 1.2, 'q3': 0.9}}
            },
            'USA': {
                'electricity': {'cooling_demand': {'summer': 1.3, 'winter': 0.9}},
                'pmi': {'holiday_impact': {'november': 0.9, 'december': 0.85}},
                'shale_production': {'winter_drilling': 1.1, 'summer_maintenance': 0.95}
            },
            'JPN': {
                'electricity': {'typhoon_season': {'summer': 0.9, 'autumn': 1.1}},
                'pmi': {'golden_week': {'may': 0.8}, 'year_end': {'december': 0.9}},
                'import_seasonality': {'energy_winter': 1.2, 'materials_spring': 1.1}
            }
        }
        
        # Configuration de l'ajustement
        self.adjustment_config = {
            'smoothing_window': 3,  # Fenêtre de lissage en mois
            'trend_detection_period': 12,  # Période de détection de tendance
            'outlier_threshold': 2.5,  # Seuil de détection d'outliers (écarts-types)
            'confidence_threshold': 0.7  # Seuil de confiance pour ajustements
        }
        
        logger.info("SeasonalAdjustmentEngine initialisé")
    
    def adjust_electricity_data(self, raw_data: Dict, country_code: str, current_month: int) -> Dict:
        """
        Ajuste les données de consommation électrique pour les variations saisonnières
        
        Args:
            raw_data: Données électricité brutes
            country_code: Code pays
            current_month: Mois actuel (1-12)
            
        Returns:
            Dict avec données ajustées et métriques
        """
        
        try:
            # Récupération du pattern saisonnier
            pattern = self.seasonal_patterns['electricity_consumption']
            
            # Calcul du facteur saisonnier de base
            base_seasonal_factor = self._calculate_seasonal_factor(
                current_month, pattern['peak_months'], pattern['low_months'], pattern['amplitude']
            )
            
            # Ajustements spécifiques au pays
            country_adjustments = self.country_seasonal_adjustments.get(country_code, {})
            country_factor = self._apply_country_specific_adjustments(
                base_seasonal_factor, country_adjustments.get('electricity', {}), current_month
            )
            
            # Application de l'ajustement
            raw_consumption = raw_data.get('electricity_consumption', 0)
            raw_growth = raw_data.get('electricity_growth', 0)
            
            # Ajustement de la consommation
            adjusted_consumption = raw_consumption / country_factor
            
            # Ajustement de la croissance (plus conservateur)
            growth_adjustment = (country_factor - 1) * 0.5  # Facteur de modération
            adjusted_growth = raw_growth - growth_adjustment
            
            # Recalcul du score électricité
            adjusted_score = max(0, min(1, (adjusted_growth + 5) / 10))
            
            # Métriques d'ajustement
            adjustment_metrics = {
                'seasonal_factor': round(country_factor, 3),
                'adjustment_magnitude': round(abs(country_factor - 1) * 100, 1),
                'confidence_score': self._calculate_adjustment_confidence(country_factor),
                'seasonal_phase': self._identify_seasonal_phase(current_month, pattern)
            }
            
            return {
                'raw_data': raw_data,
                'adjusted_data': {
                    'electricity_consumption': round(adjusted_consumption, 2),
                    'electricity_growth': round(adjusted_growth, 3),
                    'electricity_score': round(adjusted_score, 3),
                    'source': raw_data.get('source', 'unknown') + '_seasonally_adjusted'
                },
                'adjustment_metrics': adjustment_metrics,
                'country_code': country_code,
                'adjustment_month': current_month,
                'adjustment_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur ajustement électricité {country_code}: {str(e)}")
            return {
                'raw_data': raw_data,
                'adjusted_data': raw_data,  # Pas d'ajustement en cas d'erreur
                'error': str(e)
            }
    
    def adjust_pmi_data(self, raw_data: Dict, country_code: str, current_month: int) -> Dict:
        """
        Ajuste les données PMI pour les variations saisonnières
        
        Args:
            raw_data: Données PMI brutes
            country_code: Code pays
            current_month: Mois actuel
            
        Returns:
            Dict avec données PMI ajustées
        """
        
        try:
            # Pattern saisonnier PMI
            pattern = self.seasonal_patterns['pmi_manufacturing']
            
            # Facteur saisonnier de base
            base_seasonal_factor = self._calculate_seasonal_factor(
                current_month, pattern['peak_months'], pattern['low_months'], pattern['amplitude']
            )
            
            # Ajustements pays
            country_adjustments = self.country_seasonal_adjustments.get(country_code, {})
            country_factor = self._apply_country_specific_adjustments(
                base_seasonal_factor, country_adjustments.get('pmi', {}), current_month
            )
            
            # Application ajustement PMI
            raw_pmi = raw_data.get('current_pmi', 50)
            
            # Ajustement additif pour PMI (plus approprié que multiplicatif)
            pmi_adjustment = (country_factor - 1) * 10  # Conversion en points PMI
            adjusted_pmi = raw_pmi - pmi_adjustment
            
            # Contraintes PMI (généralement 20-80)
            adjusted_pmi = max(20, min(80, adjusted_pmi))
            
            # Recalcul score PMI
            adjusted_score = max(0, min(1, (adjusted_pmi - 40) / 20))
            
            # Ajustement de la tendance
            raw_trend = raw_data.get('trend', 'neutral')
            adjusted_trend = self._adjust_pmi_trend(raw_trend, country_factor, current_month)
            
            return {
                'raw_data': raw_data,
                'adjusted_data': {
                    'current_pmi': round(adjusted_pmi, 1),
                    'pmi_score': round(adjusted_score, 3),
                    'trend': adjusted_trend,
                    'source': raw_data.get('source', 'unknown') + '_seasonally_adjusted',
                    'historical_data': raw_data.get('historical_data', [])
                },
                'adjustment_metrics': {
                    'seasonal_factor': round(country_factor, 3),
                    'pmi_adjustment_points': round(pmi_adjustment, 2),
                    'confidence_score': self._calculate_adjustment_confidence(country_factor),
                    'seasonal_phase': self._identify_seasonal_phase(current_month, pattern)
                },
                'country_code': country_code,
                'adjustment_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur ajustement PMI {country_code}: {str(e)}")
            return {
                'raw_data': raw_data,
                'adjusted_data': raw_data,
                'error': str(e)
            }
    
    def adjust_maritime_data(self, raw_data: Dict, country_code: str, current_month: int) -> Dict:
        """
        Ajuste les données maritimes pour les variations saisonnières
        
        Args:
            raw_data: Données maritime brutes
            country_code: Code pays
            current_month: Mois actuel
            
        Returns:
            Dict avec données maritime ajustées
        """
        
        try:
            # Pattern maritime
            pattern = self.seasonal_patterns['maritime_trade']
            
            # Facteur saisonnier
            seasonal_factor = self._calculate_seasonal_factor(
                current_month, pattern['peak_months'], pattern['low_months'], pattern['amplitude']
            )
            
            # Ajustement Baltic Dry Index
            raw_bdi = raw_data.get('baltic_dry_index', 1200)
            adjusted_bdi = raw_bdi / seasonal_factor
            
            # Recalcul score maritime
            country_impact = raw_data.get('country_impact_factor', 0.7)
            adjusted_score = (adjusted_bdi / 2000) * country_impact
            adjusted_score = max(0, min(1, adjusted_score))
            
            return {
                'raw_data': raw_data,
                'adjusted_data': {
                    'baltic_dry_index': int(adjusted_bdi),
                    'maritime_score': round(adjusted_score, 3),
                    'country_impact_factor': country_impact,
                    'interpretation': self._interpret_adjusted_maritime(adjusted_bdi)
                },
                'adjustment_metrics': {
                    'seasonal_factor': round(seasonal_factor, 3),
                    'bdi_adjustment': int(adjusted_bdi - raw_bdi),
                    'seasonal_phase': self._identify_seasonal_phase(current_month, pattern)
                },
                'country_code': country_code,
                'adjustment_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur ajustement maritime {country_code}: {str(e)}")
            return {
                'raw_data': raw_data,
                'adjusted_data': raw_data,
                'error': str(e)
            }
    
    def comprehensive_seasonal_adjustment(self, indicators: Dict, country_code: str) -> Dict:
        """
        Applique l'ajustement saisonnier à tous les indicateurs
        
        Args:
            indicators: Dict avec tous les indicateurs
            country_code: Code pays
            
        Returns:
            Dict avec tous les indicateurs ajustés
        """
        
        try:
            current_month = datetime.utcnow().month
            
            adjusted_indicators = {}
            adjustment_summary = {
                'total_indicators': 0,
                'adjusted_indicators': 0,
                'average_adjustment_magnitude': 0.0,
                'seasonal_phase_summary': {}
            }
            
            # Ajustement électricité
            if 'electricity' in indicators and indicators['electricity']:
                adjusted_electricity = self.adjust_electricity_data(
                    indicators['electricity'], country_code, current_month
                )
                adjusted_indicators['electricity'] = adjusted_electricity
                adjustment_summary['total_indicators'] += 1
                if 'error' not in adjusted_electricity:
                    adjustment_summary['adjusted_indicators'] += 1
                    adjustment_summary['average_adjustment_magnitude'] += adjusted_electricity['adjustment_metrics']['adjustment_magnitude']
            
            # Ajustement PMI
            if 'pmi' in indicators and indicators['pmi']:
                adjusted_pmi = self.adjust_pmi_data(
                    indicators['pmi'], country_code, current_month
                )
                adjusted_indicators['pmi'] = adjusted_pmi
                adjustment_summary['total_indicators'] += 1
                if 'error' not in adjusted_pmi:
                    adjustment_summary['adjusted_indicators'] += 1
            
            # Ajustement maritime
            if 'maritime' in indicators and indicators['maritime']:
                adjusted_maritime = self.adjust_maritime_data(
                    indicators['maritime'], country_code, current_month
                )
                adjusted_indicators['maritime'] = adjusted_maritime
                adjustment_summary['total_indicators'] += 1
                if 'error' not in adjusted_maritime:
                    adjustment_summary['adjusted_indicators'] += 1
            
            # Calcul moyenne ajustements
            if adjustment_summary['adjusted_indicators'] > 0:
                adjustment_summary['average_adjustment_magnitude'] /= adjustment_summary['adjusted_indicators']
                adjustment_summary['average_adjustment_magnitude'] = round(adjustment_summary['average_adjustment_magnitude'], 2)
            
            # Recommandations d'utilisation
            usage_recommendations = self._generate_usage_recommendations(
                adjusted_indicators, adjustment_summary, current_month
            )
            
            return {
                'country_code': country_code,
                'adjustment_month': current_month,
                'raw_indicators': indicators,
                'adjusted_indicators': adjusted_indicators,
                'adjustment_summary': adjustment_summary,
                'usage_recommendations': usage_recommendations,
                'comprehensive_adjustment_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur ajustement complet {country_code}: {str(e)}")
            return {
                'error': str(e),
                'raw_indicators': indicators,
                'adjusted_indicators': indicators  # Fallback
            }
    
    # Méthodes privées utilitaires
    
    def _calculate_seasonal_factor(self, current_month: int, peak_months: List[int], 
                                 low_months: List[int], amplitude: float) -> float:
        """Calcule le facteur saisonnier de base"""
        
        if current_month in peak_months:
            # Mois de pic: facteur > 1
            return 1 + amplitude
        elif current_month in low_months:
            # Mois faibles: facteur < 1
            return 1 - amplitude
        else:
            # Mois neutres: facteur proche de 1
            return 1 + np.random.uniform(-amplitude/3, amplitude/3)
    
    def _apply_country_specific_adjustments(self, base_factor: float, 
                                          country_adjustments: Dict, current_month: int) -> float:
        """Applique les ajustements spécifiques au pays"""
        
        adjusted_factor = base_factor
        
        # Ajustements par mois spécifique
        month_names = ['', 'january', 'february', 'march', 'april', 'may', 'june',
                      'july', 'august', 'september', 'october', 'november', 'december']
        
        current_month_name = month_names[current_month] if current_month <= 12 else ''
        
        for adjustment_key, adjustment_value in country_adjustments.items():
            if isinstance(adjustment_value, dict):
                if current_month_name in adjustment_value:
                    adjusted_factor *= adjustment_value[current_month_name]
                elif 'winter' in adjustment_value and current_month in [12, 1, 2]:
                    adjusted_factor *= adjustment_value['winter']
                elif 'summer' in adjustment_value and current_month in [6, 7, 8]:
                    adjusted_factor *= adjustment_value['summer']
        
        return adjusted_factor
    
    def _calculate_adjustment_confidence(self, seasonal_factor: float) -> float:
        """Calcule la confiance dans l'ajustement"""
        
        # Plus l'ajustement est important, moins la confiance est élevée
        adjustment_magnitude = abs(seasonal_factor - 1)
        
        if adjustment_magnitude < 0.05:
            return 0.95  # Très haute confiance
        elif adjustment_magnitude < 0.15:
            return 0.85  # Haute confiance
        elif adjustment_magnitude < 0.25:
            return 0.70  # Confiance modérée
        else:
            return 0.50  # Confiance faible
    
    def _identify_seasonal_phase(self, current_month: int, pattern: Dict) -> str:
        """Identifie la phase saisonnière actuelle"""
        
        if current_month in pattern['peak_months']:
            return 'peak_season'
        elif current_month in pattern['low_months']:
            return 'low_season'
        else:
            return 'transition_season'
    
    def _adjust_pmi_trend(self, raw_trend: str, seasonal_factor: float, current_month: int) -> str:
        """Ajuste la tendance PMI selon la saisonnalité"""
        
        # Ajustement conservateur de la tendance
        if abs(seasonal_factor - 1) < 0.05:
            return raw_trend  # Pas d'ajustement si facteur faible
        
        # Logique d'ajustement de tendance
        if seasonal_factor > 1.1 and raw_trend == 'deteriorating':
            return 'neutral'  # Atténuation de la détérioration en période de pic
        elif seasonal_factor < 0.9 and raw_trend == 'improving':
            return 'neutral'  # Atténuation de l'amélioration en période faible
        
        return raw_trend
    
    def _interpret_adjusted_maritime(self, adjusted_bdi: float) -> str:
        """Interprète le Baltic Dry Index ajusté"""
        
        if adjusted_bdi >= 2200:
            return 'Very strong demand (seasonally adjusted)'
        elif adjusted_bdi >= 1800:
            return 'Strong demand (seasonally adjusted)'
        elif adjusted_bdi >= 1400:
            return 'Moderate demand (seasonally adjusted)'
        elif adjusted_bdi >= 1000:
            return 'Weak demand (seasonally adjusted)'
        else:
            return 'Very weak demand (seasonally adjusted)'
    
    def _generate_usage_recommendations(self, adjusted_indicators: Dict, 
                                      adjustment_summary: Dict, current_month: int) -> List[str]:
        """Génère des recommandations d'utilisation des données ajustées"""
        
        recommendations = []
        
        # Recommandations basées sur la magnitude des ajustements
        avg_magnitude = adjustment_summary.get('average_adjustment_magnitude', 0)
        
        if avg_magnitude > 15:
            recommendations.append("Ajustements saisonniers significatifs - utiliser données ajustées prioritairement")
        elif avg_magnitude > 8:
            recommendations.append("Ajustements modérés - comparer données brutes et ajustées")
        else:
            recommendations.append("Ajustements mineurs - données brutes suffisantes")
        
        # Recommandations par saison
        if current_month in [12, 1, 2]:
            recommendations.append("Période hivernale - attention aux pics de consommation électrique")
        elif current_month in [7, 8]:
            recommendations.append("Période estivale - attention aux ralentissements industriels")
        elif current_month in [9, 10, 11]:
            recommendations.append("Période pré-hivernale - pic d'activité maritime et industrielle")
        
        # Recommandation générale
        recommendations.append("Surveiller cohérence entre indicateurs ajustés pour validation")
        
        return recommendations

# Fonction utilitaire pour Firebase Functions
def create_seasonal_adjustment_engine():
    """Factory function pour créer une instance SeasonalAdjustmentEngine"""
    return SeasonalAdjustmentEngine()

# Test du module
if __name__ == "__main__":
    engine = SeasonalAdjustmentEngine()
    
    # Test données électricité
    raw_electricity = {
        'electricity_consumption': 450,
        'electricity_growth': -1.5,
        'electricity_score': 0.35,
        'source': 'ENTSO-E'
    }
    
    adjusted_electricity = engine.adjust_electricity_data(raw_electricity, 'FRA', 1)  # Janvier
    print(f"Électricité ajustée: {adjusted_electricity['adjusted_data']['electricity_growth']}% (brut: {raw_electricity['electricity_growth']}%)")
    
    # Test données PMI
    raw_pmi = {
        'current_pmi': 44.8,
        'pmi_score': 0.24,
        'trend': 'deteriorating',
        'source': 'OECD'
    }
    
    adjusted_pmi = engine.adjust_pmi_data(raw_pmi, 'FRA', 8)  # Août
    print(f"PMI ajusté: {adjusted_pmi['adjusted_data']['current_pmi']} (brut: {raw_pmi['current_pmi']})")
    
    # Test ajustement complet
    indicators = {
        'electricity': raw_electricity,
        'pmi': raw_pmi,
        'maritime': {'baltic_dry_index': 1200, 'maritime_score': 0.6}
    }
    
    comprehensive = engine.comprehensive_seasonal_adjustment(indicators, 'FRA')
    print(f"Ajustements réussis: {comprehensive['adjustment_summary']['adjusted_indicators']}/{comprehensive['adjustment_summary']['total_indicators']}")
    print(f"Magnitude moyenne: {comprehensive['adjustment_summary']['average_adjustment_magnitude']}%")

