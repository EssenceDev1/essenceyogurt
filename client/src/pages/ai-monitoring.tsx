import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Activity,
  AlertTriangle,
  Languages,
  Receipt,
  Bug,
  Heart,
  Play,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Send,
  Loader2,
  BarChart3,
  Shield,
  Globe,
  Zap,
} from "lucide-react";

interface DashboardStats {
  totalLogs: number;
  errorCount: number;
  anomalyCount: number;
  unresolvedErrors: number;
  pendingReviews: number;
  healthStatus: string;
}

interface SystemLog {
  id: string;
  logLevel: string;
  category: string;
  source: string;
  message: string;
  createdAt: string;
  responseTime?: number;
}

interface AiReport {
  id: string;
  reportType: string;
  scope: string;
  title: string;
  summary: string;
  riskLevel?: string;
  isActionRequired: boolean;
  createdAt: string;
}

interface TransactionMonitoring {
  id: string;
  transactionId: string;
  transactionType: string;
  amount: string;
  riskScore?: string;
  isAnomaly: boolean;
  requiresReview: boolean;
  createdAt: string;
}

interface UserError {
  id: string;
  errorType: string;
  errorMessage: string;
  severity: string;
  occurrenceCount: number;
  isResolved: boolean;
  createdAt: string;
}

interface TranslationLog {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  translationKey: string;
  qualityScore?: string;
  isReviewed: boolean;
  createdAt: string;
}

interface HealthMetric {
  id: string;
  metricType: string;
  metricName: string;
  metricValue: string;
  status: string;
  trend?: string;
  aiInsight?: string;
  createdAt: string;
}

