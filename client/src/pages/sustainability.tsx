"use client";

import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Leaf, Recycle, Heart, Globe, Droplets, Sun } from "lucide-react";

const initiatives = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "We source only premium, natural ingredients. Our yogurt contains no artificial colors, flavors, or preservatives.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly Packaging",
    description: "All our cups and spoons are made from biodegradable materials. We're committed to eliminating single-use plastics by 2026.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Our production facilities use advanced water recycling systems, reducing water consumption by 40% compared to industry standards.",
  },
  {
    icon: Sun,
    title: "Renewable Energy",
    description: "All Essence Yogurt locations are powered by renewable energy sources, with solar panels installed at our flagship venues.",
  },
  {
    icon: Heart,
    title: "Community Support",
    description: "We partner with local dairy farmers and fruit suppliers, supporting sustainable agriculture and fair trade practices.",
  },
  {
    icon: Globe,
    title: "Carbon Neutral by 2027",
    description: "We're on track to achieve carbon neutrality across all operations through emission reduction and offset programs.",
  },
];

const goals = [
  { year: "2025", goal: "100% recyclable packaging across all locations" },
  { year: "2026", goal: "Zero single-use plastics in all operations" },
  { year: "2027", goal: "Carbon neutral across global operations" },
  { year: "2028", goal: "100% sustainably sourced ingredients" },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-400 mb-4">
              Sustainability
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Indulgence that cares<br />for our planet.
            </h1>
            <p className="text-lg text-emerald-200 max-w-2xl">
              At Essence Yogurt, we believe luxury and sustainability go hand in hand. 
              Every decision we make considers our impact on the environment and communities we serve.
            </p>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold mb-6">Our Commitment</h2>
              <p className="text-neutral-600 mb-4">
                Essence Yogurt was founded on the principle that premium quality should never 
                come at the expense of our planet. From the ingredients we source to the 
                packaging we use, sustainability is woven into every aspect of our business.
              </p>
              <p className="text-neutral-600">
                We're committed to transparency in our environmental practices and continuously 
                work to reduce our footprint while delivering the exceptional yogurt experience 
                our customers love.
              </p>
            </div>
          </div>
        </section>

        {/* Initiatives */}
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-8">
              Our Initiatives
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {initiatives.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                    <item.icon size={24} className="text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals Timeline */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-8">
              Sustainability Goals
            </h2>
            <div className="grid gap-4 md:grid-cols-4">
              {goals.map((item, idx) => (
                <div
                  key={item.year}
                  className="relative rounded-3xl border border-neutral-200 bg-white p-6"
                >
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                    {item.year}
                  </div>
                  <p className="text-sm text-neutral-700 mt-2">{item.goal}</p>
                  {idx < goals.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-emerald-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="bg-emerald-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-400 mb-8 text-center">
              Our Impact
            </h2>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <p className="text-4xl font-semibold text-emerald-400 mb-2">40%</p>
                <p className="text-sm text-emerald-200">Water reduction vs industry average</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-emerald-400 mb-2">85%</p>
                <p className="text-sm text-emerald-200">Recyclable packaging used</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-emerald-400 mb-2">100+</p>
                <p className="text-sm text-emerald-200">Local suppliers supported</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-emerald-400 mb-2">0</p>
                <p className="text-sm text-emerald-200">Artificial ingredients used</p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Our Sustainable Journey</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
              Every cup of Essence Yogurt you enjoy contributes to a more sustainable future. 
              Together, we can make a difference.
            </p>
            <a
              href="/contact"
              className="inline-block rounded-full bg-emerald-600 text-white px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-emerald-700 transition-colors"
            >
              Learn More
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
