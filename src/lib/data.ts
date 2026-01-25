export const siteData = {
  site: {
    brandNames: ["Floatcraft", "StudentenAtHome"],
    navigation: [
      { title: "Home", link: "#" },
      { title: "Lösungen", link: "#" },
      { title: "Über uns", link: "#" },
      { title: "Kontakt", link: "#" },
      { title: "Blog", link: "#" },
      { title: "Jobs", link: "#" },
      { title: "Impressum", link: "#" },
      { title: "FAQ", link: "#" },
      { title: "Datenschutz", link: "#" },
    ],
    auth: [
      { context: "Home", link: "https://studentenathome.de/#" },
      {
        context: "Lösungen/Preise",
        link: "https://studentenathome.de/service#",
      },
      { context: "Über uns", link: "https://studentenathome.de/about#" },
      { context: "Kontakt", link: "https://studentenathome.de/contact#" },
    ],
    social: [
      { platform: "Facebook", link: "" },
      { platform: "Instagram", link: "" },
      { platform: "X", link: "" },
      { platform: "YouTube", link: "" },
    ],
    footer: {
      copyright: "© 2020-2026 Floatcraft UG. All rights reserved.",
    },
  },
  pages: {
    home: {
      hero: {
        headline:
          "Sagen Sie Technikproblemen Lebewohl – So machen wir Ihre Geräte zukunftssicher!",
        primaryCTAs: [
          { title: "Lösungen", link: "https://studentenathome.de/service" },
          {
            title: "Jetzt buchen →",
            link: "https://studentenathome.de/contact",
          },
        ],
      },
      valueProps: [
        {
          title: "Schnelle und effiziente Hilfe",
          description:
            "Wir bieten schnelle, nachhaltige Lösungen für Ihre Technikprobleme. Kontaktieren Sie uns für effektive Hilfe, die Ausfallzeiten minimiert und Komplexität eliminiert. Vertrauen Sie auf unsere Expertise.",
          more: "https://studentenathome.de/service",
        },
        {
          title: "Kompetentes Team",
          description:
            "Unser Team besteht hauptsächlich aus Informatikstudenten, die umfangreiche Erfahrungen aus zahlreichen Kundenprojekten mitbringen. Ihre Expertise garantiert zuverlässige und professionelle Unterstützung bei all Ihren Technikfragen.",
          more: "https://studentenathome.de/about",
        },
        {
          title: "Für jeden geeignet: Ob privat oder gewerblich",
          description:
            "Privat oder gewerblich unser Service passt sich Ihren individuellen Bedürfnissen an. Wir helfen bei maßgeschneiderten Techniklösungen, die sowohl für Privatpersonen als auch für Unternehmen ideal sind.",
          more: "https://studentenathome.de/contact",
        },
      ],
      highlight: {
        title: "Besonders wichtig",
        subtitle: "Weniger Kopfschmerzen, mehr Zeit",
        description:
          "Unser Service entlastet Sie von technischen Sorgen. Genießen Sie mehr Freizeit und höhere Produktivität ohne Technikfrustration.",
        cta: "https://studentenathome.de/contact",
      },
      testimonial: {
        quote:
          "Ich bin absolut begeistert von dem professionellen und freundlichen Service, den ich erhalten habe. Als jemand, der nicht viel über Technik weiß, war es eine Erleichterung, einen Service zu finden, der mir auch alles erklärt hat.",
        author: "Klaus Piepereit Senior",
      },
      newsletter: {
        title: "5 Gratis-Technik-Tipps — Jetzt Newsletter abonnieren",
        description:
          "In unserem Newsletter finden Sie monatlich Tipps und Tricks rund um Technik und erhalten exklusive Angebote.",
        emailFieldPlaceholder: "E-Mail",
        cta: "Abonnieren",
      },
    },
    solutions: {
      title: "Alles was Sie brauchen",
      intro:
        "Unsere Schlüsselstrategien bieten Ihnen maßgeschneiderte Lösungen für alle technischen Herausforderungen. Egal ob es um die Konfiguration von Netzwerken, individuelle Einstellungen Ihrer Geräte oder schnelle Fehlerbehebungen geht – wir stehen Ihnen zur Seite.",
      services: [
        {
          title: "Netzwerkkonfiguration",
          description:
            "Wir passen Ihr Netzwerk maßgeschneidert an, um optimale Leistung und Sicherheit zu gewährleisten.",
        },
        {
          title: "Individuelle Konfigurationen",
          description:
            "Ihre Geräte werden passgenau eingerichtet, um den wachsenden Anforderungen der digitalen Welt gerecht zu werden. So sind Sie für zukünftige Herausforderungen bestens vorbereitet.",
        },
        {
          title: "Technische Fehlerbehebungen",
          description:
            "Wir lösen Ihre technischen Probleme schnell und effizient, damit Sie sich wieder auf das Wesentliche konzentrieren können.",
        },
        {
          title: "Unterstützung bei Drucker- und Handyeinrichtungen",
          description:
            "Einrichtung neuer Drucker und Konfiguration von Smartphones mit fachkundiger Hilfe.",
        },
        {
          title: "Umfassender Support",
          description:
            "Unterstützung für Windows, Mac OS und Linux – wir sind mit allen gängigen Betriebssystemen vertraut.",
        },
        {
          title: "Datenmanagement und -sicherung",
          description:
            "Sichere Speicherung und effiziente Verwaltung Ihrer Daten für jederzeitigen Zugriff.",
        },
        {
          title: "Schnelle Reaktionszeiten",
          description: "Unser Team hilft Ihnen innerhalb kürzester Zeit.",
        },
        {
          title: "Beratung und Schulung",
          description:
            "Schulungen, damit Sie Ihre Geräte optimal nutzen und schützen.",
        },
      ],
      categories: {
        networkConfiguration: {
          title: "Netzwerkkonfiguration",
          route: "/services/netzwerk",
          subcategories: [
            {
              id: "wlan-router",
              title: "WLAN Router Einrichtung",
              route: "/services/netzwerk/wlan-router",
              description:
                "Professionelle Einrichtung und Konfiguration Ihres WLAN-Routers für optimale Leistung und Sicherheit.",
              icon: "WifiHigh",
            },
            {
              id: "mesh",
              title: "Mesh Installation",
              route: "/services/netzwerk/mesh",
              description:
                "Installation eines Mesh-WLAN-Systems für nahtlose Netzabdeckung in Ihrem gesamten Zuhause oder Büro.",
              icon: "Graph",
            },
            {
              id: "lan-verlegung",
              title: "LAN-Verlegung",
              route: "/services/netzwerk/lan-verlegung",
              description:
                "Professionelle Verlegung von Netzwerkkabeln für stabile und schnelle Internetverbindungen.",
              icon: "Cable",
            },
            {
              id: "access-point",
              title: "Access Point Installation",
              route: "/services/netzwerk/access-point",
              description:
                "Installation und Konfiguration von Access Points für erweiterte WLAN-Abdeckung.",
              icon: "Broadcast",
            },
            {
              id: "powerline",
              title: "Powerline Einrichten",
              route: "/services/netzwerk/powerline",
              description:
                "Einrichtung von Powerline-Adaptern für Internet über die Stromleitung.",
              icon: "Lightning",
            },
            {
              id: "wlan-probleme",
              title: "WLAN & Internet Probleme",
              route: "/services/netzwerk/wlan-probleme",
              description:
                "Diagnose und Lösung von WLAN- und Internetverbindungsproblemen.",
              icon: "Warning",
            },
          ],
        },
        deviceSetup: {
          title: "Geräte Einrichten",
          route: "/services/geraete",
          subcategories: [
            {
              id: "computer-setup",
              title: "Computer & Laptop Einrichten Lassen",
              route: "/services/geraete/computer-setup",
              description:
                "Vollständige Einrichtung Ihres neuen Computers oder Laptops mit allen wichtigen Programmen und Einstellungen.",
              icon: "Desktop",
            },
            {
              id: "driver-installation",
              title: "Treiber & Software Installation",
              route: "/services/geraete/treiber-installation",
              description:
                "Installation und Aktualisierung von Treibern und Software für optimale Geräteleistung.",
              icon: "Download",
            },
            {
              id: "performance-optimization",
              title: "PC Beschleunigen & Performance Optimierung",
              route: "/services/geraete/performance-optimierung",
              description:
                "Optimierung Ihres PCs für bessere Geschwindigkeit und Leistung.",
              icon: "Lightning",
            },
            {
              id: "printer-installation",
              title: "Drucker Installation",
              route: "/services/geraete/drucker-installation",
              description:
                "Professionelle Installation und Konfiguration Ihres Druckers im Netzwerk.",
              icon: "Printer",
            },
            {
              id: "mobile-device-setup",
              title: "Handy und Tablet Einrichtung",
              route: "/services/geraete/handy-tablet",
              description:
                "Einrichtung und Konfiguration Ihrer mobilen Geräte mit Apps und Konten.",
              icon: "DeviceMobile",
            },
          ],
        },
        standalone: [
          {
            id: "pc-repair",
            title: "PC Reparatur & Hardware Upgrades",
            route: "/services/pc-reparatur",
            description:
              "Professionelle PC-Reparatur und Hardware-Upgrades für bessere Leistung.",
            icon: "Wrench",
          },
          {
            id: "backup-service",
            title: "Backup Service",
            route: "/services/backup-service",
            description:
              "Sichere Datensicherung und Wiederherstellung für Ihre wichtigen Daten.",
            icon: "CloudArrowUp",
          },
          {
            id: "business-automation",
            title: "Automatisierung Geschäftsprozesse",
            route: "/services/business-automation",
            description:
              "Automatisierung Ihrer Geschäftsprozesse für mehr Effizienz und Produktivität.",
            icon: "Lightning",
          },
        ],
      },
      pricing: {
        plans: [
          {
            name: "Einsteiger",
            price: "30 € / 30 Minuten",
            idealFor:
              "Gezielte Unterstützung für kleinere technische Aufgaben.",
            features: [
              "Einrichtung von Druckern und mobilen Geräten",
              "Netzwerkkonfiguration und -optimierung",
              "Grundlegende Fehlerbehebungen",
              "Unterstützung bei Windows, Mac OS und Linux",
              "Freundlicher E-Mail-Support",
            ],
            cta: "https://studentenathome.de/service#",
          },
          {
            name: "Premium",
            price: "Preis auf Anfrage",
            idealFor:
              "Umfassender Support und maßgeschneiderte Lösungen für Unternehmen oder komplexe Projekte.",
            features: [
              "Individuelle technische Lösungen für Ihre Geräte",
              "Umfassende Schulungen und persönliche Beratung",
              "Erweiterter Support für komplexe Systeme",
              "Vor-Ort-Service und flexible Anfahrtszeiten",
            ],
            cta: "https://studentenathome.de/service#",
          },
        ],
      },
    },
    about: {
      sections: [
        {
          title: "Wer wir sind",
          content: [
            "Unser Team besteht aus motivierten und freundlichen Informatikstudenten aus Berlin, die nicht nur technische Probleme lösen, sondern auch ein offenes Ohr für Ihre Fragen haben.",
            "StudentenAtHome wurde aus der Idee heraus geboren, Technik-Support für alle zugänglich und verständlich zu machen.",
            "Seit unserer Gründung haben wir zahlreiche Kunden in Berlin und Umgebung – Potsdam, Spandau, Köpenick und ganz Brandenburg – unterstützt und dabei geholfen, ihre technischen Herausforderungen zu meistern.",
            "Durch unsere flexible und individuelle Herangehensweise haben wir uns einen Namen als zuverlässiger Partner für Tech-Support in Berlin gemacht.",
          ],
        },
        {
          title: "Unsere Mission",
          content: [
            "Beste technische Lösungen direkt zu Ihnen nach Hause.",
            "Team aus engagierten Informatik-Studenten mit neuestem Wissen und Leidenschaft für Support.",
            "Technik soll für jeden zugänglich sein.",
          ],
          values: [
            {
              title: "Zuverlässigkeit",
              description:
                "Schnelle und zuverlässige Lösungen, wenn Sie uns brauchen.",
            },
            {
              title: "Kompetenz",
              description:
                "Bestens ausgebildete Studenten, stets auf dem neuesten Stand.",
            },
            {
              title: "Empathie",
              description: "Hilfe ohne Fachjargon und auf Augenhöhe.",
            },
          ],
        },
        {
          title: "Werde Teil unseres Teams",
          content: [
            "Suche nach motivierten Studenten mit Freude am Umgang mit Menschen und tiefem Fachwissen.",
          ],
          benefits: [
            "Flexible Arbeitszeiten",
            "Remote-Arbeit möglich",
            "Programme zur Gesundheitsförderung",
            "Attraktive Vergütung",
          ],
          cta: "https://studentenathome.de/job",
        },
      ],
    },
    contact: {
      title: "Support, mit dem Sie gewinnen",
      howItWorks: [
        "Telefonisch, per E‑Mail oder über das Online‑Formular schildern Sie uns Ihr Problem.",
        "Sie erhalten eine Einschätzung des Leistungsumfangs und einen Terminvorschlag.",
        "Lehnen Sie sich zurück, während wir Ihr Problem beheben.",
      ],
      ctaIntro:
        "Kontaktieren Sie uns – schildern Sie kurz Ihr Problem, wir melden uns mit einem Lösungsvorschlag.",
      details: {
        businessName: "StudentenAtHome",
        address: "Peter-Vischer-Straße 8",
        postalCode: "12157",
        city: "Berlin",
        fullAddress: "Peter-Vischer-Straße 8, 12157 Berlin",
        region: "Berlin",
        country: "Deutschland",
        telephone: "+49 179 4104323",
        telephoneDisplay: "0179 4104323",
        telephoneLink: "tel:+491794104323",
        email: "support@studentenathome.de",
        emailLink: "mailto:support@studentenathome.de",
        coordinates: {
          latitude: 52.52,
          longitude: 13.405,
        },
        openingHours: {
          weekdays: "Mo-Fr 09:00-18:00",
          saturday: "Sa 10:00-14:00",
          sunday: "So geschlossen",
        },
        serviceAreas: [
          "Berlin",
          "Potsdam",
          "Spandau",
          "Köpenick",
          "Charlottenburg",
          "Prenzlauer Berg",
          "Kreuzberg",
          "Brandenburg",
        ],
      },
      form: {
        fields: [
          { name: "Vorname", type: "text", id: "firstName" },
          { name: "Nachname", type: "text", id: "lastName" },
          { name: "E‑Mail", type: "email", id: "email" },
          { name: "Telefonnummer", type: "tel", id: "phoneNumber" },
          { name: "Nachricht", type: "textarea", id: "message" },
        ],
        submit: "Nachricht senden",
      },
    },
  },
  search: {
    placeholders: [{ inputId: "search", placeholder: "Suche" }],
  },
};
