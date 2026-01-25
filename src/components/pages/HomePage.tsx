import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Quotes } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";
import { useState, useEffect } from "react";
import setMeta from "@/lib/seo";
import { toast } from "sonner";
import landingPageBg from "@/assets/images/landingpage.png";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { hero, valueProps, highlight, testimonial, newsletter } =
    siteData.pages.home;
  const [email, setEmail] = useState("");

  useEffect(() => {
    const contactDetails = siteData.pages.contact.details;
    setMeta({
      title: `${siteData.site.brandNames[1]} – Tech-Support & PC-Hilfe in Berlin | Vor-Ort-Service`,
      description:
        "Tech-Support in Berlin ✓ PC-Hilfe & Computer-Reparatur ✓ Netzwerk-Einrichtung ✓ Vor-Ort-Service in Berlin, Potsdam, Spandau. Schnelle Hilfe von Informatikstudenten. ☎ 0179 4104323",
      canonical: "/",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.studentenathome.de/#organization",
        name: "StudentenAtHome",
        alternateName: "Studenten Helfen",
        description:
          "Professioneller Tech-Support und PC-Hilfe in Berlin. Vor-Ort-Service für Computer-Reparatur, Netzwerk-Einrichtung und IT-Support von erfahrenen Informatikstudenten.",
        url: "https://www.studentenathome.de",
        telephone: contactDetails.telephone,
        email: contactDetails.email,
        image: "https://www.studentenathome.de/assets/images/logo.png",
        logo: {
          "@type": "ImageObject",
          url: "https://www.studentenathome.de/assets/images/logo.png",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: contactDetails.address,
          addressLocality: contactDetails.city,
          addressRegion: contactDetails.region,
          postalCode: contactDetails.postalCode,
          addressCountry: "DE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: contactDetails.coordinates.latitude,
          longitude: contactDetails.coordinates.longitude,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "10:00",
            closes: "14:00",
          },
        ],
        priceRange: "€€",
        currenciesAccepted: "EUR",
        paymentAccepted: "Cash, Bank Transfer, PayPal",
        areaServed: contactDetails.serviceAreas.map((area: string) => ({
          "@type": "City",
          name: area,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Tech-Support Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Computer-Reparatur Berlin",
                description:
                  "PC und Laptop Reparatur, Software-Probleme beheben",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Netzwerk-Einrichtung Berlin",
                description:
                  "WLAN-Setup, Router-Konfiguration, Netzwerk-Sicherheit",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "IT-Support vor Ort",
                description:
                  "Technische Hilfe direkt bei Ihnen zuhause in Berlin und Umgebung",
              },
            },
          ],
        },
        sameAs: [
          "https://www.facebook.com/studentenathome",
          "https://www.instagram.com/studentenathome",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "47",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Klaus P.",
            },
            datePublished: "2025-11-15",
            reviewBody:
              "Ich bin absolut begeistert von dem professionellen und freundlichen Service. Als jemand, der nicht viel über Technik weiß, war es eine Erleichterung, einen Service zu finden, der mir auch alles erklärt hat.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Maria S.",
            },
            datePublished: "2025-10-28",
            reviewBody:
              "Schnelle Hilfe bei meinem WLAN-Problem. Der Student kam pünktlich und hatte alles in 30 Minuten erledigt. Sehr empfehlenswert!",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Thomas B.",
            },
            datePublished: "2025-09-10",
            reviewBody:
              "Toller Remote-Support für mein kleines Unternehmen. Die Jungs haben mir bei der Einrichtung des Netzwerks super geholfen.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
          },
        ],
      },
    });
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      toast.success("Vielen Dank für Ihre Anmeldung!");
      setEmail("");
    } else {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    }
  };

  const handleCTAClick = (link: string) => {
    if (link.includes("/service")) {
      onNavigate("solutions");
    } else if (link.includes("/contact")) {
      onNavigate("contact");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // Reduced motion for mobile and accessibility
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
      };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-32 min-h-[600px] md:min-h-[700px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${landingPageBg})`,
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.35_0.08_250_/_0.3),transparent_50%)]" />

        <div className="container relative mx-auto max-w-7xl px-6">
          <motion.div className="max-w-4xl mx-auto text-center" {...fadeInUp}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-8 text-white drop-shadow-lg">
              {hero.headline}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCTAClick(hero.primaryCTAs[0].link)}
                className="text-lg px-8 bg-white/95 hover:bg-white text-primary border-white/20 backdrop-blur-sm transition-all hover:scale-105"
              >
                {hero.primaryCTAs[0].title}
              </Button>
              <Button
                size="lg"
                onClick={() => handleCTAClick(hero.primaryCTAs[1].link)}
                className="text-lg px-8 bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105 shadow-lg"
              >
                {hero.primaryCTAs[1].title}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                {...animationProps}
                transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border/50">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {prop.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {prop.description}
                  </p>
                  <button
                    onClick={() => {
                      if (prop.more.includes("/service"))
                        onNavigate("solutions");
                      else if (prop.more.includes("/about"))
                        onNavigate("about");
                      else if (prop.more.includes("/contact"))
                        onNavigate("contact");
                    }}
                    className="text-accent font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Mehr <ArrowRight className="h-4 w-4" />
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-accent/10 via-accent/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_60px,oklch(0.68_0.18_25_/_0.03)_60px,oklch(0.68_0.18_25_/_0.03)_61px)]" />

        <div className="container relative mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-sm uppercase tracking-wider text-accent font-medium mb-3 block">
              {highlight.title}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground capitalize">
              {highlight.subtitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              {highlight.description}
            </p>
            <Button
              size="lg"
              onClick={() => handleCTAClick(highlight.cta)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105"
            >
              Jetzt buchen
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 md:p-12 relative overflow-hidden border-border/50 bg-gradient-to-br from-secondary/50 to-background">
              <Quotes
                className="absolute top-6 right-6 h-16 w-16 text-accent/20"
                weight="fill"
              />
              <blockquote className="relative">
                <p className="text-lg md:text-xl leading-relaxed text-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <footer className="text-base font-medium text-muted-foreground">
                  — {testimonial.author}
                </footer>
              </blockquote>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(0.45_0.08_250),transparent_70%)]" />

        <div className="container relative mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {newsletter.title}
            </h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              {newsletter.description}
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                id="newsletter-email"
                placeholder={newsletter.emailFieldPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/95 text-foreground border-background/20 flex-1"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105 capitalize"
              >
                {newsletter.cta}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
