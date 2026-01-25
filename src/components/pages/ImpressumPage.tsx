import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import setMeta from "@/lib/seo";

export default function ImpressumPage() {
  useEffect(() => {
    setMeta({
      title: `Impressum | StudentenAtHome`,
      description:
        "Rechtliche Informationen zum Betreiber von StudentenAtHome, Kontakt- und Firmenangaben gemäß §5 TMG.",
      canonical: "https://www.studentenathome.de/impressum",
    });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-primary">Impressum</h1>
          <p className="text-muted-foreground">Informationen gemäß § 5 TMG</p>
        </div>

        <Separator className="mb-12" />

        <div className="space-y-12 text-foreground">
          {/* Angaben zum Betreiber */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Angaben zum Betreiber der Website
            </h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <strong>Verantwortliche Person:</strong>
              </p>
              <p>Floatcraft UG</p>
              <p>
                Peter-Vischer-Straße 8
                <br />
                12157 Berlin
              </p>
              <p>
                <strong>Telefon:</strong> +49 179 4104323
                <br />
              </p>
              <p>
                <strong>E-Mail:</strong> support@studentenathome.de
              </p>
            </div>
          </section>

          {/* Vertreten durch */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Vertreten durch die Geschäftsführung
            </h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <strong>Geschäftsführer:</strong> Linus Haddad
              </p>
              <p>
                Die Geschäftsführung ist erreichbar unter den oben angegebenen
                Kontaktdaten.
              </p>
            </div>
          </section>

          {/* Registrierungseintrag */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Registrierungseintrag
            </h2>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <strong>Eintrag im Handelsregister:</strong> Amtsgericht
                Berlin-Charlottenburg
              </p>
              <p>
                <strong>Registrierungsnummer:</strong> HRB 270599 B
              </p>
              <p>
                <strong>
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                  Umsatzsteuergesetz:
                </strong>{" "}
                DE364287642
              </p>
            </div>
          </section>

          {/* Verantwortung für Inhalte */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Verantwortung für Inhalte
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
                sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8
                bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die
                auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen bleiben hiervon unberührt. Eine entsprechende
                Haftung ist jedoch erst ab dem Zeitpunkt einer konkreten
                Kenntnis einer Rechtsverletzung möglich.
              </p>
            </div>
          </section>

          {/* Verantwortung für Links */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Verantwortung für Links
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Unsere Website enthält Links zu externen Websites. Auf den
                Inhalt dieser Websites haben wir keinen Einfluss. Daher können
                wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für
                die Inhalte der verlinkten Seiten ist der jeweilige Anbieter
                verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
                Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
                Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p>
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                zumutbar. Sollten wir Kenntnis von Rechtsverletzungen erlangen,
                werden wir die entsprechenden Links umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Urheberrecht
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Die auf unserer Website veröffentlichten Inhalte unterliegen dem
                deutschen Urheberrecht und anderen Gesetzen zum Schutz geistigen
                Eigentums. Jegliche Vervielfältigung, Bearbeitung, Verbreitung
                und jede Art der Verwertung außerhalb der Grenzen des
                Urheberrechts bedürfen schriftlicher Zustimmung des Autors oder
                Rechteinhabers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten,
                nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
                dieser Website nicht vom Betreiber erstellt wurden, werden die
                Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
                Dritter als solche gekennzeichnet.
              </p>
            </div>
          </section>

          {/* Datenschutz */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Datenschutz
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Nähere Informationen zum Datenschutz entnehmen Sie unserer{" "}
                <a
                  href="#/datenschutz"
                  className="text-accent hover:text-accent/80 underline"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>
            </div>
          </section>

          {/* Streitbeilegung */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Streitbeilegung
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS-Plattform) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Wir sind nicht verpflichtet, an Streitbeilegungsverfahren vor
                einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Haftungsausschluss */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Haftungsausschluss
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Die Inhalte dieser Website werden bereitgestellt, wie sie sind,
                ohne Garantien jeglicher Art, weder ausdrücklich noch
                stillschweigend. Der Betreiber übernimmt keine Haftung für:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fehlende oder unterbrochene Dienste</li>
                <li>Datenverlust oder Datenbeschädigung</li>
                <li>Viren oder Schadsoftware</li>
                <li>Sicherheitslücken in den bereitgestellten Diensten</li>
                <li>Indirekte, zufällige oder Folgeschäden</li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Disclaimer Technische Unterstützung
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Die von unseren Dienstleistern erbrachten technischen
                Dienstleistungen werden mit angemessenem Aufwand und besten
                Kenntnissen erbracht. Wir können jedoch keine Garantie für
                bestimmte Ergebnisse oder fehlerfreie Dienstleistungen geben.
                Der Kunde trägt das Risiko für die Nutzung unserer
                Dienstleistungen.
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
