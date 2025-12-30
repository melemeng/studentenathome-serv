# 🛡️ StudentenAtHome - Security Platform

Tech-Support Service Platform für Dresden mit umfassenden Sicherheitsfeatures.

## 🚀 Features

- ✅ **User Authentication** - Registrierung, Login, Email-Verifizierung
- ✅ **Password Reset** - Sichere Passwort-Wiederherstellung mit Token
- ✅ **CSRF Protection** - Token-basierter Schutz gegen Cross-Site Attacks
- ✅ **Rate Limiting** - User-based & IP-based Limits
- ✅ **IP Blocking** - Automatisches Blocking bei verdächtigem Verhalten
- ✅ **File Upload Security** - Image validation mit Magic Numbers
- ✅ **Advanced Logging** - Winston-based 4-Transport System
- ✅ **Audit Logging** - Vollständige User-Activity Logs
- ✅ **Blog System** - Admin-managed Blog mit Approval Workflow
- ✅ **Contact Form** - Mit Email-Benachrichtigungen

## 📋 Voraussetzungen

- Node.js >= 18.0.0
- PostgreSQL Database (empfohlen: Supabase)
- Email-Server (IONOS, Gmail, etc.)

## 🔧 Installation

### 1. Repository klonen

```bash
git clone https://github.com/georgi/studentenathome-serv.git
cd studentenathome-serv
npm install
```

### 2. Environment Variables konfigurieren

Kopiere `.env.example` zu `.env` und setze deine Credentials:

```bash
cp .env.example .env
nano .env  # Oder dein bevorzugter Editor
```

**KRITISCH**: Verwende NIEMALS die Werte aus `.env.example` in Production!

### 3. Erforderliche Environment Variables

**Email Configuration:**

```bash
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=dein-ionos-email-passwort
```

**Application Configuration:**

```bash
CANONICAL_BASE_URL=https://studentenathome.de
NODE_ENV=production
```

**Security Secrets (GENERIERE NEUE!):**

```bash
# ADMIN_TOKEN: 64+ Zeichen, kryptographisch zufällig
# Generieren: openssl rand -hex 32
ADMIN_TOKEN=generiere-mit-openssl-rand-hex-32

# JWT_SECRET: 128+ Zeichen, kryptographisch zufällig
# Generieren: openssl rand -hex 64
JWT_SECRET=generiere-mit-openssl-rand-hex-64
```

**Database Configuration:**

```bash
# Supabase Connection String:
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres

# Oder standard PostgreSQL:
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Secrets sicher generieren:**

```bash
# ADMIN_TOKEN (64 Zeichen)
openssl rand -hex 32

# JWT_SECRET (128 Zeichen)
openssl rand -hex 64
```

### 4. Database Schema initialisieren

Führe das SQL Schema aus (siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für vollständiges Schema):

```bash
# Verbinde zu deiner Datenbank und führe aus:
# server/database/schema.sql (falls vorhanden)
# Oder nutze Supabase SQL Editor
```

### 5. Development Server starten

```bash
# Frontend (Vite)
npm run dev

# Backend (Express)
npm run start:server

# In separaten Terminals für beide
```

Frontend läuft auf: `http://localhost:5173`  
Backend läuft auf: `http://localhost:5000`

## 📚 Dokumentation

- **[SECURITY_FEATURES.md](./SECURITY_FEATURES.md)** - Vollständige Security-Dokumentation (10 Features)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production Deployment Guide
- **[PRE_RELEASE_CHECKLIST.md](./PRE_RELEASE_CHECKLIST.md)** - Checkliste vor Public Release
- **[PRD.md](./PRD.md)** - Product Requirements Document

## 🔐 Sicherheit

Dieses Projekt implementiert umfassende Sicherheitsfeatures:

- **Authentication**: bcrypt password hashing, email verification
- **CSRF Protection**: Token-based mit Double Submit Cookie Pattern
- **Rate Limiting**: User-based (5 req/min) & global (100 req/15min)
- **IP Blocking**: Automatisch bei verdächtigem Verhalten
- **File Upload**: Magic number validation, size limits, image metadata check
- **Logging**: Winston mit 4 Transports (app, error, security, combined)
- **Audit Log**: Alle User-Actions in PostgreSQL

**Siehe [SECURITY_FEATURES.md](./SECURITY_FEATURES.md) für Details.**

## 🧪 Testing

```bash
# Dependencies auf Vulnerabilities prüfen
npm audit

# Kritische Issues fixen
npm audit fix

# Development Build testen
npm run build
npm run preview
```

## 📊 Logs

```bash
# Logs anzeigen
npm run logs:view

# Logs in Echtzeit verfolgen
npm run logs:tail

# Nach Errors filtern
npm run logs:view error

# Logs rotieren (manuell)
npm run logs:rotate
```

## 🚀 Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Deployment Optionen

**Option A: Vercel (Empfohlen)**

```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option B: Railway**

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**Option C: VPS mit Nginx**  
Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für vollständige Anleitung.

### Setting up GitHub Pages (Frontend)

1. Go to your repository settings on GitHub
2. Navigate to **Pages** in the sidebar
3. Under **Build and deployment**, select:
   - **Source**: GitHub Actions
4. The workflow will automatically deploy your site when you push to the `main` branch

Your site will be available at: `https://georgi.github.io/studentenathome-serv/`

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the **Actions** tab in your repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## ⚠️ Vor dem Public Release

**UNBEDINGT lesen: [PRE_RELEASE_CHECKLIST.md](./PRE_RELEASE_CHECKLIST.md)**

Kritische Punkte:

- [ ] `.env` Datei ist NICHT committed (nur `.env.example`)
- [ ] Alle Secrets in `.env.example` sind Platzhalter
- [ ] Git History enthält keine echten Credentials
- [ ] Neue Production Secrets sind generiert
- [ ] `npm audit` ohne kritische Issues
- [ ] logs/ und uploads/ Ordner sind in `.gitignore`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Security-relevante Changes**: Siehe [SECURITY_FEATURES.md](./SECURITY_FEATURES.md) und teste ausgiebig!

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 📞 Support

- **Email**: support@studentenathome.de
- **Telefon**: +49 176 75444136
- **Adresse**: Klingestraße 13C, 01159 Dresden

## 🙏 Credits

Built with:

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Radix UI
- Express.js
- PostgreSQL
- Supabase
- Winston Logger
- GitHub Spark

---

**Status**: 🔒 Production-Ready mit umfassenden Security Features  
**Version**: 1.0.0  
**Last Updated**: December 2024
