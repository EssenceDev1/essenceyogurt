"use client";

import { useState } from "react";
import { Link } from "wouter";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import logoDark from "@/assets/brand/logo-dark.jpeg";

const footerLinks = {
  discover: [
    { href: "/flavours", label: "Flavours" },
    { href: "/locations", label: "Locations" },
    { href: "/loyalty", label: "Essence Circle" },
    { href: "/egift", label: "E-Gift Cards" },
    { href: "/app", label: "My Essence App" },
  ],
  company: [
    { href: "/story", label: "Our Story" },
    { href: "/sustainability", label: "Sustainability" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press & Media" },
    { href: "/investors", label: "Investors" },
  ],
  partners: [
    { href: "/franchise", label: "Franchise Opportunities" },
    { href: "/airports", label: "Airport Partners" },
    { href: "/malls", label: "Mall Partners" },
    { href: "/events", label: "Private Events" },
    { href: "/contact", label: "Contact Sales" },
  ],
  legal: [
    { href: "/legal/allergy", label: "Allergy Warning" },
    { href: "/legal/food-safety", label: "Food Safety" },
    { href: "/legal/terms", label: "Terms & Conditions" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/refunds", label: "Refund Policy" },
    { href: "/legal/egift-terms", label: "E-Gift Terms" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/accessibility", label: "Accessibility" },
  ],
};

// Full-color HD 2025 social icons with official brand colors
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-6 sm:h-6">
    <defs>
      <linearGradient id="instagram-gradient-2025" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D6A743"/>
        <stop offset="50%" stopColor="#F7E3A3"/>
        <stop offset="100%" stopColor="#B8862D"/>
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="7" fill="url(#instagram-gradient-2025)"/>
    <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="12" cy="12" r="3.8" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="17.2" cy="6.8" r="1.3" fill="white"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-6 sm:h-6">
    <rect width="24" height="24" rx="7" fill="#1A1A1A"/>
    <path d="M17.2 10.1V8.2C16.2 8.2 15.3 7.8 14.6 7.1C14 6.3 13.6 5.3 13.6 4.3H11.7V14.8C11.7 16.1 10.6 17.2 9.3 17.2C8 17.2 6.9 16.1 6.9 14.8C6.9 13.5 8 12.4 9.3 12.4C9.5 12.4 9.7 12.4 9.9 12.5V10.5C9.7 10.5 9.5 10.5 9.3 10.5C6.9 10.5 5 12.4 5 14.8C5 17.2 6.9 19.1 9.3 19.1C11.7 19.1 13.6 17.2 13.6 14.8V9.4C14.5 10.1 15.6 10.5 16.8 10.5C16.9 10.5 17.1 10.4 17.2 10.1Z" fill="white"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-6 sm:h-6">
    <rect width="24" height="24" rx="7" fill="#1A1A1A"/>
    <path d="M16.5 15L17 12H14V10C14 9.17 14.33 8.5 15.5 8.5H17V5.8C16.45 5.7 15.7 5.5 14.5 5.5C12.14 5.5 10.5 7 10.5 9.5V12H8V15H10.5V22.8C11 22.9 11.5 23 12 23C12.5 23 13 22.9 13.5 22.8V15H16.5Z" fill="white"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-6 sm:h-6">
    <circle cx="12" cy="12" r="12" fill="#1A1A1A"/>
    <path d="M17.1 15.2C17 15.4 16.7 15.5 16.5 15.4C14.1 13.9 11.1 13.6 7.3 14.4C7 14.5 6.8 14.3 6.7 14.1C6.6 13.8 6.8 13.6 7 13.5C11.1 12.7 14.4 13 17.1 14.7C17.3 14.8 17.3 15.1 17.1 15.2ZM18.2 12.7C18 13 17.6 13.1 17.3 12.9C14.5 11.2 10.3 10.7 7.1 11.6C6.8 11.7 6.4 11.5 6.3 11.2C6.2 10.9 6.4 10.5 6.7 10.4C10.3 9.4 14.9 9.9 18.1 11.9C18.4 12.1 18.5 12.5 18.2 12.7ZM18.4 10.1C15 8.1 9.4 7.9 6.5 8.8C6.1 8.9 5.7 8.7 5.6 8.3C5.5 7.9 5.7 7.5 6.1 7.4C9.4 6.4 15.5 6.6 19.4 8.9C19.8 9.1 19.9 9.6 19.7 10C19.5 10.3 19 10.4 18.4 10.1Z" fill="white"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-6 sm:h-6">
    <rect width="24" height="24" rx="7" fill="#1A1A1A"/>
    <path d="M10 14.8V9.2L15 12L10 14.8Z" fill="white"/>
  </svg>
);

const XTwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect width="24" height="24" rx="7" fill="#000000"/>
    <path d="M13.9 10.5L18.5 5H17.2L13.3 9.6L10.2 5H6L10.8 12.7L6 18.5H7.3L11.4 13.6L14.7 18.5H18.9L13.9 10.5ZM12.1 12.8L11.5 12L7.9 5.9H9.7L12.6 10.1L13.2 10.9L17.2 17.6H15.4L12.1 12.8Z" fill="white"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect width="24" height="24" rx="7" fill="#1A1A1A"/>
    <path d="M8.5 10H6V18H8.5V10ZM7.25 8.75C8.08 8.75 8.75 8.08 8.75 7.25C8.75 6.42 8.08 5.75 7.25 5.75C6.42 5.75 5.75 6.42 5.75 7.25C5.75 8.08 6.42 8.75 7.25 8.75ZM18.5 18H16V13.75C16 12.5 15.25 12 14.5 12C13.75 12 12.75 12.75 12.75 14V18H10.25V10H12.5V11.25C12.75 10.75 13.75 9.75 15.25 9.75C17 9.75 18.5 11 18.5 13.5V18Z" fill="white"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect width="24" height="24" rx="7" fill="#000000"/>
    <path d="M16.4 11.4C16.3 11.3 16.2 11.3 16.1 11.2C15.9 9.4 14.8 8.2 13.1 8.1C12.1 8 11.2 8.4 10.6 9.2L11.8 10C12.1 9.6 12.6 9.4 13.1 9.4C13.9 9.5 14.5 10 14.6 10.8C13.9 10.6 13.2 10.6 12.4 10.7C10.5 11 9.4 12.3 9.5 14C9.6 15.8 11.1 17 12.8 16.9C14.1 16.8 15.1 16.2 15.5 15.1C15.8 14.4 15.8 13.5 15.5 12.6C15.9 12.8 16.2 13.1 16.4 13.5C16.8 14.4 16.8 15.9 15.6 17C14.5 17.9 13.2 18.3 11.5 18.3C9.5 18.2 7.9 17.3 7.1 15.7C6.4 14.3 6.3 12.6 6.8 11C7.5 8.9 9.2 7.4 11.5 7.1C13.8 6.8 15.8 7.5 17.1 9.1C17.7 9.9 18.1 10.9 18.2 12C18.3 12.8 18.2 13.5 18 14.2L19.3 14.6C19.6 13.7 19.7 12.7 19.6 11.7C19.4 10.4 18.9 9.2 18.1 8.2C16.5 6.3 14 5.4 11.3 5.8C8.5 6.2 6.3 8 5.5 10.6C4.9 12.5 5 14.6 5.9 16.4C6.9 18.4 8.9 19.5 11.4 19.7C13.5 19.8 15.2 19.3 16.6 18.1C18.3 16.6 18.4 14.5 17.8 13.2C17.5 12.5 17 11.9 16.4 11.4ZM12.9 15.5C12 15.6 11.1 15.1 11 14.1C10.9 13.1 11.6 12.4 12.7 12.2C12.9 12.2 13.2 12.2 13.4 12.2C13.8 12.2 14.2 12.3 14.5 12.4C14.5 14.3 13.9 15.4 12.9 15.5Z" fill="white"/>
  </svg>
);

const socialLinks = [
  { icon: InstagramIcon, href: "https://instagram.com/essenceyogurt", label: "Instagram", handle: "@essenceyogurt" },
  { icon: TikTokIcon, href: "https://www.tiktok.com/@essenceyogurt", label: "TikTok", handle: "@essenceyogurt" },
  { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61584957023084", label: "Facebook", handle: "Essence Yogurt" },
  { icon: YouTubeIcon, href: "https://www.youtube.com/@essenceyogurt", label: "YouTube", handle: "@essenceyogurt" },
  { icon: SpotifyIcon, href: "https://open.spotify.com/user/31qbhlig7pc5qnick47br7nfzrg4", label: "Spotify", handle: "Essence Party" },
];

const offices = [
  { region: "Global HQ", city: "Dubai, UAE", phone: "+971 4 XXX XXXX" },
  { region: "Europe", city: "London, UK", phone: "+44 20 XXXX XXXX" },
  { region: "Asia Pacific", city: "Singapore", phone: "+65 XXXX XXXX" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success("Welcome to the Essence family!", {
      description: "You'll receive our latest news and exclusive offers.",
    });
    setEmail("");
    setLoading(false);
  }

  return (
    <footer className="bg-neutral-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                Join the <span className="bg-gradient-to-r from-[#d4af37] via-[#f4e4bc] to-[#d4af37] bg-clip-text text-transparent">Essence</span><sup className="text-[#d4af37] text-[8px]">™</sup> Journey
              </h2>
              <p className="text-neutral-400 max-w-lg">
                Subscribe to our newsletter for exclusive offers, new flavour announcements, 
                and the latest news from Essence Yogurt locations worldwide.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md lg:ml-auto">
              <div className="flex-1 relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                  data-testid="newsletter-email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#a07c10] rounded-full text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                data-testid="newsletter-submit"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column - Official Logo Always Dominant */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img 
                src={logoDark} 
                alt="Essence Yogurt™" 
                className="h-24 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              Luxury soft serve yogurt for the world. Premium indulgence meets healthy living.
            </p>
            <p className="text-sm font-semibold text-[#d4af37] mb-6">
              #EssenceYogurt
            </p>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-neutral-900/50 hover:bg-neutral-800 hover:scale-110 transition-all duration-200 group"
                  aria-label={`Follow us on ${social.label}`}
                  title={`${social.label}: ${social.handle}`}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-4">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-4">Partners</h3>
            <ul className="space-y-3">
              {footerLinks.partners.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-4">Global Offices</h3>
            <ul className="space-y-4">
              {offices.map((office) => (
                <li key={office.region} className="text-sm">
                  <p className="text-white font-medium">{office.region}</p>
                  <p className="text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {office.city}
                  </p>
                  <p className="text-neutral-500 flex items-center gap-1">
                    <Phone size={12} /> {office.phone}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="font-medium">© 2025 Essence Yogurt™. All rights reserved.</p>
              <span className="hidden md:inline text-neutral-700">|</span>
              <p>Crafted with love in Dubai, UAE</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="hover:text-white transition-colors"
                  data-testid={`footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="bg-black border-t border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="text-center">
            <p className="text-[10px] text-neutral-600 leading-relaxed">
              Essence Yogurt™ is a registered trademark. All content, images, logos, and intellectual property on this website are protected by copyright law. 
              Unauthorized reproduction, distribution, or use of any materials without express written permission from Essence Yogurt Group is strictly prohibited. 
              © {new Date().getFullYear()} Essence Yogurt Group. All Rights Reserved Worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
