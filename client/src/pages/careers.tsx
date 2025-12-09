"use client";

import { useState } from "react";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { 
  MapPin, Briefcase, Clock, ChevronRight, ChevronLeft, Users, Heart, Sparkles, Globe, 
  CheckCircle, X, Send, User, Mail, Phone, FileText, Link2, GraduationCap, Calendar,
  Building, Star, Check, AlertCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";

const values = [
  {
    icon: Sparkles,
    title: "Excellence",
    description: "We strive for perfection in everything we do, from our yogurt to our customer experience.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We love what we do and bring enthusiasm to every cup we serve.",
  },
  {
    icon: Users,
    title: "Teamwork",
    description: "We succeed together, supporting each other to achieve our shared goals.",
  },
  {
    icon: Globe,
    title: "Global Mindset",
    description: "We embrace diversity and think globally while acting locally.",
  },
];

const openPositions = [
  {
    id: 1,
    title: "Store Team Member",
    department: "Retail",
    location: "Dubai, UAE",
    type: "Part-time",
    salary: "AED 25-35/hour",
    hours: "8-20 hours/week",
    description: "Join our store team and deliver exceptional customer experiences. Perfect for students seeking flexible part-time work. Training provided.",
    requirements: ["Customer service orientation", "Flexible availability", "Positive attitude", "Basic English communication"],
    ideal: "Students studying hospitality, business, or any field welcome",
  },
  {
    id: 2,
    title: "Store Team Member",
    department: "Retail",
    location: "Riyadh, Saudi Arabia",
    type: "Part-time",
    salary: "SAR 30-40/hour",
    hours: "8-20 hours/week",
    description: "Be part of our growing Saudi Arabia team. Flexible shifts available for students. Full training and development opportunities.",
    requirements: ["Enthusiasm for customer service", "Weekend availability preferred", "Team player", "Arabic or English fluency"],
    ideal: "Students studying any field, looking for flexible income",
  },
  {
    id: 3,
    title: "Shift Supervisor",
    department: "Operations",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "AED 6,000-8,000/month",
    hours: "40 hours/week",
    description: "Lead store operations during your shift. Manage team members, handle customer concerns, and ensure quality standards.",
    requirements: ["1+ year retail/hospitality experience", "Leadership skills", "Problem-solving ability", "Flexible schedule"],
    ideal: "Recent graduates or experienced retail professionals",
  },
  {
    id: 4,
    title: "Store Manager",
    department: "Operations",
    location: "Dubai Mall, UAE",
    type: "Full-time",
    salary: "AED 12,000-18,000/month",
    hours: "45 hours/week",
    description: "Lead our flagship Dubai Mall location. Full P&L responsibility, team management, and customer experience excellence.",
    requirements: ["3+ years retail management", "Strong leadership", "Business acumen", "Arabic beneficial"],
    ideal: "Experienced retail managers ready for a luxury brand",
  },
  {
    id: 5,
    title: "Store Team Member",
    department: "Retail",
    location: "Athens, Greece",
    type: "Part-time",
    salary: "€12-15/hour",
    hours: "8-24 hours/week",
    description: "Join our European expansion. Perfect for university students seeking part-time work with flexible scheduling.",
    requirements: ["Customer-focused mindset", "Greek and/or English fluency", "Available weekends", "Positive energy"],
    ideal: "University students in Athens",
  },
  {
    id: 6,
    title: "Store Team Member",
    department: "Retail",
    location: "Sydney, Australia",
    type: "Part-time",
    salary: "AUD 28-35/hour",
    hours: "10-25 hours/week",
    description: "Join our Australian team. Great for uni students - we work around your class schedule. Award wages + tips.",
    requirements: ["Right to work in Australia", "Customer service skills", "Flexible availability", "Team player"],
    ideal: "University students, especially hospitality/business majors",
  },
  {
    id: 7,
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "AED 8,000-12,000/month",
    hours: "40 hours/week",
    description: "Support our marketing initiatives across social media, influencer partnerships, and brand campaigns.",
    requirements: ["Marketing/Communications degree preferred", "Social media expertise", "Creative mindset", "1-2 years experience"],
    ideal: "Recent marketing graduates or junior professionals",
  },
  {
    id: 8,
    title: "Franchise Development Manager",
    department: "Business Development",
    location: "London, UK",
    type: "Full-time",
    salary: "£45,000-65,000/year + bonus",
    hours: "40 hours/week",
    description: "Drive franchise expansion across Europe. Identify partners, guide through process, ensure brand standards.",
    requirements: ["5+ years franchise/business development", "Strong network", "Travel flexibility", "Excellent communication"],
    ideal: "Experienced franchise professionals",
  },
  {
    id: 9,
    title: "UX/UI Designer",
    department: "Technology",
    location: "Remote",
    type: "Full-time / Contract",
    salary: "USD 50,000-80,000/year",
    hours: "40 hours/week",
    description: "Design beautiful digital experiences for our luxury brand. App, web, and in-store digital touchpoints.",
    requirements: ["3+ years UX/UI experience", "Figma proficiency", "Portfolio required", "Luxury/premium brand experience preferred"],
    ideal: "Designers passionate about premium experiences",
  },
  {
    id: 10,
    title: "Store Team Member",
    department: "Retail",
    location: "Melbourne, Australia",
    type: "Part-time",
    salary: "AUD 28-35/hour",
    hours: "8-20 hours/week",
    description: "Perfect for students! We offer shifts around your uni schedule. Great team environment and free yogurt!",
    requirements: ["Available at least 2 shifts per week", "Customer service passion", "Right to work in Australia", "Team player"],
    ideal: "University students seeking flexible income",
  },
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  currentLocation: string;
  rightToWork: string;
  currentStatus: string;
  studyField: string;
  institution: string;
  graduationYear: string;
  yearsExperience: string;
  previousRole: string;
  previousEmployer: string;
  availableMonday: boolean;
  availableTuesday: boolean;
  availableWednesday: boolean;
  availableThursday: boolean;
  availableFriday: boolean;
  availableSaturday: boolean;
  availableSunday: boolean;
  hoursPerWeek: string;
  startDate: string;
  whyEssence: string;
  whyChooseYou: string;
  customerServiceExample: string;
  teamworkExample: string;
  strengthsWeaknesses: string;
  expectedSalary: string;
  linkedInUrl: string;
  resumeUrl: string;
  referralSource: string;
  additionalInfo: string;
  agreeTerms: boolean;
}

interface ApplicationFormProps {
  job: typeof openPositions[0];
  onClose: () => void;
  onSuccess: () => void;
}

function ApplicationForm({ job, onClose, onSuccess }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [resumeText, setResumeText] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    currentLocation: "",
    rightToWork: "",
    currentStatus: "",
    studyField: "",
    institution: "",
    graduationYear: "",
    yearsExperience: "",
    previousRole: "",
    previousEmployer: "",
    availableMonday: false,
    availableTuesday: false,
    availableWednesday: false,
    availableThursday: false,
    availableFriday: false,
    availableSaturday: false,
    availableSunday: false,
    hoursPerWeek: "",
    startDate: "",
    whyEssence: "",
    whyChooseYou: "",
    customerServiceExample: "",
    teamworkExample: "",
    strengthsWeaknesses: "",
    expectedSalary: "",
    linkedInUrl: "",
    resumeUrl: "",
    referralSource: "",
    additionalInfo: "",
    agreeTerms: false,
  });

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.phone) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;
      case 2:
        if (!formData.currentStatus) {
          toast.error("Please select your current status");
          return false;
        }
        return true;
      case 3:
        const hasAvailability = formData.availableMonday || formData.availableTuesday || 
          formData.availableWednesday || formData.availableThursday || 
          formData.availableFriday || formData.availableSaturday || formData.availableSunday;
        if (!hasAvailability) {
          toast.error("Please select at least one day of availability");
          return false;
        }
        if (!formData.hoursPerWeek) {
          toast.error("Please select your available hours per week");
          return false;
        }
        return true;
      case 4:
        if (!formData.whyEssence || formData.whyEssence.length < 50) {
          toast.error("Please tell us why you want to join Essence (minimum 50 characters)");
          return false;
        }
        if (!formData.whyChooseYou || formData.whyChooseYou.length < 50) {
          toast.error("Please tell us why we should choose you (minimum 50 characters)");
          return false;
        }
        return true;
      case 5:
        if (!formData.agreeTerms) {
          toast.error("Please agree to the terms and conditions");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateStep(5)) return;
    
    setLoading(true);
    try {
      const availability = [
        formData.availableMonday && "Monday",
        formData.availableTuesday && "Tuesday",
        formData.availableWednesday && "Wednesday",
        formData.availableThursday && "Thursday",
        formData.availableFriday && "Friday",
        formData.availableSaturday && "Saturday",
        formData.availableSunday && "Sunday",
      ].filter(Boolean).join(", ");

      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        positionTitle: job.title,
        department: job.department,
        location: job.location,
        yearsExperience: formData.yearsExperience,
        linkedInUrl: formData.linkedInUrl,
        resumeUrl: formData.resumeUrl,
        resumeText: resumeText || undefined,
        whyChooseYou: formData.whyChooseYou,
        customerServiceExample: formData.customerServiceExample,
        teamworkExample: formData.teamworkExample,
        availability: `${availability} | ${formData.hoursPerWeek}`,
        expectedSalary: formData.expectedSalary,
        startDate: formData.startDate,
        coverLetter: `
=== APPLICANT DETAILS ===
Date of Birth: ${formData.dateOfBirth || "Not provided"}
Current Location: ${formData.currentLocation}
Right to Work: ${formData.rightToWork}

=== CURRENT STATUS ===
Status: ${formData.currentStatus}
${formData.currentStatus === "Student" ? `
Field of Study: ${formData.studyField}
Institution: ${formData.institution}
Expected Graduation: ${formData.graduationYear}
` : ""}
Previous Role: ${formData.previousRole || "N/A"}
Previous Employer: ${formData.previousEmployer || "N/A"}

=== SCREENING QUESTIONS ===

Why do you want to work at Essence Yogurt?
${formData.whyEssence}

Why should we choose you over other applicants?
${formData.whyChooseYou}

Expected Salary: ${formData.expectedSalary || "Not specified"}

Describe a time you provided excellent customer service:
${formData.customerServiceExample || "Not provided"}

Describe a time you worked effectively in a team:
${formData.teamworkExample || "Not provided"}

What are your strengths and weaknesses?
${formData.strengthsWeaknesses || "Not provided"}

=== ADDITIONAL INFO ===
How did you hear about us: ${formData.referralSource || "Not specified"}
Additional Information: ${formData.additionalInfo || "None"}
        `.trim(),
      };
      
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });
      
      if (res.ok) {
        toast.success("Application submitted successfully!", {
          description: "Our HR team will review your application and contact you soon.",
        });
        onSuccess();
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full h-12 px-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all";
  const labelClass = "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2";
  const textareaClass = "w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all resize-none";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden my-2 sm:my-8 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#C9A227] to-[#9A7B0A] p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="text-white">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/80 mb-1">Apply for</p>
            <h2 className="text-lg sm:text-xl font-semibold">{job.title}</h2>
            <p className="text-xs sm:text-sm text-white/80">{job.location} • {job.type}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            data-testid="close-application-form"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-neutral-600">Step {step} of {totalSteps}</span>
            <span className="text-xs sm:text-sm text-neutral-500">
              {step === 1 && "Personal Details"}
              {step === 2 && "Experience & Education"}
              {step === 3 && "Availability"}
              {step === 4 && "Screening Questions"}
              {step === 5 && "Review & Submit"}
            </span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C9A227] to-[#9A7B0A] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Personal Details</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Tell us about yourself</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <User size={14} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Your full legal name"
                    className={inputClass}
                    data-testid="input-fullname"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Mail size={14} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className={inputClass}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <Phone size={14} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+971 50 123 4567"
                    className={inputClass}
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Calendar size={14} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className={inputClass}
                    data-testid="input-dob"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <MapPin size={14} />
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) => updateField("currentLocation", e.target.value)}
                    placeholder="City, Country"
                    className={inputClass}
                    data-testid="input-location"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Building size={14} />
                    Right to Work *
                  </label>
                  <select
                    required
                    value={formData.rightToWork}
                    onChange={(e) => updateField("rightToWork", e.target.value)}
                    className={inputClass}
                    data-testid="select-righttowork"
                  >
                    <option value="">Select...</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Permanent Resident">Permanent Resident</option>
                    <option value="Work Visa">Work Visa</option>
                    <option value="Student Visa">Student Visa (with work rights)</option>
                    <option value="Require Sponsorship">Require Sponsorship</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience & Education */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Experience & Education</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Your background and qualifications</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Current Status *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {["Student", "Employed", "Seeking Work", "Other"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateField("currentStatus", status)}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all ${
                        formData.currentStatus === status
                          ? "border-[#C9A227] bg-[#C9A227]/10 text-[#9A7B0A]"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                      data-testid={`btn-status-${status.toLowerCase().replace(" ", "-")}`}
                    >
                      <span className="font-medium text-xs sm:text-sm">{status}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.currentStatus === "Student" && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-4">
                  <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
                    <GraduationCap size={16} />
                    Student Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Field of Study</label>
                      <input
                        type="text"
                        value={formData.studyField}
                        onChange={(e) => updateField("studyField", e.target.value)}
                        placeholder="e.g., Business, Law, Media"
                        className={inputClass}
                        data-testid="input-studyfield"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => updateField("institution", e.target.value)}
                        placeholder="University/College name"
                        className={inputClass}
                        data-testid="input-institution"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Expected Graduation Year</label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => updateField("graduationYear", e.target.value)}
                      className={inputClass}
                      data-testid="select-gradyear"
                    >
                      <option value="">Select year...</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029+">2029 or later</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <Briefcase size={14} />
                    Years of Experience
                  </label>
                  <select
                    value={formData.yearsExperience}
                    onChange={(e) => updateField("yearsExperience", e.target.value)}
                    className={inputClass}
                    data-testid="select-experience"
                  >
                    <option value="">Select...</option>
                    <option value="No experience">No experience (that's OK!)</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Previous Role</label>
                  <input
                    type="text"
                    value={formData.previousRole}
                    onChange={(e) => updateField("previousRole", e.target.value)}
                    placeholder="Your most recent job title"
                    className={inputClass}
                    data-testid="input-previousrole"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Previous Employer</label>
                <input
                  type="text"
                  value={formData.previousEmployer}
                  onChange={(e) => updateField("previousEmployer", e.target.value)}
                  placeholder="Company name (or N/A if first job)"
                  className={inputClass}
                  data-testid="input-previousemployer"
                />
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Your Availability</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">When can you work? We're flexible!</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Days Available *
                </label>
                <p className="text-xs text-neutral-500 mb-3">Select all days you could potentially work</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[
                    { key: "availableMonday", label: "Mon" },
                    { key: "availableTuesday", label: "Tue" },
                    { key: "availableWednesday", label: "Wed" },
                    { key: "availableThursday", label: "Thu" },
                    { key: "availableFriday", label: "Fri" },
                    { key: "availableSaturday", label: "Sat" },
                    { key: "availableSunday", label: "Sun" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateField(key as keyof FormData, !formData[key as keyof FormData])}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData[key as keyof FormData]
                          ? "border-[#C9A227] bg-[#C9A227]/10"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                      data-testid={`btn-day-${label.toLowerCase()}`}
                    >
                      {formData[key as keyof FormData] && (
                        <Check size={14} className="mx-auto mb-1 text-[#C9A227]" />
                      )}
                      <span className={`font-medium text-sm ${formData[key as keyof FormData] ? "text-[#9A7B0A]" : ""}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <Clock size={14} />
                    Hours Per Week *
                  </label>
                  <select
                    required
                    value={formData.hoursPerWeek}
                    onChange={(e) => updateField("hoursPerWeek", e.target.value)}
                    className={inputClass}
                    data-testid="select-hoursperweek"
                  >
                    <option value="">Select...</option>
                    <option value="8-10 hours">8-10 hours</option>
                    <option value="10-15 hours">10-15 hours</option>
                    <option value="15-20 hours">15-20 hours</option>
                    <option value="20-25 hours">20-25 hours</option>
                    <option value="25-30 hours">25-30 hours</option>
                    <option value="30-40 hours">30-40 hours (Full-time)</option>
                    <option value="40+ hours">40+ hours</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    <Calendar size={14} />
                    Available to Start
                  </label>
                  <select
                    value={formData.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    className={inputClass}
                    data-testid="select-startdate"
                  >
                    <option value="">Select...</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Within 1 week">Within 1 week</option>
                    <option value="Within 2 weeks">Within 2 weeks</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="More than 1 month">More than 1 month</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Student-Friendly Scheduling</p>
                    <p className="text-blue-700">We understand class schedules change. We'll work with you to find shifts that fit around your studies.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Screening Questions */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center">
                  <Star size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Tell Us About You</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Help us get to know you better</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Why do you want to work at Essence Yogurt? *
                </label>
                <textarea
                  required
                  value={formData.whyEssence}
                  onChange={(e) => updateField("whyEssence", e.target.value)}
                  rows={4}
                  placeholder="Tell us what excites you about joining our team..."
                  className={textareaClass}
                  data-testid="textarea-whyessence"
                />
                <p className="text-xs text-neutral-400 mt-1">{formData.whyEssence.length}/50 minimum characters</p>
              </div>

              <div>
                <label className={labelClass}>
                  Why should we choose you over other applicants? *
                </label>
                <textarea
                  required
                  value={formData.whyChooseYou}
                  onChange={(e) => updateField("whyChooseYou", e.target.value)}
                  rows={4}
                  placeholder="What makes you stand out? Your unique skills, attitude, or qualities that would benefit our team..."
                  className={textareaClass}
                  data-testid="textarea-whychooseyou"
                />
                <p className="text-xs text-neutral-400 mt-1">{formData.whyChooseYou.length}/50 minimum characters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Your Expected Hourly Rate
                  </label>
                  <select
                    value={formData.expectedSalary}
                    onChange={(e) => updateField("expectedSalary", e.target.value)}
                    className={inputClass}
                    data-testid="select-expectedsalary"
                  >
                    <option value="">Select range...</option>
                    <option value="Minimum wage is fine">Minimum wage is fine</option>
                    <option value="$15-20/hr">$15-20/hr</option>
                    <option value="$20-25/hr">$20-25/hr</option>
                    <option value="$25-30/hr">$25-30/hr</option>
                    <option value="$30+/hr">$30+/hr</option>
                    <option value="Negotiable">Negotiable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Describe a time you provided great customer service
                </label>
                <textarea
                  value={formData.customerServiceExample}
                  onChange={(e) => updateField("customerServiceExample", e.target.value)}
                  rows={3}
                  placeholder="Even if it was helping a friend or family member..."
                  className={textareaClass}
                  data-testid="textarea-customerservice"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Describe a time you worked well in a team
                </label>
                <textarea
                  value={formData.teamworkExample}
                  onChange={(e) => updateField("teamworkExample", e.target.value)}
                  rows={3}
                  placeholder="School project, sports team, volunteer work..."
                  className={textareaClass}
                  data-testid="textarea-teamwork"
                />
              </div>

              <div>
                <label className={labelClass}>
                  What are your strengths and areas for growth?
                </label>
                <textarea
                  value={formData.strengthsWeaknesses}
                  onChange={(e) => updateField("strengthsWeaknesses", e.target.value)}
                  rows={3}
                  placeholder="Be honest - we value self-awareness!"
                  className={textareaClass}
                  data-testid="textarea-strengths"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Almost Done!</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">Review and submit your application</p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-neutral-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="text-sm text-neutral-500">Applying for</span>
                  <span className="font-semibold">{job.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Location</span>
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Name</span>
                  <span className="text-sm">{formData.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Email</span>
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Phone</span>
                  <span className="text-sm">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Status</span>
                  <span className="text-sm">{formData.currentStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Hours/Week</span>
                  <span className="text-sm">{formData.hoursPerWeek}</span>
                </div>
              </div>

              {/* Resume Upload Section */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <label className={labelClass}>
                  <FileText size={14} />
                  Your Resume/CV (Optional)
                </label>
                <p className="text-xs text-neutral-500 mb-3">
                  Paste your resume text below for instant AI analysis! Our AI will review it and provide feedback.
                </p>
                
                {/* Resume Text Area */}
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={6}
                  placeholder="Paste your resume/CV content here...

Example:
John Smith
Email: john@email.com | Phone: +61 412 345 678

EDUCATION
Bachelor of Business - University of Sydney

EXPERIENCE
Barista, Local Cafe (2023-Present)
- Served customers, handled payments

SKILLS
Customer service, teamwork, cash handling"
                  className={textareaClass}
                  data-testid="textarea-resume"
                />
                <p className="text-xs text-neutral-400 mt-1">
                  {resumeText.length > 0 && `${resumeText.length} characters`}
                </p>

                {/* AI Analysis Button */}
                {resumeText.length >= 100 && !resumeAnalysis && (
                  <button
                    type="button"
                    onClick={async () => {
                      setAnalyzingResume(true);
                      try {
                        const response = await fetch("/api/careers/upload-resume", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            resumeText: resumeText,
                            positionTitle: job.title,
                          }),
                        });
                        if (response.ok) {
                          const data = await response.json();
                          setResumeAnalysis(data.analysis);
                          toast.success("Resume analyzed by AI!");
                        }
                      } catch {
                        toast.info("Resume saved for HR review");
                      } finally {
                        setAnalyzingResume(false);
                      }
                    }}
                    disabled={analyzingResume}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50"
                    data-testid="btn-analyze-resume"
                  >
                    {analyzingResume ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        AI is analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Analyze My Resume with AI
                      </>
                    )}
                  </button>
                )}
                
                {/* AI Analysis Results */}
                {resumeAnalysis && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-amber-600" />
                      <span className="font-medium text-sm text-amber-800">AI Resume Analysis</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        resumeAnalysis.relevanceScore >= 70 ? 'bg-green-100 text-green-700' :
                        resumeAnalysis.relevanceScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        Score: {resumeAnalysis.relevanceScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mb-2">{resumeAnalysis.summary}</p>
                    {resumeAnalysis.strengths?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resumeAnalysis.strengths.slice(0, 3).map((s: string, i: number) => (
                          <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <Link2 size={14} />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedInUrl}
                    onChange={(e) => updateField("linkedInUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className={inputClass}
                    data-testid="input-linkedin"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <FileText size={14} />
                    Resume/CV Link (Alternative)
                  </label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => updateField("resumeUrl", e.target.value)}
                    placeholder="Google Drive, Dropbox link..."
                    className={inputClass}
                    data-testid="input-resume"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>How did you hear about us?</label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => updateField("referralSource", e.target.value)}
                  className={inputClass}
                  data-testid="select-referral"
                >
                  <option value="">Select...</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Friend/Family">Friend or Family</option>
                  <option value="Store Visit">Visited a Store</option>
                  <option value="University">University Job Board</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Anything else you'd like us to know?</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateField("additionalInfo", e.target.value)}
                  rows={3}
                  placeholder="Special skills, languages, interests..."
                  className={textareaClass}
                  data-testid="textarea-additional"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateField("agreeTerms", e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-neutral-300 text-[#C9A227] focus:ring-[#C9A227]"
                    data-testid="checkbox-terms"
                  />
                  <span className="text-sm text-amber-900">
                    I confirm that all information provided is accurate and I agree to Essence Yogurt's 
                    privacy policy. I consent to being contacted regarding my application via email or phone.
                  </span>
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center justify-center gap-2 h-12 px-4 sm:px-6 rounded-full border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors"
              data-testid="btn-prev"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          
          <div className="flex-1" />
          
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#C9A227] to-[#9A7B0A] text-white font-semibold hover:opacity-90 transition-opacity"
              data-testid="btn-next"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#C9A227] to-[#9A7B0A] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              data-testid="btn-submit-application"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applyingFor, setApplyingFor] = useState<typeof openPositions[0] | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  const filteredPositions = openPositions.filter(job => {
    const typeMatch = filterType === "all" || job.type.toLowerCase().includes(filterType.toLowerCase());
    const locationMatch = filterLocation === "all" || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    return typeMatch && locationMatch;
  });

  function handleApply(job: typeof openPositions[0]) {
    setApplyingFor(job);
  }

  function handleApplicationSuccess() {
    if (applyingFor) {
      setAppliedJobs([...appliedJobs, applyingFor.id]);
    }
    setApplyingFor(null);
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#C9A227] to-[#9A7B0A] text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-20 md:py-28">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 mb-3 sm:mb-4">
              Join Our Team
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4 sm:mb-6">
              Build your career with<br className="hidden sm:block" /> a global luxury brand.
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mb-6 sm:mb-8">
              Whether you're a student looking for flexible part-time work or an experienced 
              professional seeking your next challenge, we have opportunities for you.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="px-4 py-2 bg-white/20 rounded-full text-sm">
                <span className="font-semibold">{openPositions.length}</span> Open Positions
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full text-sm">
                Flexible Hours
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-full text-sm">
                Student Friendly
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-6 sm:mb-8">
              Our Values
            </h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#E8D48A] to-[#C9A227] flex items-center justify-center mb-3 sm:mb-4">
                    <value.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              <span className="text-sm font-medium text-neutral-600">Filter by:</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-10 px-4 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                  data-testid="filter-type"
                >
                  <option value="all">All Types</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                </select>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="h-10 px-4 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                  data-testid="filter-location"
                >
                  <option value="all">All Locations</option>
                  <option value="dubai">Dubai, UAE</option>
                  <option value="riyadh">Saudi Arabia</option>
                  <option value="australia">Australia</option>
                  <option value="greece">Greece</option>
                  <option value="london">London, UK</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <span className="text-sm text-neutral-500">
                Showing {filteredPositions.length} of {openPositions.length} positions
              </span>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="bg-neutral-50 border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-2">
              Open Positions
            </h2>
            <p className="text-neutral-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Click on any role to learn more and apply.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {filteredPositions.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl sm:rounded-2xl border border-neutral-200 bg-white overflow-hidden"
                  data-testid={`job-listing-${job.id}`}
                >
                  <button
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                    data-testid={`btn-expand-job-${job.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{job.title}</h3>
                        {job.type.includes("Part-time") && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] sm:text-xs font-medium whitespace-nowrap">
                            Student Friendly
                          </span>
                        )}
                        {appliedJobs.includes(job.id) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#9A7B0A] text-[10px] sm:text-xs font-medium whitespace-nowrap">
                            <CheckCircle size={10} />
                            Applied
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} className="hidden sm:inline" /> {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="hidden sm:inline" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="hidden sm:inline" /> {job.type}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`text-neutral-400 transition-transform flex-shrink-0 ml-2 ${
                        selectedJob === job.id ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {selectedJob === job.id && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-neutral-100">
                      <div className="py-4 space-y-4">
                        <p className="text-neutral-600 text-sm sm:text-base">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="bg-neutral-50 px-4 py-2 rounded-lg">
                            <span className="text-neutral-500">Salary:</span> <span className="font-medium">{job.salary}</span>
                          </div>
                          <div className="bg-neutral-50 px-4 py-2 rounded-lg">
                            <span className="text-neutral-500">Hours:</span> <span className="font-medium">{job.hours}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                          <ul className="grid gap-1 text-sm text-neutral-600">
                            {job.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 px-4 py-3 rounded-lg">
                          <span className="text-amber-800 text-sm">
                            <strong>Ideal for:</strong> {job.ideal}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleApply(job)}
                        disabled={appliedJobs.includes(job.id)}
                        className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#C9A227] to-[#9A7B0A] text-white px-6 sm:px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid={`btn-apply-${job.id}`}
                      >
                        {appliedJobs.includes(job.id) ? "Already Applied" : "Apply Now"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500 mb-6 sm:mb-8">
              Why Join Essence Yogurt?
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-sm text-neutral-600">
                  We work around your university schedule, exams, and life. Perfect for students!
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <GraduationCap size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Training & Growth</h3>
                <p className="text-sm text-neutral-600">
                  Full training provided. Develop skills in customer service, operations, and leadership.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border border-neutral-100">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Globe size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Global Brand</h3>
                <p className="text-sm text-neutral-600">
                  Join a luxury brand expanding globally. Career opportunities across multiple countries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#E8D48A] to-[#C9A227] p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                Don't see your perfect role?
              </h3>
              <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base">
                Send us your CV and we'll be in touch when a suitable opportunity comes up.
              </p>
              <a
                href="mailto:support@essenceyogurt.com?subject=Job Application - General Interest"
                className="inline-block rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-neutral-100 transition-colors"
                data-testid="btn-send-cv"
              >
                Send Your CV
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {applyingFor && (
        <ApplicationForm 
          job={applyingFor}
          onClose={() => setApplyingFor(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
}
