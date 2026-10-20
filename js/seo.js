import { assetUrl } from "./paths.js";

/**
 * Fallback when brand JSON has not loaded yet (must match brand/company.json web.publicUrl).
 * Planned production URL: https://jaatglobal.com/ (see web.plannedPublicUrl). On cutover, also update
 * index.html canonical/og/json-ld, robots.txt, sitemap.xml, and GitHub Pages custom domain.
 */
export const DEFAULT_PUBLIC_SITE_URL = "https://gauraviiitg.github.io/Code_overflow/";

export function normalizePublicSiteUrl(url) {
  if (!url || typeof url !== "string") return DEFAULT_PUBLIC_SITE_URL;
  return url.endsWith("/") ? url : `${url}/`;
}

export function getPublicSiteUrl(brand) {
  if (brand?.web?.publicUrl) return normalizePublicSiteUrl(brand.web.publicUrl);
  if (typeof window !== "undefined" && window.__JAAT_SITE_ROOT) {
    return normalizePublicSiteUrl(window.__JAAT_SITE_ROOT);
  }
  return DEFAULT_PUBLIC_SITE_URL;
}

function upsertMeta(selector, attrs) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "property" || key === "name") el.setAttribute(key, value);
    });
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "content") el.setAttribute("content", value);
    else if (key === "property" || key === "name") el.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Sync title, description, canonical, and social tags after route or boot. */
export function applySeo({ title, description, path, brand }) {
  const siteUrl = getPublicSiteUrl(brand);
  const pageUrl = path && path !== "/" ? `${siteUrl}#${path}` : siteUrl;

  document.title = title;
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertLink("canonical", siteUrl);

  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: pageUrl });
  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: brand?.name ?? "Jaat Global",
  });

  const ogImagePath = brand?.web?.ogImage ?? brand?.heroImage?.src ?? "assets/stock/blue-pottery.jpg";
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: assetUrl(ogImagePath) });
  upsertMeta('meta[property="og:image:alt"]', {
    property: "og:image:alt",
    content: brand?.heroImage?.alt ?? "Jaipur blue pottery export from Jaat Global",
  });

  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: assetUrl(ogImagePath) });

  const verification = brand?.web?.googleSiteVerification?.trim();
  if (verification) {
    upsertMeta('meta[name="google-site-verification"]', {
      name: "google-site-verification",
      content: verification,
    });
  }
}

export function injectOrganizationJsonLd(brand) {
  const siteUrl = getPublicSiteUrl(brand);
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: brand?.name ?? "Jaat Global",
        url: siteUrl,
        email: brand?.contact?.email ?? "trade@jaatglobal.com",
        description:
          "Jaipur export company sourcing blue pottery, Sanganeri hand block print, and Bagru hand block print for international importers.",
        areaServed: ["European Union", "United Kingdom", "United Arab Emirates"],
        address: {
          "@type": "PostalAddress",
          addressLocality: brand?.location?.city ?? "Jaipur",
          addressRegion: brand?.location?.state ?? "Rajasthan",
          postalCode: brand?.location?.postal ?? "302001",
          addressCountry: brand?.location?.country ?? "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: brand?.name ?? "Jaat Global",
        publisher: { "@id": `${siteUrl}#organization` },
        inLanguage: "en",
      },
    ],
  };

  let script = document.querySelector('script[type="application/ld+json"][data-seo="org"]');
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "org");
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}
