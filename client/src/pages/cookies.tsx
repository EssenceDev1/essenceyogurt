import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function CookiesPage() {
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
              Cookie Policy
            </h1>
            <p className="text-sm text-neutral-500">Last updated: January 2025</p>
          </div>
        </section>

        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="prose prose-neutral max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">What Are Cookies?</h2>
                <p className="text-neutral-600">
                  Cookies are small text files stored on your device when you visit our website. 
                  They help us provide a better experience by remembering your preferences and 
                  understanding how you use our site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-sm text-neutral-600">
                      Required for the website to function properly. These cannot be disabled. 
                      They enable core functionality such as security, session management, and 
                      accessibility features.
                    </p>
                  </div>
                  
                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="font-semibold mb-2">Functional Cookies</h3>
                    <p className="text-sm text-neutral-600">
                      Remember your preferences such as language, location, and previously 
                      viewed products. These enhance your experience but are not essential.
                    </p>
                  </div>
                  
                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-neutral-600">
                      Help us understand how visitors interact with our website by collecting 
                      anonymous information about pages visited, time spent, and navigation patterns.
                    </p>
                  </div>
                  
                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <h3 className="font-semibold mb-2">Marketing Cookies</h3>
                    <p className="text-sm text-neutral-600">
                      Used to deliver relevant advertisements and measure the effectiveness of 
                      our marketing campaigns. These may be set by our advertising partners.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
                <p className="text-neutral-600 mb-3">
                  You can control and manage cookies through your browser settings. Please note 
                  that disabling certain cookies may affect website functionality.
                </p>
                <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                  <li>Chrome: Settings → Privacy and Security → Cookies</li>
                  <li>Firefox: Options → Privacy & Security → Cookies</li>
                  <li>Safari: Preferences → Privacy → Cookies</li>
                  <li>Edge: Settings → Cookies and Site Permissions</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p className="text-neutral-600">
                  For questions about our use of cookies, please contact us at{" "}
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
