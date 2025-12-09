import { initializeApp, type FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  type User, 
  type Auth,
  type ConfirmationResult
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseConfigValid = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase config missing - auth features disabled");
}

export { auth, googleProvider };

// Google Sign-In
export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    return { user: null, error: "Firebase not configured" };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
}

// Email/Password Sign Up
export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  if (!auth) {
    return { user: null, error: "Firebase not configured" };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Email sign-up error:", error);
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
}

// Email/Password Sign In
export async function signInWithEmail(email: string, password: string) {
  if (!auth) {
    return { user: null, error: "Firebase not configured" };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Email sign-in error:", error);
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
}

// Password Reset
export async function resetPassword(email: string) {
  if (!auth) {
    return { success: false, error: "Firebase not configured" };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { success: false, error: getFirebaseErrorMessage(error.code) };
  }
}

// Phone/SMS Authentication
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export function initRecaptcha(buttonId: string) {
  if (!auth) return null;
  
  try {
    // Clear existing verifier
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
    }
    
    recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
    
    return recaptchaVerifier;
  } catch (error) {
    console.error("reCAPTCHA init error:", error);
    return null;
  }
}

export async function sendSmsCode(phoneNumber: string) {
  if (!auth) {
    return { success: false, error: "Firebase not configured" };
  }
  
  try {
    if (!recaptchaVerifier) {
      return { success: false, error: "reCAPTCHA not initialized" };
    }
    
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("SMS send error:", error);
    return { success: false, error: getFirebaseErrorMessage(error.code) };
  }
}

export async function verifySmsCode(code: string) {
  if (!confirmationResult) {
    return { user: null, error: "No verification in progress" };
  }
  
  try {
    const result = await confirmationResult.confirm(code);
    confirmationResult = null;
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("SMS verify error:", error);
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
}

// Sign Out
export async function logOut() {
  if (!auth) {
    return { success: false, error: "Firebase not configured" };
  }
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Sign-out error:", error);
    return { success: false, error: error.message };
  }
}

// Auth State Observer
export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// User-friendly error messages
function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
    'auth/missing-phone-number': 'Please enter your phone number.',
    'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
    'auth/code-expired': 'Verification code expired. Please request a new one.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

export type { User };
