// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import validator from "validator";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Import database queries
import {
  userQueries,
  postQueries,
  jobQueries,
  failedLoginQueries,
  auditQueries,
} from "./database/db.js";

// Import CSRF protection
import { verifyCsrfToken, attachCsrfToken } from "./middleware/csrf.js";

// Import user-based rate limiting
import {
  authRateLimiter,
  apiRateLimiter,
  postCreationRateLimiter,
  contactRateLimiter,
} from "./middleware/userRateLimit.js";

// Import file upload middleware
import {
  upload,
  validateUploadedFile,
  deleteUploadedFile,
  getFileUrl,
  ensureUploadDir,
} from "./middleware/fileUpload.js";

// Import IP blocking
import {
  checkIPBlock,
  recordViolation,
  blockIP,
  unblockIP,
  getAllBlockedIPs,
} from "./middleware/ipBlocking.js";

// Import logging
import logger, {
  securityLogger,
  requestLogger,
  errorLogger,
  eventLogger,
} from "./middleware/logger.js";

const app = express();

// HTTPS Redirect Middleware (Production only)
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for dev - enable in production
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later",
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per 15 minutes
  message: "Too many requests, please try again later",
});

// Compression middleware (Gzip)
app.use(compression());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://studentenathome.de", "https://www.studentenathome.de"]
        : ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
    exposedHeaders: ["X-CSRF-Token"],
  })
);
app.use(express.json({ limit: "1mb" }));

// IP Blocking check - apply to all routes
app.use(checkIPBlock);

// Request logging
app.use(requestLogger);

// CSRF Protection for state-changing operations
// Apply to all routes except public GET requests
app.use("/api/auth/register", verifyCsrfToken);
app.use("/api/auth/login", attachCsrfToken); // Attach token on login page
app.use("/api/auth/logout", verifyCsrfToken);
app.use("/api/contact", verifyCsrfToken);
app.use("/api/posts", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return verifyCsrfToken(req, res, next);
  }
  next();
});

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "demo-token";
const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const JWT_EXPIRES_IN = "24h";
const ADMIN_EMAILS = ["admin@studentenathome.de", "support@studentenathome.de"];
const CANONICAL_BASE =
  process.env.CANONICAL_BASE_URL || "https://studentenathome.de";

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // Set these in environment variables
    pass: process.env.SMTP_PASS,
  },
});

