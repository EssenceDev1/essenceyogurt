import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Box,
  Boxes,
  PackageCheck,
  PackageX,
  PackagePlus,
  Warehouse,
  Scale,
  ThermometerSun,
  Droplets,
  Milk,
  Cherry,
  Cookie,
  UtensilsCrossed,
  Trash2,
  Eye,
  Edit2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";
import { Link } from "wouter";
import { LuxeCard, LuxeStatCard, LuxeAlertCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeSearch } from "@/components/ui/luxe-input";
import { CountryPicker, COUNTRIES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeProgress, LuxeAvatar } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  currency: string;
  essenceUnitId: string;
  essenceUnitName: string;
  lastRestock: Date;
  status: "ok" | "low" | "critical" | "overstocked";
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  total: number;
  currency: string;
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled";
  expectedDate: Date;
  createdAt: Date;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  rating: number;
  activeOrders: number;
  totalSpent: number;
}

const categories = [
  { id: "yogurt_base", name: "Yogurt Base", icon: Milk, color: "bg-blue-500" },
  { id: "topping", name: "Toppings", icon: Cherry, color: "bg-pink-500" },
  { id: "cup", name: "Cups & Packaging", icon: Box, color: "bg-amber-500" },
  { id: "cleaning", name: "Cleaning Supplies", icon: Droplets, color: "bg-cyan-500" },
  { id: "equipment", name: "Equipment Parts", icon: UtensilsCrossed, color: "bg-purple-500" },
];

const mockInventory: InventoryItem[] = [
  { id: "1", name: "Vanilla Yogurt Base", category: "yogurt_base", unit: "kg", currentStock: 45, minStock: 20, maxStock: 100, unitCost: 12.50, currency: "USD", essenceUnitId: "SA-001", essenceUnitName: "Riyadh Airport T1", lastRestock: new Date(Date.now() - 86400000 * 2), status: "ok" },
  { id: "2", name: "Strawberries Fresh", category: "topping", unit: "kg", currentStock: 8, minStock: 15, maxStock: 50, unitCost: 8.00, currency: "USD", essenceUnitId: "AE-001", essenceUnitName: "Dubai Mall", lastRestock: new Date(Date.now() - 86400000 * 5), status: "critical" },
  { id: "3", name: "Medium Cups (12oz)", category: "cup", unit: "pieces", currentStock: 2400, minStock: 500, maxStock: 5000, unitCost: 0.15, currency: "USD", essenceUnitId: "SA-001", essenceUnitName: "Riyadh Airport T1", lastRestock: new Date(Date.now() - 86400000), status: "ok" },
  { id: "4", name: "Mango Puree", category: "yogurt_base", unit: "liters", currentStock: 12, minStock: 10, maxStock: 40, unitCost: 15.00, currency: "USD", essenceUnitId: "IL-001", essenceUnitName: "Tel Aviv Beach", lastRestock: new Date(Date.now() - 86400000 * 3), status: "low" },
  { id: "5", name: "Chocolate Chips", category: "topping", unit: "kg", currentStock: 25, minStock: 8, maxStock: 30, unitCost: 18.00, currency: "USD", essenceUnitId: "GR-001", essenceUnitName: "Athens Airport", lastRestock: new Date(Date.now() - 86400000 * 4), status: "ok" },
  { id: "6", name: "Sanitizing Solution", category: "cleaning", unit: "liters", currentStock: 3, minStock: 5, maxStock: 20, unitCost: 25.00, currency: "USD", essenceUnitId: "SA-002", essenceUnitName: "Jeddah Mall", lastRestock: new Date(Date.now() - 86400000 * 7), status: "low" },
];

