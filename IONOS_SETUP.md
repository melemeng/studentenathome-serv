# ⚡ Quick IONOS Email Setup Guide

## You're Using IONOS - Here's What You Need

Based on your screenshot showing **SMTP Port 587 with STARTTLS**, here's your exact configuration:

### Step 1: Install dotenv (if needed)

```bash
npm install dotenv
```

### Step 2: Create .env File

In your project root directory, create a file called `.env`:

```bash
cd /workspaces/studentenathome-serv
touch .env
```

### Step 3: Copy This Configuration

Open `.env` in your editor and paste this (replace with your actual credentials):

```bash
# IONOS Email Configuration
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=YourActualPassword123

# Application Settings
CANONICAL_BASE_URL=https://studentenathome.de
ADMIN_TOKEN=randomly-generated-secure-token-here
```

**Important:**

- Replace `support@studentenathome.de` with your actual IONOS email
- Replace `YourActualPassword123` with your IONOS email password
- Use `smtp.ionos.de` for Germany or `smtp.ionos.com` for international

### Step 4: Verify .env is Ignored by Git

```bash
# Check if .env is in .gitignore
cat .gitignore | grep .env
```

It should show `.env` - **this is already set up for you! ✅**

### Step 5: Restart Your Server

```bash
# Stop current server (Ctrl+C)
# Then start it again:
npm run start:server
```

### Step 6: Test It!

1. **Test Registration Email:**

   - Go to `http://localhost:5173/register`
   - Create a test account
   - Check your email inbox for verification

2. **Test Contact Form:**
   - Go to `http://localhost:5173/contact`
   - Fill out the form
   - Submit
   - You should see: "Nachricht erfolgreich gesendet!" ✉️
   - Check `support@studentenathome.de` inbox

## IONOS Troubleshooting

### If emails don't send, try these SMTP hosts:

```bash
# Germany
SMTP_HOST=smtp.ionos.de
# or
SMTP_HOST=smtp.1und1.de

# International
SMTP_HOST=smtp.ionos.com

# UK
SMTP_HOST=smtp.ionos.co.uk
```

### Check Server Logs

```bash
npm run start:server
```

Look for:

- ✅ "API server listening on port 5000"
- ❌ Any error messages about SMTP connection

### Common Issues

**"Invalid login"**

- Make sure you're using your **full email address** as SMTP_USER
- Use your **actual email password**, not an app password
- Check if your IONOS account has SMTP enabled

**"Connection timeout"**

- Verify Port 587 is not blocked by firewall
- Try alternative SMTP host (smtp.ionos.com)
- Check if your hosting allows outbound SMTP connections

**"Self-signed certificate"**

- This is normal for IONOS with STARTTLS
- The code already handles this with `secure: false` and Port 587

## Your Complete .env File Should Look Like:

```bash
# IONOS SMTP Configuration
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=info@studentenathome.de
SMTP_PASS=MySecurePassword123

# Application URLs
CANONICAL_BASE_URL=https://studentenathome.de

# Admin Security Token (generate a random string)
ADMIN_TOKEN=abc123randomsecuretoken456xyz
```

## Generate Secure Admin Token

```bash
# Run this in terminal to generate a random token:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `ADMIN_TOKEN`.

## That's It! 🎉

Once your `.env` file is configured:

- ✅ User registration emails will be sent
- ✅ Contact form will send to support@studentenathome.de
- ✅ Customers will receive confirmation emails
- ✅ Admin can manage everything from /admin panel

## Still Need Help?

The server logs will show any SMTP errors. Run:

```bash
npm run start:server
```

And watch for error messages when testing email features.
