import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  UserCheck, AlertCircle, CheckCircle, XCircle, 
  Eye, Clock, Shield, FileText, Camera, CreditCard,
  Loader2, ChevronDown, ChevronUp
} from "lucide-react";

interface Application {
  id: string;
  fullName: string;
  email: string;
  positionTitle: string;
  location: string | null;
  idDocumentUrl: string | null;
  photoUrl: string | null;
  documentsSubmittedAt: string | null;
  identityVerificationStatus: string | null;
  identityVerifiedAt: string | null;
  identityVerifiedBy: string | null;
  verificationNotes: string | null;
}

interface DocumentViewerProps {
  application: Application;
  onClose: () => void;
  onVerify: (status: string, notes: string) => void;
  isVerifying: boolean;
}

function DocumentViewer({ application, onClose, onVerify, isVerifying }: DocumentViewerProps) {
  const [notes, setNotes] = useState("");
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{application.fullName}</h2>
              <p className="text-neutral-500">{application.positionTitle} • {application.location}</p>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <XCircle size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-700 font-medium">
              <CreditCard size={18} />
              <span>Government ID</span>
            </div>
            {application.idDocumentUrl ? (
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <img 
                  src={application.idDocumentUrl} 
                  alt="ID Document"
                  className="w-full h-auto"
                  data-testid="img-id-document"
                />
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-xl p-8 text-center text-neutral-400">
                No ID document uploaded
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-neutral-700 font-medium">
              <Camera size={18} />
              <span>Current Photo</span>
            </div>
            {application.photoUrl ? (
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <img 
                  src={application.photoUrl} 
                  alt="Candidate Photo"
                  className="w-full h-auto"
                  data-testid="img-candidate-photo"
                />
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-xl p-8 text-center text-neutral-400">
                No photo uploaded
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-neutral-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Verification Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this verification..."
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              rows={2}
              data-testid="input-verification-notes"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onVerify("verified", notes)}
              disabled={isVerifying}
              className="flex-1 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="btn-verify-approved"
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Verify - ID Matches
            </button>
            <button
              onClick={() => onVerify("rejected", notes)}
              disabled={isVerifying}
              className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="btn-verify-rejected"
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
              Reject - ID Mismatch
            </button>
            <button
              onClick={() => onVerify("needs_review", notes)}
              disabled={isVerifying}
              className="py-3 px-6 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="btn-verify-needs-review"
            >
              <AlertCircle size={18} />
              Flag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IdentityVerificationPanel() {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  
  const { data: verificationQueue, isLoading } = useQuery({
    queryKey: ["verification-queue"],
    queryFn: async () => {
      const res = await fetch("/api/careers/verification-queue");
      return res.json();
    },
  });
  
  const verifyMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const res = await fetch(`/api/careers/applications/${id}/verify-identity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status, 
          verifiedBy: "HR Admin",
          notes 
        }),
      });
      if (!res.ok) throw new Error("Failed to verify");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification-queue"] });
      setSelectedApp(null);
      toast.success("Identity verification updated!");
    },
    onError: () => {
      toast.error("Failed to update verification status");
    },
  });
  
  const handleVerify = (status: string, notes: string) => {
    if (!selectedApp) return;
    verifyMutation.mutate({ id: selectedApp.id, status, notes });
  };
  
  const applications: Application[] = verificationQueue?.applications || [];
  const pendingApps = applications.filter(a => a.identityVerificationStatus === "pending" || !a.identityVerificationStatus);
  const completedApps = applications.filter(a => a.identityVerificationStatus && a.identityVerificationStatus !== "pending");
  
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "verified":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle size={12} />Verified</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle size={12} />Rejected</span>;
      case "needs_review":
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1"><AlertCircle size={12} />Flagged</span>;
      default:
        return <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full flex items-center gap-1"><Clock size={12} />Pending</span>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <UserCheck className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Identity Verification</h2>
            <p className="text-sm text-neutral-500">Verify candidate ID documents match their photo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500">Pending:</span>
          <span className="px-2 py-1 bg-amber-100 text-amber-700 font-medium rounded-full">
            {pendingApps.length}
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : pendingApps.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200">
          <Shield className="mx-auto text-neutral-300 mb-3" size={48} />
          <h3 className="font-medium text-neutral-600">No pending verifications</h3>
          <p className="text-sm text-neutral-400 mt-1">All candidate documents have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingApps.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-neutral-600">
                      {app.fullName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">{app.fullName}</h3>
                    <p className="text-sm text-neutral-500">{app.positionTitle}</p>
                    <p className="text-xs text-neutral-400">{app.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(app.identityVerificationStatus)}
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
                    data-testid={`btn-review-${app.id}`}
                  >
                    <Eye size={16} />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {completedApps.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700 text-sm"
          >
            {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showCompleted ? "Hide" : "Show"} completed verifications ({completedApps.length})
          </button>
          
          {showCompleted && (
            <div className="mt-4 space-y-3">
              {completedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-neutral-50 border border-neutral-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-neutral-600">
                          {app.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-700">{app.fullName}</h3>
                        <p className="text-sm text-neutral-500">{app.positionTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.identityVerificationStatus)}
                      <span className="text-xs text-neutral-400">
                        by {app.identityVerifiedBy}
                      </span>
                    </div>
                  </div>
                  {app.verificationNotes && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <p className="text-sm text-neutral-500 flex items-start gap-2">
                        <FileText size={14} className="mt-0.5 flex-shrink-0" />
                        {app.verificationNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {selectedApp && (
        <DocumentViewer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onVerify={handleVerify}
          isVerifying={verifyMutation.isPending}
        />
      )}
    </div>
  );
}
