import { useState, useEffect } from "react";
import { Image, Video, Play, Music, ChevronDown, ExternalLink, X } from "lucide-react";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import brandedCupsImage from "@assets/IMG_1165_1764660750884.jpeg";
import productShowcaseImage from "@assets/IMG_2622_1764626731265.jpeg";
import heroProductImage from "@assets/IMG_1150_1764625170544.jpeg";
import toppingsBarImage from "@assets/IMG_1195_1764662959420.jpeg";
import airportFamilyImage from "@assets/IMG_1194_1764662959420.jpeg";
import createEssenceImage from "@assets/IMG_1193_1764662959420.jpeg";
import luxuryPoolsideImage from "@assets/IMG_1191_1764662959420.jpeg";
import discoverEssenceImage from "@assets/IMG_1190_1764662959420.jpeg";
import brandCollageImage from "@assets/IMG_1187_1764662959421.jpeg";
import flavorVarietiesImage from "@assets/IMG_1188_1764662959421.jpeg";

interface GalleryItem {
  id: string;
  type: "photo" | "video";
  src: string;
  thumbnail?: string;
  title: string;
  description?: string;
  category: string;
}

const galleryCategories = [
  { id: "all", label: "All" },
  { id: "stores", label: "Our Stores" },
  { id: "flavors", label: "Flavors" },
  { id: "toppings", label: "Toppings" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "events", label: "Events" },
  { id: "behind", label: "Behind the Scenes" },
];

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    type: "photo",
    src: brandCollageImage,
    title: "The Essence Experience",
    description: "A glimpse into our world of luxury frozen yogurt",
    category: "stores",
  },
  {
    id: "2",
    type: "photo",
    src: discoverEssenceImage,
    title: "Discover Your Essence",
    description: "Unlimited possibilities with our signature creations",
    category: "flavors",
  },
  {
    id: "3",
    type: "photo",
    src: createEssenceImage,
    title: "Create Your Essence",
    description: "Fresh. Natural. Delicious.",
    category: "flavors",
  },
  {
    id: "4",
    type: "photo",
    src: flavorVarietiesImage,
    title: "Flavor Varieties Collection",
    description: "Mango passion, berry bliss, and classic vanilla",
    category: "flavors",
  },
  {
    id: "5",
    type: "photo",
    src: luxuryPoolsideImage,
    title: "VIP Poolside Experience",
    description: "Luxury moments with champagne and frozen yogurt",
    category: "lifestyle",
  },
  {
    id: "6",
    type: "photo",
    src: airportFamilyImage,
    title: "Airport Moments",
    description: "Family joy at our international airport locations",
    category: "events",
  },
  {
    id: "7",
    type: "photo",
    src: toppingsBarImage,
    title: "Premium Toppings Bar",
    description: "Over 40 luxury toppings from fresh fruits to nuts",
    category: "toppings",
  },
  {
    id: "8",
    type: "photo",
    src: brandedCupsImage,
    title: "Signature Branded Collection",
    description: "Official Essence Yogurt branded cups",
    category: "flavors",
  },
  {
    id: "9",
    type: "photo",
    src: productShowcaseImage,
    title: "Premium Soft-Serve Artistry",
    description: "Handcrafted luxury frozen yogurt creations",
    category: "flavors",
  },
  {
    id: "10",
    type: "photo",
    src: heroProductImage,
    title: "Tropical Mango Swirl",
    description: "Our signature mango frozen yogurt",
    category: "flavors",
  },
  {
    id: "11",
    type: "photo",
    src: "/attached_assets/stock_images/luxury_soft_serve_fr_68d10b64.jpg",
    title: "Luxury Store Experience",
    description: "Premium self-serve stations",
    category: "stores",
  },
  {
    id: "12",
    type: "photo",
    src: "/attached_assets/stock_images/modern_frozen_yogurt_25f08707.jpg",
    title: "Modern Store Design",
    description: "Luxury white and gold interiors",
    category: "stores",
  },
];

const videoItems: GalleryItem[] = [
  {
    id: "v1",
    type: "video",
    src: "https://youtube.com/watch?v=example1",
    thumbnail: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
    title: "The Essence Experience",
    description: "Discover our luxury soft-serve journey",
    category: "events",
  },
  {
    id: "v2",
    type: "video",
    src: "https://youtube.com/watch?v=example2",
    thumbnail: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800",
    title: "Making of Signature Vanilla",
    description: "Behind the scenes at our artisan kitchen",
    category: "behind",
  },
  {
    id: "v3",
    type: "video",
    src: "https://youtube.com/watch?v=example3",
    thumbnail: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800",
    title: "Dubai Mall Grand Opening",
    description: "Our flagship launch celebration",
    category: "events",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (window.location.hash === "#videos") {
      setActiveTab("videos");
    }
  }, []);

  const filteredPhotos = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);
    
  const filteredVideos = activeCategory === "all"
    ? videoItems
    : videoItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <main className="pt-8 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
              Visual Stories
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Gallery & Media
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore the world of Essence Yogurt through our curated collection of photos and videos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-full">
              <button
                onClick={() => setActiveTab("photos")}
                data-testid="tab-photos"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "photos"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <Image size={16} />
                Photos
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                data-testid="tab-videos"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "videos"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <Video size={16} />
                Videos
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {galleryCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  data-testid={`filter-${category.id}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${
                    activeCategory === category.id
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "photos" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="photos-grid">
              {filteredPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  data-testid={`photo-${item.id}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      {item.description && (
                        <p className="text-white/70 text-xs mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="videos-grid">
              {filteredVideos.map((item) => (
                <div
                  key={item.id}
                  data-testid={`video-${item.id}`}
                  className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-neutral-100"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={28} className="text-neutral-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="text-white/70 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Follow Our Journey
              </h2>
              <p className="text-neutral-600">
                Connect with us on social media for daily inspiration
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://open.spotify.com/user/essenceyogurt"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-spotify"
                className="flex items-center gap-3 px-6 py-3 bg-[#1DB954] text-white rounded-full font-semibold hover:bg-[#1ed760] transition-colors"
              >
                <Music size={20} />
                Spotify Playlist
                <ExternalLink size={16} />
              </a>
              <a
                href="https://youtube.com/@essenceyogurt"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-youtube"
                className="flex items-center gap-3 px-6 py-3 bg-[#FF0000] text-white rounded-full font-semibold hover:bg-[#cc0000] transition-colors"
              >
                <Play size={20} fill="currentColor" />
                YouTube Channel
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </main>

      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
          data-testid="lightbox-overlay"
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            data-testid="btn-close-lightbox"
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedItem.src}
              alt={selectedItem.title}
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <h3 className="text-white font-bold text-xl">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-white/70 mt-1">{selectedItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
