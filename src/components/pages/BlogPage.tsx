import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title:
      "Cybersecurity für Privatpersonen: Die 5 wichtigsten Tipps zum Schutz Ihrer Daten",
    excerpt:
      "Erfahren Sie, wie Sie Ihre persönlichen Daten im Internet schützen und Ihre Geräte vor Cyberbedrohungen bewahren.",
    category: "Sicherheit",
    author: "StudentenAtHome Team",
    date: "15. Dezember 2024",
    readTime: "8 Min",
    content: `
      <h3 class="text-xl font-bold mb-4">Cybersicherheit für Privatpersonen</h3>
      <p class="mb-4">Die digitale Sicherheit ist heute wichtiger denn je. Immer mehr Menschen arbeiten von zu Hause aus, nutzen Online-Banking und speichern vertrauliche Daten auf ihren Computern. Doch viele sind sich der Risiken nicht bewusst. Hier sind die 5 wichtigsten Tipps zum Schutz Ihrer Daten:</p>
      
      <h4 class="font-bold mt-6 mb-2">1. Starke Passwörter verwenden</h4>
      <p class="mb-4">Ein starkes Passwort ist die erste Verteidigungslinie. Es sollte mindestens 12 Zeichen lang sein, Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen enthalten. Nutzen Sie einen Passwort-Manager wie Bitwarden oder 1Password, um Ihre Passwörter sicher zu speichern.</p>
      
      <h4 class="font-bold mt-6 mb-2">2. Zwei-Faktor-Authentifizierung (2FA) aktivieren</h4>
      <p class="mb-4">Zwei-Faktor-Authentifizierung bietet zusätzliche Sicherheit. Aktivieren Sie 2FA bei Ihrem E-Mail-Anbieter, Banking und sozialen Medien. Dies macht es Hackern deutlich schwerer, in Ihre Konten einzudringen.</p>
      
      <h4 class="font-bold mt-6 mb-2">3. Software und Betriebssystem aktuell halten</h4>
      <p class="mb-4">Sicherheitsupdates sind essentiell. Sie beheben bekannte Sicherheitslücken. Aktivieren Sie automatische Updates für Ihr Betriebssystem und Ihre Anwendungen, oder überprüfen Sie regelmäßig manuell auf Updates.</p>
      
      <h4 class="font-bold mt-6 mb-2">4. Vorsicht vor Phishing-E-Mails</h4>
      <p class="mb-4">Phishing-E-Mails sehen oft täuschend echt aus. Seien Sie skeptisch bei E-Mails, die zu unerwarteten Klicks auffordern. Überprüfen Sie den Absender und klicken Sie nicht auf Links in verdächtigen E-Mails. Im Zweifelsfall kontaktieren Sie das Unternehmen direkt.</p>
      
      <h4 class="font-bold mt-6 mb-2">5. Regelmäßige Backups erstellen</h4>
      <p class="mb-4">Erstellen Sie regelmäßig Backups Ihrer wichtigen Daten. Dies schützt Sie vor Ransomware und Hardwarefehlern. Nutzen Sie externe Festplatten oder Cloud-Dienste wie Nextcloud oder Backblaze.</p>
      
      <p class="mt-6">Mit diesen Tipps sind Sie deutlich besser geschützt. Benötigen Sie Hilfe bei der Umsetzung? Kontaktieren Sie uns – wir helfen Ihnen gerne weiter!</p>
    `,
  },
  {
    id: "2",
    title: "Windows oder macOS: Welches Betriebssystem passt zu mir?",
    excerpt:
      "Ein Vergleich der beiden beliebtesten Betriebssysteme für Ihre Kaufentscheidung.",
    category: "Betriebssysteme",
    author: "Tim Müller",
    date: "10. Dezember 2024",
    readTime: "10 Min",
    content: `
      <h3 class="text-xl font-bold mb-4">Windows oder macOS – Der große Vergleich</h3>
      <p class="mb-4">Die Wahl des richtigen Betriebssystems ist eine wichtige Entscheidung. Hier sind die Unterschiede zwischen Windows und macOS:</p>
      
      <h4 class="font-bold mt-6 mb-2">Windows 11</h4>
      <p class="mb-2"><strong>Vorteile:</strong></p>
      <ul class="list-disc list-inside mb-4">
        <li>Große Softwareauswahl</li>
        <li>Günstiger in der Anschaffung</li>
        <li>Läuft auf vielen verschiedenen Computern</li>
        <li>Ideal für Gaming</li>
      </ul>
      <p class="mb-2"><strong>Nachteile:</strong></p>
      <ul class="list-disc list-inside mb-4">
        <li>Häufiger von Malware betroffen</li>
        <li>Benötigt regelmäßigere Wartung</li>
        <li>Updates können erzwungen werden</li>
      </ul>
      
      <h4 class="font-bold mt-6 mb-2">macOS</h4>
      <p class="mb-2"><strong>Vorteile:</strong></p>
      <ul class="list-disc list-inside mb-4">
        <li>Stabil und zuverlässig</li>
        <li>Ausgezeichnet für kreative Arbeit</li>
        <li>Gutes Sicherheitssystem</li>
        <li>Gute Integration mit anderen Apple-Geräten</li>
      </ul>
      <p class="mb-2"><strong>Nachteile:</strong></p>
      <ul class="list-disc list-inside mb-4">
        <li>Deutlich teurer</li>
        <li>Weniger Software-Kompatibilität</li>
        <li>Nur auf Apple-Hardware verfügbar</li>
      </ul>
      
      <p class="mt-6">Benötigen Sie Hilfe bei der Wahl oder bei der Einrichtung? Unsere Experten beraten Sie gerne!</p>
    `,
  },
  {
    id: "3",
    title: "WLAN-Probleme? So optimieren Sie Ihre Netzwerkgeschwindigkeit",
    excerpt:
      "Praktische Tipps zur Verbesserung Ihrer WLAN-Signalstärke und Geschwindigkeit.",
    category: "Netzwerk",
    author: "Sophie Weber",
    date: "5. Dezember 2024",
    readTime: "7 Min",
    content: `
      <h3 class="text-xl font-bold mb-4">WLAN optimieren – Der praktische Ratgeber</h3>
      <p class="mb-4">Langsames WLAN ist frustrierend. Hier sind praktische Tipps zur Optimierung Ihrer Netzwerkgeschwindigkeit:</p>
      
      <h4 class="font-bold mt-6 mb-2">1. Router-Platzierung optimieren</h4>
      <p class="mb-4">Der Ort, an dem Ihr Router steht, ist entscheidend. Platzieren Sie ihn zentral, erhöht und nicht in Schränken oder Ecken. Je freier der Router, desto besser das Signal.</p>
      
      <h4 class="font-bold mt-6 mb-2">2. Kanäle richtig wählen</h4>
      <p class="mb-4">Es gibt mehrere WLAN-Kanäle. In dicht besiedelten Gebieten kann ein falscher Kanal zu Störungen führen. Apps wie Wifi Analyzer helfen Ihnen, den besten Kanal zu finden.</p>
      
      <h4 class="font-bold mt-6 mb-2">3. Regelmäßig neu starten</h4>
      <p class="mb-4">Ein Neustart des Routers kann Wunder wirken. Schalten Sie ihn wöchentlich für 30 Sekunden aus und wieder ein.</p>
      
      <h4 class="font-bold mt-6 mb-2">4. Router-Firmware aktualisieren</h4>
      <p class="mb-4">Überprüfen Sie, ob Updates für Ihren Router verfügbar sind. Neue Firmware verbessert oft die Stabilität und Geschwindigkeit.</p>
      
      <h4 class="font-bold mt-6 mb-2">5. Zu viele Geräte verbunden?</h4>
      <p class="mb-4">Jedes verbundene Gerät nutzt Bandbreite. Trennen Sie Geräte, die Sie nicht verwenden, um Geschwindigkeit freizugeben.</p>
    `,
  },
  {
    id: "4",
    title: "Speicherplatz sparen: So räumen Sie Ihren Computer auf",
    excerpt:
      "Praktische Anleitung zum Freigeben von Speicherplatz und Beschleunigen Ihres Computers.",
    category: "Wartung",
    author: "StudentenAtHome Team",
    date: "28. November 2024",
    readTime: "9 Min",
    content: `
      <h3 class="text-xl font-bold mb-4">Computer aufräumen und beschleunigen</h3>
      <p class="mb-4">Ein voller Computer wird langsam. Hier ist eine Schritt-für-Schritt-Anleitung zum Aufräumen:</p>
      
      <h4 class="font-bold mt-6 mb-2">1. Nicht benötigte Programme deinstallieren</h4>
      <p class="mb-4">Überprüfen Sie in der Systemsteuerung (Windows) oder den Anwendungen (macOS), welche Programme Sie nicht mehr benötigen. Deinstallieren Sie diese, um Speicher freizugeben.</p>
      
      <h4 class="font-bold mt-6 mb-2">2. Große Dateien finden und löschen</h4>
      <p class="mb-4">Nutzen Sie Tools wie TreeSize oder Grand Perspective, um große Dateien zu finden. Alte Videos, Datenbanken und Mediendateien beanspruchen oft viel Platz.</p>
      
      <h4 class="font-bold mt-6 mb-2">3. Cache und temporäre Dateien löschen</h4>
      <p class="mb-4">Browser-Caches und temporäre Dateien sammeln sich an. Tools wie CCleaner können diese automatisch entfernen.</p>
      
      <h4 class="font-bold mt-6 mb-2">4. Duplikate eliminieren</h4>
      <p class="mb-4">Viele Bilder und Dateien sind Duplikate. DupeGuru hilft, diese zu finden und zu löschen.</p>
      
      <h4 class="font-bold mt-6 mb-2">5. Cloud-Speicher nutzen</h4>
      <p class="mb-4">Lagern Sie große Dateien, die Sie nicht täglich benötigen, in die Cloud aus. So sparen Sie lokalen Speicherplatz.</p>
    `,
  },
  {
    id: "5",
    title: "Backup-Strategien: So schützen Sie Ihre wertvollen Daten",
    excerpt:
      "Ein umfassender Leitfaden zur Erstellung und Verwaltung von Backups.",
    category: "Datenschutz",
    author: "Lisa Schmidt",
    date: "20. November 2024",
    readTime: "11 Min",
    content: `
      <h3 class="text-xl font-bold mb-4">Die perfekte Backup-Strategie</h3>
      <p class="mb-4">Ihre Daten sind wertvoll. Eine gute Backup-Strategie schützt Sie vor Datenverlust. Hier ist, was Sie wissen müssen:</p>
      
      <h4 class="font-bold mt-6 mb-2">3-2-1 Backup-Regel</h4>
      <p class="mb-4">Die bewährte 3-2-1 Regel besagt: Haben Sie 3 Kopien Ihrer wichtigen Daten, auf 2 verschiedenen Medien, wobei 1 Kopie offline und an einem anderen Ort ist.</p>
      
      <h4 class="font-bold mt-6 mb-2">Lokale Backups</h4>
      <p class="mb-4">Externe Festplatten sind kostengünstig und schnell. Tools wie Time Machine (macOS) oder Macrium Reflect (Windows) automatisieren lokale Backups.</p>
      
      <h4 class="font-bold mt-6 mb-2">Cloud-Backups</h4>
      <p class="mb-4">Cloud-Speicher wie Nextcloud oder Backblaze bieten Redundanz und Zugänglichkeit. Ideale Ergänzung zu lokalen Backups.</p>
      
      <h4 class="font-bold mt-6 mb-2">Offline-Backups</h4>
      <p class="mb-4">Wichtige Daten sollten auch offline, z.B. auf einer externen Festplatte im Safe, gespeichert sein. Schützt vor Ransomware.</p>
      
      <h4 class="font-bold mt-6 mb-2">Regelmäßig testen</h4>
      <p class="mb-4">Erstellen Sie regelmäßig Test-Wiederherstellungen, um sicherzustellen, dass Ihre Backups funktionieren.</p>
    `,
  },
];

export function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">Tech-Blog</h1>
          <p className="text-lg text-muted-foreground">
            Tipps, Tricks und aktuelle Themen rund um Technik und digitale
            Sicherheit.
          </p>
        </div>

        <Separator className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-secondary/50 border-border hover:border-accent transition-colors hover:shadow-lg cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-accent/20 text-accent border-0"
                  >
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-3 group-hover:text-accent transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.date}
                  </div>
                  <a
                    href={`#/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors group/link"
                  >
                    Zum Artikel
                    <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Verpassen Sie keine Updates!
          </h2>
          <p className="text-muted-foreground mb-6">
            Abonnieren Sie unseren Newsletter und erhalten Sie monatlich neue
            Tech-Tipps und exklusive Angebote.
          </p>
          <a
            href="#/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Newsletter abonnieren
          </a>
        </div>
      </div>
    </div>
  );
}
