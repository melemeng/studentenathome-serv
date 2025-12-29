import { useState } from "react";
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
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
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

      if (password.length < 6) {
        setError("Passwort muss mindestens 6 Zeichen lang sein");
        setIsLoading(false);
        return;
      }

      // Simulate successful login
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userLoggedIn", "true");
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1000);
  };

  // Zeige Dashboard nach Login
  if (isLoggedIn) {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-secondary/50 border-border">
              <CardHeader>
                <CardTitle className="text-primary">Meine Buchungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verwalten Sie Ihre aktuellen und zukünftigen Technik-Support
                  Termine
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

            <Card className="bg-secondary/50 border-border">
              <CardHeader>
                <CardTitle className="text-primary">Rechnungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Einsehen Sie alle bisherigen Rechnungen und Zahlungen
                </p>
                <Button className="mt-4 w-full bg-accent hover:bg-accent/90">
                  Ansehen
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
              onClick={() => {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userLoggedIn");
                setIsLoggedIn(false);
                setEmail("");
                setPassword("");
              }}
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
                  onClick={() => onNavigate?.("contact")}
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
                onClick={() => onNavigate?.("contact")}
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
                <p>E-Mail: demo@studentenathome.de</p>
                <p>Passwort: demo123</p>
              </div>
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
