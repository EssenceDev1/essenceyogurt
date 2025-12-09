import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { EYButton } from "@/components/ui/ey-button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, MapPin, TrendingUp, DollarSign } from "lucide-react";

interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  createdAt: string;
}

interface EssenceUnit {
  id: string;
  code: string;
  name: string;
  country: string;
  city: string;
}

export default function AdminDashboard() {
  const { data: inquiries } = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      return res.json() as Promise<{ inquiries: ContactInquiry[] }>;
    },
  });

  const { data: units } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const res = await fetch("/api/essence-units");
      return res.json() as Promise<{ units: EssenceUnit[] }>;
    },
  });

  const revenueData = [
    { month: "Jan", revenue: 45000, target: 50000 },
    { month: "Feb", revenue: 52000, target: 50000 },
    { month: "Mar", revenue: 48000, target: 50000 },
    { month: "Apr", revenue: 61000, target: 60000 },
    { month: "May", revenue: 65000, target: 60000 },
  ];

  const locationData = [
    { name: "Riyadh Airport", value: 40 },
    { name: "Dubai Mall", value: 30 },
    { name: "London Airport", value: 20 },
    { name: "Sydney Mall", value: 10 },
  ];

  const colors = ["#D4AF37", "#FFF8E7", "#2C2C2C", "#888"];

  return (
    <div className="min-h-screen bg-background font-sans">
      <MainNav />
      
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display mb-2">Admin Dashboard</h1>
          <p className="text-neutral-500">Platform Operations & Analytics</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Users, label: "Partner Inquiries", value: inquiries?.inquiries.length || 0 },
              { icon: MapPin, label: "Active Units", value: units?.units.length || 0 },
              { icon: TrendingUp, label: "YTD Revenue", value: "$312K", color: "text-gold-metallic" },
              { icon: DollarSign, label: "Avg Unit Revenue", value: "$65K", color: "text-gold-metallic" }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 shadow-sm"
                  data-testid={`kpi-card-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-neutral-500 text-sm mb-1">{card.label}</p>
                      <p className={`text-3xl font-display font-bold ${card.color || ""}`}>{card.value}</p>
                    </div>
                    <Icon className="w-12 h-12 text-neutral-200" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Revenue Chart */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm"
              data-testid="revenue-chart"
            >
              <h3 className="text-xl font-display font-bold mb-6">Monthly Revenue Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} name="Actual Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#CCC" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Location Distribution */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm"
              data-testid="location-chart"
            >
              <h3 className="text-xl font-display font-bold mb-6">Revenue by Location</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={locationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Recent Inquiries */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm"
            data-testid="inquiries-table"
          >
            <h3 className="text-xl font-display font-bold mb-6">Recent Partner Inquiries</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries?.inquiries.slice(0, 5).map((inquiry, i) => (
                    <tr key={inquiry.id} className="border-b border-neutral-50 hover:bg-neutral-50" data-testid={`inquiry-row-${i}`}>
                      <td className="py-4 px-4">{inquiry.fullName}</td>
                      <td className="py-4 px-4 text-neutral-600">{inquiry.email}</td>
                      <td className="py-4 px-4 text-neutral-600">{inquiry.subject}</td>
                      <td className="py-4 px-4 text-neutral-600 text-sm">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
