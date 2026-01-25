import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Phone, Broadcast } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";
import { useEffect } from "react";
import setMeta from "@/lib/seo";

interface AccessPointPageProps {
  onNavigate: (page: string) => void;
}

export default function AccessPointPage({ onNavigate }: AccessPointPageProps) {
  const contactDetails = siteData.pages.contact.details;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    setMeta({
      title: `Access Point Installation Berlin | ${siteData.site.brandNames[1]}`,
      description: `Professionelle Access Point Installation in Berlin ✓ Enterprise WLAN ✓ Hohe Kapazität ✓ Optimale Abdeckung ☎ ${contactDetails.telephoneDisplay}`,
      canonical: "/services/netzwerk/access-point",
      type: "service",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Access Point Installation",
        provider: {
          "@type": "LocalBusiness",
          "@id": "https://www.studentenathome.de/#organization",
          name: "StudentenAtHome",
          telephone: contactDetails.telephone,
          address: {
            "@type": "PostalAddress",
            addressLocality: contactDetails.city,
            addressRegion: contactDetails.region,
            addressCountry: "DE",
          },
        },
        areaServed: contactDetails.serviceAreas.map((area: string) => ({
          "@type": "City",
          name: area,
        })),
      },
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/30">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <Broadcast className="h-16 w-16 text-primary" weight="duotone" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Access Point Installation
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Professionelle Installation von WLAN Access Points für
              leistungsstarke Netzwerke in Büros, großen Wohnungen und
              gewerblichen Räumen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Was wir bieten */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Was wir bieten
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Beratung und Auswahl passender Access Points",
                "Optimale Platzierung für maximale Abdeckung",
                "PoE (Power over Ethernet) Installation",
                "Controller-basierte Verwaltung einrichten",
                "VLAN-Konfiguration für Gastnetzwerke",
                "Roaming-Optimierung und Performance-Tuning",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" weight="fill" />
                  <span className="text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warum wichtig */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Warum professionelle Access Points?
            </h2>
            <Card className="p-8 bg-card">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Consumer-Router stoßen schnell an ihre Grenzen, wenn viele
                  Geräte gleichzeitig verbunden sind oder große Flächen abgedeckt
                  werden müssen. Professionelle Access Points bieten deutlich
                  höhere Kapazität, Reichweite und Stabilität.
                </p>
                <p>
                  Wir installieren Enterprise-Grade Access Points von führenden
                  Herstellern wie Ubiquiti, TP-Link Omada oder Aruba, komplett
                  mit zentraler Verwaltung und optimaler Konfiguration für Ihre
                  spezifischen Anforderungen.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Unser Prozess */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              Unser Prozess
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Standort-Survey",
                  description:
                    "Wir analysieren Ihre Räumlichkeiten, ermitteln die benötigte Anzahl an Access Points und planen die optimalen Montagepositionen.",
                },
                {
                  step: 2,
                  title: "Installation & Verkabelung",
                  description:
                    "Montage der Access Points, Verlegung der Netzwerkkabel und Einrichtung der PoE-Stromversorgung.",
                },
                {
                  step: 3,
                  title: "Konfiguration",
                  description:
                    "Einrichtung des Controllers, Konfiguration von SSIDs, VLANs, Sicherheitseinstellungen und Roaming-Parameter.",
                },
                {
                  step: 4,
                  title: "Testing & Optimierung",
                  description:
                    "Umfassende Tests der WLAN-Abdeckung, Geschwindigkeit und Stabilität mit anschließender Feinabstimmung.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-card hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Preise</h2>
            <Card className="p-8 bg-card">
              <p className="text-2xl font-bold text-primary mb-4">
                Ab 30 € / 30 Minuten
              </p>
              <p className="text-muted-foreground mb-6">
                Der Preis richtet sich nach Anzahl und Typ der Access Points
                sowie dem Installationsaufwand. Wir erstellen Ihnen ein
                maßgeschneidertes Angebot.
              </p>
              <p className="text-sm text-muted-foreground">
                * Alle Preise inklusive Anfahrt im Berliner Stadtgebiet
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Bereit für professionelles WLAN?
            </h2>
            <p className="text-lg text-muted-foreground">
              Kontaktieren Sie uns noch heute für eine Access Point Installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => onNavigate("contact")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105"
              >
                Jetzt buchen
              </Button>
              <a
                href={contactDetails.telephoneLink}
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5" weight="bold" />
                <span className="font-semibold">
                  {contactDetails.telephoneDisplay}
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
