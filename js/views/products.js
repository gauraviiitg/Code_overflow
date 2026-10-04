import { categoryAsset, getCategories, getIncoterms, getProducts } from "../company.js";
import { escapeHtml, specTableHtml } from "../content.js";
import { ctaHtml, mediaSrc, pageHeroHtml } from "./shared.js";

function productVisualHtml(product, comingSoon = false) {
  const label = comingSoon ? `<span class="product-coming-soon-label">Coming later</span>` : "";
  if (product.image) {
    return `<span class="product-visual-photo${comingSoon ? " product-visual-photo--soon" : ""}">
      <img src="${mediaSrc(product.image)}" alt="${escapeHtml(product.imageAlt ?? product.name)}" loading="lazy" decoding="async" />
      ${label}
    </span>`;
  }
  return `<span class="product-visual-fallback${comingSoon ? " product-visual-fallback--soon" : ""}" data-pattern="${escapeHtml(
    product.pattern ?? ""
  )}">${label}</span>`;
}

function productCardHtml(product) {
  const category = getCategories().find((item) => item.id === product.category);
  const comingSoon = product.launchScope === "roadmap";
  return `<article class="product-card reveal${comingSoon ? " product-card--roadmap" : ""}" data-product-id="${escapeHtml(
    product.id
  )}">
    <a class="product-visual product-visual-link" href="#/products/${encodeURIComponent(product.id)}">
      ${productVisualHtml(product, comingSoon)}
    </a>
    <div class="product-body">
      <div class="product-meta">
        <span class="product-cat">${escapeHtml(category?.label ?? product.category)}</span>
        ${product.sku ? `<span class="product-sku">${escapeHtml(product.sku)}</span>` : ""}
      </div>
      <h3><a href="#/products/${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
      <p>${escapeHtml(product.description)}</p>
      ${
        comingSoon
          ? `<p class="product-note">Roadmap category. Not open for quotes.</p>`
          : `<div class="commercial-tags">
              <span>${escapeHtml(product.moq)}</span>
              <span>Sample: ${product.sampleAvailable ? "Discuss" : "On request"}</span>
              <span>Custom: ${escapeHtml(product.customization ?? "On request")}</span>
            </div>`
      }
      <div class="product-actions">
        <a class="btn btn-ghost" href="#/products/${encodeURIComponent(product.id)}">View specification</a>
        ${
          comingSoon
            ? ""
            : `<button class="btn btn-primary" type="button" data-add-rfq="${escapeHtml(product.id)}">Add to RFQ</button>`
        }
      </div>
    </div>
  </article>`;
}

function filterToolbarHtml() {
  const categories = getCategories().filter((category) => category.id !== "all");
  return `<div class="products-toolbar reveal" data-filters>
    <button class="filter-chip is-active" type="button" data-filter="all">All</button>
    ${categories
      .map(
        (category) =>
          `<button class="filter-chip" type="button" data-filter="${escapeHtml(category.id)}">${escapeHtml(category.label)}</button>`
      )
      .join("")}
    <button class="filter-chip" type="button" data-filter="moq-under-500">Planning MOQ up to 500</button>
    <button class="filter-chip" type="button" data-filter="samples">Samples</button>
    <button class="filter-chip" type="button" data-filter="custom">Custom</button>
  </div>`;
}

export function productsView() {
  return `${pageHeroHtml(
    "Products",
    "Commercial product discovery",
    "Explore the initial sourcing focus and roadmap categories. Planning MOQ and lead time are confirmed in every written quote."
  )}
  <section class="section wrap" style="padding-top: 0">
    ${filterToolbarHtml()}
    <div class="product-grid" data-product-grid>${renderProductGrid("all")}</div>
  </section>
  ${ctaHtml(
    "Importing in commercial quantities?",
    "Tell us the category, quantity, destination, and preferred quote basis. We can suggest a starting collection.",
    "Request wholesale quote",
    "#/contact",
    "Send a reference product",
    "#/sourcing"
  )}`;
}

export function renderProductGrid(filter = "all") {
  const products = [...getProducts()].sort((a, b) => {
    if (a.launchScope === b.launchScope) return 0;
    return a.launchScope === "v1" ? -1 : 1;
  });
  return products
    .filter((product) => {
      if (filter === "all") return true;
      if (filter === "samples") return Boolean(product.sampleAvailable);
      if (filter === "custom") return Boolean(product.customization);
      if (filter === "moq-under-500") {
        const quantity = Number(String(product.moq ?? "").match(/\d+/)?.[0]);
        return product.launchScope === "v1" && quantity > 0 && quantity <= 500;
      }
      return product.category === filter;
    })
    .map(productCardHtml)
    .join("");
}

export function productDetailView(productId) {
  const product = getProducts().find((item) => item.id === productId);
  if (!product) return pageHeroHtml("Products", "Product not found", "Return to the product catalogue.");

  const comingSoon = product.launchScope === "roadmap";
  const image = product.image ?? categoryAsset(product.category);
  if (comingSoon) {
    return `${pageHeroHtml("Roadmap category", product.name, product.description)}
      <section class="section wrap" style="padding-top: 0">
        <div class="detail-note">This category is not open for quotes. Explore the initial blue pottery and brass sourcing focus.</div>
        <a class="btn btn-primary" href="#/products">View available lines</a>
      </section>`;
  }

  return `${pageHeroHtml(product.sku ?? "Product", product.name, product.description)}
    <section class="section wrap product-detail" style="padding-top: 0">
      <div class="product-detail-grid reveal">
        <div class="product-detail-visual">
          ${image ? `<img src="${mediaSrc(image)}" alt="${escapeHtml(product.imageAlt ?? product.name)}" loading="lazy" />` : ""}
          <p class="form-note">Illustrative stock photo. Approved product images are shared for a real enquiry.</p>
        </div>
        <div class="product-detail-spec">
          ${specTableHtml(product, getIncoterms())}
          ${product.commercialDataStatus ? `<p class="detail-note">${escapeHtml(product.commercialDataStatus)}</p>` : ""}
          ${
            product.detailBullets?.length
              ? `<ul class="detail-bullets">${product.detailBullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
              : ""
          }
          ${product.complianceNote ? `<p class="detail-note"><strong>Compliance:</strong> ${escapeHtml(product.complianceNote)}</p>` : ""}
          ${product.packingNote ? `<p class="detail-note"><strong>Packing:</strong> ${escapeHtml(product.packingNote)}</p>` : ""}
          <div class="product-actions">
            <button class="btn btn-primary" type="button" data-add-rfq="${escapeHtml(product.id)}">Add to RFQ</button>
            <a class="btn btn-ghost" href="#/sourcing?similar=${encodeURIComponent(product.id)}">Request similar</a>
          </div>
        </div>
      </div>
    </section>`;
}
