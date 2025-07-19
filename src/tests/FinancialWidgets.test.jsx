import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BacktestingCard from '../components/widgets/BacktestingCard'
import AllocationsCard from '../components/widgets/AllocationsCard'
import MarketStressCard from '../components/widgets/MarketStressCard'

describe('Financial Widgets', () => {
  describe('BacktestingCard', () => {
    it('devrait afficher le titre Backtesting Engine', () => {
      render(<BacktestingCard />)
      expect(screen.getByText(/Backtesting Engine/i)).toBeInTheDocument()
    })

    it('devrait afficher les champs de dates', () => {
      render(<BacktestingCard />)
      expect(screen.getByLabelText(/Date de début/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date de fin/i)).toBeInTheDocument()
    })

    it('devrait afficher le bouton Lancer le backtest', () => {
      render(<BacktestingCard />)
      expect(screen.getByRole('button', { name: /Lancer le backtest/i })).toBeInTheDocument()
    })

    it('devrait afficher les corrections de dates intelligentes', () => {
      render(<BacktestingCard />)
      expect(screen.getByText(/Corrections de dates intelligentes/i)).toBeInTheDocument()
      expect(screen.getByText(/today.*aujourd'hui/i)).toBeInTheDocument()
    })
  })

  describe('AllocationsCard', () => {
    it('devrait afficher le titre Allocations de portefeuille', () => {
      render(<AllocationsCard />)
      expect(screen.getByText(/Allocations de portefeuille/i)).toBeInTheDocument()
    })

    it('devrait afficher les pourcentages d\'allocation', () => {
      render(<AllocationsCard />)
      expect(screen.getByText(/65%/)).toBeInTheDocument() // Actions
      expect(screen.getByText(/25%/)).toBeInTheDocument() // Obligations
      expect(screen.getByText(/5%/)).toBeInTheDocument()  // Matières premières et Liquidités
    })

    it('devrait afficher la légende des allocations', () => {
      render(<AllocationsCard />)
      expect(screen.getByText(/Actions/i)).toBeInTheDocument()
      expect(screen.getByText(/Obligations/i)).toBeInTheDocument()
      expect(screen.getByText(/Matières premières/i)).toBeInTheDocument()
      expect(screen.getByText(/Liquidités/i)).toBeInTheDocument()
    })
  })

  describe('MarketStressCard', () => {
    it('devrait afficher le titre Market Stress Indicators', () => {
      render(<MarketStressCard />)
      expect(screen.getByText(/Market Stress Indicators/i)).toBeInTheDocument()
    })

    it('devrait afficher le niveau de stress', () => {
      render(<MarketStressCard />)
      expect(screen.getByText(/EXTRÊME/i)).toBeInTheDocument()
    })

    it('devrait afficher les indicateurs VIX et High Yield Spread', () => {
      render(<MarketStressCard />)
      expect(screen.getByText(/VIX/i)).toBeInTheDocument()
      expect(screen.getByText(/High Yield Spread/i)).toBeInTheDocument()
    })

    it('devrait afficher les valeurs numériques', () => {
      render(<MarketStressCard />)
      expect(screen.getByText(/16\.52/)).toBeInTheDocument()
      expect(screen.getByText(/6\.92/)).toBeInTheDocument()
    })
  })
})
