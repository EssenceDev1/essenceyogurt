# Essence Yogurt - Luxury Soft Serve Platform

## Overview

Essence Yogurt is a luxury frozen yogurt business platform designed for premium self-serve locations. It serves as both a customer-facing web presence and an internal management system, supporting franchise operations, revenue tracking, and loyalty programs. The project is a full-stack TypeScript application with a React SPA frontend, a Node.js/Express backend, and a PostgreSQL database. The business vision emphasizes global expansion into high-end venues, a luxury brand aesthetic, and efficient, "military-grade" operational control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The frontend uses React with TypeScript, featuring a luxury design system built with shadcn/ui (Radix UI + Tailwind CSS) in a "New York" style variant. It incorporates gold gradients, pure white aesthetics, and a specific font stack (Inter, Playfair Display, Cormorant Garamond). The design is mobile-first, responsive, and supports multi-language internationalization across 12 languages with RTL support. Key components like LuxeCards, LuxeButtons, LuxeTabs, and LuxeTables are optimized for a premium user experience and E2E testing.

**Header Navigation (Yochi-inspired)**:
- Announcement bar with VIP Club promotion
- Distinctive SoftServeIcon logo (gold circle with cream swirl) - uses unique gradient IDs per instance
- Accessible dropdown menus with keyboard support (onClick, onFocus, Escape key, aria-expanded, aria-controls, aria-haspopup)
- Products/Experience/About dropdown categories with descriptions
- Mobile accordion-style navigation with ARIA attributes

### Technical Implementations

**Frontend**:
- **Frameworks**: React 18, Vite, Wouter (routing), TanStack Query (data fetching).
- **Styling**: Tailwind CSS v4, custom CSS variables, custom font stack.
- **Key Features**: Public marketing pages, corporate pages, partner pages, legal pages, and internal operational pages (POS, Admin HQ, Essence App), global layout with MainNav and Footer, AI-powered chat widget. Full Progressive Web App (PWA) support with automatic updates.

**Backend**:
- **Framework**: Express.js with TypeScript, RESTful API design.
- **Database**: PostgreSQL (managed by Neon serverless) with Drizzle ORM.
- **Data Models**: Comprehensive schema for `flavors`, `locations`, `customers`, `loyaltyTiers`, `suppliers`, `employees`, `purchaseOrders`, `complianceTasks`, `vipBenefits`, `posSessions`, `timesheetEntries`, `inventoryItems`, and `wasteReports`.
- **Authentication**: Firebase Authentication (white-labeled) with multiple sign-in methods:
  - **Google Sign-In**: OAuth popup flow
  - **Email/Password**: Sign up with name, sign in with email/password, password reset via email
  - **Phone/SMS**: reCAPTCHA verification, 6-digit SMS code confirmation
  - Role-Based Access Control (admin, manager, staff, viewer)
  - **CRITICAL**: NO Replit branding - all auth flows are fully white-labeled under Essence Yogurt brand
- **Validation**: Zod validation for all PUT endpoints.

### Feature Specifications

**Octopus Brain Command Center**: A comprehensive autonomous operations system providing "military-grade" control across departments like HR, Finance, Inventory & Supply Chain, Compliance & Food Safety, Customer Relations, and Equipment & Maintenance.

**AI Monitoring System (Gemini-Powered)**: Real-time operational intelligence for transaction risk analysis, error pattern recognition, system health diagnostics, sales pattern analysis, inventory anomaly detection, and operational report generation.

**Multi-Country Operations Management System**: Manages global retail operations across target countries (Saudi Arabia, Israel, UAE, Greece, Australia) with country-specific compliance, VAT, currencies, languages, food safety (HACCP), financial reporting, HR, loyalty programs, and POS with theft prevention.

**Global Compliance, Risk & Operations Brain 2025**: An AI-powered compliance system for permit tracking, insurance management, incident reporting with AI triage, temperature monitoring, fraud detection, and compliance audits. Includes robust HR management with data security (AES-256-GCM encryption for sensitive data).

