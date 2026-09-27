import {
  getBrand,
  getCategories,
  getProducts,
  getMarkets,
  getFlagshipHandicraft,
  getIncoterms,
  categoryAsset,
} from "./company.js";
import {
  escapeHtml,
  getSiteContent,
  certGridHtml,
  trustStripHtml,
  faqHtml,
  specTableHtml,
} from "./content.js";

function flagshipHandicraftHtml({ showActions = true } = {}) {
  const lines = getFlagshipHandicraft();
  if (!lines.length) return "";
  const brand = getBrand();
  const sectionTitle =
    brand?.flagshipSectionTitle ??
    "Blue pottery leads. Brass completes the gift collection.";

  return `
    <section class="section wrap flagship-section">
      <p class="section-label reveal">Launch focus (v1)</p>
      <h2 class="section-title reveal">${escapeHtml(sectionTitle)}</h2>
      <div class="flagship-duo">
        ${lines
          .map(
            (line, i) => `
          <article class="flagship-card reveal" style="transition-delay: ${i * 0.08}s">
            <a class="flagship-image-link" href="#/products/${encodeURIComponent(line.productId)}">
              <img src="${line.asset}" width="320" height="240" alt="${escapeHtml(line.product?.imageAlt ?? line.headline)}" loading="lazy" />
            </a>
            <div class="flagship-body">
              <h3>${escapeHtml(line.headline)}</h3>
              <p>${escapeHtml(line.pitch)}</p>
              <div class="flagship-actions">
                <a class="btn btn-ghost" href="#/products/${encodeURIComponent(line.productId)}">View line</a>
                ${
                  showActions
                    ? `<a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(line.productId)}">Get in touch</a>`
                    : ""
                }
              </div>
            </div>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
}

function marketFocusHtml() {
  const focus = getBrand()?.marketFocus;
  if (!focus) return "";

  const primary = (focus.primary ?? []).join(", ");
  return `
    <section class="section wrap market-focus reveal">
      <p class="section-label">Who we are building for</p>
      <h2 class="section-title" style="font-size: 1.75rem">${escapeHtml(focus.headline ?? "EU gift and home décor importers")}</h2>
      <p class="section-lead">Primary outreach: ${escapeHtml(primary)}. ${escapeHtml(focus.notFirst ?? "")}</p>
    </section>`;
}

function heroVisualHtml(brand) {
  const hero = brand?.heroImage;
  const src = hero?.src ?? "assets/stock/blue-pottery-alt.jpg";
  const alt = hero?.alt ?? "Jaipur blue pottery, illustrative stock photo";
  const loadPort = brand?.ports?.load ?? "Mundra (FOB planned)";
  return `
        <figure class="hero-figure reveal" style="transition-delay: 0.1s">
          <img class="hero-photo" src="${src}" width="560" height="420" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />
          <figcaption class="hero-caption">Illustrative Jaipur blue pottery. Default load port: ${escapeHtml(loadPort)}</figcaption>
        </figure>`;
}

function homeBulletsHtml() {
  const bullets = getSiteContent()?.home?.bullets ?? [];
  if (!bullets.length) return "";
  return `<ul class="home-bullets reveal">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`;
}

export function homeView() {
  const brand = getBrand();
  const home = getSiteContent()?.home ?? {};
  const valueProp = home.valueProp ?? "Jaipur merchant export desk for EU gift and home décor importers.";

  return `
    <section class="hero wrap">
      <div class="hero-grid hero-grid--visual">
        <div class="reveal">
          <p class="hero-eyebrow">Jaipur, EU gift and home décor</p>
          <h1>Decorative <em>blue pottery</em> first, <em>brass</em> in the same collection.</h1>
          <p class="section-lead">${escapeHtml(valueProp)}</p>
          ${homeBulletsHtml()}
          ${trustStripHtml()}
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/contact">Get in touch</a>
            <a class="btn btn-ghost" href="#/products">Collections</a>
            <a class="btn btn-ghost" href="downloads/importer-brief.html" target="_blank" rel="noopener">Importer brief</a>
          </div>
        </div>
        ${heroVisualHtml(brand)}
      </div>
    </section>

    ${flagshipHandicraftHtml()}

    ${marketFocusHtml()}

    <section class="section wrap">
      <p class="section-label reveal">Next step</p>
      <h2 class="section-title reveal">See how we work with importers.</h2>
      <p class="section-lead reveal">Five step flow from qualification to bill of lading. Written terms before production.</p>
      <a class="btn btn-primary reveal" href="#/importers">For importers</a>
    </section>

    ${faqHtml()}

    <section class="section wrap cta-panel reveal">
      <div class="cta-panel-inner">
        <div>
          <p class="section-label" style="color: var(--gold)">Prelaunch</p>
          <h2 class="section-title" style="margin-bottom: 0.5rem">Early conversations welcome.</h2>
          <p class="section-lead" style="margin: 0">EU gift and décor buyers first: Sweden, Germany, Denmark, Netherlands.</p>
        </div>
        <a class="btn btn-primary" href="#/contact">Contact</a>
      </div>
    </section>
  `;
}

