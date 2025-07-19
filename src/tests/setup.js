// Configuration de base pour les tests Oracle Portfolio
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Configuration globale des tests
beforeAll(() => {
  console.log('🧪 Initialisation des tests Oracle Portfolio')
})

// Nettoyage après chaque test
afterEach(() => {
  cleanup()
})

// Nettoyage final
afterAll(() => {
  console.log('✅ Tests Oracle Portfolio terminés')
})

// Mock des APIs externes
global.fetch = vi.fn()

// Mock des fonctions de navigation
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
})

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock des ResizeObserver pour les graphiques
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
