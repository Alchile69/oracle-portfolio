import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthModal from '../components/auth/AuthModal'

describe('Authentication System', () => {
  it('devrait afficher le modal d\'authentification', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={() => {}} />)
    expect(screen.getByText(/Authentification/i)).toBeInTheDocument()
    expect(screen.getByText(/Accès restreint aux administrateurs autorisés/i)).toBeInTheDocument()
  })

  it('devrait afficher les champs de connexion', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={() => {}} />)
    expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument()
  })

  it('devrait afficher les identifiants de démonstration', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={() => {}} />)
    expect(screen.getByText(/admin/i)).toBeInTheDocument()
    expect(screen.getByText(/scalabla2025/i)).toBeInTheDocument()
  })

  it('devrait permettre la connexion avec les bons identifiants', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={onSuccess} />)
    
    const usernameInput = screen.getByLabelText(/Nom d'utilisateur/i)
    const passwordInput = screen.getByLabelText(/Mot de passe/i)
    const loginButton = screen.getByRole('button', { name: /Se connecter/i })
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'scalabla2025')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('devrait rejeter les mauvais identifiants', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    
    render(<AuthModal isOpen={true} onClose={() => {}} onSuccess={onSuccess} />)
    
    const usernameInput = screen.getByLabelText(/Nom d'utilisateur/i)
    const passwordInput = screen.getByLabelText(/Mot de passe/i)
    const loginButton = screen.getByRole('button', { name: /Se connecter/i })
    
    await user.type(usernameInput, 'wrong')
    await user.type(passwordInput, 'wrong')
    await user.click(loginButton)
    
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
