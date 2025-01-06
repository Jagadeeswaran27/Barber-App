import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera } from '@capacitor/camera';
import { setupStatusBar, setupKeyboard, isNative } from './utils/platform';
import App from './App.tsx';
import './index.css';

// Request camera permission on app start
async function requestInitialPermissions() {
  if (!isNative()) return;
  
  try {
    const permission = await Camera.checkPermissions();
    if (permission.camera !== 'granted') {
      await Camera.requestPermissions();
    }
  } catch (err) {
    console.warn('Failed to request camera permission:', err);
  }
}

// Setup native functionality
setupStatusBar();
setupKeyboard();
requestInitialPermissions();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);