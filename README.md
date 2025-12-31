# StudentenAtHome

Tech-Support Service für Dresden – Professionelle Hilfe bei Computer- und IT-Problemen.

## Über das Projekt

StudentenAtHome ist eine moderne Marketing-Website für einen Tech-Support Service in Dresden. Die Plattform bietet Informationen über IT-Dienstleistungen, Preise, ein Blog-System und eine Kontaktmöglichkeit für Kunden.

## Technologie-Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI
- **Backend**: Express.js, PostgreSQL
- **Animation**: Framer Motion
- **Deployment**: GitHub Pages

## Schnellstart

### Voraussetzungen

- Node.js >= 18.0.0
- PostgreSQL Database
- Email-Server für Kontaktformular

### Installation

```bash
# Repository klonen
git clone https://github.com/melemeng/studentenathome-serv.git
cd studentenathome-serv

# Dependencies installieren
npm install

# Environment-Konfiguration
cp .env.example .env
# Bearbeite .env mit deinen Credentials
```

### Development

```bash
# Frontend starten (Port 5173)
npm run dev

# Backend starten (Port 5000)
npm run start:server
```

## Dokumentation

Detaillierte Dokumentation zu spezifischen Themen:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment-Anleitung (Vercel, Railway, GitHub Pages)
- **[SECURITY_FEATURES.md](./SECURITY_FEATURES.md)** - Sicherheitsfeatures und Best Practices
- **[PRE_RELEASE_CHECKLIST.md](./PRE_RELEASE_CHECKLIST.md)** - Pre-Release Checkliste
- **[BLOG_WORKFLOW.md](./BLOG_WORKFLOW.md)** - Blog-System Dokumentation
- **[PRD.md](./PRD.md)** - Product Requirements Document

## Lizenz

MIT License - siehe [LICENSE](./LICENSE) für Details.

## Kontakt

- **Website**: https://studentenathome.de
- **Email**: support@studentenathome.de
- **Telefon**: +49 176 75444136
- **Adresse**: Klingestraße 13C, 01159 Dresden
