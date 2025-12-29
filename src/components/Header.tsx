import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { List, X } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav = siteData.site.navigation.slice(0, 4);

  const handleNavClick = (link: string, title: string) => {
    const pageMap: Record<string, string> = {
      Home: "home",
      Lösungen: "solutions",
      "Über uns": "about",
      Kontakt: "contact",
    };

    if (pageMap[title]) {
      onNavigate(pageMap[title]);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-xl font-bold tracking-tight text-primary">
              {siteData.site.brandNames[1]}
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-1">
            {mainNav.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => handleNavClick(item.link, item.title)}
                className={`text-base transition-colors ${
                  currentPage === item.title.toLowerCase() ||
                  (currentPage === "solutions" && item.title === "Lösungen") ||
                  (currentPage === "about" && item.title === "Über uns")
                    ? "text-accent font-medium"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {item.title}
              </Button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              className="text-base"
              onClick={() => onNavigate("login")}
            >
              Log in →
            </Button>
            <Button
              onClick={() => onNavigate("contact")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105"
            >
              Jetzt buchen
            </Button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <List className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {mainNav.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleNavClick(item.link, item.title)}
                    className={`text-left text-lg py-2 px-4 rounded-md transition-colors ${
                      currentPage === item.title.toLowerCase() ||
                      (currentPage === "solutions" &&
                        item.title === "Lösungen") ||
                      (currentPage === "about" && item.title === "Über uns")
                        ? "bg-accent/10 text-accent font-medium"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base"
                    onClick={() => {
                      onNavigate("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log in →
                  </Button>
                  <Button
                    onClick={() => {
                      onNavigate("contact");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Jetzt buchen
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
