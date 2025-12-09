import { useState } from "react";
import { Link } from "wouter";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { ChevronDown, ChevronUp, HelpCircle, Sparkles, MapPin, Utensils, Scale, Gift, Users, Calendar, Smartphone, Shield, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    id: "about",
    title: "About Essence Yogurt",
    icon: Sparkles,
    items: [
      {
        question: "What is Essence Yogurt?",
        answer: "Essence Yogurt is a premium self serve soft serve yogurt bar and dessert concept. Guests create their own cup by choosing a yogurt base, building with fresh fruit and toppings, then paying by weight at the register."
      },
      {
        question: "Who owns Essence Yogurt?",
        answer: "Essence Yogurt is operated by experienced hospitality and technology companies with many years of global retail and food operations. Ownership and company details appear on your tax invoices as required by local law."
      },
      {
        question: "Where are you located?",
        answer: "Our first locations will open in the Middle East and Europe, followed by major airports, malls and high foot traffic destinations. Exact store locations and opening hours are published on our website and app."
      }
    ]
  },
  {
    id: "ingredients",
    title: "Ingredients, Halal, Vegan, Allergens",
    icon: Utensils,
    items: [
      {
        question: "Is your yogurt Halal?",
        answer: "Our yogurt bases and toppings are selected to be Halal friendly. In some countries we work toward certification through approved local authorities. Check signage in store or ask our staff for the latest certification."
      },
      {
        question: "Do you offer vegan or dairy free options?",
        answer: "Yes. Selected flavors are plant based or dairy free. These are labelled clearly in store and in the app. Because it is a self serve format, cross contact is still possible."
      },
      {
        question: "Are your products gluten free?",
        answer: "Some bases do not contain gluten ingredients. However, many toppings do, and cross contact may occur. We cannot guarantee any item is 100 percent gluten free."
      },
      {
        question: "Do you use nuts?",
        answer: "Yes. Some toppings contain nuts or peanuts. Traces may be present in other products. Customers with severe allergies should use caution."
      },
      {
        question: "Do you use alcohol or pork derivatives?",
        answer: "Our standard yogurt bases are free from pork gelatin and alcohol. Some third party toppings may contain these ingredients. Please check in store."
      }
    ]
  },
  {
    id: "nutrition",
    title: "Nutrition and Health",
    icon: HelpCircle,
    items: [
      {
        question: "Do you provide calorie counts?",
        answer: "Yes. Approximate nutritional values per 100g are shown in store, on our website and in the app for main flavors and some toppings."
      },
      {
        question: "Do you offer sugar free options?",
        answer: "From time to time we provide reduced sugar or no added sugar flavors. Availability varies by location."
      }
    ]
  },
  {
    id: "safety",
    title: "Food Safety and Freshness",
    icon: Shield,
    items: [
      {
        question: "How do you ensure food safety?",
        answer: "All stores follow strict food safety standards, including temperature logs, sanitation schedules and staff training. We follow local requirements such as HACCP or equivalent national regulations."
      },
      {
        question: "Do you monitor expiry dates?",
        answer: "Yes. Every item has a labelled shelf life. We rotate stock to use the oldest safe product first. Any product outside safe conditions is discarded."
      }
    ]
  },
  {
    id: "pricing",
    title: "Pricing, Weighing and Payments",
    icon: Scale,
    items: [
      {
        question: "How does pricing work?",
        answer: "Essence Yogurt uses a pay by weight model. The price per 100g or per ounce is clearly displayed. Your cup is weighed on a calibrated digital scale before payment."
      },
      {
        question: "Which payment methods do you accept?",
        answer: "Apple Pay, Google Pay, Visa, Mastercard, Amex and local payment methods depending on the country. Loyalty rewards and e gift cards can also be redeemed."
      },
      {
        question: "Can the staff re-weigh my cup?",
        answer: "Yes. You may request a second weighing before payment."
      }
    ]
  },
  {
    id: "loyalty",
    title: "Loyalty, VIP Rewards and Points",
    icon: Users,
    items: [
      {
        question: "How does the loyalty program work?",
        answer: "Register for free using your mobile number, email or social login. Every eligible purchase earns points. Points accumulate in your account."
      },
      {
        question: "What are the VIP tiers?",
        answer: "Our tiers include Gold, Platinum and Diamond. Higher tiers provide priority access and early notification of new flavours."
      },
      {
        question: "How do I earn points?",
        answer: "Show your QR code when paying in store. For online purchases, use the same account."
      },
      {
        question: "Do points expire?",
        answer: "Points usually remain valid for a set period such as 12 months, unless local law requires otherwise."
      },
      {
        question: "Can I transfer points?",
        answer: "No. Points, rewards and VIP status are personal and cannot be transferred or sold."
      }
    ]
  },
  {
    id: "egift",
    title: "E-Gift Cards and Promotions",
    icon: Gift,
    items: [
      {
        question: "Do you offer digital gift cards?",
        answer: "Yes. You can buy e gift cards online or in store. Each card contains a unique QR or code. Redemption rules appear in your purchase confirmation."
      },
      {
        question: "Do e-gift cards expire?",
        answer: "This depends on the consumer laws in your country. Some regions require long validity periods or no expiry at all."
      },
      {
        question: "Can I resell gift cards?",
        answer: "No. They are intended for personal gifting. Some markets may allow one time transfer to a family member."
      }
    ]
  },
  {
    id: "events",
    title: "Events, Carts and Partnerships",
    icon: Calendar,
    items: [
      {
        question: "Do you cater events?",
        answer: "Yes. We operate luxury mobile carts and pop ups for corporate events, private functions and major activations. Packages include staff, transport, customized branding and premium toppings."
      },
      {
        question: "Is franchising available?",
        answer: "Franchise enquiries are accepted through our official form only. Selected territories may open for applications depending on local regulations and market conditions."
      },
      {
        question: "Can you support large scale rollouts?",
        answer: "Yes. Our team has long experience in multi territory logistics, cold chain management, media and technology."
      }
    ]
  },
  {
    id: "app",
    title: "Accounts, App and Privacy",
    icon: Smartphone,
    items: [
      {
        question: "How do I log in?",
        answer: "Use mobile number, email, social login or passkey. You can switch accounts quickly if multiple family members share a device."
      },
      {
        question: "What information do you collect?",
        answer: "Basic account info, purchase history, approximate location and device details necessary to operate your membership, rewards and payments."
      },
      {
        question: "Do you sell customer data?",
        answer: "No. Data is never sold. Information may be shared with verified service providers under strict privacy requirements."
      },
      {
        question: "Which privacy laws apply?",
        answer: "We comply with local laws such as PDPL (Saudi Arabia), PDPL (UAE), GDPR (EU), and national privacy regulations in Israel, Australia and other regions."
      }
    ]
  },
  {
    id: "support",
    title: "Refunds, Complaints and Contact",
    icon: MessageCircle,
    items: [
      {
        question: "What is your refund policy?",
        answer: "Since products are self serve food, refunds are normally unavailable unless required by consumer law or there is a confirmed product issue."
      },
      {
        question: "How can I give feedback?",
        answer: "Use the support form in the app or contact us via the email shown on your receipt."
      }
    ]
  },
  {
    id: "legal",
    title: "Legal Notices",
    icon: Shield,
    items: [
      {
        question: "Anything important I should know?",
        answer: "A self serve environment carries a risk of cross contact between allergens. Customers with severe allergies should use caution. Nothing in this FAQ replaces local laws or professional dietary advice."
      }
    ]
  }
];

