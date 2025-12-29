export interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: object;
}

const BASE_URL = "https://www.studentenathome.de";

function upsertMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertProperty(prop: string, content: string) {
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setMeta(opts: SeoOptions) {
  if (opts.title) document.title = opts.title;

  if (opts.description) upsertMeta("description", opts.description);

  // Build full canonical URL
  const fullCanonical = opts.canonical?.startsWith("http")
    ? opts.canonical
    : `${BASE_URL}${opts.canonical || ""}`;

  if (opts.canonical) {
    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = fullCanonical;
  }

  // Open Graph
  if (opts.title) upsertProperty("og:title", opts.title);
  if (opts.description) upsertProperty("og:description", opts.description);
  if (opts.canonical) upsertProperty("og:url", fullCanonical);
  if (opts.image) {
    const fullImage = opts.image.startsWith("http")
      ? opts.image
      : `${BASE_URL}${opts.image}`;
    upsertProperty("og:image", fullImage);
  }
  if (opts.type) upsertProperty("og:type", opts.type);

  // Twitter
  if (opts.title) upsertMeta("twitter:title", opts.title);
  if (opts.description) upsertMeta("twitter:description", opts.description);
  if (opts.image) {
    const fullImage = opts.image.startsWith("http")
      ? opts.image
      : `${BASE_URL}${opts.image}`;
    upsertMeta("twitter:image", fullImage);
  }

  // JSON-LD structured data
  if (opts.jsonLd) {
    let script = document.querySelector(
      'script[type="application/ld+json"]#dynamic-schema'
    );
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("id", "dynamic-schema");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(opts.jsonLd);
  }
}

export default setMeta;
