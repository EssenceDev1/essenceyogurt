import { useState, useEffect, useRef } from "react";
import { auth, onAuthChange, type User } from "@/lib/firebase";
import { subscribeToPush, registerPushSubscription } from "@/lib/push-notifications";

interface EssenceCustomer {
  id: string;
  email: string;
  fullName: string;
  loyaltyPoints: number;
  loyaltyTierId: string;
}

async function syncUserWithBackend(firebaseUser: User): Promise<EssenceCustomer | null> {
  try {
    const response = await fetch("/api/auth/firebase-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber,
        providerId: firebaseUser.providerData[0]?.providerId || "google.com",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Try to subscribe to push notifications after sync
      try {
        const subscription = await subscribeToPush();
        if (subscription && data.customer?.id) {
          await registerPushSubscription(data.customer.id, subscription);
        }
      } catch (pushError) {
        console.log("Push notifications not available");
      }
      
      return data.customer;
    }
  } catch (error) {
    console.error("Backend sync error:", error);
  }
  return null;
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<EssenceCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser && syncedRef.current !== firebaseUser.uid) {
        syncedRef.current = firebaseUser.uid;
        const syncedCustomer = await syncUserWithBackend(firebaseUser);
        setCustomer(syncedCustomer);
      } else if (!firebaseUser) {
        setCustomer(null);
        syncedRef.current = null;
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    customer,
    isLoading,
    isAuthenticated: !!user,
  };
}
