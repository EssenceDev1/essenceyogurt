import React, { useState, useRef, useEffect, useId } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

const SoftServeIcon = ({ id }: { id?: string }) => (
  <svg viewBox="0 0 40 40" className="h-9 w-9" aria-label="Essence Yogurt" role="img">
    <defs>
      <linearGradient id={`goldGradient-${id || 'default'}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7E3A3" />
        <stop offset="50%" stopColor="#D6A743" />
        <stop offset="100%" stopColor="#B8862D" />
      </linearGradient>
      <linearGradient id={`creamGradient-${id || 'default'}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDFCFA" />
        <stop offset="100%" stopColor="#F5F0E8" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="19" fill={`url(#goldGradient-${id || 'default'})`} />
    <path d="M20 6 C16 6 13 8 12 11 C11 14 12 17 13 19 L14 21 C14.5 22 15 23 16 24 L17 26 L18 28 L19 31 L20 34 L21 31 L22 28 L23 26 L24 24 C25 23 25.5 22 26 21 L27 19 C28 17 29 14 28 11 C27 8 24 6 20 6 Z" fill={`url(#creamGradient-${id || 'default'})`} stroke="#D6A743" strokeWidth="0.5" />
    <ellipse cx="20" cy="9" rx="5" ry="2.5" fill="#FDFCFA" opacity="0.8" />
    <path d="M16 13 Q17 15 20 15 Q23 15 24 13" stroke="#E8DCC8" strokeWidth="0.8" fill="none" />
    <path d="M15 17 Q17 19 20 19 Q23 19 25 17" stroke="#E8DCC8" strokeWidth="0.8" fill="none" />
    <path d="M16 21 Q18 23 20 23 Q22 23 24 21" stroke="#E8DCC8" strokeWidth="0.8" fill="none" />
  </svg>
);

const NavDropdown = ({ label, items, testId }: { label: string; items: { name: string; href: string; description?: string }[]; testId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1 text-sm font-medium text-[#4b5563] hover:text-black transition-colors py-2"
        data-testid={testId}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          id={menuId}
          role="menu"
          className="absolute left-0 top-full pt-2 z-50"
        >
          <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-[#e5e7eb] min-w-[220px] py-2 overflow-hidden">
            {items.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                role="menuitem"
                tabIndex={0}
                className="block px-4 py-2.5 hover:bg-[#faf9f7] focus:bg-[#faf9f7] focus:outline-none transition-colors group"
                data-testid={`dropdown-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="block text-sm font-medium text-[#111827] group-hover:text-[#D6A743] group-focus:text-[#D6A743]">{item.name}</span>
                {item.description && (
                  <span className="block text-xs text-[#9ca3af] mt-0.5">{item.description}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EssenceLuxuryLanding2025: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  const menuItems = {
    products: [
      { name: "Our Flavours", href: "/flavours", description: "46 signature soft serve creations" },
      { name: "Toppings & Add-ons", href: "/flavours#toppings", description: "Premium fruits & sauces" },
      { name: "Nutrition Info", href: "/nutrition", description: "Allergens & dietary info" },
    ],
    experience: [
      { name: "VIP Loyalty Club", href: "/loyalty", description: "Exclusive rewards & perks" },
      { name: "Our Locations", href: "/locations", description: "Find your nearest store" },
      { name: "Events & Catering", href: "/events", description: "Private events & carts" },
    ],
    about: [
      { name: "Our Story", href: "/about", description: "The Essence journey" },
      { name: "Franchise & Partners", href: "/franchise", description: "Join the global network" },
      { name: "Careers", href: "/careers", description: "Work with us" },
      { name: "FAQ", href: "/faq", description: "Common questions" },
    ],
  };

  return (
    <div className="bg-white text-[#111827] min-h-screen">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827] text-white text-center py-2 px-4">
        <p className="text-xs sm:text-sm font-medium tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D6A743] animate-pulse" />
            Join VIP Club for 100 free points
            <Link href="/loyalty" className="underline underline-offset-2 hover:text-[#F7E3A3] transition-colors ml-1">
              Sign up now
            </Link>
          </span>
        </p>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] backdrop-blur-lg bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:py-4">
          {/* Logo with distinctive soft serve icon */}
          <Link href="/" className="flex items-center gap-3" data-testid="link-home">
            <SoftServeIcon id="header" />
            <div className="leading-tight hidden sm:block">
              <div className="text-lg font-bold tracking-wide" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                <span className="bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] bg-clip-text text-transparent">Essence</span><sup className="text-[#d4af37] text-[8px]">™</sup>
              </div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-[#9ca3af]">
                Luxury Yogurt
              </div>
            </div>
          </Link>

          {/* Desktop nav with dropdowns - visible from md breakpoint */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6" data-testid="nav-desktop">
            <NavDropdown label="Products" items={menuItems.products} testId="nav-products" />
            <NavDropdown label="Experience" items={menuItems.experience} testId="nav-experience" />
            <NavDropdown label="About" items={menuItems.about} testId="nav-about" />
            <Link href="/locations" className="text-sm font-medium text-[#4b5563] hover:text-black transition-colors" data-testid="nav-locations">
              Locations
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/essence-app" 
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-medium text-[#4b5563] hover:border-[#d1d5db] hover:bg-[#f9fafb] transition-colors"
              data-testid="button-member-login"
            >
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              Login
            </Link>
            <Link 
              href="/franchise" 
              className="hidden md:inline-flex rounded-full bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-black shadow-[0_8px_20px_rgba(214,167,67,0.4)] hover:shadow-[0_12px_30px_rgba(214,167,67,0.55)] hover:brightness-105 transition-all"
              data-testid="button-franchise"
            >
              Partner With Us
            </Link>

            {/* Hamburger for mobile only */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white shadow-sm md:hidden"
              data-testid="button-mobile-menu"
            >
              <div className="flex flex-col gap-[5px]">
                <span className={`block h-[2px] w-5 rounded-full bg-[#111827] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-[2px] w-4 rounded-full bg-[#111827] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[2px] w-5 rounded-full bg-[#111827] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e5e7eb] bg-white" data-testid="nav-mobile">
            <nav className="divide-y divide-[#f3f4f6]">
              {/* Products Section */}
              <div>
                <button 
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'products' ? null : 'products')}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#111827]"
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'products' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'products' && (
                  <div className="bg-[#faf9f7] px-4 pb-3">
                    {menuItems.products.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm text-[#4b5563] hover:text-[#D6A743]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Experience Section */}
              <div>
                <button 
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'experience' ? null : 'experience')}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#111827]"
                >
                  Experience
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'experience' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'experience' && (
                  <div className="bg-[#faf9f7] px-4 pb-3">
                    {menuItems.experience.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm text-[#4b5563] hover:text-[#D6A743]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* About Section */}
              <div>
                <button 
                  onClick={() => setMobileSubmenu(mobileSubmenu === 'about' ? null : 'about')}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#111827]"
                >
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'about' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubmenu === 'about' && (
                  <div className="bg-[#faf9f7] px-4 pb-3">
                    {menuItems.about.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm text-[#4b5563] hover:text-[#D6A743]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick Links */}
              <div className="px-4 py-4 space-y-3">
                <Link 
                  href="/locations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-[#111827] hover:text-[#D6A743]"
                >
                  Find a Store
                </Link>
                <Link 
                  href="/essence-app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-full border border-[#e5e7eb] text-sm font-medium text-[#4b5563] hover:bg-[#f9fafb]"
                >
                  Member Login
                </Link>
                <Link 
                  href="/franchise"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] text-sm font-semibold text-black shadow-lg"
                >
                  Partner With Us
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero - mobile first */}
        <section className="relative overflow-hidden" data-testid="section-hero">
          <div className="absolute inset-x-0 -top-40 -z-10 flex justify-center opacity-80">
            <div className="h-72 w-[36rem] rounded-full bg-gradient-to-br from-white via-[#f3f4f6] to-[#e5e7eb] blur-3xl" />
          </div>

          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-10 md:flex-row md:pb-24 md:pt-16">
            {/* Left copy */}
            <div className="max-w-xl space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b7280] shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" />
                Pure Soft Serve - Gold Standard
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl" data-testid="text-hero-title">
                The VIP soft serve universe for
                <span className="bg-gradient-to-r from-[#D6A743] via-[#F3D27A] to-[#B8862D] bg-clip-text text-transparent">
                  {" "}airports, malls, and 7 star events.
                </span>
              </h1>

              <p className="text-sm leading-relaxed text-[#4b5563] sm:text-base" data-testid="text-hero-description">
                Essence Yogurt is a luxury self-serve experience built for
                Saudi Arabia, Dubai, and Europe. Pure white stations, real gold
                accents, fresh fruit, and intelligent logistics - ready for
                high volume passengers and high budget events.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Link 
                  href="/events"
                  className="rounded-full bg-gradient-to-r from-[#D6A743] via-[#F7E3A3] to-[#B8862D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_18px_40px_rgba(214,167,67,0.7)] hover:brightness-105 text-center transition-all"
                  data-testid="button-book-cart"
                >
                  Book an Essence Cart
                </Link>
                <Link 
                  href="/essence-app"
                  className="group flex items-center justify-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#111827] hover:bg-[#f9fafb] transition-colors"
                  data-testid="button-view-loyalty"
                >
                  View VIP Loyalty
                  <span className="mt-[2px] text-[10px] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#6b7280] md:justify-start">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-[#F7E3A3]">
                    ★
                  </span>
                  7 star visual standard
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f3f4f6] text-[10px] text-[#111827]">
                    ●
                  </span>
                  Airport & mall ready
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d1fae5] text-[10px] text-[#047857]">
                    ✓
                  </span>
                  Halal friendly mix - organic concept
                </div>
              </div>
            </div>

            {/* Right visual - hero card stack */}
            <div className="relative flex w-full max-w-md items-center justify-center">
              {/* Outer frame */}
              <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#f9fafb] via-white to-[#e5e7eb] p-[2px] shadow-[0_25px_60px_rgba(0,0,0,0.22)]">
                <div className="rounded-3xl bg-white px-5 pb-6 pt-5">
                  {/* Mini top info */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9ca3af]">
                      Essence Station
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      Live - Dubai Intl
                    </div>
                  </div>

                  {/* Visual placeholder - elegant gradient */}
                  <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#030712]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-[#F3D27A]/25" />
                    <div className="h-56 w-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-inner">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-b from-[#F7E3A3] via-[#F3D27A] to-[#C1862C] shadow-lg" />
                        </div>
                        <p className="mt-4 text-xs text-white/60 uppercase tracking-[0.3em]">Essence Cart</p>
                        <p className="mt-1 text-sm font-semibold text-white">Premium Self-Serve</p>
                      </div>
                    </div>
                  </div>

                  {/* KPI strip */}
                  <div className="grid grid-cols-3 gap-3 text-center text-[11px]" data-testid="kpi-strip">
                    <div className="rounded-2xl bg-[#f9fafb] px-2 py-2.5">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#9ca3af]">
                        Average ticket
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]" data-testid="kpi-avg-ticket">
                        58 SAR
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#f9fafb] px-2 py-2.5">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#9ca3af]">
                        Peak hour
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]" data-testid="kpi-peak-hour">
                        220 cups
                      </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-[#D6A743] via-[#F7E3A3] to-[#B8862D] px-2 py-2.5 text-black">
                      <div className="text-[10px] uppercase tracking-[0.2em]">
                        VIP spend
                      </div>
                      <div className="mt-1 text-sm font-semibold" data-testid="kpi-vip-spend">
                        +34%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating VIP chip */}
              <div className="absolute -bottom-4 right-2 hidden rounded-2xl bg-black px-4 py-2 text-[11px] text-[#f9fafb] shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:flex sm:flex-col" data-testid="chip-vip">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                  Essence VIP
                </span>
                <span className="text-xs font-semibold">
                  Scan to earn Dubai miles with every swirl.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Concept section */}
        <section id="concept" className="border-t border-[#f3f4f6] bg-[#f9fafb]" data-testid="section-concept">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl" data-testid="text-concept-title">
                  Luxury self serve for people who are done with basic frozen yogurt.
                </h2>
                <p className="text-sm leading-relaxed text-[#4b5563] md:text-base">
                  Essence Yogurt brings the feel of a luxury hotel lobby into a
                  fast moving soft serve concept. Pure white architecture,
                  real gold details, curated toppings, and a frictionless
                  digital experience that delights both everyday guests and VIPs.
                </p>
                <ul className="grid gap-3 text-sm text-[#374151] md:grid-cols-2">
                  <li className="flex gap-2">
                    <span className="mt-[4px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[9px] text-[#F7E3A3] shrink-0">
                      ✓
                    </span>
                    <span>Pay by weight with ultra precise digital scale.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[4px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[9px] text-[#F7E3A3] shrink-0">
                      ✓
                    </span>
                    <span>Live AI monitoring for stock, freshness, and sales performance.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[4px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[9px] text-[#F7E3A3] shrink-0">
                      ✓
                    </span>
                    <span>Built in Gemini concierge for product questions in Arabic, English, and European languages.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[4px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#111827] text-[9px] text-[#F7E3A3] shrink-0">
                      ✓
                    </span>
                    <span>Designed for airports, malls, beach clubs, hotels, and stadiums.</span>
                  </li>
                </ul>
              </div>

              {/* Compact card for investors / landlords */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#111827] via-[#030712] to-[#111827] p-[2px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <div className="rounded-3xl bg-[#030712] px-5 py-6 text-[#e5e7eb]" data-testid="card-logistics">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                      Essence logistics
                    </div>
                    <div className="rounded-full bg-[#111827] px-3 py-1 text-[10px] font-medium text-[#F7E3A3]">
                      19+ countries experience
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#e5e7eb]">
                    The group behind Essence has built media networks,
                    technology platforms, and retail brands across the Middle
                    East, Europe, Israel, and Australia. That means serious
                    supply chain, compliance, and finance discipline behind the
                    beautiful design.
                  </p>
                  <div className="mt-5 grid gap-3 text-[11px] text-[#d1d5db]">
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                      <span>Airport & mall negotiations</span>
                      <span className="text-[#F7E3A3]">Handled</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                      <span>Halal, food safety & permits</span>
                      <span className="text-[#F7E3A3]">Central playbook</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                      <span>Saudi, UAE, Israel, EU compliance</span>
                      <span className="text-[#F7E3A3]">Built in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flavors 2026 section */}
        <section id="flavors" className="border-t border-[#f3f4f6]" data-testid="section-flavors">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl" data-testid="text-flavors-title">
                  Essence 2026 flavor universe.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-[#4b5563] md:text-base">
                  A curated mix of global classics, Dubai inspired chocolate,
                  and native Australian notes. Each flavor has an internal code
                  for your operations team and a marketing name for guests.
                </p>
              </div>
              <Link 
                href="/flavors"
                className="self-start rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111827] hover:bg-[#f9fafb] transition-colors"
                data-testid="button-view-flavors"
              >
                View full 2026 collection
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {/* Dubai chocolate feature */}
              <div className="relative overflow-hidden rounded-3xl bg-[#030712] text-[#f9fafb] shadow-[0_20px_50px_rgba(0,0,0,0.55)]" data-testid="card-flavor-dubai">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F3D27A]/5 via-transparent to-black/60" />
                <div className="relative p-5">
                  <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#e5e7eb]" data-testid="badge-dubai-signature">
                    Dubai Signature
                  </div>
                  <h3 className="mt-4 text-lg font-semibold" data-testid="text-flavor-dubai-title">Desert Gold</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#e5e7eb]/90" data-testid="text-flavor-dubai-desc">
                    Deep single origin chocolate infused with cardamom warmth
                    and a clean finish. Designed for the Middle East guest who
                    expects serious cocoa, not candy.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-[#e5e7eb]/80">
                    <span data-testid="text-flavor-dubai-code">Code: FLV_DXB_GOLD</span>
                    <span data-testid="text-flavor-dubai-pair">Pairs with: roasted pistachio</span>
                  </div>
                </div>
              </div>

              {/* Halo Cloud */}
              <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.08)]" data-testid="card-flavor-vanilla">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]" data-testid="badge-core-collection">
                  Core collection
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#111827]" data-testid="text-flavor-vanilla-title">
                  Halo Cloud
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#4b5563]" data-testid="text-flavor-vanilla-desc">
                  A clean, high vanilla profile that acts like a white canvas
                  for fruit, nuts, and chocolate. Smooth enough for kids,
                  premium enough for business class.
                </p>
                <div className="mt-3 text-[11px] text-[#6b7280]" data-testid="text-flavor-vanilla-code">
                  Code: FLV_CORE_VAN
                </div>
              </div>

              {/* Desert Glow */}
              <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.08)]" data-testid="card-flavor-australia">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]" data-testid="badge-native-australia">
                  Native Australia
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#111827]" data-testid="text-flavor-australia-title">
                  Desert Glow
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#4b5563]" data-testid="text-flavor-australia-desc">
                  Quandong inspired tart stone fruit notes, bringing an
                  Australian voice into your Middle East and European stations.
                </p>
                <div className="mt-3 text-[11px] text-[#6b7280]" data-testid="text-flavor-australia-code">
                  Code: FLV_AUS_QUA
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIP loyalty + personal dashboard */}
        <section id="loyalty" className="border-t border-[#f3f4f6] bg-[#f9fafb]" data-testid="section-loyalty">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1.05fr_1fr] md:items-center">
              {/* Dashboard visualization */}
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-[#F7E3A3]/60 via-transparent to-[#B8862D]/40 blur-xl" />
                <div className="rounded-[28px] bg-[#030712] p-[2px] shadow-[0_26px_60px_rgba(0,0,0,0.65)]">
                  <div className="rounded-[26px] bg-gradient-to-b from-[#111827] via-[#020617] to-black px-5 py-6 text-[#e5e7eb]" data-testid="card-vip-dashboard">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                          Essence VIP Lounge
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                          Welcome back, Gold Member
                        </div>
                      </div>
                      {/* Simple QR placeholder */}
                      <div className="rounded-2xl bg-white p-2 text-[9px] text-[#111827] shadow-[0_10px_20px_rgba(0,0,0,0.55)]">
                        <div className="grid h-12 w-12 grid-cols-3 gap-[2px]">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-full w-full ${
                                i % 2 === 0 ? "bg-[#111827]" : "bg-white"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mt-1 text-center text-[8px] uppercase tracking-[0.22em]">
                          Scan at cashier
                        </div>
                      </div>
                    </div>

                    {/* Points strip */}
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-white/5 px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                          Essence points
                        </div>
                        <div className="mt-1 text-xl font-semibold text-[#F7E3A3]" data-testid="text-points">
                          18,420
                        </div>
                        <div className="mt-1 text-[11px] text-[#d1d5db]">
                          1 SAR = 1 point at all stations.
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white/5 px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                          Tier progress
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px]">
                          <span>Gold to Black</span>
                          <span>72%</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-[#111827]">
                          <div className="h-1.5 w-[72%] rounded-full bg-gradient-to-r from-[#F7E3A3] via-[#F3D27A] to-[#B8862D]" />
                        </div>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-[#F7E3A3] via-[#F3D27A] to-[#B8862D] px-3 py-3 text-[#111827]">
                        <div className="text-[10px] uppercase tracking-[0.22em]">
                          Tonight
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                          Open late at Dubai Intl.
                        </div>
                        <div className="mt-1 text-[11px] opacity-80">
                          Serving until midnight.
                        </div>
                      </div>
                    </div>

                    {/* Personal inbox preview */}
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-[11px] text-[#e5e7eb]">
                      <div className="flex items-center justify-between">
                        <span className="uppercase tracking-[0.22em] text-[#9ca3af]">
                          Personal inbox
                        </span>
                        <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px]">
                          2 new
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span>Cart booking confirmed for Riyadh Expo.</span>
                          <span className="text-[10px] text-[#9ca3af]">
                            4 min
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>New flavor preview: Desert Gold tasting.</span>
                          <span className="text-[10px] text-[#9ca3af]">
                            Today
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl" data-testid="text-loyalty-title">
                  VIP loyalty that feels like a private club, not a stamp card.
                </h2>
                <p className="text-sm leading-relaxed text-[#4b5563] md:text-base">
                  Guests scan their QR in the app, the scale reads their cup,
                  Checkout.com handles the payment, and the system does the
                  rest. Points, tiers, offers, and invoices are kept perfectly
                  in sync across Saudi Arabia, Dubai, Israel, and Europe.
                </p>
                <ul className="space-y-2 text-sm text-[#374151]">
                  <li>
                    • One tap login with Gmail, Apple, mobile number, or FaceID.
                  </li>
                  <li>
                    • Personal inbox for every VIP where Gemini can answer
                    questions about ingredients, calories, or events.
                  </li>
                  <li>
                    • Members control push notifications and privacy with a
                    privacy center that respects 2025 laws in each market.
                  </li>
                </ul>
                <Link 
                  href="/essence-app"
                  className="inline-flex rounded-full bg-gradient-to-r from-[#D6A743] via-[#F7E3A3] to-[#B8862D] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_18px_40px_rgba(214,167,67,0.7)] hover:brightness-105 transition-all"
                  data-testid="button-join-vip"
                >
                  Join VIP Program
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Events and carts */}
        <section id="events" className="border-t border-[#f3f4f6]" data-testid="section-events">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl" data-testid="text-events-title">
                  Essence carts for days when the budget is big and the crowd expects a show.
                </h2>
                <p className="text-sm leading-relaxed text-[#4b5563] md:text-base">
                  Corporate launches, luxury malls, football nights, Ramadan
                  evenings, beach clubs, weddings, or government events - we
                  roll in with a full Essence cart, staff, logistics, and
                  reporting. You just pick the date and the guest list.
                </p>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm" data-testid="card-corporate-government">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                      Corporate & government
                    </div>
                    <div className="mt-1 font-semibold" data-testid="text-corporate-title">
                      Boardrooms to ministries.
                    </div>
                    <div className="mt-1 text-xs text-[#6b7280]" data-testid="text-corporate-desc">
                      Invoices, compliance, security, and logistics handled by
                      our central operations team.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm" data-testid="card-vip-unlimited">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                      High spend guests
                    </div>
                    <div className="mt-1 font-semibold" data-testid="text-vip-title">
                      VIP treat - unlimited model.
                    </div>
                    <div className="mt-1 text-xs text-[#6b7280]" data-testid="text-vip-desc">
                      We can run unlimited self-serve for a fixed fee so
                      organizers know the exact cost per hour.
                    </div>
                  </div>
                </div>
                <Link 
                  href="/contact"
                  className="inline-flex rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#F7E3A3] shadow-[0_16px_40px_rgba(15,23,42,0.65)] hover:brightness-110 transition-all"
                  data-testid="button-request-proposal"
                >
                  Request event proposal
                </Link>
              </div>

              {/* Event booking summary card */}
              <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.09)]" data-testid="card-event-booking">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                  Example booking - Dubai
                </div>
                <div className="mt-2 text-sm font-semibold text-[#111827]">
                  Essence cart for 600 guests - corporate launch
                </div>
                <dl className="mt-4 space-y-2 text-[11px] text-[#4b5563]">
                  <div className="flex justify-between">
                    <dt>Date</dt>
                    <dd>24 October 2025</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Location</dt>
                    <dd>Dubai Marina - private venue</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Service</dt>
                    <dd>3 hour unlimited self serve</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Package</dt>
                    <dd>Premium fruit, nuts, chocolate</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Reporting</dt>
                    <dd>Full digital report to finance team</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Global expansion band */}
        <section
          id="global"
          className="border-t border-[#f3f4f6] bg-gradient-to-r from-[#111827] via-[#030712] to-[#111827]"
          data-testid="section-global"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-[#e5e7eb] md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#9ca3af]">
                Now expanding
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl" data-testid="text-global-title">
                Essence Yogurt - built in Australia, designed for Saudi Arabia, Dubai, Israel, and Europe.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#d1d5db] md:text-base">
                The Essence platform is engineered like a technology company,
                not a small dessert kiosk. Multi country tax logic, AI
                bookkeeping, food safety workflows, HR automations, and
                dashboards for landlords and investors.
              </p>
            </div>
            <div className="grid gap-3 text-[11px] md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 px-4 py-3" data-testid="card-phase-1">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                  Phase 1
                </div>
                <div className="mt-1 font-semibold text-white">Saudi Arabia & Dubai</div>
                <div className="mt-1 text-[#d1d5db]">
                  Airport terminals, malls, and selected events.
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-3" data-testid="card-phase-2">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9ca3af]">
                  Phase 2
                </div>
                <div className="mt-1 font-semibold text-white">Israel & Greece</div>
                <div className="mt-1 text-[#d1d5db]">
                  City centers, tourist areas, and select resorts.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#e5e7eb] bg-white" data-testid="footer">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-[11px] text-[#6b7280] md:flex-row md:items-center md:justify-between">
            <div data-testid="text-copyright">
              © {new Date().getFullYear()} Essence Yogurt. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-3">
              <span data-testid="text-ai-powered">AI powered operations by Octopus style backend stack.</span>
              <span className="hidden md:inline">|</span>
              <span data-testid="text-regions">Saudi - UAE - Israel - EU ready.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default EssenceLuxuryLanding2025;
