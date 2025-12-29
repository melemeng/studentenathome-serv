export interface SeoOptions {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  jsonLd?: object;
}

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
  if (opts.canonical) {
    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = opts.canonical;
  }

  // Open Graph
  if (opts.title) upsertProperty("og:title", opts.title);
  if (opts.description) upsertProperty("og:description", opts.description);
  if (opts.canonical) upsertProperty("og:url", opts.canonical);
  if (opts.image) upsertProperty("og:image", opts.image);

  // Twitter
  if (opts.title) upsertMeta("twitter:title", opts.title);
  if (opts.description) upsertMeta("twitter:description", opts.description);
  if (opts.image) upsertMeta("twitter:image", opts.image);

  // JSON-LD structured data
  if (opts.jsonLd) {
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(opts.jsonLd);
  }
}

export default setMeta;