export function productsView(activeCategory = "handicraft") {
  const categories = getCategories();

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Collections</p>
      <h1 class="section-title reveal">Blue pottery and brass are live.</h1>
      <p class="section-lead reveal">
        Decorative blue pottery and brass gift décor are open for importer quotes. Textiles, agro, and stone are coming soon.
      </p>
      <div class="products-toolbar reveal" data-filters>
        ${categories
          .map(
            (c) => `
          <button type="button" class="filter-chip ${c.id === activeCategory ? "is-active" : ""}"
            data-filter="${c.id}">${c.label}</button>`
          )
          .join("")}
      </div>
      <div class="product-grid" data-product-grid>
        ${renderProductGrid(activeCategory)}
      </div>
    </section>
  `;
}

function productComingSoonVisual(p) {
  return `<span class="product-visual-fallback product-visual-fallback--soon" data-pattern="${p.pattern}"><span class="product-coming-soon-label">Coming soon</span></span>`;
}

function productCardHtml(p) {
  const categories = getCategories();
  const catLabel = categories.find((c) => c.id === p.category)?.label ?? p.category;
  const comingSoon = p.launchScope === "roadmap";
  const visual = comingSoon
    ? productComingSoonVisual(p)
    : p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.imageAlt ?? p.name)}" loading="lazy" decoding="async" />`
      : `<span class="product-visual-fallback" data-pattern="${p.pattern}"></span>`;
  const scope = p.launchScope === "v1" ? "Launch v1" : comingSoon ? "Coming soon" : "";
  const scopeBadge = scope
    ? `<span class="product-scope ${p.launchScope === "v1" ? "is-v1" : "is-soon"}">${scope}</span>`
    : "";
  const roadmapClass = comingSoon ? " product-card--roadmap" : "";

  return `
    <article class="product-card reveal${roadmapClass}" data-product-id="${p.id}">
      <a class="product-visual product-visual-link" href="#/products/${encodeURIComponent(p.id)}">${visual}</a>
      <div class="product-body">
        <div class="product-meta">
          <span class="product-cat">${escapeHtml(catLabel)}</span>
          ${scopeBadge}
          ${comingSoon ? "" : `<span class="product-moq">${escapeHtml(p.moq)}</span>`}
        </div>
        <h3><a href="#/products/${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></h3>
        <p>${escapeHtml(p.description)}</p>
        ${p.westNote ? `<p class="product-note">${escapeHtml(p.westNote)}</p>` : ""}
        ${
          comingSoon
            ? ""
            : `<p class="product-moq" style="margin-bottom: 0.75rem">Lead: ${escapeHtml(p.lead)}${p.hsHint ? `, ${escapeHtml(p.hsHint)}` : ""}</p>`
        }
        <div class="product-actions">
          ${
            comingSoon
              ? `<a class="btn btn-ghost" href="#/products/${encodeURIComponent(p.id)}">Learn more</a>
                 <a class="btn btn-primary" href="#/contact?product=blue-pottery">Quote launch lines</a>`
              : `<a class="btn btn-ghost" href="#/products/${encodeURIComponent(p.id)}">Details</a>
                 <a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(p.id)}">Get in touch</a>`
          }
        </div>
      </div>
    </article>
  `;
}

export function productDetailView(productId) {
  const product = getProducts().find((p) => p.id === productId);
  if (!product) {
    return `
      <section class="page-hero wrap">
        <h1 class="section-title">Line not found</h1>
        <p class="section-lead"><a href="#/products">Back to collections</a></p>
      </section>`;
  }

  const comingSoon = product.launchScope === "roadmap";
  const bullets = product.detailBullets ?? [];

  if (comingSoon) {
    return `
    <section class="page-hero wrap product-detail">
      <p class="section-label reveal"><a href="#/products">Collections</a></p>
      <h1 class="section-title reveal">${escapeHtml(product.name)}</h1>
      <p class="section-lead reveal">${escapeHtml(product.description)}</p>
      <div class="product-detail-grid reveal">
        <div class="product-detail-visual product-detail-visual--soon">
          ${productComingSoonVisual(product)}
        </div>
        <div class="product-detail-spec">
          <p class="detail-note"><strong>Status.</strong> Coming soon. This line is not open for quotes yet.</p>
          <p class="form-note">We are focused on decorative blue pottery and brass gift décor for EU importers in v1.</p>
          <a class="btn btn-primary" href="#/contact?product=blue-pottery">Quote launch lines</a>
          <a class="btn btn-ghost" href="#/products">Back to collections</a>
        </div>
      </div>
    </section>
  `;
  }

  const imgSrc = product.image ?? categoryAsset(product.category);

  return `
    <section class="page-hero wrap product-detail">
      <p class="section-label reveal"><a href="#/products">Collections</a></p>
      <h1 class="section-title reveal">${escapeHtml(product.name)}</h1>
      <p class="section-lead reveal">${escapeHtml(product.description)}</p>
      <div class="product-detail-grid reveal">
        <div class="product-detail-visual">
          ${imgSrc ? `<img src="${imgSrc}" alt="${escapeHtml(product.imageAlt ?? product.name)}" loading="lazy" />` : ""}
          <p class="form-note">Illustrative stock photo until maker shoots are live.</p>
        </div>
        <div class="product-detail-spec">
          ${specTableHtml(product, getIncoterms())}
          ${
            bullets.length
              ? `<ul class="detail-bullets">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
              : ""
          }
          ${product.complianceNote ? `<p class="detail-note"><strong>Compliance.</strong> ${escapeHtml(product.complianceNote)}</p>` : ""}
          ${product.packingNote ? `<p class="detail-note"><strong>Packing.</strong> ${escapeHtml(product.packingNote)}</p>` : ""}
          <a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(product.id)}">Request quote</a>
        </div>
      </div>
    </section>
  `;
}

