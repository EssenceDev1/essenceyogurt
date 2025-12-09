import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";
import { toast } from "sonner";
import { 
  FileCheck, Upload, Camera, CreditCard, CheckCircle, 
  AlertCircle, Loader2, Mail, ChevronRight, Shield
} from "lucide-react";
import { ObjectUploader } from "@/components/ObjectUploader";

interface ShortlistStatus {
  found: boolean;
  applicationId?: string;
  fullName?: string;
  positionTitle?: string;
  shortlisted: boolean;
  documentsSubmitted: boolean;
  status?: string;
}

export default function ShortlistDocuments() {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<ShortlistStatus | null>(null);
  const [idDocumentUrl, setIdDocumentUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const checkShortlistStatus = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setChecking(true);
    setSubmitted(false);
    setIdDocumentUrl("");
    setPhotoUrl("");
    try {
      const response = await fetch("/api/careers/check-shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        if (!data.found) {
          toast.error("No application found with this email");
        } else if (data.documentsSubmitted) {
          setSubmitted(true);
          toast.success("Your documents have already been submitted!");
        } else if (!data.shortlisted) {
          toast.info("Your application is still under review");
        } else {
          toast.success("You've been shortlisted! Please upload your documents.");
        }
      } else {
        toast.error("Failed to check status. Please try again.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const getUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const data = await response.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const submitDocuments = async () => {
    if (!idDocumentUrl || !photoUrl) {
      toast.error("Please upload both your ID document and photo");
      return;
    }
    
    if (!status?.applicationId) {
      toast.error("Application not found");
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await fetch("/api/careers/submit-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: status.applicationId,
          idDocumentUrl,
          photoUrl,
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        toast.success("Documents submitted successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to submit documents");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <main className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Shortlist Document Upload
            </h1>
            <p className="text-neutral-600">
              Congratulations on being shortlisted! Please upload your ID and photo to proceed.
            </p>
          </div>

          {!status && (
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-700 mb-4">
                <Mail size={20} />
                <span className="font-medium">Check Your Status</span>
              </div>
              <p className="text-sm text-neutral-500 mb-4">
                Enter the email address you used when applying
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  data-testid="input-email"
                />
                <button
                  onClick={checkShortlistStatus}
                  disabled={checking}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  data-testid="btn-check-status"
                >
                  {checking ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Check <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {status && !status.found && (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
              <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
              <h2 className="text-lg font-semibold text-red-700 mb-2">Application Not Found</h2>
              <p className="text-red-600 text-sm">
                We couldn't find an application with this email address. Please check and try again.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-4 text-red-600 underline text-sm"
              >
                Try another email
              </button>
            </div>
          )}

          {status?.found && !status.shortlisted && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="text-amber-600" size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-amber-800">Application Under Review</h2>
                  <p className="text-amber-700 text-sm mt-1">
                    Hi <span className="font-medium">{status.fullName}</span>, your application for 
                    <span className="font-medium"> {status.positionTitle}</span> is currently being reviewed by our team.
                  </p>
                  <p className="text-amber-600 text-sm mt-3">
                    You'll receive an email notification if you're shortlisted for the next stage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status?.found && status.shortlisted && !submitted && (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-green-800">You've Been Shortlisted!</h2>
                    <p className="text-green-700 text-sm mt-1">
                      Congratulations <span className="font-medium">{status.fullName}</span>! 
                      You've been shortlisted for <span className="font-medium">{status.positionTitle}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-amber-500" />
                  Required Documents
                </h3>
                <p className="text-sm text-neutral-500 mb-6">
                  Please upload clear, high-quality images of the following documents.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">Government ID</span>
                          <p className="text-xs text-neutral-500">Passport, Driver's License, or National ID</p>
                        </div>
                      </div>
                      {idDocumentUrl ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm">Uploaded</span>
                        </div>
                      ) : (
                        <ObjectUploader
                          maxFileSize={10485760}
                          allowedFileTypes={["image/*", ".pdf"]}
                          onGetUploadParameters={getUploadParameters}
                          onComplete={(result) => {
                            const url = new URL(result.uploadURL);
                            setIdDocumentUrl(url.pathname);
                            toast.success("ID document uploaded!");
                          }}
                          buttonClassName="bg-amber-100 text-amber-700 hover:bg-amber-200"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload ID
                        </ObjectUploader>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Camera className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">Recent Photo</span>
                          <p className="text-xs text-neutral-500">Clear headshot, passport-style preferred</p>
                        </div>
                      </div>
                      {photoUrl ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm">Uploaded</span>
                        </div>
                      ) : (
                        <ObjectUploader
                          maxFileSize={10485760}
                          allowedFileTypes={["image/*"]}
                          onGetUploadParameters={getUploadParameters}
                          onComplete={(result) => {
                            const url = new URL(result.uploadURL);
                            setPhotoUrl(url.pathname);
                            toast.success("Photo uploaded!");
                          }}
                          buttonClassName="bg-amber-100 text-amber-700 hover:bg-amber-200"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload Photo
                        </ObjectUploader>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={submitDocuments}
                  disabled={!idDocumentUrl || !photoUrl || submitting}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="btn-submit-documents"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Submit Documents
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {submitted && (
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Documents Submitted!</h2>
              <p className="text-green-700">
                Thank you, <span className="font-medium">{status?.fullName}</span>! Your documents have been received.
              </p>
              <p className="text-green-600 text-sm mt-3">
                Our HR team will review your documents and contact you soon about the next steps.
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="flex items-start gap-3">
              <Shield size={16} className="text-neutral-400 mt-0.5" />
              <p className="text-xs text-neutral-500">
                Your documents are stored securely and will only be used for identity verification purposes. 
                We follow strict data protection guidelines in accordance with GDPR and local regulations.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
