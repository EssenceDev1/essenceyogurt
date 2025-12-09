"use client";

import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, Users, Package, FileCheck, Crown, LayoutDashboard,
  Truck, Calendar, Clock, AlertTriangle, TrendingUp, Plus,
  ChevronRight, Bell, Shield, DollarSign, UserCheck, Star,
  ShoppingCart, Boxes, Timer, MapPin, Camera, ClipboardList, Briefcase
} from "lucide-react";
import IdentityVerificationPanel from "@/components/admin/identity-verification-panel";

type TabType = 'overview' | 'suppliers' | 'workforce' | 'compliance' | 'vip' | 'operations' | 'stock' | 'hiring';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const queryClient = useQueryClient();

  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard-stats");
      return res.json();
    },
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await fetch("/api/suppliers");
      return res.json();
    },
  });

  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetch("/api/employees");
      return res.json();
    },
  });

  const { data: leaveRequestsData } = useQuery({
    queryKey: ["leave-requests-pending"],
    queryFn: async () => {
      const res = await fetch("/api/leave-requests/pending");
      return res.json();
    },
  });

  const { data: shiftAssignmentsData } = useQuery({
    queryKey: ["shift-assignments"],
    queryFn: async () => {
      const res = await fetch("/api/shift-assignments");
      return res.json();
    },
  });

  const { data: purchaseOrdersData } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      const res = await fetch("/api/purchase-orders");
      return res.json();
    },
  });

  const { data: complianceTasksData } = useQuery({
    queryKey: ["compliance-tasks"],
    queryFn: async () => {
      const res = await fetch("/api/compliance-tasks");
      return res.json();
    },
  });

  const { data: insuranceData } = useQuery({
    queryKey: ["insurance-policies"],
    queryFn: async () => {
      const res = await fetch("/api/insurance-policies");
      return res.json();
    },
  });

  const { data: licensesData } = useQuery({
    queryKey: ["business-licenses"],
    queryFn: async () => {
      const res = await fetch("/api/business-licenses");
      return res.json();
    },
  });

  const { data: taxFilingsData } = useQuery({
    queryKey: ["tax-filings"],
    queryFn: async () => {
      const res = await fetch("/api/tax-filings");
      return res.json();
    },
  });

  const { data: vipEventsData } = useQuery({
    queryKey: ["vip-events"],
    queryFn: async () => {
      const res = await fetch("/api/vip-events");
      return res.json();
    },
  });

  const { data: vipBenefitsData } = useQuery({
    queryKey: ["vip-benefits"],
    queryFn: async () => {
      const res = await fetch("/api/vip-benefits");
      return res.json();
    },
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      return res.json();
    },
  });

  const { data: unitsData } = useQuery({
    queryKey: ["essence-units"],
    queryFn: async () => {
      const res = await fetch("/api/essence-units");
      return res.json();
    },
  });

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory-batches"],
    queryFn: async () => {
      const res = await fetch("/api/inventory-batches");
      return res.json();
    },
  });

  const { data: operationsStats } = useQuery({
    queryKey: ["operations-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/operations-stats");
      return res.json();
    },
  });

  const { data: pendingTimesheets } = useQuery({
    queryKey: ["pending-timesheets"],
    queryFn: async () => {
      const res = await fetch("/api/timesheet/pending-approvals");
      return res.json();
    },
  });

  const { data: flaggedVerifications } = useQuery({
    queryKey: ["flagged-verifications"],
    queryFn: async () => {
      const res = await fetch("/api/timesheet/flagged-verifications");
      return res.json();
    },
  });

  const { data: pendingWaste } = useQuery({
    queryKey: ["pending-waste"],
    queryFn: async () => {
      const res = await fetch("/api/waste-reports/pending");
      return res.json();
    },
  });

  const { data: criticalAlerts } = useQuery({
    queryKey: ["critical-alerts"],
    queryFn: async () => {
      const res = await fetch("/api/alerts/critical");
      return res.json();
    },
  });

  const stats = dashboardStats?.stats || {};
  const opsStats = operationsStats?.stats || {};

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'operations' as TabType, label: 'Operations', icon: Timer },
    { id: 'stock' as TabType, label: 'Stock Control', icon: Boxes },
    { id: 'suppliers' as TabType, label: 'Suppliers', icon: Truck },
    { id: 'workforce' as TabType, label: 'Workforce', icon: Users },
    { id: 'hiring' as TabType, label: 'HR Hiring', icon: Briefcase },
    { id: 'compliance' as TabType, label: 'Compliance', icon: Shield },
    { id: 'vip' as TabType, label: 'VIP Program', icon: Crown },
  ];

  const supplierTypes = [
    { type: 'fruit', label: 'Fresh Frozen Fruit', color: 'bg-green-100 text-green-700' },
    { type: 'candy', label: 'Candy', color: 'bg-pink-100 text-pink-700' },
    { type: 'chocolate', label: 'Chocolate', color: 'bg-amber-100 text-amber-700' },
    { type: 'acai', label: 'Açaí Powder', color: 'bg-purple-100 text-purple-700' },
    { type: 'cups', label: 'Cups & Packaging', color: 'bg-blue-100 text-blue-700' },
    { type: 'cleaning', label: 'Cleaning', color: 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col" data-testid="admin-hq-page">
      <header className="border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">EY</span>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.1em]" data-testid="header-title">
                    Octopus Brain HQ
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Global Operations Command Center
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-neutral-100 transition" data-testid="notifications-button">
              <Bell className="w-4 h-4" />
              {(stats.pendingCompliance > 0 || stats.pendingLeaveRequests > 0) && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {(stats.pendingCompliance || 0) + (stats.pendingLeaveRequests || 0)}
                </span>
              )}
            </button>
            <Link href="/pos">
              <button className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold hover:bg-black hover:text-white transition" data-testid="pos-link">
                POS View
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-[#d4af37] text-black' 
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="flex-1 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6" data-testid="overview-section">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard 
                  label="Active Suppliers" 
                  value={stats.activeSuppliers || suppliersData?.suppliers?.length || 0} 
                  icon={Truck}
                  color="green"
                />
                <StatCard 
                  label="Employees" 
                  value={stats.activeEmployees || employeesData?.employees?.length || 0} 
                  icon={Users}
                  color="blue"
                />
                <StatCard 
                  label="Pending Leave" 
                  value={stats.pendingLeaveRequests || leaveRequestsData?.requests?.length || 0} 
                  icon={Calendar}
                  color="yellow"
                  alert={leaveRequestsData?.requests?.length > 0}
                />
                <StatCard 
                  label="Compliance Tasks" 
                  value={stats.pendingCompliance || complianceTasksData?.tasks?.filter((t: any) => t.status === 'pending')?.length || 0} 
                  icon={FileCheck}
                  color="purple"
                  alert={complianceTasksData?.tasks?.some((t: any) => t.status === 'pending')}
                />
                <StatCard 
                  label="VIP Members" 
                  value={customersData?.customers?.length || 0} 
                  icon={Crown}
                  color="gold"
                />
                <StatCard 
                  label="Active Units" 
                  value={unitsData?.units?.length || 0} 
                  icon={Building2}
                  color="neutral"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="Recent Purchase Orders" icon={Package}>
                  {purchaseOrdersData?.orders?.length ? (
                    purchaseOrdersData.orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium">{order.orderNumber}</p>
                          <p className="text-[10px] text-neutral-500">${order.totalAmount} {order.currency}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No purchase orders yet" />
                  )}
                </DashboardCard>

                <DashboardCard title="Pending Leave Requests" icon={UserCheck}>
                  {leaveRequestsData?.requests?.length ? (
                    leaveRequestsData.requests.slice(0, 5).map((req: any) => (
                      <div key={req.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium capitalize">{req.leaveType} Leave</p>
                          <p className="text-[10px] text-neutral-500">{req.reason || 'No reason provided'}</p>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No pending leave requests" />
                  )}
                </DashboardCard>

                <DashboardCard title="Compliance Alerts" icon={AlertTriangle}>
                  {complianceTasksData?.tasks?.filter((t: any) => t.status === 'pending' || t.status === 'overdue')?.length ? (
                    complianceTasksData.tasks.filter((t: any) => t.status === 'pending' || t.status === 'overdue').slice(0, 5).map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium">{task.title}</p>
                          <p className="text-[10px] text-neutral-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="All compliance tasks up to date" positive />
                  )}
                </DashboardCard>

                <DashboardCard title="Upcoming VIP Events" icon={Star}>
                  {vipEventsData?.events?.length ? (
                    vipEventsData.events.filter((e: any) => e.status === 'upcoming').slice(0, 5).map((event: any) => (
                      <div key={event.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium">{event.name}</p>
                          <p className="text-[10px] text-neutral-500">{new Date(event.eventDate).toLocaleDateString()}</p>
                        </div>
                        <span className="text-[10px] bg-[#d4af37]/10 text-[#b8962e] px-2 py-0.5 rounded-full font-medium">
                          {event.currentRsvps}/{event.maxGuests} RSVPs
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No upcoming VIP events" />
                  )}
                </DashboardCard>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6" data-testid="suppliers-section">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Supplier Management</h2>
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-800 transition" data-testid="add-supplier-button">
                  <Plus className="w-3 h-3" />
                  Add Supplier
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {supplierTypes.map(st => {
                  const count = suppliersData?.suppliers?.filter((s: any) => s.type === st.type)?.length || 0;
                  return (
                    <div key={st.type} className={`${st.color} rounded-2xl p-4 cursor-pointer hover:opacity-80 transition`}>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs font-medium mt-1">{st.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="All Suppliers" icon={Truck}>
                  {suppliersData?.suppliers?.length ? (
                    suppliersData.suppliers.map((supplier: any) => (
                      <div key={supplier.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{supplier.name}</p>
                          <p className="text-[10px] text-neutral-500">{supplier.contactName} - {supplier.country}</p>
                          <p className="text-[10px] text-neutral-400">{supplier.contactEmail}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            supplier.tier === 'premium' ? 'bg-[#d4af37]/20 text-[#b8962e]' :
                            supplier.tier === 'preferred' ? 'bg-blue-100 text-blue-700' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {supplier.tier}
                          </span>
                          <p className="text-[10px] text-neutral-500 mt-1 capitalize">{supplier.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No suppliers registered yet" />
                  )}
                </DashboardCard>

                <DashboardCard title="Purchase Orders" icon={Package}>
                  {purchaseOrdersData?.orders?.length ? (
                    purchaseOrdersData.orders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{order.orderNumber}</p>
                          <p className="text-[10px] text-neutral-500">
                            Expected: {order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold">${order.totalAmount}</p>
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No purchase orders yet" />
                  )}
                </DashboardCard>

                <DashboardCard title="Inventory Batches" icon={Package} className="md:col-span-2">
                  {inventoryData?.batches?.length ? (
                    <div className="grid md:grid-cols-2 gap-2">
                      {inventoryData.batches.slice(0, 8).map((batch: any) => (
                        <div key={batch.id} className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-xl">
                          <div>
                            <p className="text-xs font-medium">Batch {batch.batchNumber || batch.id.slice(0, 8)}</p>
                            <p className="text-[10px] text-neutral-500">
                              {batch.quantityRemaining}/{batch.quantityReceived} remaining
                            </p>
                          </div>
                          {batch.expiryDate && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              new Date(batch.expiryDate) < new Date() ? 'bg-red-100 text-red-700' :
                              new Date(batch.expiryDate) < new Date(Date.now() + 7*24*60*60*1000) ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              Exp: {new Date(batch.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No inventory batches recorded" />
                  )}
                </DashboardCard>
              </div>
            </div>
          )}

          {activeTab === 'workforce' && (
            <div className="space-y-6" data-testid="workforce-section">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Workforce Management</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 border border-neutral-300 px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-100 transition" data-testid="schedule-shift-button">
                    <Calendar className="w-3 h-3" />
                    Schedule Shift
                  </button>
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-800 transition" data-testid="add-employee-button">
                    <Plus className="w-3 h-3" />
                    Add Employee
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  label="Total Employees" 
                  value={employeesData?.employees?.length || 0} 
                  icon={Users}
                  color="blue"
                />
                <StatCard 
                  label="Active Today" 
                  value={shiftAssignmentsData?.assignments?.filter((a: any) => a.status === 'in_progress')?.length || 0} 
                  icon={Clock}
                  color="green"
                />
                <StatCard 
                  label="Pending Leave" 
                  value={leaveRequestsData?.requests?.length || 0} 
                  icon={Calendar}
                  color="yellow"
                  alert={leaveRequestsData?.requests?.length > 0}
                />
                <StatCard 
                  label="Scheduled Shifts" 
                  value={shiftAssignmentsData?.assignments?.filter((a: any) => a.status === 'scheduled')?.length || 0} 
                  icon={Clock}
                  color="purple"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="Employee Directory" icon={Users}>
                  {employeesData?.employees?.length ? (
                    employeesData.employees.map((emp: any) => (
                      <div key={emp.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-xs font-bold text-neutral-600">
                            {emp.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{emp.fullName}</p>
                            <p className="text-[10px] text-neutral-500 capitalize">{emp.role} - {emp.city}, {emp.country}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            emp.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {emp.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <p className="text-[10px] text-neutral-500 mt-1 capitalize">{emp.employmentType.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No employees registered" />
                  )}
                </DashboardCard>

                <DashboardCard title="Leave Requests" icon={Calendar}>
                  {leaveRequestsData?.requests?.length ? (
                    leaveRequestsData.requests.map((req: any) => (
                      <div key={req.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold capitalize">{req.leaveType} Leave</p>
                          <p className="text-[10px] text-neutral-500">
                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-neutral-400">{req.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-[10px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium hover:bg-green-200 transition" data-testid={`approve-leave-${req.id}`}>
                            Approve
                          </button>
                          <button className="text-[10px] px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium hover:bg-red-200 transition" data-testid={`reject-leave-${req.id}`}>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No pending leave requests" positive />
                  )}
                </DashboardCard>

                <DashboardCard title="Today's Shift Schedule" icon={Clock} className="md:col-span-2">
                  {shiftAssignmentsData?.assignments?.length ? (
                    <div className="grid md:grid-cols-3 gap-3">
                      {shiftAssignmentsData.assignments.slice(0, 9).map((shift: any) => (
                        <div key={shift.id} className="p-3 bg-neutral-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-medium">{shift.startTime} - {shift.endTime}</span>
                            <StatusBadge status={shift.status} />
                          </div>
                          <p className="text-xs text-neutral-500">
                            {new Date(shift.shiftDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No shifts scheduled" />
                  )}
                </DashboardCard>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6" data-testid="compliance-section">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Compliance & Legal</h2>
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-800 transition" data-testid="add-task-button">
                  <Plus className="w-3 h-3" />
                  Add Task
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  label="Active Policies" 
                  value={insuranceData?.policies?.filter((p: any) => p.status === 'active')?.length || 0} 
                  icon={Shield}
                  color="blue"
                />
                <StatCard 
                  label="Valid Licenses" 
                  value={licensesData?.licenses?.filter((l: any) => l.status === 'active')?.length || 0} 
                  icon={FileCheck}
                  color="green"
                />
                <StatCard 
                  label="Tax Filings Due" 
                  value={taxFilingsData?.filings?.filter((f: any) => f.status === 'pending')?.length || 0} 
                  icon={DollarSign}
                  color="yellow"
                  alert={taxFilingsData?.filings?.some((f: any) => f.status === 'pending')}
                />
                <StatCard 
                  label="Pending Tasks" 
                  value={complianceTasksData?.tasks?.filter((t: any) => t.status === 'pending')?.length || 0} 
                  icon={AlertTriangle}
                  color="red"
                  alert={complianceTasksData?.tasks?.some((t: any) => t.status === 'pending' || t.status === 'overdue')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="Insurance Policies" icon={Shield}>
                  {insuranceData?.policies?.length ? (
                    insuranceData.policies.map((policy: any) => (
                      <div key={policy.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold capitalize">{policy.type.replace('_', ' ')} Insurance</p>
                          <p className="text-[10px] text-neutral-500">{policy.provider} - {policy.policyNumber}</p>
                          <p className="text-[10px] text-neutral-400">
                            Expires: {new Date(policy.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold">${policy.coverageAmount}</p>
                          <StatusBadge status={policy.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No insurance policies registered" />
                  )}
                </DashboardCard>

                <DashboardCard title="Business Licenses" icon={FileCheck}>
                  {licensesData?.licenses?.length ? (
                    licensesData.licenses.map((license: any) => (
                      <div key={license.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold capitalize">{license.type.replace('_', ' ')} License</p>
                          <p className="text-[10px] text-neutral-500">{license.issuingAuthority}</p>
                          <p className="text-[10px] text-neutral-400">
                            {license.expiryDate ? `Expires: ${new Date(license.expiryDate).toLocaleDateString()}` : 'No expiry'}
                          </p>
                        </div>
                        <StatusBadge status={license.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No licenses registered" />
                  )}
                </DashboardCard>

                <DashboardCard title="Tax Filings" icon={DollarSign}>
                  {taxFilingsData?.filings?.length ? (
                    taxFilingsData.filings.map((filing: any) => (
                      <div key={filing.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold capitalize">{filing.type.replace('_', ' ')}</p>
                          <p className="text-[10px] text-neutral-500">{filing.jurisdiction}</p>
                          <p className="text-[10px] text-neutral-400">
                            Due: {new Date(filing.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold">${filing.amountDue || '0.00'}</p>
                          <StatusBadge status={filing.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No tax filings registered" />
                  )}
                </DashboardCard>

                <DashboardCard title="Compliance Tasks" icon={AlertTriangle}>
                  {complianceTasksData?.tasks?.length ? (
                    complianceTasksData.tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{task.title}</p>
                          <p className="text-[10px] text-neutral-500 capitalize">{task.category.replace('_', ' ')}</p>
                          <p className="text-[10px] text-neutral-400">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {task.priority}
                          </span>
                          <StatusBadge status={task.status} className="mt-1" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No compliance tasks" positive />
                  )}
                </DashboardCard>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-6" data-testid="operations-section">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Real-Time Operations</h2>
                <div className="flex gap-2">
                  <Link href="/timesheet">
                    <button className="flex items-center gap-2 border border-neutral-300 px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-100 transition" data-testid="timesheet-link">
                      <Timer className="w-3 h-3" />
                      Timesheet App
                    </button>
                  </Link>
                  <Link href="/pos">
                    <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-800 transition" data-testid="pos-link-operations">
                      <ShoppingCart className="w-3 h-3" />
                      Open POS
                    </button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard 
                  label="Pending Timesheets" 
                  value={opsStats.pendingTimesheetApprovals || pendingTimesheets?.entries?.length || 0} 
                  icon={Timer}
                  color="yellow"
                  alert={(opsStats.pendingTimesheetApprovals || 0) > 0}
                />
                <StatCard 
                  label="Flagged Locations" 
                  value={opsStats.flaggedLocationVerifications || flaggedVerifications?.verifications?.length || 0} 
                  icon={MapPin}
                  color="red"
                  alert={(opsStats.flaggedLocationVerifications || 0) > 0}
                />
                <StatCard 
                  label="Pending Waste" 
                  value={opsStats.pendingWasteApprovals || pendingWaste?.reports?.length || 0} 
                  icon={Package}
                  color="purple"
                  alert={(opsStats.pendingWasteApprovals || 0) > 0}
                />
                <StatCard 
                  label="Suspicious Reports" 
                  value={opsStats.suspiciousWasteReports || 0} 
                  icon={AlertTriangle}
                  color="red"
                  alert={(opsStats.suspiciousWasteReports || 0) > 0}
                />
                <StatCard 
                  label="Critical Alerts" 
                  value={opsStats.criticalAlerts || criticalAlerts?.alerts?.length || 0} 
                  icon={Bell}
                  color="red"
                  alert={(opsStats.criticalAlerts || 0) > 0}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="Pending Timesheet Approvals" icon={Timer}>
                  {pendingTimesheets?.entries?.length ? (
                    pendingTimesheets.entries.slice(0, 10).map((entry: any) => (
                      <div key={entry.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">Employee #{entry.employeeId?.slice(0, 8) || 'Unknown'}</p>
                          <p className="text-[10px] text-neutral-500">
                            {new Date(entry.clockInTime).toLocaleDateString()} • 
                            {new Date(entry.clockInTime).toLocaleTimeString()} - {entry.clockOutTime ? new Date(entry.clockOutTime).toLocaleTimeString() : 'Ongoing'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition">
                            Approve
                          </button>
                          <button className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No pending timesheet approvals" positive />
                  )}
                </DashboardCard>

                <DashboardCard title="Flagged Location Verifications" icon={MapPin}>
                  {flaggedVerifications?.verifications?.length ? (
                    flaggedVerifications.verifications.slice(0, 10).map((v: any) => (
                      <div key={v.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold capitalize">{v.verificationType?.replace('_', ' ') || 'Check'}</p>
                          <p className="text-[10px] text-neutral-500">
                            Distance: {v.distanceFromUnit || '?'}m from unit
                          </p>
                          <p className="text-[10px] text-red-500">{v.flagReason || 'Location mismatch'}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                          Investigate
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No flagged verifications" positive />
                  )}
                </DashboardCard>

                <DashboardCard title="Critical Alerts" icon={AlertTriangle}>
                  {criticalAlerts?.alerts?.length ? (
                    criticalAlerts.alerts.slice(0, 10).map((alert: any) => (
                      <div key={alert.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{alert.title}</p>
                          <p className="text-[10px] text-neutral-500">{alert.description}</p>
                          <p className="text-[10px] text-neutral-400">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.severity === 'warning' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No critical alerts" positive />
                  )}
                </DashboardCard>

                <DashboardCard title="Pending Waste Reports" icon={Package}>
                  {pendingWaste?.reports?.length ? (
                    pendingWaste.reports.slice(0, 10).map((report: any) => (
                      <div key={report.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{report.itemName || 'Unknown Item'}</p>
                          <p className="text-[10px] text-neutral-500">{report.reason}</p>
                          <p className="text-[10px] text-neutral-400 capitalize">
                            {report.wasteCategory?.replace('_', ' ')} - {report.quantity} {report.unit || 'units'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition">
                            Approve
                          </button>
                          <button className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No pending waste approvals" positive />
                  )}
                </DashboardCard>
              </div>

              <div className="flex items-center justify-center gap-6 py-4 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>GPS Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>Photo Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  <span>Full Audit Trail</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6" data-testid="stock-section">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Stock Control Center</h2>
                <Link href="/stock-control">
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-800 transition" data-testid="stock-control-link">
                    <Boxes className="w-3 h-3" />
                    Open Stock Control
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  label="Total Items" 
                  value={inventoryData?.batches?.length || 0} 
                  icon={Boxes}
                  color="blue"
                />
                <StatCard 
                  label="Low Stock" 
                  value={0} 
                  icon={TrendingUp}
                  color="yellow"
                />
                <StatCard 
                  label="Pending Waste" 
                  value={opsStats.pendingWasteApprovals || 0} 
                  icon={Package}
                  color="purple"
                  alert={(opsStats.pendingWasteApprovals || 0) > 0}
                />
                <StatCard 
                  label="Suspicious Activity" 
                  value={opsStats.suspiciousWasteReports || 0} 
                  icon={AlertTriangle}
                  color="red"
                  alert={(opsStats.suspiciousWasteReports || 0) > 0}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="Inventory Status" icon={Boxes}>
                  {inventoryData?.batches?.length ? (
                    inventoryData.batches.slice(0, 8).map((batch: any) => (
                      <div key={batch.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">Batch {batch.batchNumber || batch.id.slice(0, 8)}</p>
                          <p className="text-[10px] text-neutral-500">
                            {batch.quantityRemaining}/{batch.quantityReceived} remaining
                          </p>
                        </div>
                        {batch.expiryDate && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            new Date(batch.expiryDate) < new Date() ? 'bg-red-100 text-red-700' :
                            new Date(batch.expiryDate) < new Date(Date.now() + 7*24*60*60*1000) ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            Exp: {new Date(batch.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No inventory batches recorded" />
                  )}
                </DashboardCard>

                <DashboardCard title="Recent Waste Reports" icon={Package}>
                  {pendingWaste?.reports?.length ? (
                    pendingWaste.reports.slice(0, 8).map((report: any) => (
                      <div key={report.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{report.itemName || 'Unknown Item'}</p>
                          <p className="text-[10px] text-neutral-500">{report.reason}</p>
                        </div>
                        <StatusBadge status={report.supervisorApproval || 'pending'} />
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No waste reports" positive />
                  )}
                </DashboardCard>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-6 text-center">
                <Boxes className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <h3 className="font-semibold mb-1">Full Stock Control System</h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Access complete inventory management, waste reporting with photo evidence, 
                  stock counts, and variance tracking.
                </p>
                <Link href="/stock-control">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-white px-6 py-2 rounded-full text-xs font-medium hover:opacity-90 transition">
                    <Boxes className="w-4 h-4" />
                    Open Stock Control Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'vip' && (
            <div className="space-y-6" data-testid="vip-section">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">VIP Loyalty Program</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 border border-neutral-300 px-4 py-2 rounded-full text-xs font-medium hover:bg-neutral-100 transition" data-testid="add-benefit-button">
                    <Plus className="w-3 h-3" />
                    Add Benefit
                  </button>
                  <button className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90 transition" data-testid="create-event-button">
                    <Star className="w-3 h-3" />
                    Create VIP Event
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  label="Total Members" 
                  value={customersData?.customers?.length || 0} 
                  icon={Users}
                  color="gold"
                />
                <StatCard 
                  label="VIP Benefits" 
                  value={vipBenefitsData?.benefits?.length || 0} 
                  icon={Crown}
                  color="purple"
                />
                <StatCard 
                  label="Upcoming Events" 
                  value={vipEventsData?.events?.filter((e: any) => e.status === 'upcoming')?.length || 0} 
                  icon={Star}
                  color="blue"
                />
                <StatCard 
                  label="Active Events" 
                  value={vipEventsData?.events?.filter((e: any) => e.status === 'ongoing')?.length || 0} 
                  icon={Calendar}
                  color="green"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="VIP Members" icon={Crown}>
                  {customersData?.customers?.length ? (
                    customersData.customers.slice(0, 8).map((customer: any) => (
                      <div key={customer.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center text-xs font-bold text-white">
                            {customer.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{customer.fullName}</p>
                            <p className="text-[10px] text-neutral-500">{customer.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-[#b8962e]">{customer.loyaltyPoints || 0} pts</p>
                          <p className="text-[10px] text-neutral-500">{customer.country || 'Global'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No members registered yet" />
                  )}
                </DashboardCard>

                <DashboardCard title="VIP Benefits" icon={Star}>
                  {vipBenefitsData?.benefits?.length ? (
                    vipBenefitsData.benefits.map((benefit: any) => (
                      <div key={benefit.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                        <div>
                          <p className="text-xs font-semibold">{benefit.name}</p>
                          <p className="text-[10px] text-neutral-500">{benefit.description}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#d4af37]/20 text-[#b8962e] capitalize">
                          {benefit.benefitType.replace('_', ' ')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No VIP benefits configured" />
                  )}
                </DashboardCard>

                <DashboardCard title="VIP Events" icon={Calendar} className="md:col-span-2">
                  {vipEventsData?.events?.length ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {vipEventsData.events.map((event: any) => (
                        <div key={event.id} className="p-4 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-semibold">{event.name}</p>
                              <p className="text-[10px] text-neutral-500 capitalize">{event.eventType.replace('_', ' ')}</p>
                            </div>
                            <StatusBadge status={event.status} />
                          </div>
                          <p className="text-[10px] text-neutral-400 mb-2">{event.description}</p>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-neutral-500">
                              {new Date(event.eventDate).toLocaleDateString()} {event.startTime && `at ${event.startTime}`}
                            </span>
                            <span className="font-medium text-[#b8962e]">
                              {event.currentRsvps}/{event.maxGuests} RSVPs
                            </span>
                          </div>
                          {event.isInviteOnly && (
                            <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                              Invite Only
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No VIP events scheduled" />
                  )}
                </DashboardCard>
              </div>
            </div>
          )}

          {activeTab === 'hiring' && (
            <div className="space-y-6" data-testid="hiring-section">
              <IdentityVerificationPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, alert }: { 
  label: string; 
  value: number; 
  icon: any; 
  color: 'green' | 'blue' | 'yellow' | 'purple' | 'red' | 'gold' | 'neutral';
  alert?: boolean;
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    red: 'bg-red-50 border-red-200',
    gold: 'bg-[#d4af37]/10 border-[#d4af37]/30',
    neutral: 'bg-neutral-50 border-neutral-200',
  };
  
  const iconColors = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    gold: 'text-[#b8962e]',
    neutral: 'text-neutral-600',
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorClasses[color]} ${alert ? 'ring-2 ring-red-300 ring-offset-2' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-4 h-4 ${iconColors[color]}`} />
        {alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

function DashboardCard({ title, icon: Icon, children, className = '' }: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100">
        <Icon className="w-4 h-4 text-neutral-400" />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-neutral-100 text-neutral-500',
    draft: 'bg-neutral-100 text-neutral-500',
    submitted: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    no_show: 'bg-red-100 text-red-700',
    expired: 'bg-red-100 text-red-700',
    pending_renewal: 'bg-orange-100 text-orange-700',
    filed: 'bg-green-100 text-green-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    under_review: 'bg-purple-100 text-purple-700',
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${colors[status] || 'bg-neutral-100 text-neutral-600'} ${className}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function EmptyState({ message, positive = false }: { message: string; positive?: boolean }) {
  return (
    <div className={`py-6 text-center ${positive ? 'text-green-600' : 'text-neutral-400'}`}>
      <p className="text-xs">{message}</p>
    </div>
  );
}
