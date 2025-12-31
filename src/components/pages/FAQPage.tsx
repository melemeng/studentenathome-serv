import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import setMeta from "@/lib/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  useEffect(() => {
    setMeta({
      title: `FAQ | StudentenAtHome`,
      description:
        "Häufig gestellte Fragen zu unseren Services, Preisen und Support-Abläufen bei StudentenAtHome.",
      canonical: "/faq",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    });
  }, []);

  const faqs = [
    {
      id: "faq-1",
      question: "Wie buche ich einen Termin?",
      answer:
        "Sie können uns ganz einfach über unser Kontaktformular, per E-Mail (support@studentenathome.de) oder telefonisch unter +49 176 75444136 erreichen. Schildern Sie uns Ihr Problem, und wir machen Ihnen einen Terminvorschlag.",
    },
    {
      id: "faq-2",
      question: "Welche Gebiete decken Sie ab?",
      answer:
        "Wir sind deutschlandweit tätig und bieten sowohl Vor-Ort-Service als auch Remote-Support an. Unser Hauptsitz ist in Berlin. Für Vor-Ort-Termine außerhalb Berlins berechnen wir gegebenenfalls eine Anfahrtspauschale. Kontaktieren Sie uns gerne, um zu klären, wie wir Sie am besten unterstützen können.",
    },
    {
      id: "faq-3",
      question: "Welche Betriebssysteme unterstützen Sie?",
      answer:
        "Wir unterstützen Windows, macOS und Linux. Unser Team hat Erfahrung mit allen gängigen Betriebssystemen und kann Sie bei Fragen zu Ihrem System unterstützen.",
    },
    {
      id: "faq-4",
      question: "Was kostet eine Stunde Support?",
      answer:
        "Unser Einsteigerpaket kostet 30 € für 30 Minuten. Für komplexere Projekte und Unternehmenslösungen bieten wir individuelle Preise. Kontaktieren Sie uns für ein unverbindliches Angebot.",
    },
    {
      id: "faq-5",
      question: "Wie lange dauert es, bis ich einen Termin bekomme?",
      answer:
        "Wir versuchen, zeitnah auf Ihre Anfrage zu reagieren. Je nach Aktualität unseres Kalenders können wir oft innerhalb von 24-48 Stunden einen Termin anbieten. Dringende Fälle behandeln wir bevorzugt.",
    },
    {
      id: "faq-6",
      question: "Bieten Sie auch Remote-Support an?",
      answer:
        "Ja, für viele Probleme können wir auch Remote-Support anbieten. Dies ist oft schneller und für Sie kostengünstiger. Unsere Mitarbeiter werden Ihnen alles Schritt für Schritt erklären.",
    },
    {
      id: "faq-7",
      question:
        "Kann ich auch einfach eine Frage stellen, ohne einen Termin zu buchen?",
      answer:
        "Gerne können Sie uns per E-Mail oder Telefon kontaktieren und uns kurz Ihre Frage schildern. Für einfache Probleme können wir Ihnen oft direkt helfen. Für komplexere Aufgaben vereinbaren wir einen Termin.",
    },
    {
      id: "faq-8",
      question: "Seid ihr auch am Wochenende erreichbar?",
      answer:
        "Unsere Standard-Öffnungszeiten sind Mo.–Fr. 10:00–18:00 Uhr. Für dringende Fälle am Wochenende können Sie uns anrufen und nachfragen, ob eine schnelle Lösung möglich ist.",
    },
    {
      id: "faq-9",
      question: "Was ist mit meinen Daten – sind sie sicher?",
      answer:
        "Ihre Daten und Privatsphäre sind uns sehr wichtig. Wir halten uns streng an die DSGVO und andere Datenschutzbestimmungen. Näheres finden Sie in unserer Datenschutzerklärung.",
    },
    {
      id: "faq-10",
      question: "Kann ich meine IT-Infrastruktur optimieren lassen?",
      answer:
        "Absolut! Wir bieten Beratung und Optimierung für Ihr Netzwerk, Ihre Geräte und IT-Systeme an. Dies ist besonders für Unternehmen interessant. Sprechen Sie uns an für ein individuelles Angebot.",
    },
    {
      id: "faq-11",
      question: "Habt ihr Erfahrung mit Druckern und Netzwerkgeräten?",
      answer:
        "Ja, die Einrichtung und Konfiguration von Druckern, Scannern und anderen Netzwerkgeräten gehört zu unseren Standard-Dienstleistungen. Wir helfen Ihnen, alle Geräte richtig einzurichten.",
    },
    {
      id: "faq-12",
      question:
        "Kann ich mit StudentenAtHome einen Wartungsvertrag abschließen?",
      answer:
        "Ja, für Unternehmen und anspruchsvollere Kunden bieten wir maßgeschneiderte Wartungs- und Support-Verträge an. Kontaktieren Sie uns, um Details zu besprechen.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Häufig gestellte Fragen
          </h1>
          <p className="text-lg text-muted-foreground">
            Hier finden Sie Antworten auf die häufigsten Fragen zu unseren
            Dienstleistungen.
          </p>
        </div>

        <Separator className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-secondary/50 border border-border rounded-lg px-6 hover:bg-secondary/70 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:text-accent py-4">
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Ihre Frage nicht beantwortet?
          </h2>
          <p className="text-muted-foreground mb-6">
            Kontaktieren Sie uns gerne direkt. Unser Team beantwortet Ihre
            Fragen gern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@studentenathome.de"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              support@studentenathome.de
            </a>
            <a
              href="tel:+491767544136"
              className="inline-flex items-center justify-center px-6 py-3 border border-accent text-accent hover:bg-accent/10 font-semibold rounded-lg transition-colors"
            >
              +49 176 75444136
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