// JWT Middleware for protected routes
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    // Check if token is revoked
    const isRevoked = await userQueries.isTokenRevoked(token);
    if (isRevoked) {
      return res.status(403).json({ error: "Token has been revoked" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = user;
      req.token = token;
      next();
    });
  } catch (error) {
    console.error("Token authentication error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${CANONICAL_BASE}/verify-email?token=${token}`;

  try {
    await emailTransporter.sendMail({
      from: process.env.SMTP_USER || "noreply@studentenathome.de",
      to: email,
      subject: "Verifizieren Sie Ihre E-Mail-Adresse - StudentenAtHome",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Willkommen bei StudentenAtHome!</h2>
          <p>Vielen Dank für Ihre Registrierung. Bitte verifizieren Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
          <p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
              E-Mail verifizieren
            </a>
          </p>
          <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><small>Dieser Link ist 24 Stunden gültig.</small></p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}

function validatePost(post) {
  const errors = [];

  if (
    !post.title ||
    typeof post.title !== "string" ||
    post.title.trim().length < 10
  ) {
    errors.push("Title must be at least 10 characters");
  }

  if (post.title && post.title.length > 200) {
    errors.push("Title must be less than 200 characters");
  }

  if (
    !post.excerpt ||
    typeof post.excerpt !== "string" ||
    post.excerpt.trim().length < 20
  ) {
    errors.push("Excerpt must be at least 20 characters");
  }

  if (post.excerpt && post.excerpt.length > 500) {
    errors.push("Excerpt must be less than 500 characters");
  }

  if (
    !post.content ||
    typeof post.content !== "string" ||
    post.content.trim().length < 50
  ) {
    errors.push("Content must be at least 50 characters");
  }

  if (!post.author || typeof post.author !== "string") {
    errors.push("Author is required");
  }

  if (!post.category || typeof post.category !== "string") {
    errors.push("Category is required");
  }

  return errors;
}

function sanitizePost(post) {
  return {
    slug:
      post.slug ||
      post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .substring(0, 50),
    title: validator.escape(post.title.trim()),
    excerpt: validator.escape(post.excerpt.trim()),
    content: post.content.trim(), // Will be sanitized on client with DOMPurify
    category: validator.escape(post.category.trim()),
    author: validator.escape(post.author.trim()),
    read_time: post.readTime || post.read_time || "5 Min",
    status: post.status || "pending", // draft, pending, approved, rejected
  };
}

// CSRF token endpoint - provides token for initial requests
app.get("/api/auth/csrf-token", attachCsrfToken, (req, res) => {
  res.json({ message: "CSRF token generated" });
});

// User registration endpoint
app.post(
  "/api/auth/register",
  loginLimiter,
  authRateLimiter,
  async (req, res) => {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Ungültige E-Mail-Adresse" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Passwort muss mindestens 8 Zeichen lang sein" });
    }

    try {
      // Check if user already exists
      const existingUser = await userQueries.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "E-Mail-Adresse bereits registriert" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = generateVerificationToken();

      // Create user
      const newUser = await userQueries.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: validator.escape(name.trim()),
        is_admin: ADMIN_EMAILS.includes(email.toLowerCase()),
        verification_token: verificationToken,
      });

      // Send verification email
      const emailSent = await sendVerificationEmail(email, verificationToken);

      if (!emailSent) {
        console.warn("Failed to send verification email to:", email);
      }

      // Log audit event
      await auditQueries.log({
        user_id: newUser.id,
        action: "user_registered",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: { email: email.toLowerCase() },
      });

      res.status(201).json({
        message:
          "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Verifizierung.",
        emailSent,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Fehler bei der Registrierung" });
    }
  }
);

// Email verification endpoint
app.get("/api/auth/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verifizierungs-Token fehlt" });
  }

  try {
    const user = await userQueries.findByVerificationToken(token);

    if (!user) {
      return res.status(400).json({ error: "Ungültiger Verifizierungs-Token" });
    }

    if (new Date(user.verification_expiry) < new Date()) {
      return res.status(400).json({ error: "Verifizierungs-Token abgelaufen" });
    }

    // Mark user as verified
    await userQueries.verifyEmail(user.id);

    // Log audit event
    await auditQueries.log({
      user_id: user.id,
      action: "email_verified",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { email: user.email },
    });

    res.json({
      message:
        "E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Fehler bei der Verifizierung" });
  }
});

// Login endpoint
app.post("/api/auth/login", loginLimiter, authRateLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort erforderlich" });
  }

  try {
    const user = await userQueries.findByEmail(email);

    if (!user) {
      // Log failed login attempt
      securityLogger.failedLogin(email, req.ip, "User not found");

      // Record failed attempt with email only
      await failedLoginQueries.record({
        email: email.toLowerCase(),
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
      });
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    // Check if account is locked
    if (user.is_locked) {
      return res.status(403).json({
        error: "Konto gesperrt. Bitte kontaktieren Sie den Support.",
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        error: "E-Mail noch nicht verifiziert",
        needsVerification: true,
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Log security event
      securityLogger.failedLogin(email, req.ip, "Invalid password");

      // Record failed attempt
      await failedLoginQueries.record({
        email: email.toLowerCase(),
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
      });

      // Increment failed login count
      await userQueries.incrementFailedLogin(user.id);

      // Track violation for IP blocking
      recordViolation(req.ip, "failedLogin", { email: email.toLowerCase() });

      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    // Reset failed login attempts on successful login
    await userQueries.resetFailedLogin(user.id);

    // Update last login
    await userQueries.updateLastLogin(user.id, req.ip);

    // Log successful login
    securityLogger.loginAttempt(user.email, req.ip, true);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.is_admin,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Log audit event
    await auditQueries.log({
      user_id: user.id,
      action: "user_login",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { email: user.email },
    });

    res.json({
      message: "Anmeldung erfolgreich",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Fehler bei der Anmeldung" });
  }
});

// Logout endpoint - revokes JWT token
app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.token; // Set by authenticateToken middleware

    // Revoke the token
    await userQueries.revokeToken(token);

    // Log audit event
    await auditQueries.log({
      user_id: req.user.id,
      action: "user_logout",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { email: req.user.email },
    });

    res.json({ message: "Erfolgreich abgemeldet" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Fehler bei der Abmeldung" });
  }
});

// Resend verification email
app.post(
  "/api/auth/resend-verification",
  loginLimiter,
  authRateLimiter,
  async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: "Gültige E-Mail-Adresse erforderlich" });
    }

    try {
      const user = await userQueries.findByEmail(email);

      if (!user) {
        // Don't reveal if user exists or not
        return res.json({
          message:
            "Falls ein Konto existiert, wurde eine Verifizierungs-E-Mail gesendet.",
        });
      }

      if (user.is_verified) {
        return res.status(400).json({ error: "E-Mail bereits verifiziert" });
      }

      // Generate new verification token
      const verificationToken = generateVerificationToken();
      await userQueries.updateVerificationToken(user.id, verificationToken);

      await sendVerificationEmail(user.email, verificationToken);

      res.json({ message: "Verifizierungs-E-Mail wurde erneut gesendet." });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ error: "Fehler beim Senden der E-Mail" });
    }
  }
);

