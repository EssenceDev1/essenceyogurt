import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Building2, 
  AlertTriangle, 
  Thermometer, 
  Package, 
  Users, 
  Trash2, 
  Shield,
  Sparkles,
  Send,
  RefreshCw,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  GraduationCap,
  FileCheck,
  Siren,
  BarChart3,
  UserCheck,
  PlayCircle,
  StopCircle,
  Flame,
  Heart,
  Lock,
  Zap,
  Wrench,
  ClipboardCheck,
  Award,
  Star,
  Activity
} from "lucide-react";

interface HealthScore {
  overall: number;
  cleaning: number;
  foodSafety: number;
  inventory: number;
  theft: number;
  staff: number;
  equipment: number;
}

interface DashboardStats {
  totalUnits: number;
  activeUnits: number;
  alerts: {
    theft: number;
    operational: number;
    total: number;
  };
  pendingWasteApprovals: number;
  lowStockItems: number;
  healthScore: HealthScore;
  timestamp: string;
}

interface EssenceUnit {
  id: string;
  code: string;
  name: string;
  country: string;
  city: string;
  isActive: boolean;
}

interface ActiveAlerts {
  theft: any[];
  operational: any[];
  total: number;
}

interface WasteReport {
  id: string;
  wasteReason: string;
  wasteCategory: string;
  quantity: string;
  unit: string;
  description: string;
  estimatedCost: string | null;
  photoUrl: string | null;
}

interface GlobalStaff {
  id: string;
  name: string;
  role: string;
  locationId: string;
  status: string;
  trainingModules: string[];
  certifications: Record<string, string>;
}

interface GlobalLocation {
  id: string;
  code: string;
  name: string;
  region: string;
  isAirport: boolean;
  isMall: boolean;
  timezone: string;
  riskLevel: number;
}

interface Shift {
  id: string;
  locationId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  openingChecklistCompleted?: boolean;
  closingChecklistCompleted?: boolean;
}

interface EmergencyPlan {
  id: string;
  locationId: string;
  type: string;
  steps: string[];
  contactRoles: string[];
}

interface QAInspection {
  id: string;
  locationId: string;
  inspectorId: string;
  type: string;
  timestamp: string;
  overallScore: number;
  passed: boolean;
  scores: Record<string, number>;
  notes: string;
}

interface FraudSignal {
  id: string;
  locationId: string;
  type: string;
  severity: number;
  details: string;
  staffId?: string;
  timestamp: string;
  status: string;
}

interface TrainingModule {
  id: string;
  name: string;
  category: string;
  durationHours: number;
  requiredForRoles: string[];
  validityDays: number;
  mandatory: boolean;
}

interface LocationKPI {
  locationId: string;
  period: string;
  revenue: number;
  transactions: number;
  averageTicket: number;
  customerSatisfaction: number;
  employeeSatisfaction: number;
  foodSafetyScore: number;
  cleanlinessScore: number;
  incidentCount: number;
  wastePercentage: number;
  stockAccuracy: number;
}

function ScoreCard({ title, score, icon: Icon, color }: { title: string; score: number; icon: any; color: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-amber-200/20" data-testid={`score-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-sm font-medium text-amber-100">{title}</span>
          </div>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
        </div>
        <Progress value={score} className="mt-2 h-2 bg-white/10" />
      </CardContent>
    </Card>
  );
}

function AlertBadge({ count, type, color }: { count: number; type: string; color: string }) {
  if (count === 0) return null;
  
  return (
    <Badge className={`${color} text-white`} data-testid={`alert-badge-${type}`}>
      {count} {type}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: number }) {
  if (severity >= 8) return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>;
  if (severity >= 5) return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
  if (severity >= 3) return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium</Badge>;
  return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Low</Badge>;
}

function EmergencyTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    "FIRE": "bg-red-500/20 text-red-400 border-red-500/30",
    "MEDICAL": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "SECURITY": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "POWER_OUTAGE": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "EQUIPMENT_FAILURE": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };
  const icons: Record<string, any> = {
    "FIRE": Flame,
    "MEDICAL": Heart,
    "SECURITY": Lock,
    "POWER_OUTAGE": Zap,
    "EQUIPMENT_FAILURE": Wrench,
  };
  const Icon = icons[type] || AlertTriangle;
  
  return (
    <Badge className={colors[type] || "bg-gray-500/20 text-gray-400"}>
      <Icon className="h-3 w-3 mr-1" />
      {type.replace(/_/g, " ")}
    </Badge>
  );
}

