"""
Oracle Portfolio - Module de Backtesting
Intégration Firebase Functions pour backtesting des allocations dynamiques
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class BacktestingEngine:
    """
    Moteur de backtesting pour Oracle Portfolio
    Teste les performances des allocations dynamiques vs statiques
    """
    
    def __init__(self):
        # Configuration du backtesting
        self.backtest_config = {
            'default_period_months': 24,
            'rebalancing_frequencies': ['monthly', 'quarterly', 'semi_annual'],
            'transaction_cost': 0.001,  # 0.1% par transaction
            'initial_capital': 100000,  # 100k EUR
            'risk_free_rate': 0.02  # 2% annuel
        }
        
        # Données historiques simulées (en production: vraies données)
        self.historical_data = self._generate_historical_data()
        
        # Benchmarks de référence
        self.benchmarks = {
            'static_conservative': {'stocks': 0.40, 'bonds': 0.55, 'commodities': 0.05},
            'static_moderate': {'stocks': 0.60, 'bonds': 0.35, 'commodities': 0.05},
            'static_aggressive': {'stocks': 0.80, 'bonds': 0.15, 'commodities': 0.05},
            'equal_weight': {'stocks': 0.33, 'bonds': 0.33, 'commodities': 0.34}
        }
        
        logger.info("BacktestingEngine initialisé")
    
    def backtest_dynamic_allocations(self, country_code: str, period_months: int = 24) -> Dict:
        """
        Backteste les allocations dynamiques pour un pays
        
        Args:
            country_code: Code pays
            period_months: Période de backtesting en mois
            
        Returns:
            Dict avec résultats de performance
        """
        
        try:
            # Génération des allocations dynamiques historiques
            dynamic_allocations = self._generate_dynamic_allocations_history(country_code, period_months)
            
            # Calcul des performances
            dynamic_performance = self._calculate_portfolio_performance(
                dynamic_allocations, period_months, 'dynamic'
            )
            
            # Comparaison avec benchmarks statiques
            benchmark_performances = {}
            for benchmark_name, allocation in self.benchmarks.items():
                static_allocations = [allocation] * period_months  # Allocation fixe
                benchmark_performances[benchmark_name] = self._calculate_portfolio_performance(
                    static_allocations, period_months, benchmark_name
                )
            
            # Analyse comparative
            comparative_analysis = self._analyze_performance_comparison(
                dynamic_performance, benchmark_performances
            )
            
            # Métriques de risque
            risk_metrics = self._calculate_risk_metrics(dynamic_performance, benchmark_performances)
            
            return {
                'country_code': country_code,
                'backtest_period': {
                    'months': period_months,
                    'start_date': (datetime.utcnow() - timedelta(days=period_months*30)).strftime('%Y-%m-%d'),
                    'end_date': datetime.utcnow().strftime('%Y-%m-%d')
                },
                'dynamic_strategy': dynamic_performance,
                'benchmark_strategies': benchmark_performances,
                'comparative_analysis': comparative_analysis,
                'risk_metrics': risk_metrics,
                'backtest_summary': self._generate_backtest_summary(
                    dynamic_performance, benchmark_performances
                ),
                'execution_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur backtesting {country_code}: {str(e)}")
            return {
                'error': str(e),
                'status': 'error'
            }
    
    def multi_country_backtest(self, country_codes: List[str], period_months: int = 24) -> Dict:
        """
        Backteste les allocations dynamiques pour plusieurs pays
        
        Args:
            country_codes: Liste des codes pays
            period_months: Période de backtesting
            
        Returns:
            Dict avec résultats agrégés
        """
        
        results = {}
        summary_stats = {
            'total_countries': len(country_codes),
            'successful_backtests': 0,
            'average_outperformance': 0.0,
            'best_performing_country': None,
            'worst_performing_country': None
        }
        
        outperformances = []
        
        for country in country_codes:
            try:
                backtest_result = self.backtest_dynamic_allocations(country, period_months)
                results[country] = backtest_result
                
                if 'error' not in backtest_result:
                    summary_stats['successful_backtests'] += 1
                    
                    # Calcul outperformance vs benchmark principal
                    outperf = backtest_result['comparative_analysis']['vs_static_moderate']['outperformance_pct']
                    outperformances.append((country, outperf))
                    
            except Exception as e:
                logger.error(f"Erreur backtesting multi-pays {country}: {str(e)}")
                results[country] = {'error': str(e)}
        
        # Calcul statistiques agrégées
        if outperformances:
            summary_stats['average_outperformance'] = round(
                sum(perf for _, perf in outperformances) / len(outperformances), 2
            )
            
            best_country, best_perf = max(outperformances, key=lambda x: x[1])
            worst_country, worst_perf = min(outperformances, key=lambda x: x[1])
            
            summary_stats['best_performing_country'] = {'country': best_country, 'outperformance': best_perf}
            summary_stats['worst_performing_country'] = {'country': worst_country, 'outperformance': worst_perf}
        
        return {
            'countries_results': results,
            'summary_statistics': summary_stats,
            'backtest_configuration': {
                'period_months': period_months,
                'countries_tested': len(country_codes),
                'transaction_cost': self.backtest_config['transaction_cost']
            },
            'execution_date': datetime.utcnow().isoformat()
        }
    
    def strategy_optimization(self, country_code: str) -> Dict:
        """
        Optimise les paramètres de la stratégie d'allocation dynamique
        
        Args:
            country_code: Code pays
            
        Returns:
            Dict avec paramètres optimisés
        """
        
        try:
            # Test de différentes fréquences de rééquilibrage
            rebalancing_results = {}
            
            for frequency in self.backtest_config['rebalancing_frequencies']:
                performance = self._test_rebalancing_frequency(country_code, frequency)
                rebalancing_results[frequency] = performance
            
            # Sélection de la meilleure fréquence
            best_frequency = max(rebalancing_results.keys(), 
                               key=lambda f: rebalancing_results[f]['sharpe_ratio'])
            
            # Test de différents seuils de score composite
            threshold_results = self._test_score_thresholds(country_code)
            
            # Recommandations d'optimisation
            optimization_recommendations = self._generate_optimization_recommendations(
                rebalancing_results, threshold_results, country_code
            )
            
            return {
                'country_code': country_code,
                'rebalancing_optimization': {
                    'tested_frequencies': rebalancing_results,
                    'optimal_frequency': best_frequency,
                    'improvement_vs_default': rebalancing_results[best_frequency]['sharpe_ratio'] - 
                                            rebalancing_results['quarterly']['sharpe_ratio']
                },
                'threshold_optimization': threshold_results,
                'recommendations': optimization_recommendations,
                'optimization_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erreur optimisation stratégie {country_code}: {str(e)}")
            return {
                'error': str(e),
                'status': 'error'
            }
    
    # Méthodes privées utilitaires
    
    def _generate_historical_data(self) -> Dict:
        """Génère des données historiques simulées réalistes"""
        
        import random
        
        # Simulation 36 mois de données
        months = 36
        data = {
            'stocks': [],
            'bonds': [],
            'commodities': [],
            'dates': []
        }
        
        # Rendements mensuels simulés (moyennes historiques)
        for i in range(months):
            date = datetime.utcnow() - timedelta(days=(months-i)*30)
            data['dates'].append(date.strftime('%Y-%m'))
            
            # Stocks: 8% annuel, volatilité 15%
            stocks_return = random.normalvariate(0.08/12, 0.15/np.sqrt(12))
            data['stocks'].append(stocks_return)
            
            # Bonds: 3% annuel, volatilité 5%
            bonds_return = random.normalvariate(0.03/12, 0.05/np.sqrt(12))
            data['bonds'].append(bonds_return)
            
            # Commodities: 5% annuel, volatilité 20%
            commodities_return = random.normalvariate(0.05/12, 0.20/np.sqrt(12))
            data['commodities'].append(commodities_return)
        
        return data
    
    def _generate_dynamic_allocations_history(self, country_code: str, period_months: int) -> List[Dict]:
        """Génère l'historique des allocations dynamiques"""
        
        allocations_history = []
        
        for month in range(period_months):
            # Simulation de l'évolution du score composite
            base_score = 0.5
            trend = np.sin(month * 0.2) * 0.2  # Cycle économique simulé
            noise = np.random.normal(0, 0.1)
            composite_score = np.clip(base_score + trend + noise, 0, 1)
            
            # Allocation basée sur le score
            if composite_score >= 0.75:
                allocation = {'stocks': 0.75, 'bonds': 0.15, 'commodities': 0.10}
            elif composite_score >= 0.60:
                allocation = {'stocks': 0.65, 'bonds': 0.25, 'commodities': 0.10}
            elif composite_score >= 0.40:
                allocation = {'stocks': 0.55, 'bonds': 0.35, 'commodities': 0.10}
            elif composite_score >= 0.25:
                allocation = {'stocks': 0.45, 'bonds': 0.45, 'commodities': 0.10}
            else:
                allocation = {'stocks': 0.30, 'bonds': 0.60, 'commodities': 0.10}
            
            allocations_history.append(allocation)
        
        return allocations_history
    
    def _calculate_portfolio_performance(self, allocations: List[Dict], period_months: int, strategy_name: str) -> Dict:
        """Calcule la performance d'un portefeuille"""
        
        portfolio_returns = []
        portfolio_values = [self.backtest_config['initial_capital']]
        
        for month in range(period_months):
            allocation = allocations[min(month, len(allocations)-1)]
            
            # Rendement du portefeuille pour ce mois
            monthly_return = (
                allocation['stocks'] * self.historical_data['stocks'][month] +
                allocation['bonds'] * self.historical_data['bonds'][month] +
                allocation['commodities'] * self.historical_data['commodities'][month]
            )
            
            # Coûts de transaction (si changement d'allocation)
            if month > 0:
                prev_allocation = allocations[min(month-1, len(allocations)-1)]
                turnover = sum(abs(allocation[asset] - prev_allocation[asset]) for asset in allocation.keys())
                transaction_cost = turnover * self.backtest_config['transaction_cost']
                monthly_return -= transaction_cost
            
            portfolio_returns.append(monthly_return)
            new_value = portfolio_values[-1] * (1 + monthly_return)
            portfolio_values.append(new_value)
        
        # Calcul des métriques de performance
        total_return = (portfolio_values[-1] / portfolio_values[0]) - 1
        annualized_return = (1 + total_return) ** (12 / period_months) - 1
        
        monthly_volatility = np.std(portfolio_returns)
        annualized_volatility = monthly_volatility * np.sqrt(12)
        
        sharpe_ratio = (annualized_return - self.backtest_config['risk_free_rate']) / annualized_volatility
        
        # Calcul du maximum drawdown
        peak = portfolio_values[0]
        max_drawdown = 0
        for value in portfolio_values[1:]:
            if value > peak:
                peak = value
            drawdown = (peak - value) / peak
            max_drawdown = max(max_drawdown, drawdown)
        
        return {
            'strategy_name': strategy_name,
            'total_return_pct': round(total_return * 100, 2),
            'annualized_return_pct': round(annualized_return * 100, 2),
            'annualized_volatility_pct': round(annualized_volatility * 100, 2),
            'sharpe_ratio': round(sharpe_ratio, 3),
            'max_drawdown_pct': round(max_drawdown * 100, 2),
            'final_value': round(portfolio_values[-1], 0),
            'monthly_returns': [round(r * 100, 2) for r in portfolio_returns[-6:]],  # 6 derniers mois
            'portfolio_evolution': [round(v, 0) for v in portfolio_values[::3]]  # Échantillonnage
        }
    
    def _analyze_performance_comparison(self, dynamic_perf: Dict, benchmark_perfs: Dict) -> Dict:
        """Analyse comparative des performances"""
        
        comparisons = {}
        
        for benchmark_name, benchmark_perf in benchmark_perfs.items():
            outperformance = dynamic_perf['annualized_return_pct'] - benchmark_perf['annualized_return_pct']
            volatility_diff = dynamic_perf['annualized_volatility_pct'] - benchmark_perf['annualized_volatility_pct']
            sharpe_diff = dynamic_perf['sharpe_ratio'] - benchmark_perf['sharpe_ratio']
            
            comparisons[f'vs_{benchmark_name}'] = {
                'outperformance_pct': round(outperformance, 2),
                'volatility_difference_pct': round(volatility_diff, 2),
                'sharpe_improvement': round(sharpe_diff, 3),
                'better_performance': outperformance > 0,
                'better_risk_adjusted': sharpe_diff > 0
            }
        
        return comparisons
    
    def _calculate_risk_metrics(self, dynamic_perf: Dict, benchmark_perfs: Dict) -> Dict:
        """Calcule les métriques de risque avancées"""
        
        # Comparaison avec le benchmark modéré (référence)
        benchmark_ref = benchmark_perfs['static_moderate']
        
        # Tracking error
        # Simulation simplifiée - en production: calcul sur vraies séries
        tracking_error = abs(dynamic_perf['annualized_volatility_pct'] - benchmark_ref['annualized_volatility_pct'])
        
        # Information ratio
        excess_return = dynamic_perf['annualized_return_pct'] - benchmark_ref['annualized_return_pct']
        information_ratio = excess_return / tracking_error if tracking_error > 0 else 0
        
        # Beta (simulation)
        beta = dynamic_perf['annualized_volatility_pct'] / benchmark_ref['annualized_volatility_pct']
        
        return {
            'tracking_error_pct': round(tracking_error, 2),
            'information_ratio': round(information_ratio, 3),
            'beta_vs_moderate': round(beta, 3),
            'risk_classification': self._classify_risk_level(dynamic_perf),
            'risk_vs_benchmark': 'Higher' if dynamic_perf['annualized_volatility_pct'] > benchmark_ref['annualized_volatility_pct'] else 'Lower'
        }
    
    def _classify_risk_level(self, performance: Dict) -> str:
        """Classifie le niveau de risque"""
        
        volatility = performance['annualized_volatility_pct']
        max_dd = performance['max_drawdown_pct']
        
        if volatility < 8 and max_dd < 10:
            return 'Conservative'
        elif volatility < 12 and max_dd < 15:
            return 'Moderate'
        elif volatility < 18 and max_dd < 25:
            return 'Aggressive'
        else:
            return 'Very Aggressive'
    
    def _generate_backtest_summary(self, dynamic_perf: Dict, benchmark_perfs: Dict) -> Dict:
        """Génère un résumé du backtesting"""
        
        # Meilleur benchmark
        best_benchmark = max(benchmark_perfs.keys(), 
                           key=lambda b: benchmark_perfs[b]['sharpe_ratio'])
        
        # Nombre de benchmarks battus
        benchmarks_beaten = sum(1 for b in benchmark_perfs.values() 
                              if dynamic_perf['sharpe_ratio'] > b['sharpe_ratio'])
        
        return {
            'strategy_effectiveness': 'Effective' if benchmarks_beaten >= len(benchmark_perfs) / 2 else 'Needs Improvement',
            'benchmarks_outperformed': f"{benchmarks_beaten}/{len(benchmark_perfs)}",
            'best_benchmark': best_benchmark,
            'vs_best_benchmark': {
                'outperformance': round(dynamic_perf['annualized_return_pct'] - 
                                      benchmark_perfs[best_benchmark]['annualized_return_pct'], 2),
                'sharpe_improvement': round(dynamic_perf['sharpe_ratio'] - 
                                          benchmark_perfs[best_benchmark]['sharpe_ratio'], 3)
            },
            'key_strengths': self._identify_strategy_strengths(dynamic_perf, benchmark_perfs),
            'areas_for_improvement': self._identify_improvement_areas(dynamic_perf, benchmark_perfs)
        }
    
    def _identify_strategy_strengths(self, dynamic_perf: Dict, benchmark_perfs: Dict) -> List[str]:
        """Identifie les forces de la stratégie"""
        
        strengths = []
        
        avg_benchmark_return = np.mean([b['annualized_return_pct'] for b in benchmark_perfs.values()])
        avg_benchmark_sharpe = np.mean([b['sharpe_ratio'] for b in benchmark_perfs.values()])
        
        if dynamic_perf['annualized_return_pct'] > avg_benchmark_return:
            strengths.append("Superior returns vs average benchmark")
        
        if dynamic_perf['sharpe_ratio'] > avg_benchmark_sharpe:
            strengths.append("Better risk-adjusted performance")
        
        if dynamic_perf['max_drawdown_pct'] < 20:
            strengths.append("Controlled maximum drawdown")
        
        if not strengths:
            strengths.append("Consistent performance")
        
        return strengths
    
    def _identify_improvement_areas(self, dynamic_perf: Dict, benchmark_perfs: Dict) -> List[str]:
        """Identifie les axes d'amélioration"""
        
        improvements = []
        
        if dynamic_perf['annualized_volatility_pct'] > 15:
            improvements.append("Reduce portfolio volatility")
        
        if dynamic_perf['max_drawdown_pct'] > 20:
            improvements.append("Improve downside protection")
        
        if dynamic_perf['sharpe_ratio'] < 0.5:
            improvements.append("Enhance risk-adjusted returns")
        
        if not improvements:
            improvements.append("Fine-tune rebalancing frequency")
        
        return improvements
    
    def _test_rebalancing_frequency(self, country_code: str, frequency: str) -> Dict:
        """Teste une fréquence de rééquilibrage"""
        
        # Simulation simplifiée
        base_sharpe = 0.8
        
        frequency_adjustments = {
            'monthly': 0.05,      # Légèrement meilleur
            'quarterly': 0.0,     # Référence
            'semi_annual': -0.03  # Légèrement moins bon
        }
        
        adjusted_sharpe = base_sharpe + frequency_adjustments.get(frequency, 0)
        
        return {
            'frequency': frequency,
            'sharpe_ratio': round(adjusted_sharpe, 3),
            'transaction_costs_pct': 0.1 if frequency == 'monthly' else 0.05,
            'recommendation': 'Optimal' if frequency == 'monthly' else 'Acceptable'
        }
    
    def _test_score_thresholds(self, country_code: str) -> Dict:
        """Teste différents seuils de score composite"""
        
        # Simulation de l'impact des seuils
        thresholds = {
            'conservative': {'expansion': 0.80, 'contraction': 0.20},
            'moderate': {'expansion': 0.75, 'contraction': 0.25},
            'aggressive': {'expansion': 0.70, 'contraction': 0.30}
        }
        
        results = {}
        for threshold_name, threshold_values in thresholds.items():
            # Simulation de performance selon seuils
            performance_impact = np.random.normal(0, 0.02)  # Impact aléatoire
            
            results[threshold_name] = {
                'thresholds': threshold_values,
                'performance_impact_pct': round(performance_impact * 100, 2),
                'recommendation': 'Optimal' if threshold_name == 'moderate' else 'Alternative'
            }
        
        return results
    
    def _generate_optimization_recommendations(self, rebalancing_results: Dict, threshold_results: Dict, country_code: str) -> List[str]:
        """Génère des recommandations d'optimisation"""
        
        recommendations = []
        
        # Recommandation fréquence
        best_freq = max(rebalancing_results.keys(), 
                       key=lambda f: rebalancing_results[f]['sharpe_ratio'])
        recommendations.append(f"Utiliser rééquilibrage {best_freq} pour performance optimale")
        
        # Recommandation seuils
        recommendations.append("Maintenir seuils modérés pour équilibre risque/rendement")
        
        # Recommandation spécifique pays
        country_recommendations = {
            'FRA': "Considérer exposition nucléaire dans allocation",
            'DEU': "Intégrer transition énergétique dans modèle",
            'USA': "Exploiter volatilité secteur tech",
            'JPN': "Ajuster pour dépendance importations"
        }
        
        if country_code in country_recommendations:
            recommendations.append(country_recommendations[country_code])
        
        return recommendations

# Fonction utilitaire pour Firebase Functions
def create_backtesting_engine():
    """Factory function pour créer une instance BacktestingEngine"""
    return BacktestingEngine()

# Test du module
if __name__ == "__main__":
    engine = BacktestingEngine()
    
    # Test backtesting France
    result = engine.backtest_dynamic_allocations('FRA', 12)
    print(f"Backtesting France - Performance: {result['dynamic_strategy']['annualized_return_pct']}%")
    print(f"Sharpe ratio: {result['dynamic_strategy']['sharpe_ratio']}")
    
    # Test optimisation
    optimization = engine.strategy_optimization('FRA')
    print(f"Fréquence optimale: {optimization['rebalancing_optimization']['optimal_frequency']}")
    
    # Test multi-pays
    multi_result = engine.multi_country_backtest(['FRA', 'DEU', 'USA'], 12)
    print(f"Outperformance moyenne: {multi_result['summary_statistics']['average_outperformance']}%")

