"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Globe, Building2, Users, Gift, MapPin, Sparkles, Heart, Briefcase, Newspaper, Mail, Shield, FileText, Cookie, Accessibility, LogIn, LogOut, User, HelpCircle, Image, Video, Music, Play } from "lucide-react";
import { LanguageSelector, useLanguage } from "@/lib/i18n/LanguageContext";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import logoLight from "@/assets/brand/logo-light.jpeg";
import logoColorful from "@/assets/brand/logo-colorful.jpeg";

const TikTokIcon = ({ className = "w-8 h-8 sm:w-6 sm:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#000000"/>
    <path d="M17.2 10.1V8.2C16.2 8.2 15.3 7.8 14.6 7.1C14 6.3 13.6 5.3 13.6 4.3H11.7V14.8C11.7 16.1 10.6 17.2 9.3 17.2C8 17.2 6.9 16.1 6.9 14.8C6.9 13.5 8 12.4 9.3 12.4C9.5 12.4 9.7 12.4 9.9 12.5V10.5C9.7 10.5 9.5 10.5 9.3 10.5C6.9 10.5 5 12.4 5 14.8C5 17.2 6.9 19.1 9.3 19.1C11.7 19.1 13.6 17.2 13.6 14.8V9.4C14.5 10.1 15.6 10.5 16.8 10.5C16.9 10.5 17.1 10.4 17.2 10.1Z" fill="#25F4EE"/>
    <path d="M16.5 9.8V8C15.5 8 14.6 7.6 13.9 6.9C13.3 6.1 12.9 5.1 12.9 4.1H11V14.6C11 15.9 9.9 17 8.6 17C7.3 17 6.2 15.9 6.2 14.6C6.2 13.3 7.3 12.2 8.6 12.2C8.8 12.2 9 12.2 9.2 12.3V10.3C9 10.3 8.8 10.3 8.6 10.3C6.2 10.3 4.3 12.2 4.3 14.6C4.3 17 6.2 18.9 8.6 18.9C11 18.9 12.9 17 12.9 14.6V9.2C13.8 9.9 14.9 10.3 16.1 10.3C16.2 10.3 16.4 10.2 16.5 9.8Z" fill="#FE2C55"/>
  </svg>
);

const InstagramIcon = ({ className = "w-8 h-8 sm:w-6 sm:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="ig-grad-nav" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FEDA75"/>
        <stop offset="25%" stopColor="#FA7E1E"/>
        <stop offset="50%" stopColor="#D62976"/>
        <stop offset="75%" stopColor="#962FBF"/>
        <stop offset="100%" stopColor="#4F5BD5"/>
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-grad-nav)"/>
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.5" fill="none"/>
    <circle cx="17" cy="7" r="1.2" fill="white"/>
  </svg>
);

const FacebookIcon = ({ className = "w-8 h-8 sm:w-6 sm:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#1877F2"/>
    <path d="M16.5 15L17 12H14V10C14 9.17 14.33 8.5 15.5 8.5H17V5.8C16.45 5.7 15.7 5.5 14.5 5.5C12.14 5.5 10.5 7 10.5 9.5V12H8V15H10.5V22.8C11 22.9 11.5 23 12 23C12.5 23 13 22.9 13.5 22.8V15H16.5Z" fill="white"/>
  </svg>
);

const SpotifyIcon = ({ className = "w-8 h-8 sm:w-6 sm:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="12" fill="#1DB954"/>
    <path d="M17.1 15.2C17 15.4 16.7 15.5 16.5 15.4C14.1 13.9 11.1 13.6 7.3 14.4C7 14.5 6.8 14.3 6.7 14.1C6.6 13.8 6.8 13.6 7 13.5C11.1 12.7 14.4 13 17.1 14.7C17.3 14.8 17.3 15.1 17.1 15.2ZM18.2 12.7C18 13 17.6 13.1 17.3 12.9C14.5 11.2 10.3 10.7 7.1 11.6C6.8 11.7 6.4 11.5 6.3 11.2C6.2 10.9 6.4 10.5 6.7 10.4C10.3 9.4 14.9 9.9 18.1 11.9C18.4 12.1 18.5 12.5 18.2 12.7Z" fill="white"/>
  </svg>
);

const YouTubeIcon = ({ className = "w-8 h-8 sm:w-6 sm:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#FF0000"/>
    <path d="M10 14.8V9.2L15 12L10 14.8Z" fill="white"/>
  </svg>
);

const XTwitterIcon = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect width="24" height="24" rx="6" fill="#000000"/>
    <path d="M13.9 10.5L18.5 5H17.2L13.3 9.6L10.2 5H6L10.8 12.7L6 18.5H7.3L11.4 13.6L14.7 18.5H18.9L13.9 10.5ZM12.1 12.8L11.5 12L7.9 5.9H9.7L12.6 10.1L13.2 10.9L17.2 17.6H15.4L12.1 12.8Z" fill="white"/>
  </svg>
);

const socialLinks = [
  { icon: InstagramIcon, href: "https://instagram.com/essenceyogurt", label: "Instagram", color: "#E1306C" },
  { icon: TikTokIcon, href: "https://tiktok.com/@essenceyogurt", label: "TikTok", color: "#000000" },
  { icon: FacebookIcon, href: "https://facebook.com/essenceyogurt", label: "Facebook", color: "#0866FF" },
  { icon: SpotifyIcon, href: "https://open.spotify.com/user/31qbhlig7pc5qnick47br7nfzrg4", label: "Spotify", color: "#1ED760" },
  { icon: YouTubeIcon, href: "https://youtube.com/@essenceyogurt", label: "YouTube", color: "#FF0000" },
];

const mainLinks = [
  { href: "/story", labelKey: "about" },
  { href: "/flavours", labelKey: "flavors" },
  { href: "/locations", labelKey: "locations" },
  { href: "/loyalty", labelKey: "loyalty" },
  { href: "/egift", labelKey: "egift" },
  { href: "/contact", labelKey: "contact" },
];

const mobileMenuSections = [
  {
    title: "Order & Locations",
    links: [
      { href: "/order", label: "Order Online", icon: Gift, featured: true },
      { href: "/flavours", label: "Our Flavours", icon: Sparkles },
      { href: "/locations", label: "Find a Location", icon: MapPin },
      { href: "/egift", label: "E-Gift Cards", icon: Gift },
      { href: "/events", label: "Events & Carts", icon: Sparkles },
    ]
  },
  {
    title: "Global Franchise",
    links: [
      { href: "/franchise", label: "Become a Partner", icon: Globe, featured: true },
      { href: "/franchise#opportunities", label: "Franchise Opportunities", icon: Building2 },
      { href: "/franchise#investment", label: "Investment Info", icon: Briefcase },
    ]
  },
  {
    title: "Gallery & Media",
    links: [
      { href: "/gallery", label: "Photo Gallery", icon: Image },
      { href: "/gallery#videos", label: "Video Gallery", icon: Video },
      { href: "https://open.spotify.com/playlist/5P0OxrWj2ME2YkdE5905pL", label: "Spotify Playlist", icon: Music, external: true },
      { href: "https://youtube.com/@essenceyogurt", label: "YouTube Channel", icon: Play, external: true },
    ]
  },
  {
    title: "About Essence",
    links: [
      { href: "/story", label: "About Us", icon: Building2 },
      { href: "/sustainability", label: "Sustainability", icon: Heart },
      { href: "/investors", label: "Investors", icon: Briefcase },
      { href: "/press", label: "Press & Media", icon: Newspaper },
    ]
  },
  {
    title: "Loyalty & Rewards",
    links: [
      { href: "/loyalty", label: "Essence Circle", icon: Sparkles },
      { href: "/essence-app", label: "My Essence App", icon: Users },
    ]
  },
  {
    title: "Help & Support",
    links: [
      { href: "/faq", label: "FAQ", icon: HelpCircle },
      { href: "/contact", label: "Contact Us", icon: Mail },
      { href: "/careers", label: "Careers", icon: Users },
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy", icon: Shield },
      { href: "/terms", label: "Terms of Service", icon: FileText },
      { href: "/cookies", label: "Cookie Policy", icon: Cookie },
      { href: "/accessibility", label: "Accessibility", icon: Accessibility },
    ]
  }
];

const regions = [
  { code: "ME", label: "Middle East", currency: "AED" },
  { code: "EU", label: "Europe", currency: "EUR" },
  { code: "AP", label: "Asia Pacific", currency: "SGD" },
  { code: "US", label: "Americas", currency: "USD" },
];

export default function MainNav() {
  const [pathname] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRegion] = useState(regions[0]);
  const { user, isAuthenticated, isLoading } = useFirebaseAuth();
  const { t, direction } = useLanguage();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const getLabel = (labelKey: string) => {
    const translations: Record<string, string> = {
      about: t("about") || "About",
      flavors: t("flavors") || "Flavours",
      locations: t("locations") || "Locations",
      loyalty: t("loyalty") || "Circle",
      egift: t("egift") || "E-Gift",
      contact: t("contact") || "Contact",
    };
    return translations[labelKey] || labelKey;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        
        .lux-nav-link {
          font-family: "Playfair Display", "Times New Roman", serif;
          position: relative;
          padding-bottom: 4px;
        }
        .lux-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background-image: linear-gradient(to right, #7a5c29, #eedc82, #b88a44, #7a5c29);
          transition: width 0.25s ease;
        }
        .lux-nav-link:hover::after {
          width: 100%;
        }
        .lux-nav-link:hover {
          color: #b48b3b;
        }
        .lux-nav-link.active::after {
          width: 100%;
        }
        .lux-nav-link.active {
          color: #b48b3b;
        }
        .lux-cta {
          font-family: "Playfair Display", "Times New Roman", serif;
          position: relative;
          overflow: hidden;
        }
        .lux-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(120deg, rgba(255, 215, 0, 0), rgba(255, 215, 0, 0.22), rgba(255, 215, 0, 0));
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .lux-cta:hover::before {
          opacity: 1;
        }
        .lux-burger-inner span {
          transition: transform 0.2s ease, top 0.2s ease, opacity 0.2s ease;
        }
        .lux-burger.active .lux-burger-inner span:nth-child(1) {
          top: 6px;
          transform: rotate(45deg);
        }
        .lux-burger.active .lux-burger-inner span:nth-child(2) {
          opacity: 0;
        }
        .lux-burger.active .lux-burger-inner span:nth-child(3) {
          top: 6px;
          transform: rotate(-45deg);
        }
        .lux-mobile-panel {
          transform: translateY(-100%);
          transition: transform 0.3s ease;
        }
        .lux-mobile-panel.visible {
          transform: translateY(0);
        }
        .lux-overlay {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .lux-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .lux-gold-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-image: radial-gradient(circle at 30% 30%, #ffd700, #7a5c29);
          flex-shrink: 0;
        }
      `}</style>

      {/* Top Social Bar - Full Color Icons */}
      <div className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-[1200px] px-3 sm:px-[18px]">
          <div className="flex items-center justify-between h-11 sm:h-10 text-[10px]">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-semibold text-[#d4af37] text-[11px]">#EssenceYogurt</span>
              <span className="hidden sm:inline text-neutral-400">|</span>
              <span className="hidden sm:inline text-neutral-400">Luxury Soft Serve for the World</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  aria-label={social.label}
                  data-testid={`topbar-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-6 h-6 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav - Gucci Editorial Style */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-black/[0.04]" style={{ zIndex: 1000 }}>
        <nav className="mx-auto max-w-[1200px] px-3 sm:px-[18px] py-3 sm:py-[14px] flex items-center justify-between">
          {/* Left - Logo + Brand */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group" data-testid="nav-logo">
              <img 
                src={logoLight} 
                alt="Essence Yogurt™" 
                className="w-[42px] h-[42px] rounded-full object-cover shadow-[0_2px_6px_rgba(0,0,0,0.18)] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span 
                className="hidden sm:block text-[16px] uppercase tracking-[0.14em]"
                style={{ fontFamily: '"Playfair Display", "Times New Roman", serif' }}
              >
                <span className="bg-gradient-to-r from-[#d4af37] via-[#f4e4bc] to-[#d4af37] bg-clip-text text-transparent font-semibold">Essence</span><sup className="text-[#d4af37] text-[8px] ml-0.5">™</sup><span className="text-neutral-800 font-light ml-1">Yogurt</span>
              </span>
            </div>
          </Link>

          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center" dir={direction}>
            <ul className="flex list-none gap-6 lg:gap-8">
              {mainLinks.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`lux-nav-link text-[12px] lg:text-[14px] uppercase tracking-[0.12em] lg:tracking-[0.14em] text-[#111] ${active ? 'active' : ''}`}
                      data-testid={`nav-link-${link.labelKey}`}
                    >
                      {getLabel(link.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right - Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <LanguageSelector />
            
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-200">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a07c10] flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                  <span className="text-[11px] font-medium text-neutral-700" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Member'}
                  </span>
                </div>
                <Link
                  href="/admin-login"
                  className="lux-cta px-4 py-[7px] text-[12px] uppercase tracking-[0.16em] rounded-full border border-black/[0.14] bg-white"
                  data-testid="btn-account"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  <span className="relative z-10">My Account</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/admin-login"
                className="lux-cta flex items-center gap-1.5 px-4 py-[7px] text-[12px] uppercase tracking-[0.16em] rounded-full border border-black/[0.14] bg-white"
                data-testid="btn-login"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                <span className="relative z-10">Sign In</span>
              </Link>
            )}

            <Link
              href="/app"
              className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-[#d4af37]/30 bg-white hover:bg-[#fdfbf3] transition-all shadow-sm hover:shadow-md cursor-pointer group"
              data-testid="nav-my-essence"
            >
              <img 
                src={logoColorful} 
                alt="Essence Circle" 
                className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
              />
              <span 
                className="text-[11px] uppercase tracking-[0.14em] text-[#7a5c29] font-medium"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Join Circle
              </span>
            </Link>
          </div>

          {/* Mobile - Burger Button */}
          <button
            className={`md:hidden flex w-10 h-10 rounded-full border border-black/[0.18] bg-white items-center justify-center cursor-pointer p-0 lux-burger ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            data-testid="btn-mobile-menu"
          >
            <div className="lux-burger-inner w-[18px] h-[14px] relative">
              <span className="absolute left-0 w-full h-[2px] rounded-full bg-[#111]" style={{ top: 0 }} />
              <span className="absolute left-0 w-full h-[2px] rounded-full bg-[#111]" style={{ top: 6 }} />
              <span className="absolute left-0 w-full h-[2px] rounded-full bg-[#111]" style={{ top: 12 }} />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/[0.22] lux-overlay ${mobileOpen ? 'visible' : ''}`}
        style={{ zIndex: 900 }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Panel - Editorial Style */}
      <aside 
        className={`fixed top-0 left-0 right-0 h-full bg-white lux-mobile-panel ${mobileOpen ? 'visible' : ''}`}
        style={{ zIndex: 950, paddingTop: 80 }}
        data-testid="mobile-menu-panel"
      >
        <div className="px-4 sm:px-7 py-5 sm:py-6 flex flex-col justify-between h-[calc(100%-80px)] overflow-y-auto">
          <div>
            {/* Mobile Header */}
            <div 
              className="text-[18px] uppercase tracking-[0.18em] mb-9"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Menu
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#d4af37]/20">
              <LanguageSelector />
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#B8862D] border border-[#D6A743]/30 rounded-full bg-[#fdfbf3]">
                <Globe size={14} />
                {currentRegion.code}
              </div>
            </div>

            {/* Featured - Franchise */}
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-2xl border border-[#d4af37]/30" style={{ background: 'linear-gradient(90deg, #f6e7c8, rgba(212,175,55,0.2), #f6e7c8)' }}>
              <Link
                href="/franchise"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 sm:gap-3"
                data-testid="link-franchise-featured"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, #d4af37, #a07c10)' }}>
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#a07c10]">Featured</p>
                  <p className="text-base font-bold text-neutral-900" style={{ fontFamily: '"Playfair Display", serif' }}>Luxury Franchise</p>
                </div>
                <ChevronDown className="ml-auto w-5 h-5 text-[#d4af37] -rotate-90" />
              </Link>
            </div>

            {/* Mobile Nav Links - Editorial Style with Gold Dots */}
            <ul className="list-none space-y-0 mb-8">
              {mainLinks.map((link) => (
                <li key={link.href} className="border-b border-neutral-100 last:border-0">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-4"
                    data-testid={`mobile-link-${link.labelKey}`}
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    <span className="lux-gold-dot" />
                    <span className="text-[18px] uppercase tracking-[0.12em]">
                      {getLabel(link.labelKey)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Menu Sections */}
            <div className="space-y-6">
              {mobileMenuSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 text-neutral-400">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.links.map((link) => {
                      const Icon = link.icon;
                      const isExternal = (link as any).external || link.href.startsWith('http');
                      const isFeatured = (link as any).featured;
                      
                      const linkClassName = isFeatured
                        ? "flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#f6e7c8] to-[#d4af37]/20 border border-[#d4af37]/30 text-neutral-900 font-semibold"
                        : "flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50";
                      
                      const iconClassName = isFeatured
                        ? "w-5 h-5 text-[#d4af37]"
                        : "w-5 h-5 text-neutral-400";
                      
                      if (isExternal) {
                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileOpen(false)}
                            className={linkClassName}
                            data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <Icon className={iconClassName} />
                            <span className="text-sm">{link.label}</span>
                          </a>
                        );
                      }
                      
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={linkClassName}
                          data-testid={`link-mobile-${link.href.replace('/', '')}`}
                        >
                          <Icon className={iconClassName} />
                          <span className="text-sm">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Auth Section */}
            <div className="mt-8 pt-6 border-t border-[#D6A743]/20 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #d4af37, #a07c10)' }}>
                        <User size={18} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{user.displayName?.split(' ')[0] || 'Member'}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/admin-login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-neutral-200 text-neutral-700 text-sm font-semibold uppercase tracking-wide"
                    data-testid="mobile-btn-account"
                  >
                    <User size={16} />
                    My Account
                  </Link>
                </>
              ) : (
                <Link
                  href="/admin-login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white text-sm font-bold uppercase tracking-wide shadow-lg"
                  style={{ backgroundImage: 'linear-gradient(to right, #d4af37, #a07c10)' }}
                  data-testid="mobile-btn-login"
                >
                  <LogIn size={16} />
                  Sign In with Google
                </Link>
              )}
              
              <Link
                href="/app"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-full bg-neutral-900 text-white px-5 py-3.5 text-sm font-bold uppercase tracking-wide shadow-lg"
                data-testid="mobile-link-app"
              >
                My Essence App
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 text-[11px] text-neutral-400 leading-relaxed">
            © 2025 Essence Yogurt™. All rights reserved.
          </div>
        </div>
      </aside>
    </>
  );
}
