import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link, useRoute } from "wouter";
import { useState, useEffect } from "react";
import { AlertTriangle, ShieldCheck, Scale, Lock, CreditCard, Gift, Building2, FileText, Globe, Store } from "lucide-react";

const legalSections = {
  allergy: {
    title: "Allergy Warning",
    icon: AlertTriangle,
    color: "text-amber-600",
    content: `Essence Yogurt serves products that may contain or come into contact with:

• Dairy
• Nuts (including peanuts, pistachio, almond and hazelnut)
• Soy
• Eggs
• Gluten
• Chocolate
• Coconut
• Fruit mixes with possible seeds

Cross contamination may occur even when ingredients are separated. Customers with allergies are responsible for checking ingredients before consuming. Essence Yogurt is not responsible for reactions caused by known or unknown allergies.`
  },
  "food-safety": {
    title: "Food Safety",
    icon: ShieldCheck,
    color: "text-emerald-600",
    content: `All products are handled according to food safety regulations in the region of operation. Essence Yogurt follows strict hygiene and temperature control protocols however customers consume products at their own risk.

Storage, topping selection and self serve actions are performed by the customer. Essence Yogurt does not accept responsibility for illness caused by mishandling of products by customers or third parties.

Self Serve Responsibility:
Essence Yogurt uses a self serve model. Customers are responsible for:
• Selecting yogurt and toppings
• Portion sizes
• Avoiding cross contamination
• Using clean cups
• Handling food safely

By using the self serve stations, customers accept full responsibility for their choices and actions.`
  },
  terms: {
    title: "Terms & Conditions",
    icon: FileText,
    color: "text-blue-600",
    content: `By using Essence Yogurt stores, website or mobile app, customers agree to:

• Accurate information during sign up
• Lawful use of services
• Non transfer of e gift cards
• No misuse of loyalty points
• Respectful conduct on premises

Liability Limitation:
To the maximum extent permitted by applicable law, Essence Yogurt, its directors, employees, contractors and partners are not liable for:
• Allergic reactions
• Illness caused by third party ingredients
• Contamination caused by customer actions
• Accidental spillage or injury on premises
• Mobile app errors
• POS or payment failures
• Incorrect use of equipment

Liability is limited to the minimum required under local law in each operating country.`
  },
  privacy: {
    title: "Privacy Policy",
    icon: Lock,
    color: "text-purple-600",
    content: `Essence Yogurt collects and processes data in accordance with:

• Saudi PDPL (2024)
• UAE Federal PDPL
• Israel PPL Amendment 13 (2025)
• EU GDPR
• Australian Privacy Act 2025 reforms

Data collected includes:
• Name, email, phone
• Payment confirmations
• Loyalty activity
• Device info
• Location (optional)

Data is stored securely on encrypted servers and used for:
• Loyalty functionality
• Order history
• Customer service
• AI based improvements

No personal data is sold. Customers may request data access or deletion in app.`
  },
  refunds: {
    title: "Refund Policy",
    icon: CreditCard,
    color: "text-rose-600",
    content: `All purchases are final. No refunds or exchanges are provided on yogurt, toppings or e gift cards unless required by law.

Weight based purchases cannot be returned once dispensed. E gift cards are single use, non transferable and non refundable.

Payment Terms:
Essence Yogurt accepts digital payments through approved processors such as Checkout.com, Stripe, Apple Pay, Google Pay, Visa, Mastercard and Amex. Failed transactions are handled by the payment provider. Essence Yogurt does not store credit card numbers.`
  },
  "egift-terms": {
    title: "E-Gift Terms",
    icon: Gift,
    color: "text-amber-500",
    content: `Essence Yogurt e gift cards are:

• Single use only
• Not transferable
• Not redeemable for cash
• Valid only at participating locations
• Not replaceable if lost or stolen

E-gift cards are delivered digitally and can be redeemed via QR code at any participating Essence Yogurt location. The full value must be used in a single transaction.`
  },
  franchise: {
    title: "Franchise Legal",
    icon: Building2,
    color: "text-indigo-600",
    content: `Franchise opportunities are subject to approval. Submitting an inquiry does not guarantee approval.

Essence Yogurt reserves the right to decline applicants without providing reasons. All franchise agreements require legal review and compliance with local regulations in the target country.

For franchise inquiries, please contact our expansion team through the official franchise portal.`
  },
  disclaimer: {
    title: "Website Disclaimer",
    icon: Globe,
    color: "text-neutral-600",
    content: `The content on essenceyogurt.com is provided for general information only. No warranty is provided for accuracy.

Essence Yogurt is not responsible for loss caused by reliance on website content or technical errors.

Intellectual Property:
All logos, designs, images, brand marks and technology used by Essence Yogurt including the Octopus Brain system are protected intellectual property. Unauthorized use is prohibited.

Governing Law:
Laws applicable depend on the location of the store. For online usage, laws of the customer's country may also apply.`
  },
  kiosk: {
    title: "24/7 Kiosk Disclaimer",
    icon: Store,
    color: "text-cyan-600",
    content: `At 24 hour self serve kiosks, customers are responsible for hygiene, food handling and product usage.

Staff may not be available. Emergency numbers are displayed.

By using the kiosk, the customer accepts full responsibility for their actions.

All 24/7 kiosks are monitored by security cameras and AI systems for safety and loss prevention.`
  }
};

