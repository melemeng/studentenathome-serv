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
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import apiConfig from "@/lib/apiConfig";

interface RequestPasswordResetPageProps {
  onNavigate?: (page: string) => void;
}

export default function RequestPasswordResetPage({
  onNavigate,
}: RequestPasswordResetPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    import("@/lib/seo").then(({ default: setMeta }) => {
      setMeta({
        title: "Passwort zurücksetzen | StudentenAtHome",
        description:
          "Fordern Sie einen Link zum Zurücksetzen Ihres Passworts an.",
        canonical: "https://www.studentenathome.de/request-password-reset",
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Bitte geben Sie Ihre E-Mail-Adresse ein");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiConfig.auth.requestPasswordReset, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Fehler beim Senden der E-Mail");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      toast.success(data.message);
    } catch (error) {
      console.error("Password reset request error:", error);
      setError("Verbindungsfehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-6 py-20">
        <Card className="w-full max-w-md bg-secondary/50 border-border shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-primary">
              E-Mail gesendet!
            </CardTitle>
            <CardDescription className="text-base">
              Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir
              Ihnen einen Link zum Zurücksetzen Ihres Passworts gesendet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Hinweis:</strong> Der Link ist 1 Stunde gültig. Bitte
                überprüfen Sie auch Ihren Spam-Ordner.
              </p>
            </div>
            <Button
              onClick={() => onNavigate?.("login")}
              className="w-full bg-accent hover:bg-accent/90"
            >
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Card className="bg-secondary/50 border-border shadow-lg">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl text-primary">
              Passwort vergessen?
            </CardTitle>
            <CardDescription>
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link
              zum Zurücksetzen.
            </CardDescription>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  E-Mail-Adresse
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="ihre@email.de"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-base"
              >
                {isLoading ? "Wird gesendet..." : "Reset-Link senden"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Doch erinnert? Zurück zur
              </p>
              <Button
                onClick={() => onNavigate?.("login")}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10"
              >
                Anmeldung
              </Button>
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
