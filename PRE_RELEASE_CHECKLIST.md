# 🚀 Pre-Release Security Checklist

**WICHTIG**: Arbeite diese Checkliste VOLLSTÄNDIG ab, bevor du das Repository public machst!

## ✅ 1. Secrets & Credentials

### Environment Variables (.env)

- [ ] `.env` Datei ist NICHT im Repository (nur `.env.example`)
- [ ] `.env` ist in `.gitignore` eingetragen
- [ ] Alle Werte in `.env.example` sind Platzhalter (keine echten Credentials!)

### Zu überprüfende Secrets:

```bash
# Überprüfe, dass diese NICHT im Code sind:
grep -r "ADMIN_TOKEN=" --exclude-dir=node_modules .
grep -r "JWT_SECRET=" --exclude-dir=node_modules .
grep -r "SMTP_PASS=" --exclude-dir=node_modules .
grep -r "DATABASE_URL=" --exclude-dir=node_modules .
```

**Status**:

- ✅ `.env.example` bereinigt (ADMIN_TOKEN durch Platzhalter ersetzt)
- ✅ `.env` ist in `.gitignore`
- ⚠️ **ABER**: Wenn du bereits einen echten ADMIN_TOKEN in einer früheren Version committet hast, ist er in der Git-History!

## ⚠️ 2. Git History Check (KRITISCH!)

Wenn du bereits commits mit echten Secrets gemacht hast:

```bash
# Zeige alle .env.example Änderungen in der History
git log -p -- .env.example

# Suche nach sensiblen Strings in der gesamten History
git log -S "ADMIN_TOKEN" -p
git log -S "SMTP_PASS" -p
```

### Falls Secrets in History gefunden:

**Option A - Neues Repository (EMPFOHLEN für sauberen Start):**

```bash
# 1. Sichere deine Arbeit
cp -r /workspaces/studentenathome-serv /tmp/backup

# 2. Lösche Git-History
rm -rf .git

# 3. Initialisiere neu
git init
git add .
git commit -m "Initial commit - StudentenAtHome Security Platform"

# 4. Push zu neuem Repository
git remote add origin git@github.com:username/studentenathome-serv.git
git branch -M main
git push -u origin main
```

**Option B - History bereinigen (kompliziert):**

