"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Clock, MapPin, Camera, LogIn, LogOut, Coffee, CheckCircle2, 
  AlertTriangle, History, User, Calendar, Timer, ChevronRight,
  Smartphone, Shield, Eye, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  essenceUnitId: string;
}

interface TimesheetEntry {
  id: string;
  employeeId: string;
  essenceUnitId: string;
  clockInTime: string;
  clockOutTime?: string;
  status: string;
  totalHours?: string;
  clockInPhotoUrl?: string;
  clockOutPhotoUrl?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function TimesheetPage() {
  const queryClient = useQueryClient();
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeePin, setEmployeePin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  
  const [activeEntry, setActiveEntry] = useState<TimesheetEntry | null>(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [timesheetHistory, setTimesheetHistory] = useState<TimesheetEntry[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: employeesData } = useQuery<{ employees: Employee[] }>({
    queryKey: ['/api/employees'],
  });

  const { data: unitsData } = useQuery<{ units: any[] }>({
    queryKey: ['/api/essence-units'],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedEmployee && isAuthenticated) {
      checkActiveEntry();
    }
  }, [selectedEmployee, isAuthenticated]);

  const getLocation = async (): Promise<LocationData | null> => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation not supported');
        setIsGettingLocation(false);
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setCurrentLocation(location);
          setIsGettingLocation(false);
          resolve(location);
        },
        (error) => {
          setLocationError(`Location error: ${error.message}`);
          setIsGettingLocation(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
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
        
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    }
  };

  const checkActiveEntry = async () => {
    if (!selectedEmployee) return;
    
    try {
      const res = await fetch(`/api/timesheet/active/${selectedEmployee.id}`);
      const data = await res.json();
      if (data.entry) {
        setActiveEntry(data.entry);
      }
    } catch (error) {
      console.error('Failed to check active entry');
    }
  };

  const loadHistory = async () => {
    if (!selectedEmployee) return;
    
    try {
      const res = await fetch(`/api/timesheet/employee/${selectedEmployee.id}`);
      const data = await res.json();
      setTimesheetHistory(data.entries || []);
      setShowHistoryDialog(true);
    } catch {
      toast.error('Failed to load history');
    }
  };

  const handleLogin = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    
    if (employeePin.length !== 4) {
      toast.error('Please enter 4-digit PIN');
      return;
    }
    
