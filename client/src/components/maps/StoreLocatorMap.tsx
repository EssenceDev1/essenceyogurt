"use client";

import { useRef, useEffect, useState } from "react";
import { useGoogleMaps } from "./GoogleMapsProvider";
import { MapPin, Navigation } from "lucide-react";

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  venue?: string;
  detail?: string;
  phone?: string;
  hours?: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface StoreLocatorMapProps {
  locations: StoreLocation[];
  selectedLocationId?: string;
  onSelectLocation?: (location: StoreLocation | null) => void;
  className?: string;
  showSearch?: boolean;
  centerOnUserLocation?: boolean;
}

const ESSENCE_GOLD = "#d4af37";

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
];

function createMarkerIcon(isOpen: boolean, isSelected: boolean) {
  const scale = isSelected ? 12 : 10;
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale,
    fillColor: isOpen ? ESSENCE_GOLD : "#9ca3af",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 3,
  };
}

export function StoreLocatorMap({
  locations,
  selectedLocationId,
  onSelectLocation,
  className = "",
  centerOnUserLocation = false,
}: StoreLocatorMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      const defaultCenter = { lat: 25.2048, lng: 55.2708 };

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 3,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      infoWindowRef.current = new google.maps.InfoWindow();

      if (centerOnUserLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(pos);
            mapInstanceRef.current?.setCenter(pos);
            mapInstanceRef.current?.setZoom(10);
          },
          () => {}
        );
      }
    } catch (err) {
      console.error("Error initializing map:", err);
      setMapError("Failed to initialize map");
    }
  }, [isLoaded, centerOnUserLocation]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    try {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      const bounds = new google.maps.LatLngBounds();
      let hasValidLocations = false;

      locations.forEach((location) => {
        if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return;

        hasValidLocations = true;
        const position = { lat: location.latitude, lng: location.longitude };
        bounds.extend(position);

        const isOpen = location.status.toLowerCase().includes("open");
        const isSelected = location.id === selectedLocationId;

        const marker = new google.maps.Marker({
          map: mapInstanceRef.current,
          position,
          icon: createMarkerIcon(isOpen, isSelected),
          title: location.name,
          animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        });

        marker.addListener("click", () => {
          onSelectLocation?.(location);

          markersRef.current.forEach((m) => m.setAnimation(null));
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 1500);

          const content = `
            <div style="padding: 12px; max-width: 280px; font-family: Inter, system-ui, sans-serif;">
              <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #171717;">
                ${location.venue || location.name}
              </h3>
              <p style="margin: 0 0 8px; font-size: 12px; color: ${ESSENCE_GOLD}; font-weight: 500;">
                ${location.city}, ${location.country}
              </p>
              ${location.address ? `<p style="margin: 0 0 8px; font-size: 11px; color: #525252;">${location.address}</p>` : ""}
              ${location.detail ? `<p style="margin: 0 0 8px; font-size: 11px; color: #737373;">${location.detail}</p>` : ""}
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span style="
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  padding: 4px 10px;
                  background: ${isOpen ? "#dcfce7" : "#fef3c7"};
                  color: ${isOpen ? "#166534" : "#92400e"};
                  border-radius: 100px;
                  font-size: 10px;
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                ">
                  <span style="width: 6px; height: 6px; background: currentColor; border-radius: 50%;"></span>
                  ${location.status}
                </span>
              </div>
              ${location.phone || location.hours ? `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e5e5;">
                  ${location.phone ? `<p style="margin: 0 0 4px; font-size: 11px; color: #525252;">📞 ${location.phone}</p>` : ""}
                  ${location.hours ? `<p style="margin: 0; font-size: 11px; color: #525252;">🕐 ${location.hours}</p>` : ""}
                </div>
              ` : ""}
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}" 
                target="_blank"
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  margin-top: 12px;
                  padding: 8px 16px;
                  background: linear-gradient(135deg, ${ESSENCE_GOLD} 0%, #a07c10 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 100px;
                  font-size: 11px;
                  font-weight: 600;
                "
              >
                Get Directions →
              </a>
            </div>
          `;

          infoWindowRef.current?.setContent(content);
          infoWindowRef.current?.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      });

      if (hasValidLocations && !selectedLocationId) {
        mapInstanceRef.current.fitBounds(bounds);
        const listener = google.maps.event.addListener(mapInstanceRef.current, "idle", () => {
          const zoom = mapInstanceRef.current?.getZoom();
          if (zoom && zoom > 15) {
            mapInstanceRef.current?.setZoom(15);
          }
          google.maps.event.removeListener(listener);
        });
      }
    } catch (err) {
      console.error("Error creating markers:", err);
    }
  }, [isLoaded, locations, selectedLocationId, onSelectLocation]);

  useEffect(() => {
    if (!selectedLocationId || !mapInstanceRef.current) return;

    const location = locations.find((l) => l.id === selectedLocationId);
    if (location && Number.isFinite(location.latitude) && Number.isFinite(location.longitude)) {
      mapInstanceRef.current.setCenter({
        lat: location.latitude,
        lng: location.longitude,
      });
      mapInstanceRef.current.setZoom(15);
    }
  }, [selectedLocationId, locations]);

  if (loadError || mapError) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 rounded-2xl ${className}`}>
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Map temporarily unavailable</p>
          <p className="text-neutral-400 text-xs mt-1">View locations in the list</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 rounded-2xl ${className}`}>
        <div className="text-center p-8">
          <div className="w-10 h-10 border-3 border-neutral-200 border-t-[#d4af37] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" data-testid="store-locator-map" />
      
      {userLocation && (
        <button
          onClick={() => {
            mapInstanceRef.current?.setCenter(userLocation);
            mapInstanceRef.current?.setZoom(14);
          }}
          className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="Center on my location"
          data-testid="btn-center-location"
        >
          <Navigation size={20} className="text-[#d4af37]" />
        </button>
      )}
    </div>
  );
}
