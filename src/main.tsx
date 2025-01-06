import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupStatusBar, setupKeyboard } from './utils/platform';
import App from './App.tsx';
import './index.css';

// Setup native functionality
setupStatusBar();
setupKeyboard();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);