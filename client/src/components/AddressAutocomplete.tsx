import { useEffect, useRef, useState, useCallback } from "react";

interface AddressResult {
  fullAddress: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  lat: number;
  lng: number;
}

interface AddressAutocompleteProps {
  onSelect: (address: AddressResult) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  "data-testid"?: string;
}

export default function AddressAutocomplete({
  onSelect,
  placeholder = "Start typing your address...",
  className = "",
  defaultValue = "",
  "data-testid": testId = "input-address-autocomplete",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initAttempted = useRef(false);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current) return false;
    
    if (!window.google?.maps?.places) {
      return false;
    }

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["address_components", "formatted_address", "geometry"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place || !place.address_components) return;

        const getComponent = (type: string): string => {
          const component = place.address_components?.find((c) =>
            c.types.includes(type)
          );
          return component?.long_name || "";
        };

        const getShortComponent = (type: string): string => {
          const component = place.address_components?.find((c) =>
            c.types.includes(type)
          );
          return component?.short_name || "";
        };

        const result: AddressResult = {
          fullAddress: place.formatted_address || "",
          street: `${getComponent("street_number")} ${getComponent("route")}`.trim(),
          city: getComponent("locality") || getComponent("administrative_area_level_2"),
          state: getShortComponent("administrative_area_level_1"),
          postcode: getComponent("postal_code"),
          country: getComponent("country"),
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
        };

        setInputValue(result.fullAddress);
        onSelect(result);
      });

      setIsLoaded(true);
      setError(null);
      return true;
    } catch (err) {
      console.error("Google Places autocomplete error:", err);
      setError("Address autocomplete unavailable");
      return false;
    }
  }, [onSelect]);

  useEffect(() => {
    if (initAttempted.current) return;
    
    // Try to initialize immediately if Google Maps is already loaded
    if (window.google?.maps?.places) {
      initAttempted.current = true;
      initAutocomplete();
      return;
    }

    // Wait for Google Maps to load (it's loaded globally by the app)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.google?.maps?.places) {
        clearInterval(checkInterval);
        initAttempted.current = true;
        initAutocomplete();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        setError("Google Maps not available");
        setIsLoaded(true); // Stop loading spinner
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [initAutocomplete]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={error || placeholder}
        data-testid={testId}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all ${className} ${error ? "border-red-300" : ""}`}
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "15px",
        }}
        autoComplete="off"
        disabled={!!error}
      />
      {!isLoaded && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
