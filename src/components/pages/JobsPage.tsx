import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const jobListings: JobListing[] = [
  {
    id: "1",
    title: "Junior Tech Support Specialist",
    type: "Vollzeit / Teilzeit",
    location: "Dresden, Deutschland",
    description:
      "Wir suchen engagierte Informatikstudenten und Absolventen, die unseren Kunden helfen möchten. Bieten Sie technische Unterstützung vor Ort und remote an, lösen Sie Probleme und unterstützen Sie private und geschäftliche Kunden.",
    requirements: [
      "Laufendes Informatik-Studium oder abgeschlossenes Studium",
      "Grundkenntnisse in Windows, macOS oder Linux",
      "Fähigkeit, komplexe Konzepte einfach zu erklären",
      "Zuverlässigkeit und Freundlichkeit",
      "Bereitschaft zu flexiblen Arbeitszeiten",
    ],
    benefits: [
      "Flexible Arbeitszeiten – ideal zum Vereinbaren mit dem Studium",
      "Erwerben Sie praktische Erfahrung im Tech-Support",
      "Nettes und engagiertes Team",
      "Direkte Kundeninteraktion und Kundenfeedback",
      "Möglichkeiten zur Weiterbildung",
    ],
  },
  {
    id: "2",
    title: "Netzwerk-Administrator / Konfigurateur",
    type: "Vollzeit / Teilzeit",
    location: "Dresden, Deutschland",
    description:
      "Gesucht: Studenten mit Fachwissen in Netzwerktechnik und Systemkonfiguration. Sie bauen Netzwerke auf, konfigurieren diese und stellen sicher, dass unsere Kunden optimal vernetzt sind.",
    requirements: [
      "Fortgeschrittene Kenntnisse in Netzwerktechnik (TCP/IP, DHCP, DNS)",
      "Erfahrung mit Routern, Switches und Firewalls",
      "Vertrautheit mit Windows Server oder Linux",
      "Verständnis für Netzwerksicherheit",
      "Problem-Lösungsfähigkeit und Geduld",
    ],
    benefits: [
      "Spezialisierte Tätigkeit mit höherem Lernpotenzial",
      "Hands-on Erfahrung mit modernen Netzwerkgeräten",
      "Mentoring durch erfahrene Profis",
      "Zertifizierungsmöglichkeiten",
      "Gutes Gehalt mit Erfahrungszuschlag",
    ],
  },
  {
    id: "3",
    title: "IT-Support Trainer / Schulung",
    type: "Teilzeit",
    location: "Dresden, Deutschland",
    description:
      "Du hast Freude daran, andere auszubilden? Wir suchen jemanden, der unsere Support-Mitarbeiter schulen und trainieren kann sowie Kunden in ihren Geräten unterweisen kann.",
    requirements: [
      "Umfassende Kenntnisse in mindestens zwei Betriebssystemen",
      "Erfahrung in Schulung oder Weitergabe von Wissen",
      "Pädagogische Fähigkeiten und Geduld",
      "Vertrautheit mit Schulungsmaterialien und -methoden",
      "Kommunikationsstärke",
    ],
    benefits: [
      "Sinnvolle Tätigkeit – echte Wissensvermittlung",
      "Flexible Stundensätze",
      "Kreative Freiheit in der Unterrichtsvorbereitung",
      "Netzwerkaufbau mit verschiedenen Studenten",
      "Portfolio-Erweiterung für späteren Karriereschritt",
    ],
  },
  {
    id: "4",
    title: "Web Developer / Frontend-Spezialist",
    type: "Teilzeit",
    location: "Hybrid / Remote",
    description:
      "Unterstütze uns bei der Weiterentwicklung unserer Webpräsenz. Du wirst React-Anwendungen entwickeln, das UI/UX verbessern und neue Features implementieren.",
    requirements: [
      "Gute Kenntnisse in JavaScript/TypeScript und React",
      "Vertrautheit mit Tailwind CSS oder ähnlichen Frameworks",
      "Grundverständnis von Responsive Design",
      "Git und Versionskontrolle",
      "Lust zu lernen und Verbesserungsvorschläge einzubringen",
    ],
    benefits: [
      "Vollständig remote oder hybrid möglich",
      "Moderne Technologie-Stack",
      "Kreative Arbeit an echter Anwendung",
      "Mentoring durch Senior Developer",
      "Flexible Arbeitszeiten",
    ],
  },
  {
    id: "5",
    title: "Kundenbetreuung / Support-Koordinator",
    type: "Vollzeit / Teilzeit",
    location: "Dresden, Deutschland",
    description:
      "Du bist kommunikativ und organisiert? Verwalte Kundenanfragen, koordiniere Support-Einsätze, terminiere Termine und stelle sicher, dass unsere Kunden zufrieden sind.",
    requirements: [
      "Ausgezeichnete Kommunikationsfähigkeiten",
      "Organisationstalent und Zeitmanagement",
      "Freundlichkeit und Geduld mit Kunden",
      "Grundkenntnisse in Office-Anwendungen",
      "Deutschfließend (für Kundengespräche)",
    ],
    benefits: [
      "Kundeninteraktion und Beziehungsaufbau",
      "Flexibles Arbeitsumfeld",
      "Einstiegsfreundlich – weniger technische Voraussetzungen",
      "Schulung in unserem Support-Prozess",
      "Aufstiegspotenzial",
    ],
  },
];

