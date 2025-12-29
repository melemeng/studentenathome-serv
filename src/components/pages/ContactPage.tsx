import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Envelope, MapPin } from "@phosphor-icons/react";
import { siteData } from "@/lib/data";
import { useState, useEffect } from "react";
import setMeta from "@/lib/seo";
import { toast } from "sonner";

export function ContactPage() {
  const { title, howItWorks, ctaIntro, details, form } = siteData.pages.contact;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "Vornname ist erforderlich";
    if (!formData.lastName.trim())
      newErrors.lastName = "Familienname ist erforderlich";
    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }
    if (!formData.message.trim())
      newErrors.message = "Nachricht ist erforderlich";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      toast.success("Vielen Dank! Ihre Nachricht wurde gesendet.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    } else {
      toast.error("Bitte füllen Sie alle erforderlichen Felder aus.");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  useEffect(() => {
    setMeta({
      title: `${title} | ${siteData.site.brandNames[1]}`,
      description: ctaIntro,
      canonical: "https://www.studentenathome.de/contact",
    });
  }, [title, ctaIntro]);

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
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {ctaIntro}
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-4xl mx-auto mb-16">
            <Card className="p-8 border-border/50">
              <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
                So funktioniert's
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-xl mb-4">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-foreground">
                Kontaktinformationen
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Adresse
                    </h3>
                    <p className="text-muted-foreground">{details.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Telefon
                    </h3>
                    <a
                      href={details.telephoneLink}
                      className="text-accent hover:underline"
                    >
                      {details.telephone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Envelope className="h-6 w-6 text-accent" weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      E-Mail
                    </h3>
                    <a
                      href={details.emailLink}
                      className="text-accent hover:underline"
                    >
                      {details.email}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-border/50">
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  Kontaktformular
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{form.fields[0].name}</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">{form.fields[1].name}</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{form.fields[2].name}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">{form.fields[3].name}</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{form.fields[4].name}</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105"
                  >
                    {form.submit}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
