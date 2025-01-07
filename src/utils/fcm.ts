import { PushNotifications } from "@capacitor/push-notifications";
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

      // Fetch user document to check existing tokens
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error(`User document with ID ${userId} does not exist.`);
        return;
      }

      // Add new token to Firestore array
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
      });
      console.log("FCM token added successfully:", token);
    });

    // Handle registration error
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Error during registration for push notifications:", error);
    });
  } catch (err) {
    console.error("Failed to initialize push notifications:", err);
  }
}