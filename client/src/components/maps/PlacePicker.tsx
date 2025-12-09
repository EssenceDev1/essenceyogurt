"use client";

import { useRef, useEffect, useState } from "react";
import { useGoogleMaps } from "./GoogleMapsProvider";
import { MapPin, Search, X } from "lucide-react";

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface PlacePickerProps {
  placeholder?: string;
  value?: string;
  onChange?: (place: PlaceResult | null) => void;
  className?: string;
  disabled?: boolean;
}

export function PlacePicker({
  placeholder = "Search for an address...",
  value,
  onChange,
  className = "",
  disabled = false,
}: PlacePickerProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment", "geocode"],
      fields: ["place_id", "name", "formatted_address", "geometry", "address_components"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry?.location) {
        onChange?.(null);
        return;
      }

      let city = "";
      let country = "";
      
      place.address_components?.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      });

      const result: PlaceResult = {
        placeId: place.place_id || "",
        name: place.name || "",
        address: place.formatted_address || "",
        city,
        country,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };

      setInputValue(result.address);
      onChange?.(result);
    });

    autocompleteRef.current = autocomplete;

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, onChange]);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleClear = () => {
    setInputValue("");
    onChange?.(null);
    inputRef.current?.focus();
  };

  if (loadError) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        <MapPin size={16} />
        <span>Maps unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
        {isLoaded ? <Search size={18} /> : (
          <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={isLoaded ? placeholder : "Loading maps..."}
        disabled={disabled || !isLoaded}
        className="w-full pl-11 pr-10 py-3 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        data-testid="input-place-picker"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Clear"
          data-testid="btn-clear-place"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
