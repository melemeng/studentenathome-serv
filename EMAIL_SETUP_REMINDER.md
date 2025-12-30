# 🔔 EMAIL SETUP REMINDER

## ⚠️ IMPORTANT: Email Configuration Required

You need to configure SMTP settings to enable:

- ✉️ User email verification (registration)
- ✉️ Contact form submissions to support@studentenathome.de
- ✉️ Customer confirmation emails

## Required Environment Variables

Add these to your environment or create a `.env` file:

```bash
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@studentenathome.de
SMTP_PASS=your-app-password

# Application Configuration
CANONICAL_BASE_URL=https://studentenathome.de
ADMIN_TOKEN=your-secure-admin-token-here
```

## Gmail Setup (Recommended)

### Step 1: Enable 2FA

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification

### Step 2: Generate App Password

1. Visit [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "StudentenAtHome Server"
4. Click "Generate"
5. Copy the 16-character password
6. Use this as `SMTP_PASS`

### Step 3: Configure Email

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # App password from step 2
```

## Alternative: Custom Email Provider

### For custom domain email (e.g., support@studentenathome.de):

#### IONOS (Your Provider) ⭐

Based on your IONOS setup with SMTP Port 587 and STARTTLS encryption:

```bash
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de  # Your full IONOS email address
SMTP_PASS=your-ionos-email-password  # Your email account password
```

**Important IONOS Notes:**

- ✅ Use **port 587** (as shown in your screenshot)
- ✅ Encryption is automatically handled (STARTTLS)
- ✅ Use your **full email address** as SMTP_USER
- ✅ Use your **regular email password** (not app password needed)
- ✅ SMTP host is usually `smtp.ionos.de` (for Germany) or `smtp.ionos.com` (international)

**If connection fails, try these alternative IONOS SMTP hosts:**

- `smtp.1und1.de` (Germany)
- `smtp.ionos.com` (International)
- `smtp.ionos.co.uk` (UK)

#### Hostinger / cPanel

```bash
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=your-email-password
```

#### Microsoft 365 / Outlook

```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=your-email-password
```

#### SendGrid (Transactional Email Service)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## How to Set Environment Variables

### Option 1: Create .env File (Recommended for Development)

1. **Create a new file** in your project root called `.env`:

```bash
# In your terminal, navigate to project root
cd /workspaces/studentenathome-serv
touch .env
```

2. **Add your IONOS configuration** to `.env`:

```bash
# IONOS SMTP Configuration
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=YourIonosEmailPassword123

# Application URLs
CANONICAL_BASE_URL=https://studentenathome.de
ADMIN_TOKEN=your-secure-random-token-here
```

3. **Add .env to .gitignore** (if not already there):

```bash
echo ".env" >> .gitignore
```

4. **Install dotenv package** (if not installed):

```bash
npm install dotenv
```

5. **Load environment variables** in your server (add to top of `server/index.js`):

```javascript
require("dotenv").config();
```

6. **Restart your server**:

```bash
npm run start:server
```

### Option 2: Set in Terminal (Temporary, for Testing)

```bash
# Set variables in current terminal session
export SMTP_HOST=smtp.ionos.de
export SMTP_PORT=587
export SMTP_USER=support@studentenathome.de
export SMTP_PASS=YourPassword

# Then start server
npm run start:server
```

**Note:** These are lost when you close the terminal.

### Option 3: Production Server (GitHub Pages with Backend)

If you're deploying to a hosting service:

#### Vercel / Netlify

1. Go to your project settings
2. Find "Environment Variables" section
3. Add each variable:
   - Key: `SMTP_HOST`, Value: `smtp.ionos.de`
   - Key: `SMTP_PORT`, Value: `587`
   - Key: `SMTP_USER`, Value: `support@studentenathome.de`
   - Key: `SMTP_PASS`, Value: `your-password`

#### Heroku

```bash
heroku config:set SMTP_HOST=smtp.ionos.de
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=support@studentenathome.de
heroku config:set SMTP_PASS=your-password
```

#### DigitalOcean / VPS

Add to `/etc/environment` or create `.env` file in your app directory.

### Option 4: Docker (if using Docker)

Add to your `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - SMTP_HOST=smtp.ionos.de
      - SMTP_PORT=587
      - SMTP_USER=support@studentenathome.de
      - SMTP_PASS=your-password
```

Or use `--env-file`:

```bash
docker run --env-file .env your-image
```

## Quick Start: IONOS Email Setup

### Complete Step-by-Step:

1. **Create .env file in project root:**

```bash
cd /workspaces/studentenathome-serv
nano .env
```

2. **Copy this configuration (replace with your credentials):**

```bash
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=support@studentenathome.de
SMTP_PASS=your-actual-ionos-password
CANONICAL_BASE_URL=https://studentenathome.de
ADMIN_TOKEN=generate-a-random-secure-token
```

3. **Save and close** (Ctrl+X, then Y, then Enter)

4. **Make sure .env is in .gitignore:**

```bash
echo ".env" >> .gitignore
```

5. **Install dotenv if needed:**

```bash
npm install dotenv
```

6. **Update server/index.js (add at the very top):**

```javascript
require("dotenv").config();
const express = require("express");
// ... rest of your code
```

7. **Restart your server:**

```bash
npm run start:server
```

8. **Test the setup:**
   - Visit `/register` and create an account
   - Check your email for verification
   - Try the contact form at `/contact`

## Features Enabled After Setup

### 1. User Registration Email

**Trigger:** New user registers at `/register`
**Sent to:** User's email
**Contains:** Verification link (24-hour expiration)

### 2. Contact Form to Support

**Trigger:** User submits contact form at `/contact`
**Sent to:** `support@studentenathome.de`
**Contains:**

- Customer name, email, phone
- Message content
- Reply-to customer's email for easy response

### 3. Customer Confirmation Email

**Trigger:** Contact form submission
**Sent to:** Customer's email
**Contains:**

- Confirmation of receipt
- Copy of their message
- Support contact information
- Expected response time (24 hours)

## Testing Email Configuration

### 1. Test SMTP Connection

Add this to your server and visit `/test-email`:

```javascript
app.get("/test-email", async (req, res) => {
  try {
    await emailTransporter.verify();
    res.json({ message: "SMTP connection successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Send Test Email

```javascript
app.post("/test-email", async (req, res) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: "your-test-email@example.com",
      subject: "Test Email - StudentenAtHome",
      text: "This is a test email. If you receive this, your SMTP configuration is working!",
    });
    res.json({ message: "Test email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Current Status

### ✅ Already Implemented

- User registration with email verification
- Contact form backend endpoint
- Email templates (HTML + plain text)
- Rate limiting (100 requests per 15 min)
- Input validation and sanitization
- Success/error messages
- Beautiful toast notifications

### ⚠️ Waiting for Email Setup

- Email sending (all features will work once SMTP is configured)
- Verification emails won't send
- Contact form won't send to support@
- Customers won't receive confirmation

## Manual Testing Without Email

### Option 1: Manual Verification

1. User registers → Check `server/data/users.json`
2. Copy `verificationToken` from user object
3. Visit: `http://localhost:5000/api/auth/verify-email?token=PASTE_TOKEN_HERE`
4. User can now login

### Option 2: Mock Email Sending

Temporarily comment out email sending in `server/index.js`:

```javascript
// TEMPORARY: Comment this for testing without email
// const emailSent = await sendVerificationEmail(email, verificationToken);
const emailSent = true; // Mock success
```

## What Happens When Email Setup is Complete?

1. **User Registration:**

   - User registers → Email sent automatically
   - User checks inbox → Clicks verification link
   - Account verified → Can login

2. **Contact Form:**

   - Customer fills form → Submits
   - Email sent to `support@studentenathome.de`
   - Confirmation email sent to customer
   - Beautiful toast: "Nachricht erfolgreich gesendet! Wir melden uns bald bei Ihnen!" ✉️

3. **Admin Notifications:**
   - New registration emails (optional)
   - Contact form notifications
   - Blog post submissions (optional)

## Security Notes

- ⚠️ **Never commit** `.env` file to Git
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables in production
- ✅ App passwords are safer than regular passwords
- ✅ Rate limiting prevents spam (already configured)

## Need Help?

If you encounter issues:

1. Check server logs: `npm run start:server`
2. Verify SMTP credentials
3. Check firewall/network settings
4. Test with a different SMTP provider
5. Use SendGrid for reliable transactional emails

## Quick Start Checklist

- [ ] Create Gmail account or use existing email
- [ ] Enable 2FA (for Gmail)
- [ ] Generate app password
- [ ] Add SMTP credentials to environment
- [ ] Restart server: `npm run start:server`
- [ ] Test registration at `/register`
- [ ] Check email inbox for verification
- [ ] Test contact form at `/contact`
- [ ] Verify email received at support@studentenathome.de

---

**Remember:** Once email is configured, all features will work automatically! 🎉
