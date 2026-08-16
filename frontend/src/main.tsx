/**
 * SynTrait
 * Comparative Genomics Platform for Agronomic Trait Discovery
 *
 * Author: Balaji Muthukumar
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
