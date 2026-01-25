import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/components/pages/HomePage";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load pages for better performance
const SolutionsPage = lazy(() => import("@/components/pages/SolutionsPage"));
const AboutPage = lazy(() => import("@/components/pages/AboutPage"));
const ContactPage = lazy(() => import("@/components/pages/ContactPage"));
const ImpressumPage = lazy(() => import("@/components/pages/ImpressumPage"));
const FAQPage = lazy(() => import("@/components/pages/FAQPage"));
const PrivacyPage = lazy(() => import("@/components/pages/PrivacyPage"));
const BlogPage = lazy(() => import("@/components/pages/BlogPage"));
const JobsPage = lazy(() => import("@/components/pages/JobsPage"));
const LoginPage = lazy(() => import("@/components/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/components/pages/RegisterPage"));
const AdminPage = lazy(() => import("@/components/pages/AdminPage"));
const VerifyEmailPage = lazy(
  () => import("@/components/pages/VerifyEmailPage")
);
const RequestPasswordResetPage = lazy(
  () => import("@/components/pages/RequestPasswordResetPage")
);
const ResetPasswordPage = lazy(
  () => import("@/components/pages/ResetPasswordPage")
);

// Lazy load service pages
const WLANRouterPage = lazy(
  () => import("@/components/pages/services/WLANRouterPage")
);
const MeshInstallationPage = lazy(
  () => import("@/components/pages/services/MeshInstallationPage")
);
const LANVerlegungPage = lazy(
  () => import("@/components/pages/services/LANVerlegungPage")
);
const AccessPointPage = lazy(
  () => import("@/components/pages/services/AccessPointPage")
);
const PowerlinePage = lazy(
  () => import("@/components/pages/services/PowerlinePage")
);
const WLANProblemsPage = lazy(
  () => import("@/components/pages/services/WLANProblemsPage")
);
const ComputerSetupPage = lazy(
  () => import("@/components/pages/services/ComputerSetupPage")
);
const DriverInstallationPage = lazy(
  () => import("@/components/pages/services/DriverInstallationPage")
);
const PerformanceOptimizationPage = lazy(
  () => import("@/components/pages/services/PerformanceOptimizationPage")
);
const PrinterInstallationPage = lazy(
  () => import("@/components/pages/services/PrinterInstallationPage")
);
const MobileDeviceSetupPage = lazy(
  () => import("@/components/pages/services/MobileDeviceSetupPage")
);
const PCRepairPage = lazy(
  () => import("@/components/pages/services/PCRepairPage")
);
const BackupServicePage = lazy(
  () => import("@/components/pages/services/BackupServicePage")
);
const BusinessAutomationPage = lazy(
  () => import("@/components/pages/services/BusinessAutomationPage")
);

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );
}

// Map URL pathname to page identifier
function pathToPage(path: string): string {
  // Remove base path if present (for subpath deployments)
  const cleanPath = path
    .replace(/^\/studentenathome-serv/, "")
    .replace(/^\/+/, "/");

  if (cleanPath === "/" || cleanPath === "") return "home";
  if (cleanPath.startsWith("/blog")) return "blog";
  if (cleanPath === "/solutions") return "solutions";
  if (cleanPath === "/about") return "about";
  if (cleanPath === "/contact") return "contact";
  if (cleanPath === "/impressum") return "impressum";
  if (cleanPath === "/faq") return "faq";
  if (cleanPath === "/datenschutz" || cleanPath === "/privacy")
    return "datenschutz";
  if (cleanPath === "/jobs") return "jobs";
  if (cleanPath === "/login") return "login";
  if (cleanPath === "/register") return "register";
  if (cleanPath === "/admin") return "admin";
  if (cleanPath === "/verify-email") return "verify-email";
  if (cleanPath === "/request-password-reset") return "request-password-reset";
  if (cleanPath === "/reset-password") return "reset-password";
  
  // Service routes - Network Configuration
  if (cleanPath === "/services/netzwerk/wlan-router") return "service-wlan-router";
  if (cleanPath === "/services/netzwerk/mesh") return "service-mesh";
  if (cleanPath === "/services/netzwerk/lan-verlegung") return "service-lan-verlegung";
  if (cleanPath === "/services/netzwerk/access-point") return "service-access-point";
  if (cleanPath === "/services/netzwerk/powerline") return "service-powerline";
  if (cleanPath === "/services/netzwerk/wlan-probleme") return "service-wlan-probleme";
  
  // Service routes - Device Setup
  if (cleanPath === "/services/geraete/computer-setup") return "service-computer-setup";
  if (cleanPath === "/services/geraete/treiber-installation") return "service-driver-installation";
  if (cleanPath === "/services/geraete/performance-optimierung") return "service-performance-optimization";
  if (cleanPath === "/services/geraete/drucker-installation") return "service-printer-installation";
  if (cleanPath === "/services/geraete/handy-tablet") return "service-mobile-device-setup";
  
  // Service routes - Standalone
  if (cleanPath === "/services/pc-reparatur") return "service-pc-repair";
  if (cleanPath === "/services/backup-service") return "service-backup-service";
  if (cleanPath === "/services/business-automation") return "service-business-automation";
  
  return "home";
}

