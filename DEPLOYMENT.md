# StudentenAtHome - Deployment Guide

## 🏗️ Architektur Overview

### Development

- **Frontend**: `http://localhost:5173` (Vite Dev Server)
- **Backend**: `http://localhost:5000` (Express Server)
- **Database**: `localhost:5432` (PostgreSQL Docker)
- **Proxy**: Vite proxied `/api/*` requests → Backend

### Production (studentenathome.de)

- **Frontend**: Static build in `dist/` (served by Nginx/Apache)
- **Backend**: Express auf Port 5000 (hinter Reverse Proxy)
- **Database**: PostgreSQL (Docker oder Cloud)
- **Domain**: Alles unter `https://studentenathome.de`

## 📦 Production Deployment Steps

### 1. Build Frontend

```bash
npm run build
```

Output: `dist/` folder mit optimierten Static Files

### 2. Backend Environment Variables

Erstelle `.env.production`:

```env
NODE_ENV=production
PORT=5000

# Domain Configuration
CANONICAL_BASE_URL=https://studentenathome.de

# PostgreSQL (Production)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# SMTP (IONOS)
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=your_password

# Security
ADMIN_TOKEN=your_secure_random_token_here
JWT_SECRET=your_64_char_hex_secret_here
```

### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name studentenathome.de www.studentenathome.de;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name studentenathome.de www.studentenathome.de;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/studentenathome.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/studentenathome.de/privkey.pem;

    # Frontend Static Files
    root /var/www/studentenathome.de/dist;
    index index.html;

    # SPA Routing - alle requests zu index.html wenn file nicht existiert
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Sitemap & Robots
    location ~ ^/(sitemap\.xml|robots\.txt)$ {
        proxy_pass http://localhost:5000;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 4. Start Backend mit PM2

```bash
npm install -g pm2

# Start Backend
pm2 start server/index.js --name studentenathome-api

# Auto-restart on server reboot
pm2 startup
pm2 save

# View logs
pm2 logs studentenathome-api
```

### 5. Database Setup (Production)

**Option A: Docker (Empfohlen)**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Option B: Cloud PostgreSQL**

- Railway.app
- Neon.tech
- Supabase (mit IPv4 fix)

### 6. SSL Certificates (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d studentenathome.de -d www.studentenathome.de
```

### 7. Firewall Configuration

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build

      - name: Deploy to server
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: "dist/,server/,package.json"
          target: "/var/www/studentenathome.de"

      - name: Restart backend
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/studentenathome.de
            npm install --production
            pm2 restart studentenathome-api
```

## 🧪 Testing Production Build Locally

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
# Öffne: http://localhost:4173

# Start backend
npm run start:server
# Backend: http://localhost:5000
```

## 📊 Monitoring

### Health Check Endpoint

Füge zu `server/index.js` hinzu:

```javascript
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### PM2 Monitoring

```bash
pm2 monit
```

## 🔒 Security Checklist

- [ ] HTTPS aktiviert (Let's Encrypt)
- [ ] Firewall konfiguriert (UFW)
- [ ] Environment Variables gesichert
- [ ] JWT_SECRET ist stark und zufällig
- [ ] ADMIN_TOKEN ist stark und zufällig
- [ ] PostgreSQL Passwort ist sicher
- [ ] Rate Limiting aktiviert
- [ ] CORS richtig konfiguriert
- [ ] Security Headers gesetzt
- [ ] Database Backups automatisiert

## 📝 Maintenance

### Database Backup

```bash
# Manual Backup
docker exec studentenathome-db pg_dump -U postgres studentenathome > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20251230.sql | docker exec -i studentenathome-db psql -U postgres studentenathome
```

### Update Dependencies

```bash
npm audit
npm update
npm audit fix
```

### Logs ansehen

```bash
pm2 logs studentenathome-api --lines 100
```

## 🆘 Troubleshooting

### Backend startet nicht

```bash
pm2 logs studentenathome-api --err
# Prüfe Environment Variables
# Prüfe Datenbankverbindung
```

### Frontend zeigt weiße Seite

```bash
# Prüfe Browser Console für Fehler
# Prüfe Nginx Error Log
sudo tail -f /var/log/nginx/error.log
```

### API requests schlagen fehl

```bash
# Prüfe Backend Health
curl https://studentenathome.de/health

# Prüfe Nginx Proxy
sudo nginx -t
sudo systemctl reload nginx
```
