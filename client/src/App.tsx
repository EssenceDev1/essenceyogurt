import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";
import { GoogleMapsProvider } from "@/components/maps";
import { CookieConsent } from "@/components/CookieConsent";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import Home from "@/pages/home";
import Flavours from "@/pages/flavours";
import Locations from "@/pages/locations";
import Story from "@/pages/story";
import Loyalty from "@/pages/loyalty";
import Egift from "@/pages/egift";
import Franchise from "@/pages/franchise";
import EssenceApp from "@/pages/essence-app";
import Pos from "@/pages/pos";
import AdminHq from "@/pages/admin-hq";
import Contact from "@/pages/contact";
import Sustainability from "@/pages/sustainability";
import Careers from "@/pages/careers";
import ShortlistDocuments from "@/pages/shortlist-documents";
import Press from "@/pages/press";
import Investors from "@/pages/investors";
import Airports from "@/pages/airports";
import Malls from "@/pages/malls";
import Events from "@/pages/events";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Cookies from "@/pages/cookies";
import Accessibility from "@/pages/accessibility";
import Legal from "@/pages/legal";
import Timesheet from "@/pages/timesheet";
import StockControl from "@/pages/stock-control";
import AiMonitoring from "@/pages/ai-monitoring";
import OctopusBrain from "@/pages/octopus-brain";
import CommandCenter from "@/pages/command-center";
import HRCommand from "@/pages/hr-command";
import FinanceCommand from "@/pages/finance-command";
import InventoryCommand from "@/pages/inventory-command";
import ComplianceCommand from "@/pages/compliance-command";
import CustomerCommand from "@/pages/customer-command";
import MaintenanceCommand from "@/pages/maintenance-command";
import AICommandCenter from "@/pages/ai-command-center";
import EssenceLoyaltyApp from "@/pages/EssenceLoyaltyApp";
import EssenceLuxuryLanding2025 from "@/pages/EssenceLuxuryLanding2025";
import FAQ from "@/pages/faq";
import Toppings from "@/pages/toppings";
import Allergen from "@/pages/allergen";
import News from "@/pages/news";
import Gallery from "@/pages/gallery";
import EssenceMusic from "@/pages/essence-music";
import DeliveryInfo from "@/pages/delivery-info";
import SocialCloud from "@/pages/social-cloud";
import GiftView from "@/pages/gift-view";
import CashierRedeem from "@/pages/cashier-redeem";
import LuxuryAiChatWidget from "@/components/LuxuryAiChatWidget";
import PushConsentBanner from "@/components/PushConsentBanner";
import LoyaltySignupPopup from "@/components/LoyaltySignupPopup";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import { FloatingLanguagePicker } from "@/components/LanguagePicker";
import { UpdateNotification } from "@/components/UpdateNotification";
import ProtectedRoute from "@/components/ProtectedRoute";

function ProtectedPage({ component: Component, requiredRole }: { component: React.ComponentType; requiredRole?: "admin" | "manager" | "staff" | "viewer" }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component />
    </ProtectedRoute>
  );
}

