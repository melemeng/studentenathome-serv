# PostgreSQL Migration Guide

## Voraussetzungen

1. **PostgreSQL installiert** (lokal oder Cloud-Service wie Heroku, Supabase, Railway)
2. **`pg` npm-Paket installiert:**
   ```bash
   npm install pg
   ```

## Schritt 1: PostgreSQL einrichten

### Option A: Lokale Installation (Ubuntu/Debian)

```bash
# PostgreSQL installieren
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL starten
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Datenbank erstellen
sudo -u postgres psql
CREATE DATABASE studentenathome;
CREATE USER studentenathome_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE studentenathome TO studentenathome_user;
\q
```

### Option B: Cloud-Service (Empfohlen für Produktion)

**Supabase (Kostenlos):**

1. Gehe zu https://supabase.com
2. Erstelle ein neues Projekt
3. Kopiere die Connection-String von Settings → Database

**Railway (Einfach):**

1. Gehe zu https://railway.app
2. Erstelle neues Projekt → Add PostgreSQL
3. Kopiere die Verbindungsdaten

## Schritt 2: .env konfigurieren

Aktualisiere die `.env`-Datei:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost                # Oder Cloud-Host
DB_PORT=5432
DB_NAME=studentenathome
DB_USER=postgres                 # Dein DB-User
DB_PASSWORD=your_secure_password # Sicheres Passwort!
```

**Für Cloud-Services (z.B. Supabase):**

```env
DB_HOST=db.xyz.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
```

## Schritt 3: Migration ausführen

```bash
npm run migrate
```

Das Script macht folgendes:

1. ✅ Verbindung zur Datenbank herstellen
2. ✅ Tabellen erstellen (`users`, `posts`)
3. ✅ Indizes für Performance anlegen
4. ✅ Daten aus `users.json` importieren
5. ✅ Daten aus `posts.json` importieren
6. ✅ Migration verifizieren

## Erwartete Ausgabe:

```
🚀 Starting database migration...

✅ Database connection successful

📋 Creating database schema...
✅ Schema created successfully

👥 Migrating users...
  ✓ Migrated user: admin@studentenathome.de
  ✓ Migrated user: support@studentenathome.de
✅ Users migration complete: 2 success, 0 errors

📝 Migrating posts...
  ✓ Migrated post: Erste Hilfe bei Computerabstürzen
✅ Posts migration complete: 1 success, 0 errors

🔍 Verifying migration...
  Users in database: 2
  Posts in database: 1
  Admin users: admin@studentenathome.de, support@studentenathome.de
  Post statuses:
    approved: 1

✅ Migration completed successfully!
```

## Schritt 4: Backend auf Datenbank umstellen

Nach erfolgreicher Migration wird der Server automatisch die Datenbank nutzen statt JSON-Dateien.

## Troubleshooting

### Fehler: "Connection refused"

- PostgreSQL läuft nicht → `sudo systemctl start postgresql`
- Falscher Host/Port in `.env`

### Fehler: "Authentication failed"

- Passwort falsch → Prüfe `.env`
- User existiert nicht → Erstelle User in PostgreSQL

### Fehler: "Database does not exist"

```bash
sudo -u postgres psql
CREATE DATABASE studentenathome;
\q
```

## Sicherheit

⚠️ **WICHTIG:**

- `.env` ist in `.gitignore` (nicht committen!)
- Verwende starke Passwörter für Produktion
- Aktiviere SSL für Cloud-Datenbanken

## Nächste Schritte

Nach der Migration:

1. Server neu starten: `npm run start:server`
2. Testen: Login, Blog-Posts, Admin-Panel
3. JSON-Backups behalten (in `server/data/`)
