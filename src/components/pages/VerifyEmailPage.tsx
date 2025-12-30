import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setMeta } from "@/lib/seo";
import apiConfig from "@/lib/apiConfig";

interface VerifyEmailPageProps {
  onNavigate: (page: string) => void;
}

type VerificationState = "loading" | "success" | "error";

export default function VerifyEmailPage({ onNavigate }: VerifyEmailPageProps) {
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMeta({
      title: "E-Mail verifizieren - StudentenAtHome",
      description: "Verifizieren Sie Ihre E-Mail-Adresse",
      canonical: "/verify-email",
    });

    // Token aus URL extrahieren
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setState("error");
      setMessage("Kein Verifizierungs-Token gefunden.");
      return;
    }

    // Backend-API aufrufen
    fetch(`${apiConfig.auth.verifyEmail}?token=${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setState("success");
          setMessage(data.message);
        } else if (data.error) {
          setState("error");
          setMessage(data.error);
        }
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setState("error");
        setMessage(
          "Fehler bei der Verifizierung. Bitte versuchen Sie es später erneut."
        );
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-2 to-accent-3 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {state === "loading" && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-accent-9 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">
                E-Mail wird verifiziert...
              </h1>
              <p className="text-neutral-11">Bitte warten Sie einen Moment.</p>
            </>
          )}

          {state === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2 text-green-600">
                Erfolgreich verifiziert!
              </h1>
              <p className="text-neutral-11 mb-6">{message}</p>
              <Button
                onClick={() => onNavigate("login")}
                className="w-full"
                size="lg"
              >
                Jetzt anmelden →
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2 text-red-600">
                Verifizierung fehlgeschlagen
              </h1>
              <p className="text-neutral-11 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => onNavigate("register")}
                  variant="outline"
                  className="w-full"
                >
                  Neu registrieren
                </Button>
                <Button
                  onClick={() => onNavigate("contact")}
                  variant="ghost"
                  className="w-full"
                >
                  Support kontaktieren
                </Button>
              </div>
            </>
          )}
        </Card>

        <p className="text-center mt-4 text-sm text-neutral-11">
          <button
            onClick={() => onNavigate("home")}
            className="hover:underline"
          >
            ← Zurück zur Startseite
          </button>
        </p>
      </motion.div>
    </div>
  );
}
