import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-neutral-500">Last updated: January 2025</p>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-neutral max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-neutral-600 mb-3">
                  Essence Yogurt collects information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Name, email address, and contact information when you join Essence Circle</li>
                  <li>Payment information when you make purchases or send e-gift cards</li>
                  <li>Location data when you use our location finder</li>
                  <li>Communications you send to us</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-neutral-600 mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Process transactions and send related information</li>
                  <li>Manage your Essence Circle membership and rewards</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze and improve our services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="text-neutral-600">
                  We do not sell your personal information. We may share information with service 
                  providers who perform services on our behalf, or as required by law. We may also 
                  share information with franchise partners to fulfill orders and provide services 
                  at their locations.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-neutral-600">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or 
                  destruction. All payment transactions are encrypted using industry-standard protocols.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                <p className="text-neutral-600 mb-3">
                  Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Data portability</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
                <p className="text-neutral-600">
                  For any questions about this Privacy Policy or our data practices, please contact 
                  us at <a href="mailto:support@essenceyogurt.com" className="text-[#d4af37] hover:underline">support@essenceyogurt.com</a> or 
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
