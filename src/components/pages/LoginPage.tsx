import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";
import { authStore } from "@/lib/authStore";
import apiConfig from "@/lib/apiConfig";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

interface AuthSession {
  email: string;
  token: string;
  isAdmin: boolean;
  expiresAt: number; // timestamp
  createdAt: number;
}

// Security utilities
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const WARNING_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Admin email whitelist - only these emails have admin access
const ADMIN_EMAILS = [
  "admin@studentenathome.de",
  "georgi@studentenathome.de",
];

function generateSecureToken(email: string): string {
  // In production, this would be a JWT from the backend
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return btoa(`${email}:${timestamp}:${random}`);
}

function saveSession(email: string): AuthSession {
  const now = Date.now();
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  const session: AuthSession = {
    email,
    token: generateSecureToken(email),
    isAdmin,
    expiresAt: now + SESSION_DURATION,
    createdAt: now,
  };

  try {
    localStorage.setItem("authSession", JSON.stringify(session));
    // Keep legacy keys for backward compatibility
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("authToken", session.token);
  } catch (e) {
    console.error("Failed to save session", e);
  }

  return session;
}

function getSession(): AuthSession | null {
  try {
    const sessionStr = localStorage.getItem("authSession");
    if (!sessionStr) return null;

    const session: AuthSession = JSON.parse(sessionStr);
    const now = Date.now();

    // Check if session expired
    if (now > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (e) {
    console.error("Failed to parse session", e);
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem("authSession");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("authToken");
  } catch (e) {
    console.error("Failed to clear session", e);
  }
}

function getTimeUntilExpiry(session: AuthSession): number {
  return session.expiresAt - Date.now();
}

function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours} Stunde${hours !== 1 ? "n" : ""} ${minutes} Minute${
      minutes !== 1 ? "n" : ""
    }`;
  }
  return `${minutes} Minute${minutes !== 1 ? "n" : ""}`;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check session
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(
    null
  );
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Check for existing valid session on mount (auto-login)
  useEffect(() => {
    const session = getSession();

    if (session) {
      const timeRemaining = getTimeUntilExpiry(session);

      if (timeRemaining > 0) {
        // Valid session exists - auto login
        setCurrentSession(session);
        setIsLoggedIn(true);
        setEmail(session.email);
        toast.success(`Willkommen zurück, ${session.email}!`);

        // Show warning if session expires soon
        if (timeRemaining < WARNING_BEFORE_EXPIRY) {
          setShowSessionWarning(true);
          toast.warning(
            `Ihre Sitzung läuft in ${formatTimeRemaining(
              timeRemaining
            )} ab. Bitte melden Sie sich erneut an.`,
            { duration: 10000 }
          );
        }
      } else {
        // Session expired
        clearSession();
        toast.error(
          "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
        );
      }
    }

    setIsLoading(false);
  }, []);

  // Session expiry check interval
  useEffect(() => {
    if (!isLoggedIn || !currentSession) return;

    const checkInterval = setInterval(() => {
      const timeRemaining = getTimeUntilExpiry(currentSession);

      if (timeRemaining <= 0) {
        // Session expired
        clearSession();
        setIsLoggedIn(false);
        setCurrentSession(null);
        toast.error(
          "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
        );
      } else if (timeRemaining < WARNING_BEFORE_EXPIRY && !showSessionWarning) {
        // Show warning
        setShowSessionWarning(true);
        toast.warning(
          `Ihre Sitzung läuft in ${formatTimeRemaining(timeRemaining)} ab.`,
          { duration: 10000 }
        );
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isLoggedIn, currentSession, showSessionWarning]);

  useEffect(() => {
    // set meta for login page
    import("@/lib/seo").then(({ default: setMeta }) => {
      setMeta({
        title: `Anmelden | StudentenAtHome`,
        description:
          "Melden Sie sich bei Ihrem StudentenAtHome Konto an, um Beiträge zu erstellen und Buchungen zu verwalten.",
        canonical: "https://www.studentenathome.de/login",
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Bitte füllen Sie alle Felder aus");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiConfig.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) {
          setError(
            "E-Mail noch nicht verifiziert. Bitte überprüfen Sie Ihren Posteingang."
          );
          setIsLoading(false);
          return;
        }
        setError(data.error || "Anmeldung fehlgeschlagen");
        setIsLoading(false);
        return;
      }

      // Store JWT token and user data
      authStore.login(data.token, data.user);
      setCurrentSession({
        email: data.user.email,
        token: data.token,
        isAdmin: data.user.isAdmin,
        expiresAt: Date.now() + SESSION_DURATION,
        createdAt: Date.now(),
      });
      setIsLoggedIn(true);
      setIsLoading(false);

      const expiryTime = formatTimeRemaining(SESSION_DURATION);
      toast.success(
        session.isAdmin
          ? `Admin-Anmeldung erfolgreich! Sitzung gültig für ${expiryTime}.`
          : `Erfolgreich angemeldet! Sitzung gültig für ${expiryTime}.`
      );

      // Redirect based on role
      setTimeout(() => {
        if (onNavigate) {
          onNavigate(session.isAdmin ? "admin" : "blog");
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setError("Verbindungsfehler. Bitte versuchen Sie es später erneut.");
      setIsLoading(false);
    }
  };
      }, 1000);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      const token = authStore.getToken();
      
      if (token) {
        // Call backend logout endpoint to revoke token
        await fetch(apiConfig.auth.logout, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear all auth data locally
      authStore.logout();
      clearSession();
      setIsLoggedIn(false);
      setCurrentSession(null);
      setEmail("");
      setPassword("");
      setShowSessionWarning(false);
      toast.info("Sie wurden erfolgreich abgemeldet.");
    }
  };

  const handleExtendSession = () => {
    if (currentSession) {
      const newSession = saveSession(currentSession.email);
      setCurrentSession(newSession);
      setShowSessionWarning(false);
      toast.success("Sitzung wurde verlängert.");
    }
  };

  // Show loading state during session check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">
            Sitzung wird überprüft...
          </p>
        </div>
      </div>
    );
  }

  // Zeige Dashboard nach Login
  if (isLoggedIn && currentSession) {
    const timeRemaining = getTimeUntilExpiry(currentSession);
    const sessionAge = Date.now() - currentSession.createdAt;

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 text-primary">
              Login erfolgreich!
            </h1>
            <p className="text-lg text-muted-foreground">Willkommen, {email}</p>
          </div>

          {/* Session Info Card */}
          {showSessionWarning && (
            <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Sitzung läuft bald ab
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ihre Sitzung endet in{" "}
                        {formatTimeRemaining(timeRemaining)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleExtendSession}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Sitzung verlängern
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6 bg-secondary/30 border-border">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    E-Mail:
                  </span>
                  <span className="text-sm text-foreground">
                    {currentSession.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Rolle:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      currentSession.isAdmin
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {currentSession.isAdmin ? "Administrator" : "Benutzer"}
                  </span>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Angemeldet seit: {formatTimeRemaining(sessionAge)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gültig bis:{" "}
                    {new Date(currentSession.expiresAt).toLocaleString("de-DE")}
                  </p>
                </div>
                <Button
                  onClick={handleExtendSession}
                  variant="outline"
                  size="sm"
                  className="w-full border-accent text-accent hover:bg-accent/10 mt-2"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Sitzung verlängern
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-secondary/50 border-border">
              <CardHeader>
                <CardTitle className="text-primary">Meine Buchungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verwalten Sie Ihre aktuellen und zukünftigen
                  Tech-Support-Termine
                </p>
                <Button className="mt-4 w-full bg-accent hover:bg-accent/90">
                  Zur Übersicht
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50 border-border">
              <CardHeader>
                <CardTitle className="text-primary">Mein Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aktualisieren Sie Ihre persönlichen Daten und
                  Kontaktinformationen
                </p>
                <Button className="mt-4 w-full bg-accent hover:bg-accent/90">
                  Bearbeiten
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
              <CardHeader>
                <CardTitle className="text-primary">Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Erstellen Sie neue Blog-Beiträge und teilen Sie Ihr Wissen
                </p>
                <Button
                  onClick={() => onNavigate?.("blog")}
                  className="mt-4 w-full bg-accent hover:bg-accent/90"
                >
                  Beitrag erstellen
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="text-primary">Admin Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Beiträge genehmigen und Inhalte moderieren
                </p>
                <Button
                  onClick={() => onNavigate?.("admin")}
                  className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Zum Admin-Bereich
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-secondary/50 border-border mb-8">
            <CardHeader>
              <CardTitle className="text-primary">Letzte Aktivitäten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">
                      Support-Termin durchgeführt
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Netzwerkkonfiguration
                    </p>
                  </div>
                  <span className="text-sm text-accent">vor 2 Tagen</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">
                      Konto erstellt
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Willkommen bei StudentenAtHome
                    </p>
                  </div>
                  <span className="text-sm text-accent">heute</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full md:w-64"
            >
              Abmelden
            </Button>
            <Button
              onClick={() => onNavigate?.("home")}
              variant="ghost"
              className="w-full md:w-64"
            >
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Card className="bg-secondary/50 border-border shadow-lg">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-4">
              <Lock className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl text-primary">Anmelden</CardTitle>
            <CardDescription>
              Melden Sie sich an, um auf Ihr StudentenAtHome-Konto zuzugreifen
            </CardDescription>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground font-semibold"
                >
                  E-Mail-Adresse
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-background border-border pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-semibold"
                >
                  Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-background border-border pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-muted-foreground">
                    Angemeldet bleiben
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate?.("request-password-reset")}
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  Passwort vergessen?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-base"
              >
                {isLoading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Noch kein Konto?
              </p>
              <Button
                onClick={() => onNavigate?.("register")}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10"
              >
                Jetzt registrieren
              </Button>
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg space-y-2">
              <p className="font-semibold text-foreground text-sm">
                Test-Zugangsdaten:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Benutzer: demo@studentenathome.de</p>
                <p>Admin: admin@studentenathome.de</p>
                <p>Passwort: demo123</p>
              </div>
              <p className="text-xs text-muted-foreground italic mt-2">
                Hinweis: Nur Admin-Konten können Blogbeiträge genehmigen.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button
            variant="link"
            onClick={() => onNavigate?.("home")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}
