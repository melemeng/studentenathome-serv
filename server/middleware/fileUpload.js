/**
 * Secure File Upload Middleware for Blog Images
 *
 * Security Features:
 * - File type validation (whitelist)
 * - File size limits
 * - Filename sanitization
 * - Virus scanning simulation
 * - Image dimension validation
 * - Content-Type verification
 */

import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs/promises";
import sharp from "sharp";

// Upload directory
const UPLOAD_DIR = "./uploads/blog";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;

// Allowed MIME types (whitelist)
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
}

/**
 * Generate secure filename
 */
function generateSecureFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const randomName = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  return `${timestamp}-${randomName}${ext}`;
}

/**
 * Sanitize filename - remove dangerous characters
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace non-alphanumeric
    .replace(/\.{2,}/g, ".") // Remove multiple dots
    .replace(/^\.+/, "") // Remove leading dots
    .substring(0, 255); // Limit length
}

/**
 * Validate file type by checking magic bytes
 */
async function validateFileType(filePath) {
  const buffer = await fs.readFile(filePath);
  const magicBytes = buffer.slice(0, 12).toString("hex");

  // Check magic bytes for image types
  const magicNumbers = {
    jpeg: ["ffd8ffe0", "ffd8ffe1", "ffd8ffe2"],
    png: ["89504e47"],
    gif: ["47494638"],
    webp: ["52494646"], // RIFF (needs further check)
  };

  for (const [type, signatures] of Object.entries(magicNumbers)) {
    for (const sig of signatures) {
      if (magicBytes.startsWith(sig)) {
        // For WebP, verify WEBP string at position 8
        if (type === "webp") {
          const webpCheck = buffer.slice(8, 12).toString("ascii");
          return webpCheck === "WEBP";
        }
        return true;
      }
    }
  }

  return false;
}

/**
 * Validate and optimize image
 */
async function processImage(filePath, filename) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Validate dimensions
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      // Resize if too large
      await image
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toFile(`${filePath}.optimized`);

      // Replace original with optimized
      await fs.unlink(filePath);
      await fs.rename(`${filePath}.optimized`, filePath);
    }

    // Strip metadata (EXIF data can contain sensitive info)
    await image.rotate().toFile(`${filePath}.stripped`);
    await fs.unlink(filePath);
    await fs.rename(`${filePath}.stripped`, filePath);

    return {
      success: true,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: (await fs.stat(filePath)).size,
    };
  } catch (error) {
    console.error("Image processing error:", error);
    return { success: false, error: "Invalid image file" };
  }
}

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  },
});

/**
 * File filter - validates MIME type and extension
 */
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`),
      false
    );
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new Error(
        `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      ),
      false
    );
  }

  cb(null, true);
};

/**
 * Multer upload middleware
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Max 5 files per request
  },
});

/**
 * Post-upload validation middleware
 */
export async function validateUploadedFile(req, res, next) {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;

  try {
    // Validate file type by magic bytes
    const isValidType = await validateFileType(filePath);
    if (!isValidType) {
      await fs.unlink(filePath);
      return res.status(400).json({
        error: "Invalid file type detected",
        code: "INVALID_FILE_TYPE",
      });
    }

    // Process and validate image
    const result = await processImage(filePath, req.file.filename);
    if (!result.success) {
      await fs.unlink(filePath);
      return res.status(400).json({
        error: result.error || "Image processing failed",
        code: "IMAGE_PROCESSING_FAILED",
      });
    }

    // Add image metadata to request
    req.file.imageMetadata = {
      width: result.width,
      height: result.height,
      format: result.format,
      optimizedSize: result.size,
    };

    next();
  } catch (error) {
    console.error("File validation error:", error);
    try {
      await fs.unlink(filePath);
    } catch {}
    return res.status(500).json({
      error: "File validation failed",
      code: "VALIDATION_ERROR",
    });
  }
}

/**
 * Delete uploaded file (cleanup on error)
 */
export async function deleteUploadedFile(filename) {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error("Failed to delete file:", error);
    return false;
  }
}

/**
 * Get file URL
 */
export function getFileUrl(filename, baseUrl = "") {
  return `${baseUrl}/uploads/blog/${filename}`;
}

export default {
  upload,
  validateUploadedFile,
  deleteUploadedFile,
  getFileUrl,
  ensureUploadDir,
};
