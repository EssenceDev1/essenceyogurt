import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ThermometerSun,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Award,
  AlertCircle,
  Thermometer,
  Droplets,
  Scale,
  Eye,
  Camera,
  MapPin,
  Building2,
  ArrowLeft,
  RefreshCw,
  Plus,
  Download,
  Filter,
  Bell,
  Activity,
  TrendingUp,
  BadgeCheck,
  FileCheck,
  Flame,
  Snowflake,
  Bug,
  Leaf,
  CircleCheck,
} from "lucide-react";
import { Link } from "wouter";
import { LuxeCard, LuxeStatCard, LuxeAlertCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeSearch } from "@/components/ui/luxe-input";
import { CountryPicker, COUNTRIES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeProgress, LuxeAvatar } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";

interface TemperatureReading {
  id: string;
  unitId: string;
  unitName: string;
  equipmentName: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
  status: "ok" | "warning" | "critical";
  timestamp: Date;
}

interface ComplianceTask {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "quarterly";
  dueDate: Date;
  assignee: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  unit: string;
  category: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  country: string;
  issueDate: Date;
  expiryDate: Date;
  status: "valid" | "expiring_soon" | "expired";
  unit: string;
}

interface Inspection {
  id: string;
  type: string;
  inspector: string;
  unit: string;
  date: Date;
  score: number;
  maxScore: number;
  status: "passed" | "failed" | "pending";
  findings: number;
}

const temperatureReadings: TemperatureReading[] = [
  { id: "1", unitId: "SA-001", unitName: "Riyadh Airport T1", equipmentName: "Freezer Unit A", temperature: -18, minTemp: -22, maxTemp: -16, status: "ok", timestamp: new Date() },
  { id: "2", unitId: "AE-001", unitName: "Dubai Mall", equipmentName: "Freezer Unit B", temperature: -14, minTemp: -22, maxTemp: -16, status: "critical", timestamp: new Date() },
  { id: "3", unitId: "IL-001", unitName: "Tel Aviv Beach", equipmentName: "Display Cooler", temperature: 4, minTemp: 2, maxTemp: 6, status: "ok", timestamp: new Date() },
  { id: "4", unitId: "GR-001", unitName: "Athens Airport", equipmentName: "Freezer Unit A", temperature: -15, minTemp: -22, maxTemp: -16, status: "warning", timestamp: new Date() },
];

const complianceTasks: ComplianceTask[] = [
  { id: "1", title: "Daily Temperature Check", type: "daily", dueDate: new Date(), assignee: "Ahmed Al-Rashid", status: "completed", unit: "Riyadh Airport T1", category: "Food Safety" },
  { id: "2", title: "Weekly Equipment Sanitization", type: "weekly", dueDate: new Date(Date.now() + 86400000 * 2), assignee: "Sarah Chen", status: "pending", unit: "Dubai Mall", category: "Cleaning" },
  { id: "3", title: "Monthly HACCP Audit", type: "monthly", dueDate: new Date(Date.now() - 86400000), assignee: "Maria Santos", status: "overdue", unit: "Tel Aviv Beach", category: "HACCP" },
  { id: "4", title: "Quarterly Pest Control Inspection", type: "quarterly", dueDate: new Date(Date.now() + 86400000 * 15), assignee: "Yuki Tanaka", status: "pending", unit: "Athens Airport", category: "Pest Control" },
  { id: "5", title: "Daily Cleaning Checklist", type: "daily", dueDate: new Date(), assignee: "John Smith", status: "in_progress", unit: "Jeddah Mall", category: "Cleaning" },
];

const certifications: Certification[] = [
  { id: "1", name: "SFDA Food License", issuer: "Saudi Food & Drug Authority", country: "SA", issueDate: new Date(Date.now() - 86400000 * 180), expiryDate: new Date(Date.now() + 86400000 * 185), status: "valid", unit: "Riyadh Airport T1" },
  { id: "2", name: "Dubai Municipality Permit", issuer: "Dubai Municipality", country: "AE", issueDate: new Date(Date.now() - 86400000 * 90), expiryDate: new Date(Date.now() + 86400000 * 275), status: "valid", unit: "Dubai Mall" },
  { id: "3", name: "Kosher Certification", issuer: "Chief Rabbinate", country: "IL", issueDate: new Date(Date.now() - 86400000 * 300), expiryDate: new Date(Date.now() + 86400000 * 65), status: "expiring_soon", unit: "Tel Aviv Beach" },
  { id: "4", name: "EFET Food Safety", issuer: "Greek Food Authority", country: "GR", issueDate: new Date(Date.now() - 86400000 * 365), expiryDate: new Date(Date.now() - 86400000 * 5), status: "expired", unit: "Athens Airport" },
];

