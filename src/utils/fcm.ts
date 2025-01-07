import { PushNotifications } from '@capacitor/push-notifications';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isNative } from './platform';

export async function initializePushNotifications(userId: string) {
  if (!isNative()) return;

  try {
    // Request permission
    const result = await PushNotifications.requestPermissions();
    if (result.receive !== 'granted') {
      throw new Error('Push notification permission denied');
    }

    // Register with FCM
    await PushNotifications.register();

    // Get FCM token
    const { value: token } = await PushNotifications.getToken();

    // Get current user doc to check existing tokens
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    
    // Prepare token data
    const tokenData = {
      token,
      platform: isNative() ? 'mobile' : 'web',
      updatedAt: new Date().toISOString()
    };

    // Update Firestore - add new token to array
    await updateDoc(doc(db, 'users', userId), {
      fcmTokens: arrayUnion(tokenData)
    });

    // Listen for token refresh
    PushNotifications.addListener('registration', async ({ value }) => {
      const refreshedTokenData = {
        token: value,
        platform: isNative() ? 'mobile' : 'web',
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'users', userId), {
        fcmTokens: arrayUnion(refreshedTokenData)
      });
    });

  } catch (err) {
    console.error('Failed to initialize push notifications:', err);
  }
}