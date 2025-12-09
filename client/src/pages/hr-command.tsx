import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  UserPlus,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Building2,
  Briefcase,
  ChevronRight,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Camera,
  Globe,
  ArrowLeft,
  Play,
  Pause,
  Timer,
  TrendingUp,
  UserCheck,
  UserX,
  CalendarDays,
  Banknote,
  GraduationCap,
  Shield,
  Star,
  FileText,
  Clipboard,
  AlertOctagon,
  ShieldAlert,
  HeartPulse,
  Scale,
  MessageSquareWarning,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { LuxeCard, LuxeStatCard, LuxeAlertCard } from "@/components/ui/luxe-card";
import { LuxeButton, LuxeTabs, LuxeIconButton } from "@/components/ui/luxe-button";
import { LuxeInput, LuxeSearch } from "@/components/ui/luxe-input";
import { LuxeScrollPicker, CountryPicker, LuxeDatePicker, COUNTRIES } from "@/components/ui/luxe-scroll-picker";
import { LuxeTable, LuxeBadge, LuxeAvatar, LuxeProgress } from "@/components/ui/luxe-table";
import { cn } from "@/lib/utils";
import type { Employee, ShiftAssignment, LeaveRequest, TimesheetEntry } from "@shared/schema";

interface EmployeeWithDetails extends Employee {
  shiftStatus?: "on_duty" | "off_duty" | "on_break" | "late";
  currentShift?: string;
  hoursThisWeek?: number;
}

interface LeaveRequestWithEmployee extends LeaveRequest {
  employeeName?: string;
  employeeRole?: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  regional_manager: "bg-blue-100 text-blue-700",
  manager: "bg-indigo-100 text-indigo-700",
  supervisor: "bg-emerald-100 text-emerald-700",
  barista: "bg-amber-100 text-amber-700",
};

const shiftStatusColors: Record<string, string> = {
  on_duty: "bg-emerald-500",
  off_duty: "bg-neutral-400",
  on_break: "bg-amber-500",
  late: "bg-red-500",
};

