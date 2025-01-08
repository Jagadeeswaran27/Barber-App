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
    const [pushPermission, localPermission] = await Promise.all([
      PushNotifications.requestPermissions(),
      LocalNotifications.requestPermissions(),
    ]);

    if (pushPermission.receive !== "granted") {
      console.error("Push notification permission denied");
      return;
    }

    await PushNotifications.register();

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

    // Handle push notification click
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log(
          "Push notification clicked:",
          notification.notification.data
        );
        const data = notification.notification.data;
        if (data.shopId) {
          // Use history.pushState for smoother navigation
          history.pushState(null, "", `/shop/${data.shopId}`);
          // Force a page reload to ensure proper route handling
          window.location.reload();
        }
      }
    );

    // Handle local notification click
    LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (notification) => {
        const data = notification.notification.extra;
        if (data.shopId) {
          // Use history.pushState for smoother navigation
          history.pushState(null, "", `/shop/${data.shopId}`);
          // Force a page reload to ensure proper route handling
          window.location.reload();
        }
      }
    );

    PushNotifications.addListener("registrationError", (error) => {
      console.error("Error during registration for push notifications:", error);
    });
  } catch (err) {
    console.error("Failed to initialize push notifications:", err);
  }
}
