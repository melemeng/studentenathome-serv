import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import setMeta from "@/lib/seo";

export function PrivacyPage() {
  useEffect(() => {
    setMeta({
      title: `Datenschutz | ${"StudentenAtHome"}`,
      description:
        "Informationen zur Verarbeitung personenbezogener Daten, Cookies, Tracking und Ihren Rechten bei StudentenAtHome.",
      canonical: "https://www.studentenathome.de/datenschutz",
    });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-primary">
            Datenschutzerklärung
          </h1>
          <p className="text-muted-foreground">
            Datenschutz nach DSGVO und BDSG
          </p>
        </div>

        <Separator className="mb-12" />

        <div className="space-y-12 text-foreground">
          {/* Einleitung */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Einleitung und Überblick
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Diese Datenschutzerklärung soll Sie darüber aufklären, welche
                Daten wir sammeln, wie wir diese verarbeiten und welche Rechte
                Ihnen in Bezug auf Ihre Daten zustehen. Wir handhaben den Schutz
                Ihrer persönlichen Daten sehr ernst und halten uns an alle
                geltenden Datenschutzbestimmungen, insbesondere an die
                Datenschutz-Grundverordnung (DSGVO) und das
                Bundesdatenschutzgesetz (BDSG).
              </p>
              <p>
                Die Betreiber dieser Website und ihrer Seiten (im Folgenden
                "wir", "uns", "unser") sind:
              </p>
              <p className="ml-4">
                Studenten Helfen UG
                <br />
                Musterstraße 123
                <br />
                10115 Berlin
                <br />
                E-Mail: support@studentenathome.de
                <br />
                Telefon: +49 176 75444136
              </p>
            </div>
          </section>

          {/* Betroffene Personen */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Welche Daten wir erfassen
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Besucher dieser Website, Nutzer unserer Dienste und
                Interessenten an unseren Angeboten sind die Betroffenen dieser
                Datenschutzerklärung. Im rechtlichen Sinne sind Betroffene alle
                Personen, deren personenbezogene Daten wir erfassen.
              </p>
            </div>
          </section>

          {/* Cookies und Tracking */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Cookies und Tracking
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Unsere Website nutzt keine Cookie-Banner und minimales Tracking.
                Wir setzen nur notwendige technische Cookies, die für die
                Funktion der Website erforderlich sind. Diese benötigen keine
                Zustimmung.
              </p>
              <p>
                <strong>Web Analytics:</strong> Wir verwenden keine umfangreiche
                Analytiksoftware. Falls vorhanden, werden Zugriffsdaten
                pseudonymisiert erfasst.
              </p>
            </div>
          </section>

          {/* Erfassung von Daten */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Erfassung und Verarbeitung von Daten
            </h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold mb-2 text-primary">
                  Kontaktformular
                </h3>
                <p>
                  Wenn Sie uns über das Kontaktformular oder per E‑Mail
                  kontaktieren, speichern wir die von Ihnen übermittelten Daten
                  (Name, E‑Mail‑Adresse, Telefonnummer, Nachrichtentext) auf
                  unseren Servern. Diese Daten werden ausschließlich zur
                  Bearbeitung Ihrer Anfrage und zur Kontaktaufnahme verwendet.
                  Eine Weitergabe an Dritte findet nicht statt.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">
                  Dienstleistungsverträge
                </h3>
                <p>
                  Wenn Sie unsere Dienstleistungen in Anspruch nehmen, erfassen
                  wir die notwendigen persönlichen Daten (Name, Adresse,
                  Kontaktdaten, ggfs. Bankdaten) zur Erbringung der
                  Dienstleistung. Diese Daten sind notwendig für die
                  Vertragserfüllung.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Newsletter</h3>
                <p>
                  Wenn Sie sich für unseren Newsletter anmelden, speichern wir
                  Ihre E-Mail-Adresse. Sie erhalten dann monatlich Tipps und
                  Tricks rund um Technik sowie exklusive Angebote. Sie können
                  sich jederzeit abmelden.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">
                  Zugriffsdaten
                </h3>
                <p>
                  Unser Webserver speichert automatisch Zugriffsdaten
                  (IP-Adresse, Browser-Typ, Uhrzeit, aufgerufene Seite) zu
                  statistischen Zwecken. Diese Daten sind für die Funktion und
                  Sicherheit unserer Website notwendig und werden nicht an
                  Dritte weitergegeben.
                </p>
              </div>
            </div>
          </section>

          {/* Rechtliche Grundlagen */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Rechtliche Grundlagen der Datenverarbeitung
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Unsere Datenverarbeitung basiert auf folgenden rechtlichen
                Grundlagen:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Art. 6 Abs. 1 b) DSGVO:</strong> Verarbeitung zur
                  Vertragserfüllung und Kontaktaufnahme
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 f) DSGVO:</strong> Verarbeitung aufgrund
                  berechtigter Interessen (z.B. Website-Sicherheit)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 a) DSGVO:</strong> Verarbeitung mit
                  Ihrer ausdrücklichen Einwilligung (z.B. Newsletter)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 c) DSGVO:</strong> Verarbeitung zur
                  Erfüllung gesetzlicher Verpflichtungen
                </li>
              </ul>
            </div>
          </section>

          {/* Dauer der Speicherung */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Speicherdauer
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir speichern personenbezogene Daten nur so lange, wie notwendig
                für die jeweilige Verarbeitung:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Kontaktdaten: Bis zur Beendigung der Anfragebearbeitung,
                  maximal 12 Monate
                </li>
                <li>
                  Vertragsdaten: Nach Beendigung des Vertrags gemäß gesetzlicher
                  Aufbewahrungspflichten (ca. 7-10 Jahre für
                  Geschäftsunterlagen)
                </li>
                <li>Newsletter-Abonnenten: Bis zur Abmeldung</li>
                <li>Zugriffsprotokolle: Maximal 30 Tage</li>
              </ul>
            </div>
          </section>

          {/* Weitergabe an Dritte */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Weitergabe an Dritte
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Ihre Daten werden nicht an Dritte weitergegeben, ausgenommen:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Wenn dies gesetzlich vorgeschrieben ist</li>
                <li>Wenn wir dazu gerichtlich verpflichtet werden</li>
                <li>
                  An vertrauenswürdige Partner, die uns bei der Dienstleistung
                  unterstützen (z.B. E-Mail-Provider), mit denen wir
                  Datenverarbeitungsverträge geschlossen haben
                </li>
              </ul>
            </div>
          </section>

          {/* Rechte der betroffenen Personen */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Ihre Rechte
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>Gemäß DSGVO haben Sie die folgenden Rechte:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Recht auf Auskunft:</strong> Sie können erfahren,
                  welche Daten wir über Sie speichern
                </li>
                <li>
                  <strong>Recht auf Berichtigung:</strong> Sie können falsche
                  Daten korrigieren lassen
                </li>
                <li>
                  <strong>Recht auf Löschung:</strong> Sie können die Löschung
                  Ihrer Daten verlangen
                </li>
                <li>
                  <strong>Recht auf Einschränkung:</strong> Sie können die
                  Verarbeitung Ihrer Daten einschränken lassen
                </li>
                <li>
                  <strong>Recht auf Datenportabilität:</strong> Sie erhalten
                  Ihre Daten in einem strukturierten Format
                </li>
                <li>
                  <strong>Recht auf Widerspruch:</strong> Sie können der
                  Verarbeitung widersprechen
                </li>
                <li>
                  <strong>Recht auf Beschwerde:</strong> Sie können sich bei
                  einer Datenschutzbehörde beschweren
                </li>
              </ul>
              <p className="mt-4">
                Zur Geltendmachung dieser Rechte kontaktieren Sie uns unter:
              </p>
              <p className="ml-4">
                support@studentenathome.de oder +49 176 75444136
              </p>
            </div>
          </section>

          {/* Datensicherheit */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Datensicherheit
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir setzen technische und organisatorische Maßnahmen ein, um
                Ihre Daten vor Verlust, Missbrauch und unbefugtem Zugriff zu
                schützen. Unsere Website verwendet SSL/TLS‑Verschlüsselung
                (HTTPS) für sichere Datenübertragung.
              </p>
              <p>
                Trotz aller Sicherheitsmaßnahmen können wir absolute Sicherheit
                nicht garantieren. Bei Sicherheitsfragen kontaktieren Sie uns.
              </p>
            </div>
          </section>

          {/* Kontakt zum Datenschutzbeauftragten */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Kontakt</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Für Fragen zum Datenschutz und zur Ausübung Ihrer Rechte
                kontaktieren Sie uns:
              </p>
              <p className="ml-4">
                <strong>Studenten Helfen UG</strong>
                <br />
                Klingestrasse 13C
                <br />
                01159 Dresden
                <br />
                E-Mail: support@studentenathome.de
                <br />
                Telefon: +49 176 75444136
              </p>
            </div>
          </section>

          {/* Änderungen */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Änderungen dieser Datenschutzerklärung
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu
                aktualisieren. Die aktuelle Version ist jederzeit auf dieser
                Seite verfügbar. Wichtige Änderungen werden Ihnen rechtzeitig
                mitgeteilt.
              </p>
            </div>
          </section>
        </div>

        <Separator className="my-12" />
        <p className="text-xs text-muted-foreground text-center">
          Letzte Aktualisierung: Dezember 2024
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
