import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Monitor,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Camera,
  MapPin,
  Activity,
  Power,
  Zap,
  Gauge,
  Timer,
  ShieldCheck,
  Settings2,
  ClipboardList,
  BarChart3,
  Sparkles,
  CircleCheck,
  CircleX,
  CircleDot,
  PlayCircle,
  PauseCircle,
  XCircle,
  Target,
  TrendingUp,
  Coffee,
  IceCream,
} from "lucide-react";
import { Link } from "wouter";
import { LuxeCard, LuxeStatCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeSearch } from "@/components/ui/luxe-input";
import { CountryPicker, COUNTRIES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeProgress, LuxeAvatar } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  unitId: string;
  unitName: string;
  status: "online" | "offline" | "maintenance" | "error";
  lastMaintenance: Date;
  nextMaintenance: Date;
  uptime: number;
  temperature?: number;
}

interface MaintenanceTask {
  id: string;
  equipment: string;
  type: "scheduled" | "emergency" | "cleaning" | "inspection";
  description: string;
  assignee: string;
  unit: string;
  scheduledDate: Date;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
}

interface CleaningSchedule {
  id: string;
  area: string;
  unit: string;
  frequency: string;
  lastCleaned: Date;
  nextCleaning: Date;
  assignee: string;
  status: "done" | "due" | "overdue";
  photoRequired: boolean;
  hasPhoto: boolean;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  online: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  offline: { bg: "bg-neutral-100", text: "text-neutral-700", dot: "bg-neutral-400" },
  maintenance: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  error: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const priorityColors: Record<string, string> = {
  low: "bg-neutral-100 text-neutral-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

const mockEquipment: Equipment[] = [
  { id: "1", name: "Yogurt Dispenser A", type: "Dispenser", model: "Taylor C723", unitId: "SA-001", unitName: "Riyadh Airport T1", status: "online", lastMaintenance: new Date(Date.now() - 86400000 * 15), nextMaintenance: new Date(Date.now() + 86400000 * 15), uptime: 99.5, temperature: -18 },
  { id: "2", name: "Yogurt Dispenser B", type: "Dispenser", model: "Taylor C723", unitId: "AE-001", unitName: "Dubai Mall", status: "maintenance", lastMaintenance: new Date(), nextMaintenance: new Date(Date.now() + 86400000 * 30), uptime: 94.2, temperature: -16 },
  { id: "3", name: "Topping Bar Unit", type: "Display", model: "Custom TB-500", unitId: "IL-001", unitName: "Tel Aviv Beach", status: "online", lastMaintenance: new Date(Date.now() - 86400000 * 7), nextMaintenance: new Date(Date.now() + 86400000 * 23), uptime: 98.8, temperature: 4 },
  { id: "4", name: "POS Terminal", type: "POS", model: "Square Terminal", unitId: "GR-001", unitName: "Athens Airport", status: "error", lastMaintenance: new Date(Date.now() - 86400000 * 30), nextMaintenance: new Date(Date.now() - 86400000 * 2), uptime: 85.6 },
  { id: "5", name: "Digital Scale", type: "Scale", model: "CAS PW-II", unitId: "SA-001", unitName: "Riyadh Airport T1", status: "online", lastMaintenance: new Date(Date.now() - 86400000 * 10), nextMaintenance: new Date(Date.now() + 86400000 * 20), uptime: 99.9 },
  { id: "6", name: "Payment Kiosk", type: "POS", model: "Custom Essence K1", unitId: "SA-002", unitName: "Jeddah Mall", status: "online", lastMaintenance: new Date(Date.now() - 86400000 * 5), nextMaintenance: new Date(Date.now() + 86400000 * 25), uptime: 97.3 },
];

const mockTasks: MaintenanceTask[] = [
  { id: "1", equipment: "Yogurt Dispenser B", type: "scheduled", description: "Monthly deep clean and calibration", assignee: "Tech Team A", unit: "Dubai Mall", scheduledDate: new Date(), status: "in_progress", priority: "high" },
  { id: "2", equipment: "POS Terminal", type: "emergency", description: "Screen not responding - needs replacement", assignee: "Tech Team B", unit: "Athens Airport", scheduledDate: new Date(), status: "in_progress", priority: "critical" },
  { id: "3", equipment: "Yogurt Dispenser A", type: "inspection", description: "Quarterly inspection", assignee: "Tech Team A", unit: "Riyadh Airport T1", scheduledDate: new Date(Date.now() + 86400000 * 15), status: "pending", priority: "medium" },
  { id: "4", equipment: "Topping Bar Unit", type: "cleaning", description: "Weekly sanitization", assignee: "Cleaning Team", unit: "Tel Aviv Beach", scheduledDate: new Date(Date.now() + 86400000 * 3), status: "pending", priority: "low" },
];

const mockCleaning: CleaningSchedule[] = [
  { id: "1", area: "Yogurt Dispensers", unit: "Riyadh Airport T1", frequency: "Every 4 hours", lastCleaned: new Date(Date.now() - 3600000 * 2), nextCleaning: new Date(Date.now() + 3600000 * 2), assignee: "Ahmed", status: "done", photoRequired: true, hasPhoto: true },
  { id: "2", area: "Topping Bar", unit: "Dubai Mall", frequency: "Every 2 hours", lastCleaned: new Date(Date.now() - 3600000 * 3), nextCleaning: new Date(Date.now() - 3600000), assignee: "Sarah", status: "overdue", photoRequired: true, hasPhoto: false },
  { id: "3", area: "Floor & Seating", unit: "Tel Aviv Beach", frequency: "Every 4 hours", lastCleaned: new Date(Date.now() - 3600000 * 4), nextCleaning: new Date(), assignee: "Maria", status: "due", photoRequired: true, hasPhoto: false },
  { id: "4", area: "Customer Scales", unit: "Athens Airport", frequency: "Every shift", lastCleaned: new Date(Date.now() - 3600000 * 6), nextCleaning: new Date(Date.now() + 3600000 * 2), assignee: "Yuki", status: "done", photoRequired: false, hasPhoto: false },
];

export default function MaintenanceCommand() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const stats = {
    totalEquipment: mockEquipment.length,
    online: mockEquipment.filter((e) => e.status === "online").length,
    inMaintenance: mockEquipment.filter((e) => e.status === "maintenance").length,
    errors: mockEquipment.filter((e) => e.status === "error").length,
    avgUptime: (mockEquipment.reduce((sum, e) => sum + e.uptime, 0) / mockEquipment.length).toFixed(1),
    pendingTasks: mockTasks.filter((t) => t.status === "pending" || t.status === "in_progress").length,
    overdueCleaning: mockCleaning.filter((c) => c.status === "overdue").length,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Monitor },
    { id: "equipment", label: "Equipment", icon: Settings2 },
    { id: "maintenance", label: "Maintenance", icon: Wrench, badge: stats.pendingTasks },
    { id: "cleaning", label: "Cleaning", icon: Sparkles, badge: stats.overdueCleaning },
    { id: "kiosks", label: "Kiosks", icon: IceCream },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50/30">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/command-center">
              <LuxeIconButton icon={ArrowLeft} data-testid="back-btn" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Equipment & Maintenance
                </h1>
                <p className="text-sm text-neutral-500">Kiosk Health & Cleaning</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <LuxeButton icon={Plus} variant="gold" data-testid="btn-new-task">
                New Task
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
              data-testid="maintenance-tabs"
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
                  title="Total Equipment"
                  value={stats.totalEquipment}
                  change="Tracked devices"
                  changeType="neutral"
                  icon={Settings2}
                  data-testid="stat-equipment"
                />
                <LuxeStatCard
                  title="Online"
                  value={stats.online}
                  change="Operational"
                  changeType="positive"
                  icon={CircleCheck}
                  data-testid="stat-online"
                />
                <LuxeStatCard
                  title="Avg Uptime"
                  value={`${stats.avgUptime}%`}
                  change="Excellent"
                  changeType="positive"
                  icon={Activity}
                  data-testid="stat-uptime"
                />
                <LuxeStatCard
                  title="Errors"
                  value={stats.errors}
                  change="Need attention"
                  changeType={stats.errors > 0 ? "negative" : "positive"}
                  icon={AlertTriangle}
                  data-testid="stat-errors"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {stats.errors > 0 && (
                    <LuxeCard variant="default" className="p-6 border-l-4 border-red-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900">Equipment Errors</h3>
                          <p className="text-sm text-red-600">{stats.errors} device(s) need attention</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {mockEquipment.filter((e) => e.status === "error").map((eq) => (
                          <div key={eq.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900">{eq.name}</p>
                              <p className="text-sm text-neutral-500">{eq.unitName}</p>
                            </div>
                            <LuxeButton size="sm" variant="danger" icon={Wrench} data-testid={`btn-fix-${eq.id}`}>
                              Fix Now
                            </LuxeButton>
                          </div>
                        ))}
                      </div>
                    </LuxeCard>
                  )}

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Equipment Status</h3>
                      <LuxeButton variant="outline" size="sm" icon={Settings2} data-testid="btn-manage-all">
                        Manage All
                      </LuxeButton>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockEquipment.slice(0, 6).map((eq) => (
                        <div key={eq.id} className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                          <div className={cn(
                            "w-3 h-3 rounded-full animate-pulse",
                            statusColors[eq.status].dot
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{eq.name}</p>
                            <p className="text-xs text-neutral-500">{eq.unitName}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              statusColors[eq.status].bg,
                              statusColors[eq.status].text
                            )}>
                              {eq.status}
                            </span>
                            {eq.temperature && (
                              <p className="text-xs text-neutral-500 mt-1">{eq.temperature}°C</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Active Tasks</h3>
                      <LuxeBadge variant={stats.pendingTasks > 0 ? "warning" : "success"} dot>
                        {stats.pendingTasks} Active
                      </LuxeBadge>
                    </div>
                    <div className="space-y-3">
                      {mockTasks.filter((t) => t.status !== "completed").slice(0, 4).map((task) => (
                        <div key={task.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            task.priority === "critical" ? "bg-red-100 text-red-600" :
                            task.priority === "high" ? "bg-amber-100 text-amber-600" :
                            "bg-blue-100 text-blue-600"
                          )}>
                            {task.type === "emergency" ? <Zap className="w-5 h-5" /> :
                             task.type === "cleaning" ? <Sparkles className="w-5 h-5" /> :
                             <Wrench className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">{task.equipment}</p>
                            <p className="text-sm text-neutral-500">{task.description}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", priorityColors[task.priority])}>
                              {task.priority}
                            </span>
                            <p className="text-xs text-neutral-500 mt-1">{task.unit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gold" glow className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">System Health</h3>
                    <div className="text-center py-4">
                      <motion.div
                        className="relative inline-flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <svg className="w-32 h-32 -rotate-90">
                          <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e5e5" strokeWidth="12" />
                          <motion.circle
                            cx="64" cy="64" r="56" fill="none" stroke="url(#purpleGradient)" strokeWidth="12" strokeLinecap="round"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{ strokeDasharray: `${(parseFloat(stats.avgUptime) / 100) * 352} 352` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-2xl font-bold text-neutral-900">{stats.avgUptime}%</span>
                      </motion.div>
                      <p className="text-sm text-neutral-500 mt-2">Average Uptime</p>
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Cleaning Status</h3>
                    <div className="space-y-3">
                      {mockCleaning.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            item.status === "done" ? "bg-emerald-100 text-emerald-600" :
                            item.status === "overdue" ? "bg-red-100 text-red-600" :
                            "bg-amber-100 text-amber-600"
                          )}>
                            {item.status === "done" ? <CheckCircle2 className="w-4 h-4" /> :
                             item.status === "overdue" ? <AlertTriangle className="w-4 h-4" /> :
                             <Clock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 text-sm truncate">{item.area}</p>
                            <p className="text-xs text-neutral-500">{item.unit}</p>
                          </div>
                          {item.photoRequired && (
                            <Camera className={cn(
                              "w-4 h-4",
                              item.hasPhoto ? "text-emerald-500" : "text-neutral-300"
                            )} />
                          )}
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="dark" className="p-6">
                    <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <LuxeButton icon={Camera} variant="gold" fullWidth data-testid="btn-submit-photo">
                        Submit Photo Evidence
                      </LuxeButton>
                      <LuxeButton icon={Wrench} variant="outline" fullWidth data-testid="btn-log-maintenance">
                        Log Maintenance
                      </LuxeButton>
                      <LuxeButton icon={ClipboardList} variant="outline" fullWidth data-testid="btn-cleaning-checklist">
                        Cleaning Checklist
                      </LuxeButton>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "equipment" && (
            <motion.div
              key="equipment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                  <div className="flex-1 md:w-80">
                    <LuxeSearch
                      placeholder="Search equipment..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="equipment-search"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <LuxeButton icon={Filter} variant="outline" data-testid="btn-filters">Filters</LuxeButton>
                  <LuxeButton icon={Download} variant="outline" data-testid="btn-export">Export</LuxeButton>
                  <LuxeButton icon={Plus} variant="gold" data-testid="btn-add-equipment">Add Equipment</LuxeButton>
                </div>
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    {
                      key: "equipment",
                      header: "Equipment",
                      render: (row) => (
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                            row.type === "Dispenser" ? "bg-blue-500" :
                            row.type === "POS" ? "bg-purple-500" :
                            row.type === "Scale" ? "bg-amber-500" : "bg-neutral-500"
                          )}>
                            {row.type === "Dispenser" ? <IceCream className="w-5 h-5" /> :
                             row.type === "POS" ? <Monitor className="w-5 h-5" /> :
                             <Gauge className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{row.name}</p>
                            <p className="text-xs text-neutral-500">{row.model}</p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "location",
                      header: "Location",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm">{row.unitName}</span>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <div className="flex items-center gap-2 justify-center">
                          <div className={cn("w-2 h-2 rounded-full", statusColors[row.status].dot)} />
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[row.status].bg, statusColors[row.status].text)}>
                            {row.status}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "uptime",
                      header: "Uptime",
                      align: "center" as const,
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <LuxeProgress value={row.uptime} size="sm" />
                          <span className="text-sm font-medium">{row.uptime}%</span>
                        </div>
                      ),
                    },
                    {
                      key: "nextMaintenance",
                      header: "Next Maintenance",
                      render: (row) => (
                        <span className={cn(
                          "text-sm",
                          row.nextMaintenance < new Date() && "text-red-600 font-medium"
                        )}>
                          {row.nextMaintenance.toLocaleDateString()}
                        </span>
                      ),
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right" as const,
                      render: (row) => (
                        <div className="flex gap-1">
                          <LuxeIconButton icon={Eye} size="sm" data-testid={`btn-view-equipment-${row.id}`} />
                          <LuxeIconButton icon={Edit2} size="sm" data-testid={`btn-edit-equipment-${row.id}`} />
                          <LuxeIconButton icon={Wrench} size="sm" data-testid={`btn-maintain-${row.id}`} />
                        </div>
                      ),
                    },
                  ]}
                  data={mockEquipment}
                  data-testid="equipment-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "maintenance" && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Pending" value={mockTasks.filter((t) => t.status === "pending").length} icon={Clock} changeType="neutral" change="Scheduled" />
                <LuxeStatCard title="In Progress" value={mockTasks.filter((t) => t.status === "in_progress").length} icon={PlayCircle} changeType="neutral" change="Active" />
                <LuxeStatCard title="Completed" value={mockTasks.filter((t) => t.status === "completed").length} icon={CheckCircle2} changeType="positive" change="This month" />
                <LuxeStatCard title="Overdue" value={mockTasks.filter((t) => t.status === "overdue").length} icon={AlertTriangle} changeType="negative" change="Need attention" />
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    { key: "equipment", header: "Equipment" },
                    {
                      key: "type",
                      header: "Type",
                      render: (row) => (
                        <LuxeBadge variant={
                          row.type === "emergency" ? "danger" :
                          row.type === "scheduled" ? "default" :
                          row.type === "cleaning" ? "success" : "warning"
                        }>
                          {row.type}
                        </LuxeBadge>
                      ),
                    },
                    { key: "description", header: "Description" },
                    { key: "unit", header: "Unit" },
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
                          row.status === "completed" ? "success" :
                          row.status === "in_progress" ? "default" :
                          row.status === "overdue" ? "danger" : "warning"
                        }>
                          {row.status.replace("_", " ")}
                        </LuxeBadge>
                      ),
                    },
                    { key: "assignee", header: "Assignee" },
                  ]}
                  data={mockTasks}
                  data-testid="maintenance-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "cleaning" && (
            <motion.div
              key="cleaning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Completed" value={mockCleaning.filter((c) => c.status === "done").length} icon={CheckCircle2} changeType="positive" change="Today" />
                <LuxeStatCard title="Due Now" value={mockCleaning.filter((c) => c.status === "due").length} icon={Clock} changeType="neutral" change="Waiting" />
                <LuxeStatCard title="Overdue" value={mockCleaning.filter((c) => c.status === "overdue").length} icon={AlertTriangle} changeType="negative" change="Needs action" />
                <LuxeStatCard title="Photos Verified" value={mockCleaning.filter((c) => c.hasPhoto).length} icon={Camera} changeType="positive" change="With evidence" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Cleaning Schedule</h3>
                <div className="space-y-4">
                  {mockCleaning.map((item) => (
                    <div key={item.id} className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2",
                      item.status === "done" ? "bg-emerald-50 border-emerald-200" :
                      item.status === "overdue" ? "bg-red-50 border-red-200" :
                      "bg-amber-50 border-amber-200"
                    )}>
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                        item.status === "done" ? "bg-emerald-500" :
                        item.status === "overdue" ? "bg-red-500" : "bg-amber-500"
                      )}>
                        {item.status === "done" ? <CheckCircle2 className="w-6 h-6" /> :
                         item.status === "overdue" ? <AlertTriangle className="w-6 h-6" /> :
                         <Clock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-neutral-900">{item.area}</p>
                        <p className="text-sm text-neutral-500">{item.unit} • {item.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900">{item.assignee}</p>
                        <p className="text-xs text-neutral-500">
                          {item.status === "done" ? `Done ${item.lastCleaned.toLocaleTimeString()}` :
                           `Due ${item.nextCleaning.toLocaleTimeString()}`}
                        </p>
                      </div>
                      {item.photoRequired && (
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          item.hasPhoto ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-400"
                        )}>
                          <Camera className="w-5 h-5" />
                        </div>
                      )}
                      {item.status !== "done" && (
                        <LuxeButton size="sm" variant={item.status === "overdue" ? "danger" : "gold"} icon={CheckCircle2} data-testid={`btn-complete-${item.id}`}>
                          Complete
                        </LuxeButton>
                      )}
                    </div>
                  ))}
                </div>
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "kiosks" && (
            <motion.div
              key="kiosks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Riyadh Airport T1", status: "online", temp: -18, sales: 1250, customers: 87 },
                  { name: "Dubai Mall", status: "maintenance", temp: -16, sales: 980, customers: 65 },
                  { name: "Tel Aviv Beach", status: "online", temp: -17, sales: 1420, customers: 94 },
                  { name: "Athens Airport", status: "error", temp: null, sales: 0, customers: 0 },
                ].map((kiosk, idx) => (
                  <LuxeCard key={idx} variant="gradient" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full animate-pulse",
                          statusColors[kiosk.status].dot
                        )} />
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          statusColors[kiosk.status].bg,
                          statusColors[kiosk.status].text
                        )}>
                          {kiosk.status}
                        </span>
                      </div>
                      <LuxeIconButton icon={Settings2} size="sm" data-testid={`btn-settings-kiosk-${idx}`} />
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-4">{kiosk.name}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {kiosk.temp !== null && (
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-neutral-500">Temperature</p>
                          <p className="text-lg font-bold text-blue-600">{kiosk.temp}°C</p>
                        </div>
                      )}
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-xs text-neutral-500">Today's Sales</p>
                        <p className="text-lg font-bold text-emerald-600">${kiosk.sales}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl col-span-2">
                        <p className="text-xs text-neutral-500">Customers Today</p>
                        <p className="text-lg font-bold text-neutral-900">{kiosk.customers}</p>
                      </div>
                    </div>
                  </LuxeCard>
                ))}
              </div>
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
                    <h3 className="font-bold text-neutral-900">MTBF</h3>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">45 days</p>
                  <p className="text-sm text-emerald-600 mt-1">Mean Time Between Failures</p>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-neutral-900">MTTR</h3>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">2.4 hrs</p>
                  <p className="text-sm text-neutral-500 mt-1">Mean Time To Repair</p>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-neutral-900">Maintenance Cost</h3>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">$12,450</p>
                  <p className="text-sm text-amber-600 mt-1">This month</p>
                </LuxeCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
