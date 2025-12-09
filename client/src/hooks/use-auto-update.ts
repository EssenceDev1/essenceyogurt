import { useEffect, useState, useCallback } from 'react';
import { autoUpdateManager, detectDeviceInfo, type DeviceInfo } from '@/lib/auto-update';

export function useAutoUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    autoUpdateManager.initialize();
    setDeviceInfo(detectDeviceInfo());

    const handleUpdate = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener('essenceUpdateAvailable', handleUpdate);

    return () => {
      window.removeEventListener('essenceUpdateAvailable', handleUpdate);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    autoUpdateManager.applyUpdate();
  }, []);

  const checkForUpdates = useCallback(async () => {
    await autoUpdateManager.checkForUpdates();
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  return {
    updateAvailable,
    deviceInfo,
    applyUpdate,
    checkForUpdates,
    dismissUpdate,
    appVersion: autoUpdateManager.getAppVersion()
  };
}
