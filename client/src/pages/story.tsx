import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import storeInteriorImage from "@assets/generated_images/franchise_store_interior.png";
import productShowcaseImage from "@assets/image_1764627488408.jpeg";

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-neutral-200 mt-8">
          <div className="mx-auto max-w-6xl px-6 md:px-8 py-10 md:py-14 grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-4 md:pl-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                Our Story
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Welcome to Essence Yogurt
              </h1>
              <p className="text-sm text-neutral-600">
                At Essence Yogurt, we believe that indulgence can be both luxurious and healthy. 
                Our mission is simple: to offer premium soft-serve yogurt, crafted from the finest 
                ingredients, in a way that feels fun, stylish, and guilt-free.
              </p>
              <p className="text-sm text-neutral-600">
                Essence Yogurt isn't just about dessert — it's about creating moments of joy and 
                indulgence that leave a lasting impression.
              </p>
            </div>
            <div>
              <img 
                src={storeInteriorImage} 
                alt="Essence Yogurt Store Interior" 
                className="w-full rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Where It All Began */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Where It All Began
            </h2>
            <div className="max-w-3xl">
              <p className="text-sm text-neutral-600 mb-4">
                The idea for Essence Yogurt was born from a simple realization: there's a gap in the 
                market for a luxury frozen yogurt experience that combines health, flavor, and style.
              </p>
              <p className="text-sm text-neutral-600">
                We set out to reinvent the soft-serve experience by blending high-end aesthetics with 
                innovative flavours like Pistachio Delight, Açaí Power Bowl, and Cookies & Cream — all 
                while using natural, premium ingredients that you can feel good about.
              </p>
            </div>
          </div>
        </section>

        {/* Why Essence */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Why Essence?
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-3xl">
              The word "Essence" represents what makes our brand unique. It's the core of what we stand for:
            </p>
            <div className="grid gap-6 md:grid-cols-3 text-xs">
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-semibold mb-2">Essence of Luxury</h3>
                <p className="text-neutral-600">
                  We bring a touch of elegance to every yogurt cup. Our spaces and products 
                  are designed for those who appreciate the finer things.
                </p>
              </div>
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-semibold mb-2">Essence of Health</h3>
                <p className="text-neutral-600">
                  We use high-quality, natural ingredients with no compromises. 
                  Every serve is crafted to be delicious and wholesome.
                </p>
              </div>
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-semibold mb-2">Essence of Fun</h3>
                <p className="text-neutral-600">
                  Our self-serve model lets you get creative and build your perfect yogurt. 
                  Every visit is a unique creation.
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-6 max-w-3xl">
              Our yogurt is more than a treat — it's a lifestyle choice for those who value quality, 
              taste, and experience.
            </p>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              What Makes Us Different
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-3xl">
              At Essence Yogurt, we don't settle for ordinary. Here's what sets us apart:
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="font-semibold mb-2">Unique Flavours</h3>
                <p className="text-neutral-600">
                  From tropical fruits like mango and açaí to classics like vanilla and chocolate, 
                  we've crafted flavours that feel premium and taste unforgettable.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="font-semibold mb-2">Premium Ingredients</h3>
                <p className="text-neutral-600">
                  Only the best ingredients go into our yogurt, ensuring every bite is 
                  delicious and wholesome.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="font-semibold mb-2">Stylish Experience</h3>
                <p className="text-neutral-600">
                  Our locations are designed for modern aesthetics, making every visit 
                  feel like a special occasion.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="font-semibold mb-2">Loyalty Program</h3>
                <p className="text-neutral-600">
                  Members can join our Essence Circle loyalty program to earn 
                  points and track their visits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
                  The Essence Experience
                </h2>
                <p className="text-sm text-neutral-600 mb-4">
                  From our signature multi-swirl creations to healthy toppings like fresh blueberries 
                  and granola, every cup is a work of art.
                </p>
                <p className="text-sm text-neutral-600">
                  Our branded cups, premium spoons, and attention to detail ensure you're not just 
                  enjoying frozen yogurt — you're experiencing luxury.
                </p>
              </div>
              <div>
                <img 
                  src={productShowcaseImage} 
                  alt="Essence Yogurt™ Product Showcase - Signature cups and creations" 
                  className="w-full rounded-3xl shadow-lg"
                  data-testid="product-showcase-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Leadership
            </h2>
            <p className="text-sm text-neutral-600 mb-8 max-w-3xl">
              Essence Yogurt is led by a team of passionate entrepreneurs dedicated to bringing 
              luxury frozen yogurt to the world's most prestigious locations.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-600 flex items-center justify-center text-white text-2xl font-semibold">
                  EY
                </div>
                <h3 className="font-semibold text-sm mb-1">Executive Team</h3>
                <p className="text-[10px] uppercase tracking-wide text-[#d4af37] mb-3">Board of Directors</p>
                <p className="text-xs text-neutral-500">
                  Our leadership team brings decades of combined experience in hospitality, 
                  franchise development, and premium food service operations.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 flex items-center justify-center text-white text-2xl font-semibold">
                  GO
                </div>
                <h3 className="font-semibold text-sm mb-1">Global Operations</h3>
                <p className="text-[10px] uppercase tracking-wide text-[#d4af37] mb-3">Regional Directors</p>
                <p className="text-xs text-neutral-500">
                  Expert regional directors overseeing operations across Saudi Arabia, UAE, 
                  Greece, Israel, and Australia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-8">
              Our Journey
            </h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37] to-[#d4af37]/20"></div>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wide mb-2">2023</span>
                    <h3 className="font-semibold text-sm">Vision & Concept</h3>
                    <p className="text-xs text-neutral-500 mt-1">Initial concept development for a luxury self-serve frozen yogurt brand targeting premium locations.</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#d4af37] border-4 border-white shadow-md hidden md:block"></div>
                  <div className="md:w-1/2"></div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/2"></div>
                  <div className="w-3 h-3 rounded-full bg-[#d4af37] border-4 border-white shadow-md hidden md:block"></div>
                  <div className="md:w-1/2 md:pl-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wide mb-2">2024</span>
                    <h3 className="font-semibold text-sm">Brand Development</h3>
                    <p className="text-xs text-neutral-500 mt-1">Complete brand identity, flavour R&D, and technology platform development. Partnership agreements secured.</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wide mb-2">2025</span>
                    <h3 className="font-semibold text-sm">Global Launch</h3>
                    <p className="text-xs text-neutral-500 mt-1">Flagship locations opening in Dubai, Riyadh, and Tel Aviv. Airport and mall partnerships activated.</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#d4af37] border-4 border-white shadow-md hidden md:block"></div>
                  <div className="md:w-1/2"></div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/2"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-300 border-4 border-white shadow-md hidden md:block"></div>
                  <div className="md:w-1/2 md:pl-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-semibold uppercase tracking-wide mb-2">2026</span>
                    <h3 className="font-semibold text-sm">Expansion</h3>
                    <p className="text-xs text-neutral-500 mt-1">European expansion with Athens and London locations. 50+ global franchise partners targeted.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Sustainability Commitment
            </h2>
            <p className="text-sm text-neutral-600 mb-8 max-w-3xl">
              At Essence Yogurt, luxury and responsibility go hand in hand. We're committed to 
              sustainable practices that protect our planet while delivering exceptional experiences.
            </p>
            <div className="grid gap-4 md:grid-cols-4 text-xs">
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl">
                  🌱
                </div>
                <h3 className="font-semibold mb-2">Eco-Friendly Packaging</h3>
                <p className="text-neutral-500">
                  100% biodegradable cups, spoons, and packaging materials.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                  💧
                </div>
                <h3 className="font-semibold mb-2">Water Conservation</h3>
                <p className="text-neutral-500">
                  Advanced cleaning systems reducing water usage by 40%.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-xl">
                  ⚡
                </div>
                <h3 className="font-semibold mb-2">Energy Efficient</h3>
                <p className="text-neutral-500">
                  Energy-efficient equipment and LED lighting in all locations.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 text-xl">
                  🤝
                </div>
                <h3 className="font-semibold mb-2">Local Sourcing</h3>
                <p className="text-neutral-500">
                  Partnering with local suppliers to reduce carbon footprint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-6">
              Our Vision: The Future of Yogurt
            </h2>
            <div className="max-w-3xl">
              <p className="text-sm text-neutral-600">
                We don't just want to serve yogurt — we want to redefine the way people experience it. 
                Our vision is to create luxurious, modern dessert destinations around the world, 
                starting with Dubai and expanding to premium locations across the globe.
              </p>
            </div>
          </div>
        </section>

        {/* Join the Journey */}
        <section className="bg-neutral-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join the Essence Journey</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-6">
              Whether you're visiting our store, sharing your experience on social media, 
              or joining our Essence Rewards Loyalty Program, we're excited to welcome you 
              into the Essence family.
            </p>
            <p className="text-lg text-neutral-300 italic">
              Because at Essence Yogurt, every cup is an experience.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
