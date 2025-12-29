import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkle } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";
import { useEffect } from "react";
import setMeta from "@/lib/seo";

interface SolutionsPageProps {
  onNavigate: (page: string) => void;
}

export function SolutionsPage({ onNavigate }: SolutionsPageProps) {
  const { title, intro, services, pricing } = siteData.pages.solutions;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    setMeta({
      title: `${title} | ${siteData.site.brandNames[1]}`,
      description: intro,
      canonical: "https://www.studentenathome.de/solutions",
    });
  }, [title, intro]);

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/30">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {intro}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all hover:scale-[1.02] border-border/50 bg-card">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Unsere Preismodelle
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wählen Sie das passende Paket für Ihre Bedürfnisse
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricing.plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-8 h-full flex flex-col hover:shadow-xl transition-all ${
                    plan.name === "Premium"
                      ? "border-2 border-accent relative overflow-hidden"
                      : "border-border/50"
                  }`}
                >
                  {plan.name === "Premium" && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-medium flex items-center gap-1">
                      <Sparkle weight="fill" className="h-3 w-3" />
                      Beliebt
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-accent mb-3">
                      {plan.price}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {plan.idealFor}
                    </p>
                  </div>

                  <div className="flex-1 space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle
                          weight="fill"
                          className="h-5 w-5 text-accent flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-foreground leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      onNavigate("contact");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full transition-all hover:scale-105 ${
                      plan.name === "Premium"
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                    size="lg"
                  >
                    Jetzt starten
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Noch Fragen?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Kontaktieren Sie uns für eine individuelle Beratung und finden Sie
              die perfekte Lösung für Ihre technischen Anforderungen.
            </p>
            <Button
              size="lg"
              onClick={() => {
                onNavigate("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105"
            >
              Jetzt kontaktieren
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
