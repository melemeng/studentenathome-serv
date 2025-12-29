import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";
import { useEffect } from "react";
import setMeta from "@/lib/seo";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { sections } = siteData.pages.about;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    setMeta({
      title: `${sections[0].title} | ${siteData.site.brandNames[1]}`,
      description: sections[0].content?.[0] || "Über StudentenAtHome",
      canonical: "https://www.studentenathome.de/about",
    });
  }, [sections]);

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {sections[0].title}
            </h1>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {sections[0].content.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {sections[1].title}
            </h2>
            <div className="space-y-4">
              {sections[1].content.map((item, index) => (
                <p
                  key={index}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {item}
                </p>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {sections[1].values?.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full text-center hover:shadow-lg transition-all hover:scale-[1.02] border-border/50">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                    <CheckCircle
                      weight="fill"
                      className="h-6 w-6 text-accent"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-accent/10 via-accent/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.68_0.18_25_/_0.1),transparent_50%)]" />

        <div className="container relative mx-auto max-w-5xl px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              {sections[2].title}
            </h2>
            {sections[2].content.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg text-muted-foreground leading-relaxed mb-8"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8"
          >
            {sections[2].benefits?.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/50"
              >
                <CheckCircle
                  weight="fill"
                  className="h-5 w-5 text-accent flex-shrink-0"
                />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="text-center">
            <Button
              size="lg"
              onClick={() => (window.location.href = sections[2].cta || "")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Stellen Anzeigen <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Bereit loszulegen?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Kontaktieren Sie uns noch heute und erleben Sie professionellen
              Tech-Support, der Ihre Erwartungen übertrifft.
            </p>
            <Button
              size="lg"
              onClick={() => {
                onNavigate("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            >
              Jetzt kontaktieren
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
