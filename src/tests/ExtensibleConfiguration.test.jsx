import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExtensibleConfigurationPanel from '../components/admin/ExtensibleConfigurationPanel'

describe('Extensible Configuration System', () => {
  it('devrait afficher le titre Configuration Extensible', () => {
    render(<ExtensibleConfigurationPanel />)
    expect(screen.getByText(/Configuration Extensible Oracle Portfolio/i)).toBeInTheDocument()
  })

  it('devrait afficher tous les onglets de configuration', () => {
    render(<ExtensibleConfigurationPanel />)
    expect(screen.getByText(/Général/i)).toBeInTheDocument()
    expect(screen.getByText(/Indicateurs/i)).toBeInTheDocument()
    expect(screen.getByText(/Formules/i)).toBeInTheDocument()
    expect(screen.getByText(/Régimes/i)).toBeInTheDocument()
    expect(screen.getByText(/Plugins/i)).toBeInTheDocument()
  })

  it('devrait afficher la configuration générale par défaut', () => {
    render(<ExtensibleConfigurationPanel />)
    expect(screen.getByDisplayValue(/Oracle Portfolio/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/Production/i)).toBeInTheDocument()
  })

  it('devrait permettre de naviguer vers l\'onglet Indicateurs', async () => {
    const user = userEvent.setup()
    render(<ExtensibleConfigurationPanel />)
    
    const indicatorsTab = screen.getByText(/Indicateurs/i)
    await user.click(indicatorsTab)
    
    expect(screen.getByText(/Nouveau indicateur/i)).toBeInTheDocument()
  })

  it('devrait afficher les indicateurs existants', async () => {
    const user = userEvent.setup()
    render(<ExtensibleConfigurationPanel />)
    
    const indicatorsTab = screen.getByText(/Indicateurs/i)
    await user.click(indicatorsTab)
    
    expect(screen.getByText(/Électricité/i)).toBeInTheDocument()
    expect(screen.getByText(/PMI/i)).toBeInTheDocument()
    expect(screen.getByText(/25%/)).toBeInTheDocument()
    expect(screen.getByText(/30%/)).toBeInTheDocument()
  })

  it('devrait afficher le gestionnaire de plugins', async () => {
    const user = userEvent.setup()
    render(<ExtensibleConfigurationPanel />)
    
    const pluginsTab = screen.getByText(/Plugins/i)
    await user.click(pluginsTab)
    
    expect(screen.getByText(/Gestionnaire de Plugins/i)).toBeInTheDocument()
    expect(screen.getByText(/Exporter Configuration/i)).toBeInTheDocument()
    expect(screen.getByText(/Importer Configuration/i)).toBeInTheDocument()
    expect(screen.getByText(/Valider Configuration/i)).toBeInTheDocument()
  })

  it('devrait afficher les statistiques des plugins', async () => {
    const user = userEvent.setup()
    render(<ExtensibleConfigurationPanel />)
    
    const pluginsTab = screen.getByText(/Plugins/i)
    await user.click(pluginsTab)
    
    expect(screen.getByText(/7/)).toBeInTheDocument() // Indicateurs
    expect(screen.getByText(/2/)).toBeInTheDocument() // Formules
    expect(screen.getByText(/4/)).toBeInTheDocument() // Régimes
  })
})