**Careers & Job Application System (Seek.com.au-inspired)**:
- Multi-step application form (5 steps): Personal Details → Experience/Education → Availability → Screening Questions → Review & Submit
- 10 job positions including part-time student-friendly roles across Dubai, Saudi Arabia, Greece, Australia, UK
- Job filters by Type (Part-time/Full-time/Contract) and Location
- Student-specific fields: study field, institution, graduation year
- Availability scheduling: day selection (Mon-Sun), hours per week, start date
- Screening questions: why Essence, why choose you, customer service examples, teamwork examples, expected salary
- **AI-Powered Resume Analysis**: Applicants can paste resume text for instant Gemini AI analysis
  - Extracts skills, experience, education, languages, strengths, concerns
  - Returns relevance score (0-100) and hiring recommendation
  - Displays AI analysis inline with color-coded score badges
- **AI Candidate Ranking**: Cost-first prioritization (50% cost, 30% quality, 20% trainability)
  - Prefers budget-friendly candidates (students, minimum wage acceptance)
  - Smart screening answer analysis for genuine enthusiasm vs generic responses
  - Red flag detection and aiShortlisted automatic recommendations
- Automatic email notification to HR (support@essenceyogurt.com) via Gmail API
- Database storage for all applications with AI analysis, status tracking
- Google Drive backup includes job_applications and job_postings tables
- Responsive design for mobile and desktop devices
- Backend validation and XSS sanitization
- **Shortlist Document Upload** (/careers/shortlist): Shortlisted candidates must submit:
  - Government ID document (passport, driver's license, or national ID)
  - Recent headshot photo
  - Documents uploaded via presigned URLs to Replit Object Storage
  - Candidates check status by email, upload only if aiShortlisted=true

**Core Services**:
- **Google Workspace Integration**: Automated Google Drive backups (encrypted), Google Calendar for scheduling, Google Sheets for data exports, and Gmail API for transactional emails (including HR job application notifications).
- **Spotify Integration**: In-store music management.
- **Google Maps Integration**: Store locator.
- **Google Analytics 4**: Website analytics.
- **Payment Provider**: Checkout.com for all regions.
- **Luxury Email Service**: Apple-style branded emails.
- **AI Concierge**: Gemini-powered chat widget.

### System Design Choices

The platform prioritizes "military-grade" operational control with integrated POS, GPS-verified employee timesheets, stock control, and supervisor approval workflows. A master configuration system centralizes brand identity and data. Accountability features include photo evidence for waste reports and real-time monitoring through the Admin HQ dashboard.

## External Dependencies

### Database & Storage
- **Neon PostgreSQL**: Serverless Postgres provider.
- **Drizzle ORM**: Type-safe database toolkit.
- **Google Drive**: For encrypted database backups.

### UI Component Libraries
- **Radix UI**: Accessible component primitives.
- **shadcn/ui**: Pre-styled Radix components.
- **Lucide React**: Icon library.

### Form & Validation
- **React Hook Form**: Form state management.
- **Zod**: Runtime type validation.

### State & Data Fetching
- **TanStack Query**: Server state management.

### AI/ML
- **Gemini API**: For AI Concierge and AI Monitoring System.

### Payments
- **Checkout.com**: Payment gateway.

### Communication
- **Nodemailer**: For email services.
- **Gmail API**: For transactional emails.

### Mapping
- **Google Maps JavaScript API**: For location services.

### Music
- **Spotify API**: For in-store music management.

### Analytics
- **Google Analytics 4**: Web analytics.

### Authentication
- **Firebase Authentication**: Multi-method auth (Google, Email/Password, Phone/SMS).

### Utilities & Tooling
- **TypeScript**: Type safety.
- **Vite**: Frontend build tool.
- **esbuild**: Backend bundler.
- **date-fns**: Date manipulation.