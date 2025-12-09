const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushSupported(): Promise<boolean> {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return "denied";
  }
  return await Notification.requestPermission();
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export async function subscribeToPush(): Promise<PushSubscriptionData | null> {
  try {
    const supported = await isPushSupported();
    if (!supported) {
      console.warn("Push notifications not supported");
      return null;
    }

    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription && VAPID_PUBLIC_KEY) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    if (!subscription) {
      console.warn("Could not create push subscription");
      return null;
    }

    const subscriptionJSON = subscription.toJSON();

    return {
      endpoint: subscriptionJSON.endpoint || "",
      keys: {
        p256dh: subscriptionJSON.keys?.p256dh || "",
        auth: subscriptionJSON.keys?.auth || "",
      },
    };
  } catch (error) {
    console.error("Push subscription error:", error);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return false;
  }
}

export async function registerPushSubscription(
  userId: string,
  subscription: PushSubscriptionData
): Promise<boolean> {
  try {
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId,
        subscription,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to register push subscription:", error);
    return false;
  }
}

export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  const permission = await getNotificationPermission();
  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, {
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    ...options,
  });
}
