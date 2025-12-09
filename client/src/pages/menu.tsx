import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import menuImage from "@assets/generated_images/macro_yogurt_toppings.png";

interface Flavor {
  id: string;
  name: string;
  description: string;
  type: string;
}

interface Topping {
  id: string;
  name: string;
}

export default function Menu() {
  const { data: flavorsData, isLoading: flavorsLoading } = useQuery({
    queryKey: ["flavors"],
    queryFn: async () => {
      const response = await fetch("/api/flavors");
      if (!response.ok) throw new Error("Failed to fetch flavors");
      return response.json() as Promise<{ flavors: Flavor[] }>;
    },
  });

  const { data: toppingsData, isLoading: toppingsLoading } = useQuery({
    queryKey: ["toppings"],
    queryFn: async () => {
      const response = await fetch("/api/toppings");
      if (!response.ok) throw new Error("Failed to fetch toppings");
      return response.json() as Promise<{ toppings: Topping[] }>;
    },
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <MainNav />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <span className="text-gold-metallic font-medium tracking-widest uppercase text-sm mb-4 block">
            The Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-medium text-foreground mb-6">
            Flavors & <span className="text-gold-gradient">Essence</span>
          </h1>
        </div>
      </section>

      {/* Main Visual */}
      <section className="w-full h-[50vh] overflow-hidden relative">
        <img src={menuImage} className="w-full h-full object-cover" alt="Menu Detail" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </section>

      {/* Menu Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Flavors */}
          <div className="mb-20">
            <h2 className="text-3xl font-display mb-12 text-center">Signature Flavors</h2>
            {flavorsLoading ? (
              <div className="text-center text-neutral-400">Loading flavors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {flavorsData?.flavors.map((flavor, i) => (
                  <motion.div 
                    key={flavor.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[24px] bg-white border border-neutral-100 hover:shadow-luxury transition-all"
                    data-testid={`flavor-item-${i}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-display font-bold">{flavor.name}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-metallic bg-gold-start/10 px-2 py-1 rounded-full">
                        {flavor.type}
                      </span>
                    </div>
                    <p className="text-neutral-500">{flavor.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Toppings */}
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl font-display mb-12">The Topping Bar</h2>
             {toppingsLoading ? (
               <div className="text-neutral-400">Loading toppings...</div>
             ) : (
               <div className="flex flex-wrap justify-center gap-4">
                 {toppingsData?.toppings.map((topping, i) => (
                   <span 
                     key={topping.id} 
                     className="px-6 py-3 rounded-full border border-neutral-200 text-neutral-600 hover:border-gold-metallic hover:text-gold-metallic transition-colors"
                     data-testid={`topping-item-${i}`}
                   >
                     {topping.name}
                   </span>
                 ))}
               </div>
             )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
