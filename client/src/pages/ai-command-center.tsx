import { useQuery } from "@tanstack/react-query";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { 
  Brain, 
  Activity, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  MessageSquare,
  ShieldCheck,
  Thermometer
} from "lucide-react";

interface CommandCenterStatus {
  overallHealth: "excellent" | "good" | "warning" | "critical";
  healthScore: number;
  activeAlerts: number;
  systemsStatus: {
    name: string;
    status: "online" | "degraded" | "offline";
    lastUpdate: string;
  }[];
  aiInsights: string[];
  priorityActions: {
    action: string;
    urgency: "low" | "medium" | "high" | "critical";
  }[];
  metrics: {
    todayRevenue: number;
    todayTransactions: number;
    activeLocations: number;
    staffOnDuty: number;
  };
}

const AI_SYSTEMS = [
  {
    id: "loyalty",
    name: "Loyalty AI",
    description: "Customer rewards & engagement",
    icon: MessageSquare,
    color: "from-amber-500 to-orange-500",
    features: ["Points tracking", "Tier recommendations", "Member insights"],
  },
  {
    id: "staff",
    name: "Staff AI",
    description: "Workforce management & scheduling",
    icon: Users,
    color: "from-blue-500 to-indigo-500",
    features: ["Sick replacement", "Shift optimization", "Performance insights"],
  },
  {
    id: "inventory",
    name: "Inventory AI",
    description: "Stock & safety monitoring",
    icon: Package,
    color: "from-green-500 to-emerald-500",
    features: ["Expiry alerts", "Fridge safety", "Reorder predictions"],
  },
  {
    id: "sales",
    name: "Sales AI",
    description: "Revenue analytics & forecasting",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    features: ["Pattern analysis", "Demand forecasting", "Peak predictions"],
  },
  {
    id: "support",
    name: "Support AI",
    description: "Customer service automation",
    icon: MessageSquare,
    color: "from-cyan-500 to-blue-500",
    features: ["FAQ handling", "Issue routing", "Sentiment analysis"],
  },
  {
    id: "compliance",
    name: "Compliance AI",
    description: "Food safety & regulations",
    icon: ShieldCheck,
    color: "from-red-500 to-rose-500",
    features: ["HACCP monitoring", "Audit prep", "Violation alerts"],
  },
];

function getHealthColor(health: string) {
  switch (health) {
    case "excellent":
      return "text-green-500";
    case "good":
      return "text-emerald-500";
    case "warning":
      return "text-amber-500";
    case "critical":
      return "text-red-500";
    default:
      return "text-neutral-500";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "degraded":
      return "bg-amber-500";
    case "offline":
      return "bg-red-500";
    default:
      return "bg-neutral-500";
  }
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-neutral-100 text-neutral-800 border-neutral-200";
  }
}

export default function AICommandCenter() {
  const { data: status, isLoading } = useQuery<CommandCenterStatus>({
    queryKey: ["command-center-status"],
    queryFn: async () => {
      const response = await fetch("/api/ai/command-center/status");
      if (!response.ok) throw new Error("Failed to fetch status");
      return response.json();
    },
    refetchInterval: 30000,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <MainNav />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-[#a07c10] rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">AI Command Center</h1>
              <p className="text-neutral-500">Unified dashboard for all AI-powered operations</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#d4af37] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">System Health</span>
                    <Activity className={`${getHealthColor(status?.overallHealth || "good")}`} size={20} />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-neutral-900">{status?.healthScore || 0}%</span>
                    <span className={`text-sm font-medium capitalize ${getHealthColor(status?.overallHealth || "good")}`}>
                      {status?.overallHealth || "Good"}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">Today's Revenue</span>
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                  <div className="text-3xl font-bold text-neutral-900">
                    ${(status?.metrics?.todayRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">Active Alerts</span>
                    <AlertTriangle className={status?.activeAlerts ? "text-amber-500" : "text-green-500"} size={20} />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-neutral-900">{status?.activeAlerts || 0}</span>
                    <span className="text-sm text-neutral-500">requiring attention</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500">Staff On Duty</span>
                    <Users className="text-blue-500" size={20} />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-neutral-900">{status?.metrics?.staffOnDuty || 0}</span>
                    <span className="text-sm text-neutral-500">across {status?.metrics?.activeLocations || 0} locations</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">AI Systems Status</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {AI_SYSTEMS.map((system) => (
                      <div
                        key={system.id}
                        className="p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all cursor-pointer"
                        data-testid={`ai-system-${system.id}`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${system.color} flex items-center justify-center mb-3`}>
                          <system.icon className="text-white" size={20} />
                        </div>
                        <h3 className="font-medium text-neutral-900 text-sm">{system.name}</h3>
                        <p className="text-xs text-neutral-500 mb-2">{system.description}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 font-medium">Online</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">AI Insights</h2>
                  <div className="space-y-3">
                    {(status?.aiInsights || ["All systems operating normally", "No critical issues detected"]).map((insight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                        <Zap className="text-[#d4af37] flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-neutral-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Priority Actions</h2>
                  {(status?.priorityActions || []).length > 0 ? (
                    <div className="space-y-3">
                      {status?.priorityActions.map((action, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-lg border ${getUrgencyColor(action.urgency)}`}
                        >
                          <span className="text-sm">{action.action}</span>
                          <span className="text-xs font-medium uppercase">{action.urgency}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
                      <CheckCircle size={40} className="mb-2" />
                      <p className="text-sm">No priority actions needed</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">System Components</h2>
                  <div className="space-y-3">
                    {(status?.systemsStatus || [
                      { name: "POS System", status: "online", lastUpdate: new Date().toISOString() },
                      { name: "Loyalty Engine", status: "online", lastUpdate: new Date().toISOString() },
                      { name: "Inventory AI", status: "online", lastUpdate: new Date().toISOString() },
                      { name: "Staff AI", status: "online", lastUpdate: new Date().toISOString() },
                    ]).map((system, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(system.status)}`} />
                          <span className="text-sm font-medium text-neutral-700">{system.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Clock size={12} />
                          <span>
                            {new Date(system.lastUpdate).toLocaleTimeString([], { 
                              hour: "2-digit", 
                              minute: "2-digit" 
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
