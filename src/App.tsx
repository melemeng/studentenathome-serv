import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/components/pages/HomePage";
import { SolutionsPage } from "@/components/pages/SolutionsPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { ImpressumPage } from "@/components/pages/ImpressumPage";
import { FAQPage } from "@/components/pages/FAQPage";
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { BlogPage } from "@/components/pages/BlogPage";
import { JobsPage } from "@/components/pages/JobsPage";
import { LoginPage } from "@/components/pages/LoginPage";
import { useEffect, useState } from "react";

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
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
