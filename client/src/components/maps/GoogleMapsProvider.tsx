"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: string | null;
  apiKey: string | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
  apiKey: null,
});

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoogleMaps() {
      try {
        const response = await fetch("/api/config/maps");
        if (!response.ok) {
          throw new Error("Failed to get Maps configuration");
        }
        const data = await response.json();
        
        if (!data.apiKey) {
          throw new Error("Google Maps API key not configured");
        }

        setApiKey(data.apiKey);

        if (window.google?.maps) {
          setIsLoaded(true);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;

        (window as any).initGoogleMaps = () => {
          setIsLoaded(true);
          delete (window as any).initGoogleMaps;
        };

        script.onerror = () => {
          setLoadError("Failed to load Google Maps");
        };

        document.head.appendChild(script);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load Maps");
      }
    }

    loadGoogleMaps();
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}
