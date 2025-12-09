import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500 mb-4">
              Commitment
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Accessibility Statement
            </h1>
            <p className="text-sm text-neutral-500">Last updated: January 2025</p>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-neutral max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Our Commitment</h2>
                <p className="text-neutral-600">
                  Essence Yogurt is committed to ensuring digital accessibility for people with 
                  disabilities. We are continually improving the user experience for everyone and 
                  applying the relevant accessibility standards to guarantee we provide equal access 
                  to all users.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Conformance Status</h2>
                <p className="text-neutral-600">
                  We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 
                  Level AA standards. These guidelines explain how to make web content more 
                  accessible for people with disabilities and more user-friendly for everyone.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Accessibility Features</h2>
                <p className="text-neutral-600 mb-3">
                  Our website includes the following accessibility features:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Keyboard navigation support throughout the site</li>
                  <li>Alternative text for images and visual content</li>
                  <li>Consistent navigation and page structure</li>
                  <li>Color contrast ratios meeting WCAG AA standards</li>
                  <li>Resizable text without loss of functionality</li>
                  <li>Focus indicators for interactive elements</li>
                  <li>Form labels and error messages</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Physical Locations</h2>
                <p className="text-neutral-600">
                  Our self-serve yogurt bars are designed to be accessible to all customers. 
                  Features include wheelchair-accessible counters, clear signage, and staff 
                  trained to assist customers with disabilities. If you require assistance at 
                  any Essence Yogurt location, please ask a team member.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Feedback</h2>
                <p className="text-neutral-600">
                  We welcome your feedback on the accessibility of our website and physical 
                  locations. Please let us know if you encounter accessibility barriers:
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2 mt-3">
                  <li>Email: <a href="mailto:support@essenceyogurt.com" className="text-[#d4af37] hover:underline">support@essenceyogurt.com</a></li>
                  <li>Contact form: <Link href="/contact" className="text-[#d4af37] hover:underline">Contact page</Link></li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Third-Party Content</h2>
                <p className="text-neutral-600">
                  While we strive to ensure accessibility of all content on our website, some 
                  third-party content or functionality may not be fully accessible. We are 
                  working with our partners to address any accessibility issues.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Continuous Improvement</h2>
                <p className="text-neutral-600">
                  We are committed to ongoing accessibility improvements. Our team regularly 
                  reviews and updates our website to ensure we meet or exceed accessibility 
                  standards. Thank you for helping us make Essence Yogurt accessible to everyone.
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
