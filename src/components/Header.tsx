import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { List, CaretRight } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { networkConfiguration, deviceSetup, standalone } =
    siteData.pages.solutions.categories;

  const handleServiceClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  const isServicePage = currentPage.startsWith("service-");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            aria-label="Zur Startseite"
          >
            <span className="text-xl font-bold tracking-tight text-primary">
              {siteData.site.brandNames[1]}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Hauptnavigation">
            <Button
              variant="ghost"
              onClick={() => onNavigate("home")}
              className={`text-base transition-colors ${
                currentPage === "home"
                  ? "text-accent font-medium"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              Home
            </Button>

            {/* Services NavigationMenu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "text-base",
                      currentPage === "solutions" || isServicePage
                        ? "text-accent font-medium"
                        : "text-foreground/80"
                    )}
                  >
                    Leistungen
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                      {/* Network Configuration */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-foreground px-2">
                          {networkConfiguration.title}
                        </h3>
                        {networkConfiguration.subcategories.map((service) => (
                          <NavigationMenuLink
                            key={service.id}
                            asChild
                          >
                            <button
                              onClick={() => handleServiceClick(`service-${service.id}`)}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left",
                                currentPage === `service-${service.id}` && "bg-accent/50"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {service.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {service.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        ))}
                      </div>

                      {/* Device Setup */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-foreground px-2">
                          {deviceSetup.title}
                        </h3>
                        {deviceSetup.subcategories.map((service) => (
                          <NavigationMenuLink
                            key={service.id}
                            asChild
                          >
                            <button
                              onClick={() => handleServiceClick(`service-${service.id}`)}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left",
                                currentPage === `service-${service.id}` && "bg-accent/50"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {service.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {service.description}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        ))}
                      </div>

                      {/* Standalone Services */}
                      <div className="col-span-2 space-y-2 pt-2 border-t">
                        <h3 className="font-semibold text-sm text-foreground px-2">
                          Weitere Services
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {standalone.map((service) => (
                            <NavigationMenuLink
                              key={service.id}
                              asChild
                            >
                              <button
                                onClick={() => handleServiceClick(`service-${service.id}`)}
                                className={cn(
                                  "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left",
                                  currentPage === `service-${service.id}` && "bg-accent/50"
                                )}
                              >
                                <div className="text-sm font-medium leading-none">
                                  {service.title}
                                </div>
                              </button>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              variant="ghost"
              onClick={() => onNavigate("about")}
              className={`text-base transition-colors ${
                currentPage === "about"
                  ? "text-accent font-medium"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              Über uns
            </Button>

            <Button
              variant="ghost"
              onClick={() => onNavigate("contact")}
              className={`text-base transition-colors ${
                currentPage === "contact"
                  ? "text-accent font-medium"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              Kontakt
            </Button>
          </nav>

          {/* Right side buttons */}
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menü öffnen">
                <List className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <div className="flex flex-col space-y-4 mt-8">
                <button
                  onClick={() => {
                    onNavigate("home");
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-lg py-2 px-4 rounded-md transition-colors ${
                    currentPage === "home"
                      ? "bg-accent/10 text-accent font-medium"
                      : "hover:bg-secondary"
                  }`}
                >
                  Home
                </button>

                {/* Services Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="services" className="border-none">
                    <AccordionTrigger className="text-lg py-2 px-4 rounded-md hover:bg-secondary hover:no-underline">
                      Leistungen
                    </AccordionTrigger>
                    <AccordionContent className="px-2 space-y-3">
                      {/* Network Configuration */}
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground px-4 py-1">
                          {networkConfiguration.title}
                        </p>
                        {networkConfiguration.subcategories.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => handleServiceClick(`service-${service.id}`)}
                            className={`w-full text-left text-sm py-2 px-4 rounded-md transition-colors flex items-center ${
                              currentPage === `service-${service.id}`
                                ? "bg-accent/10 text-accent font-medium"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <CaretRight className="h-4 w-4 mr-2 flex-shrink-0" />
                            {service.title}
                          </button>
                        ))}
                      </div>

                      {/* Device Setup */}
                      <div className="space-y-1 pt-2">
                        <p className="text-sm font-semibold text-muted-foreground px-4 py-1">
                          {deviceSetup.title}
                        </p>
                        {deviceSetup.subcategories.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => handleServiceClick(`service-${service.id}`)}
                            className={`w-full text-left text-sm py-2 px-4 rounded-md transition-colors flex items-center ${
                              currentPage === `service-${service.id}`
                                ? "bg-accent/10 text-accent font-medium"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <CaretRight className="h-4 w-4 mr-2 flex-shrink-0" />
                            {service.title}
                          </button>
                        ))}
                      </div>

                      {/* Standalone Services */}
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-sm font-semibold text-muted-foreground px-4 py-1">
                          Weitere Services
                        </p>
                        {standalone.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => handleServiceClick(`service-${service.id}`)}
                            className={`w-full text-left text-sm py-2 px-4 rounded-md transition-colors flex items-center ${
                              currentPage === `service-${service.id}`
                                ? "bg-accent/10 text-accent font-medium"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <CaretRight className="h-4 w-4 mr-2 flex-shrink-0" />
                            {service.title}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <button
                  onClick={() => {
                    onNavigate("about");
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-lg py-2 px-4 rounded-md transition-colors ${
                    currentPage === "about"
                      ? "bg-accent/10 text-accent font-medium"
                      : "hover:bg-secondary"
                  }`}
                >
                  Über uns
                </button>

                <button
                  onClick={() => {
                    onNavigate("contact");
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-lg py-2 px-4 rounded-md transition-colors ${
                    currentPage === "contact"
                      ? "bg-accent/10 text-accent font-medium"
                      : "hover:bg-secondary"
                  }`}
                >
                  Kontakt
                </button>

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
