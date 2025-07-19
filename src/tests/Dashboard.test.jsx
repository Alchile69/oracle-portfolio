import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from '../components/Dashboard'

// Mock des données
vi.mock('../data/mockData', () => ({
  default: {
    countries: {
      FR: { name: 'France', flag: '🇫🇷' },
      US: { name: 'États-Unis', flag: '🇺🇸' }
    }
  }
}))

describe('Dashboard Component', () => {
  it('devrait afficher le titre Oracle Portfolio', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Oracle Portfolio/i)).toBeInTheDocument()
  })

  it('devrait afficher les modules financiers', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Sélection du Pays/i)).toBeInTheDocument()
    expect(screen.getByText(/Régime Économique/i)).toBeInTheDocument()
    expect(screen.getByText(/Market Stress Indicators/i)).toBeInTheDocument()
    expect(screen.getByText(/Allocations de portefeuille/i)).toBeInTheDocument()
  })

  it('devrait afficher le dropdown de sélection de pays', () => {
    render(<Dashboard />)
    const countrySelect = screen.getByRole('combobox')
    expect(countrySelect).toBeInTheDocument()
  })

  it('devrait afficher les données temps réel', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Mise à jour/i)).toBeInTheDocument()
  })
})