export default function AiMonitoringPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const queryClient = useQueryClient();

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/monitoring/dashboard"],
  });

  const { data: logs } = useQuery<SystemLog[]>({
    queryKey: ["/api/monitoring/logs"],
    select: (data: any) => data || [],
  });

  const { data: reports } = useQuery<AiReport[]>({
    queryKey: ["/api/monitoring/reports"],
    select: (data: any) => data || [],
  });

  const { data: transactions } = useQuery<TransactionMonitoring[]>({
    queryKey: ["/api/monitoring/transactions"],
    select: (data: any) => data || [],
  });

  const { data: errors } = useQuery<UserError[]>({
    queryKey: ["/api/monitoring/errors"],
    select: (data: any) => data || [],
  });

  const { data: translations } = useQuery<TranslationLog[]>({
    queryKey: ["/api/monitoring/translations"],
    select: (data: any) => data || [],
  });

  const { data: healthMetrics } = useQuery<HealthMetric[]>({
    queryKey: ["/api/monitoring/health"],
    select: (data: any) => data || [],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/monitoring/ai/chat", {
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "healthy":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "degrading":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNav />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-[#d4af37]" />
                AI Monitoring Centre
              </h1>
              <p className="text-neutral-500 mt-1">
                Gemini-powered intelligence for global retail operations
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries()}
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="border-neutral-200" data-testid="stat-total-logs">
              <CardContent className="p-4 text-center">
                <Activity className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-semibold">{statsLoading ? "..." : dashboardStats?.totalLogs || 0}</p>
                <p className="text-xs text-neutral-500">System Logs</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200" data-testid="stat-errors">
              <CardContent className="p-4 text-center">
                <Bug className="h-6 w-6 mx-auto text-red-500 mb-2" />
                <p className="text-2xl font-semibold">{statsLoading ? "..." : dashboardStats?.errorCount || 0}</p>
                <p className="text-xs text-neutral-500">Errors Today</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200" data-testid="stat-anomalies">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-semibold">{statsLoading ? "..." : dashboardStats?.anomalyCount || 0}</p>
                <p className="text-xs text-neutral-500">Anomalies</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200" data-testid="stat-unresolved">
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                <p className="text-2xl font-semibold">{statsLoading ? "..." : dashboardStats?.unresolvedErrors || 0}</p>
                <p className="text-xs text-neutral-500">Unresolved</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200" data-testid="stat-pending">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                <p className="text-2xl font-semibold">{statsLoading ? "..." : dashboardStats?.pendingReviews || 0}</p>
                <p className="text-xs text-neutral-500">Pending Reviews</p>
              </CardContent>
            </Card>

            <Card className="border-neutral-200" data-testid="stat-health">
              <CardContent className="p-4 text-center">
                <div className={`h-6 w-6 mx-auto rounded-full ${getStatusColor(dashboardStats?.healthStatus || "healthy")} mb-2`} />
                <p className="text-2xl font-semibold capitalize">{statsLoading ? "..." : dashboardStats?.healthStatus || "Healthy"}</p>
                <p className="text-xs text-neutral-500">System Health</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 mb-6">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" data-testid="tab-transactions">
                <Receipt className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="errors" data-testid="tab-errors">
                <Bug className="h-4 w-4 mr-2" />
                Errors
              </TabsTrigger>
              <TabsTrigger value="translations" data-testid="tab-translations">
                <Languages className="h-4 w-4 mr-2" />
                Translations
              </TabsTrigger>
              <TabsTrigger value="health" data-testid="tab-health">
                <Heart className="h-4 w-4 mr-2" />
                Health
              </TabsTrigger>
              <TabsTrigger value="reports" data-testid="tab-reports">
                <Shield className="h-4 w-4 mr-2" />
                AI Reports
              </TabsTrigger>
              <TabsTrigger value="chat" data-testid="tab-chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Recent System Logs
                    </CardTitle>
                    <CardDescription>Latest activity across all systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {(logs || []).length === 0 ? (
                        <p className="text-neutral-500 text-center py-8">No logs recorded yet</p>
                      ) : (
                        <div className="space-y-3">
                          {(logs || []).slice(0, 10).map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                              <Badge variant={log.logLevel === "error" ? "destructive" : "secondary"}>
                                {log.logLevel}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{log.message}</p>
                                <p className="text-xs text-neutral-500">
                                  {log.category} · {log.source}
                                </p>
                              </div>
                              {log.responseTime && (
                                <span className="text-xs text-neutral-400">{log.responseTime}ms</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#d4af37]" />
                      Latest AI Reports
                    </CardTitle>
                    <CardDescription>Gemini-generated insights and analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {(reports || []).length === 0 ? (
                        <p className="text-neutral-500 text-center py-8">No AI reports generated yet</p>
                      ) : (
                        <div className="space-y-3">
                          {(reports || []).slice(0, 5).map((report) => (
                            <div key={report.id} className="p-3 bg-neutral-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">{report.reportType}</Badge>
                                {report.riskLevel && getSeverityBadge(report.riskLevel)}
                              </div>
                              <p className="text-sm font-medium">{report.title}</p>
                              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{report.summary}</p>
                              {report.isActionRequired && (
                                <Badge className="mt-2 bg-red-100 text-red-700">Action Required</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-green-500" />
                    Transaction Monitoring
                  </CardTitle>
                  <CardDescription>AI-powered fraud detection and pattern analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {(transactions || []).length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">No transactions monitored yet</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Transactions will be analyzed in real-time as they occur
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {(transactions || []).map((txn) => (
                          <div
                            key={txn.id}
                            className={`p-4 rounded-lg border ${
                              txn.isAnomaly ? "border-red-200 bg-red-50" : "border-neutral-200 bg-neutral-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-sm">{txn.transactionId}</span>
                              <div className="flex items-center gap-2">
                                {txn.isAnomaly && <Badge variant="destructive">Anomaly</Badge>}
                                {txn.requiresReview && <Badge className="bg-yellow-500">Review</Badge>}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-neutral-500">Type</p>
                                <p className="font-medium capitalize">{txn.transactionType}</p>
                              </div>
                              <div>
                                <p className="text-neutral-500">Amount</p>
                                <p className="font-medium">${txn.amount}</p>
                              </div>
                              <div>
                                <p className="text-neutral-500">Risk Score</p>
                                <p className="font-medium">{txn.riskScore || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-red-500" />
                    User Error Tracking
                  </CardTitle>
                  <CardDescription>Customer and employee issue monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  {(errors || []).length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                      <p className="text-neutral-500">No errors tracked</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        System is operating smoothly
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {(errors || []).map((error) => (
                          <div
                            key={error.id}
                            className={`p-4 rounded-lg border ${
                              error.isResolved ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{error.errorType}</Badge>
                              <div className="flex items-center gap-2">
                                {getSeverityBadge(error.severity)}
                                {error.isResolved ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm font-medium">{error.errorMessage}</p>
                            <p className="text-xs text-neutral-500 mt-2">
                              Occurrences: {error.occurrenceCount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="translations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-purple-500" />
                    Translation Quality Monitoring
                  </CardTitle>
                  <CardDescription>Multi-language quality tracking across 9 languages</CardDescription>
                </CardHeader>
                <CardContent>
                  {(translations || []).length === 0 ? (
                    <div className="text-center py-12">
                      <Globe className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">No translations logged yet</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Translation quality will be monitored as users switch languages
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {(translations || []).map((trans) => (
                          <div key={trans.id} className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{trans.sourceLanguage}</Badge>
                                <span className="text-neutral-400">→</span>
                                <Badge variant="outline">{trans.targetLanguage}</Badge>
                              </div>
                              {trans.isReviewed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm font-mono">{trans.translationKey}</p>
                            {trans.qualityScore && (
                              <p className="text-xs text-neutral-500 mt-2">
                                Quality Score: {trans.qualityScore}%
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Ecosystem Health Metrics
                  </CardTitle>
                  <CardDescription>Real-time system performance monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  {(healthMetrics || []).length === 0 ? (
                    <div className="text-center py-12">
                      <Zap className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">No health metrics recorded</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Health metrics will be collected as the system operates
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {(healthMetrics || []).map((metric) => (
                        <div
                          key={metric.id}
                          className={`p-4 rounded-lg border ${
                            metric.status === "critical"
                              ? "border-red-200 bg-red-50"
                              : metric.status === "degraded"
                              ? "border-yellow-200 bg-yellow-50"
                              : "border-green-200 bg-green-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{metric.metricName}</span>
                            {getTrendIcon(metric.trend)}
                          </div>
                          <p className="text-2xl font-bold">{metric.metricValue}</p>
                          <Badge
                            className={`mt-2 ${
                              metric.status === "critical"
                                ? "bg-red-500"
                                : metric.status === "degraded"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          >
                            {metric.status}
                          </Badge>
                          {metric.aiInsight && (
                            <p className="text-xs text-neutral-500 mt-2">{metric.aiInsight}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#d4af37]" />
                    AI Analysis Reports
                  </CardTitle>
                  <CardDescription>Gemini-generated insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  {(reports || []).length === 0 ? (
                    <div className="text-center py-12">
                      <Brain className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">No AI reports generated yet</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Reports will be generated as data is analyzed
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {(reports || []).map((report) => (
                          <div key={report.id} className="p-4 rounded-lg border border-neutral-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{report.reportType}</Badge>
                                <Badge variant="secondary">{report.scope}</Badge>
                              </div>
                              {report.riskLevel && getSeverityBadge(report.riskLevel)}
                            </div>
                            <h3 className="font-medium mb-2">{report.title}</h3>
                            <p className="text-sm text-neutral-600">{report.summary}</p>
                            {report.isActionRequired && (
                              <div className="mt-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-600">Action Required</span>
                                <Button size="sm" variant="outline" className="ml-auto">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#d4af37]" />
                    AI Operations Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about operations, transactions, or system status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col h-[400px]">
                    <ScrollArea className="flex-1 mb-4 p-4 bg-neutral-50 rounded-lg">
                      {chatHistory.length === 0 ? (
                        <div className="text-center text-neutral-500 py-8">
                          <Brain className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                          <p>Start a conversation with your AI operations assistant</p>
                          <div className="mt-4 space-y-2">
                            <p className="text-xs text-neutral-400">Try asking:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setChatMessage("What's the current system status?")}
                              >
                                System status
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setChatMessage("Any anomalies detected today?")}
                              >
                                Today's anomalies
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setChatMessage("Summarize recent errors")}
                              >
                                Error summary
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatHistory.map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  msg.role === "user"
                                    ? "bg-[#d4af37] text-white"
                                    : "bg-white border border-neutral-200"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                          {chatMutation.isPending && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-neutral-200 p-3 rounded-lg">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask about operations, transactions, or system status..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                        className="flex-1 resize-none"
                        rows={2}
                        data-testid="input-chat"
                      />
                      <Button
                        onClick={handleSendChat}
                        disabled={chatMutation.isPending || !chatMessage.trim()}
                        className="bg-[#d4af37] hover:bg-[#b8962f] text-white"
                        data-testid="button-send-chat"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
