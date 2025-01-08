import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { isNative } from "./platform";

export async function initializePushNotifications(userId: string) {
  if (!isNative()) {
    console.warn("Push notifications are only available on native platforms.");
    return;
  }

  try {
    // Request permission for push notifications
    const permissionResult = await PushNotifications.requestPermissions();
    if (permissionResult.receive !== "granted") {
      console.error("Push notification permission denied");
      return;
    }

    // Register for push notifications
    await PushNotifications.register();

    // Listen for registration success to get FCM token
    PushNotifications.addListener("registration", async ({ value: token }) => {
      if (!token) {
        console.error("FCM token is undefined");
        return;
      }

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error(`User document with ID ${userId} does not exist.`);
        return;
      }

      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
      });
    });

    // Handle notification click
    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      const data = notification.notification.data;
      if (data.shopId) {
        window.location.href = `/shop/${data.shopId}`;
      }
    });

    // Handle notification received while app is in foreground
    PushNotifications.addListener("pushNotificationReceived", async (notification) => {
      // Create a local notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title,
            body: notification.body,
            id: Date.now(),
            extra: notification.data,
            schedule: { at: new Date(Date.now()) }
          }
        ]
      });

      // Handle local notification click
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        const data = notification.notification.extra;
        if (data.shopId) {
          window.location.href = `/shop/${data.shopId}`;
        }
      });
    });

    // Handle registration error
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Error during registration for push notifications:", error);
    });
  } catch (err) {
    console.error("Failed to initialize push notifications:", err);
  }
}