export default function OctopusBrainDashboard() {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/octopus-brain/dashboard-stats"],
  });

  const { data: units } = useQuery<EssenceUnit[]>({
    queryKey: ["/api/octopus-brain/units"],
  });

  const { data: activeAlerts } = useQuery<ActiveAlerts>({
    queryKey: ["/api/octopus-brain/alerts/active"],
  });

  const { data: pendingWaste } = useQuery<WasteReport[]>({
    queryKey: ["/api/octopus-brain/waste/pending"],
  });

  const { data: globalStaff } = useQuery<GlobalStaff[]>({
    queryKey: ["/api/octopus-brain/global-staff"],
  });

  const { data: globalLocations } = useQuery<GlobalLocation[]>({
    queryKey: ["/api/octopus-brain/global-locations"],
  });

  const { data: qaInspections } = useQuery<QAInspection[]>({
    queryKey: ["/api/octopus-brain/qa-inspections"],
    enabled: activeTab === "qa",
  });

  const { data: fraudSignals } = useQuery<FraudSignal[]>({
    queryKey: ["/api/octopus-brain/fraud-signals"],
    enabled: activeTab === "fraud",
  });

  const { data: trainingModules } = useQuery<TrainingModule[]>({
    queryKey: ["/api/octopus-brain/training-modules"],
    enabled: activeTab === "training",
  });

  const { data: eventLog } = useQuery<any[]>({
    queryKey: ["/api/octopus-brain/events"],
    enabled: activeTab === "overview",
  });

  const { data: globalShifts } = useQuery<Shift[]>({
    queryKey: ["/api/octopus-brain/global-shifts"],
    enabled: activeTab === "shifts",
  });

  const { data: locationKPI } = useQuery<LocationKPI>({
    queryKey: [`/api/octopus-brain/global-locations/${selectedLocation}/kpi`],
    enabled: activeTab === "kpi" && !!selectedLocation,
  });

  const { data: emergencyPlans } = useQuery<EmergencyPlan[]>({
    queryKey: [`/api/octopus-brain/emergencies/${selectedLocation}`],
    enabled: activeTab === "emergency" && !!selectedLocation,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/octopus-brain/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, essenceUnitId: selectedUnit }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
    },
  });

  const triggerEmergencyMutation = useMutation({
    mutationFn: async ({ locationId, type }: { locationId: string; type: string }) => {
      const response = await fetch(`/api/octopus-brain/emergencies/${locationId}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/octopus-brain/events"] });
    },
  });

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatHistory(prev => [...prev, { role: "user", content: chatMessage }]);
    chatMutation.mutate(chatMessage);
    setChatMessage("");
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" data-testid="loading-spinner">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/20 border-t-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-200 font-medium">Loading Octopus Brain...</p>
        </div>
      </div>
    );
  }

  const healthScore = stats?.healthScore || {
    overall: 0,
    cleaning: 0,
    foodSafety: 0,
    inventory: 0,
    theft: 0,
    staff: 0,
    equipment: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl shadow-lg shadow-amber-500/20">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Octopus Brain
              </h1>
              <p className="text-amber-100/60">AI-Powered Global Operations Command Center</p>
            </div>
          </div>
          <Button 
            onClick={() => refetchStats()} 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg shadow-amber-500/20"
            data-testid="refresh-button"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-0 shadow-xl shadow-amber-500/20" data-testid="overall-health-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/80 text-sm font-medium">Overall Health</p>
                  <p className="text-5xl font-bold">{healthScore.overall}%</p>
                </div>
                <Sparkles className="h-14 w-14 text-amber-200/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10 text-white" data-testid="active-units-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/60 text-sm font-medium">Active Units</p>
                  <p className="text-5xl font-bold text-white">{stats?.activeUnits || 0}</p>
                </div>
                <Building2 className="h-14 w-14 text-blue-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10 text-white" data-testid="active-alerts-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/60 text-sm font-medium">Active Alerts</p>
                  <p className="text-5xl font-bold text-white">{stats?.alerts?.total || 0}</p>
                </div>
                <AlertTriangle className="h-14 w-14 text-red-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10 text-white" data-testid="pending-approvals-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/60 text-sm font-medium">Pending Approvals</p>
                  <p className="text-5xl font-bold text-white">{stats?.pendingWasteApprovals || 0}</p>
                </div>
                <Clock className="h-14 w-14 text-amber-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 backdrop-blur-sm border border-amber-200/10 p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-overview">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="units" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-units">
              <Building2 className="h-4 w-4 mr-2" />
              Units
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-staff">
              <Users className="h-4 w-4 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="shifts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-shifts">
              <Calendar className="h-4 w-4 mr-2" />
              Shifts
            </TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-emergency">
              <Siren className="h-4 w-4 mr-2" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="qa" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-qa">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              QA
            </TabsTrigger>
            <TabsTrigger value="fraud" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-fraud">
              <Shield className="h-4 w-4 mr-2" />
              Fraud
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-training">
              <GraduationCap className="h-4 w-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="kpi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-kpi">
              <BarChart3 className="h-4 w-4 mr-2" />
              KPIs
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="waste" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-waste">
              <Trash2 className="h-4 w-4 mr-2" />
              Waste
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-amber-100/70" data-testid="tab-chat">
              <Brain className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <ScoreCard title="Cleaning" score={healthScore.cleaning} icon={Sparkles} color="text-blue-400" />
              <ScoreCard title="Food Safety" score={healthScore.foodSafety} icon={Thermometer} color="text-emerald-400" />
              <ScoreCard title="Inventory" score={healthScore.inventory} icon={Package} color="text-purple-400" />
              <ScoreCard title="Theft Prevention" score={healthScore.theft} icon={Shield} color="text-red-400" />
              <ScoreCard title="Staff" score={healthScore.staff} icon={Users} color="text-cyan-400" />
              <ScoreCard title="Equipment" score={healthScore.equipment} icon={TrendingUp} color="text-orange-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {activeAlerts?.theft?.length || activeAlerts?.operational?.length ? (
                      <div className="space-y-2">
                        {activeAlerts?.theft?.map((alert: any, i: number) => (
                          <div key={`theft-${i}`} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20" data-testid={`theft-alert-${i}`}>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-400" />
                              <span className="text-white text-sm font-medium">{alert.alertType}</span>
                              <Badge variant="destructive" className="ml-auto">{alert.severity}</Badge>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">{alert.description}</p>
                          </div>
                        ))}
                        {activeAlerts?.operational?.map((alert: any, i: number) => (
                          <div key={`op-${i}`} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20" data-testid={`operational-alert-${i}`}>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-400" />
                              <span className="text-white text-sm font-medium">{alert.alertType}</span>
                              <Badge className="ml-auto bg-amber-500">{alert.severity}</Badge>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <CheckCircle className="h-12 w-12 mb-2 text-emerald-400" />
                        <p className="text-amber-100/60">No active alerts</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-amber-400" />
                    Recent Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {eventLog?.length ? (
                      <div className="space-y-2">
                        {eventLog.slice(0, 10).map((event: any, i: number) => (
                          <div key={i} className="p-3 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`event-${i}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm font-medium">{event.type?.replace(/_/g, " ")}</span>
                              <span className="text-amber-100/40 text-xs">{event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : ""}</span>
                            </div>
                            <p className="text-amber-100/60 text-xs mt-1">{event.details || event.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Activity className="h-12 w-12 mb-2 text-amber-400/50" />
                        <p className="text-amber-100/60">No recent events</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="units">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units?.map((unit) => (
                <Card 
                  key={unit.id} 
                  className={`bg-white/5 backdrop-blur-sm cursor-pointer transition-all hover:border-amber-400/50 ${selectedUnit === unit.id ? 'border-amber-400' : 'border-amber-200/10'}`}
                  onClick={() => setSelectedUnit(unit.id)}
                  data-testid={`unit-card-${unit.code}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{unit.name}</span>
                      <Badge className={unit.isActive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-gray-500/20 text-gray-400"}>
                        {unit.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-amber-100/60 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{unit.city}, {unit.country}</span>
                    </div>
                    <div className="text-amber-100/40 text-xs mt-1">
                      Code: {unit.code}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!units?.length && (
                <div className="col-span-full text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-2 text-amber-400/50" />
                  <p className="text-amber-100/60">No units configured</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-400" />
                  Global Staff Directory
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Manage staff across all locations with training and certification tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {globalStaff?.map((staff, i) => (
                      <div key={staff.id} className="p-4 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`staff-${staff.id}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                              {staff.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <span className="text-white font-medium">{staff.name}</span>
                              <p className="text-amber-100/60 text-xs">{staff.role?.replace(/_/g, " ")}</p>
                            </div>
                          </div>
                          <Badge className={
                            staff.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" :
                            staff.status === "ON_LEAVE" ? "bg-amber-500/20 text-amber-400" :
                            "bg-gray-500/20 text-gray-400"
                          }>
                            {staff.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {staff.trainingModules?.slice(0, 3).map((mod, j) => (
                            <Badge key={j} variant="outline" className="text-xs border-amber-200/20 text-amber-100/70">
                              {mod}
                            </Badge>
                          ))}
                          {(staff.trainingModules?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs border-amber-200/20 text-amber-100/70">
                              +{staff.trainingModules!.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {!globalStaff?.length && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Users className="h-16 w-16 mb-4 text-amber-400/50" />
                        <p className="text-lg text-amber-100/60">No staff registered</p>
                        <p className="text-sm text-amber-100/40">Add staff members to get started</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shifts Tab */}
          <TabsContent value="shifts">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-400" />
                  Shift Management
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Two-person rule enforcement, opening/closing checklists, and attendance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedLocation || ""} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-64 bg-white/5 border-amber-200/20 text-white">
                      <SelectValue placeholder="Select location..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-amber-200/20">
                      {globalLocations?.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id} className="text-white hover:bg-amber-500/20">
                          {loc.name} ({loc.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                      <PlayCircle className="h-8 w-8 text-emerald-400" />
                      <div>
                        <p className="text-emerald-400 font-medium">Opening Shift</p>
                        <p className="text-emerald-300/60 text-sm">Two staff required</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Clock className="h-8 w-8 text-amber-400" />
                      <div>
                        <p className="text-amber-400 font-medium">Mid Shift</p>
                        <p className="text-amber-300/60 text-sm">Standard coverage</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-500/10 border-purple-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                      <StopCircle className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-purple-400 font-medium">Closing Shift</p>
                        <p className="text-purple-300/60 text-sm">Checklist required</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <ScrollArea className="h-[300px]">
                  {globalShifts?.length ? (
                    <div className="space-y-3">
                      {globalShifts
                        .filter(shift => !selectedLocation || shift.locationId === selectedLocation)
                        .map((shift, i) => (
                        <div key={shift.id} className="p-4 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`shift-${i}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={
                                shift.type === "OPENING" ? "bg-emerald-500/20 text-emerald-400" :
                                shift.type === "CLOSING" ? "bg-purple-500/20 text-purple-400" :
                                "bg-amber-500/20 text-amber-400"
                              }>
                                {shift.type}
                              </Badge>
                              <span className="text-white font-medium">{shift.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {shift.openingChecklistCompleted && (
                                <Badge className="bg-emerald-500/20 text-emerald-400">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Opening Done
                                </Badge>
                              )}
                              {shift.closingChecklistCompleted && (
                                <Badge className="bg-purple-500/20 text-purple-400">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Closing Done
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-amber-100/60">
                            <span><Clock className="h-4 w-4 inline mr-1" />{shift.startTime} - {shift.endTime}</span>
                            <span><Users className="h-4 w-4 inline mr-1" />Staff: {shift.staffId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-amber-400/50" />
                      <p className="text-lg text-amber-100/60">No shifts scheduled</p>
                      <p className="text-sm text-amber-100/40 mt-1">Create shifts to manage opening/closing with two-person rule enforcement</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Siren className="h-5 w-5 text-red-400" />
                  Emergency Response System
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Emergency plans, protocols, and incident management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedLocation || ""} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-64 bg-white/5 border-amber-200/20 text-white">
                      <SelectValue placeholder="Select location..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-amber-200/20">
                      {globalLocations?.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id} className="text-white hover:bg-amber-500/20">
                          {loc.name} ({loc.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {["FIRE", "MEDICAL", "SECURITY", "POWER_OUTAGE", "EQUIPMENT_FAILURE"].map((type) => (
                    <Dialog key={type}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="h-auto py-4 flex-col gap-2 bg-white/5 border-amber-200/20 text-amber-100 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
                          disabled={!selectedLocation}
                          data-testid={`emergency-${type.toLowerCase()}`}
                        >
                          {type === "FIRE" && <Flame className="h-6 w-6" />}
                          {type === "MEDICAL" && <Heart className="h-6 w-6" />}
                          {type === "SECURITY" && <Lock className="h-6 w-6" />}
                          {type === "POWER_OUTAGE" && <Zap className="h-6 w-6" />}
                          {type === "EQUIPMENT_FAILURE" && <Wrench className="h-6 w-6" />}
                          <span className="text-xs">{type.replace(/_/g, " ")}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1a1a1a] border-amber-200/20 text-white">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-red-400">
                            <Siren className="h-5 w-5" />
                            Trigger {type.replace(/_/g, " ")} Emergency
                          </DialogTitle>
                          <DialogDescription className="text-amber-100/60">
                            This will activate the emergency protocol and notify all relevant staff.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button 
                            variant="destructive" 
                            onClick={() => selectedLocation && triggerEmergencyMutation.mutate({ locationId: selectedLocation, type })}
                            data-testid={`confirm-emergency-${type.toLowerCase()}`}
                          >
                            Trigger Emergency
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>

                <ScrollArea className="h-[300px]">
                  {emergencyPlans?.length ? (
                    <div className="space-y-3">
                      {emergencyPlans.map((plan, i) => (
                        <div key={plan.id} className="p-4 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`emergency-plan-${i}`}>
                          <div className="flex items-center justify-between mb-3">
                            <EmergencyTypeBadge type={plan.type} />
                          </div>
                          <div className="space-y-2">
                            {plan.steps?.map((step, j) => (
                              <div key={j} className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-medium">{j + 1}</span>
                                <span className="text-amber-100/80 text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Siren className="h-16 w-16 mx-auto mb-4 text-red-400/50" />
                      <p className="text-lg text-amber-100/60">Select a location to view emergency plans</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QA Tab */}
          <TabsContent value="qa">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-amber-400" />
                  Quality Assurance Inspections
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Track inspections, audits, and compliance scores across all locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {qaInspections?.length ? (
                    <div className="space-y-3">
                      {qaInspections.map((inspection, i) => (
                        <div key={inspection.id} className="p-4 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`qa-inspection-${i}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={
                                inspection.type === "ROUTINE" ? "bg-blue-500/20 text-blue-400" :
                                inspection.type === "SURPRISE" ? "bg-purple-500/20 text-purple-400" :
                                inspection.type === "FOLLOW_UP" ? "bg-amber-500/20 text-amber-400" :
                                "bg-cyan-500/20 text-cyan-400"
                              }>
                                {inspection.type}
                              </Badge>
                              <span className="text-amber-100/40 text-xs">{inspection.timestamp ? new Date(inspection.timestamp).toLocaleDateString() : ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-bold ${inspection.overallScore >= 80 ? 'text-emerald-400' : inspection.overallScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                                {inspection.overallScore}%
                              </span>
                              {inspection.passed ? (
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                          </div>
                          {inspection.notes && (
                            <p className="text-amber-100/60 text-sm">{inspection.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileCheck className="h-16 w-16 mb-4 text-amber-400/50" />
                      <p className="text-lg text-amber-100/60">No inspections recorded</p>
                      <p className="text-sm text-amber-100/40">Inspections will appear here once conducted</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fraud Tab */}
          <TabsContent value="fraud">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Fraud Detection Engine
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  AI-powered fraud monitoring: unusual refunds, excessive voids, suspicious waste, inventory discrepancies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {["UNUSUAL_REFUND", "EXCESSIVE_VOID", "SUSPICIOUS_WASTE", "INVENTORY_DISCREPANCY", "TIME_ANOMALY"].map((type) => (
                    <Card key={type} className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-3 text-center">
                        <p className="text-amber-100/60 text-xs">{type.replace(/_/g, " ")}</p>
                        <p className="text-2xl font-bold text-white mt-1">
                          {fraudSignals?.filter(f => f.type === type).length || 0}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <ScrollArea className="h-[350px]">
                  {fraudSignals?.length ? (
                    <div className="space-y-3">
                      {fraudSignals.map((signal, i) => (
                        <div key={signal.id} className="p-4 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`fraud-signal-${i}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-400" />
                              <span className="text-white font-medium">{signal.type?.replace(/_/g, " ")}</span>
                            </div>
                            <SeverityBadge severity={signal.severity} />
                          </div>
                          <p className="text-amber-100/60 text-sm">{signal.details}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-amber-100/40 text-xs">{signal.timestamp ? new Date(signal.timestamp).toLocaleString() : ""}</span>
                            <Badge className={
                              signal.status === "OPEN" ? "bg-red-500/20 text-red-400" :
                              signal.status === "INVESTIGATING" ? "bg-amber-500/20 text-amber-400" :
                              "bg-emerald-500/20 text-emerald-400"
                            }>
                              {signal.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Shield className="h-16 w-16 mb-4 text-emerald-400/50" />
                      <p className="text-lg text-emerald-400">No fraud signals detected</p>
                      <p className="text-sm text-amber-100/40">AI monitoring is active</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-amber-400" />
                  Training Academy
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Manage training modules, certifications, and compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {trainingModules?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trainingModules.map((module, i) => (
                        <div key={module.id} className="p-4 bg-white/5 rounded-lg border border-amber-200/10" data-testid={`training-module-${i}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{module.name}</span>
                            {module.mandatory && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Required</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-amber-100/60">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {module.durationHours}h
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              Valid {module.validityDays} days
                            </div>
                          </div>
                          <Badge className={`mt-2 ${
                            module.category === "FOOD_SAFETY" ? "bg-emerald-500/20 text-emerald-400" :
                            module.category === "CUSTOMER_SERVICE" ? "bg-blue-500/20 text-blue-400" :
                            module.category === "EQUIPMENT" ? "bg-orange-500/20 text-orange-400" :
                            module.category === "HYGIENE" ? "bg-cyan-500/20 text-cyan-400" :
                            module.category === "EMERGENCY" ? "bg-red-500/20 text-red-400" :
                            "bg-purple-500/20 text-purple-400"
                          }`}>
                            {module.category?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <GraduationCap className="h-16 w-16 mb-4 text-amber-400/50" />
                      <p className="text-lg text-amber-100/60">No training modules configured</p>
                      <p className="text-sm text-amber-100/40">Add training modules to track certifications</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPI Tab */}
          <TabsContent value="kpi">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-400" />
                  Key Performance Indicators
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Location performance metrics and operational insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={selectedLocation || ""} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-64 bg-white/5 border-amber-200/20 text-white">
                      <SelectValue placeholder="Select location..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-amber-200/20">
                      {globalLocations?.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id} className="text-white hover:bg-amber-500/20">
                          {loc.name} ({loc.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {locationKPI ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Revenue</p>
                        <p className="text-2xl font-bold text-white">${locationKPI.revenue?.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Transactions</p>
                        <p className="text-2xl font-bold text-white">{locationKPI.transactions}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Avg Ticket</p>
                        <p className="text-2xl font-bold text-white">${locationKPI.averageTicket}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Customer Satisfaction</p>
                        <p className="text-2xl font-bold text-emerald-400">{locationKPI.customerSatisfaction}%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Food Safety Score</p>
                        <p className="text-2xl font-bold text-emerald-400">{locationKPI.foodSafetyScore}%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Cleanliness</p>
                        <p className="text-2xl font-bold text-emerald-400">{locationKPI.cleanlinessScore}%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Incidents</p>
                        <p className="text-2xl font-bold text-amber-400">{locationKPI.incidentCount}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-amber-200/10">
                      <CardContent className="p-4">
                        <p className="text-amber-100/60 text-sm">Stock Accuracy</p>
                        <p className="text-2xl font-bold text-white">{locationKPI.stockAccuracy}%</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-amber-400/50" />
                    <p className="text-lg text-amber-100/60">Select a location to view KPIs</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white">All Active Alerts</CardTitle>
                <CardDescription className="text-amber-100/60">
                  Real-time monitoring of all kiosk alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <AlertBadge count={activeAlerts?.theft?.length || 0} type="Theft" color="bg-red-500" />
                  <AlertBadge count={activeAlerts?.operational?.length || 0} type="Operational" color="bg-amber-500" />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {activeAlerts?.theft?.map((alert: any, i: number) => (
                      <div key={`theft-${i}`} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-red-400" />
                          <span className="text-white font-medium">{alert.alertType}</span>
                          <Badge variant="destructive" className="ml-auto">{alert.severity}</Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{alert.description}</p>
                        {alert.aiAnalysis && (
                          <div className="mt-2 p-2 bg-black/20 rounded">
                            <p className="text-amber-400 text-xs font-medium">AI Analysis</p>
                            <p className="text-gray-400 text-xs">{alert.aiAnalysis}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {activeAlerts?.operational?.map((alert: any, i: number) => (
                      <div key={`op-${i}`} className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-amber-400" />
                          <span className="text-white font-medium">{alert.alertType}</span>
                          <Badge className="ml-auto bg-amber-500">{alert.severity}</Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{alert.message}</p>
                      </div>
                    ))}
                    {!activeAlerts?.theft?.length && !activeAlerts?.operational?.length && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-16 w-16 mb-4 text-emerald-400" />
                        <p className="text-lg text-white">All Systems Operational</p>
                        <p className="text-sm text-amber-100/60">No active alerts at this time</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Waste Tab */}
          <TabsContent value="waste">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white">Waste Prevention Dashboard</CardTitle>
                <CardDescription className="text-amber-100/60">
                  Review and approve waste reports with mandatory photo evidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {pendingWaste?.map((waste: any, i: number) => (
                      <div key={i} className="p-4 bg-white/5 rounded-lg border border-amber-200/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-amber-400" />
                            <span className="text-white font-medium">{waste.wasteReason}</span>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-400">{waste.wasteCategory}</Badge>
                        </div>
                        <p className="text-amber-100/60 text-sm mb-2">{waste.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-amber-100/40">Quantity: {waste.quantity} {waste.unit}</span>
                          <span className="text-amber-100/40">Est. Cost: ${waste.estimatedCost || "N/A"}</span>
                        </div>
                        {waste.photoUrl ? (
                          <div className="mt-2 p-2 bg-emerald-500/10 rounded flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-400 text-xs">Photo evidence attached</span>
                          </div>
                        ) : (
                          <div className="mt-2 p-2 bg-red-500/10 rounded flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-400" />
                            <span className="text-red-400 text-xs">Missing photo evidence</span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" data-testid={`approve-waste-${i}`}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" data-testid={`reject-waste-${i}`}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!pendingWaste?.length && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-16 w-16 mb-4 text-emerald-400" />
                        <p className="text-lg text-white">No Pending Approvals</p>
                        <p className="text-sm text-amber-100/60">All waste reports have been reviewed</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat">
            <Card className="bg-white/5 backdrop-blur-sm border-amber-200/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-400" />
                  Octopus Brain AI Assistant
                </CardTitle>
                <CardDescription className="text-amber-100/60">
                  Ask questions about operations, get recommendations, and analyze data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] mb-4 p-4 bg-black/20 rounded-lg border border-amber-200/10">
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Brain className="h-12 w-12 mb-2 text-amber-400" />
                      <p className="text-amber-100/60">Start a conversation with Octopus Brain</p>
                      <p className="text-xs mt-1 text-amber-100/40">Ask about operations, inventory, staff, or get AI recommendations</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatHistory.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg ${
                            msg.role === "user"
                              ? "bg-amber-500/20 ml-8 border border-amber-500/30"
                              : "bg-white/5 mr-8 border border-amber-200/10"
                          }`}
                          data-testid={`chat-message-${i}`}
                        >
                          <p className="text-xs text-amber-100/40 mb-1">
                            {msg.role === "user" ? "You" : "Octopus Brain"}
                          </p>
                          <p className="text-white text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))}
                      {chatMutation.isPending && (
                        <div className="p-3 rounded-lg bg-white/5 mr-8 border border-amber-200/10">
                          <p className="text-xs text-amber-100/40 mb-1">Octopus Brain</p>
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse flex space-x-1">
                              <div className="h-2 w-2 bg-amber-400 rounded-full"></div>
                              <div className="h-2 w-2 bg-amber-400 rounded-full animation-delay-200"></div>
                              <div className="h-2 w-2 bg-amber-400 rounded-full animation-delay-400"></div>
                            </div>
                            <span className="text-amber-100/40 text-sm">Thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask about operations, staffing, inventory, or get recommendations..."
                    className="bg-white/5 border-amber-200/20 text-white placeholder:text-amber-100/40"
                    onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                    data-testid="chat-input"
                  />
                  <Button 
                    onClick={handleSendChat} 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    disabled={chatMutation.isPending}
                    data-testid="chat-send-button"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-amber-100/40 text-sm">
          <p>Last updated: {stats?.timestamp ? new Date(stats.timestamp).toLocaleString() : "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