function Router() {
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flavours" component={Flavours} />
      <Route path="/menu" component={Flavours} />
      <Route path="/locations" component={Locations} />
      <Route path="/story" component={Story} />
      <Route path="/about" component={Story} />
      <Route path="/about-us" component={Story} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/egift" component={Egift} />
      <Route path="/gift/:code" component={GiftView} />
      <Route path="/cashier/redeem">{() => <ProtectedPage component={CashierRedeem} requiredRole="staff" />}</Route>
      <Route path="/franchise" component={Franchise} />
      <Route path="/app">{() => <ProtectedPage component={EssenceApp} />}</Route>
      <Route path="/pos">{() => <ProtectedPage component={Pos} requiredRole="staff" />}</Route>
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-hq">{() => <ProtectedPage component={AdminHq} requiredRole="manager" />}</Route>
      <Route path="/admin-dashboard">{() => <ProtectedPage component={AdminDashboard} requiredRole="manager" />}</Route>
      <Route path="/dashboard">{() => <ProtectedPage component={AdminDashboard} requiredRole="manager" />}</Route>
      <Route path="/contact" component={Contact} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/careers" component={Careers} />
      <Route path="/careers/shortlist" component={ShortlistDocuments} />
      <Route path="/press" component={Press} />
      <Route path="/investors" component={Investors} />
      <Route path="/airports" component={Airports} />
      <Route path="/malls" component={Malls} />
      <Route path="/events" component={Events} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/accessibility" component={Accessibility} />
      <Route path="/legal" component={Legal} />
      <Route path="/faq" component={FAQ} />
      <Route path="/toppings" component={Toppings} />
      <Route path="/allergen" component={Allergen} />
      <Route path="/nutrition" component={Allergen} />
      <Route path="/delivery-info" component={DeliveryInfo} />
      <Route path="/delivery" component={DeliveryInfo} />
      <Route path="/order" component={DeliveryInfo} />
      <Route path="/news" component={News} />
      <Route path="/openings" component={News} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/music" component={EssenceMusic} />
      <Route path="/essence-party" component={EssenceMusic} />
      <Route path="/essence-circle" component={Loyalty} />
      <Route path="/legal/:section" component={Legal} />
      <Route path="/timesheet">{() => <ProtectedPage component={Timesheet} requiredRole="staff" />}</Route>
      <Route path="/stock-control">{() => <ProtectedPage component={StockControl} requiredRole="staff" />}</Route>
      <Route path="/ai-monitoring">{() => <ProtectedPage component={AiMonitoring} requiredRole="manager" />}</Route>
      <Route path="/monitoring">{() => <ProtectedPage component={AiMonitoring} requiredRole="manager" />}</Route>
      <Route path="/octopus-brain">{() => <ProtectedPage component={OctopusBrain} requiredRole="admin" />}</Route>
      <Route path="/command-center">{() => <ProtectedPage component={CommandCenter} requiredRole="manager" />}</Route>
      <Route path="/hq">{() => <ProtectedPage component={CommandCenter} requiredRole="manager" />}</Route>
      <Route path="/hr">{() => <ProtectedPage component={HRCommand} requiredRole="manager" />}</Route>
      <Route path="/hr-command">{() => <ProtectedPage component={HRCommand} requiredRole="manager" />}</Route>
      <Route path="/finance">{() => <ProtectedPage component={FinanceCommand} requiredRole="admin" />}</Route>
      <Route path="/finance-command">{() => <ProtectedPage component={FinanceCommand} requiredRole="admin" />}</Route>
      <Route path="/inventory">{() => <ProtectedPage component={InventoryCommand} requiredRole="staff" />}</Route>
      <Route path="/inventory-command">{() => <ProtectedPage component={InventoryCommand} requiredRole="staff" />}</Route>
      <Route path="/supply-chain">{() => <ProtectedPage component={InventoryCommand} requiredRole="staff" />}</Route>
      <Route path="/compliance">{() => <ProtectedPage component={ComplianceCommand} requiredRole="manager" />}</Route>
      <Route path="/compliance-command">{() => <ProtectedPage component={ComplianceCommand} requiredRole="manager" />}</Route>
      <Route path="/food-safety">{() => <ProtectedPage component={ComplianceCommand} requiredRole="manager" />}</Route>
      <Route path="/customer">{() => <ProtectedPage component={CustomerCommand} requiredRole="staff" />}</Route>
      <Route path="/customer-command">{() => <ProtectedPage component={CustomerCommand} requiredRole="staff" />}</Route>
      <Route path="/vip">{() => <ProtectedPage component={CustomerCommand} requiredRole="staff" />}</Route>
      <Route path="/maintenance">{() => <ProtectedPage component={MaintenanceCommand} requiredRole="staff" />}</Route>
      <Route path="/maintenance-command">{() => <ProtectedPage component={MaintenanceCommand} requiredRole="staff" />}</Route>
      <Route path="/equipment">{() => <ProtectedPage component={MaintenanceCommand} requiredRole="staff" />}</Route>
      <Route path="/ai-command-center">{() => <ProtectedPage component={AICommandCenter} requiredRole="admin" />}</Route>
      <Route path="/ai">{() => <ProtectedPage component={AICommandCenter} requiredRole="admin" />}</Route>
      <Route path="/vip-dashboard">{() => <ProtectedPage component={EssenceLoyaltyApp} />}</Route>
      <Route path="/loyalty-app">{() => <ProtectedPage component={EssenceLoyaltyApp} />}</Route>
      <Route path="/essence-app">{() => <ProtectedPage component={EssenceLoyaltyApp} />}</Route>
      <Route path="/landing-2025" component={EssenceLuxuryLanding2025} />
      <Route path="/luxury" component={EssenceLuxuryLanding2025} />
      <Route path="/social-cloud">{() => <ProtectedPage component={SocialCloud} />}</Route>
      <Route path="/social">{() => <ProtectedPage component={SocialCloud} />}</Route>
      <Route path="/community">{() => <ProtectedPage component={SocialCloud} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CurrencyProvider>
          <GoogleMapsProvider>
            <TooltipProvider>
              <Toaster position="top-right" richColors />
              <Router />
              <CookieConsent />
              <LuxuryAiChatWidget />
              <LoyaltySignupPopup />
              <FloatingLanguagePicker />
              <UpdateNotification />
            </TooltipProvider>
          </GoogleMapsProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