// Request password reset
app.post(
  "/api/auth/request-password-reset",
  loginLimiter,
  authRateLimiter,
  async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: "Gültige E-Mail-Adresse erforderlich" });
    }

    try {
      const user = await userQueries.findByEmail(email);

      if (!user) {
        // Don't reveal if user exists or not (security best practice)
        return res.json({
          message:
            "Falls ein Konto existiert, wurde eine Passwort-Reset-E-Mail gesendet.",
        });
      }

      // Check if account is locked
      if (user.is_locked) {
        return res.status(403).json({
          error: "Konto gesperrt. Bitte kontaktieren Sie den Support.",
        });
      }

      // Generate password reset token
      const resetToken = generateVerificationToken();
      await userQueries.setPasswordResetToken(user.id, resetToken);

      // Send password reset email
      const resetUrl = `${CANONICAL_BASE}/reset-password?token=${resetToken}`;

      await emailTransporter.sendMail({
        from: process.env.SMTP_USER || "noreply@studentenathome.de",
        to: user.email,
        subject: "Passwort zurücksetzen - StudentenAtHome",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Passwort zurücksetzen</h2>
            <p>Hallo ${user.name},</p>
            <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
            <p>
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
                Passwort zurücksetzen
              </a>
            </p>
            <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><small>Dieser Link ist 1 Stunde gültig.</small></p>
            <p>Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail bitte.</p>
          </div>
        `,
      });

      // Log audit event
      await auditQueries.log({
        user_id: user.id,
        action: "password_reset_requested",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: { email: user.email },
      });

      res.json({
        message:
          "Falls ein Konto existiert, wurde eine Passwort-Reset-E-Mail gesendet.",
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ error: "Fehler beim Senden der E-Mail" });
    }
  }
);

// Reset password with token
app.post(
  "/api/auth/reset-password",
  loginLimiter,
  authRateLimiter,
  async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token und neues Passwort erforderlich" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Passwort muss mindestens 8 Zeichen lang sein" });
    }

    try {
      // Find user by reset token
      const user = await userQueries.findByPasswordResetToken(token);

      if (!user) {
        return res.status(400).json({
          error: "Ungültiger oder abgelaufener Reset-Token",
        });
      }

      // Check reset attempts (max 3)
      if (user.password_reset_attempts >= 3) {
        return res.status(429).json({
          error:
            "Zu viele Versuche. Bitte fordern Sie einen neuen Reset-Link an.",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await userQueries.resetPassword(user.id, hashedPassword);

      // Log audit event
      await auditQueries.log({
        user_id: user.id,
        action: "password_reset_completed",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: { email: user.email },
      });

      // Send confirmation email
      await emailTransporter.sendMail({
        from: process.env.SMTP_USER || "noreply@studentenathome.de",
        to: user.email,
        subject: "Passwort erfolgreich geändert - StudentenAtHome",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Passwort erfolgreich geändert</h2>
            <p>Hallo ${user.name},</p>
            <p>Ihr Passwort wurde erfolgreich geändert.</p>
            <p>Wenn Sie diese Änderung nicht vorgenommen haben, kontaktieren Sie bitte sofort unseren Support.</p>
            <p>
              <strong>Support:</strong><br>
              E-Mail: support@studentenathome.de<br>
              Telefon: +49 176 75444136
            </p>
          </div>
        `,
      });

      res.json({
        message:
          "Passwort erfolgreich zurückgesetzt. Sie können sich jetzt anmelden.",
      });
    } catch (error) {
      console.error("Password reset error:", error);

      // Increment reset attempts if user found
      if (error.user) {
        await userQueries.incrementPasswordResetAttempts(error.user.id);
      }

      res.status(500).json({ error: "Fehler beim Zurücksetzen des Passworts" });
    }
  }
);