const mockOrders: PurchaseOrder[] = [
  { id: "PO-2025-001", supplier: "Premium Dairy Co.", items: 5, total: 4250, currency: "USD", status: "shipped", expectedDate: new Date(Date.now() + 86400000 * 2), createdAt: new Date(Date.now() - 86400000 * 3) },
  { id: "PO-2025-002", supplier: "Fresh Fruits Ltd.", items: 8, total: 1890, currency: "USD", status: "approved", expectedDate: new Date(Date.now() + 86400000 * 5), createdAt: new Date(Date.now() - 86400000) },
  { id: "PO-2025-003", supplier: "PackageMaster", items: 3, total: 780, currency: "USD", status: "pending", expectedDate: new Date(Date.now() + 86400000 * 7), createdAt: new Date() },
  { id: "PO-2025-004", supplier: "Clean Pro Supplies", items: 12, total: 2340, currency: "USD", status: "delivered", expectedDate: new Date(Date.now() - 86400000), createdAt: new Date(Date.now() - 86400000 * 10) },
];

const mockSuppliers: Supplier[] = [
  { id: "S-001", name: "Premium Dairy Co.", category: "Yogurt Base", country: "SA", rating: 4.8, activeOrders: 2, totalSpent: 145600 },
  { id: "S-002", name: "Fresh Fruits Ltd.", category: "Toppings", country: "AE", rating: 4.5, activeOrders: 1, totalSpent: 87200 },
  { id: "S-003", name: "PackageMaster", category: "Packaging", country: "GR", rating: 4.2, activeOrders: 1, totalSpent: 34500 },
  { id: "S-004", name: "Clean Pro Supplies", category: "Cleaning", country: "IL", rating: 4.7, activeOrders: 0, totalSpent: 12800 },
];

const statusColors: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  low: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
  overstocked: "bg-blue-100 text-blue-700",
};

const orderStatusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-neutral-100", text: "text-neutral-700" },
  approved: { bg: "bg-blue-100", text: "text-blue-700" },
  shipped: { bg: "bg-purple-100", text: "text-purple-700" },
  delivered: { bg: "bg-emerald-100", text: "text-emerald-700" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" },
};