    setIsAuthenticated(true);
    toast.success(`Welcome, ${selectedEmployee.firstName}!`);
  };

  const handleClockIn = async () => {
    if (!selectedEmployee || !currentLocation || !capturedPhoto) {
      toast.error('Location and photo required');
      return;
    }
    
    try {
      const res = await fetch('/api/timesheet/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          essenceUnitId: selectedEmployee.essenceUnitId || 'demo-unit',
          scheduledShiftId: null,
          clockInLatitude: currentLocation.latitude.toString(),
          clockInLongitude: currentLocation.longitude.toString(),
          clockInPhotoUrl: capturedPhoto,
          clockInDeviceId: navigator.userAgent.slice(0, 50),
          clockInIpAddress: 'client'
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setActiveEntry(data.entry);
        setCapturedPhoto(null);
        toast.success('Clocked in successfully!');
      } else {
        throw new Error('Failed to clock in');
      }
    } catch {
      toast.error('Clock in failed');
    }
  };

  const handleClockOut = async () => {
    if (!activeEntry || !currentLocation || !capturedPhoto) {
      toast.error('Location and photo required');
      return;
    }
    
    try {
      const res = await fetch(`/api/timesheet/${activeEntry.id}/clock-out`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clockOutLatitude: currentLocation.latitude.toString(),
          clockOutLongitude: currentLocation.longitude.toString(),
          clockOutPhotoUrl: capturedPhoto,
          clockOutDeviceId: navigator.userAgent.slice(0, 50),
          clockOutIpAddress: 'client'
        })
      });
      
      if (res.ok) {
        setActiveEntry(null);
        setCapturedPhoto(null);
        toast.success('Clocked out successfully!');
      } else {
        throw new Error('Failed to clock out');
      }
    } catch {
      toast.error('Clock out failed');
    }
  };

  const handleBreakStart = async () => {
    if (!activeEntry) return;
    
    try {
      const res = await fetch('/api/timesheet/breaks/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timesheetEntryId: activeEntry.id,
          breakType: 'meal'
        })
      });
      
      if (res.ok) {
        setIsOnBreak(true);
        setBreakStartTime(new Date());
        toast.success('Break started');
      }
    } catch {
      toast.error('Failed to start break');
    }
  };

  const handleBreakEnd = async () => {
    setIsOnBreak(false);
    setBreakStartTime(null);
    toast.success('Break ended');
  };

  const formatDuration = (start: Date, end: Date = new Date()): string => {
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const employees = employeesData?.employees || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-neutral-200 shadow-lg">
          <CardHeader className="text-center border-b border-neutral-100 pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl tracking-wide">Essence Timesheet</CardTitle>
            <p className="text-sm text-neutral-500 mt-1">Employee Time Tracking</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                Select Employee
              </label>
              <Select 
                onValueChange={(value) => {
                  const emp = employees.find((e: Employee) => e.id === value);
                  setSelectedEmployee(emp || null);
                }}
              >
                <SelectTrigger data-testid="select-employee">
                  <SelectValue placeholder="Choose your name" />
                </SelectTrigger>
                <SelectContent>
                  {employees.length === 0 ? (
                    <>
                      <SelectItem value="emp-1">Sarah Chen (Manager)</SelectItem>
                      <SelectItem value="emp-2">Marco Silva (Supervisor)</SelectItem>
                      <SelectItem value="emp-3">Emma Wilson (Barista)</SelectItem>
                    </>
                  ) : (
                    employees.map((emp: Employee) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.role})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-neutral-600 mb-1.5 block">
                4-Digit PIN
              </label>
              <Input
                type="password"
                maxLength={4}
                value={employeePin}
                onChange={(e) => setEmployeePin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="text-center text-2xl tracking-[0.5em]"
                data-testid="input-pin"
              />
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
              disabled={!selectedEmployee || employeePin.length !== 4}
              data-testid="button-login"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-neutral-400">
                Default PIN: 1234
              </p>
            </div>
            
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
      <header className="bg-white border-b border-neutral-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {selectedEmployee?.firstName || 'Employee'}
              </p>
              <p className="text-xs text-neutral-500">
                {selectedEmployee?.role || 'Team Member'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-neutral-800" data-testid="text-current-time">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-neutral-500">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {activeEntry ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Currently Clocked In</span>
                </div>
                {isOnBreak && (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    <Coffee className="w-3 h-3 mr-1" />
                    On Break
                  </Badge>
                )}
              </div>
              
              <div className="text-center py-4">
                <p className="text-sm text-neutral-500 mb-1">Time worked today</p>
                <p className="text-4xl font-bold text-green-700" data-testid="text-time-worked">
                  {formatDuration(new Date(activeEntry.clockInTime))}
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Clocked in at {new Date(activeEntry.clockInTime).toLocaleTimeString()}
                </p>
              </div>
              
              {isOnBreak && breakStartTime && (
                <div className="text-center py-2 bg-orange-100 rounded-lg mb-4">
                  <p className="text-sm text-orange-700">
                    Break time: {formatDuration(breakStartTime)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-neutral-200">
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500 mb-1">Not clocked in</p>
              <p className="text-xs text-neutral-400">Ready to start your shift?</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-neutral-200">
          <CardHeader className="py-3 px-4 border-b border-neutral-100">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Location Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {currentLocation ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">Location Verified</p>
                  <p className="text-xs text-green-600">
                    Accuracy: ±{Math.round(currentLocation.accuracy)}m
                  </p>
                </div>
              </div>
            ) : locationError ? (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">Location Error</p>
                  <p className="text-xs text-red-600">{locationError}</p>
                </div>
              </div>
            ) : (
              <Button 
                onClick={getLocation}
                variant="outline"
                className="w-full"
                disabled={isGettingLocation}
                data-testid="button-get-location"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-200">
          <CardHeader className="py-3 px-4 border-b border-neutral-100">
            <CardTitle className="text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" />
              Photo Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {showCamera ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={capturePhoto}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500"
                    data-testid="button-capture"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const video = videoRef.current;
                      const stream = video?.srcObject as MediaStream;
                      stream?.getTracks().forEach(track => track.stop());
                      setShowCamera(false);
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : capturedPhoto ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={capturedPhoto} 
                    alt="Verification photo" 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Captured
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setCapturedPhoto(null)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
              </div>
            ) : (
              <Button 
                onClick={startCamera}
                variant="outline"
                className="w-full"
                data-testid="button-start-camera"
              >
                <Camera className="w-4 h-4 mr-2" />
                Open Camera
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {!activeEntry ? (
            <Button
              onClick={handleClockIn}
              className="h-20 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 col-span-2"
              disabled={!currentLocation || !capturedPhoto}
              data-testid="button-clock-in"
            >
              <LogIn className="w-6 h-6 mr-2" />
              Clock In
            </Button>
          ) : (
            <>
              {isOnBreak ? (
                <Button
                  onClick={handleBreakEnd}
                  className="h-20 bg-orange-500 hover:bg-orange-600"
                  data-testid="button-end-break"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  End Break
                </Button>
              ) : (
                <Button
                  onClick={handleBreakStart}
                  variant="outline"
                  className="h-20"
                  data-testid="button-start-break"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  Start Break
                </Button>
              )}
              
              <Button
                onClick={handleClockOut}
                className="h-20 bg-red-500 hover:bg-red-600"
                disabled={!currentLocation || !capturedPhoto || isOnBreak}
                data-testid="button-clock-out"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Clock Out
              </Button>
            </>
          )}
        </div>

        <Card className="border-neutral-200">
          <CardContent className="p-0">
            <button 
              onClick={loadHistory}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              data-testid="button-view-history"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <History className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">View History</p>
                  <p className="text-xs text-neutral-500">Recent timesheets & approvals</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </button>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 py-4 text-xs text-neutral-400">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>GPS Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>Photo Required</span>
          </div>
          <div className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Device Logged</span>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-neutral-200 p-4">
        <Button 
          variant="ghost" 
          className="w-full text-neutral-500"
          onClick={() => {
            setIsAuthenticated(false);
            setSelectedEmployee(null);
            setEmployeePin('');
            setActiveEntry(null);
            setCurrentLocation(null);
            setCapturedPhoto(null);
          }}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </footer>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Timesheet History
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {timesheetHistory.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No history found</p>
              </div>
            ) : (
              timesheetHistory.map((entry) => (
                <div key={entry.id} className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      {new Date(entry.clockInTime).toLocaleDateString()}
                    </p>
                    <Badge variant={
                      entry.status === 'approved' ? 'default' :
                      entry.status === 'pending_approval' ? 'secondary' :
                      entry.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {entry.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
                    <div>
                      <span className="block text-neutral-400">Clock In</span>
                      {new Date(entry.clockInTime).toLocaleTimeString()}
                    </div>
                    <div>
                      <span className="block text-neutral-400">Clock Out</span>
                      {entry.clockOutTime ? new Date(entry.clockOutTime).toLocaleTimeString() : '—'}
                    </div>
                  </div>
                  {entry.totalHours && (
                    <div className="mt-2 pt-2 border-t border-neutral-200 text-xs">
                      <span className="text-neutral-400">Total: </span>
                      <span className="font-medium">{entry.totalHours} hours</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
