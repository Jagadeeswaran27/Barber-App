import { Preferences } from '@capacitor/preferences';
import { isNative } from './platform';

const CREDENTIALS_KEY = 'auth_credentials';

interface StoredCredentials {
  email: string;
  password: string;
}

export async function saveCredentials(email: string, password: string): Promise<void> {
  if (!isNative()) return;
  
  try {
    await Preferences.set({
      key: CREDENTIALS_KEY,
      value: JSON.stringify({ email, password })
    });
  } catch (err) {
    console.error('Failed to save credentials:', err);
  }
}

export async function getStoredCredentials(): Promise<StoredCredentials | null> {
  if (!isNative()) return null;
  
  try {
    const { value } = await Preferences.get({ key: CREDENTIALS_KEY });
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error('Failed to get stored credentials:', err);
    return null;
  }
}

export async function clearStoredCredentials(): Promise<void> {
  if (!isNative()) return;
  
  try {
    await Preferences.remove({ key: CREDENTIALS_KEY });
  } catch (err) {
    console.error('Failed to clear credentials:', err);
  }
}