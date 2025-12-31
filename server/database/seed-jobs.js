import dotenv from "dotenv";
dotenv.config();

import { jobQueries } from "./db.js";

// Job listings from the frontend
const jobListings = [
  {
    title: "Junior Tech Support Specialist",
    type: "Vollzeit / Teilzeit",
    location: "Berlin / Deutschlandweit / Remote",
    description:
      "Wir suchen engagierte Informatikstudenten und Absolventen, die unseren Kunden helfen möchten. Bieten Sie technische Unterstützung vor Ort und remote an, lösen Sie Probleme und unterstützen Sie private und geschäftliche Kunden.",
    requirements: [
      "Laufendes Informatik-Studium oder abgeschlossenes Studium",
      "Grundkenntnisse in Windows, macOS oder Linux",
      "Fähigkeit, komplexe Konzepte einfach zu erklären",
      "Zuverlässigkeit und Freundlichkeit",
      "Bereitschaft zu flexiblen Arbeitszeiten",
    ],
    benefits: [
      "Flexible Arbeitszeiten – ideal zum Vereinbaren mit dem Studium",
      "Erwerben Sie praktische Erfahrung im Tech-Support",
      "Nettes und engagiertes Team",
      "Direkte Kundeninteraktion und Kundenfeedback",
      "Möglichkeiten zur Weiterbildung",
    ],
    status: "active",
    is_published: true,
  },
  {
    title: "Netzwerk-Administrator / Konfigurateur",
    type: "Vollzeit / Teilzeit",
    location: "Berlin / Deutschlandweit / Remote",
    description:
      "Gesucht: Studenten mit Fachwissen in Netzwerktechnik und Systemkonfiguration. Sie bauen Netzwerke auf, konfigurieren diese und stellen sicher, dass unsere Kunden optimal vernetzt sind.",
    requirements: [
      "Fortgeschrittene Kenntnisse in Netzwerktechnik (TCP/IP, DHCP, DNS)",
      "Erfahrung mit Routern, Switches und Firewalls",
      "Vertrautheit mit Windows Server oder Linux",
      "Verständnis für Netzwerksicherheit",
      "Problem-Lösungsfähigkeit und Geduld",
    ],
    benefits: [
      "Spezialisierte Tätigkeit mit höherem Lernpotenzial",
      "Hands-on Erfahrung mit modernen Netzwerkgeräten",
      "Mentoring durch erfahrene Profis",
      "Zertifizierungsmöglichkeiten",
      "Gutes Gehalt mit Erfahrungszuschlag",
    ],
    status: "active",
    is_published: true,
  },
  {
    title: "IT-Support Trainer / Schulung",
    type: "Teilzeit",
    location: "Berlin / Deutschlandweit / Remote",
    description:
      "Du hast Freude daran, andere auszubilden? Wir suchen jemanden, der unsere Support-Mitarbeiter schulen und trainieren kann sowie Kunden in ihren Geräten unterweisen kann.",
    requirements: [
      "Umfassende Kenntnisse in mindestens zwei Betriebssystemen",
      "Erfahrung in Schulung oder Weitergabe von Wissen",
      "Pädagogische Fähigkeiten und Geduld",
      "Vertrautheit mit Schulungsmaterialien und -methoden",
      "Kommunikationsstärke",
    ],
    benefits: [
      "Sinnvolle Tätigkeit – echte Wissensvermittlung",
      "Flexible Stundensätze",
      "Kreative Freiheit in der Unterrichtsvorbereitung",
      "Netzwerkaufbau mit verschiedenen Studenten",
      "Portfolio-Erweiterung für späteren Karriereschritt",
    ],
    status: "active",
    is_published: true,
  },
  {
    title: "Web Developer / Frontend-Spezialist",
    type: "Teilzeit",
    location: "Hybrid / Remote",
    description:
      "Unterstütze uns bei der Weiterentwicklung unserer Webpräsenz. Du wirst React-Anwendungen entwickeln, das UI/UX verbessern und neue Features implementieren.",
    requirements: [
      "Gute Kenntnisse in JavaScript/TypeScript und React",
      "Vertrautheit mit Tailwind CSS oder ähnlichen Frameworks",
      "Grundverständnis von Responsive Design",
      "Git und Versionskontrolle",
      "Lust zu lernen und Verbesserungsvorschläge einzubringen",
    ],
    benefits: [
      "Vollständig remote oder hybrid möglich",
      "Moderne Technologie-Stack",
      "Kreative Arbeit an echter Anwendung",
      "Mentoring durch Senior Developer",
      "Flexible Arbeitszeiten",
    ],
    status: "active",
    is_published: true,
  },
  {
    title: "Kundenbetreuung / Support-Koordinator",
    type: "Vollzeit / Teilzeit",
    location: "Berlin / Deutschlandweit / Remote",
    description:
      "Du bist kommunikativ und organisiert? Verwalte Kundenanfragen, koordiniere Support-Einsätze, terminiere Termine und stelle sicher, dass unsere Kunden zufrieden sind.",
    requirements: [
      "Ausgezeichnete Kommunikationsfähigkeiten",
      "Organisationstalent und Zeitmanagement",
      "Freundlichkeit und Geduld mit Kunden",
      "Grundkenntnisse in Office-Anwendungen",
      "Deutschfließend (für Kundengespräche)",
    ],
    benefits: [
      "Kundeninteraktion und Beziehungsaufbau",
      "Flexibles Arbeitsumfeld",
      "Einstiegsfreundlich – weniger technische Voraussetzungen",
      "Schulung in unserem Support-Prozess",
      "Aufstiegspotenzial",
    ],
    status: "active",
    is_published: true,
  },
];

async function seedJobs() {
  console.log("🌱 Seeding jobs table...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const job of jobListings) {
    try {
      const newJob = await jobQueries.create(job);
      successCount++;
      console.log(`  ✓ Created job: ${newJob.title}`);
    } catch (error) {
      errorCount++;
      console.error(`  ✗ Failed to create job ${job.title}:`, error.message);
    }
  }

  console.log(
    `\n✅ Jobs seeding complete: ${successCount} success, ${errorCount} errors`
  );
}

// Run seeding
seedJobs()
  .then(() => {
    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