export function importersView() {
  const data = getSiteContent()?.importers ?? {};
  const steps = data.steps ?? [];

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">For importers</p>
      <h1 class="section-title reveal">${escapeHtml(data.title ?? "For importers")}</h1>
      <p class="section-lead reveal">${escapeHtml(data.lead ?? "")}</p>
      <p class="reveal"><a class="btn btn-ghost" href="downloads/importer-brief.html" target="_blank" rel="noopener">${escapeHtml(data.downloadLabel ?? "Download importer brief")}</a></p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="timeline">
        ${steps
          .map(
            (s, i) => `
          <div class="timeline-item reveal">
            <strong>Step ${i + 1}. ${escapeHtml(s.title)}</strong>
            ${escapeHtml(s.body)}
          </div>`
          )
          .join("")}
      </div>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <a class="btn btn-primary" href="#/contact">Start a conversation</a>
    </section>
  `;
}

export function exportView() {
  const data = getSiteContent()?.export ?? {};
  const incRows = data.incotermNotes ?? [];
  const docs = data.documentsHandicraft ?? [];
  const packing = data.packingSummary ?? [];

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Export</p>
      <h1 class="section-title reveal">${escapeHtml(data.title ?? "Export and compliance")}</h1>
      <p class="section-lead reveal">${escapeHtml(data.lead ?? "")}</p>
      <p class="section-lead reveal">Default bulk term: <strong>${escapeHtml(data.defaultIncoterm ?? "FOB Mundra")}</strong></p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Incoterms we quote</h2>
      <div class="overlap-table reveal">
        <table>
          <thead><tr><th>Term</th><th>Typical use</th></tr></thead>
          <tbody>
            ${incRows.map((r) => `<tr><td>${escapeHtml(r.term)}</td><td>${escapeHtml(r.use)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="form-note reveal">${escapeHtml(getBrand()?.incotermsPublicNote ?? "")}</p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Documents (handicraft v1)</h2>
      <ul class="doc-list reveal">${docs.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Packing summary</h2>
      <ul class="doc-list reveal">${packing.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
      <p class="detail-note reveal">${escapeHtml(data.complianceDecorative ?? "")}</p>
    </section>
    ${certGridHtml()}
  `;
}

function overlapTableHtml() {
  const markets = getBrand()?.westernMarkets ?? [];
  if (!markets.length) return "";

  return `
    <div class="overlap-table reveal">
      <table>
        <thead>
          <tr><th>Market</th><th>Planned call window (IST)</th></tr>
        </thead>
        <tbody>
          ${markets.map((m) => `<tr><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.overlap)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

export function aboutView() {
  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">About</p>
      <h1 class="section-title reveal">Jaipur on the ground, paperwork first when we launch.</h1>
      <p class="section-lead reveal">
        Merchant export desk: curated makers, export packing, and paperwork aligned for EU gift and home décor buyers. Not live yet. IEC, maker QC, and EU compliance files in progress.
      </p>
    </section>
    ${certGridHtml()}
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Call overlap (planned)</h2>
      <p class="section-lead reveal">Scandinavia and EU first. UK and US for reference, not v1 commercial focus.</p>
      ${overlapTableHtml()}
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="timeline">
        <div class="timeline-item reveal">
          <strong>Quality</strong>
          Pre shipment inspection and AQL agreed before production.
        </div>
        <div class="timeline-item reveal">
          <strong>Compliance</strong>
          Decorative v1: GPSR and REACH with EU importer partner. Not for food contact in v1.
        </div>
        <div class="timeline-item reveal">
          <strong>Communication</strong>
          One account manager, English first documents, weekly PO updates.
        </div>
      </div>
    </section>
  `;
}

export function contactView(prefill = {}) {
  const { productId = "", message = "" } = prefill;
  const products = getProducts();
  const launchProducts = products.filter((p) => p.launchScope === "v1");
  const quoteProductId =
    launchProducts.find((p) => p.id === productId)?.id ?? launchProducts[0]?.id ?? "";
  const product = launchProducts.find((p) => p.id === quoteProductId);
  const defaultMessage =
    message ||
    (product ? `Interested in: ${product.name} (${product.moq}). ` : "");

  const brand = getBrand();
  const moqBands = getSiteContent()?.contact?.moqBands ?? [];
  const terms = getIncoterms();

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Contact</p>
      <h1 class="section-title reveal">Say hello during setup.</h1>
      <p class="section-lead reveal">
        Confirm market, incoterm, product line, and MOQ band. We open your email client with a draft message. Replies when the trade desk is live.
      </p>
      <p class="reveal"><a href="downloads/importer-brief.html" target="_blank" rel="noopener">Importer brief (print or save as PDF)</a></p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="contact-layout contact-layout--simple">
        <form class="contact-form reveal" data-contact-form>
          <div class="form-row">
            <div class="field">
              <label for="name">Name</label>
              <input id="name" name="name" required autocomplete="name" />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required autocomplete="email" />
            </div>
          </div>
          <div class="field">
            <label for="company">Company</label>
            <input id="company" name="company" autocomplete="organization" />
          </div>
          <div class="form-row">
            <div class="field">
              <label for="market">Primary market</label>
              <select id="market" name="market">
                <option value="">Select</option>
                ${importMarketsOptions()}
              </select>
            </div>
            <div class="field">
              <label for="incoterm">Incoterm preference</label>
              <select id="incoterm" name="incoterm">
                <option value="">Select</option>
                ${terms.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="productLine">Product line</label>
              <select id="productLine" name="productLine">
                <option value="">Select</option>
                ${launchProducts
                  .map(
                    (p) =>
                      `<option value="${escapeHtml(p.id)}" ${p.id === quoteProductId ? "selected" : ""}>${escapeHtml(p.name)}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="field">
              <label for="moqBand">Target MOQ band</label>
              <select id="moqBand" name="moqBand">
                <option value="">Select</option>
                ${moqBands.map((b) => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="Destination port, timeline, certification needs">${escapeHtml(defaultMessage)}</textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%">Send via email draft</button>
          <p class="form-note">
            Saves a copy in your browser. Email draft to
            <a href="mailto:${brand?.contact?.email ?? "trade@jaatglobal.com"}">${brand?.contact?.email ?? "trade@jaatglobal.com"}</a>
          </p>
        </form>
      </div>
    </section>
  `;
}

function importMarketsOptions() {
  return getMarkets()
    .map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`)
    .join("");
}

export function renderProductGrid(activeCategory) {
  const products = getProducts();
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);
  return filtered.map((p) => productCardHtml(p)).join("");
}

export const routeMeta = {
  "/": {
    title: "Jaat Global | EU gift importers, prelaunch",
    description: "Jaipur export desk for decorative blue pottery and brass gift décor. EU buyers, FOB Mundra.",
  },
  "/products": {
    title: "Jaat Global | Collections",
    description: "Blue pottery and brass gift décor live now. Other collections coming soon.",
  },
  "/importers": {
    title: "Jaat Global | For importers",
    description: "Five step flow from samples to shipping documents for EU gift buyers.",
  },
  "/export": {
    title: "Jaat Global | Export and compliance",
    description: "Incoterms EXW to CIF, documents, packing, GPSR and REACH path for decorative v1.",
  },
  "/about": {
    title: "Jaat Global | About",
    description: "Merchant export desk in Jaipur. Registrations and call windows.",
  },
  "/contact": {
    title: "Jaat Global | Contact",
    description: "Reach the trade desk with market, incoterm, and product line.",
  },
};
