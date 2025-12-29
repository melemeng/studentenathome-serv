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
  return "home";
}

function pageToPath(page: string): string {
  if (page === "home") return "/";
  if (page === "datenschutz") return "/datenschutz";
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