// Contact form submission endpoint
app.post("/api/contact", apiLimiter, contactRateLimiter, async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ error: "Alle erforderlichen Felder müssen ausgefüllt werden" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Ungültige E-Mail-Adresse" });
  }

  if (message.length < 10) {
    return res
      .status(400)
      .json({ error: "Nachricht muss mindestens 10 Zeichen lang sein" });
  }

  // Sanitize inputs
  const sanitizedData = {
    firstName: validator.escape(firstName.trim()),
    lastName: validator.escape(lastName.trim()),
    email: validator.normalizeEmail(email.trim()),
    phoneNumber: phoneNumber
      ? validator.escape(phoneNumber.trim())
      : "Nicht angegeben",
    message: validator.escape(message.trim()),
  };

  try {
    // Send email to support
    await emailTransporter.sendMail({
      from: process.env.SMTP_USER || "noreply@studentenathome.de",
      to: "support@studentenathome.de",
      replyTo: sanitizedData.email,
      subject: `Neue Kontaktanfrage von ${sanitizedData.firstName} ${sanitizedData.lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Neue Kontaktanfrage</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${sanitizedData.firstName} ${sanitizedData.lastName}</p>
            <p><strong>E-Mail:</strong> ${sanitizedData.email}</p>
            <p><strong>Telefon:</strong> ${sanitizedData.phoneNumber}</p>
          </div>
          <div style="margin: 20px 0;">
            <p><strong>Nachricht:</strong></p>
            <p style="white-space: pre-wrap; background-color: #ffffff; padding: 15px; border-left: 4px solid #0066cc;">${sanitizedData.message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Diese Nachricht wurde über das Kontaktformular auf studentenathome.de gesendet.
          </p>
        </div>
      `,
      text: `
Neue Kontaktanfrage

Name: ${sanitizedData.firstName} ${sanitizedData.lastName}
E-Mail: ${sanitizedData.email}
Telefon: ${sanitizedData.phoneNumber}

Nachricht:
${sanitizedData.message}

---
Diese Nachricht wurde über das Kontaktformular auf studentenathome.de gesendet.
      `,
    });

    // Send confirmation email to customer
    await emailTransporter.sendMail({
      from: process.env.SMTP_USER || "noreply@studentenathome.de",
      to: sanitizedData.email,
      subject: "Wir haben Ihre Anfrage erhalten - StudentenAtHome",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Vielen Dank für Ihre Nachricht!</h2>
          <p>Hallo ${sanitizedData.firstName},</p>
          <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ihre Nachricht:</strong></p>
            <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
          </div>
          
          <p>In der Regel antworten wir innerhalb von 24 Stunden während der Geschäftszeiten.</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #e7f3ff; border-radius: 8px;">
            <p style="margin: 0;"><strong>Kontakt:</strong></p>
            <p style="margin: 5px 0;">📧 support@studentenathome.de</p>
            <p style="margin: 5px 0;">📞 +49 176 75444136</p>
            <p style="margin: 5px 0;">📍 Klingestraße 13C, 01159 Dresden</p>
          </div>
          
          <p>Mit freundlichen Grüßen,<br>Ihr StudentenAtHome Team</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            StudentenAtHome - Tech-Support von Studenten für alle<br>
            <a href="https://studentenathome.de" style="color: #0066cc;">studentenathome.de</a>
          </p>
        </div>
      `,
      text: `
Vielen Dank für Ihre Nachricht!

Hallo ${sanitizedData.firstName},

wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.

Ihre Nachricht:
${sanitizedData.message}

In der Regel antworten wir innerhalb von 24 Stunden während der Geschäftszeiten.

Kontakt:
E-Mail: support@studentenathome.de
Telefon: +49 176 75444136
Adresse: Klingestraße 13C, 01159 Dresden

Mit freundlichen Grüßen,
Ihr StudentenAtHome Team

---
StudentenAtHome - Tech-Support von Studenten für alle
studentenathome.de
      `,
    });

    // Log successful contact form submission
    eventLogger.contactFormSubmission(sanitizedData.email, req.ip);

    res.json({
      message: "Nachricht erfolgreich gesendet! Wir melden uns bald bei Ihnen.",
      success: true,
    });
  } catch (error) {
    console.error("Contact form email error:", error);
    res.status(500).json({
      error:
        "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.",
      success: false,
    });
  }
});

// File upload endpoint for blog images
app.post(
  "/api/upload/blog-image",
  authenticateToken,
  apiRateLimiter,
  upload.single("image"),
  validateUploadedFile,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Check if user is admin
      if (!req.user.isAdmin) {
        await deleteUploadedFile(req.file.filename);
        return res.status(403).json({ error: "Admin access required" });
      }

      // Log upload in audit log
      await auditQueries.log({
        user_id: req.user.id,
        action: "file_uploaded",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          metadata: req.file.imageMetadata,
        },
      });

      // Log security event
      securityLogger.fileUpload(
        req.file.filename,
        req.user.email,
        req.ip,
        req.file.size
      );

      res.json({
        success: true,
        message: "File uploaded successfully",
        file: {
          filename: req.file.filename,
          url: getFileUrl(req.file.filename, CANONICAL_BASE),
          size: req.file.size,
          mimetype: req.file.mimetype,
          metadata: req.file.imageMetadata,
        },
      });
    } catch (error) {
      console.error("File upload error:", error);
      if (req.file) {
        await deleteUploadedFile(req.file.filename);
      }
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

// Delete uploaded file endpoint
app.delete(
  "/api/upload/blog-image/:filename",
  authenticateToken,
  apiRateLimiter,
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { filename } = req.params;

      // Validate filename (prevent directory traversal)
      if (filename.includes("..") || filename.includes("/")) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const deleted = await deleteUploadedFile(filename);

      if (!deleted) {
        return res.status(404).json({ error: "File not found" });
      }

      // Log deletion in audit log
      await auditQueries.log({
        user_id: req.user.id,
        action: "file_deleted",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: { filename },
      });

      // Log security event
      securityLogger.fileDeleted(filename, req.user.email, req.ip);

      res.json({ success: true, message: "File deleted successfully" });
    } catch (error) {
      console.error("File deletion error:", error);
      res.status(500).json({ error: "File deletion failed" });
    }
  }
);

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

app.get("/api/posts", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

    // Only admins can see all posts (including pending/rejected)
    if (showAll && token === ADMIN_TOKEN) {
      const allPosts = await postQueries.findAll();
      res.set("Cache-Control", "no-cache");
      return res.json(allPosts);
    }

    // Public: only show approved posts
    const approvedPosts = await postQueries.findAll("approved");
    res.set("Cache-Control", "public, max-age=300"); // 5 minutes
    res.json(approvedPosts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: "Fehler beim Laden der Beiträge" });
  }
});

// robots.txt
app.get("/robots.txt", (req, res) => {
  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${CANONICAL_BASE}/sitemap.xml`,
  ].join("\n");
  res.type("text/plain").send(content);
});

