import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Users,
  Crown,
  Gift,
  MessageSquare,
  Star,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Send,
  Sparkles,
  Award,
  Zap,
  Ticket,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { Link } from "wouter";
import { LuxeCard, LuxeStatCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeSearch } from "@/components/ui/luxe-input";
import { CountryPicker, COUNTRIES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeProgress, LuxeAvatar } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";

interface VIPCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  totalSpent: number;
  visits: number;
  joinDate: Date;
  lastVisit: Date;
  country: string;
  favoriteFlavor: string;
}

interface SupportTicket {
  id: string;
  customer: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  assignee: string;
}

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  currency: string;
  balance: number;
  purchaser: string;
  recipient: string;
  status: "active" | "redeemed" | "expired";
  expiryDate: Date;
}

const tierColors: Record<string, { bg: string; text: string; icon: string }> = {
  bronze: { bg: "bg-amber-100", text: "text-amber-700", icon: "text-amber-500" },
  silver: { bg: "bg-neutral-100", text: "text-neutral-700", icon: "text-neutral-400" },
  gold: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-500" },
  platinum: { bg: "bg-purple-100", text: "text-purple-700", icon: "text-purple-500" },
};

const priorityColors: Record<string, string> = {
  low: "bg-neutral-100 text-neutral-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
};

const mockCustomers: VIPCustomer[] = [
  { id: "1", name: "Princess Fatima Al-Saud", email: "fatima@example.com", phone: "+966 50 123 4567", tier: "platinum", points: 12450, totalSpent: 8750, visits: 156, joinDate: new Date("2024-01-15"), lastVisit: new Date(Date.now() - 86400000), country: "SA", favoriteFlavor: "Vanilla Paradise" },
  { id: "2", name: "Sheikh Mohammed bin Rashid", email: "mohammed@example.com", phone: "+971 50 987 6543", tier: "platinum", points: 9870, totalSpent: 6920, visits: 98, joinDate: new Date("2024-03-20"), lastVisit: new Date(Date.now() - 86400000 * 3), country: "AE", favoriteFlavor: "Mango Bliss" },
  { id: "3", name: "Sarah Goldman", email: "sarah@example.com", phone: "+972 52 555 1234", tier: "gold", points: 5640, totalSpent: 3950, visits: 67, joinDate: new Date("2024-02-10"), lastVisit: new Date(Date.now() - 86400000 * 2), country: "IL", favoriteFlavor: "Berry Explosion" },
  { id: "4", name: "Elena Papadopoulos", email: "elena@example.com", phone: "+30 694 123 4567", tier: "gold", points: 4320, totalSpent: 3025, visits: 52, joinDate: new Date("2024-04-05"), lastVisit: new Date(Date.now() - 86400000 * 5), country: "GR", favoriteFlavor: "Greek Yogurt Classic" },
  { id: "5", name: "Ahmed Al-Rashid", email: "ahmed@example.com", phone: "+966 55 111 2222", tier: "silver", points: 2890, totalSpent: 2025, visits: 34, joinDate: new Date("2024-05-01"), lastVisit: new Date(Date.now() - 86400000 * 7), country: "SA", favoriteFlavor: "Caramel Dream" },
  { id: "6", name: "Leila Habibi", email: "leila@example.com", phone: "+971 52 333 4444", tier: "bronze", points: 1250, totalSpent: 875, visits: 15, joinDate: new Date("2024-08-15"), lastVisit: new Date(Date.now() - 86400000 * 10), country: "AE", favoriteFlavor: "Strawberry Delight" },
];

const mockTickets: SupportTicket[] = [
  { id: "TKT-001", customer: "Princess Fatima Al-Saud", subject: "VIP Lounge Access Request", category: "VIP Services", priority: "high", status: "open", createdAt: new Date(Date.now() - 3600000), assignee: "Maria Santos" },
  { id: "TKT-002", customer: "Ahmed Al-Rashid", subject: "Points Not Credited", category: "Loyalty", priority: "medium", status: "in_progress", createdAt: new Date(Date.now() - 86400000), assignee: "Sarah Chen" },
  { id: "TKT-003", customer: "Sarah Goldman", subject: "Gift Card Balance Issue", category: "E-Gift", priority: "low", status: "resolved", createdAt: new Date(Date.now() - 86400000 * 2), assignee: "Yuki Tanaka" },
  { id: "TKT-004", customer: "Elena Papadopoulos", subject: "Allergic Reaction Concern", category: "Food Safety", priority: "urgent", status: "open", createdAt: new Date(Date.now() - 1800000), assignee: "Ahmed Al-Rashid" },
];

