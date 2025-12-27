import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Ensure Tailwind @import "tailwindcss" is inside this file!
import App from './App.jsx' // Changed to default import (common practice)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)