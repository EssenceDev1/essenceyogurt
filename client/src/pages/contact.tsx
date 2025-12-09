"use client";

import { useState } from "react";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const offices = [
  {
    region: "Global Headquarters",
    city: "Dubai, UAE",
    address: "Dubai Design District, Building 7",
    phone: "+971 4 XXX XXXX",
    email: "support@essenceyogurt.com",
    hours: "Sun - Thu: 9:00 AM - 6:00 PM GST",
  },
  {
    region: "Europe Office",
    city: "London, UK",
    address: "1 Canada Square, Canary Wharf",
    phone: "+44 20 XXXX XXXX",
    email: "support@essenceyogurt.com",
    hours: "Mon - Fri: 9:00 AM - 5:30 PM GMT",
  },
  {
    region: "Asia Pacific Office",
    city: "Singapore",
    address: "Marina Bay Financial Centre",
    phone: "+65 XXXX XXXX",
    email: "support@essenceyogurt.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM SGT",
  },
];

const inquiryTypes = [
  "General Inquiry",
  "Franchise Opportunity",
  "Partnership Proposal",
  "Media & Press",
  "Investor Relations",
  "Careers",
  "Customer Feedback",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.inquiryType || "General Inquiry",
          message: form.message,
        }),
      });

      if (res.ok) {
        toast.success("Message sent successfully!", {
          description: "Our team will respond within 24-48 hours.",
        });
        setForm({ name: "", email: "", phone: "", inquiryType: "", message: "" });
      } else {
        toast.error("Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-neutral-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
              Contact Us
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Let's create something<br />golden together.
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Whether you're interested in franchise opportunities, partnerships, 
              or simply want to learn more about Essence Yogurt, we'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Global Offices */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-8">
              Global Offices
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {offices.map((office) => (
                <div
                  key={office.region}
                  className="rounded-3xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-1">{office.region}</h3>
                  <p className="text-sm text-[#d4af37] font-medium mb-4">{office.city}</p>
                  <div className="space-y-3 text-sm text-neutral-600">
                    <p className="flex items-start gap-3">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-neutral-400" />
                      {office.address}
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone size={16} className="shrink-0 text-neutral-400" />
                      {office.phone}
                    </p>
                    <p className="flex items-center gap-3">
                      <Mail size={16} className="shrink-0 text-neutral-400" />
                      {office.email}
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock size={16} className="shrink-0 text-neutral-400" />
                      {office.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
                <p className="text-neutral-600 mb-8">
                  Complete the form below and our team will get back to you within 24-48 business hours.
                </p>
                <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                  <h3 className="font-semibold mb-4">Quick Contact</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-neutral-500 mb-1">All Inquiries</p>
                      <a href="mailto:support@essenceyogurt.com" className="text-[#d4af37] hover:underline">
                        support@essenceyogurt.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="Your name"
                      data-testid="contact-name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="you@example.com"
                      data-testid="contact-email"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="+1 234 567 8900"
                      data-testid="contact-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors bg-white"
                      data-testid="contact-type"
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                    placeholder="How can we help you?"
                    data-testid="contact-message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                  data-testid="contact-submit"
                >
                  <Send size={16} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