const inspections: Inspection[] = [
  { id: "1", type: "Health Inspection", inspector: "SFDA Inspector", unit: "Riyadh Airport T1", date: new Date(Date.now() - 86400000 * 30), score: 96, maxScore: 100, status: "passed", findings: 1 },
  { id: "2", type: "Fire Safety", inspector: "Civil Defense", unit: "Dubai Mall", date: new Date(Date.now() - 86400000 * 45), score: 100, maxScore: 100, status: "passed", findings: 0 },
  { id: "3", type: "HACCP Audit", inspector: "Internal Auditor", unit: "Tel Aviv Beach", date: new Date(Date.now() - 86400000 * 15), score: 88, maxScore: 100, status: "passed", findings: 3 },
  { id: "4", type: "Health Inspection", inspector: "EFET Inspector", unit: "Athens Airport", date: new Date(Date.now() + 86400000 * 5), score: 0, maxScore: 100, status: "pending", findings: 0 },
];

const taskStatusColors: Record<string, string> = {
  pending: "bg-neutral-100 text-neutral-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  overdue: "bg-red-100 text-red-700",
};

export default function ComplianceCommand() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const stats = {
    complianceScore: 96,
    pendingTasks: complianceTasks.filter((t) => t.status === "pending").length,
    overdueTasks: complianceTasks.filter((t) => t.status === "overdue").length,
    tempAlerts: temperatureReadings.filter((t) => t.status !== "ok").length,
    expiringCerts: certifications.filter((c) => c.status === "expiring_soon").length,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "haccp", label: "HACCP", icon: ThermometerSun },
    { id: "tasks", label: "Tasks", icon: ClipboardCheck, badge: stats.overdueTasks },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "inspections", label: "Inspections", icon: FileCheck },
    { id: "temperature", label: "Temperature", icon: Thermometer, badge: stats.tempAlerts },
    { id: "cleaning", label: "Cleaning", icon: Droplets },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/command-center">
              <LuxeIconButton icon={ArrowLeft} data-testid="back-btn" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Compliance Command
                </h1>
                <p className="text-sm text-neutral-500">Food Safety & HACCP</p>
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
              data-testid="compliance-tabs"
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
                  title="Compliance Score"
                  value={`${stats.complianceScore}%`}
                  change="Excellent"
                  changeType="positive"
                  icon={BadgeCheck}
                  data-testid="stat-score"
                />
                <LuxeStatCard
                  title="Pending Tasks"
                  value={stats.pendingTasks}
                  change="Due this week"
                  changeType="neutral"
                  icon={ClipboardCheck}
                  data-testid="stat-pending"
                />
                <LuxeStatCard
                  title="Overdue"
                  value={stats.overdueTasks}
                  change="Need attention"
                  changeType={stats.overdueTasks > 0 ? "negative" : "positive"}
                  icon={AlertTriangle}
                  data-testid="stat-overdue"
                />
                <LuxeStatCard
                  title="Temp Alerts"
                  value={stats.tempAlerts}
                  change="Active now"
                  changeType={stats.tempAlerts > 0 ? "negative" : "positive"}
                  icon={Thermometer}
                  data-testid="stat-temp"
                />
                <LuxeStatCard
                  title="Expiring Certs"
                  value={stats.expiringCerts}
                  change="Within 90 days"
                  changeType={stats.expiringCerts > 0 ? "negative" : "positive"}
                  icon={Award}
                  data-testid="stat-certs"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {stats.tempAlerts > 0 && (
                    <LuxeCard variant="default" className="p-6 border-l-4 border-red-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <Thermometer className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-900">Temperature Alerts</h3>
                          <p className="text-sm text-red-600">{stats.tempAlerts} unit(s) out of range</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {temperatureReadings.filter((t) => t.status !== "ok").map((reading) => (
                          <div key={reading.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                              reading.status === "critical" ? "bg-red-500" : "bg-amber-500"
                            )}>
                              {reading.temperature}°C
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900">{reading.equipmentName}</p>
                              <p className="text-sm text-neutral-500">{reading.unitName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-neutral-500">Range: {reading.minTemp}°C to {reading.maxTemp}°C</p>
                              <LuxeBadge variant={reading.status === "critical" ? "danger" : "warning"}>
                                {reading.status}
                              </LuxeBadge>
                            </div>
                            <LuxeButton size="sm" variant="outline" icon={Eye} data-testid={`btn-view-temp-${reading.id}`}>
                              View
                            </LuxeButton>
                          </div>
                        ))}
                      </div>
                    </LuxeCard>
                  )}

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Upcoming Tasks</h3>
                      <LuxeButton variant="outline" size="sm" icon={ClipboardCheck} data-testid="btn-view-all-tasks">
                        View All
                      </LuxeButton>
                    </div>
                    <div className="space-y-3">
                      {complianceTasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            task.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                            task.status === "overdue" ? "bg-red-100 text-red-600" :
                            task.status === "in_progress" ? "bg-blue-100 text-blue-600" :
                            "bg-neutral-100 text-neutral-600"
                          )}>
                            {task.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> :
                             task.status === "overdue" ? <AlertCircle className="w-5 h-5" /> :
                             <Clock className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">{task.title}</p>
                            <p className="text-sm text-neutral-500">{task.unit} • {task.assignee}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-neutral-900">{task.dueDate.toLocaleDateString()}</p>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", taskStatusColors[task.status])}>
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Recent Inspections</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inspections.slice(0, 4).map((inspection) => (
                        <div key={inspection.id} className="p-4 border border-neutral-200 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <LuxeBadge variant={
                              inspection.status === "passed" ? "success" :
                              inspection.status === "failed" ? "danger" : "default"
                            }>
                              {inspection.status}
                            </LuxeBadge>
                            <span className="text-sm text-neutral-500">{inspection.date.toLocaleDateString()}</span>
                          </div>
                          <p className="font-medium text-neutral-900">{inspection.type}</p>
                          <p className="text-sm text-neutral-500 mb-3">{inspection.unit}</p>
                          {inspection.status !== "pending" && (
                            <div className="flex items-center gap-2">
                              <LuxeProgress value={(inspection.score / inspection.maxScore) * 100} />
                              <span className="text-sm font-bold">{inspection.score}/{inspection.maxScore}</span>
                            </div>
                          )}
                        </div>
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
                        <p className="text-xs text-neutral-500">All units average</p>
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
                          <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e5e5" strokeWidth="12" />
                          <motion.circle
                            cx="64" cy="64" r="56" fill="none" stroke="url(#blueGradient)" strokeWidth="12" strokeLinecap="round"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{ strokeDasharray: `${(stats.complianceScore / 100) * 352} 352` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="absolute text-3xl font-bold text-neutral-900">{stats.complianceScore}%</span>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Food Safety", value: 98 },
                        { label: "Cleanliness", value: 95 },
                        { label: "Documentation", value: 92 },
                        { label: "Staff Training", value: 97 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neutral-600">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <LuxeProgress value={item.value} size="sm" />
                            <span className="text-xs font-bold text-neutral-900 w-10 text-right">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Certifications Status</h3>
                    <div className="space-y-3">
                      {certifications.slice(0, 4).map((cert) => (
                        <div key={cert.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            cert.status === "valid" ? "bg-emerald-100 text-emerald-600" :
                            cert.status === "expiring_soon" ? "bg-amber-100 text-amber-600" :
                            "bg-red-100 text-red-600"
                          )}>
                            <Award className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 text-sm truncate">{cert.name}</p>
                            <p className="text-xs text-neutral-500">{cert.unit}</p>
                          </div>
                          <LuxeBadge variant={
                            cert.status === "valid" ? "success" :
                            cert.status === "expiring_soon" ? "warning" : "danger"
                          }>
                            {cert.status.replace("_", " ")}
                          </LuxeBadge>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="dark" className="p-6">
                    <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <LuxeButton icon={Camera} variant="gold" fullWidth data-testid="btn-submit-evidence">
                        Submit Evidence
                      </LuxeButton>
                      <LuxeButton icon={Thermometer} variant="outline" fullWidth data-testid="btn-log-temp">
                        Log Temperature
                      </LuxeButton>
                      <LuxeButton icon={ClipboardCheck} variant="outline" fullWidth data-testid="btn-start-checklist">
                        Start Checklist
                      </LuxeButton>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "temperature" && (
            <motion.div
              key="temperature"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Monitored Units" value={temperatureReadings.length} icon={Thermometer} changeType="neutral" change="Active sensors" />
                <LuxeStatCard title="In Range" value={temperatureReadings.filter((t) => t.status === "ok").length} icon={CheckCircle2} changeType="positive" change="Normal" />
                <LuxeStatCard title="Warnings" value={temperatureReadings.filter((t) => t.status === "warning").length} icon={AlertTriangle} changeType="neutral" change="Near limit" />
                <LuxeStatCard title="Critical" value={temperatureReadings.filter((t) => t.status === "critical").length} icon={XCircle} changeType="negative" change="Immediate action" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Live Temperature Readings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {temperatureReadings.map((reading) => (
                    <div key={reading.id} className={cn(
                      "p-6 rounded-2xl border-2",
                      reading.status === "ok" ? "border-emerald-200 bg-emerald-50" :
                      reading.status === "warning" ? "border-amber-200 bg-amber-50" :
                      "border-red-200 bg-red-50"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-neutral-900">{reading.equipmentName}</p>
                          <p className="text-sm text-neutral-500">{reading.unitName}</p>
                        </div>
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl",
                          reading.status === "ok" ? "bg-emerald-500" :
                          reading.status === "warning" ? "bg-amber-500" : "bg-red-500"
                        )}>
                          {reading.temperature}°C
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Snowflake className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{reading.minTemp}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-red-500" />
                            <span className="text-sm">{reading.maxTemp}°C</span>
                          </div>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {reading.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <LuxeSearch
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-task-search"
                />
                <LuxeButton icon={Plus} variant="gold" data-testid="btn-create-task">Create Task</LuxeButton>
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    {
                      key: "task",
                      header: "Task",
                      render: (row) => (
                        <div>
                          <p className="font-medium text-neutral-900">{row.title}</p>
                          <p className="text-xs text-neutral-500">{row.category}</p>
                        </div>
                      ),
                    },
                    { key: "unit", header: "Unit" },
                    { key: "assignee", header: "Assignee" },
                    {
                      key: "type",
                      header: "Frequency",
                      render: (row) => <LuxeBadge variant="default">{row.type}</LuxeBadge>,
                    },
                    {
                      key: "due",
                      header: "Due Date",
                      render: (row) => <span>{row.dueDate.toLocaleDateString()}</span>,
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", taskStatusColors[row.status])}>
                          {row.status.replace("_", " ")}
                        </span>
                      ),
                    },
                  ]}
                  data={complianceTasks}
                  data-testid="tasks-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "certifications" && (
            <motion.div
              key="certifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert) => (
                  <LuxeCard key={cert.id} variant="gradient" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        cert.status === "valid" ? "bg-emerald-100 text-emerald-600" :
                        cert.status === "expiring_soon" ? "bg-amber-100 text-amber-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        <Award className="w-6 h-6" />
                      </div>
                      <LuxeBadge variant={
                        cert.status === "valid" ? "success" :
                        cert.status === "expiring_soon" ? "warning" : "danger"
                      }>
                        {cert.status.replace("_", " ")}
                      </LuxeBadge>
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-1">{cert.name}</h3>
                    <p className="text-sm text-neutral-500 mb-4">{cert.issuer}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Unit</span>
                        <span className="font-medium">{cert.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Country</span>
                        <span>{COUNTRIES.find((c) => c.value === cert.country)?.icon} {cert.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Expires</span>
                        <span className={cn(
                          "font-medium",
                          cert.status === "expired" ? "text-red-600" :
                          cert.status === "expiring_soon" ? "text-amber-600" : ""
                        )}>
                          {cert.expiryDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <LuxeButton variant="outline" size="sm" fullWidth icon={Eye} data-testid={`btn-view-cert-${cert.id}`}>
                      View Certificate
                    </LuxeButton>
                  </LuxeCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "inspections" && (
            <motion.div
              key="inspections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    { key: "type", header: "Inspection Type" },
                    { key: "unit", header: "Unit" },
                    { key: "inspector", header: "Inspector" },
                    {
                      key: "date",
                      header: "Date",
                      render: (row) => <span>{row.date.toLocaleDateString()}</span>,
                    },
                    {
                      key: "score",
                      header: "Score",
                      align: "center" as const,
                      render: (row) => (
                        row.status === "pending" ? (
                          <span className="text-neutral-400">-</span>
                        ) : (
                          <span className={cn(
                            "font-bold",
                            row.score >= 90 ? "text-emerald-600" :
                            row.score >= 70 ? "text-amber-600" : "text-red-600"
                          )}>
                            {row.score}/{row.maxScore}
                          </span>
                        )
                      ),
                    },
                    {
                      key: "findings",
                      header: "Findings",
                      align: "center" as const,
                      render: (row) => row.findings || "-",
                    },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge variant={
                          row.status === "passed" ? "success" :
                          row.status === "failed" ? "danger" : "default"
                        }>
                          {row.status}
                        </LuxeBadge>
                      ),
                    },
                  ]}
                  data={inspections}
                  data-testid="inspections-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "haccp" && (
            <motion.div
              key="haccp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-neutral-900">Critical Control Points</h3>
                  </div>
                  <div className="space-y-3">
                    {["Temperature Control", "Time/Temperature", "Cross-Contamination", "Personal Hygiene"].map((ccp) => (
                      <div key={ccp} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <CircleCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium">{ccp}</span>
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-neutral-900">Documentation</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "HACCP Plan", status: "current" },
                      { name: "Flow Diagrams", status: "current" },
                      { name: "Hazard Analysis", status: "current" },
                      { name: "Monitoring Records", status: "current" },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <span className="text-sm font-medium">{doc.name}</span>
                        <LuxeBadge variant="success">{doc.status}</LuxeBadge>
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="gradient" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Bug className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-neutral-900">Pest Control</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-xl">
                      <p className="text-sm font-medium">Last Inspection</p>
                      <p className="text-lg font-bold text-neutral-900">Nov 15, 2025</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl">
                      <p className="text-sm font-medium">Next Scheduled</p>
                      <p className="text-lg font-bold text-neutral-900">Dec 15, 2025</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-sm font-medium text-emerald-700">Status: All Clear</p>
                    </div>
                  </div>
                </LuxeCard>
              </div>
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
                <LuxeStatCard title="Today's Tasks" value={8} icon={Droplets} changeType="neutral" change="Scheduled" />
                <LuxeStatCard title="Completed" value={6} icon={CheckCircle2} changeType="positive" change="75%" />
                <LuxeStatCard title="In Progress" value={2} icon={Clock} changeType="neutral" change="Active" />
                <LuxeStatCard title="Photos Required" value={3} icon={Camera} changeType="neutral" change="Pending" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Cleaning Schedule</h3>
                <div className="space-y-4">
                  {[
                    { task: "Yogurt Dispenser Sanitization", time: "06:00", unit: "Riyadh Airport", assignee: "Ahmed", status: "completed", photo: true },
                    { task: "Floor Deep Clean", time: "14:00", unit: "Dubai Mall", assignee: "Sarah", status: "completed", photo: true },
                    { task: "Topping Bar Sanitization", time: "22:00", unit: "Tel Aviv Beach", assignee: "Maria", status: "in_progress", photo: false },
                    { task: "Display Case Cleaning", time: "18:00", unit: "Athens Airport", assignee: "Yuki", status: "pending", photo: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        item.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                        item.status === "in_progress" ? "bg-blue-100 text-blue-600" :
                        "bg-neutral-100 text-neutral-600"
                      )}>
                        {item.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> :
                         item.status === "in_progress" ? <Clock className="w-5 h-5" /> :
                         <Droplets className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{item.task}</p>
                        <p className="text-sm text-neutral-500">{item.unit} • {item.assignee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900">{item.time}</p>
                        {item.photo && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <Camera className="w-3 h-3" />
                            Photo verified
                          </span>
                        )}
                      </div>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", taskStatusColors[item.status])}>
                        {item.status.replace("_", " ")}
                      </span>
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
