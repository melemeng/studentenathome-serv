import { Separator } from "@/components/ui/separator";
import {
  FacebookLogo,
  InstagramLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { siteData } from "@/lib/data";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const primaryLinks = siteData.site.navigation.slice(0, 4);
  const companyLinks = siteData.site.navigation.slice(4, 6);
  const legalLinks = siteData.site.navigation.slice(6);

  const socialIcons = {
    Facebook: FacebookLogo,
    Instagram: InstagramLogo,
    X: XLogo,
    YouTube: YoutubeLogo,
  };

  const handleNavClick = (title: string) => {
    const pageMap: Record<string, string> = {
      Home: "home",
      Lösungen: "solutions",
      "Über uns": "about",
      Kontakt: "contact",
      Blog: "blog",
      Jobs: "jobs",
      Impressum: "impressum",
      FAQ: "faq",
      Datenschutz: "datenschutz",
    };

    if (pageMap[title]) {
      onNavigate(pageMap[title]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const contactDetails = siteData.pages.contact.details;

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* NAP - Critical for Local SEO */}
          <div
            className="md:col-span-2"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            <h3 className="font-bold text-lg mb-4 text-primary" itemProp="name">
              {contactDetails.businessName}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Tech-Support & PC-Hilfe in Berlin. Vor-Ort-Service von
              Informatikstudenten.
            </p>

            {/* Address - NAP Component */}
            <address
              className="text-sm text-muted-foreground not-italic mb-3"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="streetAddress">{contactDetails.address}</span>
              <br />
              <span itemProp="postalCode">
                {contactDetails.postalCode}
              </span>{" "}
              <span itemProp="addressLocality">{contactDetails.city}</span>
            </address>

            {/* Phone - NAP Component */}
            <a
              href={contactDetails.telephoneLink}
              className="text-sm text-accent hover:underline block mb-2"
              itemProp="telephone"
            >
              📞 {contactDetails.telephoneDisplay}
            </a>

            {/* Email */}
            <a
              href={contactDetails.emailLink}
              className="text-sm text-accent hover:underline block"
              itemProp="email"
            >
              ✉️ {contactDetails.email}
            </a>

            {/* Service Areas for Local SEO */}
            <p className="text-xs text-muted-foreground mt-4">
              Service in: {contactDetails.serviceAreas.slice(0, 5).join(", ")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2">
              {primaryLinks.map((item) => (
                <li key={item.title}>
                  <button
                    onClick={() => handleNavClick(item.title)}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Unternehmen
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item.title}>
                  <button
                    onClick={() => handleNavClick(item.title)}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Rechtliches
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((item) => (
                <li key={item.title}>
                  <button
                    onClick={() => handleNavClick(item.title)}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            {siteData.site.footer.copyright}
          </p>

          <div className="flex items-center space-x-4">
            {siteData.site.social.map((social) => {
              const Icon =
                socialIcons[social.platform as keyof typeof socialIcons];
              return (
                <a
                  key={social.platform}
                  href={social.link}
                  className="text-muted-foreground hover:text-accent transition-colors"
                  aria-label={social.platform}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