function FAQAccordion({ section }: { section: FAQSection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const Icon = section.icon;

  return (
    <div className="mb-8" id={section.id} data-testid={`faq-section-${section.id}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f6e7c8] to-[#d4af37]/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#d4af37]" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">{section.title}</h2>
      </div>
      <div className="space-y-3">
        {section.items.map((item, index) => (
          <div
            key={index}
            className="border border-neutral-200 rounded-xl overflow-hidden bg-white hover:border-[#d4af37]/30 transition-colors"
            data-testid={`faq-item-${section.id}-${index}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left"
              data-testid={`faq-toggle-${section.id}-${index}`}
            >
              <span className="font-medium text-neutral-800 pr-4">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white"></div>
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f6e7c8] to-[#d4af37]/20 text-sm mb-6">
              <HelpCircle size={16} className="text-[#d4af37]" />
              <span className="text-neutral-700 font-medium">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4" data-testid="faq-title">
              Frequently Asked
              <span className="block bg-gradient-to-r from-[#d4af37] to-[#a07c10] bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to know about Essence Yogurt, our products, loyalty program, and services.
            </p>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-4xl px-4 py-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {faqData.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-[#d4af37] hover:bg-white border border-transparent hover:border-neutral-200 transition-all"
                  data-testid={`faq-nav-${section.id}`}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4">
            {faqData.map((section) => (
              <FAQAccordion key={section.id} section={section} />
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="border-t border-neutral-200 bg-neutral-950 text-white">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-neutral-400 mb-6 max-w-lg mx-auto">
              Our team is here to help. Reach out via email or use our AI concierge for instant answers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#a07c10] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all"
                data-testid="faq-contact-btn"
              >
                Contact Us
              </Link>
              <a
                href="mailto:support@essenceyogurt.com"
                className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800 transition-all"
                data-testid="faq-email-btn"
              >
                support@essenceyogurt.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Legal Footer */}
      <div className="bg-neutral-900 text-neutral-500 text-xs text-center py-4 border-t border-neutral-800">
        <p>&copy; 2025 Essence Yogurt&trade; - All Rights Reserved</p>
      </div>
    </div>
  );
}