// Dynamic sitemap including blog posts
app.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await postQueries.findAll("approved");
    const base = CANONICAL_BASE;
    const urls = [
      { loc: base + "/", changefreq: "daily", priority: "1.0" },
      { loc: base + "/solutions", changefreq: "weekly", priority: "0.8" },
      { loc: base + "/about", changefreq: "monthly", priority: "0.6" },
      { loc: base + "/contact", changefreq: "monthly", priority: "0.6" },
      { loc: base + "/blog", changefreq: "daily", priority: "0.8" },
      { loc: base + "/faq", changefreq: "monthly", priority: "0.5" },
      { loc: base + "/datenschutz", changefreq: "yearly", priority: "0.4" },
      { loc: base + "/impressum", changefreq: "yearly", priority: "0.4" },
      { loc: base + "/jobs", changefreq: "monthly", priority: "0.5" },
    ];

    posts.forEach((p) => {
      if (p && (p.slug || p.id)) {
        const lastmod =
          p.updated_at || p.published_at || new Date().toISOString();
        urls.push({
          loc: `${base}/blog/${encodeURIComponent(p.slug || p.id)}`,
          changefreq: "weekly",
          priority: "0.7",
          lastmod: lastmod,
        });
      }
    });

    const now = new Date().toISOString().split("T")[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => {
        const lastmod = u.lastmod
          ? new Date(u.lastmod).toISOString().split("T")[0]
          : now;
        return `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
      })
      .join("\n")}\n</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (e) {
    console.error("sitemap error", e);
    res.status(500).send("Failed to generate sitemap");
  }
});

// Admin: Get all blocked IPs
app.get(
  "/api/admin/blocked-ips",
  authenticateToken,
  apiRateLimiter,
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const blockedIPs = getAllBlockedIPs();
      res.json({ blocked: blockedIPs, count: blockedIPs.length });
    } catch (error) {
      console.error("Get blocked IPs error:", error);
      res.status(500).json({ error: "Failed to retrieve blocked IPs" });
    }
  }
);

// Admin: Unblock an IP
app.post(
  "/api/admin/unblock-ip",
  authenticateToken,
  apiRateLimiter,
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { ip } = req.body;

      if (!ip) {
        return res.status(400).json({ error: "IP address required" });
      }

      const wasBlocked = unblockIP(ip);

      // Log in audit
      await auditQueries.log({
        user_id: req.user.id,
        action: "ip_unblocked",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: { unblocked_ip: ip },
      });

      // Log security event
      if (wasBlocked) {
        securityLogger.ipUnblocked(ip, req.user.email, req.ip);
      }

      res.json({
        success: true,
        message: wasBlocked
          ? "IP unblocked successfully"
          : "IP was not blocked",
      });
    } catch (error) {
      console.error("Unblock IP error:", error);
      res.status(500).json({ error: "Failed to unblock IP" });
    }
  }
);

// Admin: Manually block an IP
app.post(
  "/api/admin/block-ip",
  authenticateToken,
  apiRateLimiter,
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { ip, reason, permanent } = req.body;

      if (!ip) {
        return res.status(400).json({ error: "IP address required" });
      }

      blockIP(ip, reason || "Manually blocked by admin", permanent || false);

      // Log in audit
      await auditQueries.log({
        user_id: req.user.id,
        action: "ip_blocked",
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        details: { blocked_ip: ip, reason, permanent },
      });

      // Log security event
      securityLogger.ipBlocked(
        ip,
        req.user.email,
        req.ip,
        reason || "Manually blocked"
      );

      res.json({ success: true, message: "IP blocked successfully" });
    } catch (error) {
      console.error("Block IP error:", error);
      res.status(500).json({ error: "Failed to block IP" });
    }
  }
);

app.post(
  "/api/posts",
  apiLimiter,
  postCreationRateLimiter,
  async (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token || token !== ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const post = req.body;

    // Validate post data
    const errors = validatePost(post);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    try {
      // Sanitize and create post
      const sanitizedPost = sanitizePost(post);
      const newPost = await postQueries.create(sanitizedPost);

      res.status(201).json(newPost);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({ error: "Failed to save post" });
    }
  }
);

// Update post status (approve/reject)
app.patch("/api/posts/:id", apiLimiter, async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updatedPost = await postQueries.updateStatus(id, status);

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete post
app.delete("/api/posts/:id", apiLimiter, async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const deleted = await postQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// ============================================
// JOB LISTINGS ENDPOINTS
// ============================================

// Get all job listings (public or admin view)
app.get("/api/jobs", apiLimiter, async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

    // Only admins can see all jobs (including inactive)
    if (showAll && token === ADMIN_TOKEN) {
      const allJobs = await jobQueries.findAll(true);
      res.set("Cache-Control", "no-cache");
      return res.json(allJobs);
    }

    // Public: only show active published jobs
    const activeJobs = await jobQueries.findAll(false);
    res.set("Cache-Control", "public, max-age=600"); // 10 minutes
    res.json(activeJobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ error: "Fehler beim Laden der Stellenangebote" });
  }
});

// Get single job by ID
app.get("/api/jobs/:id", apiLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobQueries.findById(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if user is admin for inactive jobs
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (job.status !== "active" && token !== ADMIN_TOKEN) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ error: "Fehler beim Laden des Stellenangebots" });
  }
});

// Create new job (admin only)
app.post("/api/jobs", apiLimiter, authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const job = req.body;

    // Validation
    if (!job.title || job.title.length < 5 || job.title.length > 255) {
      return res
        .status(400)
        .json({ error: "Title must be between 5 and 255 characters" });
    }

    if (!job.description || job.description.length < 20) {
      return res
        .status(400)
        .json({ error: "Description must be at least 20 characters" });
    }

    if (!job.type || !job.location) {
      return res
        .status(400)
        .json({ error: "Type and location are required" });
    }

    if (!Array.isArray(job.requirements) || job.requirements.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one requirement is required" });
    }

    if (!Array.isArray(job.benefits) || job.benefits.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one benefit is required" });
    }

    // Sanitize inputs
    const sanitizedJob = {
      title: validator.escape(job.title.trim()),
      type: validator.escape(job.type.trim()),
      location: validator.escape(job.location.trim()),
      description: validator.escape(job.description.trim()),
      requirements: job.requirements.map((r) => validator.escape(r.trim())),
      benefits: job.benefits.map((b) => validator.escape(b.trim())),
      status: job.status || "active",
      is_published: job.is_published !== undefined ? job.is_published : true,
    };

    // Create job
    const newJob = await jobQueries.create(sanitizedJob);

    // Log audit event
    await auditQueries.log({
      user_id: req.user.id,
      action: "job_created",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { job_id: newJob.id, title: newJob.title },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// Update job (admin only)
app.put("/api/jobs/:id", apiLimiter, authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const job = req.body;

    // Validation
    if (job.title && (job.title.length < 5 || job.title.length > 255)) {
      return res
        .status(400)
        .json({ error: "Title must be between 5 and 255 characters" });
    }

    if (job.description && job.description.length < 20) {
      return res
        .status(400)
        .json({ error: "Description must be at least 20 characters" });
    }

    if (
      job.requirements &&
      (!Array.isArray(job.requirements) || job.requirements.length === 0)
    ) {
      return res
        .status(400)
        .json({ error: "At least one requirement is required" });
    }

    if (
      job.benefits &&
      (!Array.isArray(job.benefits) || job.benefits.length === 0)
    ) {
      return res
        .status(400)
        .json({ error: "At least one benefit is required" });
    }

    // Sanitize inputs
    const sanitizedJob = {
      title: validator.escape(job.title.trim()),
      type: validator.escape(job.type.trim()),
      location: validator.escape(job.location.trim()),
      description: validator.escape(job.description.trim()),
      requirements: job.requirements.map((r) => validator.escape(r.trim())),
      benefits: job.benefits.map((b) => validator.escape(b.trim())),
      status: job.status || "active",
      is_published: job.is_published !== undefined ? job.is_published : true,
    };

    // Update job
    const updatedJob = await jobQueries.update(id, sanitizedJob);

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Log audit event
    await auditQueries.log({
      user_id: req.user.id,
      action: "job_updated",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { job_id: updatedJob.id, title: updatedJob.title },
    });

    res.json(updatedJob);
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
});

// Update job status (admin only)
app.patch("/api/jobs/:id", apiLimiter, authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedJob = await jobQueries.updateStatus(id, status);

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Log audit event
    await auditQueries.log({
      user_id: req.user.id,
      action: "job_status_updated",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { job_id: updatedJob.id, status },
    });

    res.json(updatedJob);
  } catch (error) {
    console.error("Update job status error:", error);
    res.status(500).json({ error: "Failed to update job status" });
  }
});

// Delete job (admin only)
app.delete("/api/jobs/:id", apiLimiter, authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const deleted = await jobQueries.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Log audit event
    await auditQueries.log({
      user_id: req.user.id,
      action: "job_deleted",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
      details: { job_id: deleted.id, title: deleted.title },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler - must be before error handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.url} does not exist`,
  });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
  // Log error
  errorLogger(err, req, res, next);

  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(isDevelopment && { stack: err.stack, details: err }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 API server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
  });
  console.log(`API server listening on port ${PORT}`);
});
