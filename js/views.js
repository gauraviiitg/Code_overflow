import {
  getBrand,
  getCategories,
  getProducts,
  getMarkets,
  getFlagshipHandicraft,
  categoryAsset,
} from "./company.js";

function flagshipHandicraftHtml({ showActions = true } = {}) {
  const lines = getFlagshipHandicraft();
  if (!lines.length) return "";

  return `
    <section class="section wrap flagship-section">
      <p class="section-label reveal">Flagship lines</p>
      <h2 class="section-title reveal">Brass and blue pottery — equal focus.</h2>
      <div class="flagship-duo">
        ${lines
          .map(
            (line, i) => `
          <article class="flagship-card reveal" style="transition-delay: ${i * 0.08}s">
            <img src="${line.asset}" width="320" height="240" alt="" loading="lazy" />
            <div class="flagship-body">
              <h3>${line.headline}</h3>
              <p>${line.pitch}</p>
              ${
                showActions
                  ? `<a class="btn btn-ghost" href="#/contact?product=${encodeURIComponent(line.productId)}">Get in touch</a>`
                  : ""
              }
            </div>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
}

function processStepsHtml() {
  const steps = [
    ["Brief & specs", "Market, certifications, incoterms — in writing."],
    ["Sample & quote", "Strike-offs and USD/EUR options when we launch."],
    ["Production", "PO lock, milestone photos, optional third-party inspection."],
    ["Documentation", "Invoice, packing list, COO — broker-ready."],
    ["Dispatch", "FOB Mundra or CIF — tracking same day."],
  ];
  return `
    <div class="process-steps">
      ${steps
        .map(
          ([h, p]) => `
        <div class="process-step reveal">
          <h4>${h}</h4>
          <p>${p}</p>
        </div>`
        )
        .join("")}
    </div>`;
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
          ${markets.map((m) => `<tr><td>${m.name}</td><td>${m.overlap}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

export function homeView() {
  const brand = getBrand();
  const loadPort = brand?.ports?.load ?? "Mundra (FOB — planned)";

  return `
    <section class="hero wrap">
      <div class="hero-grid hero-grid--visual">
        <div class="reveal">
          <p class="hero-eyebrow">Jaipur · Western importers</p>
          <h1>Export desk for <em>brass</em> and <em>blue pottery</em> — built before we ship.</h1>
          <p class="section-lead">
            We’re not trading yet. This site shares our direction: two flagship crafts from Jaipur, plus textiles, agro, and stone as we validate makers and compliance.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/contact">Get in touch</a>
            <a class="btn btn-ghost" href="#/products">Draft catalogue</a>
          </div>
        </div>
        <figure class="hero-figure reveal" style="transition-delay: 0.1s">
          <img class="hero-map" src="assets/hero-corridor.svg" width="560" height="420" alt="Stylised route from Jaipur toward Western ports" />
          <figcaption class="hero-caption">Planned load port: ${loadPort}</figcaption>
        </figure>
      </div>
    </section>

    ${flagshipHandicraftHtml()}

    <section class="section wrap">
      <p class="section-label reveal">Planned workflow</p>
      <h2 class="section-title reveal">How we intend to work with importers.</h2>
      ${processStepsHtml()}
    </section>

    <section class="section wrap cta-panel reveal">
      <div class="cta-panel-inner">
        <div>
          <p class="section-label" style="color: var(--gold)">Pre-launch</p>
          <h2 class="section-title" style="margin-bottom: 0.5rem">Early conversations welcome.</h2>
          <p class="section-lead" style="margin: 0">UK, EU, US, and Canada buyers — say hello before we go live.</p>
        </div>
        <a class="btn btn-primary" href="#/contact">Contact</a>
      </div>
    </section>
  `;
}

export function productsView(activeCategory = "all") {
  const products = getProducts();
  const categories = getCategories();
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Catalogue</p>
      <h1 class="section-title reveal">Lines we’re preparing.</h1>
      <p class="section-lead reveal">
        Indicative MOQs and lead times while we confirm with makers. Pricing when the desk is live.
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
        ${filtered.map((p) => productCardHtml(p)).join("")}
      </div>
    </section>
  `;
}

function productCardHtml(p) {
  const categories = getCategories();
  const catLabel = categories.find((c) => c.id === p.category)?.label ?? p.category;
  const asset = categoryAsset(p.category);
  const visual = asset
    ? `<img src="${asset}" alt="" loading="lazy" />`
    : `<span class="product-visual-fallback" data-pattern="${p.pattern}"></span>`;

  return `
    <article class="product-card reveal" data-product-id="${p.id}">
      <div class="product-visual">${visual}</div>
      <div class="product-body">
        <div class="product-meta">
          <span class="product-cat">${catLabel}</span>
          <span class="product-moq">${p.moq}</span>
        </div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="product-moq" style="margin-bottom: 0.75rem">Lead: ${p.lead}</p>
        <a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(p.id)}">Get in touch</a>
      </div>
    </article>
  `;
}

export function aboutView() {
  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">About</p>
      <h1 class="section-title reveal">Jaipur on the ground — paperwork-first when we launch.</h1>
      <p class="section-lead reveal">
        We’re building a single desk that keeps samples, production, and invoices aligned for Western buyers.
        The company is not live yet; registrations and partner mills are still coming together.
      </p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Call overlap (planned)</h2>
      <p class="section-lead reveal">Windows we’re designing around for UK, EU, and North America.</p>
      ${overlapTableHtml()}
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="timeline">
        <div class="timeline-item reveal">
          <strong>Quality</strong>
          Pre-shipment inspection and AQL agreed before production.
        </div>
        <div class="timeline-item reveal">
          <strong>Compliance</strong>
          HS support, food COAs, and retail labels by product type.
        </div>
        <div class="timeline-item reveal">
          <strong>Communication</strong>
          One account manager, English-first documents, weekly PO updates.
        </div>
      </div>
    </section>
  `;
}

export function contactView(prefill = {}) {
  const { productId = "", message = "" } = prefill;
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  const defaultMessage =
    message ||
    (product ? `Interested in: ${product.name} (${product.moq}). ` : "");

  const brand = getBrand();

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Contact</p>
      <h1 class="section-title reveal">Say hello during setup.</h1>
      <p class="section-lead reveal">
        Tell us what you import and where you ship. We read every note — replies when the trade desk is live.
      </p>
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
            <label for="company">Company (optional)</label>
            <input id="company" name="company" autocomplete="organization" />
          </div>
          <div class="field">
            <label for="market">Primary market</label>
            <select id="market" name="market">
              <option value="">Select if relevant</option>
              ${importMarketsOptions()}
            </select>
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="What you buy, destination, timeline…">${escapeHtml(defaultMessage)}</textarea>
          </div>
          ${productId ? `<input type="hidden" name="product" value="${escapeHtml(productId)}" />` : ""}
          <button type="submit" class="btn btn-primary" style="width: 100%">Send</button>
          <p class="form-note">
            Pre-launch: saved in your browser only. Live email:
            <a href="mailto:${brand?.contact?.email ?? "trade@jaatglobal.com"}">${brand?.contact?.email ?? "trade@jaatglobal.com"}</a>
          </p>
        </form>
      </div>
    </section>
  `;
}

function importMarketsOptions() {
  return getMarkets()
    .map((m) => `<option value="${m}">${m}</option>`)
    .join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderProductGrid(activeCategory) {
  const products = getProducts();
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);
  return filtered.map((p) => productCardHtml(p)).join("");
}
