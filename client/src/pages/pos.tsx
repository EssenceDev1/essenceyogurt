"use client";

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Scale, CreditCard, Banknote, Smartphone, User, Gift, RefreshCw, 
  ChevronRight, Check, X, Clock, Receipt, LogOut, Settings, Search,
  Plus, Minus, Trash2, AlertTriangle, Zap, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentMethod = 'cash' | 'card' | 'mobile' | 'gift' | 'loyalty';

interface RegionProfile {
  id: string;
  country: string;
  currency: string;
  currencySymbol: string;
  pricePerKg: number;
  eftSurchargeRate: number;
  tax: {
    rate: number;
    terminology: string;
    terminologyLocal: string;
    isInclusive: boolean;
    registrationLabel: string;
    registrationNumber: string;
    freeZoneRate: number;
    freeZoneAvailable: boolean;
    freeZoneNote: string;
  };
}

interface CartItem {
  id: string;
  name: string;
  weight: number;
  pricePerUnit: number;
  total: number;
  type: 'yogurt' | 'topping';
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  tier: string;
}

const COUNTRY_NAMES: Record<string, string> = {
  'AU': '🇦🇺 Australia',
  'SA': '🇸🇦 Saudi Arabia',
  'AE': '🇦🇪 UAE (Dubai)',
  'GR': '🇬🇷 Greece',
  'IL': '🇮🇱 Israel',
};

