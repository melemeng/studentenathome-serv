import { useKV } from "@github/spark/hooks";
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
import { useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useKV<string>("current-page", "home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: string) => {
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