export default function HRCommand() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithDetails | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading: employeesLoading } = useQuery<EmployeeWithDetails[]>({
    queryKey: ["/api/employees"],
  });

  const { data: shifts = [] } = useQuery<ShiftAssignment[]>({
    queryKey: ["/api/shift-assignments"],
  });

  const { data: leaveRequests = [] } = useQuery<LeaveRequestWithEmployee[]>({
    queryKey: ["/api/leave-requests"],
  });

  const { data: timesheets = [] } = useQuery<TimesheetEntry[]>({
    queryKey: ["/api/timesheet-entries"],
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !searchQuery ||
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = !selectedCountry || emp.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const stats = {
    totalEmployees: employees.length,
    activeToday: employees.filter((e) => e.isActive).length,
    onLeave: leaveRequests.filter((l) => l.status === "approved").length,
    pendingRequests: leaveRequests.filter((l) => l.status === "pending").length,
    onDuty: 32,
    lateArrivals: 2,
    overtime: 5,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "recruiting", label: "Recruiting AI", icon: Star },
    { id: "employees", label: "Employees", icon: UserPlus },
    { id: "scheduling", label: "Scheduling", icon: Calendar },
    { id: "timesheets", label: "Timesheets", icon: Clock },
    { id: "leave", label: "Leave", icon: CalendarDays, badge: stats.pendingRequests },
    { id: "payroll", label: "Payroll", icon: Banknote },
    { id: "training", label: "Training", icon: GraduationCap },
    { id: "policies", label: "Policies", icon: FileText },
    { id: "onboarding", label: "Onboarding", icon: Sparkles },
    { id: "protocols", label: "Protocols", icon: Clipboard },
    { id: "safety", label: "Safety", icon: HeartPulse },
    { id: "conduct", label: "Conduct", icon: Scale },
    { id: "whistleblower", label: "Whistleblower", icon: MessageSquareWarning },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-[#d4af37]/5">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/command-center">
              <LuxeIconButton icon={ArrowLeft} data-testid="back-btn" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-neutral-900">
                  HR Command Center
                </h1>
                <p className="text-sm text-neutral-500">Global Workforce Management</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <LuxeTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="underline"
              data-testid="hr-tabs"
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
                  title="Total Employees"
                  value={stats.totalEmployees || 124}
                  change="+3 this month"
                  changeType="positive"
                  icon={Users}
                  data-testid="stat-employees"
                />
                <LuxeStatCard
                  title="On Duty Now"
                  value={stats.onDuty}
                  change="Full coverage"
                  changeType="positive"
                  icon={UserCheck}
                  data-testid="stat-on-duty"
                />
                <LuxeStatCard
                  title="On Leave"
                  value={stats.onLeave || 3}
                  change={`${stats.pendingRequests} pending`}
                  changeType="neutral"
                  icon={CalendarDays}
                  data-testid="stat-leave"
                />
                <LuxeStatCard
                  title="Late Arrivals"
                  value={stats.lateArrivals}
                  change="Today"
                  changeType={stats.lateArrivals > 0 ? "negative" : "positive"}
                  icon={AlertTriangle}
                  data-testid="stat-late"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-neutral-900">Staff on Duty</h2>
                      <LuxeBadge variant="success" dot>Live</LuxeBadge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Ahmed Al-Rashid", role: "Supervisor", unit: "Riyadh Airport", status: "on_duty", hours: "6h 23m" },
                        { name: "Sarah Chen", role: "Barista", unit: "Dubai Mall", status: "on_duty", hours: "4h 12m" },
                        { name: "Maria Santos", role: "Barista", unit: "Tel Aviv Beach", status: "on_break", hours: "5h 45m" },
                        { name: "Yuki Tanaka", role: "Manager", unit: "Athens Airport", status: "on_duty", hours: "7h 01m" },
                      ].map((staff, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                          data-testid={`staff-${idx}`}
                        >
                          <div className="relative">
                            <LuxeAvatar name={staff.name} size="md" />
                            <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white", shiftStatusColors[staff.status])} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{staff.name}</p>
                            <p className="text-xs text-neutral-500">{staff.role} • {staff.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">{staff.hours}</p>
                            <p className="text-xs text-neutral-500 capitalize">{staff.status.replace("_", " ")}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <LuxeButton variant="outline" fullWidth className="mt-4">
                      View All Staff
                    </LuxeButton>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h2 className="text-lg font-bold text-neutral-900 mb-4">Today's Schedule</h2>
                    <div className="space-y-3">
                      {[
                        { time: "06:00 - 14:00", name: "Morning Shift", staff: 12, coverage: 100 },
                        { time: "14:00 - 22:00", name: "Afternoon Shift", staff: 14, coverage: 100 },
                        { time: "22:00 - 06:00", name: "Night Shift", staff: 6, coverage: 85 },
                      ].map((shift, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl" data-testid={`shift-${idx}`}>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c5a059] flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-neutral-900">{shift.name}</p>
                              <LuxeBadge variant={shift.coverage === 100 ? "success" : "warning"}>
                                {shift.coverage}% Coverage
                              </LuxeBadge>
                            </div>
                            <p className="text-sm text-neutral-500">{shift.time} • {shift.staff} staff</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gold" glow className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <LuxeButton icon={UserPlus} variant="outline" fullWidth onClick={() => setShowAddEmployee(true)}>
                        Add Employee
                      </LuxeButton>
                      <LuxeButton icon={Calendar} variant="outline" fullWidth>
                        Create Shift
                      </LuxeButton>
                      <LuxeButton icon={ClipboardList} variant="outline" fullWidth>
                        View Timesheets
                      </LuxeButton>
                      <LuxeButton icon={DollarSign} variant="outline" fullWidth>
                        Process Payroll
                      </LuxeButton>
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Pending Approvals</h3>
                    <div className="space-y-3">
                      <LuxeAlertCard
                        title="Leave Request"
                        message="John Smith - 3 days vacation"
                        severity="warning"
                        timestamp="2 hours ago"
                        data-testid="pending-1"
                      />
                      <LuxeAlertCard
                        title="Overtime Request"
                        message="Maria Garcia - 4 extra hours"
                        severity="info"
                        timestamp="4 hours ago"
                        data-testid="pending-2"
                      />
                      <LuxeAlertCard
                        title="Shift Swap"
                        message="Ahmed requesting swap with Sarah"
                        severity="info"
                        timestamp="Yesterday"
                        data-testid="pending-3"
                      />
                    </div>
                    <LuxeButton variant="gold" fullWidth className="mt-4">
                      Review All ({stats.pendingRequests + 3})
                    </LuxeButton>
                  </LuxeCard>

                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Workforce by Country</h3>
                    <div className="space-y-3">
                      {[
                        { country: "SA", name: "Saudi Arabia", count: 45, flag: "🇸🇦" },
                        { country: "AE", name: "UAE", count: 38, flag: "🇦🇪" },
                        { country: "IL", name: "Israel", count: 28, flag: "🇮🇱" },
                        { country: "GR", name: "Greece", count: 13, flag: "🇬🇷" },
                      ].map((c) => (
                        <div key={c.country} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{c.flag}</span>
                            <span className="text-sm font-medium text-neutral-700">{c.name}</span>
                          </div>
                          <span className="text-sm font-bold text-neutral-900">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "recruiting" && <RecruitingAITab />}

          {activeTab === "employees" && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-1 gap-3 w-full md:w-auto">
                  <div className="flex-1 md:w-80">
                    <LuxeSearch
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="employee-search"
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
                  <LuxeButton icon={Download} variant="outline">Export</LuxeButton>
                  <LuxeButton icon={UserPlus} variant="gold" onClick={() => setShowAddEmployee(true)}>
                    Add Employee
                  </LuxeButton>
                </div>
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <LuxeTable
                  columns={[
                    {
                      key: "employee",
                      header: "Employee",
                      render: (row) => (
                        <div className="flex items-center gap-3">
                          <LuxeAvatar
                            name={row.fullName}
                            size="md"
                            status={row.isActive ? "online" : "offline"}
                          />
                          <div>
                            <p className="font-medium text-neutral-900">{row.fullName}</p>
                            <p className="text-xs text-neutral-500">{row.employeeCode}</p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "role",
                      header: "Role",
                      render: (row) => (
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", roleColors[row.role] || "bg-neutral-100 text-neutral-700")}>
                          {row.role.replace("_", " ").toUpperCase()}
                        </span>
                      ),
                    },
                    {
                      key: "location",
                      header: "Location",
                      render: (row) => (
                        <div className="flex items-center gap-2">
                          <span>{COUNTRIES.find(c => c.value === row.country)?.icon || "🌍"}</span>
                          <span className="text-sm text-neutral-600">{row.city || row.country}</span>
                        </div>
                      ),
                    },
                    { key: "email", header: "Email" },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge variant={row.isActive ? "success" : "danger"} dot>
                          {row.isActive ? "Active" : "Inactive"}
                        </LuxeBadge>
                      ),
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right" as const,
                      render: (row) => (
                        <div className="flex items-center gap-1">
                          <LuxeIconButton icon={Eye} size="sm" onClick={() => setSelectedEmployee(row)} />
                          <LuxeIconButton icon={Edit2} size="sm" />
                          <LuxeIconButton icon={MoreHorizontal} size="sm" />
                        </div>
                      ),
                    },
                  ]}
                  data={(filteredEmployees.length > 0 ? filteredEmployees : [
                    { id: "1", employeeCode: "EMP-001", fullName: "Ahmed Al-Rashid", role: "supervisor", country: "SA", city: "Riyadh", email: "ahmed@essence.com", isActive: true, phone: "+966", essenceUnitId: null, hourlyRate: null, currency: "SAR", employmentType: "full_time", hireDate: new Date(), terminationDate: null, emergencyContactName: null, emergencyContactPhone: null, notes: null, createdAt: new Date() },
                    { id: "2", employeeCode: "EMP-002", fullName: "Sarah Chen", role: "barista", country: "AE", city: "Dubai", email: "sarah@essence.com", isActive: true, phone: "+971", essenceUnitId: null, hourlyRate: null, currency: "AED", employmentType: "full_time", hireDate: new Date(), terminationDate: null, emergencyContactName: null, emergencyContactPhone: null, notes: null, createdAt: new Date() },
                    { id: "3", employeeCode: "EMP-003", fullName: "Maria Santos", role: "barista", country: "IL", city: "Tel Aviv", email: "maria@essence.com", isActive: true, phone: "+972", essenceUnitId: null, hourlyRate: null, currency: "ILS", employmentType: "full_time", hireDate: new Date(), terminationDate: null, emergencyContactName: null, emergencyContactPhone: null, notes: null, createdAt: new Date() },
                    { id: "4", employeeCode: "EMP-004", fullName: "Yuki Tanaka", role: "manager", country: "GR", city: "Athens", email: "yuki@essence.com", isActive: true, phone: "+30", essenceUnitId: null, hourlyRate: null, currency: "EUR", employmentType: "full_time", hireDate: new Date(), terminationDate: null, emergencyContactName: null, emergencyContactPhone: null, notes: null, createdAt: new Date() },
                    { id: "5", employeeCode: "EMP-005", fullName: "James Wilson", role: "regional_manager", country: "SA", city: "Jeddah", email: "james@essence.com", isActive: true, phone: "+966", essenceUnitId: null, hourlyRate: null, currency: "SAR", employmentType: "full_time", hireDate: new Date(), terminationDate: null, emergencyContactName: null, emergencyContactPhone: null, notes: null, createdAt: new Date() },
                    { id: "6", employeeCode: "EMP-006", fullName: "Fatima Hassan", role: "barista", country: "AE", city: "Abu Dhabi", email: "fatima@essence.com", isActive: false, phone: "+971", essenceUnitId: null, hourlyRate: null, currency: "AED", employmentType: "full_time", hireDate: new Date(), terminationDate: null, emergencyContactName: null, emergencyContactPhone: null, notes: null, createdAt: new Date() },
                  ]) as EmployeeWithDetails[]}
                  data-testid="employees-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "scheduling" && (
            <motion.div
              key="scheduling"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <LuxeDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  label="Select Date"
                  data-testid="schedule-date"
                />
                <div className="flex gap-2">
                  <LuxeButton icon={Calendar} variant="gold">Create Shift</LuxeButton>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Morning Shift", time: "06:00 - 14:00", slots: 12, filled: 12 },
                  { name: "Afternoon Shift", time: "14:00 - 22:00", slots: 14, filled: 12 },
                  { name: "Night Shift", time: "22:00 - 06:00", slots: 6, filled: 5 },
                ].map((shift, idx) => (
                  <LuxeCard key={idx} variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-neutral-900">{shift.name}</h3>
                        <p className="text-sm text-neutral-500">{shift.time}</p>
                      </div>
                      <LuxeBadge variant={shift.filled === shift.slots ? "success" : "warning"}>
                        {shift.filled}/{shift.slots}
                      </LuxeBadge>
                    </div>
                    <div className="mb-4">
                      <LuxeProgress value={(shift.filled / shift.slots) * 100} />
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: Math.min(4, shift.filled) }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <LuxeAvatar name={`Employee ${i + 1}`} size="sm" />
                          <span className="text-neutral-600">Employee {i + 1}</span>
                        </div>
                      ))}
                      {shift.filled > 4 && (
                        <p className="text-xs text-neutral-500">+{shift.filled - 4} more</p>
                      )}
                    </div>
                    <LuxeButton variant="outline" size="sm" fullWidth className="mt-4">
                      Manage Shift
                    </LuxeButton>
                  </LuxeCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "timesheets" && (
            <motion.div
              key="timesheets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Clocked In" value={32} icon={Play} changeType="positive" change="Active now" />
                <LuxeStatCard title="Total Hours" value="847h" icon={Timer} changeType="neutral" change="This week" />
                <LuxeStatCard title="Overtime" value="24h" icon={TrendingUp} changeType="neutral" change="This week" />
                <LuxeStatCard title="Pending Approval" value={8} icon={ClipboardList} changeType="neutral" change="Needs review" />
              </div>

              <LuxeCard variant="default" className="overflow-hidden">
                <div className="p-4 border-b border-neutral-100">
                  <h3 className="font-bold text-neutral-900">Recent Timesheets</h3>
                </div>
                <LuxeTable
                  columns={[
                    {
                      key: "employee",
                      header: "Employee",
                      render: (row) => (
                        <div className="flex items-center gap-3">
                          <LuxeAvatar name={row.name} size="sm" />
                          <span className="font-medium text-neutral-900">{row.name}</span>
                        </div>
                      ),
                    },
                    { key: "date", header: "Date" },
                    { key: "clockIn", header: "Clock In" },
                    { key: "clockOut", header: "Clock Out" },
                    { key: "hours", header: "Hours", align: "right" as const },
                    {
                      key: "status",
                      header: "Status",
                      align: "center" as const,
                      render: (row) => (
                        <LuxeBadge
                          variant={
                            row.status === "approved"
                              ? "success"
                              : row.status === "pending"
                              ? "warning"
                              : "default"
                          }
                        >
                          {row.status}
                        </LuxeBadge>
                      ),
                    },
                    {
                      key: "actions",
                      header: "",
                      align: "right" as const,
                      render: () => (
                        <div className="flex gap-1">
                          <LuxeIconButton icon={CheckCircle2} size="sm" variant="ghost" />
                          <LuxeIconButton icon={XCircle} size="sm" variant="ghost" />
                        </div>
                      ),
                    },
                  ]}
                  data={[
                    { name: "Ahmed Al-Rashid", date: "Nov 29", clockIn: "06:02", clockOut: "14:15", hours: "8h 13m", status: "approved" },
                    { name: "Sarah Chen", date: "Nov 29", clockIn: "14:05", clockOut: "-", hours: "4h 32m", status: "active" },
                    { name: "Maria Santos", date: "Nov 29", clockIn: "06:00", clockOut: "14:00", hours: "8h 00m", status: "pending" },
                    { name: "Yuki Tanaka", date: "Nov 28", clockIn: "22:00", clockOut: "06:05", hours: "8h 05m", status: "approved" },
                  ]}
                  data-testid="timesheets-table"
                />
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "leave" && (
            <motion.div
              key="leave"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LuxeStatCard title="Pending Requests" value={stats.pendingRequests || 5} icon={Clock} changeType="neutral" change="Awaiting approval" />
                <LuxeStatCard title="On Leave Today" value={3} icon={CalendarDays} changeType="neutral" change="Covered" />
                <LuxeStatCard title="Upcoming Leave" value={8} icon={Calendar} changeType="neutral" change="Next 7 days" />
              </div>

              <LuxeCard variant="default" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-neutral-900">Leave Requests</h3>
                  <LuxeTabs
                    tabs={[
                      { id: "pending", label: "Pending" },
                      { id: "approved", label: "Approved" },
                      { id: "all", label: "All" },
                    ]}
                    activeTab="pending"
                    onChange={() => {}}
                    variant="pills"
                    data-testid="leave-filter-tabs"
                  />
                </div>
                <div className="space-y-4">
                  {[
                    { name: "John Smith", type: "Vacation", dates: "Dec 1-3", reason: "Family trip", status: "pending" },
                    { name: "Emily Brown", type: "Sick Leave", dates: "Nov 30", reason: "Doctor appointment", status: "pending" },
                    { name: "Michael Lee", type: "Personal", dates: "Dec 5", reason: "Personal matters", status: "pending" },
                  ].map((req, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl"
                      data-testid={`leave-request-${idx}`}
                    >
                      <LuxeAvatar name={req.name} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900">{req.name}</p>
                          <LuxeBadge variant="default">{req.type}</LuxeBadge>
                        </div>
                        <p className="text-sm text-neutral-500">{req.dates} • {req.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <LuxeButton size="sm" variant="outline" icon={XCircle}>Reject</LuxeButton>
                        <LuxeButton size="sm" variant="gold" icon={CheckCircle2}>Approve</LuxeButton>
                      </div>
                    </motion.div>
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
                <LuxeStatCard title="Total Payroll" value="$284K" icon={DollarSign} changeType="neutral" change="This month" />
                <LuxeStatCard title="Pending" value="$45K" icon={Clock} changeType="neutral" change="To process" />
                <LuxeStatCard title="Employees" value={124} icon={Users} changeType="neutral" change="Active" />
                <LuxeStatCard title="Next Payout" value="Dec 1" icon={Calendar} changeType="neutral" change="In 2 days" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LuxeCard variant="gradient" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Payroll by Country</h3>
                  <div className="space-y-4">
                    {[
                      { country: "Saudi Arabia", amount: "$98,000", employees: 45, flag: "🇸🇦" },
                      { country: "UAE", amount: "$82,000", employees: 38, flag: "🇦🇪" },
                      { country: "Israel", amount: "$67,000", employees: 28, flag: "🇮🇱" },
                      { country: "Greece", amount: "$37,000", employees: 13, flag: "🇬🇷" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.flag}</span>
                          <div>
                            <p className="font-medium text-neutral-900">{item.country}</p>
                            <p className="text-xs text-neutral-500">{item.employees} employees</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-neutral-900">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="default" className="p-6">
                  <h3 className="font-bold text-neutral-900 mb-4">Recent Payouts</h3>
                  <div className="space-y-3">
                    {[
                      { period: "November 2025", amount: "$276,400", status: "paid", date: "Nov 28" },
                      { period: "October 2025", amount: "$268,200", status: "paid", date: "Oct 28" },
                      { period: "September 2025", amount: "$254,800", status: "paid", date: "Sep 28" },
                    ].map((payout, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <p className="font-medium text-neutral-900">{payout.period}</p>
                          <p className="text-xs text-neutral-500">{payout.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900">{payout.amount}</p>
                          <LuxeBadge variant="success">{payout.status}</LuxeBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <LuxeButton variant="gold" fullWidth className="mt-4" icon={DollarSign}>
                    Process December Payroll
                  </LuxeButton>
                </LuxeCard>
              </div>
            </motion.div>
          )}

          {activeTab === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Active Courses" value={12} icon={GraduationCap} changeType="neutral" change="Available" />
                <LuxeStatCard title="In Progress" value={34} icon={Play} changeType="positive" change="Enrollments" />
                <LuxeStatCard title="Completed" value={89} icon={CheckCircle2} changeType="positive" change="This month" />
                <LuxeStatCard title="Certifications" value={156} icon={Shield} changeType="neutral" change="Total issued" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Food Safety Level 1", enrolled: 24, completed: 18, required: true },
                  { name: "Customer Excellence", enrolled: 32, completed: 28, required: false },
                  { name: "POS & Scales Training", enrolled: 15, completed: 12, required: true },
                  { name: "Brand Ambassador", enrolled: 8, completed: 5, required: false },
                  { name: "HACCP Certification", enrolled: 12, completed: 10, required: true },
                  { name: "Leadership Essentials", enrolled: 6, completed: 4, required: false },
                ].map((course, idx) => (
                  <LuxeCard key={idx} variant="default" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-neutral-900">{course.name}</h3>
                        {course.required && (
                          <div className="mt-1">
                            <LuxeBadge variant="danger">Required</LuxeBadge>
                          </div>
                        )}
                      </div>
                      <Star className={cn("w-5 h-5", course.required ? "text-[#d4af37]" : "text-neutral-300")} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Progress</span>
                        <span className="font-medium text-neutral-900">{course.completed}/{course.enrolled}</span>
                      </div>
                      <LuxeProgress value={(course.completed / course.enrolled) * 100} />
                    </div>
                    <LuxeButton variant="outline" size="sm" fullWidth>
                      View Details
                    </LuxeButton>
                  </LuxeCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "policies" && (
            <motion.div
              key="policies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              data-testid="policies-tab"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Active Policies" value={16} icon={FileText} changeType="positive" change="All categories" data-testid="stat-policies" />
                <LuxeStatCard title="Pending Review" value={3} icon={Clock} changeType="neutral" change="Awaiting approval" />
                <LuxeStatCard title="Acknowledgements" value={98} icon={CheckCircle2} changeType="positive" change="% compliance" />
                <LuxeStatCard title="Local Overrides" value={8} icon={Globe} changeType="neutral" change="Country-specific" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Policy Library</h3>
                      <LuxeButton size="sm" variant="gold" icon={FileText}>New Policy</LuxeButton>
                    </div>
                    <div className="space-y-4">
                      {[
                        { code: "POL-001", name: "Food Safety & Hygiene", category: "SAFETY", version: 3, status: "ACTIVE", acks: 124 },
                        { code: "POL-002", name: "Customer Service Standards", category: "SERVICE", version: 2, status: "ACTIVE", acks: 118 },
                        { code: "POL-003", name: "Opening & Closing Protocol", category: "OPERATIONS", version: 4, status: "ACTIVE", acks: 112 },
                        { code: "POL-004", name: "Two-Person Rule", category: "SAFETY", version: 1, status: "ACTIVE", acks: 124 },
                        { code: "POL-005", name: "Uniform & Appearance", category: "HR", version: 2, status: "ACTIVE", acks: 120 },
                        { code: "POL-006", name: "Anti-Harassment Policy", category: "CONDUCT", version: 1, status: "ACTIVE", acks: 124 },
                      ].map((policy, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                          data-testid={`policy-${policy.code}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962d] flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-neutral-900">{policy.name}</p>
                              <LuxeBadge variant="default">{policy.category}</LuxeBadge>
                            </div>
                            <p className="text-xs text-neutral-500">{policy.code} • Version {policy.version}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">{policy.acks}</p>
                            <p className="text-xs text-neutral-500">Acknowledged</p>
                          </div>
                          <LuxeIconButton icon={Eye} size="sm" variant="ghost" />
                        </motion.div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Pending Acknowledgements</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Ahmed Al-Rashid", policy: "Anti-Harassment", due: "2 days" },
                        { name: "Sarah Chen", policy: "Food Safety", due: "3 days" },
                        { name: "Maria Santos", policy: "Closing Protocol", due: "5 days" },
                      ].map((pending, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                          <LuxeAvatar name={pending.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{pending.name}</p>
                            <p className="text-xs text-neutral-500">{pending.policy}</p>
                          </div>
                          <LuxeBadge variant="warning">Due {pending.due}</LuxeBadge>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Policy Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["OPERATIONS", "SAFETY", "SERVICE", "HYGIENE", "CONDUCT", "HR", "SECURITY", "TRAINING"].map((cat) => (
                        <div key={cat} className="p-3 bg-neutral-50 rounded-xl text-center">
                          <p className="text-xs font-medium text-neutral-600">{cat}</p>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "onboarding" && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              data-testid="onboarding-tab"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="New Hires" value={8} icon={UserPlus} changeType="positive" change="This month" />
                <LuxeStatCard title="In Progress" value={5} icon={Play} changeType="neutral" change="Onboarding" />
                <LuxeStatCard title="Completed" value={12} icon={CheckCircle2} changeType="positive" change="This quarter" />
                <LuxeStatCard title="Avg. Days" value={5.2} icon={Timer} changeType="positive" change="To complete" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LuxeCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Active Onboarding</h3>
                    <LuxeButton size="sm" variant="gold" icon={UserPlus}>Start New</LuxeButton>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "John Smith", role: "Crew Member", startDate: "Nov 25", progress: 60, tasks: "4/7" },
                      { name: "Emily Brown", role: "Barista", startDate: "Nov 27", progress: 40, tasks: "3/7" },
                      { name: "Michael Lee", role: "Crew Member", startDate: "Nov 28", progress: 28, tasks: "2/7" },
                      { name: "Lisa Wang", role: "Shift Manager", startDate: "Nov 29", progress: 14, tasks: "1/7" },
                      { name: "David Kim", role: "Crew Member", startDate: "Dec 1", progress: 0, tasks: "0/7" },
                    ].map((hire, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-neutral-50 rounded-xl"
                        data-testid={`onboarding-${idx}`}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <LuxeAvatar name={hire.name} size="md" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-neutral-900">{hire.name}</p>
                              <LuxeBadge variant="default">{hire.role}</LuxeBadge>
                            </div>
                            <p className="text-xs text-neutral-500">Started {hire.startDate} • {hire.tasks} tasks</p>
                          </div>
                          <LuxeIconButton icon={Eye} size="sm" variant="ghost" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">Progress</span>
                            <span className="font-medium text-neutral-700">{hire.progress}%</span>
                          </div>
                          <LuxeProgress value={hire.progress} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </LuxeCard>

                <div className="space-y-6">
                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Onboarding Tasks</h3>
                    <div className="space-y-3">
                      {[
                        { task: "Policy Acknowledgements", icon: FileText, type: "DOCUMENT_SIGN" },
                        { task: "Food Safety Training", icon: GraduationCap, type: "TRAINING" },
                        { task: "Uniform & ID Issue", icon: UserCheck, type: "UNIFORM_ISSUE" },
                        { task: "System Access Setup", icon: Shield, type: "SYSTEM_ACCESS" },
                        { task: "Buddy Introduction", icon: Users, type: "BUDDY_INTRO" },
                        { task: "Location Tour", icon: MapPin, type: "LOCATION_TOUR" },
                        { task: "Shadow Shift", icon: Clock, type: "CHECKLIST_SHADOW" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">{item.task}</p>
                            <p className="text-xs text-neutral-500">{item.type}</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "protocols" && (
            <motion.div
              key="protocols"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              data-testid="protocols-tab"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Uniform Checks" value={45} icon={UserCheck} changeType="positive" change="Today" />
                <LuxeStatCard title="Hygiene Audits" value={12} icon={CheckCircle2} changeType="positive" change="This week" />
                <LuxeStatCard title="Pass Rate" value="96%" icon={Shield} changeType="positive" change="Overall" />
                <LuxeStatCard title="Issues Found" value={3} icon={AlertTriangle} changeType="negative" change="Pending" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LuxeCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Uniform & Appearance Checks</h3>
                    <LuxeButton size="sm" variant="gold" icon={Clipboard}>New Check</LuxeButton>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Ahmed Al-Rashid", unit: "Riyadh Airport", passed: true, time: "08:15 AM" },
                      { name: "Sarah Chen", unit: "Dubai Mall", passed: true, time: "07:45 AM" },
                      { name: "Maria Santos", unit: "Tel Aviv Beach", passed: false, time: "09:00 AM", issue: "Name badge missing" },
                      { name: "Yuki Tanaka", unit: "Athens Airport", passed: true, time: "06:30 AM" },
                    ].map((check, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <LuxeAvatar name={check.name} size="md" />
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{check.name}</p>
                          <p className="text-xs text-neutral-500">{check.unit} • {check.time}</p>
                          {!check.passed && <p className="text-xs text-red-500 mt-1">{check.issue}</p>}
                        </div>
                        {check.passed ? (
                          <LuxeBadge variant="success">Passed</LuxeBadge>
                        ) : (
                          <LuxeBadge variant="danger">Failed</LuxeBadge>
                        )}
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Hygiene Audits</h3>
                    <LuxeButton size="sm" variant="gold" icon={Clipboard}>New Audit</LuxeButton>
                  </div>
                  <div className="space-y-4">
                    {[
                      { unit: "Dubai Mall", score: 98, auditor: "Sarah Chen", time: "Today, 10:30 AM" },
                      { unit: "Riyadh Airport", score: 95, auditor: "Ahmed Al-Rashid", time: "Today, 08:00 AM" },
                      { unit: "Tel Aviv Beach", score: 92, auditor: "Maria Santos", time: "Yesterday" },
                      { unit: "Athens Airport", score: 100, auditor: "Yuki Tanaka", time: "Yesterday" },
                    ].map((audit, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                          audit.score >= 95 ? "bg-emerald-500" : audit.score >= 80 ? "bg-amber-500" : "bg-red-500"
                        )}>
                          {audit.score}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{audit.unit}</p>
                          <p className="text-xs text-neutral-500">By {audit.auditor} • {audit.time}</p>
                        </div>
                        <LuxeIconButton icon={Eye} size="sm" variant="ghost" />
                      </div>
                    ))}
                  </div>
                </LuxeCard>
              </div>

              <LuxeCard variant="gradient" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Service Scripts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { type: "GREETING", title: "Welcome Script", example: "Welcome to Essence Yogurt! How may I help you today?" },
                    { type: "DIY_HELP", title: "DIY Assistance", example: "Choose your cup, select flavors at the machines, add toppings, then come to the counter for weighing." },
                    { type: "COMPLAINT", title: "Complaint Handling", example: "I understand your concern. Let me help resolve this for you right away." },
                    { type: "FAREWELL", title: "Farewell Script", example: "Thank you for visiting Essence Yogurt. We hope to see you again soon!" },
                  ].map((script, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl">
                      <div className="mb-2"><LuxeBadge variant="default">{script.type}</LuxeBadge></div>
                      <h4 className="font-medium text-neutral-900 mb-2">{script.title}</h4>
                      <p className="text-sm text-neutral-600 italic">"{script.example}"</p>
                    </div>
                  ))}
                </div>
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "safety" && (
            <motion.div
              key="safety"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              data-testid="safety-tab"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Open Reports" value={4} icon={AlertTriangle} changeType="negative" change="Require action" />
                <LuxeStatCard title="Resolved" value={28} icon={CheckCircle2} changeType="positive" change="This month" />
                <LuxeStatCard title="Near Misses" value={7} icon={ShieldAlert} changeType="neutral" change="Reported" />
                <LuxeStatCard title="Incident Free Days" value={12} icon={HeartPulse} changeType="positive" change="Current streak" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Health & Safety Reports</h3>
                      <LuxeButton size="sm" variant="gold" icon={AlertTriangle}>Report Incident</LuxeButton>
                    </div>
                    <div className="space-y-4">
                      {[
                        { type: "HAZARD_IDENTIFIED", title: "Wet Floor - Entrance", unit: "Dubai Mall", severity: "LOW", status: "OPEN", time: "2 hours ago" },
                        { type: "NEAR_MISS", title: "Heavy Box Almost Dropped", unit: "Riyadh Airport", severity: "MEDIUM", status: "UNDER_REVIEW", time: "Yesterday" },
                        { type: "FIRST_AID_USED", title: "Minor Cut - Kitchen", unit: "Athens Airport", severity: "LOW", status: "RESOLVED", time: "2 days ago" },
                        { type: "EQUIPMENT_ISSUE", title: "Freezer Door Handle Loose", unit: "Tel Aviv Beach", severity: "MEDIUM", status: "ACTION_REQUIRED", time: "3 days ago" },
                      ].map((report, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-4 bg-neutral-50 rounded-xl"
                          data-testid={`safety-report-${idx}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              report.severity === "HIGH" || report.severity === "CRITICAL" ? "bg-red-100" :
                              report.severity === "MEDIUM" ? "bg-amber-100" : "bg-emerald-100"
                            )}>
                              <AlertTriangle className={cn(
                                "w-5 h-5",
                                report.severity === "HIGH" || report.severity === "CRITICAL" ? "text-red-600" :
                                report.severity === "MEDIUM" ? "text-amber-600" : "text-emerald-600"
                              )} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-neutral-900">{report.title}</p>
                                <LuxeBadge variant={
                                  report.status === "RESOLVED" ? "success" :
                                  report.status === "OPEN" ? "danger" : "warning"
                                }>{report.status.replace("_", " ")}</LuxeBadge>
                              </div>
                              <p className="text-sm text-neutral-600">{report.unit}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-neutral-500">{report.type.replace("_", " ")}</span>
                                <span className="text-xs text-neutral-400">•</span>
                                <span className="text-xs text-neutral-500">{report.time}</span>
                              </div>
                            </div>
                            <LuxeIconButton icon={Eye} size="sm" variant="ghost" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Common Hazards</h3>
                    <div className="space-y-3">
                      {[
                        { hazard: "Wet Floors", icon: "💧", count: 12 },
                        { hazard: "Heavy Lifting", icon: "📦", count: 8 },
                        { hazard: "Sharp Objects", icon: "🔪", count: 5 },
                        { hazard: "Electrical", icon: "⚡", count: 3 },
                        { hazard: "Burn Risk", icon: "🔥", count: 2 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">{item.hazard}</p>
                          </div>
                          <span className="text-sm font-bold text-neutral-600">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeAlertCard
                    severity="warning"
                    title="Safety Reminder"
                    message="Ensure all staff complete the monthly safety refresher training by Dec 15."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "conduct" && (
            <motion.div
              key="conduct"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              data-testid="conduct-tab"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="Active Cases" value={2} icon={Scale} changeType="neutral" change="Under review" />
                <LuxeStatCard title="Resolved" value={8} icon={CheckCircle2} changeType="positive" change="This quarter" />
                <LuxeStatCard title="Warnings Issued" value={5} icon={AlertTriangle} changeType="neutral" change="Active" />
                <LuxeStatCard title="Appeals" value={1} icon={FileText} changeType="neutral" change="Pending" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LuxeCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Conduct Cases</h3>
                    <LuxeButton size="sm" variant="gold" icon={FileText}>New Case</LuxeButton>
                  </div>
                  <div className="space-y-4">
                    {[
                      { caseNo: "CC-A1B2C3", type: "HARASSMENT", status: "UNDER_INVESTIGATION", severity: "HIGH", date: "Nov 28" },
                      { caseNo: "CC-D4E5F6", type: "MISCONDUCT", status: "PENDING_ACTION", severity: "MEDIUM", date: "Nov 25" },
                    ].map((case_, idx) => (
                      <div key={idx} className="p-4 bg-neutral-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-neutral-500">{case_.caseNo}</span>
                          <LuxeBadge variant={
                            case_.status === "RESOLVED" ? "success" :
                            case_.status === "UNDER_INVESTIGATION" ? "warning" : "danger"
                          }>{case_.status.replace("_", " ")}</LuxeBadge>
                        </div>
                        <div className="flex items-center gap-2">
                          <LuxeBadge variant={case_.severity === "HIGH" ? "danger" : "warning"}>{case_.severity}</LuxeBadge>
                          <span className="text-sm text-neutral-600">{case_.type}</span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">Opened {case_.date}</p>
                      </div>
                    ))}
                  </div>
                </LuxeCard>

                <LuxeCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Disciplinary Actions</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { employee: "John Doe", type: "VERBAL_WARNING", category: "ATTENDANCE", date: "Nov 20", status: "ACTIVE" },
                      { employee: "Jane Smith", type: "FIRST_WRITTEN", category: "CONDUCT", date: "Nov 15", status: "ACKNOWLEDGED" },
                      { employee: "Bob Wilson", type: "VERBAL_WARNING", category: "PERFORMANCE", date: "Nov 10", status: "EXPIRED" },
                    ].map((action, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <LuxeAvatar name={action.employee} size="md" />
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{action.employee}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <LuxeBadge variant={
                              action.type.includes("FINAL") ? "danger" :
                              action.type.includes("FIRST") ? "warning" : "default"
                            }>{action.type.replace("_", " ")}</LuxeBadge>
                            <span className="text-xs text-neutral-500">{action.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <LuxeBadge variant={
                            action.status === "EXPIRED" ? "default" :
                            action.status === "ACKNOWLEDGED" ? "success" : "warning"
                          }>{action.status}</LuxeBadge>
                          <p className="text-xs text-neutral-500 mt-1">{action.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </LuxeCard>
              </div>

              <LuxeCard variant="gradient" className="p-6">
                <h3 className="font-bold text-neutral-900 mb-4">Equal Opportunity & Conduct Policy</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Essence Yogurt and Octopus Group provide equal opportunity in hiring, training, and promotion. 
                  Decisions are based on performance, skills, and business needs. Harassment, discrimination, 
                  or bullying are strictly prohibited.
                </p>
                <div className="flex gap-2">
                  <LuxeButton variant="outline" size="sm" icon={BookOpen}>View Full Policy</LuxeButton>
                  <LuxeButton variant="outline" size="sm" icon={GraduationCap}>Training Resources</LuxeButton>
                </div>
              </LuxeCard>
            </motion.div>
          )}

          {activeTab === "whistleblower" && (
            <motion.div
              key="whistleblower"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
              data-testid="whistleblower-tab"
            >
              <LuxeAlertCard
                severity="info"
                title="Confidential Reporting Channel"
                message="All reports are handled with strict confidentiality. Anonymous reporting is available. Staff are encouraged to report any serious issues."
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <LuxeStatCard title="New Reports" value={2} icon={MessageSquareWarning} changeType="neutral" change="Awaiting review" />
                <LuxeStatCard title="Under Investigation" value={3} icon={Search} changeType="neutral" change="Active" />
                <LuxeStatCard title="Resolved" value={15} icon={CheckCircle2} changeType="positive" change="This year" />
                <LuxeStatCard title="Avg. Resolution" value="14 days" icon={Clock} changeType="positive" change="Average time" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LuxeCard variant="default" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-neutral-900">Whistleblower Reports</h3>
                      <LuxeTabs
                        tabs={[
                          { id: "new", label: "New", badge: 2 },
                          { id: "active", label: "Active" },
                          { id: "resolved", label: "Resolved" },
                        ]}
                        activeTab="new"
                        onChange={() => {}}
                        variant="pills"
                      />
                    </div>
                    <div className="space-y-4">
                      {[
                        { code: "WB-K7X9M2-A1B2", type: "FRAUD", severity: "HIGH", status: "NEW", date: "Nov 30", anonymous: true },
                        { code: "WB-P3Q5R8-C4D6", type: "SAFETY_VIOLATION", severity: "MEDIUM", status: "UNDER_INVESTIGATION", date: "Nov 25", anonymous: false },
                        { code: "WB-L2N4P7-E8F9", type: "HARASSMENT", severity: "HIGH", status: "UNDER_INVESTIGATION", date: "Nov 20", anonymous: true },
                      ].map((report, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-4 bg-neutral-50 rounded-xl"
                          data-testid={`whistleblower-report-${idx}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-neutral-600">{report.code}</span>
                              {report.anonymous && (
                                <LuxeBadge variant="default">Anonymous</LuxeBadge>
                              )}
                            </div>
                            <LuxeBadge variant={
                              report.status === "NEW" ? "warning" :
                              report.status === "UNDER_INVESTIGATION" ? "default" : "success"
                            }>{report.status.replace("_", " ")}</LuxeBadge>
                          </div>
                          <div className="flex items-center gap-3">
                            <LuxeBadge variant={report.severity === "HIGH" || report.severity === "CRITICAL" ? "danger" : "warning"}>
                              {report.severity}
                            </LuxeBadge>
                            <span className="text-sm text-neutral-600">{report.type.replace("_", " ")}</span>
                            <span className="text-xs text-neutral-500 ml-auto">Submitted {report.date}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </LuxeCard>
                </div>

                <div className="space-y-6">
                  <LuxeCard variant="gradient" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-4">Report Types</h3>
                    <div className="space-y-3">
                      {[
                        { type: "Fraud", icon: "💰", count: 5 },
                        { type: "Safety Violations", icon: "⚠️", count: 4 },
                        { type: "Harassment", icon: "🚫", count: 3 },
                        { type: "Discrimination", icon: "⚖️", count: 2 },
                        { type: "Data Breach", icon: "🔐", count: 1 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">{item.type}</p>
                          </div>
                          <span className="text-sm font-bold text-neutral-600">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </LuxeCard>

                  <LuxeCard variant="default" className="p-6">
                    <h3 className="font-bold text-neutral-900 mb-3">Track Your Report</h3>
                    <p className="text-sm text-neutral-600 mb-4">Enter your tracking code to check the status of your anonymous report.</p>
                    <div className="flex gap-2">
                      <LuxeInput placeholder="WB-XXXXXX-XXXX" className="flex-1" />
                      <LuxeButton variant="gold" icon={Search}>Track</LuxeButton>
                    </div>
                  </LuxeCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedEmployee(null)}
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
                  <h2 className="text-xl font-bold text-neutral-900">Employee Details</h2>
                  <LuxeIconButton icon={XCircle} onClick={() => setSelectedEmployee(null)} />
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <LuxeAvatar name={selectedEmployee.fullName} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{selectedEmployee.fullName}</h3>
                    <p className="text-sm text-neutral-500">{selectedEmployee.employeeCode}</p>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block", roleColors[selectedEmployee.role] || "bg-neutral-100")}>
                      {selectedEmployee.role.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedEmployee.email}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Phone</p>
                    <p className="text-sm font-medium text-neutral-900">{selectedEmployee.phone || "Not set"}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Country</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {COUNTRIES.find(c => c.value === selectedEmployee.country)?.icon} {selectedEmployee.country}
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <p className="text-xs text-neutral-500 mb-1">Status</p>
                    <LuxeBadge variant={selectedEmployee.isActive ? "success" : "danger"}>
                      {selectedEmployee.isActive ? "Active" : "Inactive"}
                    </LuxeBadge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <LuxeButton variant="outline" fullWidth icon={Edit2}>Edit</LuxeButton>
                  <LuxeButton variant="gold" fullWidth icon={Clock}>View Timesheets</LuxeButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CandidateRanking {
  candidateId: string;
  candidateName: string;
  overallScore: number;
  intelligenceScore: number;
  potentialScore: number;
  costEfficiencyScore: number;
  recommendation: string;
  reasoning: string;
  estimatedCostTier: string;
  trainabilityRating: string;
}

interface RankingResult {
  rankings: CandidateRanking[];
  topRecommendation: string;
  summary: string;
}

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  positionTitle: string;
  department?: string;
  location?: string;
  yearsExperience?: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  hours?: string;
  description: string;
  requirements?: string[];
  idealCandidate?: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

function RecruitingAITab() {
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [aiRankings, setAiRankings] = useState<RankingResult | null>(null);
  const [isRanking, setIsRanking] = useState(false);
  const [newPosting, setNewPosting] = useState({
    title: "",
    department: "Retail",
    location: "",
    type: "Part-time",
    salary: "",
    hours: "",
    description: "",
    idealCandidate: "",
  });
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading: appsLoading } = useQuery<JobApplication[]>({
    queryKey: ["/api/careers/applications"],
    select: (data: any) => data.applications || [],
  });

  const { data: postings = [], isLoading: postingsLoading } = useQuery<JobPosting[]>({
    queryKey: ["/api/careers/postings"],
    select: (data: any) => data.postings || [],
  });

  const createPostingMutation = useMutation({
    mutationFn: async (posting: any) => {
      const res = await fetch("/api/careers/postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posting),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/careers/postings"] });
      setShowPostingForm(false);
      setNewPosting({ title: "", department: "Retail", location: "", type: "Part-time", salary: "", hours: "", description: "", idealCandidate: "" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/careers/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewedBy: "HR Admin" }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/careers/applications"] });
    },
  });

  const runAiRanking = async () => {
    setIsRanking(true);
    try {
      const res = await fetch("/api/careers/rank-candidates", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAiRankings(data.rankings);
      }
    } catch (error) {
      console.error("AI ranking failed:", error);
    } finally {
      setIsRanking(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === "hire_immediately") return "bg-emerald-100 text-emerald-700";
    if (rec === "strong_consider") return "bg-green-100 text-green-700";
    if (rec === "consider") return "bg-amber-100 text-amber-700";
    if (rec === "maybe_later") return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusColor = (status: string) => {
    if (status === "approved" || status === "hired") return "success";
    if (status === "pending") return "warning";
    if (status === "under_review") return "info";
    return "danger";
  };

  return (
    <motion.div
      key="recruiting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Recruiting AI</h2>
          <p className="text-sm text-neutral-500">AI-powered candidate ranking • Cost-efficient hiring</p>
        </div>
        <div className="flex gap-2">
          <LuxeButton variant="gold" icon={Star} onClick={runAiRanking} loading={isRanking} data-testid="btn-ai-rank">
            {isRanking ? "Analyzing..." : "AI Rank Candidates"}
          </LuxeButton>
          <LuxeButton variant="primary" icon={UserPlus} onClick={() => setShowPostingForm(true)} data-testid="btn-new-posting">
            New Job Posting
          </LuxeButton>
        </div>
      </div>

      {aiRankings && (
        <LuxeCard variant="gold" glow className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">AI Hiring Recommendations</h3>
              <p className="text-sm text-neutral-600">{aiRankings.summary}</p>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-xl mb-4">
            <p className="text-sm font-semibold text-amber-900">Top Recommendation:</p>
            <p className="text-sm text-amber-800">{aiRankings.topRecommendation}</p>
          </div>

          <div className="space-y-3">
            {aiRankings.rankings.map((r, i) => (
              <div key={r.candidateId} className="p-4 bg-white rounded-xl border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{r.candidateName}</p>
                    <p className="text-xs text-neutral-500">{r.reasoning.slice(0, 100)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#C9A227]">{r.overallScore}</p>
                    <p className="text-[10px] text-neutral-500 uppercase">Score</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm font-bold text-blue-700">{r.intelligenceScore}</p>
                      <p className="text-[9px] text-blue-600">Smart</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-sm font-bold text-green-700">{r.costEfficiencyScore}</p>
                      <p className="text-[9px] text-green-600">Cost</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <p className="text-sm font-bold text-purple-700">{r.potentialScore}</p>
                      <p className="text-[9px] text-purple-600">Potential</p>
                    </div>
                  </div>
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-semibold uppercase", getRecommendationColor(r.recommendation))}>
                    {r.recommendation.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </LuxeCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LuxeCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900">Active Job Postings</h3>
            <span className="text-sm text-neutral-500">{postings.filter(p => p.isActive).length} active</span>
          </div>
          {postingsLoading ? (
            <div className="text-center py-8 text-neutral-500">Loading...</div>
          ) : postings.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
              <p className="text-neutral-500">No job postings yet</p>
              <LuxeButton variant="outline" size="sm" className="mt-3" onClick={() => setShowPostingForm(true)}>
                Create First Posting
              </LuxeButton>
            </div>
          ) : (
            <div className="space-y-3">
              {postings.map((p) => (
                <div key={p.id} className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between" data-testid={`posting-${p.id}`}>
                  <div>
                    <p className="font-semibold text-neutral-900">{p.title}</p>
                    <p className="text-xs text-neutral-500">{p.location} • {p.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuxeBadge variant={p.isActive ? "success" : "default"}>{p.isActive ? "Active" : "Inactive"}</LuxeBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </LuxeCard>

        <LuxeCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900">Recent Applications</h3>
            <span className="text-sm text-neutral-500">{applications.length} total</span>
          </div>
          {appsLoading ? (
            <div className="text-center py-8 text-neutral-500">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
              <p className="text-neutral-500">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {applications.map((app) => (
                <div key={app.id} className="p-3 bg-neutral-50 rounded-xl" data-testid={`application-${app.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-neutral-900">{app.fullName}</p>
                      <p className="text-xs text-neutral-500">{app.positionTitle} • {app.location}</p>
                    </div>
                    <LuxeBadge variant={getStatusColor(app.status) as any}>{app.status}</LuxeBadge>
                  </div>
                  <div className="flex gap-2">
                    <LuxeButton size="sm" variant="ghost" onClick={() => setSelectedApplication(app)}>
                      View Details
                    </LuxeButton>
                    {app.status === "pending" && (
                      <>
                        <LuxeButton size="sm" variant="outline" onClick={() => updateStatusMutation.mutate({ id: app.id, status: "under_review" })}>
                          Review
                        </LuxeButton>
                        <LuxeButton size="sm" variant="gold" onClick={() => updateStatusMutation.mutate({ id: app.id, status: "shortlisted" })}>
                          Shortlist
                        </LuxeButton>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </LuxeCard>
      </div>

      {showPostingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Create Job Posting</h3>
                <LuxeIconButton icon={XCircle} onClick={() => setShowPostingForm(false)} />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <LuxeInput label="Job Title" value={newPosting.title} onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })} placeholder="e.g., Store Team Member" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Department</label>
                  <select className="w-full h-12 px-4 bg-white border-2 border-neutral-200 rounded-2xl" value={newPosting.department} onChange={(e) => setNewPosting({ ...newPosting, department: e.target.value })}>
                    <option value="Retail">Retail</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Type</label>
                  <select className="w-full h-12 px-4 bg-white border-2 border-neutral-200 rounded-2xl" value={newPosting.type} onChange={(e) => setNewPosting({ ...newPosting, type: e.target.value })}>
                    <option value="Part-time">Part-time</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <LuxeInput label="Location" value={newPosting.location} onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })} placeholder="e.g., Dubai, UAE" />
              <div className="grid grid-cols-2 gap-4">
                <LuxeInput label="Salary" value={newPosting.salary} onChange={(e) => setNewPosting({ ...newPosting, salary: e.target.value })} placeholder="e.g., AED 25-35/hour" />
                <LuxeInput label="Hours" value={newPosting.hours} onChange={(e) => setNewPosting({ ...newPosting, hours: e.target.value })} placeholder="e.g., 8-20 hours/week" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Description</label>
                <textarea className="w-full p-4 bg-white border-2 border-neutral-200 rounded-2xl resize-none h-24" value={newPosting.description} onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })} placeholder="Job description..." />
              </div>
              <LuxeInput label="Ideal Candidate" value={newPosting.idealCandidate} onChange={(e) => setNewPosting({ ...newPosting, idealCandidate: e.target.value })} placeholder="e.g., Students welcome" />
            </div>
            <div className="p-6 border-t border-neutral-100 flex gap-3">
              <LuxeButton variant="outline" fullWidth onClick={() => setShowPostingForm(false)}>Cancel</LuxeButton>
              <LuxeButton variant="gold" fullWidth onClick={() => createPostingMutation.mutate(newPosting)} loading={createPostingMutation.isPending} data-testid="btn-submit-posting">
                Create Posting
              </LuxeButton>
            </div>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{selectedApplication.fullName}</h3>
                <LuxeIconButton icon={XCircle} onClick={() => setSelectedApplication(null)} />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Position</p>
                  <p className="text-sm font-medium">{selectedApplication.positionTitle}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Location</p>
                  <p className="text-sm font-medium">{selectedApplication.location || "Not specified"}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Email</p>
                  <p className="text-sm font-medium">{selectedApplication.email}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Phone</p>
                  <p className="text-sm font-medium">{selectedApplication.phone || "Not provided"}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Experience</p>
                  <p className="text-sm font-medium">{selectedApplication.yearsExperience || "Not specified"}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">Status</p>
                  <LuxeBadge variant={getStatusColor(selectedApplication.status) as any}>{selectedApplication.status}</LuxeBadge>
                </div>
              </div>
              {selectedApplication.coverLetter && (
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-2">Application Details</p>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-neutral-100 flex gap-2">
              <LuxeButton variant="danger" size="sm" onClick={() => { updateStatusMutation.mutate({ id: selectedApplication.id, status: "rejected" }); setSelectedApplication(null); }}>
                Reject
              </LuxeButton>
              <LuxeButton variant="outline" size="sm" onClick={() => { updateStatusMutation.mutate({ id: selectedApplication.id, status: "under_review" }); setSelectedApplication(null); }}>
                Under Review
              </LuxeButton>
              <LuxeButton variant="gold" size="sm" onClick={() => { updateStatusMutation.mutate({ id: selectedApplication.id, status: "shortlisted" }); setSelectedApplication(null); }}>
                Shortlist
              </LuxeButton>
              <LuxeButton variant="primary" size="sm" onClick={() => { updateStatusMutation.mutate({ id: selectedApplication.id, status: "hired" }); setSelectedApplication(null); }}>
                Hire
              </LuxeButton>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
