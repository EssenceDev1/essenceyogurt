import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Users,
  DollarSign,
  Package,
  Shield,
  Heart,
  Wrench,
  TrendingUp,
  Globe,
  Languages,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Send,
  Sparkles,
  Building2,
  MapPin,
  ThermometerSun,
  Scale,
  Bot,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { LuxeCard, LuxeStatCard, LuxeDepartmentCard, LuxeAlertCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeInput, LuxeSearch } from "@/components/ui/luxe-input";
import { LuxeScrollPicker, CountryPicker, LanguagePicker, LuxeDatePicker, COUNTRIES, LANGUAGES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeAvatar, LuxeProgress } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalUnits: number;
  activeAlerts: number;
  todayRevenue: string;
  staffOnDuty: number;
  healthScore: {
    overall: number;
    cleaning: number;
    foodSafety: number;
    inventory: number;
    theft: number;
    staff: number;
    equipment: number;
  };
  countriesOperating: number;
  transactionsToday: number;
}

interface Department {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "healthy" | "warning" | "critical" | "offline";
  stats: { label: string; value: string | number }[];
  route: string;
}

const departments: Department[] = [
  {
    id: "hr",
    name: "HR Command",
    description: "Employee management, shifts & scheduling",
    icon: Users,
    status: "healthy",
    stats: [
      { label: "Staff", value: 124 },
      { label: "On Duty", value: 32 },
      { label: "Leave", value: 3 },
    ],
    route: "/hr",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Transactions, revenue & multi-currency",
    icon: DollarSign,
    status: "healthy",
    stats: [
      { label: "Today", value: "$12.4K" },
      { label: "MTD", value: "$284K" },
      { label: "Pending", value: 5 },
    ],
    route: "/finance",
  },
  {
    id: "inventory",
    name: "Supply Chain",
    description: "Stock, ordering & receiving",
    icon: Package,
    status: "warning",
    stats: [
      { label: "Items", value: 847 },
      { label: "Low Stock", value: 12 },
      { label: "Orders", value: 8 },
    ],
    route: "/stock-control",
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Food safety, HACCP & certifications",
    icon: Shield,
    status: "healthy",
    stats: [
      { label: "Score", value: "98%" },
      { label: "Tasks", value: 4 },
      { label: "Alerts", value: 0 },
    ],
    route: "/compliance",
  },
  {
    id: "customer",
    name: "Customer Relations",
    description: "VIP management & loyalty program",
    icon: Heart,
    status: "healthy",
    stats: [
      { label: "VIPs", value: "2.4K" },
      { label: "Active", value: 892 },
      { label: "Tickets", value: 7 },
    ],
    route: "/loyalty",
  },
  {
    id: "maintenance",
    name: "Equipment",
    description: "Kiosk health & maintenance",
    icon: Wrench,
    status: "healthy",
    stats: [
      { label: "Units", value: 24 },
      { label: "Tasks", value: 3 },
      { label: "Pending", value: 1 },
    ],
    route: "/maintenance",
  },
];

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("SA");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/octopus-brain/dashboard-stats"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/octopus-brain/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
    },
  });

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [...prev, { role: "user", content: chatMessage }]);
    chatMutation.mutate(chatMessage);
    setChatMessage("");
  };

  const healthScore = stats?.healthScore || {
    overall: 94,
    cleaning: 96,
    foodSafety: 98,
    inventory: 89,
    theft: 95,
    staff: 92,
    equipment: 97,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "operations", label: "Operations", icon: Zap },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "ai-brain", label: "AI Brain", icon: Brain, badge: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-[#d4af37]/5">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c5a059] flex items-center justify-center shadow-lg shadow-[#d4af37]/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Essence Command Center
                </h1>
                <p className="text-sm text-neutral-500">Global Operations Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-48">
                <CountryPicker
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="Select Country"
                  data-testid="country-picker"
                />
              </div>
              <div className="w-44">
                <LanguagePicker
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  placeholder="Language"
                  data-testid="language-picker"
                />
              </div>
              <LuxeIconButton
                icon={RefreshCw}
                onClick={() => refetchStats()}
                data-testid="refresh-btn"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <LuxeTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="pills"
              data-testid="main-tabs"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard
                  title="Global Units"
                  value={stats?.totalUnits || 24}
                  change="+2 this month"
                  changeType="positive"
                  icon={Building2}
                  data-testid="stat-units"
                />
                <LuxeStatCard
                  title="Today's Revenue"
                  value={stats?.todayRevenue || "$12,847"}
                  change="+18% vs yesterday"
                  changeType="positive"
                  icon={DollarSign}
                  data-testid="stat-revenue"
                />
                <LuxeStatCard
                  title="Staff on Duty"
                  value={stats?.staffOnDuty || 32}
                  change="Full coverage"
                  changeType="neutral"
                  icon={Users}
                  data-testid="stat-staff"
                />
                <LuxeStatCard
                  title="Active Alerts"
                  value={stats?.activeAlerts || 3}
                  change={stats?.activeAlerts === 0 ? "All clear" : "Needs attention"}
                  changeType={stats?.activeAlerts === 0 ? "positive" : "negative"}
                  icon={AlertTriangle}
                  data-testid="stat-alerts"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-neutral-900">Department Status</h2>
                        <p className="text-sm text-neutral-500">All systems operational</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-emerald-600">Live</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departments.map((dept) => (
                        <LuxeDepartmentCard
                          key={dept.id}
                          title={dept.name}
                          description={dept.description}
                          icon={dept.icon}
                          stats={dept.stats}
                          status={dept.status}
                          data-testid={`dept-${dept.id}`}
                        />
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gold" glow className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a059] flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900">Health Score</h3>
                        <p className="text-xs text-neutral-500">Real-time assessment</p>
                      </div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <motion.div
                        className="relative inline-flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <svg className="w-32 h-32 -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="#e5e5e5"
                            strokeWidth="12"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="url(#goldGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{
                              strokeDasharray: `${(healthScore.overall / 100) * 352} 352`,
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#d4af37" />
                              <stop offset="100%" stopColor="#c5a059" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-3xl font-bold text-neutral-900">
                          {healthScore.overall}%
                        </span>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Cleaning", value: healthScore.cleaning },
                        { label: "Food Safety", value: healthScore.foodSafety },
                        { label: "Inventory", value: healthScore.inventory },
                        { label: "Security", value: healthScore.theft },
                        { label: "Equipment", value: healthScore.equipment },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neutral-600">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <LuxeProgress value={item.value} size="sm" />
                            <span className="text-xs font-bold text-neutral-900 w-10 text-right">
                              {item.value}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Recent Alerts</h3>
                    <div className="space-y-3">
                      <LuxeAlertCard
                        title="Low Stock Alert"
                        message="Strawberries running low at Dubai Mall"
                        severity="warning"
                        timestamp="10 minutes ago"
                        data-testid="alert-1"
                      />
                      <LuxeAlertCard
                        title="Temperature Alert"
                        message="Unit SA-003 freezer above range"
                        severity="critical"
                        timestamp="25 minutes ago"
                        data-testid="alert-2"
                      />
                      <LuxeAlertCard
                        title="Shift Completed"
                        message="Morning shift at Riyadh Airport ended"
                        severity="success"
                        timestamp="1 hour ago"
                        data-testid="alert-3"
                      />
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "operations" && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LuxeCard variant="default" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <LuxeButton icon={Users} variant="outline" fullWidth>
                      View Staff
                    </LuxeButton>
                    <LuxeButton icon={Package} variant="outline" fullWidth>
                      Check Inventory
                    </LuxeButton>
                    <LuxeButton icon={AlertTriangle} variant="outline" fullWidth>
                      View Alerts
                    </LuxeButton>
                    <LuxeButton icon={BarChart3} variant="outline" fullWidth>
                      Reports
                    </LuxeButton>
                  </div>
                </LuxeCard>

                <LuxeCard variant="default" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Date Selection</h3>
                  <LuxeDatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    label="Select Report Date"
                    data-testid="date-picker"
                  />
                </LuxeCard>
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Global Unit Status</h3>
                <LuxeTable
                  columns={[
                    {
                      key: "unit",
                      header: "Unit",
                      render: (row) => (
                        <div className="flex items-center gap-3">
                          <LuxeAvatar name={row.name} size="sm" status={row.status === "online" ? "online" : "offline"} />
                          <div>
                            <p className="font-medium text-neutral-900">{row.name}</p>
                            <p className="text-xs text-neutral-500">{row.location}</p>
                          </div>
                        </div>
                      ),
                    },
                    { key: "country", header: "Country", render: (row) => <span>{COUNTRIES.find(c => c.value === row.country)?.icon} {row.country}</span> },
                    { key: "revenue", header: "Today's Revenue", align: "right" as const },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge variant={row.status === "online" ? "success" : "danger"} dot>
                          {row.status}
                        </LuxeBadge>
                      ),
                    },
                  ]}
                  data={[
                    { name: "Riyadh Airport T1", location: "Terminal 1, Gate 12", country: "SA", revenue: "$2,847", status: "online" },
                    { name: "Dubai Mall", location: "Ground Floor, Fashion Ave", country: "AE", revenue: "$4,123", status: "online" },
                    { name: "Tel Aviv Beach", location: "Gordon Beach Promenade", country: "IL", revenue: "$1,892", status: "online" },
                    { name: "Athens Airport", location: "Terminal A, Departures", country: "GR", revenue: "$987", status: "offline" },
                  ]}
                  data-testid="units-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-bold text-neutral-900">Revenue Trend</h3>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-4xl font-bold text-neutral-900">$284K</p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">+23% vs last month</p>
                  </div>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-bold text-neutral-900">Global Reach</h3>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-4xl font-bold text-neutral-900">4</p>
                    <p className="text-sm text-neutral-500 mt-1">Countries Operating</p>
                  </div>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Languages className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-bold text-neutral-900">Languages</h3>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-4xl font-bold text-neutral-900">9</p>
                    <p className="text-sm text-neutral-500 mt-1">Supported Languages</p>
                  </div>
                </LuxeCard>
              </div>
            </motion.div>
          )}

          {activeTab === "ai-brain" && (
            <motion.div
              key="ai-brain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LuxeCard variant="dark" className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a059] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Octopus Brain AI</h3>
                      <p className="text-xs text-neutral-400">Powered by Gemini</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-emerald-400">Active</span>
                    </div>
                  </div>

                  <div className="h-80 overflow-y-auto mb-4 space-y-4 p-4 bg-neutral-800/50 rounded-2xl">
                    {chatHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Sparkles className="w-12 h-12 text-[#d4af37] mb-4" />
                        <p className="text-white font-medium mb-2">Welcome to Octopus Brain</p>
                        <p className="text-sm text-neutral-400 max-w-xs">
                          Ask me anything about your operations, inventory, staff, or compliance status.
                        </p>
                      </div>
                    ) : (
                      chatHistory.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "max-w-[85%] p-3 rounded-2xl text-sm",
                            msg.role === "user"
                              ? "ml-auto bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-white"
                              : "bg-neutral-700 text-white"
                          )}
                        >
                          {msg.content}
                        </motion.div>
                      ))
                    )}
                    {chatMutation.isPending && (
                      <div className="flex items-center gap-2 text-neutral-400">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <LuxeInput
                      placeholder="Ask the Octopus Brain..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      className="flex-1"
                      data-testid="ai-chat-input"
                    />
                    <LuxeButton
                      icon={Send}
                      variant="gold"
                      onClick={handleSendChat}
                      loading={chatMutation.isPending}
                      data-testid="ai-chat-send"
                    />
                  </div>
                </LuxeCard>

                <div className="space-y-6">
                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">AI Monitoring</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Languages className="w-5 h-5 text-[#d4af37]" />
                          <div>
                            <p className="font-medium text-neutral-900">Translation Quality</p>
                            <p className="text-xs text-neutral-500">9 languages monitored</p>
                          </div>
                        </div>
                        <LuxeBadge variant="success">98.5%</LuxeBadge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Scale className="w-5 h-5 text-[#d4af37]" />
                          <div>
                            <p className="font-medium text-neutral-900">Transaction Monitoring</p>
                            <p className="text-xs text-neutral-500">847 transactions today</p>
                          </div>
                        </div>
                        <LuxeBadge variant="success">Normal</LuxeBadge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <ThermometerSun className="w-5 h-5 text-[#d4af37]" />
                          <div>
                            <p className="font-medium text-neutral-900">Food Safety Alerts</p>
                            <p className="text-xs text-neutral-500">Real-time temperature monitoring</p>
                          </div>
                        </div>
                        <LuxeBadge variant="warning">1 Alert</LuxeBadge>
                      </div>
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Quick Insights</h3>
                    <div className="space-y-3 text-sm">
                      <p className="text-neutral-600">
                        <span className="text-[#d4af37] font-medium">Peak Hours:</span> 2PM - 4PM across all units
                      </p>
                      <p className="text-neutral-600">
                        <span className="text-[#d4af37] font-medium">Top Flavor:</span> Mango Paradise (32% of sales)
                      </p>
                      <p className="text-neutral-600">
                        <span className="text-[#d4af37] font-medium">Recommendation:</span> Increase strawberry stock at Dubai Mall
                      </p>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-neutral-200 bg-white/50 mt-12">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              Essence Yogurt™ Global Command Center • Powered by Octopus Brain AI
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-neutral-400">
                Last sync: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
