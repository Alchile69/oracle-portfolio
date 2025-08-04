import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [timeRange, setTimeRange] = useState(30);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }}>
      {/* Header principal */}
      <header style={{ 
        backgroundColor: '#1a1a2e', 
        borderBottom: '1px solid #2a2a3e',
        padding: '24px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>O</span>
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                  Oracle Portfolio
                </h1>
                <p style={{ color: '#4a4a5e', fontSize: '14px', margin: '4px 0 0 0' }}>
                  v2.5.0 - Système Extensible
                </p>
                <p style={{ color: '#4a4a5e', fontSize: '12px', margin: '2px 0 0 0' }}>
                  Plateforme d'analyse financière avec plugins dynamiques
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #2a2a3e',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="FR">France</option>
                <option value="US">États-Unis</option>
                <option value="EU">Europe</option>
                <option value="JP">Japon</option>
                <option value="CN">Chine</option>
              </select>
              
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #2a2a3e',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value={7}>7 jours</option>
                <option value={30}>30 jours</option>
                <option value={90}>90 jours</option>
                <option value={365}>1 an</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav style={{ 
        backgroundColor: '#1a1a2e', 
        borderBottom: '1px solid #2a2a3e'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '32px' }}>
            <button style={{ 
              padding: '16px 24px', 
              color: '#ffffff', 
              fontWeight: '500',
              borderBottom: '2px solid #00d4ff',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              Dashboard
            </button>
            <button style={{ 
              padding: '16px 24px', 
              color: '#4a4a5e', 
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              Analytics
            </button>
            <button style={{ 
              padding: '16px 24px', 
              color: '#4a4a5e', 
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              Configuration
            </button>
            <button style={{ 
              padding: '16px 24px', 
              color: '#4a4a5e', 
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              Get Full Access
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Titre de section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px 0' }}>
            Financial Dashboard
          </h2>
          <p style={{ color: '#4a4a5e' }}>
            Real-time market data and portfolio analysis
          </p>
        </div>

        {/* Dashboard Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Sélection du Pays */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              backgroundColor: '#1a1a2e', 
              border: '1px solid #2a2a3e', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: '0 0 16px 0' }}>
              Sélection du Pays
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4a4a5e', fontSize: '14px' }}>Pays sélectionné</span>
                <span style={{ color: '#ffffff', fontWeight: '500' }}>
                  {selectedCountry === 'FR' ? 'France' : selectedCountry}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4a4a5e', fontSize: '14px' }}>Mis à jour</span>
                <span style={{ color: '#4a4a5e', fontSize: '12px' }}>
                  {new Date().toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Régime Économique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              backgroundColor: '#1a1a2e', 
              border: '1px solid #2a2a3e', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: '0 0 16px 0' }}>
              Régime Économique
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                backgroundColor: '#00ff88', 
                color: '#ffffff', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                textAlign: 'center', 
                fontWeight: 'bold' 
              }}>
                EXPANSION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a4a5e', fontSize: '14px' }}>Indice de confiance</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>85%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a4a5e', fontSize: '14px' }}>Croissance</span>
                  <span style={{ color: '#00ff88', fontWeight: '500' }}>2.5%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a4a5e', fontSize: '14px' }}>Inflation</span>
                  <span style={{ color: '#ffa502', fontWeight: '500' }}>2.8%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a4a5e', fontSize: '14px' }}>Chômage</span>
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>7.5%</span>
                </div>
              </div>
              <div style={{ color: '#4a4a5e', fontSize: '12px' }}>
                Mis à jour: {new Date().toLocaleString('fr-FR')}
              </div>
            </div>
          </motion.div>

          {/* Market Stress Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              backgroundColor: '#1a1a2e', 
              border: '1px solid #2a2a3e', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', margin: '0 0 16px 0' }}>
              Market Stress Indicators
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ color: '#ff4757', fontWeight: 'bold', textAlign: 'center' }}>
                Niveau de stress: EXTRÊME • EXTRÊME
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a4a5e', fontSize: '14px' }}>VIX</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>16.52</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a4a5e', fontSize: '14px' }}>High Yield Spread</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>6.92</span>
                </div>
              </div>
              <div style={{ color: '#4a4a5e', fontSize: '12px' }}>
                Source: fred.stlouisfed.org
              </div>
              <div style={{ color: '#4a4a5e', fontSize: '12px' }}>
                Mis à jour: {new Date().toLocaleString('fr-FR')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tableau des secteurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ 
            backgroundColor: '#1a1a2e', 
            border: '1px solid #2a2a3e', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 16px 0' }}>
              Table des secteurs
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
                    <th style={{ textAlign: 'left', padding: '16px', color: '#4a4a5e', fontWeight: '500', fontSize: '14px' }}>
                      Secteur
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px', color: '#4a4a5e', fontWeight: '500', fontSize: '14px' }}>
                      Allocation
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px', color: '#4a4a5e', fontWeight: '500', fontSize: '14px' }}>
                      Performance
                    </th>
                    <th style={{ textAlign: 'right', padding: '16px', color: '#4a4a5e', fontWeight: '500', fontSize: '14px' }}>
                      Risque
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Technologie', allocation: 25, performance: 12.5, risk: 'Moyen', color: '#00d4ff' },
                    { name: 'Finance', allocation: 20, performance: 8.2, risk: 'Faible', color: '#00ff88' },
                    { name: 'Énergie', allocation: 15, performance: -2.1, risk: 'Élevé', color: '#ffa502' },
                    { name: 'Consommation', allocation: 18, performance: 5.8, risk: 'Moyen', color: '#ff4757' },
                    { name: 'Santé', allocation: 12, performance: 9.3, risk: 'Faible', color: '#9c88ff' },
                    { name: 'Industriels', allocation: 10, performance: 3.2, risk: 'Moyen', color: '#00d4ff' }
                  ].map((sector, index) => (
                    <tr key={sector.name} style={{ borderBottom: '1px solid #2a2a3e' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%',
                            backgroundColor: sector.color 
                          }} />
                          <span style={{ color: '#ffffff', fontWeight: '500' }}>
                            {sector.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <span style={{ color: '#ffffff', fontWeight: '600' }}>
                          {sector.allocation}%
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <span style={{ 
                          fontWeight: '600',
                          color: sector.performance >= 0 ? '#00ff88' : '#ff4757'
                        }}>
                          {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '500',
                          color: sector.risk === 'Faible' ? '#00ff88' : 
                                 sector.risk === 'Moyen' ? '#ffa502' : '#ff4757'
                        }}>
                          {sector.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#0f0f23', 
              borderTop: '1px solid #2a2a3e',
              marginTop: '16px',
              borderRadius: '0 0 12px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                <span style={{ color: '#4a4a5e' }}>
                  Total allocation: 100%
                </span>
                <span style={{ color: '#4a4a5e' }}>
                  Performance moyenne: 6.2%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline des régimes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ 
            backgroundColor: '#1a1a2e', 
            border: '1px solid #2a2a3e', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 16px 0' }}>
              Timeline des régimes
            </h3>
            <div style={{ padding: '24px' }}>
              <div style={{ position: 'relative' }}>
                {/* Ligne de temps verticale */}
                <div style={{ 
                  position: 'absolute', 
                  left: '24px', 
                  top: 0, 
                  bottom: 0, 
                  width: '2px', 
                  backgroundColor: '#2a2a3e' 
                }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { date: '15/01/2025', regime: 'EXPANSION', confidence: 85, description: 'Croissance économique soutenue, inflation maîtrisée', impact: 'positive' },
                    { date: '10/01/2025', regime: 'RECOVERY', confidence: 72, description: 'Reprise post-récession, taux d\'intérêt en baisse', impact: 'positive' },
                    { date: '05/01/2025', regime: 'STAGFLATION', confidence: 45, description: 'Inflation élevée, croissance faible', impact: 'negative' },
                    { date: '28/12/2024', regime: 'RECESSION', confidence: 78, description: 'Contraction économique, chômage en hausse', impact: 'negative' }
                  ].map((event, index) => (
                    <div key={event.date} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      {/* Point sur la timeline */}
                      <div style={{ position: 'relative', zIndex: 10, flexShrink: 0 }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%', 
                          backgroundColor: event.regime === 'EXPANSION' ? '#00ff88' : 
                                           event.regime === 'RECOVERY' ? '#00d4ff' : 
                                           event.regime === 'STAGFLATION' ? '#ffa502' : '#ff4757',
                          border: '2px solid #1a1a2e'
                        }}></div>
                      </div>

                      {/* Contenu de l'événement */}
                      <div style={{ 
                        flex: 1, 
                        backgroundColor: '#0f0f23', 
                        borderRadius: '12px', 
                        padding: '16px', 
                        border: '1px solid #2a2a3e' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              backgroundColor: event.regime === 'EXPANSION' ? '#00ff88' : 
                                             event.regime === 'RECOVERY' ? '#00d4ff' : 
                                             event.regime === 'STAGFLATION' ? '#ffa502' : '#ff4757',
                              color: '#ffffff'
                            }}>
                              {event.regime}
                            </span>
                            <span style={{ color: '#4a4a5e', fontSize: '14px' }}>
                              {event.date}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              fontSize: '18px',
                              color: event.impact === 'positive' ? '#00ff88' : '#ff4757'
                            }}>
                              {event.impact === 'positive' ? '↗️' : '↘️'}
                            </span>
                            <span style={{ color: '#ffffff', fontWeight: '600' }}>
                              {event.confidence}%
                            </span>
                          </div>
                        </div>
                        
                        <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                          {event.description}
                        </p>
                        
                        {/* Barre de confiance */}
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#4a4a5e' }}>Confiance</span>
                            <span style={{ color: '#4a4a5e' }}>{event.confidence}%</span>
                          </div>
                          <div style={{ width: '100%', backgroundColor: '#2a2a3e', borderRadius: '4px', height: '8px' }}>
                            <div style={{ 
                              width: `${event.confidence}%`,
                              height: '8px',
                              borderRadius: '4px',
                              backgroundColor: event.regime === 'EXPANSION' ? '#00ff88' : 
                                             event.regime === 'RECOVERY' ? '#00d4ff' : 
                                             event.regime === 'STAGFLATION' ? '#ffa502' : '#ff4757'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Légende */}
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#0f0f23', 
              borderTop: '1px solid #2a2a3e',
              marginTop: '16px',
              borderRadius: '0 0 12px 12px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00ff88' }}></div>
                  <span style={{ color: '#4a4a5e' }}>Expansion</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00d4ff' }}></div>
                  <span style={{ color: '#4a4a5e' }}>Recovery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffa502' }}></div>
                  <span style={{ color: '#4a4a5e' }}>Stagflation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff4757' }}></div>
                  <span style={{ color: '#4a4a5e' }}>Récession</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ 
            backgroundColor: '#1a1a2e', 
            border: '1px solid #2a2a3e', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', margin: '0 0 16px 0' }}>
              Optimisez votre allocation
            </h3>
            <p style={{ color: '#4a4a5e', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Obtenez des recommandations personnalisées basées sur votre profil de risque 
              et vos objectifs d'investissement.
            </p>
            <button style={{ 
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              color: '#ffffff',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Optimiser mon portefeuille
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 