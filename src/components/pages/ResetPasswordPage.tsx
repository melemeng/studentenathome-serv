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
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import apiConfig from "@/lib/apiConfig";
import {
  PasswordStrengthMeter,
  calculatePasswordStrength,
} from "@/components/ui/password-strength-meter";

interface ResetPasswordPageProps {
  onNavigate?: (page: string) => void;
}

export default function ResetPasswordPage({
  onNavigate,
}: ResetPasswordPageProps) {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Ungültiger Reset-Link. Bitte fordern Sie einen neuen an.");
    }

    import("@/lib/seo").then(({ default: setMeta }) => {
      setMeta({
        title: "Neues Passwort festlegen | StudentenAtHome",
        description: "Setzen Sie Ihr Passwort zurück.",
        canonical: "https://www.studentenathome.de/reset-password",
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Bitte füllen Sie alle Felder aus");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein");
      setIsLoading(false);
      return;
    }

    // Check password strength
    const strength = calculatePasswordStrength(newPassword);
    if (strength.score < 2) {
      setError(
        "Passwort ist zu schwach. Bitte wählen Sie ein stärkeres Passwort."
      );
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiConfig.auth.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Fehler beim Zurücksetzen des Passworts");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      toast.success(data.message);
    } catch (error) {
      console.error("Password reset error:", error);
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
              Passwort erfolgreich zurückgesetzt!
            </CardTitle>
            <CardDescription className="text-base">
              Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => onNavigate?.("login")}
              className="w-full bg-accent hover:bg-accent/90"
            >
              Jetzt anmelden
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
              <Lock className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl text-primary">
              Neues Passwort festlegen
            </CardTitle>
            <CardDescription>
              Wählen Sie ein starkes Passwort für Ihr Konto.
            </CardDescription>
          </CardHeader>

          <Separator className="mb-6" />

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold">
                  Neues Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Mindestens 8 Zeichen"
                    disabled={isLoading || !token}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <PasswordStrengthMeter
                  password={newPassword}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Passwort bestätigen
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Passwort wiederholen"
                    disabled={isLoading || !token}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-base"
              >
                {isLoading ? "Wird gespeichert..." : "Passwort zurücksetzen"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Link abgelaufen?</p>
              <Button
                onClick={() => onNavigate?.("request-password-reset")}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10"
              >
                Neuen Link anfordern
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