export default function PosPage() {
  const queryClient = useQueryClient();
  
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [openingCash, setOpeningCash] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('RP_AU');
  
  const [weight, setWeight] = useState(0);
  const [scaleConnected, setScaleConnected] = useState(true);
  const [lastScaleReading, setLastScaleReading] = useState<Date | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [giftCode, setGiftCode] = useState('');
  const [giftBalance, setGiftBalance] = useState<number | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCloseSessionDialog, setShowCloseSessionDialog] = useState(false);
  const [closingCash, setClosingCash] = useState('');
  
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);
  
  const { data: regionsData } = useQuery<{ regions: RegionProfile[] }>({
    queryKey: ['/api/config/regions'],
  });
  
  const regions = regionsData?.regions || [];
  const currentRegion = regions.find(r => r.id === selectedRegionId) || {
    id: 'RP_AU',
    country: 'AU',
    currency: 'AUD',
    currencySymbol: '$',
    pricePerKg: 50,
    eftSurchargeRate: 0.011,
    tax: {
      rate: 0.1,
      terminology: 'GST',
      terminologyLocal: 'Goods and Services Tax',
      isInclusive: true,
      registrationLabel: 'A.B.N',
      registrationNumber: 'XX XXX XXX XXX',
      freeZoneRate: 0,
      freeZoneAvailable: false,
      freeZoneNote: '',
    }
  };
  
  const PRICE_PER_KG = currentRegion.pricePerKg;
  const PRICE_PER_100G = PRICE_PER_KG / 10;
  const TAX_RATE = currentRegion.tax.rate;
  const EFT_SURCHARGE_RATE = currentRegion.eftSurchargeRate;
  const STORE_NAME = "ESSENCE YOGURT";
  const STORE_ADDRESS = "Premium Location";
  const STORE_SUBURB = currentRegion.country === 'AU' ? "Melbourne, VIC 3000" : 
                       currentRegion.country === 'SA' ? "Riyadh, KSA" :
                       currentRegion.country === 'AE' ? "Dubai, UAE" :
                       currentRegion.country === 'GR' ? "Athens, Greece" :
                       currentRegion.country === 'IL' ? "Tel Aviv, Israel" : "Location";
  const STORE_PHONE = "(XX) XXXX XXXX";
  const STORE_WEBSITE = "www.essenceyogurt.com";
  
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * TAX_RATE;
  const loyaltyDiscount = customer ? Math.min(customer.loyaltyPoints * 0.01, subtotal * 0.2) : 0;
  const giftDiscount = giftBalance ? Math.min(giftBalance, subtotal + tax - loyaltyDiscount) : 0;
  const grandTotal = subtotal + tax - loyaltyDiscount - giftDiscount;

  const { data: flavorsData } = useQuery<{ flavors: any[] }>({
    queryKey: ['/api/flavors'],
  });

  const { data: toppingsData } = useQuery<{ toppings: any[] }>({
    queryKey: ['/api/toppings'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (scaleConnected) {
        setLastScaleReading(new Date());
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [scaleConnected]);

  const addToCart = (type: 'yogurt' | 'topping', name: string) => {
    if (weight <= 0) {
      toast.error('Please add weight from scale');
      return;
    }
    
    const newItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      weight,
      pricePerUnit: PRICE_PER_100G,
      total: (weight / 100) * PRICE_PER_100G,
      type
    };
    
    setCart([...cart, newItem]);
    setWeight(0);
    toast.success(`Added ${name}: ${weight}g`);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const lookupCustomer = async () => {
    if (!customerSearch.trim()) return;
    
    try {
      const res = await fetch(`/api/pos/customer-lookup?email=${encodeURIComponent(customerSearch)}`);
      const data = await res.json();
      
      if (data.customer) {
        setCustomer(data.customer);
        toast.success(`Welcome back, ${data.customer.firstName}!`);
      } else {
        toast.error('Customer not found');
      }
    } catch {
      toast.error('Lookup failed');
    }
  };

  const checkGiftCard = async () => {
    if (!giftCode.trim()) return;
    
    try {
      const res = await fetch(`/api/egift/${giftCode}`);
      const data = await res.json();
      
      if (data.card && data.card.status === 'active') {
        setGiftBalance(parseFloat(data.card.currentBalance));
        toast.success(`Gift card balance: $${data.card.currentBalance}`);
      } else {
        toast.error('Invalid or expired gift card');
      }
    } catch {
      toast.error('Gift card lookup failed');
    }
  };

  const startSession = async () => {
    if (!openingCash) {
      toast.error('Please enter opening cash amount');
      return;
    }
    
    try {
      const res = await fetch('/api/pos/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essenceUnitId: 'demo-unit',
          openedBy: 'demo-cashier',
          registerNumber: 'REG-01',
          openingCash: openingCash
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.session.id);
        setSessionActive(true);
        toast.success('Session started');
      }
    } catch {
      toast.error('Failed to start session');
    }
  };

  const closeSession = async () => {
    if (!closingCash) {
      toast.error('Please enter closing cash amount');
      return;
    }
    
    const expectedCash = parseFloat(openingCash) + transactionHistory.reduce((sum, t) => {
      return t.paymentMethod === 'cash' ? sum + t.total : sum;
    }, 0);
    
    const variance = parseFloat(closingCash) - expectedCash;
    
    try {
      await fetch(`/api/pos/sessions/${sessionId}/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closingCash,
          expectedCash: expectedCash.toFixed(2),
          cashVariance: variance.toFixed(2)
        })
      });
      
      setSessionActive(false);
      setSessionId(null);
      setTransactionHistory([]);
      setShowCloseSessionDialog(false);
      toast.success(`Session closed. Variance: $${variance.toFixed(2)}`);
    } catch {
      toast.error('Failed to close session');
    }
  };

  const processPayment = async () => {
    if (!paymentMethod) {
      toast.error('Select a payment method');
      return;
    }
    
    const isEftPayment = paymentMethod === 'card' || paymentMethod === 'mobile';
    const eftSurcharge = isEftPayment ? grandTotal * EFT_SURCHARGE_RATE : 0;
    const finalTotal = grandTotal + eftSurcharge;
    
    if (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < finalTotal)) {
      toast.error('Insufficient cash');
      return;
    }
    
    const totalWeight = cart.reduce((sum, item) => sum + item.weight, 0);
    const receiptNumber = Math.floor(10000000 + Math.random() * 90000000);
    
    const transaction = {
      id: `TXN-${Date.now()}`,
      receiptNumber,
      items: cart,
      totalWeightGrams: totalWeight,
      totalWeightKg: (totalWeight / 1000).toFixed(3),
      pricePerKg: PRICE_PER_KG,
      subtotal,
      tax,
      taxAmount: tax,
      taxTerminology: currentRegion.tax.terminology,
      taxRate: currentRegion.tax.rate,
      loyaltyDiscount,
      giftDiscount,
      eftSurcharge,
      total: finalTotal,
      paymentMethod,
      paymentLabel: paymentMethod === 'card' ? 'EFTPOS' : paymentMethod === 'mobile' ? 'TAP & PAY' : 'CASH',
      cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : undefined,
      change: paymentMethod === 'cash' ? parseFloat(cashReceived) - finalTotal : undefined,
      customer: customer?.id,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : null,
      timestamp: new Date(),
      region: currentRegion,
      storeDetails: {
        name: STORE_NAME,
        address: STORE_ADDRESS,
        suburb: STORE_SUBURB,
        taxRegLabel: currentRegion.tax.registrationLabel,
        taxRegNumber: currentRegion.tax.registrationNumber,
        phone: STORE_PHONE,
        website: STORE_WEBSITE,
        currency: currentRegion.currency,
        currencySymbol: currentRegion.currencySymbol
      }
    };
    
    setTransactionHistory([transaction, ...transactionHistory]);
    setCompletedTransaction(transaction);
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
    
    setCart([]);
    setCustomer(null);
    setGiftCode('');
    setGiftBalance(null);
    setCashReceived('');
    setPaymentMethod(null);
    
    if (paymentMethod === 'cash') {
      toast.success(`Change: $${transaction.change?.toFixed(2)}`);
    } else {
      toast.success('Payment completed!');
    }
  };

  const simulateScale = (value: number) => {
    setWeight(prev => Math.max(0, prev + value));
    setLastScaleReading(new Date());
  };

  if (!sessionActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neutral-200 shadow-lg">
          <CardHeader className="text-center border-b border-neutral-100 pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
            <CardTitle className="text-xl tracking-wide">Essence POS</CardTitle>
            <p className="text-sm text-neutral-500 mt-1">Digital Point of Sale</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                <Globe className="w-3 h-3 inline mr-1" />
                Region / Country
              </label>
              <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
                <SelectTrigger data-testid="select-region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {COUNTRY_NAMES[region.country] || region.country}
                      {region.id.endsWith('_FZ') ? ' (Free Zone)' : ''}
                      {' - '}{region.currencySymbol}{region.pricePerKg}/kg
                      {region.tax.rate > 0 ? ` + ${(region.tax.rate * 100).toFixed(0)}% ${region.tax.terminology}` : ' (0% Tax)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentRegion.tax.freeZoneAvailable && !selectedRegionId.endsWith('_FZ') && (
                <p className="text-[10px] text-amber-600 mt-1">
                  Free Zone option available - select for 0% tax
                </p>
              )}
            </div>
            
            <div>
              <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                Opening Cash Float ({currentRegion.currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{currentRegion.currencySymbol}</span>
                <Input
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                  data-testid="input-opening-cash"
                />
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Price per kg:</span>
                <span className="font-medium">{currentRegion.currencySymbol}{currentRegion.pricePerKg.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{currentRegion.tax.terminology} Rate:</span>
                <span className="font-medium">{(currentRegion.tax.rate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{currentRegion.tax.registrationLabel}:</span>
                <span className="font-medium">{currentRegion.tax.registrationNumber}</span>
              </div>
              {currentRegion.tax.freeZoneNote && (
                <p className="text-amber-600 mt-1">{currentRegion.tax.freeZoneNote}</p>
              )}
            </div>
            
            <Button 
              onClick={startSession}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
              data-testid="button-start-session"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Session
            </Button>
            
            <Link href="/">
              <Button variant="ghost" className="w-full text-neutral-500">
                Back to Website
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                <span className="text-sm font-bold text-white">E</span>
              </div>
              <span className="font-semibold text-sm">Essence POS</span>
            </div>
            <Badge variant="outline" className="text-xs">
              REG-01
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Scale className="w-3.5 h-3.5" />
              {scaleConnected ? (
                <span className="text-green-600">Connected</span>
              ) : (
                <span className="text-red-500">Disconnected</span>
              )}
            </div>
            <Badge className="bg-green-50 text-green-700 border-green-200">
              Session Active
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowCloseSessionDialog(true)}
              className="text-neutral-500"
              data-testid="button-close-session"
            >
              <LogOut className="w-4 h-4 mr-1" />
              End
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="flex-1 p-4 grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card className="border-neutral-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    Scale Reading
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setWeight(0)}
                    data-testid="button-tare"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Tare
                  </Button>
                </div>
                
                <div className="text-center py-6 bg-neutral-50 rounded-xl">
                  <div className="text-5xl font-bold text-neutral-800" data-testid="text-weight">
                    {weight.toFixed(0)}
                    <span className="text-2xl text-neutral-400 ml-1">g</span>
                  </div>
                  <div className="text-lg text-amber-600 font-semibold mt-2">
                    ${((weight / 100) * PRICE_PER_100G).toFixed(2)}
                  </div>
                  {lastScaleReading && (
                    <p className="text-xs text-neutral-400 mt-2">
                      Last reading: {lastScaleReading.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => simulateScale(-50)}
                    data-testid="button-weight-minus"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => simulateScale(50)}
                    data-testid="button-weight-plus"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-24 text-center"
                    data-testid="input-weight"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-200">
              <CardContent className="p-4">
                <Tabs defaultValue="yogurt">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="yogurt" className="flex-1">Yogurt</TabsTrigger>
                    <TabsTrigger value="toppings" className="flex-1">Toppings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="yogurt" className="m-0">
                    <div className="grid grid-cols-3 gap-2">
                      {(flavorsData?.flavors || [
                        { id: '1', name: 'Original Greek' },
                        { id: '2', name: 'Belgian Chocolate' },
                        { id: '3', name: 'Mango Passion' },
                        { id: '4', name: 'Wild Berry' },
                        { id: '5', name: 'Matcha Green' },
                        { id: '6', name: 'Pistachio' }
                      ]).slice(0, 6).map((flavor: any) => (
                        <Button
                          key={flavor.id}
                          variant="outline"
                          className="h-16 text-xs flex flex-col"
                          onClick={() => addToCart('yogurt', flavor.name)}
                          data-testid={`button-flavor-${flavor.id}`}
                        >
                          {flavor.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="toppings" className="m-0">
                    <div className="grid grid-cols-4 gap-2">
                      {(toppingsData?.toppings || [
                        { id: '1', name: 'Fresh Strawberries' },
                        { id: '2', name: 'Blueberries' },
                        { id: '3', name: 'Granola' },
                        { id: '4', name: 'Chocolate Chips' },
                        { id: '5', name: 'Honey' },
                        { id: '6', name: 'Almonds' },
                        { id: '7', name: 'Coconut' },
                        { id: '8', name: 'Mochi' }
                      ]).slice(0, 8).map((topping: any) => (
                        <Button
                          key={topping.id}
                          variant="outline"
                          size="sm"
                          className="text-xs h-12"
                          onClick={() => addToCart('topping', topping.name)}
                          data-testid={`button-topping-${topping.id}`}
                        >
                          {topping.name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-neutral-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                      Customer Lookup
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Email or phone"
                        className="text-sm"
                        data-testid="input-customer-search"
                      />
                      <Button 
                        variant="outline" 
                        onClick={lookupCustomer}
                        data-testid="button-lookup-customer"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    {customer && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{customer.firstName} {customer.lastName}</span>
                          <Badge className="bg-amber-100 text-amber-800">{customer.tier}</Badge>
                        </div>
                        <p className="text-xs text-amber-700">{customer.loyaltyPoints} points available</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                      Gift Card / E-Gift
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={giftCode}
                        onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                        placeholder="EY-XXXX-XXXX"
                        className="text-sm font-mono"
                        data-testid="input-gift-code"
                      />
                      <Button 
                        variant="outline" 
                        onClick={checkGiftCard}
                        data-testid="button-check-gift"
                      >
                        <Gift className="w-4 h-4" />
                      </Button>
                    </div>
                    {giftBalance !== null && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 font-medium">
                          Balance: ${giftBalance.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-neutral-200 flex-1">
              <CardHeader className="py-3 px-4 border-b border-neutral-100">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Current Order</span>
                  {cart.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 h-6 px-2"
                      onClick={() => setCart([])}
                      data-testid="button-clear-cart"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400">
                    <Scale className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items yet</p>
                    <p className="text-xs mt-1">Add items from scale</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-xs">{item.name}</p>
                          <p className="text-xs text-neutral-500">{item.weight}g</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">${item.total.toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0 text-red-400"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {cart.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {loyaltyDiscount > 0 && (
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Loyalty Discount</span>
                        <span>-${loyaltyDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {giftDiscount > 0 && (
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Gift Card</span>
                        <span>-${giftDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200">
                      <span>Total</span>
                      <span className="text-amber-600" data-testid="text-total">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-14 flex flex-col"
                onClick={() => { setPaymentMethod('cash'); setShowPaymentDialog(true); }}
                disabled={cart.length === 0}
                data-testid="button-pay-cash"
              >
                <Banknote className="w-5 h-5 mb-1" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 flex flex-col"
                onClick={() => { setPaymentMethod('card'); setShowPaymentDialog(true); }}
                disabled={cart.length === 0}
                data-testid="button-pay-card"
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs">Card</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 flex flex-col"
                onClick={() => { setPaymentMethod('mobile'); setShowPaymentDialog(true); }}
                disabled={cart.length === 0}
                data-testid="button-pay-mobile"
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs">Mobile</span>
              </Button>
              <Button
                className="h-14 flex flex-col bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600"
                onClick={() => setShowPaymentDialog(true)}
                disabled={cart.length === 0}
                data-testid="button-checkout"
              >
                <Check className="w-5 h-5 mb-1" />
                <span className="text-xs">Pay</span>
              </Button>
            </div>

            <Card className="border-neutral-200">
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 max-h-32 overflow-y-auto">
                {transactionHistory.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-2">No transactions yet</p>
                ) : (
                  <div className="space-y-1">
                    {transactionHistory.slice(0, 5).map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded text-xs">
                        <div>
                          <p className="font-medium">{txn.id}</p>
                          <p className="text-neutral-500">{new Date(txn.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${txn.total.toFixed(2)}</p>
                          <Badge variant="outline" className="text-[10px]">{txn.paymentMethod}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Total: ${grandTotal.toFixed(2)}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {(['cash', 'card', 'mobile', 'gift'] as PaymentMethod[]).map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod(method)}
                  className="h-16 flex flex-col capitalize"
                  data-testid={`button-select-${method}`}
                >
                  {method === 'cash' && <Banknote className="w-5 h-5 mb-1" />}
                  {method === 'card' && <CreditCard className="w-5 h-5 mb-1" />}
                  {method === 'mobile' && <Smartphone className="w-5 h-5 mb-1" />}
                  {method === 'gift' && <Gift className="w-5 h-5 mb-1" />}
                  <span className="text-xs">{method}</span>
                </Button>
              ))}
            </div>
            
            {paymentMethod === 'cash' && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Cash Received</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                  <Input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="pl-7"
                    placeholder="0.00"
                    data-testid="input-cash-received"
                  />
                </div>
                {cashReceived && parseFloat(cashReceived) >= grandTotal && (
                  <p className="text-sm text-green-600 mt-2">
                    Change: ${(parseFloat(cashReceived) - grandTotal).toFixed(2)}
                  </p>
                )}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[5, 10, 20, 50].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setCashReceived(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {paymentMethod === 'card' && (
              <div className="text-center py-4 bg-neutral-50 rounded-lg">
                <CreditCard className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                <p className="text-sm text-neutral-600">Insert, tap, or swipe card</p>
                <p className="text-xs text-neutral-400 mt-1">Waiting for card reader...</p>
              </div>
            )}
            
            {paymentMethod === 'mobile' && (
              <div className="text-center py-4 bg-neutral-50 rounded-lg">
                <Smartphone className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                <p className="text-sm text-neutral-600">Scan QR code or tap to pay</p>
                <p className="text-xs text-neutral-400 mt-1">Apple Pay / Google Pay ready</p>
              </div>
            )}
            
            <Button 
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600"
              onClick={processPayment}
              disabled={!paymentMethod || (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < grandTotal))}
              data-testid="button-confirm-payment"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCloseSessionDialog} onOpenChange={setShowCloseSessionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close Session</DialogTitle>
            <DialogDescription>Count your cash drawer and enter the total.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Closing Cash Count</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                <Input
                  type="number"
                  value={closingCash}
                  onChange={(e) => setClosingCash(e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                  data-testid="input-closing-cash"
                />
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Opening Cash</span>
                <span>${parseFloat(openingCash || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Cash Sales</span>
                <span>
                  ${transactionHistory.reduce((sum, t) => {
                    return t.paymentMethod === 'cash' ? sum + t.total : sum;
                  }, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Transactions</span>
                <span>{transactionHistory.length}</span>
              </div>
            </div>
            
            <Button 
              className="w-full"
              variant="destructive"
              onClick={closeSession}
              data-testid="button-confirm-close"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Close Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="sr-only">Tax Invoice Receipt</DialogTitle>
          </DialogHeader>
          
          {completedTransaction && (
            <div className="font-mono text-xs bg-white p-4 border border-neutral-200 rounded-lg" data-testid="receipt-content">
              <div className="text-center mb-3">
                <p className="text-neutral-500 text-[10px]">Your order number is</p>
                <p className="text-2xl font-bold text-amber-600">{String(completedTransaction.receiptNumber).slice(-4)}</p>
              </div>
              
              <div className="text-center mb-4">
                <p className="font-bold text-sm">{completedTransaction.storeDetails.name}</p>
                <p className="text-[10px]">{completedTransaction.storeDetails.taxRegLabel} {completedTransaction.storeDetails.taxRegNumber}</p>
                <p className="text-[10px]">Tel: {completedTransaction.storeDetails.phone}</p>
                <p className="text-[10px] mt-1">{completedTransaction.storeDetails.address}, {completedTransaction.storeDetails.suburb}</p>
              </div>
              
              <div className="text-center border-y border-neutral-300 py-2 mb-3">
                <p className="font-bold">TAX INVOICE</p>
                <div className="flex justify-between text-[10px] mt-1">
                  <span>{new Date(completedTransaction.timestamp).toLocaleDateString('en-AU')}</span>
                  <span>No: {completedTransaction.id.replace('TXN-', 'A')}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Staff: POS Terminal</span>
                  <span>TakeAway</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-[10px] font-medium border-b border-neutral-200 pb-1 mb-2">
                  <span>DESCRIPTION</span>
                  <span>AMOUNT</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Yoghurt</p>
                      <p className="text-[10px] text-neutral-600">
                        {completedTransaction.totalWeightKg}kg X ${completedTransaction.pricePerKg.toFixed(2)}/kg = ${completedTransaction.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">${completedTransaction.subtotal.toFixed(2)}</p>
                  </div>
                  
                  {completedTransaction.items.filter((item: CartItem) => item.type === 'topping').map((item: CartItem, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-[10px] text-neutral-600">
                          {(item.weight / 1000).toFixed(2)}kg X ${PRICE_PER_KG.toFixed(2)}/kg = ${item.total.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-neutral-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <p>Sub Total:</p>
                  <p>${completedTransaction.subtotal.toFixed(2)}</p>
                </div>
                
                {completedTransaction.eftSurcharge > 0 && (
                  <div className="flex justify-between">
                    <p>Surcharge:</p>
                    <p>${completedTransaction.eftSurcharge.toFixed(2)}</p>
                  </div>
                )}
                
                {completedTransaction.loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Loyalty Discount:</p>
                    <p>-${completedTransaction.loyaltyDiscount.toFixed(2)}</p>
                  </div>
                )}
                
                {completedTransaction.giftDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Gift Card:</p>
                    <p>-${completedTransaction.giftDiscount.toFixed(2)}</p>
                  </div>
                )}
                
                <div className="flex justify-between font-bold border-t border-neutral-200 pt-1">
                  <p>Total:</p>
                  <p>{completedTransaction.storeDetails.currencySymbol}{completedTransaction.total.toFixed(2)}</p>
                </div>
                
                {completedTransaction.taxRate > 0 ? (
                  <div className="flex justify-between text-neutral-600">
                    <p>{completedTransaction.taxTerminology} Included In Total:</p>
                    <p>{completedTransaction.storeDetails.currencySymbol}{completedTransaction.taxAmount.toFixed(2)}</p>
                  </div>
                ) : (
                  <div className="flex justify-between text-amber-600">
                    <p>Zero-rated (Free Zone)</p>
                    <p>{completedTransaction.storeDetails.currencySymbol}0.00</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <p>{completedTransaction.paymentLabel}:</p>
                  <p>{completedTransaction.storeDetails.currencySymbol}{completedTransaction.total.toFixed(2)}</p>
                </div>
                
                {completedTransaction.change !== undefined && completedTransaction.change > 0 && (
                  <div className="flex justify-between">
                    <p>Change:</p>
                    <p>{completedTransaction.storeDetails.currencySymbol}{completedTransaction.change.toFixed(2)}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <p>Balance:</p>
                  <p>{completedTransaction.storeDetails.currencySymbol}0.00</p>
                </div>
              </div>
              
              <div className="border-t border-neutral-300 pt-2 mt-2 text-center text-[10px]">
                <p className="text-neutral-500">* Indicates G.S.T free item.</p>
                <p className="mt-3 font-bold text-amber-600">Thank you for choosing Essence</p>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (completedTransaction) {
                  const receiptEl = document.querySelector('[data-testid="receipt-content"]');
                  if (receiptEl) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head><title>Receipt</title>
                          <style>body { font-family: monospace; font-size: 12px; padding: 20px; }</style>
                          </head>
                          <body>${receiptEl.innerHTML}</body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }
              }}
              data-testid="button-print-receipt"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500"
              onClick={() => setShowReceiptDialog(false)}
              data-testid="button-done-receipt"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
