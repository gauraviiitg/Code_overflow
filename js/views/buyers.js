import { getSiteContent, escapeHtml } from "../content.js";
import { cardsHtml, ctaHtml, pageHeroHtml, stepsHtml } from "./shared.js";

function matrixHtml(rows = []) {
  if (!rows.length) return "";
  return `<div class="shipping-table reveal">
    <table>
      <thead><tr><th>Buyer need</th><th>Jaat Global approach</th></tr></thead>
      <tbody>
        ${rows.map((row) => `<tr><td>${escapeHtml(row.need)}</td><td>${escapeHtml(row.offer)}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>`;
}

export function importersView() {
  const data = getSiteContent()?.importers ?? {};
  const home = getSiteContent()?.home ?? {};
  return `${pageHeroHtml(
    "For importers",
    data.title ?? "Your sourcing partner in Jaipur",
    data.lead ?? "",
    `<div class="hero-actions reveal">
      <a class="btn btn-primary" href="#/contact">Request wholesale quote</a>
      <a class="btn btn-ghost" href="downloads/importer-brief.html" target="_blank" rel="noopener">${escapeHtml(
        data.downloadLabel ?? "Open importer onboarding pack"
      )}</a>
    </div>`
  )}
  <section class="section wrap">
    <p class="section-label reveal">Why a smaller sourcing team</p>
    <h2 class="section-title reveal">A more direct working relationship</h2>
    ${cardsHtml(home.promises)}
  </section>
  <section class="section wrap section-tint">
    <p class="section-label reveal">From sample to shipment</p>
    <h2 class="section-title reveal">A clear path for your first order</h2>
    ${stepsHtml(data.steps)}
  </section>
  <section class="section wrap">
    <p class="section-label reveal">Commercial fit</p>
    <h2 class="section-title reveal">What can you discuss with us?</h2>
    ${matrixHtml(data.serviceMatrix)}
  </section>
  <section class="section wrap">
    <p class="section-label reveal">Buyer risk reduction</p>
    <h2 class="section-title reveal">Start small. Scale with confidence.</h2>
    <p class="section-lead reveal">A sample, written specification, and approved reference can reduce uncertainty before a larger commitment.</p>
    ${stepsHtml(data.riskSteps)}
    <p class="relationship-path reveal"><strong>Sample</strong><span>Trial order</span><span>Scale</span><span>Reorder</span></p>
  </section>
  <section class="section wrap section-tint">
    <p class="section-label reveal">Supplier evaluation</p>
    <h2 class="section-title reveal">What makes a good export supplier?</h2>
    ${cardsHtml([
      { title: "Product and consistency", body: "Clear references, specifications, intended use, and realistic variation." },
      { title: "Communication and timing", body: "Direct answers, written commitments, and early notice when a plan changes." },
      { title: "Packing and documents", body: "Shipment information prepared around the product, destination, and agreed terms." },
      { title: "Problem solving", body: "A defined process for questions, inspection, transit evidence, and later reorders." },
    ])}
  </section>
  <section class="section wrap">
    <p class="section-label reveal">Repeat sourcing</p>
    <h2 class="section-title reveal">Built for the next collection</h2>
    <p class="section-lead reveal">Stable SKU references, approved specifications, and clear communication make later enquiries easier. The objective is a dependable Jaipur sourcing relationship, not a single shipment.</p>
  </section>
  ${ctaHtml(
    "Ready to source from Jaipur?",
    "Send the product, quantity, destination, and timing. We will review what can be supported.",
    "Request wholesale quote",
    "#/contact",
    "Use the Sourcing Desk",
    "#/sourcing"
  )}`;
}

export function sourcingView() {
  const data = getSiteContent()?.sourcing ?? {};
  const requestItems = [
    { title: "Reference", body: "Photo, catalogue page, moodboard, drawing, or sample description." },
    { title: "Commercial need", body: "Quantity, dimensions, material, intended use, target cost, and date." },
    { title: "Destination", body: "Country, city or port, and preferred quote basis." },
    { title: "Collection", body: "Tell us which products should work together in the range." },
  ];
  return `${pageHeroHtml("Sourcing", data.title ?? "Jaat Sourcing Desk", data.lead ?? "")}
    <section class="section wrap" style="padding-top: 0">
      <div class="statement-panel reveal">
        <p class="section-label">Our approach</p>
        <h2>${escapeHtml(data.statement ?? "Our catalogue is a starting point, not our limit.")}</h2>
        <p>${escapeHtml(data.brief ?? "")}</p>
      </div>
    </section>
    <section class="section wrap">
      <p class="section-label reveal">Prepare your brief</p>
      <h2 class="section-title reveal">Help us understand the buying requirement</h2>
      ${cardsHtml(requestItems)}
    </section>
    <section class="section wrap section-tint">
      <p class="section-label reveal">Sourcing process</p>
      <h2 class="section-title reveal">From reference to approved product</h2>
      ${stepsHtml(data.process)}
    </section>
    <section class="section wrap">
      <p class="section-label reveal">Collection building</p>
      <h2 class="section-title reveal">${escapeHtml(data.collectionTitle ?? "Build your Jaipur collection")}</h2>
      <p class="section-lead reveal">${escapeHtml(data.collectionBody ?? "")}</p>
    </section>
    ${ctaHtml(
      "Have a reference product?",
      "Open the sourcing brief and attach your images or files to the email draft before sending.",
      "Send sourcing request",
      "#/contact?type=sourcing",
      "Explore current products",
      "#/products"
    )}`;
}
