import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';

export const isPlatform = (platform: string) => {
  return Capacitor.getPlatform() === platform;
};

export const isNative = () => {
  return Capacitor.isNativePlatform();
};

export const setupStatusBar = async () => {
  if (!isNative()) return;
  
  await StatusBar.setStyle({ style: Style.Light });
  if (isPlatform('android')) {
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setOverlaysWebView({ overlay: true });
  }
};

export const setupKeyboard = () => {
  if (!isNative()) return;

  Keyboard.addListener('keyboardWillShow', () => {
    document.body.classList.add('keyboard-open');
  });

  Keyboard.addListener('keyboardWillHide', () => {
    document.body.classList.remove('keyboard-open');
  });
};

export const setupNetwork = (callback: (connected: boolean) => void) => {
  if (!isNative()) return;

  Network.addListener('networkStatusChange', status => {
    callback(status.connected);
  });
};