```bash
# BFG Repo-Cleaner verwenden
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

## ✅ 3. File & Directory Exclusions

### .gitignore überprüfen:

- [x] `.env` eingetragen
- [x] `logs/` Ordner ausgeschlossen
- [x] `uploads/` Ordner ausgeschlossen
- [x] `node_modules/` ausgeschlossen
- [x] Bild-Dateien (`*.jpg`, `*.png`, etc.)

### Aktuelle vertrackene Files:

```bash
# Prüfe ob ungewollte Dateien committed sind:
git ls-files | grep -E "(\.env$|uploads/|logs/|\.log$)"
```

**Falls gefunden:**

```bash
# Entferne sie aus Git (aber behalte lokal):
git rm --cached uploads/*
git rm --cached logs/*
git commit -m "Remove sensitive files from tracking"
```

## ✅ 4. Database Security

### Supabase/PostgreSQL:

- [ ] `DATABASE_URL` ist NUR in `.env` (nicht in Code)
- [ ] Supabase RLS (Row Level Security) ist aktiviert
- [ ] Database Backups sind konfiguriert
- [ ] Connection Pool Limits sind gesetzt (siehe `server/database/db.js`)

### SQL Schema überprüfen:

- [ ] Keine Standard-Passwörter in seed files
- [ ] Keine Test-User mit bekannten Credentials

## ✅ 5. Production Configuration

### server/index.js:

- [x] Fallback-Werte sind sicher:
  ```javascript
  ADMIN_TOKEN = process.env.ADMIN_TOKEN || "demo-token"; // ⚠️ "demo-token" als Fallback
  JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex"); // ✅ Random
  ```

**WICHTIG**: In Production MÜSSEN diese Env-Vars gesetzt sein! Der "demo-token" Fallback ist nur für Dev!

### CORS Configuration:

```javascript
cors({
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://studentenathome.de", "https://www.studentenathome.de"]
      : ["http://localhost:5173", "http://localhost:5000"],
  credentials: true,
});
```

- [ ] Production-URLs sind korrekt
- [ ] Keine Wildcards (`*`) in Production

## ✅ 6. README & Dokumentation

Erstelle/aktualisiere diese Dateien:

### README.md sollte enthalten:

- [ ] Project Overview
- [ ] **Environment Variables** Sektion mit allen erforderlichen Vars
- [ ] Installation Instructions
- [ ] Development Setup
- [ ] Production Deployment Guide
- [ ] **Security Notice** - Hinweis auf SECURITY_FEATURES.md

### Neue Dateien:

- [x] `SECURITY_FEATURES.md` - Vollständige Security-Dokumentation
- [ ] `DEPLOYMENT.md` - Production Deployment Guide
- [ ] `CONTRIBUTING.md` - Contribution Guidelines mit Security-Hinweisen

## ✅ 7. Code Quality & Security

### Dependencies:

```bash
# Prüfe auf bekannte Vulnerabilities:
npm audit

# Falls kritische Issues:
npm audit fix
```

### Code Review:

- [ ] Keine `console.log()` mit sensiblen Daten
- [ ] Keine Debug-Ausgaben in Production
- [ ] Error Messages enthalten keine Stack Traces in Production

### Security Headers:

- [x] Helmet.js ist aktiviert
- [x] HTTPS Redirect ist konfiguriert
- [x] CSP (Content Security Policy) ist vorbereitet

## ✅ 8. Testing

### Vor dem Release testen:

```bash
# 1. Development Mode
npm run dev
npm run start:server

# 2. Production Build
npm run build
npm start

# 3. Security Tests
npm run test:security  # Falls vorhanden
```

### Manuelle Tests:

- [ ] Login/Registration funktioniert
- [ ] CSRF-Protection greift
- [ ] Rate Limiting funktioniert
- [ ] IP-Blocking funktioniert
- [ ] File-Upload validiert korrekt
- [ ] Logging schreibt in Files

## ✅ 9. Deployment Preparation

### Hosting Provider konfigurieren:

- [ ] Environment Variables sind gesetzt
- [ ] Node Version ist kompatibel (>= 18.0.0)
- [ ] SSL/HTTPS ist aktiviert
- [ ] Firewall Rules sind konfiguriert

### Monitoring Setup:

- [ ] Log Rotation ist aktiviert (Cron Job)
- [ ] Error Alerting ist konfiguriert
- [ ] Uptime Monitoring ist aktiv
- [ ] Database Backups sind automatisiert

## ✅ 10. Final Checks vor `git push`

```bash
# 1. Git Status clean
git status

# 2. Keine ungewollten Files
git ls-files

# 3. Letzte Suche nach Secrets
grep -r "password\|secret\|token" .env.example

# 4. .env existiert NICHT im Repository
ls -la | grep "\.env$"  # Sollte nur .env.example zeigen

# 5. Commit Message ist sinnvoll
git log -1 --oneline
```

## 🚀 Release Command

**NUR wenn ALLE Punkte abgehakt sind:**

```bash
# 1. Final Commit
git add .
git commit -m "Security: Prepare for public release - remove all secrets"

# 2. Push to GitHub
git push origin main

# 3. Repository auf Public stellen (GitHub Web UI)
# Settings → Danger Zone → Change visibility → Make public

# 4. Sofort Environment Variables in Production setzen!
# Bei deinem Hosting Provider (z.B. Vercel, Heroku, Railway)
```

---

## 🚨 **NACH dem Public Release:**

### Sofort erledigen:

1. **Neue Secrets generieren** (weil alte möglicherweise in History):

   ```bash
   # Neuer ADMIN_TOKEN
   openssl rand -hex 32

   # Neues JWT_SECRET
   openssl rand -hex 64
   ```

2. **Production Environment Variables setzen** mit den NEUEN Werten

3. **Security Monitoring aktivieren**:

   - GitHub Security Alerts aktivieren
   - Dependabot aktivieren
   - Code Scanning (optional)

4. **README.md Badge hinzufügen**:
   ```markdown
   ![Security](https://img.shields.io/badge/security-enabled-brightgreen)
   ![License](https://img.shields.io/badge/license-MIT-blue)
   ```

---

## 📞 **Weitere Hilfe:**

- Supabase Security: https://supabase.com/docs/guides/auth
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/

---

**Status**: ⚠️ **WARTE** - Git History muss überprüft werden!
**Estimated Time**: 30-60 Minuten für vollständige Durchführung
**Priority**: 🔴 KRITISCH - Nicht überspringen!
