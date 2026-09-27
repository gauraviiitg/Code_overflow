import {
  getBrand,
  getCategories,
  getProducts,
  getMarkets,
  getFlagshipHandicraft,
  getIncoterms,
  categoryAsset,
} from "./company.js";

function flagshipHandicraftHtml({ showActions = true } = {}) {
  const lines = getFlagshipHandicraft();
  if (!lines.length) return "";
  const brand = getBrand();
  const sectionTitle =
    brand?.flagshipSectionTitle ??
    "Blue pottery leads — brass completes the gift collection.";

  return `
    <section class="section wrap flagship-section">
      <p class="section-label reveal">Launch focus (v1)</p>
      <h2 class="section-title reveal">${sectionTitle}</h2>
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
    ["Brief & specs", "EU destination, incoterms (EXW–CIF), decorative vs food — in writing."],
    ["Sample & quote", "Strike-offs, drop-test packing plan, USD/EUR when we launch."],
    ["Production", "PO lock, milestone photos, optional third-party inspection."],
    ["Documentation", "Invoice, packing list, COO, compliance folder for GPSR/REACH path."],
    ["Dispatch", "FOB Mundra or CIF named port — buyer handles import unless CIF agreed."],
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

function marketFocusHtml() {
  const focus = getBrand()?.marketFocus;
  if (!focus) return "";

  const primary = (focus.primary ?? []).join(", ");
  return `
    <section class="section wrap market-focus reveal">
      <p class="section-label">Who we’re building for</p>
      <h2 class="section-title" style="font-size: 1.75rem">${focus.headline ?? "EU gift & home décor importers"}</h2>
      <p class="section-lead">Primary outreach: ${primary}. ${focus.notFirst ?? ""}</p>
    </section>`;
}

export function homeView() {
  const brand = getBrand();
  const loadPort = brand?.ports?.load ?? "Mundra (FOB — planned)";

  return `
    <section class="hero wrap">
      <div class="hero-grid hero-grid--visual">
        <div class="reveal">
          <p class="hero-eyebrow">Jaipur · EU gift & home décor</p>
          <h1>Decorative <em>blue pottery</em> first — <em>brass</em> in the same collection.</h1>
          <p class="section-lead">
            We’re not trading yet. This site shares our research-backed direction: Jaipur craft for EU importers (Sweden, Germany, Denmark, Netherlands), decorative ceramics only in v1, FOB Mundra when we go live. Textiles, agro, and stone stay on the roadmap.
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

    ${marketFocusHtml()}

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
          <p class="section-lead" style="margin: 0">EU gift and décor buyers first — Sweden, Germany, Denmark, Netherlands. Early hellos welcome before we go live.</p>
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
        v1 is handicraft only (decorative blue pottery + brass décor). Other lines are roadmap. Indicative MOQs while we confirm with Jaipur makers — pricing when the desk is live.
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
  const scope = p.launchScope === "v1" ? "Launch v1" : p.launchScope === "roadmap" ? "Roadmap" : "";
  const scopeBadge = scope
    ? `<span class="product-scope ${p.launchScope === "v1" ? "is-v1" : "is-roadmap"}">${scope}</span>`
    : "";

  return `
    <article class="product-card reveal" data-product-id="${p.id}">
      <div class="product-visual">${visual}</div>
      <div class="product-body">
        <div class="product-meta">
          <span class="product-cat">${catLabel}</span>
          ${scopeBadge}
          <span class="product-moq">${p.moq}</span>
        </div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        ${p.westNote ? `<p class="product-note">${p.westNote}</p>` : ""}
        <p class="product-moq" style="margin-bottom: 0.75rem">Lead: ${p.lead}${p.hsHint ? ` · ${p.hsHint}` : ""}</p>
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
        We’re building a merchant export desk in Jaipur: curated makers, export packing, and paperwork aligned for EU gift and home décor buyers. The company is not live yet — IEC, maker QC, and EU compliance files are still in progress.
      </p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Call overlap (planned)</h2>
      <p class="section-lead reveal">Call windows for Scandinavia and EU first; UK and US listed for reference — not our v1 commercial focus.</p>
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
          Decorative v1: GPSR and REACH (glaze/metal) with EU importer partner — not for food contact. Food or DDP programmes out of scope until explicitly quoted.
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
        Tell us what you import, EU destination, and preferred incoterm. We read every note — replies when the trade desk is live.
      </p>
      ${incotermsPanelHtml()}
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

function incotermsPanelHtml() {
  const terms = getIncoterms();
  const note = getBrand()?.incotermsPublicNote;
  if (!terms?.length && !note) return "";

  return `
    <div class="incoterms-panel reveal" style="margin-bottom: 2rem">
      <p class="section-label">Incoterms (planned)</p>
      <ul class="incoterms-list">
        ${(terms ?? []).map((t) => `<li>${t}</li>`).join("")}
      </ul>
      ${note ? `<p class="form-note">${note}</p>` : ""}
    </div>`;
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