const mockGiftCards: GiftCard[] = [
  { id: "GC-001", code: "ESSENCE-GOLD-2024", amount: 50, currency: "USD", balance: 35, purchaser: "Sheikh Mohammed", recipient: "Friend", status: "active", expiryDate: new Date("2025-12-31") },
  { id: "GC-002", code: "ESSENCE-PLAT-VIP", amount: 100, currency: "USD", balance: 0, purchaser: "Princess Fatima", recipient: "Family", status: "redeemed", expiryDate: new Date("2025-06-30") },
  { id: "GC-003", code: "ESSENCE-BDAY-2024", amount: 30, currency: "USD", balance: 30, purchaser: "Sarah Goldman", recipient: "Colleague", status: "active", expiryDate: new Date("2025-03-15") },
];

export default function CustomerCommand() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<VIPCustomer | null>(null);

  const stats = {
    totalVIPs: mockCustomers.length,
    platinumMembers: mockCustomers.filter((c) => c.tier === "platinum").length,
    openTickets: mockTickets.filter((t) => t.status === "open").length,
    activeGiftCards: mockGiftCards.filter((g) => g.status === "active").length,
    totalPoints: mockCustomers.reduce((sum, c) => sum + c.points, 0),
    avgSatisfaction: 4.8,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Heart },
    { id: "vip", label: "VIP Members", icon: Crown },
    { id: "loyalty", label: "Loyalty", icon: Star },
    { id: "support", label: "Support", icon: MessageSquare, badge: stats.openTickets },
    { id: "gifts", label: "E-Gifts", icon: Gift },
    { id: "feedback", label: "Feedback", icon: ThumbsUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = !searchQuery || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || customer.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-pink-50/30">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/command-center">
              <LuxeIconButton icon={ArrowLeft} data-testid="back-btn" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Customer Relations
                </h1>
                <p className="text-sm text-neutral-500">VIP & Loyalty Management</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <LuxeButton icon={UserPlus} variant="gold" data-testid="btn-add-vip">
                Add VIP
              </LuxeButton>
              <LuxeIconButton icon={RefreshCw} data-testid="btn-refresh" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <LuxeTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
              data-testid="customer-tabs"
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
                  title="Total VIPs"
                  value={stats.totalVIPs.toLocaleString()}
                  change="+124 this month"
                  changeType="positive"
                  icon={Users}
                  data-testid="stat-vips"
                />
                <LuxeStatCard
                  title="Platinum Members"
                  value={stats.platinumMembers}
                  change="Top tier"
                  changeType="positive"
                  icon={Crown}
                  data-testid="stat-platinum"
                />
                <LuxeStatCard
                  title="Open Tickets"
                  value={stats.openTickets}
                  change="Need response"
                  changeType={stats.openTickets > 0 ? "negative" : "positive"}
                  icon={MessageSquare}
                  data-testid="stat-tickets"
                />
                <LuxeStatCard
                  title="Satisfaction"
                  value={`${stats.avgSatisfaction}/5`}
                  change="Excellent"
                  changeType="positive"
                  icon={Star}
                  data-testid="stat-satisfaction"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Top VIP Members</h3>
                      <LuxeButton variant="outline" size="sm" icon={Crown} data-testid="btn-view-all-vips">
                        View All
                      </LuxeButton>
                    </div>
                    <div className="space-y-3">
                      {mockCustomers.slice(0, 4).map((customer, idx) => (
                        <motion.div
                          key={customer.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedCustomer(customer)}
                          data-testid={`vip-${customer.id}`}
                        >
                          <div className="relative">
                            <LuxeAvatar name={customer.name} size="md" />
                            <Crown className={cn("absolute -bottom-1 -right-1 w-4 h-4", tierColors[customer.tier].icon)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{customer.name}</p>
                            <p className="text-sm text-neutral-500">{customer.visits} visits • {COUNTRIES.find(c => c.value === customer.country)?.icon}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-900">{customer.points.toLocaleString()} pts</p>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", tierColors[customer.tier].bg, tierColors[customer.tier].text)}>
                              {customer.tier}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Open Support Tickets</h3>
                      <LuxeBadge variant={stats.openTickets > 0 ? "danger" : "success"} dot>
                        {stats.openTickets} Active
                      </LuxeBadge>
                    </div>
                    <div className="space-y-3">
                      {mockTickets.filter((t) => t.status === "open" || t.status === "in_progress").map((ticket) => (
                        <div key={ticket.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            ticket.priority === "urgent" ? "bg-red-100 text-red-600" :
                            ticket.priority === "high" ? "bg-amber-100 text-amber-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{ticket.subject}</p>
                            <p className="text-sm text-neutral-500">{ticket.customer} • {ticket.category}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", priorityColors[ticket.priority])}>
                              {ticket.priority}
                            </span>
                            <p className="text-xs text-neutral-500 mt-1">
                              {Math.floor((Date.now() - ticket.createdAt.getTime()) / 3600000)}h ago
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gold" glow className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Loyalty Tiers</h3>
                    <div className="space-y-4">
                      {[
                        { tier: "platinum", count: mockCustomers.filter((c) => c.tier === "platinum").length, threshold: "10,000+ pts" },
                        { tier: "gold", count: mockCustomers.filter((c) => c.tier === "gold").length, threshold: "5,000+ pts" },
                        { tier: "silver", count: mockCustomers.filter((c) => c.tier === "silver").length, threshold: "2,000+ pts" },
                        { tier: "bronze", count: mockCustomers.filter((c) => c.tier === "bronze").length, threshold: "0+ pts" },
                      ].map((item) => (
                        <div key={item.tier} className="flex items-center justify-between p-3 bg-white rounded-xl">
                          <div className="flex items-center gap-2">
                            <Crown className={cn("w-5 h-5", tierColors[item.tier].icon)} />
                            <span className="font-medium capitalize">{item.tier}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-900">{item.count}</p>
                            <p className="text-xs text-neutral-500">{item.threshold}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Total Points Economy</h3>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-neutral-900">{stats.totalPoints.toLocaleString()}</p>
                      <p className="text-sm text-neutral-500 mt-1">Points in circulation</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 bg-white rounded-xl text-center">
                        <p className="text-lg font-bold text-emerald-600">+12,450</p>
                        <p className="text-xs text-neutral-500">Earned this month</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl text-center">
                        <p className="text-lg font-bold text-amber-600">-4,890</p>
                        <p className="text-xs text-neutral-500">Redeemed</p>
                      </div>
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="dark" className="p-6">
                    <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <LuxeButton icon={Gift} variant="gold" fullWidth data-testid="btn-send-egift">
                        Send E-Gift
                      </LuxeButton>
                      <LuxeButton icon={Send} variant="outline" fullWidth data-testid="btn-send-campaign">
                        Send Campaign
                      </LuxeButton>
                      <LuxeButton icon={Sparkles} variant="outline" fullWidth data-testid="btn-ai-insights">
                        AI Insights
                      </LuxeButton>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "vip" && (
            <motion.div
              key="vip"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                  <div className="flex-1 md:w-80">
                    <LuxeSearch
                      placeholder="Search VIP members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="vip-search"
                    />
                  </div>
                  <div className="w-40">
                    <CountryPicker
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                      placeholder="All Countries"
                      data-testid="country-filter"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <LuxeButton icon={Filter} variant="outline" data-testid="btn-filters">Filters</LuxeButton>
                  <LuxeButton icon={Download} variant="outline" data-testid="btn-export">Export</LuxeButton>
                  <LuxeButton icon={UserPlus} variant="gold" data-testid="btn-add-vip-table">Add VIP</LuxeButton>
                </div>
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    {
                      key: "member",
                      header: "Member",
                      render: (row) => (
                        <div className="flex items-center gap-3">
                          <LuxeAvatar name={row.name} size="md" />
                          <div>
                            <p className="font-medium text-neutral-900">{row.name}</p>
                            <p className="text-xs text-neutral-500">{row.email}</p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "tier",
                      header: "Tier",
                      render: (row) => (
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", tierColors[row.tier].bg, tierColors[row.tier].text)}>
                          {row.tier}
                        </span>
                      ),
                    },
                    { key: "points", header: "Points", align: "right" as const, render: (row) => <span className="font-bold">{row.points.toLocaleString()}</span> },
                    { key: "totalSpent", header: "Total Spent", align: "right" as const, render: (row) => <span>${row.totalSpent.toLocaleString()}</span> },
                    { key: "visits", header: "Visits", align: "center" as const },
                    {
                      key: "country",
                      header: "Country",
                      render: (row) => <span>{COUNTRIES.find(c => c.value === row.country)?.icon} {row.country}</span>,
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right" as const,
                      render: (row) => (
                        <div className="flex gap-1">
                          <LuxeIconButton icon={Eye} size="sm" onClick={() => setSelectedCustomer(row)} data-testid={`btn-view-customer-${row.id}`} />
                          <LuxeIconButton icon={Edit2} size="sm" data-testid={`btn-edit-customer-${row.id}`} />
                          <LuxeIconButton icon={Gift} size="sm" data-testid={`btn-gift-customer-${row.id}`} />
                        </div>
                      ),
                    },
                  ]}
                  data={filteredCustomers}
                  data-testid="vip-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Open" value={mockTickets.filter((t) => t.status === "open").length} icon={AlertCircle} changeType="negative" change="Needs response" />
                <LuxeStatCard title="In Progress" value={mockTickets.filter((t) => t.status === "in_progress").length} icon={Clock} changeType="neutral" change="Being handled" />
                <LuxeStatCard title="Resolved Today" value={1} icon={CheckCircle2} changeType="positive" change="Good work!" />
                <LuxeStatCard title="Avg Response" value="2.4h" icon={Zap} changeType="positive" change="Fast response" />
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    { key: "id", header: "Ticket", render: (row) => <span className="font-mono font-medium">{row.id}</span> },
                    { key: "customer", header: "Customer" },
                    { key: "subject", header: "Subject" },
                    { key: "category", header: "Category" },
                    {
                      key: "priority",
                      header: "Priority",
                      render: (row) => (
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", priorityColors[row.priority])}>
                          {row.priority}
                        </span>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge variant={
                          row.status === "resolved" || row.status === "closed" ? "success" :
                          row.status === "in_progress" ? "default" : "warning"
                        }>
                          {row.status.replace("_", " ")}
                        </LuxeBadge>
                      ),
                    },
                    { key: "assignee", header: "Assignee" },
                  ]}
                  data={mockTickets}
                  data-testid="tickets-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "gifts" && (
            <motion.div
              key="gifts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Active Cards" value={stats.activeGiftCards} icon={Gift} changeType="neutral" change="In circulation" />
                <LuxeStatCard title="Total Value" value="$180" icon={Award} changeType="neutral" change="Outstanding" />
                <LuxeStatCard title="Redeemed" value={1} icon={CheckCircle2} changeType="positive" change="This month" />
                <LuxeStatCard title="Revenue" value="$250" icon={TrendingUp} changeType="positive" change="From e-gifts" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockGiftCards.map((card) => (
                  <LuxeCard key={card.id} variant="gradient" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a059] flex items-center justify-center text-white">
                        <Gift className="w-6 h-6" />
                      </div>
                      <LuxeBadge variant={
                        card.status === "active" ? "success" :
                        card.status === "redeemed" ? "default" : "danger"
                      }>
                        {card.status}
                      </LuxeBadge>
                    </div>
                    <p className="font-mono text-sm text-neutral-500 mb-2">{card.code}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-neutral-900">${card.balance}</span>
                      <span className="text-neutral-400">/ ${card.amount}</span>
                    </div>
                    <LuxeProgress value={(card.balance / card.amount) * 100} />
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">From</span>
                        <span className="font-medium">{card.purchaser}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Expires</span>
                        <span className="font-medium">{card.expiryDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </LuxeCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "loyalty" && (
            <motion.div
              key="loyalty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { tier: "platinum", name: "Platinum", points: "10,000+", benefits: ["VIP Tier Status", "Priority Support", "Early Access"], color: "from-purple-500 to-purple-600" },
                  { tier: "gold", name: "Gold", points: "5,000+", benefits: ["Gold Tier Status", "Early Access", "Member Events"], color: "from-yellow-500 to-amber-500" },
                  { tier: "silver", name: "Silver", points: "2,000+", benefits: ["Silver Tier Status", "Member Events"], color: "from-neutral-400 to-neutral-500" },
                  { tier: "bronze", name: "Bronze", points: "0+", benefits: ["Member Status", "Points Tracking"], color: "from-amber-600 to-amber-700" },
                ].map((tier) => (
                  <LuxeCard key={tier.tier} variant="default" className="overflow-hidden">
                    <div className={cn("p-4 bg-gradient-to-r text-white", tier.color)}>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-6 h-6" />
                        <h3 className="text-lg font-bold">{tier.name}</h3>
                      </div>
                      <p className="text-sm opacity-90">{tier.points} points</p>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </LuxeCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Avg Rating" value="4.8" icon={Star} changeType="positive" change="Excellent" />
                <LuxeStatCard title="Total Reviews" value="1,247" icon={MessageCircle} changeType="neutral" change="All time" />
                <LuxeStatCard title="Positive" value="94%" icon={ThumbsUp} changeType="positive" change="Very good" />
                <LuxeStatCard title="Need Attention" value="12" icon={ThumbsDown} changeType="negative" change="This month" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Recent Feedback</h3>
                <div className="space-y-4">
                  {[
                    { customer: "Princess Fatima", rating: 5, comment: "Absolutely divine! The best frozen yogurt I've ever tasted.", date: "2 hours ago", flavor: "Vanilla Paradise" },
                    { customer: "Sheikh Mohammed", rating: 5, comment: "Excellent service and premium quality. Will definitely return.", date: "5 hours ago", flavor: "Mango Bliss" },
                    { customer: "Sarah Goldman", rating: 4, comment: "Great taste but could use more topping variety.", date: "1 day ago", flavor: "Berry Explosion" },
                  ].map((feedback, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <LuxeAvatar name={feedback.customer} size="sm" />
                          <span className="font-medium">{feedback.customer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-4 h-4", i < feedback.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700 mb-2">{feedback.comment}</p>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>{feedback.flavor}</span>
                        <span>{feedback.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-neutral-900">Member Growth</h3>
                  </div>
                  <p className="text-4xl font-bold text-neutral-900">+124</p>
                  <p className="text-sm text-emerald-600 mt-1">+18% vs last month</p>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-neutral-900">Avg Customer Value</h3>
                  </div>
                  <p className="text-4xl font-bold text-neutral-900">$4,125</p>
                  <p className="text-sm text-neutral-500 mt-1">Lifetime value</p>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <h3 className="font-bold text-neutral-900">Retention Rate</h3>
                  </div>
                  <p className="text-4xl font-bold text-neutral-900">87%</p>
                  <p className="text-sm text-emerald-600 mt-1">Industry leading</p>
                </LuxeCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedCustomer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-900">VIP Profile</h2>
                  <LuxeIconButton icon={AlertCircle} onClick={() => setSelectedCustomer(null)} />
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <LuxeAvatar name={selectedCustomer.name} size="xl" />
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{selectedCustomer.name}</h3>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", tierColors[selectedCustomer.tier].bg, tierColors[selectedCustomer.tier].text)}>
                      {selectedCustomer.tier} Member
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Points Balance</p>
                    <p className="text-xl font-bold text-neutral-900">{selectedCustomer.points.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Total Spent</p>
                    <p className="text-xl font-bold text-neutral-900">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Visits</p>
                    <p className="text-xl font-bold text-neutral-900">{selectedCustomer.visits}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Favorite Flavor</p>
                    <p className="text-sm font-bold text-neutral-900">{selectedCustomer.favoriteFlavor}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <LuxeButton variant="outline" fullWidth icon={Gift} data-testid="btn-send-gift-modal">Send Gift</LuxeButton>
                  <LuxeButton variant="gold" fullWidth icon={MessageSquare} data-testid="btn-contact-modal">Contact</LuxeButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
