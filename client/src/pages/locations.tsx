import { useState } from "react";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, Phone, Clock, Search, List, Map as MapIcon, ChevronRight } from "lucide-react";
import { StoreLocatorMap, PlacePicker, type StoreLocation, type PlaceResult } from "@/components/maps";

interface LocationData {
  id: string;
  city: string;
  country: string;
  venue: string;
  detail: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  hours?: string;
  status: string;
}

export default function Locations() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [searchPlace, setSearchPlace] = useState<PlaceResult | null>(null);

  const { data: locationsData, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations");
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json() as Promise<{ locations: LocationData[] }>;
    },
  });

  const locations: StoreLocation[] = (locationsData?.locations || []).map((loc) => ({
    id: loc.id,
    name: `${loc.venue} - ${loc.city}`,
    address: loc.address || loc.detail,
    city: loc.city,
    country: loc.country,
    venue: loc.venue,
    detail: loc.detail,
    phone: loc.phone,
    hours: loc.hours,
    latitude: loc.latitude ? parseFloat(loc.latitude) : NaN,
    longitude: loc.longitude ? parseFloat(loc.longitude) : NaN,
    status: loc.status,
  }));

  const handlePlaceChange = (place: PlaceResult | null) => {
    setSearchPlace(place);
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4af37] mb-3">
                  Find Us
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                  Our Locations
                </h1>
                <p className="text-sm text-neutral-600 max-w-xl">
                  Experience Essence Yogurt at premier travel and retail destinations
                  worldwide. Self serve bars in airports, malls and VIP venues.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-neutral-100 rounded-full p-1">
                  <button
                    onClick={() => setViewMode("map")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      viewMode === "map"
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                    data-testid="btn-view-map"
                  >
                    <MapIcon size={14} />
                    Map
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      viewMode === "list"
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                    data-testid="btn-view-list"
                  >
                    <List size={14} />
                    List
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-md">
              <PlacePicker
                placeholder="Search by city, address, or landmark..."
                onChange={handlePlaceChange}
              />
            </div>
          </div>
        </section>

        {viewMode === "map" ? (
          <section className="border-b border-neutral-200">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3 h-[500px] lg:h-[600px]">
                  <StoreLocatorMap
                    locations={locations}
                    selectedLocationId={selectedLocationId || undefined}
                    onSelectLocation={(loc) => setSelectedLocationId(loc?.id || null)}
                    className="h-full"
                    centerOnUserLocation
                  />
                </div>

                <div className="lg:w-1/3 border-l border-neutral-200 bg-neutral-50 max-h-[600px] overflow-y-auto">
                  <div className="p-4 border-b border-neutral-200 bg-white sticky top-0 z-10">
                    <h2 className="text-sm font-semibold text-neutral-900">
                      {locations.length} Location{locations.length !== 1 ? "s" : ""}
                    </h2>
                  </div>
                  
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#d4af37] rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-neutral-500">Loading locations...</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-200">
                      {locations.map((loc) => {
                        const isOpen = loc.status.toLowerCase().includes("open");
                        const isSelected = loc.id === selectedLocationId;
                        
                        return (
                          <button
                            key={loc.id}
                            onClick={() => setSelectedLocationId(loc.id)}
                            className={`w-full text-left p-4 transition-all hover:bg-white ${
                              isSelected ? "bg-white border-l-4 border-l-[#d4af37]" : ""
                            }`}
                            data-testid={`location-item-${loc.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isOpen 
                                  ? "bg-gradient-to-br from-[#d4af37] to-[#a07c10]" 
                                  : "bg-neutral-200"
                              }`}>
                                <MapPin size={18} className={isOpen ? "text-white" : "text-neutral-500"} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h3 className="text-sm font-semibold text-neutral-900 truncate">
                                    {loc.venue}
                                  </h3>
                                  {isOpen && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-[#d4af37] font-medium mb-1">
                                  {loc.city}, {loc.country}
                                </p>
                                <p className="text-xs text-neutral-500 line-clamp-2">
                                  {loc.detail}
                                </p>
                                <span className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isOpen 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-amber-100 text-amber-700"
                                }`}>
                                  {loc.status}
                                </span>
                              </div>
                              <ChevronRight size={16} className="text-neutral-300 flex-shrink-0 mt-2" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="border-b border-neutral-200 bg-neutral-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
              {isLoading ? (
                <div className="text-center text-neutral-400 py-10">Loading locations...</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {locations.map((loc) => {
                    const isOpen = loc.status.toLowerCase().includes("open");
                    
                    return (
                      <div
                        key={loc.id}
                        className="rounded-2xl border border-neutral-200 bg-white p-5 flex items-start gap-4 hover:border-[#d4af37]/50 hover:shadow-md transition-all cursor-pointer"
                        data-testid={`location-card-${loc.id}`}
                        onClick={() => {
                          setSelectedLocationId(loc.id);
                          setViewMode("map");
                        }}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          isOpen
                            ? "bg-gradient-to-br from-[#d4af37] to-[#a07c10]"
                            : "bg-neutral-100"
                        }`}>
                          <MapPin size={24} className={isOpen ? "text-white" : "text-neutral-400"} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold">{loc.city}, {loc.country}</h3>
                            {isOpen && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-[#d4af37] font-medium mb-1">{loc.venue}</p>
                          <p className="text-xs text-neutral-600 mb-2">{loc.detail}</p>
                          {loc.phone && (
                            <p className="text-xs text-neutral-500 flex items-center gap-1 mb-1">
                              <Phone size={12} /> {loc.phone}
                            </p>
                          )}
                          {loc.hours && (
                            <p className="text-xs text-neutral-500 flex items-center gap-1 mb-2">
                              <Clock size={12} /> {loc.hours}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
                              isOpen
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {loc.status}
                            </span>
                            {loc.latitude && loc.longitude && (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                                data-testid={`link-directions-${loc.id}`}
                              >
                                <Navigation size={12} /> Get Directions
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Expansion Focus
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-2xl">
              Europe and the Middle East are the next flagship regions for airports,
              malls and luxury carts. We are actively seeking premium locations in
              major travel hubs and shopping destinations.
            </p>
            <div className="grid gap-4 md:grid-cols-3 text-xs">
              {[
                { region: "Middle East", focus: "Dubai, Riyadh, Doha" },
                { region: "Europe", focus: "Paris, London, Milan" },
                { region: "Asia Pacific", focus: "Singapore, Tokyo, Sydney" },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5">
                  <p className="font-semibold text-neutral-900 mb-1">{item.region}</p>
                  <p className="text-neutral-600">{item.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
