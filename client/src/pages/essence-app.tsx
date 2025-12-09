"use client";

import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { IceCream } from "lucide-react";

type AppTab = "dashboard" | "inbox" | "wallet";

export default function EssenceAppPage() {
  const [tab, setTab] = useState<AppTab>("dashboard");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f6e7c8] via-[#d4af37] to-[#a07c10]">
                <IceCream className="text-white" size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-[0.16em] uppercase">
                  Essence Circle App
                </span>
                <span className="text-[11px] text-neutral-500">
                  Member dashboard, inbox and wallet
                </span>
              </div>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <div className="flex gap-2 mb-4">
            {(["dashboard", "inbox", "wallet"] as AppTab[]).map((value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold border ${
                  tab === value
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 text-neutral-700 hover:border-black"
                }`}
                data-testid={`tab-${value}`}
              >
                {value === "dashboard"
                  ? "Dashboard"
                  : value === "inbox"
                  ? "Inbox"
                  : "Wallet"}
              </button>
            ))}
          </div>

          {tab === "dashboard" && <EssenceDashboard />}
          {tab === "inbox" && <EssenceInbox />}
          {tab === "wallet" && <EssenceWallet />}
        </div>
      </main>
    </div>
  );
}

function EssenceDashboard() {
  const { data: tiersData } = useQuery({
    queryKey: ["loyalty-tiers"],
    queryFn: async () => {
      const res = await fetch("/api/loyalty-tiers");
      return res.json();
    },
  });

  const samplePoints = 2380;
  const tier = "Gold";

  return (
    <section className="space-y-4 pb-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back, Essence member.
      </h1>
      <p className="text-xs text-neutral-600">
        This dashboard connects to the Octopus Brain backend. It shows
        a summary of your Essence Circle status.
      </p>
      <div className="grid gap-4 md:grid-cols-3 text-xs">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Points balance
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {samplePoints.toLocaleString()}
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Membership tier
          </p>
          <p className="mt-2 text-lg font-semibold">{tier}</p>
          <p className="text-[11px] text-neutral-600 mt-1">
            You are close to Platinum. Watch your inbox for special previews.
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Essence ID
          </p>
          <p className="mt-2 text-lg font-mono">EY-9X42-LUXE</p>
          <p className="text-[11px] text-neutral-600 mt-1">
            Show this or your QR code at the counter to earn and redeem.
          </p>
        </div>
      </div>
      
      {/* Tier Progress */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold mb-4">Loyalty Tiers</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {tiersData?.tiers?.map((t: any) => (
            <div key={t.id} className="rounded-2xl border border-neutral-200 p-4">
              <p className="font-semibold">{t.name}</p>
              <p className="text-[11px] text-neutral-500">{t.requiredPoints} points required</p>
              <p className="text-[11px] text-neutral-600 mt-2">{t.perksDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EssenceInbox() {
  const threads = [
    {
      id: 1,
      subject: "Welcome to Essence Circle",
      preview: "We are happy to have you on board...",
      unread: false,
    },
    {
      id: 2,
      subject: "Your airport preview in Dubai",
      preview: "You have been selected for an early preview of our Dubai airport concept.",
      unread: true,
    },
    {
      id: 3,
      subject: "Your birthday swirl is waiting",
      preview: "Enjoy a birthday swirl on us this month...",
      unread: true,
    },
  ];

  return (
    <section className="space-y-3 pb-10">
      <h2 className="text-sm font-semibold">Personal inbox</h2>
      <p className="text-xs text-neutral-600">
        This inbox is 1 to 1 between Essence and you. It will be powered by the
        backend inbox service and AI concierge.
      </p>
      <div className="grid gap-3 md:grid-cols-2 text-xs">
        <div className="space-y-2">
          {threads.map((t) => (
            <div
              key={t.id}
              className="flex items-start justify-between rounded-2xl border border-neutral-200 bg-white px-3 py-2 hover:border-black cursor-pointer"
              data-testid={`inbox-thread-${t.id}`}
            >
              <div>
                <p className="font-semibold">
                  {t.subject}
                  {t.unread && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-black" />
                  )}
                </p>
                <p className="text-[11px] text-neutral-600">{t.preview}</p>
              </div>
              <span className="text-[10px] text-neutral-400">Essence</span>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700">
          <p className="font-semibold mb-1">How it works</p>
          <p>
            Messages appear here when Essence has something meaningful to say.
            You can reply to selected threads and have a private line with the
            brand. The system is backed by a secure inbox service on the
            Octopus Brain backend.
          </p>
        </div>
      </div>
    </section>
  );
}

function EssenceWallet() {
  const { data: packagesData } = useQuery({
    queryKey: ["credit-packages"],
    queryFn: async () => {
      const res = await fetch("/api/credit-packages");
      return res.json();
    },
  });

  const cards = [
    { label: "Primary Essence card", balance: 0, currency: "USD" },
    { label: "Gift card from Naomi", balance: 75, currency: "USD" },
  ];

  return (
    <section className="space-y-3 pb-10">
      <h2 className="text-sm font-semibold">Wallet</h2>
      <p className="text-xs text-neutral-600">
        All your Essence cards in one place. This connects to live e-gift
        and membership data.
      </p>
      <div className="grid gap-3 md:grid-cols-2 text-xs">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-[#f6e7c8] via-[#d4af37] to-[#a07c10] text-white shadow-[0_24px_80px_rgba(0,0,0,0.16)] p-4 flex flex-col justify-between aspect-[16/9]"
            data-testid={`wallet-card-${idx}`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="tracking-[0.18em] uppercase">
                Essence Yogurt
              </span>
              <span>Card</span>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">{card.label}</p>
              <p className="text-2xl font-semibold">
                {card.balance.toFixed(2)} {card.currency}
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] opacity-80">
              <span>Member</span>
              <span>essenceyogurt.com</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Available Packages */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3">Available Packages</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {packagesData?.packages?.map((pkg: any) => (
            <div key={pkg.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="font-semibold">{pkg.name}</p>
              <p className="text-[11px] text-neutral-600">{pkg.description}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-lg font-semibold">{pkg.currency} {pkg.basePrice}</span>
                <span className="text-[11px] text-green-600">{pkg.discountPercent}% off</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