function pageToPath(page: string): string {
  if (page === "home") return "/";
  if (page === "datenschutz") return "/datenschutz";
  
  // Service routes - Network Configuration
  if (page === "service-wlan-router") return "/services/netzwerk/wlan-router";
  if (page === "service-mesh") return "/services/netzwerk/mesh";
  if (page === "service-lan-verlegung") return "/services/netzwerk/lan-verlegung";
  if (page === "service-access-point") return "/services/netzwerk/access-point";
  if (page === "service-powerline") return "/services/netzwerk/powerline";
  if (page === "service-wlan-probleme") return "/services/netzwerk/wlan-probleme";
  
  // Service routes - Device Setup
  if (page === "service-computer-setup") return "/services/geraete/computer-setup";
  if (page === "service-driver-installation") return "/services/geraete/treiber-installation";
  if (page === "service-performance-optimization") return "/services/geraete/performance-optimierung";
  if (page === "service-printer-installation") return "/services/geraete/drucker-installation";
  if (page === "service-mobile-device-setup") return "/services/geraete/handy-tablet";
  
  // Service routes - Standalone
  if (page === "service-pc-repair") return "/services/pc-reparatur";
  if (page === "service-backup-service") return "/services/backup-service";
  if (page === "service-business-automation") return "/services/business-automation";
  
  return `/${page}`;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>(() =>
    pathToPage(window.location.pathname)
  );

  // Sync with browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(pathToPage(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    const path = pageToPath(page);
    window.history.pushState({}, "", path);
    setCurrentPage(page);
  };

  const renderPage = () => {
    const page = currentPage || "home";

    switch (page) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "solutions":
        return <SolutionsPage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPage />;
      case "impressum":
        return <ImpressumPage />;
      case "faq":
        return <FAQPage />;
      case "datenschutz":
        return <PrivacyPage />;
      case "blog":
        return <BlogPage onNavigate={handleNavigate} />;
      case "jobs":
        return <JobsPage />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "admin":
        return <AdminPage />;
      case "verify-email":
        return <VerifyEmailPage onNavigate={handleNavigate} />;
      case "request-password-reset":
        return <RequestPasswordResetPage onNavigate={handleNavigate} />;
      case "reset-password":
        return <ResetPasswordPage onNavigate={handleNavigate} />;
      
      // Service pages - Network Configuration
      case "service-wlan-router":
        return <WLANRouterPage onNavigate={handleNavigate} />;
      case "service-mesh":
        return <MeshInstallationPage onNavigate={handleNavigate} />;
      case "service-lan-verlegung":
        return <LANVerlegungPage onNavigate={handleNavigate} />;
      case "service-access-point":
        return <AccessPointPage onNavigate={handleNavigate} />;
      case "service-powerline":
        return <PowerlinePage onNavigate={handleNavigate} />;
      case "service-wlan-probleme":
        return <WLANProblemsPage onNavigate={handleNavigate} />;
      
      // Service pages - Device Setup
      case "service-computer-setup":
        return <ComputerSetupPage onNavigate={handleNavigate} />;
      case "service-driver-installation":
        return <DriverInstallationPage onNavigate={handleNavigate} />;
      case "service-performance-optimization":
        return <PerformanceOptimizationPage onNavigate={handleNavigate} />;
      case "service-printer-installation":
        return <PrinterInstallationPage onNavigate={handleNavigate} />;
      case "service-mobile-device-setup":
        return <MobileDeviceSetupPage onNavigate={handleNavigate} />;
      
      // Service pages - Standalone
      case "service-pc-repair":
        return <PCRepairPage onNavigate={handleNavigate} />;
      case "service-backup-service":
        return <BackupServicePage onNavigate={handleNavigate} />;
      case "service-business-automation":
        return <BusinessAutomationPage onNavigate={handleNavigate} />;
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage || "home"} onNavigate={handleNavigate} />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
      </main>
      <Footer onNavigate={handleNavigate} />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
