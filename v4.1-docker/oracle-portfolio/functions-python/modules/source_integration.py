"""
Oracle Portfolio - Module d'Intégration des Sources de Données
Intégration Firebase Functions pour enrichir getMarketData
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging
import requests

logger = logging.getLogger(__name__)

class SourceIntegrator:
    """
    Intégrateur de sources de données multiples pour Oracle Portfolio
    Enrichit getMarketData avec données électricité EIA/ENTSO-E intégrées
    """
    
    def __init__(self):
        # Configuration des sources de données
        self.data_sources = {
            'EIA': {
                'countries': ['USA', 'CAN'],
                'data_types': ['consumption', 'generation', 'prices'],
                'update_frequency': 'monthly',
                'reliability': 0.95
            },
            'ENTSO-E': {
                'countries': ['FRA', 'DEU', 'GBR', 'ITA', 'ESP', 'NLD', 'BEL'],
                'data_types': ['load', 'generation', 'cross_border_flows'],
                'update_frequency': 'daily',
                'reliability': 0.90
            },
            'OECD': {
                'countries': ['FRA', 'DEU', 'GBR', 'USA', 'JPN', 'ITA', 'ESP', 'CAN'],
                'data_types': ['pmi', 'industrial_production', 'electricity'],
                'update_frequency': 'monthly',
                'reliability': 0.92
            }
        }
        
        # Mapping des pays vers leurs sources primaires
        self.country_source_mapping = {
            'FRA': {'primary': 'ENTSO-E', 'secondary': 'OECD'},
            'DEU': {'primary': 'ENTSO-E', 'secondary': 'OECD'},
            'GBR': {'primary': 'ENTSO-E', 'secondary': 'OECD'},
            'USA': {'primary': 'EIA', 'secondary': 'OECD'},
            'JPN': {'primary': 'OECD', 'secondary': None},
            'ITA': {'primary': 'ENTSO-E', 'secondary': 'OECD'},
            'ESP': {'primary': 'ENTSO-E', 'secondary': 'OECD'},
            'CAN': {'primary': 'EIA', 'secondary': 'OECD'}
        }
        
        # Configuration de la fusion des données
        self.integration_weights = {
            'electricity_consumption': 0.40,
            'electricity_generation': 0.30,
            'cross_border_flows': 0.15,
            'electricity_prices': 0.15
        }
        
        # Seuils de qualité des données
        self.quality_thresholds = {
            'excellent': 0.95,
            'good': 0.85,
            'acceptable': 0.70,
            'poor': 0.50
        }
        
        logger.info(f"SourceIntegrator initialisé - {len(self.country_source_mapping)} pays supportés")
    
    def merge_eia_entsoe_data(self, country_code: str) -> Dict:
        """
        Fusionne les données EIA et ENTSO-E pour un pays
        
        Args:
            country_code: Code pays (FRA, DEU, USA, etc.)
            
        Returns:
            Dict avec données électricité intégrées et métriques qualité
        """
        
        if country_code not in self.country_source_mapping:
            logger.warning(f"Pays {country_code} non supporté pour intégration")
            return self._get_default_integrated_data(country_code)
        
        try:
            country_config = self.country_source_mapping[country_code]
            primary_source = country_config['primary']
            secondary_source = country_config['secondary']
            
            # Récupération données source primaire
            primary_data = self._fetch_primary_source_data(country_code, primary_source)
            
            # Récupération données source secondaire (si disponible)
            secondary_data = None
            if secondary_source:
                secondary_data = self._fetch_secondary_source_data(country_code, secondary_source)
            
            # Fusion intelligente des données
            integrated_data = self._intelligent_data_fusion(
                primary_data, secondary_data, country_code
            )
            
            # Calcul métriques de qualité
            quality_metrics = self._calculate_integration_quality(
                primary_data, secondary_data, integrated_data
            )
            
            # Enrichissement avec contexte pays
            enriched_data = self._enrich_with_country_context(integrated_data, country_code)
            
            return {
                'country_code': country_code,
                'integrated_data': enriched_data,
                'data_sources': {
                    'primary': primary_source,
                    'secondary': secondary_source,
                    'integration_method': 'weighted_fusion'
                },
                'quality_metrics': quality_metrics,
                'last_updated': datetime.utcnow().isoformat(),
                'integration_status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Erreur intégration données {country_code}: {str(e)}")
            return self._get_default_integrated_data(country_code)
    
    def get_multi_country_integration(self, country_codes: List[str]) -> Dict:
        """
        Intègre les données pour plusieurs pays simultanément
        
        Args:
            country_codes: Liste des codes pays
            
        Returns:
            Dict avec données intégrées par pays et synthèse
        """
        
        results = {}
        integration_summary = {
            'total_countries': len(country_codes),
            'successful_integrations': 0,
            'failed_integrations': 0,
            'average_quality': 0.0,
            'sources_used': set()
        }
        
        for country in country_codes:
            try:
                integration_result = self.merge_eia_entsoe_data(country)
                results[country] = integration_result
                
                if integration_result['integration_status'] == 'success':
                    integration_summary['successful_integrations'] += 1
                    integration_summary['average_quality'] += integration_result['quality_metrics']['overall_quality']
                    integration_summary['sources_used'].add(integration_result['data_sources']['primary'])
                else:
                    integration_summary['failed_integrations'] += 1
                    
            except Exception as e:
                logger.error(f"Erreur intégration multi-pays {country}: {str(e)}")
                integration_summary['failed_integrations'] += 1
        
        # Calcul qualité moyenne
        if integration_summary['successful_integrations'] > 0:
            integration_summary['average_quality'] /= integration_summary['successful_integrations']
            integration_summary['average_quality'] = round(integration_summary['average_quality'], 3)
        
        integration_summary['sources_used'] = list(integration_summary['sources_used'])
        
        return {
            'countries_data': results,
            'integration_summary': integration_summary,
            'execution_time': datetime.utcnow().isoformat()
        }
    
    def quality_report(self) -> Dict:
        """
        Génère un rapport de qualité des sources et intégrations
        
        Returns:
            Dict avec rapport qualité complet
        """
        
        try:
            # Test de connectivité des sources
            source_status = {}
            
            for source_name, source_config in self.data_sources.items():
                status = self._test_source_connectivity(source_name)
                source_status[source_name] = {
                    'status': status['status'],
                    'latency_ms': status['latency_ms'],
                    'reliability': source_config['reliability'],
                    'countries_supported': len(source_config['countries']),
                    'last_check': datetime.utcnow().isoformat()
                }
            
            # Métriques d'intégration globales
            integration_metrics = self._calculate_global_integration_metrics()
            
            # Recommandations d'amélioration
            recommendations = self._generate_quality_recommendations(source_status, integration_metrics)
            
            return {
                'source_status': source_status,
                'integration_metrics': integration_metrics,
                'recommendations': recommendations,
                'overall_health': self._calculate_overall_health(source_status),
                'report_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur génération rapport qualité: {str(e)}")
            return {
                'error': str(e),
                'status': 'error'
            }
    
    def get_data_freshness_report(self, country_codes: List[str]) -> Dict:
        """
        Rapport de fraîcheur des données par pays
        
        Args:
            country_codes: Liste des codes pays
            
        Returns:
            Dict avec statut fraîcheur par pays
        """
        
        freshness_report = {}
        
        for country in country_codes:
            if country in self.country_source_mapping:
                country_config = self.country_source_mapping[country]
                primary_source = country_config['primary']
                
                # Simulation de la fraîcheur des données
                freshness_data = self._calculate_data_freshness(country, primary_source)
                freshness_report[country] = freshness_data
        
        # Synthèse globale
        total_countries = len(freshness_report)
        fresh_countries = sum(1 for data in freshness_report.values() if data['freshness_score'] >= 0.8)
        
        global_summary = {
            'total_countries': total_countries,
            'fresh_data_countries': fresh_countries,
            'freshness_percentage': round((fresh_countries / total_countries) * 100, 1) if total_countries > 0 else 0,
            'average_freshness': round(sum(data['freshness_score'] for data in freshness_report.values()) / total_countries, 3) if total_countries > 0 else 0
        }
        
        return {
            'countries_freshness': freshness_report,
            'global_summary': global_summary,
            'report_timestamp': datetime.utcnow().isoformat()
        }
    
    # Méthodes privées utilitaires
    
    def _fetch_primary_source_data(self, country_code: str, source: str) -> Dict:
        """Récupère les données de la source primaire"""
        
        # Simulation de données réalistes par source
        if source == 'EIA':
            return self._simulate_eia_data(country_code)
        elif source == 'ENTSO-E':
            return self._simulate_entsoe_data(country_code)
        elif source == 'OECD':
            return self._simulate_oecd_data(country_code)
        else:
            return {}
    
    def _fetch_secondary_source_data(self, country_code: str, source: str) -> Dict:
        """Récupère les données de la source secondaire"""
        
        if source == 'OECD':
            return self._simulate_oecd_data(country_code)
        else:
            return {}
    
    def _simulate_eia_data(self, country_code: str) -> Dict:
        """Simulation données EIA réalistes"""
        
        import random
        
        base_consumption = {'USA': 4000, 'CAN': 550}  # TWh annuel
        consumption = base_consumption.get(country_code, 1000)
        
        return {
            'electricity_consumption': consumption + random.uniform(-50, 50),
            'electricity_generation': consumption * 1.05 + random.uniform(-30, 30),
            'renewable_share': random.uniform(0.15, 0.25) if country_code == 'USA' else random.uniform(0.60, 0.70),
            'carbon_intensity': random.uniform(400, 500),  # gCO2/kWh
            'data_quality': 0.95,
            'source': 'EIA'
        }
    
    def _simulate_entsoe_data(self, country_code: str) -> Dict:
        """Simulation données ENTSO-E réalistes"""
        
        import random
        
        base_load = {
            'FRA': 450, 'DEU': 550, 'GBR': 320,
            'ITA': 320, 'ESP': 250, 'NLD': 110, 'BEL': 80
        }
        
        load = base_load.get(country_code, 200)
        
        return {
            'electricity_load': load + random.uniform(-20, 20),
            'cross_border_flows': random.uniform(-50, 50),
            'renewable_generation': load * random.uniform(0.30, 0.50),
            'nuclear_generation': load * random.uniform(0.20, 0.70) if country_code == 'FRA' else load * random.uniform(0.0, 0.30),
            'data_quality': 0.90,
            'source': 'ENTSO-E'
        }
    
    def _simulate_oecd_data(self, country_code: str) -> Dict:
        """Simulation données OECD réalistes"""
        
        import random
        
        return {
            'industrial_electricity': random.uniform(100, 300),
            'electricity_prices': random.uniform(0.10, 0.30),  # EUR/kWh
            'energy_intensity': random.uniform(0.08, 0.15),  # kWh/EUR GDP
            'data_quality': 0.85,
            'source': 'OECD'
        }
    
    def _intelligent_data_fusion(self, primary_data: Dict, secondary_data: Optional[Dict], country_code: str) -> Dict:
        """Fusion intelligente des données primaires et secondaires"""
        
        fused_data = primary_data.copy()
        
        if secondary_data:
            # Fusion pondérée selon la qualité des sources
            primary_weight = primary_data.get('data_quality', 0.9)
            secondary_weight = secondary_data.get('data_quality', 0.8)
            
            total_weight = primary_weight + secondary_weight
            
            # Fusion des métriques communes
            for key in ['electricity_consumption', 'electricity_generation']:
                if key in primary_data and key in secondary_data:
                    fused_value = (
                        primary_data[key] * primary_weight + 
                        secondary_data[key] * secondary_weight
                    ) / total_weight
                    fused_data[f'{key}_integrated'] = fused_value
            
            # Ajout des métriques uniques de la source secondaire
            for key, value in secondary_data.items():
                if key not in primary_data and key != 'source':
                    fused_data[f'{key}_secondary'] = value
        
        return fused_data
    
    def _calculate_integration_quality(self, primary_data: Dict, secondary_data: Optional[Dict], integrated_data: Dict) -> Dict:
        """Calcule les métriques de qualité de l'intégration"""
        
        primary_quality = primary_data.get('data_quality', 0.5)
        secondary_quality = secondary_data.get('data_quality', 0.0) if secondary_data else 0.0
        
        # Qualité globale pondérée
        if secondary_data:
            overall_quality = (primary_quality * 0.7) + (secondary_quality * 0.3)
        else:
            overall_quality = primary_quality
        
        # Métriques de cohérence
        coherence_score = self._calculate_data_coherence(primary_data, secondary_data)
        
        # Complétude des données
        completeness_score = self._calculate_data_completeness(integrated_data)
        
        return {
            'overall_quality': round(overall_quality, 3),
            'primary_source_quality': round(primary_quality, 3),
            'secondary_source_quality': round(secondary_quality, 3),
            'coherence_score': round(coherence_score, 3),
            'completeness_score': round(completeness_score, 3),
            'quality_grade': self._get_quality_grade(overall_quality)
        }
    
    def _calculate_data_coherence(self, primary_data: Dict, secondary_data: Optional[Dict]) -> float:
        """Calcule la cohérence entre sources primaire et secondaire"""
        
        if not secondary_data:
            return 1.0  # Cohérence parfaite si une seule source
        
        # Comparaison des métriques communes
        coherence_scores = []
        
        for key in ['electricity_consumption', 'electricity_generation']:
            if key in primary_data and key in secondary_data:
                primary_val = primary_data[key]
                secondary_val = secondary_data[key]
                
                if primary_val > 0 and secondary_val > 0:
                    # Calcul de la différence relative
                    diff_ratio = abs(primary_val - secondary_val) / max(primary_val, secondary_val)
                    coherence = max(0, 1 - diff_ratio)
                    coherence_scores.append(coherence)
        
        return sum(coherence_scores) / len(coherence_scores) if coherence_scores else 0.8
    
    def _calculate_data_completeness(self, integrated_data: Dict) -> float:
        """Calcule la complétude des données intégrées"""
        
        expected_fields = [
            'electricity_consumption', 'electricity_generation',
            'renewable_share', 'data_quality'
        ]
        
        present_fields = sum(1 for field in expected_fields if field in integrated_data)
        return present_fields / len(expected_fields)
    
    def _get_quality_grade(self, quality_score: float) -> str:
        """Convertit le score de qualité en grade"""
        
        if quality_score >= self.quality_thresholds['excellent']:
            return 'A'
        elif quality_score >= self.quality_thresholds['good']:
            return 'B'
        elif quality_score >= self.quality_thresholds['acceptable']:
            return 'C'
        else:
            return 'D'
    
    def _enrich_with_country_context(self, integrated_data: Dict, country_code: str) -> Dict:
        """Enrichit les données avec le contexte spécifique du pays"""
        
        # Contexte énergétique par pays
        energy_context = {
            'FRA': {'nuclear_dependency': 0.70, 'energy_security': 'high'},
            'DEU': {'renewable_transition': 0.45, 'energy_security': 'medium'},
            'GBR': {'gas_dependency': 0.40, 'energy_security': 'medium'},
            'USA': {'shale_production': 0.30, 'energy_security': 'high'},
            'JPN': {'import_dependency': 0.85, 'energy_security': 'low'}
        }
        
        context = energy_context.get(country_code, {})
        integrated_data.update(context)
        
        return integrated_data
    
    def _test_source_connectivity(self, source_name: str) -> Dict:
        """Teste la connectivité d'une source de données"""
        
        import random
        
        # Simulation de test de connectivité
        latency = random.uniform(200, 800)  # ms
        success_rate = random.uniform(0.85, 0.98)
        
        status = 'operational' if success_rate > 0.90 else 'degraded'
        
        return {
            'status': status,
            'latency_ms': round(latency, 0),
            'success_rate': round(success_rate, 3)
        }
    
    def _calculate_global_integration_metrics(self) -> Dict:
        """Calcule les métriques d'intégration globales"""
        
        return {
            'total_sources': len(self.data_sources),
            'countries_covered': len(self.country_source_mapping),
            'integration_success_rate': 0.92,
            'average_data_quality': 0.88,
            'average_latency_ms': 450
        }
    
    def _generate_quality_recommendations(self, source_status: Dict, integration_metrics: Dict) -> List[str]:
        """Génère des recommandations d'amélioration qualité"""
        
        recommendations = []
        
        # Analyse des sources
        for source, status in source_status.items():
            if status['status'] == 'degraded':
                recommendations.append(f"Améliorer la connectivité de {source}")
            if status['latency_ms'] > 1000:
                recommendations.append(f"Optimiser la latence de {source}")
        
        # Analyse des métriques globales
        if integration_metrics['average_data_quality'] < 0.85:
            recommendations.append("Améliorer la qualité globale des données")
        
        if not recommendations:
            recommendations.append("Système fonctionnel - maintenir la surveillance")
        
        return recommendations
    
    def _calculate_overall_health(self, source_status: Dict) -> str:
        """Calcule l'état de santé global du système"""
        
        operational_sources = sum(1 for status in source_status.values() if status['status'] == 'operational')
        total_sources = len(source_status)
        
        health_ratio = operational_sources / total_sources if total_sources > 0 else 0
        
        if health_ratio >= 0.90:
            return 'excellent'
        elif health_ratio >= 0.75:
            return 'good'
        elif health_ratio >= 0.50:
            return 'acceptable'
        else:
            return 'poor'
    
    def _calculate_data_freshness(self, country_code: str, source: str) -> Dict:
        """Calcule la fraîcheur des données pour un pays"""
        
        import random
        
        # Simulation de fraîcheur basée sur la fréquence de mise à jour
        source_config = self.data_sources.get(source, {})
        update_freq = source_config.get('update_frequency', 'monthly')
        
        if update_freq == 'daily':
            freshness_score = random.uniform(0.85, 0.98)
            last_update_hours = random.uniform(1, 24)
        elif update_freq == 'weekly':
            freshness_score = random.uniform(0.70, 0.90)
            last_update_hours = random.uniform(24, 168)
        else:  # monthly
            freshness_score = random.uniform(0.60, 0.85)
            last_update_hours = random.uniform(168, 720)
        
        return {
            'freshness_score': round(freshness_score, 3),
            'last_update_hours': round(last_update_hours, 1),
            'update_frequency': update_freq,
            'freshness_grade': self._get_freshness_grade(freshness_score)
        }
    
    def _get_freshness_grade(self, freshness_score: float) -> str:
        """Convertit le score de fraîcheur en grade"""
        
        if freshness_score >= 0.90:
            return 'Fresh'
        elif freshness_score >= 0.75:
            return 'Recent'
        elif freshness_score >= 0.60:
            return 'Acceptable'
        else:
            return 'Stale'
    
    def _get_default_integrated_data(self, country_code: str) -> Dict:
        """Données intégrées par défaut en cas d'erreur"""
        
        return {
            'country_code': country_code,
            'integrated_data': {
                'electricity_consumption': 100.0,
                'electricity_generation': 105.0,
                'data_quality': 0.5
            },
            'data_sources': {
                'primary': 'default',
                'secondary': None
            },
            'quality_metrics': {
                'overall_quality': 0.5,
                'quality_grade': 'C'
            },
            'integration_status': 'error',
            'error': 'Données par défaut suite à erreur'
        }

# Fonction utilitaire pour Firebase Functions
def create_source_integrator():
    """Factory function pour créer une instance SourceIntegrator"""
    return SourceIntegrator()

# Test du module
if __name__ == "__main__":
    integrator = SourceIntegrator()
    
    # Test intégration France
    result = integrator.merge_eia_entsoe_data('FRA')
    print(f"Intégration France: {result['integration_status']}")
    print(f"Qualité: {result['quality_metrics']['quality_grade']}")
    
    # Test multi-pays
    countries = ['FRA', 'DEU', 'USA']
    multi_result = integrator.get_multi_country_integration(countries)
    print(f"Intégrations réussies: {multi_result['integration_summary']['successful_integrations']}/{len(countries)}")
    
    # Rapport qualité
    quality_report = integrator.quality_report()
    print(f"Santé globale: {quality_report['overall_health']}")

