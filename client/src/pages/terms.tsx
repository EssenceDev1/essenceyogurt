import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 mb-4">
              Legal
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-neutral-500">Last updated: January 2025</p>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-neutral max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-neutral-600">
                  By accessing or using Essence Yogurt's services, website, or mobile applications, 
                  you agree to be bound by these Terms of Service. If you do not agree to these terms, 
                  please do not use our services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">2. Essence Circle Membership</h2>
                <p className="text-neutral-600 mb-3">
                  Essence Circle is our loyalty program. By joining, you agree to:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Points have no cash value and expire 12 months from earning date</li>
                  <li>Benefits and tier thresholds may be modified with notice</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">3. E-Gift Cards</h2>
                <p className="text-neutral-600 mb-3">
                  Essence Yogurt E-Gift Cards are subject to the following terms:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Valid at participating Essence Yogurt locations only</li>
                  <li>Cannot be redeemed for cash except where required by law</li>
                  <li>Lost or stolen cards cannot be replaced</li>
                  <li>No expiration date on card value</li>
                  <li>Treat as cash - Essence Yogurt is not responsible for unauthorized use</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">4. Purchases and Pricing</h2>
                <p className="text-neutral-600">
                  All purchases are priced by weight at prevailing local rates. Prices may vary by 
                  location and are subject to change without notice. We accept major credit cards, 
                  Apple Pay, Google Pay, and Essence E-Gift Cards. All sales are final.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
                <p className="text-neutral-600">
                  All content on this website, including logos, text, graphics, and software, 
                  is the property of Essence Yogurt and is protected by international copyright 
                  and trademark laws. You may not reproduce, distribute, or create derivative 
                  works without our express written permission.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="text-neutral-600">
                  Essence Yogurt shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages arising from your use of our services. 
                  Our total liability shall not exceed the amount paid by you for the specific 
                  product or service giving rise to the claim.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
                <p className="text-neutral-600">
                  We reserve the right to modify these terms at any time. Changes will be 
                  effective immediately upon posting. Your continued use of our services 
                  constitutes acceptance of any changes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
                <p className="text-neutral-600">
                  For questions about these Terms, please contact us at{" "}
                  <a href="mailto:support@essenceyogurt.com" className="text-[#d4af37] hover:underline">support@essenceyogurt.com</a> or 
                  visit our <Link href="/contact" className="text-[#d4af37] hover:underline">Contact page</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
