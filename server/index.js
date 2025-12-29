const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const compression = require("compression");

const app = express();

// Compression middleware (Gzip)
app.use(compression());

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const DATA_DIR = path.join(__dirname, "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "demo-token";
const CANONICAL_BASE =
  process.env.CANONICAL_BASE_URL || "https://studentenathome.de";

function readPosts() {
  try {
    if (!fs.existsSync(POSTS_FILE)) return [];
    const raw = fs.readFileSync(POSTS_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error("readPosts error", e);
    return [];
  }
}

function writePosts(posts) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("writePosts error", e);
    return false;
  }
}

app.get("/api/posts", (req, res) => {
  const posts = readPosts();
  // Add cache headers for better performance
  res.set("Cache-Control", "public, max-age=300"); // 5 minutes
  res.json(posts);
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
app.get("/sitemap.xml", (req, res) => {
  try {
    const posts = readPosts();
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
          p.updatedAt || p.publishedAt || new Date().toISOString();
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

app.post("/api/posts", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const post = req.body;
  if (!post || !post.id) return res.status(400).json({ error: "Invalid post" });

  const posts = readPosts();
  posts.push(post);
  const ok = writePosts(posts);
  if (!ok) return res.status(500).json({ error: "Failed to save post" });
  res.status(201).json(post);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
