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
import { useEffect, useState } from "react";
import { useKV } from "@github/spark/hooks";
import { toast } from "sonner";
import DOMPurify from "dompurify";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string;
  status?: "pending" | "approved" | "rejected";
}

const defaultBlogPosts: BlogPost[] = [
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

interface BlogPageProps {
  onNavigate?: (page: string) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [posts, setPosts] = useKV<BlogPost[]>("blog-posts", defaultBlogPosts);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const currentPosts = posts ?? defaultBlogPosts;

  // SEO: update title and meta description per view
  useEffect(() => {
    if (selectedId) {
      const post = currentPosts.find((p) => p.id === selectedId);
      if (post) {
        // Import setMeta dynamically
        import("@/lib/seo").then(({ default: setMeta }) => {
          setMeta({
            title: `${post.title} | StudentenAtHome`,
            description:
              post.excerpt ||
              post.content?.slice(0, 150).replace(/<[^>]+>/g, ""),
            canonical: `/blog/${post.id}`,
            type: "article",
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              author: {
                "@type": "Person",
                name: post.author,
              },
              datePublished: post.date,
              publisher: {
                "@type": "Organization",
                name: "StudentenAtHome",
                url: "https://www.studentenathome.de",
              },
            },
          });
        });
        return;
      }
    }

    // default blog page meta
    import("@/lib/seo").then(({ default: setMeta }) => {
      setMeta({
        title: "Tech-Blog – StudentenAtHome",
        description:
          "Aktuelle Artikel und Tipps zu Technik, Sicherheit und Netzwerken von StudentenAtHome.",
        canonical: "/blog",
        type: "website",
      });
    });
  }, [selectedId, currentPosts]);

  // Parse blog post ID from URL pathname (not hash)
  useEffect(() => {
    const path = window.location.pathname.replace(
      /^\/studentenathome-serv/,
      ""
    );
    const match = path.match(/^\/blog\/(.+)/);
    if (match) {
      setSelectedId(decodeURIComponent(match[1]));
    } else if (path === "/blog" || path === "/blog/") {
      setSelectedId(null);
    }
  }, []);

  useEffect(() => {
    try {
      // Check if user is logged in and session is valid
      const sessionStr = localStorage.getItem("authSession");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const now = Date.now();

        // Check if session is still valid
        if (now < session.expiresAt) {
          setIsLoggedIn(true);
          setIsAdmin(session.isAdmin || false);
        } else {
          // Session expired - clear it
          localStorage.removeItem("authSession");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userLoggedIn");
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          setIsAdmin(false);
          toast.warning(
            "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
          );
        }
      } else {
        // Fallback to old method for backward compatibility
        const val = localStorage.getItem("userLoggedIn");
        setIsLoggedIn(val === "true");
        setIsAdmin(false);
      }
    } catch (e) {
      console.error("Error checking session", e);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "userLoggedIn" || e.key === "authSession") {
        try {
          const sessionStr = localStorage.getItem("authSession");
          if (sessionStr) {
            const session = JSON.parse(sessionStr);
            setIsLoggedIn(Date.now() < session.expiresAt);
          } else {
            setIsLoggedIn(e.newValue === "true");
          }
        } catch {
          setIsLoggedIn(false);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addPost = async (post: BlogPost) => {
    // Try server API first (requires auth token)
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(post),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("API error", err);
          toast.error(
            "Fehler beim Speichern auf dem Server. Wird lokal gespeichert."
          );
          // fallback to local update
        } else {
          const created = await res.json();
          setPosts((p = []) => [...p, created]);
          setShowForm(false);
          window.history.pushState({}, "", "/blog");
          setSelectedId(null);
          toast.success(
            "Blog-Beitrag erfolgreich eingereicht! Er wird nach Admin-Prüfung veröffentlicht."
          );
          return;
        }
      }
    } catch (e) {
      console.warn("Posting to API failed, falling back to local", e);
      toast.warning("Verbindung fehlgeschlagen. Wird lokal gespeichert.");
    }

    // Fallback: local-only
    setPosts((p = []) => [...p, post]);
    setShowForm(false);
    window.history.pushState({}, "", "/blog");
    setSelectedId(null);
    toast.success("Blog-Beitrag lokal gespeichert!");
  };

  const renderPostList = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-primary">Tech-Blog</h1>
          <p className="text-lg text-muted-foreground">
            Tipps, Tricks und aktuelle Themen rund um Technik und digitale
            Sicherheit.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-md font-semibold"
              >
                Neuen Beitrag erstellen
              </button>
              {isAdmin && (
                <button
                  onClick={() => onNavigate?.("admin")}
                  className="px-4 py-2 border border-accent text-accent rounded-md font-semibold hover:bg-accent/10"
                >
                  Admin-Panel
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => onNavigate?.("login")}
              className="px-4 py-2 border border-border rounded-md text-sm text-accent"
            >
              Login, um Beitrag zu erstellen
            </button>
          )}
        </div>
      </div>

      <Separator className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
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
                <div className="text-xs text-muted-foreground">{post.date}</div>
                <a
                  href={`/blog/${post.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, "", `/blog/${post.id}`);
                    setSelectedId(post.id);
                  }}
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
        <button
          onClick={() => onNavigate?.("contact")}
          className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
        >
          Newsletter abonnieren
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background rounded-lg shadow-2xl border border-border p-8 w-full max-w-4xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-primary">
                Neuen Blog-Beitrag erstellen
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
                aria-label="Schließen"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <BlogPostForm
              onCancel={() => setShowForm(false)}
              onSubmit={async (values) => {
                const id = Date.now().toString();
                // Add status as 'pending' for admin approval
                await addPost({ ...values, id, status: "pending" } as BlogPost);
              }}
            />
          </div>
        </div>
      )}
    </>
  );

  const renderSinglePost = (post: BlogPost) => (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-muted-foreground mb-4">
        {post.author} • {post.date} • {post.readTime}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
      <div className="mt-8">
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/blog");
            setSelectedId(null);
          }}
          className="text-accent font-semibold"
        >
          Zurück zur Übersicht
        </a>
      </div>
    </div>
  );

  if (selectedId) {
    const found = currentPosts.find((p) => p.id === selectedId);
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-4xl px-6 py-20">
          {found ? renderSinglePost(found) : <div>Artikel nicht gefunden.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl px-6 py-20">
        {renderPostList()}
      </div>
    </div>
  );
}

function BlogPostForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (post: Omit<BlogPost, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Technik");
  const [author, setAuthor] = useState("StudentenAtHome Team");
  const [date, setDate] = useState(new Date().toLocaleDateString("de-DE"));
  const [readTime, setReadTime] = useState("5 Min");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }
    if (title.length < 10) {
      toast.error("Der Titel sollte mindestens 10 Zeichen lang sein");
      return;
    }
    if (excerpt.length < 20) {
      toast.error(
        "Die Kurzbeschreibung sollte mindestens 20 Zeichen lang sein"
      );
      return;
    }
    onSubmit({ title, excerpt, category, author, date, readTime, content });
  };

  const categories = [
    "Technik",
    "Sicherheit",
    "Betriebssysteme",
    "Netzwerk",
    "Wartung",
    "Datenschutz",
    "Software",
    "Hardware",
  ];

  const estimateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} Min`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Titel <span className="text-destructive">*</span>
        </label>
        <input
          className="w-full p-3 rounded-md bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          placeholder="z.B. Die 10 besten Tipps für sicheres Surfen"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Kurzbeschreibung <span className="text-destructive">*</span>
        </label>
        <input
          className="w-full p-3 rounded-md bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          placeholder="Eine kurze Zusammenfassung für die Übersicht"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          {excerpt.length}/200 Zeichen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Kategorie
          </label>
          <select
            className="w-full p-3 rounded-md bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Autor</label>
          <input
            className="w-full p-3 rounded-md bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Lesezeit
          </label>
          <input
            className="w-full p-3 rounded-md bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="z.B. 5 Min"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Inhalt (HTML) <span className="text-destructive">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const estimated = estimateReadTime(
                content.replace(/<[^>]+>/g, "")
              );
              setReadTime(estimated);
            }}
            className="text-xs text-accent hover:text-accent/80"
          >
            Lesezeit berechnen
          </button>
        </div>
        <textarea
          rows={12}
          className="w-full p-3 rounded-md bg-background border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors font-mono text-sm"
          placeholder={
            '<h3 class="text-xl font-bold mb-4">Überschrift</h3>\n<p class="mb-4">Ihr Text hier...</p>'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Verwenden Sie HTML-Tags für Formatierung. Überschriften mit h3/h4,
          Absätze mit p, Listen mit ul/li.
        </p>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-2">Vorschau</h4>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Titel:</strong> {title || "(kein Titel)"}
          </p>
          <p>
            <strong>Kategorie:</strong> {category}
          </p>
          <p>
            <strong>Autor:</strong> {author}
          </p>
          <p>
            <strong>Lesezeit:</strong> {readTime}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-md border border-border hover:bg-secondary/50 transition-colors font-medium"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors font-semibold"
        >
          Beitrag veröffentlichen
        </button>
      </div>
    </form>
  );
}
