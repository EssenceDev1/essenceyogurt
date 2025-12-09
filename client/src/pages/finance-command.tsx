import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Receipt,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  ChevronRight,
  Globe,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  FileText,
  Banknote,
  CircleDollarSign,
  Coins,
  ShoppingCart,
  CreditCard as CardIcon,
  Landmark,
  Send,
} from "lucide-react";
import { Link } from "wouter";
import { LuxeCard, LuxeStatCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeSearch } from "@/components/ui/luxe-input";
import { CountryPicker, LuxeDatePicker, COUNTRIES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeProgress } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "sale" | "refund" | "expense" | "payout";
  amount: number;
  currency: string;
  description: string;
  unit: string;
  country: string;
  status: "completed" | "pending" | "failed";
  timestamp: Date;
}

interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  balance: number;
  todayRevenue: number;
  change: number;
}

const currencies: CurrencyData[] = [
  { code: "SAR", name: "Saudi Riyal", symbol: "ر.س", flag: "🇸🇦", balance: 245600, todayRevenue: 12400, change: 15.2 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", balance: 187200, todayRevenue: 8900, change: 8.7 },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱", balance: 124800, todayRevenue: 5600, change: 12.3 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇬🇷", balance: 67400, todayRevenue: 3200, change: -2.1 },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", balance: 543200, todayRevenue: 28700, change: 11.4 },
];

const recentTransactions: Transaction[] = [
  { id: "TXN-001", type: "sale", amount: 234.50, currency: "SAR", description: "POS Sale - Vanilla Classic", unit: "Riyadh Airport T1", country: "SA", status: "completed", timestamp: new Date() },
  { id: "TXN-002", type: "sale", amount: 189.00, currency: "AED", description: "POS Sale - Mango Paradise", unit: "Dubai Mall", country: "AE", status: "completed", timestamp: new Date(Date.now() - 300000) },
  { id: "TXN-003", type: "refund", amount: 45.00, currency: "ILS", description: "Customer Refund", unit: "Tel Aviv Beach", country: "IL", status: "completed", timestamp: new Date(Date.now() - 600000) },
  { id: "TXN-004", type: "expense", amount: 1200.00, currency: "EUR", description: "Supplier Payment - Ingredients", unit: "Athens Airport", country: "GR", status: "pending", timestamp: new Date(Date.now() - 900000) },
  { id: "TXN-005", type: "sale", amount: 567.80, currency: "SAR", description: "POS Sale - Berry Bliss", unit: "Jeddah Mall", country: "SA", status: "completed", timestamp: new Date(Date.now() - 1200000) },
];

const formatCurrency = (amount: number, currency: string) => {
  const symbols: Record<string, string> = { SAR: "ر.س", AED: "د.إ", ILS: "₪", EUR: "€", USD: "$" };
  return `${symbols[currency] || "$"}${amount.toLocaleString()}`;
};

