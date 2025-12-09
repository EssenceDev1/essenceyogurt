"use client";

import { useState, useRef } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Package, AlertTriangle, ClipboardList, Camera, TrendingDown, TrendingUp,
  Plus, Minus, Search, Filter, CheckCircle2, XCircle, Clock, Eye,
  Trash2, ArrowDownUp, FileText, BarChart3, ShieldAlert, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  id: string;
  itemName: string;
  itemCode: string;
  category: string;
  currentQuantity: string;
  minimumQuantity: string;
  maximumQuantity: string;
  unit: string;
  unitCost: string;
}

interface WasteReport {
  id: string;
  itemName: string;
  quantity: string;
  wasteCategory: string;
  reason: string;
  description: string;
  photoUrl?: string;
  supervisorApproval: string;
  reportedAt: string;
}

interface StockCount {
  id: string;
  countType: string;
  status: string;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
}

export default function StockControlPage() {
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [showWasteDialog, setShowWasteDialog] = useState(false);
  const [showCountDialog, setShowCountDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [wasteForm, setWasteForm] = useState({
    itemName: '',
    quantity: '',
    wasteCategory: 'spoilage',
    reason: '',
    description: '',
    photoUrl: ''
  });
  
  const [movementForm, setMovementForm] = useState({
    quantity: '',
    movementType: 'adjustment',
    reason: ''
  });
  
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: inventoryData, isLoading: loadingInventory } = useQuery<{ items: InventoryItem[] }>({
    queryKey: ['/api/inventory/demo-unit'],
  });

  const { data: wasteData, isLoading: loadingWaste } = useQuery<{ reports: WasteReport[] }>({
    queryKey: ['/api/waste-reports'],
  });

  const { data: stockCountsData } = useQuery<{ counts: StockCount[] }>({
    queryKey: ['/api/stock-counts'],
  });

  const { data: pendingWaste } = useQuery<{ reports: WasteReport[] }>({
    queryKey: ['/api/waste-reports/pending'],
  });

  const { data: suspiciousWaste } = useQuery<{ reports: WasteReport[] }>({
    queryKey: ['/api/waste-reports/suspicious'],
  });

  const demoInventory: InventoryItem[] = [
    { id: '1', itemName: 'Original Greek Base', itemCode: 'YOG-001', category: 'yogurt_base', currentQuantity: '45.5', minimumQuantity: '20', maximumQuantity: '100', unit: 'kg', unitCost: '8.50' },
    { id: '2', itemName: 'Belgian Chocolate', itemCode: 'YOG-002', category: 'yogurt_base', currentQuantity: '32.0', minimumQuantity: '15', maximumQuantity: '80', unit: 'kg', unitCost: '12.00' },
    { id: '3', itemName: 'Fresh Strawberries', itemCode: 'TOP-001', category: 'topping', currentQuantity: '8.5', minimumQuantity: '5', maximumQuantity: '25', unit: 'kg', unitCost: '6.50' },
    { id: '4', itemName: 'Blueberries Premium', itemCode: 'TOP-002', category: 'topping', currentQuantity: '4.2', minimumQuantity: '3', maximumQuantity: '15', unit: 'kg', unitCost: '9.00' },
    { id: '5', itemName: 'Granola Mix', itemCode: 'TOP-003', category: 'topping', currentQuantity: '12.0', minimumQuantity: '8', maximumQuantity: '30', unit: 'kg', unitCost: '4.50' },
    { id: '6', itemName: 'Chocolate Sauce', itemCode: 'SAU-001', category: 'sauce', currentQuantity: '6.5', minimumQuantity: '4', maximumQuantity: '20', unit: 'L', unitCost: '15.00' },
    { id: '7', itemName: 'Caramel Sauce', itemCode: 'SAU-002', category: 'sauce', currentQuantity: '5.0', minimumQuantity: '4', maximumQuantity: '20', unit: 'L', unitCost: '14.00' },
    { id: '8', itemName: 'Paper Cups 16oz', itemCode: 'PKG-001', category: 'packaging', currentQuantity: '850', minimumQuantity: '500', maximumQuantity: '2000', unit: 'pcs', unitCost: '0.12' }
  ];

  const inventory = inventoryData?.items || demoInventory;
  const wasteReports = wasteData?.reports || [];
  const stockCounts = stockCountsData?.counts || [];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => 
    parseFloat(item.currentQuantity) <= parseFloat(item.minimumQuantity)
  );

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error('Camera access denied');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.7);
        setCapturedPhoto(photoData);
        setWasteForm({ ...wasteForm, photoUrl: photoData });
        
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    }
  };

  const handleWasteReport = async () => {
    if (!wasteForm.itemName || !wasteForm.quantity || !wasteForm.reason) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const res = await fetch('/api/waste-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essenceUnitId: 'demo-unit',
          inventoryItemId: selectedItem?.id || 'demo-item',
          itemName: wasteForm.itemName,
          quantity: wasteForm.quantity,
          unit: selectedItem?.unit || 'kg',
          wasteCategory: wasteForm.wasteCategory,
          reason: wasteForm.reason,
          description: wasteForm.description,
          photoUrl: wasteForm.photoUrl,
          reportedBy: 'demo-employee'
        })
      });
      
      if (res.ok) {
        toast.success('Waste report submitted for approval');
        setShowWasteDialog(false);
        setWasteForm({ itemName: '', quantity: '', wasteCategory: 'spoilage', reason: '', description: '', photoUrl: '' });
        setCapturedPhoto(null);
        queryClient.invalidateQueries({ queryKey: ['/api/waste-reports'] });
      }
    } catch {
      toast.error('Failed to submit report');
    }
  };

  const handleMovement = async () => {
    if (!selectedItem || !movementForm.quantity) {
      toast.error('Please fill required fields');
      return;
    }
    
    const currentQty = parseFloat(selectedItem.currentQuantity);
    const moveQty = parseFloat(movementForm.quantity);
    const newQty = movementForm.movementType === 'received' ? currentQty + moveQty : currentQty - moveQty;
    
    try {
      await fetch('/api/inventory/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryItemId: selectedItem.id,
          essenceUnitId: 'demo-unit',
          movementType: movementForm.movementType,
          quantity: movementForm.quantity,
          quantityBefore: selectedItem.currentQuantity,
          quantityAfter: newQty.toFixed(2),
          reason: movementForm.reason,
          performedBy: 'demo-employee'
        })
      });
      
      toast.success('Inventory updated');
      setShowMovementDialog(false);
      setMovementForm({ quantity: '', movementType: 'adjustment', reason: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/demo-unit'] });
    } catch {
      toast.error('Failed to update inventory');
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    const current = parseFloat(item.currentQuantity);
    const min = parseFloat(item.minimumQuantity);
    const max = parseFloat(item.maximumQuantity);
    
    if (current <= min) return { status: 'low', color: 'bg-red-100 text-red-700 border-red-200' };
    if (current >= max * 0.9) return { status: 'high', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    return { status: 'ok', color: 'bg-green-100 text-green-700 border-green-200' };
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">Stock Control</h1>
                  <p className="text-xs text-neutral-500">Inventory Management</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {lowStockItems.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {lowStockItems.length} Low Stock
              </Badge>
            )}
            {(pendingWaste?.reports?.length || 0) > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {pendingWaste?.reports?.length} Pending Approval
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-neutral-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inventory.length}</p>
                  <p className="text-xs text-neutral-500">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{lowStockItems.length}</p>
                  <p className="text-xs text-red-600">Low Stock Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{pendingWaste?.reports?.length || 0}</p>
                  <p className="text-xs text-orange-600">Pending Waste</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{suspiciousWaste?.reports?.length || 0}</p>
                  <p className="text-xs text-purple-600">Suspicious Activity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="waste" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Waste Reports
            </TabsTrigger>
            <TabsTrigger value="counts" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Stock Counts
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="m-0">
            <Card className="border-neutral-200">
              <CardHeader className="border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Inventory Items</CardTitle>
                    <CardDescription>Track and manage stock levels</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search items..."
                        className="pl-9 w-64"
                        data-testid="input-search-inventory"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="yogurt_base">Yogurt Base</SelectItem>
                        <SelectItem value="topping">Toppings</SelectItem>
                        <SelectItem value="sauce">Sauces</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Item</th>
                      <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Code</th>
                      <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Category</th>
                      <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Current</th>
                      <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Min</th>
                      <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Max</th>
                      <th className="text-center text-xs font-medium text-neutral-500 px-4 py-3">Status</th>
                      <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => {
                      const stockStatus = getStockStatus(item);
                      return (
                        <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-sm">{item.itemName}</p>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{item.itemCode}</code>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm capitalize">{item.category.replace('_', ' ')}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold">{item.currentQuantity}</span>
                            <span className="text-xs text-neutral-500 ml-1">{item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-neutral-500">{item.minimumQuantity}</td>
                          <td className="px-4 py-3 text-right text-sm text-neutral-500">{item.maximumQuantity}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge className={stockStatus.color}>
                              {stockStatus.status === 'low' && <TrendingDown className="w-3 h-3 mr-1" />}
                              {stockStatus.status === 'high' && <TrendingUp className="w-3 h-3 mr-1" />}
                              {stockStatus.status === 'ok' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {stockStatus.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowMovementDialog(true);
                                }}
                                data-testid={`button-adjust-${item.id}`}
                              >
                                <ArrowDownUp className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setWasteForm({ ...wasteForm, itemName: item.itemName });
                                  setShowWasteDialog(true);
                                }}
                                data-testid={`button-waste-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waste" className="m-0">
            <Card className="border-neutral-200">
              <CardHeader className="border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Waste Reports</CardTitle>
                    <CardDescription>Track waste with photo evidence</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowWasteDialog(true)}
                    className="bg-gradient-to-r from-amber-400 to-amber-500"
                    data-testid="button-new-waste-report"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {wasteReports.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No waste reports</p>
                    <p className="text-sm">All inventory is accounted for</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wasteReports.map((report) => (
                      <div key={report.id} className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{report.itemName}</p>
                            <p className="text-sm text-neutral-500">{report.reason}</p>
                          </div>
                          <Badge variant={
                            report.supervisorApproval === 'approved' ? 'default' :
                            report.supervisorApproval === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {report.supervisorApproval}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500">
                          <span>{report.quantity} units</span>
                          <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
                          <Badge variant="outline">{report.wasteCategory}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="counts" className="m-0">
            <Card className="border-neutral-200">
              <CardHeader className="border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Stock Counts</CardTitle>
                    <CardDescription>Scheduled and completed inventory counts</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowCountDialog(true)}
                    className="bg-gradient-to-r from-amber-400 to-amber-500"
                    data-testid="button-new-count"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Count
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {stockCounts.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No scheduled counts</p>
                    <p className="text-sm">Schedule a stock count to verify inventory</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stockCounts.map((count) => (
                      <div key={count.id} className="p-4 border border-neutral-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium capitalize">{count.countType} Count</p>
                            <p className="text-sm text-neutral-500">
                              Scheduled: {new Date(count.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={
                            count.status === 'completed' ? 'default' :
                            count.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {count.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="m-0">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <TrendingDown className="w-5 h-5" />
                    Low Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lowStockItems.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>All stock levels OK</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lowStockItems.map((item) => (
                        <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-red-700">{item.itemName}</p>
                            <span className="text-sm text-red-600">
                              {item.currentQuantity} / {item.minimumQuantity} {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                    <ShieldAlert className="w-5 h-5" />
                    Suspicious Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(suspiciousWaste?.reports?.length || 0) === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No suspicious activity</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {suspiciousWaste?.reports?.map((report) => (
                        <div key={report.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-purple-700">{report.itemName}</p>
                            <Badge variant="destructive">Investigate</Badge>
                          </div>
                          <p className="text-sm text-purple-600 mt-1">{report.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showWasteDialog} onOpenChange={setShowWasteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Report Waste
            </DialogTitle>
            <DialogDescription>
              All waste must be documented with photo evidence
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Item Name</Label>
                <Input
                  value={wasteForm.itemName}
                  onChange={(e) => setWasteForm({ ...wasteForm, itemName: e.target.value })}
                  placeholder="Select or enter item"
                  data-testid="input-waste-item"
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={wasteForm.quantity}
                  onChange={(e) => setWasteForm({ ...wasteForm, quantity: e.target.value })}
                  placeholder="0.00"
                  data-testid="input-waste-quantity"
                />
              </div>
            </div>
            
            <div>
              <Label>Category</Label>
              <Select 
                value={wasteForm.wasteCategory} 
                onValueChange={(v) => setWasteForm({ ...wasteForm, wasteCategory: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spoilage">Spoilage (Expired)</SelectItem>
                  <SelectItem value="damage">Damage</SelectItem>
                  <SelectItem value="contamination">Contamination</SelectItem>
                  <SelectItem value="quality">Quality Issue</SelectItem>
                  <SelectItem value="overproduction">Overproduction</SelectItem>
                  <SelectItem value="suspicious">Suspicious / Theft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Reason</Label>
              <Input
                value={wasteForm.reason}
                onChange={(e) => setWasteForm({ ...wasteForm, reason: e.target.value })}
                placeholder="Brief reason for waste"
                data-testid="input-waste-reason"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={wasteForm.description}
                onChange={(e) => setWasteForm({ ...wasteForm, description: e.target.value })}
                placeholder="Detailed description..."
                rows={3}
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4" />
                Photo Evidence (Required)
              </Label>
              
              {showCamera ? (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <Button onClick={capturePhoto} className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              ) : capturedPhoto ? (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={capturedPhoto} alt="Waste evidence" className="w-full aspect-video object-cover" />
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Photo Captured
                    </Badge>
                  </div>
                  <Button variant="outline" onClick={() => setCapturedPhoto(null)} className="w-full">
                    Retake Photo
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={startCamera} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWasteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleWasteReport}
              disabled={!wasteForm.itemName || !wasteForm.quantity || !wasteForm.reason}
              className="bg-red-500 hover:bg-red-600"
              data-testid="button-submit-waste"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownUp className="w-5 h-5" />
              Inventory Adjustment
            </DialogTitle>
            {selectedItem && (
              <DialogDescription>
                {selectedItem.itemName} - Current: {selectedItem.currentQuantity} {selectedItem.unit}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Movement Type</Label>
              <Select 
                value={movementForm.movementType} 
                onValueChange={(v) => setMovementForm({ ...movementForm, movementType: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Received (Add)</SelectItem>
                  <SelectItem value="sold">Sold (Subtract)</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={movementForm.quantity}
                onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                placeholder="0.00"
                data-testid="input-movement-quantity"
              />
            </div>
            
            <div>
              <Label>Reason / Reference</Label>
              <Input
                value={movementForm.reason}
                onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                placeholder="PO number, reason, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMovementDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMovement}
              className="bg-gradient-to-r from-amber-400 to-amber-500"
              data-testid="button-confirm-movement"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