export default function InventoryCommand() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const lowStockItems = mockInventory.filter((i) => i.status === "low" || i.status === "critical");
  const criticalItems = mockInventory.filter((i) => i.status === "critical");

  const stats = {
    totalItems: mockInventory.length,
    lowStock: lowStockItems.length,
    criticalStock: criticalItems.length,
    pendingOrders: mockOrders.filter((o) => o.status === "pending" || o.status === "approved").length,
    inTransit: mockOrders.filter((o) => o.status === "shipped").length,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Package },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "orders", label: "Purchase Orders", icon: ShoppingCart, badge: stats.pendingOrders },
    { id: "receiving", label: "Receiving", icon: PackageCheck },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "waste", label: "Waste Tracking", icon: Trash2 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/30">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/command-center">
              <LuxeIconButton icon={ArrowLeft} data-testid="back-btn" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Supply Chain Command
                </h1>
                <p className="text-sm text-neutral-500">Inventory & Procurement</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <LuxeButton icon={Plus} variant="gold" data-testid="btn-new-order">
                New Order
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
              data-testid="inventory-tabs"
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <LuxeStatCard
                  title="Total Items"
                  value={stats.totalItems}
                  change="Tracked items"
                  changeType="neutral"
                  icon={Boxes}
                  data-testid="stat-items"
                />
                <LuxeStatCard
                  title="Low Stock"
                  value={stats.lowStock}
                  change="Need attention"
                  changeType={stats.lowStock > 0 ? "negative" : "positive"}
                  icon={PackageX}
                  data-testid="stat-low"
                />
                <LuxeStatCard
                  title="Critical"
                  value={stats.criticalStock}
                  change="Urgent"
                  changeType={stats.criticalStock > 0 ? "negative" : "positive"}
                  icon={AlertTriangle}
                  data-testid="stat-critical"
                />
                <LuxeStatCard
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  change="Awaiting"
                  changeType="neutral"
                  icon={Clock}
                  data-testid="stat-pending"
                />
                <LuxeStatCard
                  title="In Transit"
                  value={stats.inTransit}
                  change="Arriving soon"
                  changeType="positive"
                  icon={Truck}
                  data-testid="stat-transit"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {criticalItems.length > 0 && (
                    <LuxeCard variant="default" className="p-6 border-l-4 border-red-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900">Critical Stock Alerts</h3>
                          <p className="text-sm text-red-600">{criticalItems.length} items need immediate reorder</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {criticalItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900">{item.name}</p>
                              <p className="text-sm text-neutral-500">{item.essenceUnitName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-red-600">{item.currentStock} {item.unit}</p>
                              <p className="text-xs text-neutral-500">Min: {item.minStock}</p>
                            </div>
                            <LuxeButton size="sm" variant="danger" icon={ShoppingCart} data-testid={`btn-reorder-${item.id}`}>
                              Reorder
                            </LuxeButton>
                          </div>
                        ))}
                      </div>
                    </LuxeCard>
                  )}

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900" data-testid="text-categories-title">Categories Overview</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {categories.map((cat) => {
                        const itemsInCategory = mockInventory.filter((i) => i.category === cat.id);
                        const lowItems = itemsInCategory.filter((i) => i.status !== "ok");
                        return (
                          <motion.div
                            key={cat.id}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              "p-4 rounded-xl cursor-pointer transition-all",
                              selectedCategory === cat.id
                                ? "bg-orange-100 border-2 border-orange-500"
                                : "bg-neutral-50 border-2 border-transparent hover:border-neutral-200"
                            )}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            data-testid={`category-${cat.id}`}
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3", cat.color)}>
                              <cat.icon className="w-5 h-5" />
                            </div>
                            <p className="font-medium text-neutral-900 text-sm">{cat.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-neutral-500">{itemsInCategory.length} items</span>
                              {lowItems.length > 0 && (
                                <span className="text-xs font-medium text-red-500">{lowItems.length} low</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Recent Orders</h3>
                      <LuxeButton variant="outline" size="sm" icon={ShoppingCart} data-testid="btn-view-orders">
                        View All
                      </LuxeButton>
                    </div>
                    <div className="space-y-3">
                      {mockOrders.slice(0, 4).map((order) => (
                        <div key={order.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            orderStatusColors[order.status].bg
                          )}>
                            {order.status === "delivered" ? <PackageCheck className="w-5 h-5 text-emerald-600" /> :
                             order.status === "shipped" ? <Truck className="w-5 h-5 text-purple-600" /> :
                             <Clock className="w-5 h-5 text-neutral-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900">{order.id}</p>
                            <p className="text-sm text-neutral-500 truncate">{order.supplier} • {order.items} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-900">${order.total.toLocaleString()}</p>
                            <LuxeBadge variant={order.status === "delivered" ? "success" : order.status === "shipped" ? "default" : "warning"}>
                              {order.status}
                            </LuxeBadge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Stock Health</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Healthy Stock", value: mockInventory.filter((i) => i.status === "ok").length, percent: 67, color: "bg-emerald-500" },
                        { label: "Low Stock", value: mockInventory.filter((i) => i.status === "low").length, percent: 17, color: "bg-amber-500" },
                        { label: "Critical", value: mockInventory.filter((i) => i.status === "critical").length, percent: 16, color: "bg-red-500" },
                      ].map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600">{item.label}</span>
                            <span className="font-bold text-neutral-900">{item.value}</span>
                          </div>
                          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percent}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={cn("h-full rounded-full", item.color)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Top Suppliers</h3>
                    <div className="space-y-3">
                      {mockSuppliers.slice(0, 4).map((supplier) => (
                        <div key={supplier.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                          <LuxeAvatar name={supplier.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 text-sm truncate">{supplier.name}</p>
                            <p className="text-xs text-neutral-500">{supplier.category}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500">★</span>
                            <span className="text-sm font-medium">{supplier.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="dark" className="p-6">
                    <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <LuxeButton icon={PackagePlus} variant="gold" fullWidth data-testid="btn-create-po">
                        Create Purchase Order
                      </LuxeButton>
                      <LuxeButton icon={Scale} variant="outline" fullWidth data-testid="btn-stock-count">
                        Stock Count
                      </LuxeButton>
                      <LuxeButton icon={Warehouse} variant="outline" fullWidth data-testid="btn-transfer-stock">
                        Transfer Stock
                      </LuxeButton>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                  <div className="flex-1 md:w-80">
                    <LuxeSearch
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="inventory-search"
                    />
                  </div>
                  <div className="w-40">
                    <CountryPicker
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                      placeholder="All Locations"
                      data-testid="location-filter"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <LuxeButton icon={Filter} variant="outline" data-testid="btn-filters">Filters</LuxeButton>
                  <LuxeButton icon={Download} variant="outline" data-testid="btn-export">Export</LuxeButton>
                  <LuxeButton icon={Plus} variant="gold" data-testid="btn-add-item">Add Item</LuxeButton>
                </div>
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    {
                      key: "name",
                      header: "Item",
                      render: (row) => {
                        const cat = categories.find((c) => c.id === row.category);
                        return (
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", cat?.color || "bg-neutral-500")}>
                              {cat ? <cat.icon className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{row.name}</p>
                              <p className="text-xs text-neutral-500">{cat?.name}</p>
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      key: "location",
                      header: "Location",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm">{row.essenceUnitName}</span>
                        </div>
                      ),
                    },
                    {
                      key: "stock",
                      header: "Stock Level",
                      render: (row) => {
                        const percent = Math.min((row.currentStock / row.maxStock) * 100, 100);
                        return (
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium">{row.currentStock}</span>
                              <span className="text-neutral-400">/ {row.maxStock} {row.unit}</span>
                            </div>
                            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  row.status === "critical" ? "bg-red-500" :
                                  row.status === "low" ? "bg-amber-500" :
                                  row.status === "overstocked" ? "bg-blue-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", statusColors[row.status])}>
                          {row.status}
                        </span>
                      ),
                    },
                    {
                      key: "cost",
                      header: "Unit Cost",
                      align: "right" as const,
                      render: (row) => <span className="font-medium">${row.unitCost.toFixed(2)}</span>,
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right" as const,
                      render: (row) => (
                        <div className="flex gap-1">
                          <LuxeIconButton icon={Eye} size="sm" data-testid={`btn-view-${row.id}`} />
                          <LuxeIconButton icon={Edit2} size="sm" data-testid={`btn-edit-${row.id}`} />
                          <LuxeIconButton icon={ShoppingCart} size="sm" data-testid={`btn-order-${row.id}`} />
                        </div>
                      ),
                    },
                  ]}
                  data={filteredInventory}
                  data-testid="inventory-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Total Orders" value={mockOrders.length} icon={ShoppingCart} changeType="neutral" change="This month" />
                <LuxeStatCard title="Pending" value={mockOrders.filter((o) => o.status === "pending").length} icon={Clock} changeType="neutral" change="Awaiting" />
                <LuxeStatCard title="In Transit" value={mockOrders.filter((o) => o.status === "shipped").length} icon={Truck} changeType="positive" change="On the way" />
                <LuxeStatCard title="Delivered" value={mockOrders.filter((o) => o.status === "delivered").length} icon={PackageCheck} changeType="positive" change="This month" />
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    { key: "id", header: "Order ID", render: (row) => <span className="font-mono font-medium">{row.id}</span> },
                    { key: "supplier", header: "Supplier" },
                    { key: "items", header: "Items", align: "center" as const },
                    {
                      key: "total",
                      header: "Total",
                      align: "right" as const,
                      render: (row) => <span className="font-bold">${row.total.toLocaleString()}</span>,
                    },
                    {
                      key: "expected",
                      header: "Expected",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          <span>{row.expectedDate.toLocaleDateString()}</span>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge variant={
                          row.status === "delivered" ? "success" :
                          row.status === "shipped" ? "default" :
                          row.status === "approved" ? "default" :
                          row.status === "cancelled" ? "danger" : "warning"
                        }>
                          {row.status}
                        </LuxeBadge>
                      ),
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right" as const,
                      render: (row) => (
                        <div className="flex gap-1">
                          <LuxeIconButton icon={Eye} size="sm" data-testid={`btn-view-order-${row.id}`} />
                          <LuxeIconButton icon={Edit2} size="sm" data-testid={`btn-edit-order-${row.id}`} />
                        </div>
                      ),
                    },
                  ]}
                  data={mockOrders}
                  data-testid="orders-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "suppliers" && (
            <motion.div
              key="suppliers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-900" data-testid="text-supplier-title">Supplier Directory</h2>
                <LuxeButton icon={Plus} variant="gold" data-testid="btn-add-supplier">Add Supplier</LuxeButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockSuppliers.map((supplier) => (
                  <LuxeCard key={supplier.id} variant="gradient" className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <LuxeAvatar name={supplier.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-neutral-900 truncate">{supplier.name}</p>
                        <p className="text-sm text-neutral-500">{supplier.category}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500">Country</span>
                        <span className="font-medium">{COUNTRIES.find((c) => c.value === supplier.country)?.icon} {supplier.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500">Rating</span>
                        <span className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-medium">{supplier.rating}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500">Active Orders</span>
                        <span className="font-medium">{supplier.activeOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500">Total Spent</span>
                        <span className="font-bold text-neutral-900">${(supplier.totalSpent / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <LuxeButton variant="outline" size="sm" fullWidth icon={ShoppingCart} data-testid={`btn-create-order-${supplier.id}`}>
                        Create Order
                      </LuxeButton>
                    </div>
                  </LuxeCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "waste" && (
            <motion.div
              key="waste"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Total Waste" value="$2,450" icon={Trash2} changeType="negative" change="This month" />
                <LuxeStatCard title="Expired Items" value={12} icon={AlertTriangle} changeType="negative" change="This week" />
                <LuxeStatCard title="Damaged" value={5} icon={PackageX} changeType="neutral" change="This month" />
                <LuxeStatCard title="Waste Rate" value="1.2%" icon={TrendingDown} changeType="positive" change="-0.3% vs last month" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Recent Waste Reports</h3>
                <div className="space-y-4">
                  {[
                    { item: "Strawberries Fresh", reason: "Expired", quantity: "2.5 kg", value: "$20.00", date: "Nov 28", unit: "Dubai Mall" },
                    { item: "Vanilla Base", reason: "Damaged", quantity: "5 kg", value: "$62.50", date: "Nov 27", unit: "Riyadh Airport" },
                    { item: "Mango Puree", reason: "Expired", quantity: "3 liters", value: "$45.00", date: "Nov 26", unit: "Tel Aviv Beach" },
                  ].map((waste, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{waste.item}</p>
                        <p className="text-sm text-neutral-500">{waste.unit} • {waste.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{waste.value}</p>
                        <p className="text-xs text-neutral-500">{waste.quantity} • {waste.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <LuxeButton variant="outline" fullWidth icon={Plus} data-testid="btn-report-waste">
                  Report Waste
                </LuxeButton>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-neutral-900">Inventory Value</h3>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">$124,500</p>
                  <p className="text-sm text-emerald-600 mt-1">+8.2% vs last month</p>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-neutral-900">Turnover Rate</h3>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">4.2x</p>
                  <p className="text-sm text-neutral-500 mt-1">Average per month</p>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-neutral-900">Accuracy Rate</h3>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">98.5%</p>
                  <p className="text-sm text-emerald-600 mt-1">Last stock count</p>
                </LuxeCard>
              </div>
            </motion.div>
          )}

          {activeTab === "receiving" && (
            <motion.div
              key="receiving"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Expected Deliveries</h3>
                <div className="space-y-4">
                  {mockOrders.filter((o) => o.status === "shipped").map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{order.id}</p>
                        <p className="text-sm text-neutral-500">{order.supplier} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">
                          ETA: {order.expectedDate.toLocaleDateString()}
                        </p>
                        <LuxeBadge variant="default">In Transit</LuxeBadge>
                      </div>
                      <LuxeButton size="sm" variant="gold" icon={PackageCheck} data-testid={`btn-receive-${order.id}`}>
                        Receive
                      </LuxeButton>
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
