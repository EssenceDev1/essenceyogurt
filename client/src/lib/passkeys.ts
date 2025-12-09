import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export interface PasskeyCredential {
  id: string;
  name: string;
  createdAt: Date;
  lastUsed: Date;
  deviceType: 'platform' | 'cross-platform';
}

export interface PasskeyRegistrationResult {
  success: boolean;
  credential?: PasskeyCredential;
  error?: string;
}

export interface PasskeyAuthResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export function isPasskeySupported(): boolean {
  return !!(
    window.PublicKeyCredential &&
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
  );
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isPasskeySupported()) return false;
  
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function isConditionalMediationAvailable(): Promise<boolean> {
  if (!isPasskeySupported()) return false;
  
  try {
    return await PublicKeyCredential.isConditionalMediationAvailable?.() ?? false;
  } catch {
    return false;
  }
}

export async function registerPasskey(
  userId: string,
  userName: string,
  displayName: string
): Promise<PasskeyRegistrationResult> {
  try {
    const optionsResponse = await fetch('/api/passkeys/register/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName, displayName }),
    });

    if (!optionsResponse.ok) {
      throw new Error('Failed to get registration options');
    }

    const options = await optionsResponse.json();

    const credential = await startRegistration(options);

    const verificationResponse = await fetch('/api/passkeys/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        credential,
      }),
    });

    if (!verificationResponse.ok) {
      throw new Error('Failed to verify registration');
    }

    const result = await verificationResponse.json();

    return {
      success: true,
      credential: {
        id: result.credentialId,
        name: result.credentialName || 'Passkey',
        createdAt: new Date(),
        lastUsed: new Date(),
        deviceType: result.deviceType || 'platform',
      },
    };
  } catch (error: any) {
    console.error('Passkey registration error:', error);
    
    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Registration was cancelled or timed out' };
    }
    if (error.name === 'InvalidStateError') {
      return { success: false, error: 'This device already has a passkey registered' };
    }
    
    return { success: false, error: error.message || 'Registration failed' };
  }
}

export async function authenticateWithPasskey(): Promise<PasskeyAuthResult> {
  try {
    const optionsResponse = await fetch('/api/passkeys/authenticate/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!optionsResponse.ok) {
      throw new Error('Failed to get authentication options');
    }

    const options = await optionsResponse.json();

    const credential = await startAuthentication(options);

    const verificationResponse = await fetch('/api/passkeys/authenticate/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });

    if (!verificationResponse.ok) {
      throw new Error('Failed to verify authentication');
    }

    const result = await verificationResponse.json();

    return {
      success: true,
      userId: result.userId,
    };
  } catch (error: any) {
    console.error('Passkey authentication error:', error);
    
    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Authentication was cancelled or timed out' };
    }
    
    return { success: false, error: error.message || 'Authentication failed' };
  }
}

export async function listUserPasskeys(userId: string): Promise<PasskeyCredential[]> {
  try {
    const response = await fetch(`/api/passkeys/list?userId=${userId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function deletePasskey(credentialId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/passkeys/${credentialId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
}