export function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Karriere bei StudentenAtHome
          </h1>
          <p className="text-lg text-muted-foreground">
            Werde Teil unseres Teams und hilf anderen Menschen, ihre
            Technik-Herausforderungen zu meistern
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Hero Section */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Warum bei StudentenAtHome arbeiten?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <GraduationCap className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Praxisnah lernen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sammle echte Erfahrung mit echten Kunden und echten Problemen
                  – ideal neben dem Studium.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Briefcase className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Flexible Arbeitszeiten
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vereinbare deine Arbeitszeiten mit deinen Vorlesungen. Voll-
                  oder Teilzeit möglich.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Vor-Ort oder Remote
                </h3>
                <p className="text-sm text-muted-foreground">
                  Wähle zwischen Vor-Ort-Support in Dresden oder
                  Remote-Tätigkeit, wie es dir passt.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Briefcase className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Kollegiales Team
                </h3>
                <p className="text-sm text-muted-foreground">
                  Arbeite mit anderen motivierten Studenten zusammen.
                  Gegenseitiger Support und Mentoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <h2 className="text-2xl font-bold mb-8 text-primary">
          Offene Positionen
        </h2>
        <div className="space-y-6">
          {jobListings.map((job) => (
            <Card
              key={job.id}
              className="bg-secondary/50 border-border hover:border-accent transition-colors"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-primary">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {job.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className="bg-accent/20 text-accent border-0"
                    >
                      {job.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-4">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Anforderungen
                    </h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-accent flex-shrink-0">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Was wir bieten
                    </h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-accent flex-shrink-0">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <a
                    href="#/contact"
                    className="inline-flex items-center justify-center px-6 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Jetzt bewerben
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Application Info */}
        <div className="bg-secondary/50 border border-border rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4 text-primary">
            Bewerbungsprozess
          </h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Wenn dich eine Position interessiert, kontaktiere uns einfach mit:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Kurzer Übersicht deiner technischen Fähigkeiten</li>
              <li>Lebenslauf oder kurze Beschreibung deiner Erfahrung</li>
              <li>Angabe, welche Position dich interessiert</li>
              <li>Deine verfügbaren Arbeitszeiten/Flexibilität</li>
            </ul>
            <p className="mt-4">
              Sende eine E-Mail an{" "}
              <a
                href="mailto:support@studentenathome.de"
                className="text-accent hover:text-accent/80"
              >
                support@studentenathome.de
              </a>{" "}
              oder nutze unser Kontaktformular.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Kontaktiere uns für weitere Fragen
          </a>
        </div>
      </div>
    </div>
  );
}
