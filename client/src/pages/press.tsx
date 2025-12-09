"use client";

import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Download, Mail, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const pressReleases = [
  {
    date: "November 2025",
    title: "Essence Yogurt Announces European Expansion Plans",
    excerpt: "The luxury frozen yogurt brand reveals plans to open flagship locations in London, Paris, and Milan by 2026.",
  },
  {
    date: "October 2025",
    title: "Essence Yogurt Launches Sustainability Initiative",
    excerpt: "Commitment to carbon neutrality by 2027 and 100% recyclable packaging across all locations.",
  },
  {
    date: "September 2025",
    title: "New Flagship Location Opens at Dubai Mall",
    excerpt: "Essence Yogurt celebrates the grand opening of its largest location to date in the world's most visited mall.",
  },
  {
    date: "August 2025",
    title: "Essence Circle Loyalty Program Reaches 50,000 Members",
    excerpt: "The premium loyalty program continues to grow with members worldwide.",
  },
  {
    date: "July 2025",
    title: "Strategic Partnership with Major Airport Authority",
    excerpt: "Essence Yogurt signs multi-year agreement to expand presence across premium airport terminals.",
  },
];

const mediaAssets = [
  { name: "Brand Guidelines", format: "PDF", size: "4.2 MB" },
  { name: "Logo Pack (All Formats)", format: "ZIP", size: "12.8 MB" },
  { name: "Product Photography", format: "ZIP", size: "45.6 MB" },
  { name: "Store Photography", format: "ZIP", size: "32.1 MB" },
  { name: "Executive Headshots", format: "ZIP", size: "8.4 MB" },
  { name: "Fact Sheet", format: "PDF", size: "1.2 MB" },
];

const mediaContacts = [
  {
    region: "All Press Inquiries",
    name: "Press Team",
    title: "Communications",
    email: "support@essenceyogurt.com",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Press & Media
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Essence Yogurt<br />in the news.
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Welcome to our press center. Here you'll find the latest news, media resources, 
              and contact information for press inquiries.
            </p>
          </div>
        </section>

        {/* Press Releases */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-8">
              Latest News
            </h2>
            <div className="space-y-6">
              {pressReleases.map((release, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                        <Calendar size={14} />
                        {release.date}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[#d4af37] transition-colors">
                        {release.title}
                      </h3>
                      <p className="text-sm text-neutral-600">{release.excerpt}</p>
                    </div>
                    <ExternalLink size={20} className="text-neutral-400 shrink-0 group-hover:text-[#d4af37] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-2">
              Media Kit
            </h2>
            <p className="text-neutral-600 mb-8">
              Download our brand assets for editorial use. For commercial licensing, please contact our team.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mediaAssets.map((asset, idx) => (
                <button
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 hover:border-[#d4af37] transition-colors text-left"
                >
                  <div>
                    <h3 className="font-semibold mb-1">{asset.name}</h3>
                    <p className="text-xs text-neutral-500">{asset.format} · {asset.size}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Download size={18} className="text-neutral-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Media Contacts */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-8">
              Media Contacts
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {mediaContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-neutral-200 bg-white p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#d4af37] mb-3">
                    {contact.region}
                  </p>
                  <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{contact.title}</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-neutral-700 hover:text-[#d4af37] transition-colors"
                  >
                    <Mail size={14} />
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="bg-gradient-to-br from-[#d4af37] to-[#a07c10] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6">
                  The Essence Story
                </h2>
                <p className="text-white/90 mb-4">
                  Founded with a vision to bring luxury frozen yogurt to the world's most 
                  prestigious destinations, Essence Yogurt has quickly become the go-to brand 
                  for premium self-serve frozen yogurt.
                </p>
                <p className="text-white/90 mb-6">
                  With locations in major airports, premium malls, and exclusive venues, 
                  Essence Yogurt combines the finest natural ingredients with an unmatched 
                  customer experience.
                </p>
                <Link
                  href="/story"
                  className="inline-block rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
                >
                  Read Our Story
                </Link>
              </div>
              <div className="text-center lg:text-right">
                <div className="inline-block rounded-3xl bg-white/10 backdrop-blur p-8">
                  <div className="text-6xl font-bold mb-2">2024</div>
                  <p className="text-white/80">Year Founded</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
