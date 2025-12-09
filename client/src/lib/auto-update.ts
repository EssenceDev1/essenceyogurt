export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web' | 'unknown';
  browser: string;
  browserVersion: string;
  osVersion: string;
  isStandalone: boolean;
  isPWA: boolean;
  supportsServiceWorker: boolean;
  supportsPush: boolean;
  supportsWebGL: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  touchSupport: boolean;
  connectionType: string;
}

export function detectDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  const platform = detectPlatform(ua);
  const browser = detectBrowser(ua);
  const browserVersion = detectBrowserVersion(ua, browser);
  const osVersion = detectOSVersion(ua, platform);
  
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
  
  const isPWA = isStandalone || document.referrer.includes('android-app://');
  
  return {
    platform,
    browser,
    browserVersion,
    osVersion,
    isStandalone,
    isPWA,
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsPush: 'PushManager' in window,
    supportsWebGL: detectWebGLSupport(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio || 1,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    connectionType: (navigator as any).connection?.effectiveType || 'unknown'
  };
}

function detectPlatform(ua: string): 'ios' | 'android' | 'web' | 'unknown' {
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Windows|Mac|Linux/.test(ua)) return 'web';
  return 'unknown';
}

function detectBrowser(ua: string): string {
  if (/CriOS/.test(ua)) return 'Chrome iOS';
  if (/FxiOS/.test(ua)) return 'Firefox iOS';
  if (/EdgiOS/.test(ua)) return 'Edge iOS';
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/OPR|Opera/.test(ua)) return 'Opera';
  if (/Edge/.test(ua)) return 'Edge';
  if (/Chrome/.test(ua)) return 'Chrome';
  if (/Safari/.test(ua)) return 'Safari';
  if (/Firefox/.test(ua)) return 'Firefox';
  return 'Unknown';
}

function detectBrowserVersion(ua: string, browser: string): string {
  const patterns: Record<string, RegExp> = {
    'Chrome': /Chrome\/(\d+\.\d+)/,
    'Chrome iOS': /CriOS\/(\d+\.\d+)/,
    'Safari': /Version\/(\d+\.\d+)/,
    'Firefox': /Firefox\/(\d+\.\d+)/,
    'Firefox iOS': /FxiOS\/(\d+\.\d+)/,
    'Edge': /Edg\/(\d+\.\d+)/,
    'Edge iOS': /EdgiOS\/(\d+\.\d+)/,
    'Samsung Internet': /SamsungBrowser\/(\d+\.\d+)/,
    'Opera': /OPR\/(\d+\.\d+)/
  };
  
  const pattern = patterns[browser];
  if (pattern) {
    const match = ua.match(pattern);
    if (match) return match[1];
  }
  return 'unknown';
}

function detectOSVersion(ua: string, platform: string): string {
  if (platform === 'ios') {
    const match = ua.match(/OS (\d+[_\.]\d+)/);
    return match ? match[1].replace('_', '.') : 'unknown';
  }
  if (platform === 'android') {
    const match = ua.match(/Android (\d+\.?\d*)/);
    return match ? match[1] : 'unknown';
  }
  return 'unknown';
}

function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export class AutoUpdateManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: number = 60 * 60 * 1000; // 1 hour
  private intervalId: ReturnType<typeof setInterval> | null = null;

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('[AutoUpdate] Service workers not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('[AutoUpdate] Service worker registered');

      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyUpdateAvailable();
            }
          });
        }
      });

      this.startPeriodicChecks();
      
      this.logDeviceInfo();

    } catch (error) {
      console.error('[AutoUpdate] Registration failed:', error);
    }
  }

  private startPeriodicChecks(): void {
    this.intervalId = setInterval(() => {
      this.checkForUpdates();
    }, this.updateCheckInterval);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdates();
      }
    });
  }

  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('[AutoUpdate] Update check completed');
      } catch (error) {
        console.log('[AutoUpdate] Update check failed:', error);
      }
    }
  }

  private notifyUpdateAvailable(): void {
    const event = new CustomEvent('essenceUpdateAvailable', {
      detail: { timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
    
    console.log('[AutoUpdate] New version available');
  }

  applyUpdate(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage('skipWaiting');
      window.location.reload();
    }
  }

  private logDeviceInfo(): void {
    const info = detectDeviceInfo();
    console.log('[AutoUpdate] Device Info:', info);
    
    fetch('/api/monitoring/device-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...info,
        timestamp: new Date().toISOString(),
        appVersion: this.getAppVersion()
      })
    }).catch(() => {});
  }

  getAppVersion(): string {
    return '2025.12.02';
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const autoUpdateManager = new AutoUpdateManager();
