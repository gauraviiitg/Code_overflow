import { getBrand, getFlagshipHandicraft } from "../company.js";
import { escapeHtml, faqHtml, trustStripHtml } from "../content.js";
import { getSiteContent } from "../content.js";
import { cardsHtml, ctaHtml, mediaSrc, stepsHtml } from "./shared.js";

function heroVisualHtml(brand) {
  const hero = brand?.heroImage ?? {};
  const src = hero.src ?? "assets/stock/blue-pottery.jpg";
  const alt = hero.alt ?? "Illustrative Jaipur blue pottery";
  return `<figure class="hero-figure reveal">
    <img class="hero-photo" src="${mediaSrc(src)}" width="560" height="420" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />
    <figcaption class="hero-caption">Illustrative stock photo. Approved product images are shared for a real enquiry.</figcaption>
  </figure>`;
}

function flagshipHtml() {
  const brand = getBrand();
  const lines = getFlagshipHandicraft();
  if (!lines.length) return "";
  return `<section class="section wrap">
    <p class="section-label reveal">Initial sourcing focus</p>
    <h2 class="section-title reveal">${escapeHtml(
      brand?.flagshipSectionTitle ?? "Start with pottery. Add brass to the collection."
    )}</h2>
    <div class="flagship-duo">
      ${lines
        .map(
          (line) => `<article class="flagship-card reveal">
            <a class="flagship-image-link" href="#/products/${encodeURIComponent(line.productId)}">
              <img src="${mediaSrc(line.asset)}" width="320" height="240" alt="${escapeHtml(
                line.product?.imageAlt ?? line.headline
              )}" loading="lazy" />
            </a>
            <div class="flagship-body">
              <h3>${escapeHtml(line.headline)}</h3>
              <p>${escapeHtml(line.pitch)}</p>
              <div class="flagship-actions">
                <a class="btn btn-ghost" href="#/products/${encodeURIComponent(line.productId)}">View specification</a>
                <a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(line.productId)}">Request wholesale quote</a>
              </div>
            </div>
          </article>`
        )
        .join("")}
    </div>
  </section>`;
}

export function homeView() {
  const brand = getBrand();
  const home = getSiteContent()?.home ?? {};
  const buyerJourney = [
    { title: "Tell us what you need", body: "Share products, quantity, destination, and timing." },
    { title: "Review options and quote", body: "Receive the sourcing approach and commercial basis." },
    { title: "Approve a sample", body: "Use the approved sample and specification as the reference." },
    { title: "Prepare the order", body: "Coordinate sourcing, checks, packing, documents, and shipment." },
  ];

  return `<section class="hero wrap">
    <div class="hero-grid hero-grid--visual">
      <div class="reveal">
        <p class="hero-eyebrow">${escapeHtml(home.eyebrow ?? "Jaat Global | Jaipur, India | Prelaunch")}</p>
        <h1>${escapeHtml(home.title ?? "Your sourcing partner in Jaipur.")}</h1>
        <p class="section-lead">${escapeHtml(home.valueProp ?? "")}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/contact">Request wholesale quote</a>
          <a class="btn btn-ghost" href="#/products">Explore products</a>
        </div>
        ${trustStripHtml()}
      </div>
      ${heroVisualHtml(brand)}
    </div>
  </section>

  <section class="section wrap">
    <p class="section-label reveal">Why Jaat Global</p>
    <h2 class="section-title reveal">Traditional craft. Commercial clarity.</h2>
    ${cardsHtml(home.promises)}
  </section>

  ${flagshipHtml()}

  <section class="section wrap section-tint">
    <p class="section-label reveal">Jaat Sourcing Desk</p>
    <h2 class="section-title reveal">More than a catalogue</h2>
    <p class="section-lead reveal">Our catalogue is a starting point, not our limit. Send a product reference, moodboard, drawing, or specification.</p>
    <a class="btn btn-primary reveal" href="#/sourcing">Send a sourcing request</a>
  </section>

  <section class="section wrap">
    <p class="section-label reveal">From sample to shipment</p>
    <h2 class="section-title reveal">Reduce risk before the commercial order</h2>
    ${stepsHtml(buyerJourney)}
  </section>

  <section class="section wrap">
    <p class="section-label reveal">Buyer path</p>
    <h2 class="section-title reveal">What are you buying for?</h2>
    ${cardsHtml(home.buyerTypes)}
  </section>

  ${faqHtml()}

  ${ctaHtml(
    "What are you looking to source from India?",
    "Send the product, approximate quantity, destination, and required timing. We aim to reply within two business days.",
    "Request wholesale quote",
    "#/contact",
    "Use the Sourcing Desk",
    "#/sourcing"
  )}`;
}
