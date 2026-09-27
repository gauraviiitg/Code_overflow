const fallbackSite = {
  home: {
    valueProp: "Jaipur merchant export desk for EU gift and home décor importers.",
    bullets: ["v1 handicraft from Jaipur", "FOB Mundra default", "Prelaunch"],
    trustStrip: [],
    faq: [],
  },
  importers: { title: "For importers", lead: "", steps: [] },
  export: { title: "Export and compliance", lead: "", documentsHandicraft: [] },
};

const fallbackCerts = { badges: [], displayPolicy: "" };

const state = {
  site: fallbackSite,
  certs: fallbackCerts,
};

export async function initSiteContent() {
  try {
    const { companyUrl } = await import("./paths.js");
    const [siteRes, certRes] = await Promise.all([
      fetch(companyUrl("brand/site-content.json")),
      fetch(companyUrl("legal/public-certifications.json")),
    ]);
    if (siteRes.ok) state.site = await siteRes.json();
    if (certRes.ok) state.certs = await certRes.json();
  } catch {
    /* use fallbacks */
  }
}

export function getSiteContent() {
  return state.site;
}

export function getCertifications() {
  return state.certs;
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function certGridHtml() {
  const { badges = [], displayPolicy } = getCertifications();
  if (!badges.length) return "";

  return `
    <section class="section wrap cert-section">
      <p class="section-label reveal">Registrations</p>
      <h2 class="section-title reveal" style="font-size: 1.75rem">What we can share today</h2>
      ${displayPolicy ? `<p class="section-lead reveal">${escapeHtml(displayPolicy)}</p>` : ""}
      <div class="cert-grid reveal">
        ${badges
          .map(
            (b) => `
          <article class="cert-card">
            <div class="cert-seal">${escapeHtml(b.label)}</div>
            <h3>${escapeHtml(b.title)}</h3>
            <p class="cert-status">${escapeHtml(b.status)}</p>
            <p class="cert-note">${escapeHtml(b.publicNote)}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
}

export function trustStripHtml() {
  const strip = getSiteContent()?.home?.trustStrip ?? [];
  if (!strip.length) return "";

  return `
    <div class="trust-strip reveal">
      ${strip
        .map(
          (item) => `
        <div class="trust-strip-item">
          <span class="trust-strip-label">${escapeHtml(item.label)}</span>
          <span class="trust-strip-value">${escapeHtml(item.value)}</span>
        </div>`
        )
        .join("")}
    </div>`;
}

export function faqHtml() {
  const home = getSiteContent()?.home ?? {};
  const faq = home.faq ?? [];
  if (!faq.length) return "";

  return `
    <section class="section wrap">
      <p class="section-label reveal">${escapeHtml(home.faqTitle ?? "FAQ")}</p>
      <div class="faq-list">
        ${faq
          .map(
            (item) => `
          <details class="faq-item reveal">
            <summary>${escapeHtml(item.q)}</summary>
            <p>${escapeHtml(item.a)}</p>
          </details>`
          )
          .join("")}
      </div>
    </section>`;
}

export function specTableHtml(product, incoterms) {
  const rows = [
    ["MOQ", product.moq],
    ["Sample programme", product.sampleMoq ?? "On request"],
    ["Lead time", product.lead],
    ["HS chapter", product.hsHint ?? ""],
    ["Scope", product.launchScope === "v1" ? "Launch v1" : "Roadmap"],
    ["Incoterms offered", (incoterms ?? []).join(", ")],
  ].filter(([, v]) => v);

  return `
    <table class="spec-table">
      <tbody>
        ${rows
          .map(
            ([k, v]) => `
          <tr><th scope="row">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}