type SectionKey = keyof typeof legalSections;

export default function LegalPage() {
  const [, params] = useRoute("/legal/:section");
  const [activeSection, setActiveSection] = useState<SectionKey>("allergy");
  
  useEffect(() => {
    if (params?.section && params.section in legalSections) {
      setActiveSection(params.section as SectionKey);
    }
  }, [params?.section]);
  
  const currentSection = legalSections[activeSection];
  const Icon = currentSection.icon;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 mb-4">
              Legal
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Legal Information
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              Important legal information for Essence Yogurt customers, partners and franchise operators.
            </p>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {(Object.keys(legalSections) as SectionKey[]).map((key) => {
                const section = legalSections[key];
                const SectionIcon = section.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    data-testid={`btn-legal-${key}`}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      activeSection === key
                        ? "border-amber-400 bg-amber-50"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <SectionIcon className={`w-5 h-5 ${activeSection === key ? section.color : "text-neutral-400"}`} />
                    <span className={`text-[10px] font-medium text-center leading-tight ${activeSection === key ? "text-neutral-900" : "text-neutral-600"}`}>
                      {section.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl bg-neutral-100`}>
                <Icon className={`w-6 h-6 ${currentSection.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{currentSection.title}</h2>
                <p className="text-sm text-neutral-500">Last updated: January 2025</p>
              </div>
            </div>
            
            <div className="prose prose-neutral max-w-none">
              <div className="bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-200">
                <pre className="whitespace-pre-wrap font-sans text-neutral-700 text-sm leading-relaxed m-0">
                  {currentSection.content}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <h3 className="text-lg font-semibold mb-4">Regional Data Protection</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { region: "Saudi Arabia", law: "Saudi PDPL (2024)", flag: "🇸🇦" },
                { region: "UAE", law: "UAE Federal PDPL", flag: "🇦🇪" },
                { region: "Israel", law: "PPL Amendment 13 (2025)", flag: "🇮🇱" },
                { region: "Greece / EU", law: "EU GDPR", flag: "🇬🇷" },
                { region: "Australia", law: "Privacy Act 2025", flag: "🇦🇺" }
              ].map((item) => (
                <div key={item.region} className="p-4 rounded-xl border border-neutral-200 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.flag}</span>
                    <span className="font-medium text-sm">{item.region}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{item.law}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-200">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-neutral-600 text-sm mb-4">
                If you have questions about our legal policies or need to make a data request, 
                please contact our support team.
              </p>
              <Link href="/contact">
                <button 
                  className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                  data-testid="btn-contact-support"
                >
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
