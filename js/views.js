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
import { assetUrl } from "./paths.js";

function mediaSrc(path) {
  if (!path) return "";
  return escapeHtml(assetUrl(path));
}

function flagshipHandicraftHtml({ showActions = true } = {}) {
  const lines = getFlagshipHandicraft();
  if (!lines.length) return "";
  const brand = getBrand();
  const sectionTitle =
    brand?.flagshipSectionTitle ??
    "Blue pottery leads. Brass completes the gift collection.";

  return `
    <section class="section wrap flagship-section">
      <p class="section-label reveal">Products</p>
      <h2 class="section-title reveal">${escapeHtml(sectionTitle)}</h2>
      <div class="flagship-duo">
        ${lines
          .map(
            (line, i) => `
          <article class="flagship-card reveal" style="transition-delay: ${i * 0.08}s">
            <a class="flagship-image-link" href="#/products/${encodeURIComponent(line.productId)}">
              <img src="${mediaSrc(line.asset)}" width="320" height="240" alt="${escapeHtml(line.product?.imageAlt ?? line.headline)}" loading="lazy" />
            </a>
            <div class="flagship-body">
              <h3>${escapeHtml(line.headline)}</h3>
              <p>${escapeHtml(line.pitch)}</p>
              <div class="flagship-actions">
                <a class="btn btn-ghost" href="#/products/${encodeURIComponent(line.productId)}">View line</a>
                ${
                  showActions
                    ? `<a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(line.productId)}">Request a quote</a>`
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

function heroVisualHtml(brand) {
  const hero = brand?.heroImage;
  const src = hero?.src ?? "assets/stock/blue-pottery-alt.jpg";
  const alt = hero?.alt ?? "Jaipur blue pottery, illustrative stock photo";
  return `
        <figure class="hero-figure reveal" style="transition-delay: 0.1s">
          <img class="hero-photo" src="${mediaSrc(src)}" width="560" height="420" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />
          <figcaption class="hero-caption">Sample photo. Your order uses approved product and packing images.</figcaption>
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
  const valueProp =
    home.valueProp ??
    "Jaipur blue pottery and brass gift décor for importers and retailers.";

  return `
    <section class="hero wrap">
      <div class="hero-grid hero-grid--visual">
        <div class="reveal">
          <p class="hero-eyebrow">Jaat Global · Jaipur</p>
          <h1>Blue pottery and brass décor, packed and shipped for <em>your market</em>.</h1>
          <p class="section-lead">${escapeHtml(valueProp)}</p>
          ${homeBulletsHtml()}
          ${trustStripHtml()}
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/contact">Request a quote</a>
            <a class="btn btn-ghost" href="#/products">View products</a>
          </div>
        </div>
        ${heroVisualHtml(brand)}
      </div>
    </section>

    ${flagshipHandicraftHtml()}

    <section class="section wrap">
      <p class="section-label reveal">Process</p>
      <h2 class="section-title reveal">How ordering works</h2>
      <p class="section-lead reveal">Samples, written quote, production, then shipping documents. No bulk production until you approve specs.</p>
      <a class="btn btn-primary reveal" href="#/importers">See the steps</a>
    </section>

    ${faqHtml()}

    <section class="section wrap cta-panel reveal">
      <div class="cta-panel-inner">
        <div>
          <p class="section-label" style="color: var(--gold)">Quote</p>
          <h2 class="section-title" style="margin-bottom: 0.5rem">Tell us quantity and destination.</h2>
          <p class="section-lead" style="margin: 0">${escapeHtml(getBrand()?.contact?.responseSLA ?? "We reply within two business days")}.</p>
        </div>
        <a class="btn btn-primary" href="#/contact">Request a quote</a>
      </div>
    </section>
  `;
}

export function productsView() {
  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Products</p>
      <h1 class="section-title reveal">Our range</h1>
      <p class="section-lead reveal">
        Blue pottery and brass are open for quotes today. Other lines show what we plan to add next; each is marked coming soon.
      </p>
      <div class="product-grid" data-product-grid>
        ${renderProductGrid()}
      </div>
    </section>
  `;
}

function productComingSoonGridVisual(p) {
  if (p.image) {
    return `<span class="product-visual-photo product-visual-photo--soon">
      <img src="${mediaSrc(p.image)}" alt="${escapeHtml(p.imageAlt ?? p.name)}" loading="lazy" decoding="async" />
      <span class="product-coming-soon-label">Coming soon</span>
    </span>`;
  }
  return `<span class="product-visual-fallback product-visual-fallback--soon" data-pattern="${p.pattern}"><span class="product-coming-soon-label">Coming soon</span></span>`;
}

function productComingSoonDetailVisual(p) {
  if (p.image) {
    return `<div class="product-detail-photo product-detail-photo--soon">
      <img src="${mediaSrc(p.image)}" alt="${escapeHtml(p.imageAlt ?? p.name)}" loading="lazy" decoding="async" />
      <span class="product-coming-soon-label">Coming soon</span>
    </div>`;
  }
  return `<span class="product-visual-fallback product-visual-fallback--soon" data-pattern="${p.pattern}"><span class="product-coming-soon-label">Coming soon</span></span>`;
}

function productCardHtml(p) {
  const categories = getCategories();
  const catLabel = categories.find((c) => c.id === p.category)?.label ?? p.category;
  const comingSoon = p.launchScope === "roadmap";
  const visual = comingSoon
    ? productComingSoonGridVisual(p)
    : p.image
      ? `<img src="${mediaSrc(p.image)}" alt="${escapeHtml(p.imageAlt ?? p.name)}" loading="lazy" decoding="async" />`
      : `<span class="product-visual-fallback" data-pattern="${p.pattern}"></span>`;
  const scope = comingSoon ? "Coming soon" : "";
  const scopeBadge = scope
    ? `<span class="product-scope ${comingSoon ? "is-soon" : "is-v1"}">${scope}</span>`
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
            : `<p class="product-moq" style="margin-bottom: 0.75rem">Lead time: ${escapeHtml(p.lead)}</p>`
        }
        <div class="product-actions">
          ${
            comingSoon
              ? `<a class="btn btn-ghost" href="#/products/${encodeURIComponent(p.id)}">Learn more</a>
                 <a class="btn btn-primary" href="#/contact?product=blue-pottery">Request a quote</a>`
              : `<a class="btn btn-ghost" href="#/products/${encodeURIComponent(p.id)}">Details</a>
                 <a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(p.id)}">Request a quote</a>`
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
      <p class="section-label reveal"><a href="#/products">Products</a></p>
      <h1 class="section-title reveal">${escapeHtml(product.name)}</h1>
      <p class="section-lead reveal">${escapeHtml(product.description)}</p>
      <div class="product-detail-grid reveal">
        <div class="product-detail-visual${product.image ? "" : " product-detail-visual--soon"}">
          ${productComingSoonDetailVisual(product)}
          ${product.image ? `<p class="form-note">Illustrative category photo. Not available to order yet.</p>` : ""}
        </div>
        <div class="product-detail-spec">
          <p class="detail-note"><strong>Status.</strong> Coming soon. This line is not open for quotes yet.</p>
          <p class="form-note">We are taking orders for blue pottery and brass. Tell us if you want notice when this line opens.</p>
          <a class="btn btn-primary" href="#/contact?product=blue-pottery">Request a quote</a>
          <a class="btn btn-ghost" href="#/products">Back to collections</a>
        </div>
      </div>
    </section>
  `;
  }

  const imgSrc = product.image ?? categoryAsset(product.category);

  return `
    <section class="page-hero wrap product-detail">
      <p class="section-label reveal"><a href="#/products">Products</a></p>
      <h1 class="section-title reveal">${escapeHtml(product.name)}</h1>
      <p class="section-lead reveal">${escapeHtml(product.description)}</p>
      <div class="product-detail-grid reveal">
        <div class="product-detail-visual">
          ${imgSrc ? `<img src="${mediaSrc(imgSrc)}" alt="${escapeHtml(product.imageAlt ?? product.name)}" loading="lazy" />` : ""}
          <p class="form-note">Sample photo for reference. Bulk orders use approved maker samples.</p>
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
      <p class="section-label reveal">How to order</p>
      <h1 class="section-title reveal">${escapeHtml(data.title ?? "How to order")}</h1>
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
      <a class="btn btn-primary" href="#/contact">Request a quote</a>
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
      <p class="section-label reveal">Shipping</p>
      <h1 class="section-title reveal">${escapeHtml(data.title ?? "Shipping and documents")}</h1>
      <p class="section-lead reveal">${escapeHtml(data.lead ?? "")}</p>
      <p class="section-lead reveal">Usual bulk term: <strong>${escapeHtml(data.defaultIncoterm ?? "FOB Mundra")}</strong></p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Shipping terms</h2>
      <div class="shipping-table reveal">
        <table>
          <thead><tr><th>Term on quote</th><th>What it means for you</th></tr></thead>
          <tbody>
            ${incRows.map((r) => `<tr><td>${escapeHtml(r.term)}</td><td>${escapeHtml(r.use)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p class="form-note reveal">${escapeHtml(getBrand()?.incotermsPublicNote ?? "")}</p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Documents you receive</h2>
      <ul class="doc-list reveal">${docs.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">How we pack</h2>
      <ul class="doc-list reveal">${packing.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
      <p class="detail-note reveal">${escapeHtml(data.complianceDecorative ?? "")}</p>
    </section>
  `;
}

export function aboutView() {
  const brand = getBrand();
  const loc = brand?.location;
  const place = loc ? `${loc.city}, ${loc.state}, ${loc.country}` : "Jaipur, Rajasthan, India";

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">About</p>
      <h1 class="section-title reveal">Jaipur export team for gift and home décor.</h1>
      <p class="section-lead reveal">
        Jaat Global sources decorative blue pottery and brass from Jaipur workshops, agrees export packing with you, and ships with standard commercial documents. We work in English.
      </p>
      <p class="section-lead reveal">Based in ${escapeHtml(place)}.</p>
    </section>
    ${certGridHtml()}
    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">How to reach us</h2>
      <p class="section-lead reveal">
        Email <a href="mailto:${escapeHtml(getBrand()?.contact?.email ?? "trade@jaatglobal.com")}">${escapeHtml(getBrand()?.contact?.email ?? "trade@jaatglobal.com")}</a>.
        ${escapeHtml(getBrand()?.contact?.responseSLA ?? "We reply within two business days")}.
        Our office runs on India time (Jaipur, GMT+5:30); email works well for buyers in Europe and the UK.
      </p>
      <div class="timeline">
        <div class="timeline-item reveal">
          <strong>Quality</strong>
          Third party inspection when you need it. Production photos during the run.
        </div>
        <div class="timeline-item reveal">
          <strong>Product use</strong>
          Standard range is gift and home décor. Food contact items need a separate quote.
        </div>
        <div class="timeline-item reveal">
          <strong>One contact</strong>
          Same team from sample approval through shipment.
        </div>
      </div>
    </section>
  `;
}

export function contactView(prefill = {}) {
  const { productId = "", message = "" } = prefill;
  const brand = getBrand();
  const products = getProducts();
  const launchProducts = products.filter((p) => p.launchScope === "v1");
  const quoteProductId =
    launchProducts.find((p) => p.id === productId)?.id ?? launchProducts[0]?.id ?? "";
  const product = launchProducts.find((p) => p.id === quoteProductId);
  const defaultMessage =
    message ||
    (product ? `Interested in: ${product.name} (${product.moq}). ` : "");
  const moqBands = getSiteContent()?.contact?.moqBands ?? [];
  const terms = getIncoterms();

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Contact</p>
      <h1 class="section-title reveal">Request a quote</h1>
      <p class="section-lead reveal">
        Share product line, quantity band, destination country, and preferred shipping term. We open your email app with a draft you can send to ${escapeHtml(brand?.contact?.email ?? "trade@jaatglobal.com")}.
      </p>
      <p class="reveal"><a href="downloads/importer-brief.html" target="_blank" rel="noopener">Printable summary for your team</a></p>
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
              <label for="market">Your country or market</label>
              <select id="market" name="market">
                <option value="">Select</option>
                ${importMarketsOptions()}
              </select>
            </div>
            <div class="field">
              <label for="incoterm">How you want goods shipped</label>
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
              <label for="moqBand">Rough order size</label>
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
          <button type="submit" class="btn btn-primary" style="width: 100%">Open email draft</button>
          <p class="form-note">
            A copy is saved in this browser. Send the draft to
            <a href="mailto:${brand?.contact?.email ?? "trade@jaatglobal.com"}">${brand?.contact?.email ?? "trade@jaatglobal.com"}</a>
            to start the quote.
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

export function renderProductGrid() {
  const live = getProducts().filter((p) => p.launchScope === "v1");
  const soon = getProducts().filter((p) => p.launchScope === "roadmap");
  return [...live, ...soon].map((p) => productCardHtml(p)).join("");
}

export const routeMeta = {
  "/": {
    title: "Jaat Global | Blue pottery and brass export",
    description: "Jaipur blue pottery and brass gift décor for importers. FOB Mundra, English documents.",
  },
  "/products": {
    title: "Jaat Global | Products",
    description: "Decorative blue pottery and brass gift lines with MOQ and lead times.",
  },
  "/importers": {
    title: "Jaat Global | How to order",
    description: "Samples, purchase order, production, and shipping documents.",
  },
  "/export": {
    title: "Jaat Global | Shipping and documents",
    description: "FOB Mundra, invoices, packing lists, and export packing for gift orders.",
  },
  "/about": {
    title: "Jaat Global | About",
    description: "Jaipur export company for decorative pottery and brass gift décor.",
  },
  "/contact": {
    title: "Jaat Global | Request a quote",
    description: "Contact Jaat Global with quantity, market, and product line.",
  },
};