export default function FinanceCommand() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const totalRevenue = currencies.reduce((sum, c) => sum + c.todayRevenue, 0);
  const totalBalance = currencies.reduce((sum, c) => sum + c.balance, 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "currencies", label: "Currencies", icon: Globe },
    { id: "revenue", label: "Revenue", icon: TrendingUp },
    { id: "expenses", label: "Expenses", icon: TrendingDown },
    { id: "payroll", label: "Payroll", icon: Banknote },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50/30">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/command-center">
              <LuxeIconButton icon={ArrowLeft} data-testid="back-btn" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Finance Command
                </h1>
                <p className="text-sm text-neutral-500">Multi-Currency Treasury</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:block">
                <CountryPicker
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="All Markets"
                  data-testid="market-filter"
                />
              </div>
              <LuxeIconButton
                icon={RefreshCw}
                data-testid="refresh-btn"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <LuxeTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
              data-testid="finance-tabs"
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
                  title="Today's Revenue"
                  value={`$${totalRevenue.toLocaleString()}`}
                  change="+12.4% vs yesterday"
                  changeType="positive"
                  icon={TrendingUp}
                  data-testid="stat-revenue"
                />
                <LuxeStatCard
                  title="Total Balance"
                  value={`$${(totalBalance / 1000).toFixed(1)}K`}
                  change="Across all currencies"
                  changeType="neutral"
                  icon={Wallet}
                  data-testid="stat-balance"
                />
                <LuxeStatCard
                  title="Transactions"
                  value="847"
                  change="Today"
                  changeType="positive"
                  icon={Receipt}
                  data-testid="stat-transactions"
                />
                <LuxeStatCard
                  title="Pending Payouts"
                  value="5"
                  change="$23,400 total"
                  changeType="neutral"
                  icon={Clock}
                  data-testid="stat-pending"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-neutral-900">Currency Balances</h2>
                      <LuxeButton variant="outline" size="sm" icon={Globe}>
                        Exchange Rates
                      </LuxeButton>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currencies.map((currency, idx) => (
                        <motion.div
                          key={currency.code}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all cursor-pointer",
                            selectedCurrency === currency.code
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-neutral-100 bg-neutral-50 hover:border-neutral-200"
                          )}
                          onClick={() => setSelectedCurrency(currency.code === selectedCurrency ? null : currency.code)}
                          data-testid={`currency-${currency.code}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{currency.flag}</span>
                              <div>
                                <p className="font-bold text-neutral-900">{currency.code}</p>
                                <p className="text-xs text-neutral-500">{currency.name}</p>
                              </div>
                            </div>
                            <span className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              currency.change >= 0 ? "text-emerald-600" : "text-red-500"
                            )}>
                              {currency.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              {Math.abs(currency.change)}%
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-xs text-neutral-500">Balance</span>
                              <span className="text-sm font-bold text-neutral-900">
                                {currency.symbol}{currency.balance.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-neutral-500">Today</span>
                              <span className="text-sm font-medium text-emerald-600">
                                +{currency.symbol}{currency.todayRevenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-neutral-900">Recent Transactions</h2>
                      <LuxeButton variant="outline" size="sm" icon={Receipt}>
                        View All
                      </LuxeButton>
                    </div>
                    <div className="space-y-3">
                      {recentTransactions.slice(0, 5).map((txn, idx) => (
                        <motion.div
                          key={txn.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                          data-testid={`txn-${txn.id}`}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            txn.type === "sale" ? "bg-emerald-100 text-emerald-600" :
                            txn.type === "refund" ? "bg-amber-100 text-amber-600" :
                            txn.type === "expense" ? "bg-red-100 text-red-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            {txn.type === "sale" ? <ShoppingCart className="w-5 h-5" /> :
                             txn.type === "refund" ? <RefreshCw className="w-5 h-5" /> :
                             txn.type === "expense" ? <TrendingDown className="w-5 h-5" /> :
                             <Send className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{txn.description}</p>
                            <p className="text-xs text-neutral-500">{txn.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "font-bold",
                              txn.type === "sale" ? "text-emerald-600" :
                              txn.type === "refund" || txn.type === "expense" ? "text-red-500" :
                              "text-neutral-900"
                            )}>
                              {txn.type === "sale" ? "+" : "-"}{formatCurrency(txn.amount, txn.currency)}
                            </p>
                            <LuxeBadge
                              variant={txn.status === "completed" ? "success" : txn.status === "pending" ? "warning" : "danger"}
                            >
                              {txn.status}
                            </LuxeBadge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Revenue by Country</h3>
                    <div className="space-y-4">
                      {[
                        { country: "Saudi Arabia", revenue: 98400, percent: 35, flag: "🇸🇦" },
                        { country: "UAE", revenue: 76200, percent: 27, flag: "🇦🇪" },
                        { country: "Israel", revenue: 62100, percent: 22, flag: "🇮🇱" },
                        { country: "Greece", revenue: 45300, percent: 16, flag: "🇬🇷" },
                      ].map((item) => (
                        <div key={item.country} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{item.flag}</span>
                              <span className="text-sm font-medium text-neutral-700">{item.country}</span>
                            </div>
                            <span className="text-sm font-bold text-neutral-900">${(item.revenue / 1000).toFixed(1)}K</span>
                          </div>
                          <LuxeProgress value={item.percent} />
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="dark" className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Monthly Summary</h3>
                        <p className="text-xs text-neutral-400">November 2025</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Total Revenue</span>
                        <span className="text-xl font-bold text-white">$284,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Total Expenses</span>
                        <span className="text-lg font-bold text-red-400">-$67,200</span>
                      </div>
                      <div className="border-t border-neutral-700 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-300 font-medium">Net Profit</span>
                          <span className="text-2xl font-bold text-emerald-400">$217,300</span>
                        </div>
                        <p className="text-xs text-emerald-400 mt-1">+23% vs last month</p>
                      </div>
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <LuxeButton icon={Send} variant="gold" fullWidth>
                        Process Payout
                      </LuxeButton>
                      <LuxeButton icon={FileText} variant="outline" fullWidth>
                        Generate Report
                      </LuxeButton>
                      <LuxeButton icon={Download} variant="outline" fullWidth>
                        Export Data
                      </LuxeButton>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "transactions" && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                  <div className="flex-1 md:w-80">
                    <LuxeSearch
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="txn-search"
                    />
                  </div>
                  <LuxeDatePicker
                    value={dateRange}
                    onChange={setDateRange}
                    label="Date"
                    data-testid="txn-date"
                  />
                </div>
                <div className="flex gap-2">
                  <LuxeButton icon={Filter} variant="outline">Filters</LuxeButton>
                  <LuxeButton icon={Download} variant="outline">Export</LuxeButton>
                </div>
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    {
                      key: "type",
                      header: "Type",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            row.type === "sale" ? "bg-emerald-100 text-emerald-600" :
                            row.type === "refund" ? "bg-amber-100 text-amber-600" :
                            row.type === "expense" ? "bg-red-100 text-red-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            {row.type === "sale" ? <ShoppingCart className="w-4 h-4" /> :
                             row.type === "refund" ? <RefreshCw className="w-4 h-4" /> :
                             row.type === "expense" ? <TrendingDown className="w-4 h-4" /> :
                             <Send className="w-4 h-4" />}
                          </div>
                          <span className="capitalize font-medium">{row.type}</span>
                        </div>
                      ),
                    },
                    { key: "description", header: "Description" },
                    { key: "unit", header: "Unit" },
                    {
                      key: "country",
                      header: "Country",
                      render: (row) => (
                        <span>{COUNTRIES.find(c => c.value === row.country)?.icon} {row.country}</span>
                      ),
                    },
                    {
                      key: "amount",
                      header: "Amount",
                      align: "right" as const,
                      render: (row) => (
                        <span className={cn(
                          "font-bold",
                          row.type === "sale" ? "text-emerald-600" : "text-red-500"
                        )}>
                          {row.type === "sale" ? "+" : "-"}{formatCurrency(row.amount, row.currency)}
                        </span>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge
                          variant={row.status === "completed" ? "success" : row.status === "pending" ? "warning" : "danger"}
                        >
                          {row.status}
                        </LuxeBadge>
                      ),
                    },
                  ]}
                  data={recentTransactions}
                  data-testid="transactions-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "currencies" && (
            <motion.div
              key="currencies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currencies.map((currency, idx) => (
                  <motion.div
                    key={currency.code}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <LuxeCard variant="gradient" className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{currency.flag}</span>
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">{currency.code}</h3>
                            <p className="text-sm text-neutral-500">{currency.name}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                          currency.change >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {currency.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {Math.abs(currency.change)}%
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl">
                          <p className="text-xs text-neutral-500 mb-1">Total Balance</p>
                          <p className="text-2xl font-bold text-neutral-900">
                            {currency.symbol}{currency.balance.toLocaleString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-xl">
                            <p className="text-xs text-neutral-500 mb-1">Today Revenue</p>
                            <p className="text-lg font-bold text-emerald-600">
                              +{currency.symbol}{currency.todayRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-xl">
                            <p className="text-xs text-neutral-500 mb-1">Transactions</p>
                            <p className="text-lg font-bold text-neutral-900">
                              {Math.floor(Math.random() * 200 + 100)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <LuxeButton variant="outline" size="sm" fullWidth icon={Globe}>
                          View Details
                        </LuxeButton>
                      </div>
                    </LuxeCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "revenue" && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Daily Average" value="$9,450" icon={TrendingUp} changeType="positive" change="+8.2%" />
                <LuxeStatCard title="Weekly Total" value="$66,150" icon={Calendar} changeType="positive" change="+12.4%" />
                <LuxeStatCard title="Monthly Target" value="$280K" icon={CircleDollarSign} changeType="neutral" change="95% reached" />
                <LuxeStatCard title="Best Day" value="$14,200" icon={Coins} changeType="positive" change="Nov 24" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LuxeCard variant="default" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Top Performing Units</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Dubai Mall", revenue: "$4,123", transactions: 156, country: "AE" },
                      { name: "Riyadh Airport T1", revenue: "$2,847", transactions: 98, country: "SA" },
                      { name: "Tel Aviv Beach", revenue: "$1,892", transactions: 72, country: "IL" },
                      { name: "Jeddah Mall", revenue: "$1,654", transactions: 64, country: "SA" },
                    ].map((unit, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{unit.name}</p>
                          <p className="text-xs text-neutral-500">{unit.transactions} transactions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">{unit.revenue}</p>
                          <span className="text-lg">{COUNTRIES.find(c => c.value === unit.country)?.icon}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="default" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Revenue by Category</h3>
                  <div className="space-y-4">
                    {[
                      { category: "Yogurt Sales", amount: 198500, percent: 70 },
                      { category: "Toppings", amount: 42700, percent: 15 },
                      { category: "Premium Flavors", amount: 28400, percent: 10 },
                      { category: "E-Gift Cards", amount: 14200, percent: 5 },
                    ].map((cat) => (
                      <div key={cat.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-neutral-700">{cat.category}</span>
                          <span className="font-bold text-neutral-900">${(cat.amount / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <LuxeProgress value={cat.percent} />
                          </div>
                          <span className="text-sm text-neutral-500 w-12 text-right">{cat.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </LuxeCard>
              </div>
            </motion.div>
          )}

          {activeTab === "expenses" && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Monthly Expenses" value="$67,200" icon={TrendingDown} changeType="negative" change="+5.2%" />
                <LuxeStatCard title="Supplies" value="$28,400" icon={ShoppingCart} changeType="neutral" change="42%" />
                <LuxeStatCard title="Payroll" value="$24,600" icon={Banknote} changeType="neutral" change="37%" />
                <LuxeStatCard title="Operations" value="$14,200" icon={Building2} changeType="neutral" change="21%" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Expense Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { category: "Ingredients & Supplies", amount: 28400, icon: ShoppingCart, color: "bg-blue-500" },
                    { category: "Staff Payroll", amount: 24600, icon: Banknote, color: "bg-purple-500" },
                    { category: "Rent & Utilities", amount: 8200, icon: Building2, color: "bg-amber-500" },
                    { category: "Marketing", amount: 3400, icon: TrendingUp, color: "bg-pink-500" },
                    { category: "Equipment Maintenance", amount: 1800, icon: RefreshCw, color: "bg-emerald-500" },
                    { category: "Other", amount: 800, icon: Receipt, color: "bg-neutral-500" },
                  ].map((expense) => (
                    <div key={expense.category} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", expense.color)}>
                        <expense.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{expense.category}</p>
                        <p className="text-lg font-bold text-neutral-900">${expense.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "payroll" && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Monthly Payroll" value="$284K" icon={Banknote} changeType="neutral" change="December 2025" />
                <LuxeStatCard title="Employees" value="124" icon={Globe} changeType="neutral" change="Active" />
                <LuxeStatCard title="Next Payout" value="Dec 1" icon={Calendar} changeType="neutral" change="In 2 days" />
                <LuxeStatCard title="Pending" value="$45K" icon={Clock} changeType="neutral" change="To process" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LuxeCard variant="gradient" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Payroll by Country</h3>
                  <div className="space-y-4">
                    {[
                      { country: "Saudi Arabia", amount: 98000, employees: 45, flag: "🇸🇦" },
                      { country: "UAE", amount: 82000, employees: 38, flag: "🇦🇪" },
                      { country: "Israel", amount: 67000, employees: 28, flag: "🇮🇱" },
                      { country: "Greece", amount: 37000, employees: 13, flag: "🇬🇷" },
                    ].map((item) => (
                      <div key={item.country} className="flex items-center justify-between p-4 bg-white rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.flag}</span>
                          <div>
                            <p className="font-medium text-neutral-900">{item.country}</p>
                            <p className="text-xs text-neutral-500">{item.employees} employees</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-neutral-900">${item.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="default" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Recent Payouts</h3>
                  <div className="space-y-3">
                    {[
                      { period: "November 2025", amount: 276400, status: "paid", date: "Nov 28" },
                      { period: "October 2025", amount: 268200, status: "paid", date: "Oct 28" },
                      { period: "September 2025", amount: 254800, status: "paid", date: "Sep 28" },
                    ].map((payout, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <p className="font-medium text-neutral-900">{payout.period}</p>
                          <p className="text-xs text-neutral-500">{payout.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900">${payout.amount.toLocaleString()}</p>
                          <LuxeBadge variant="success">{payout.status}</LuxeBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <LuxeButton variant="gold" fullWidth icon={Banknote}>
                    Process December Payroll
                  </LuxeButton>
                </LuxeCard>
              </div>
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Available Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Daily Revenue Report", description: "Sales breakdown by unit and currency", icon: BarChart3 },
                    { name: "Monthly P&L Statement", description: "Profit and loss for all operations", icon: FileText },
                    { name: "Expense Analysis", description: "Detailed expense categorization", icon: PieChart },
                    { name: "Payroll Summary", description: "Staff compensation overview", icon: Banknote },
                    { name: "Tax Report", description: "VAT and tax obligations by country", icon: Landmark },
                    { name: "Currency Exchange", description: "Multi-currency conversion report", icon: Globe },
                  ].map((report) => (
                    <div key={report.name} className="flex items-center gap-4 p-4 border border-neutral-200 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                        <report.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{report.name}</p>
                        <p className="text-xs text-neutral-500">{report.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  ))}
                </div>
              </LuxeCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
