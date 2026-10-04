import { getBrand } from "../company.js";
import { certGridHtml, escapeHtml, getSiteContent } from "../content.js";
import { ctaHtml, listHtml, pageHeroHtml, stepsHtml } from "./shared.js";

export function exportView() {
  const data = getSiteContent()?.export ?? {};
  return `${pageHeroHtml("Export", data.title ?? "Shipping and documents", data.lead ?? "")}
    <section class="section wrap" style="padding-top: 0">
      <p class="section-label reveal">Quote basis</p>
      <h2 class="section-title reveal">Agree responsibility before the order</h2>
      <div class="shipping-table reveal">
        <table>
          <thead><tr><th>Term</th><th>Working description</th></tr></thead>
          <tbody>${(data.incotermNotes ?? [])
            .map((row) => `<tr><td>${escapeHtml(row.term)}</td><td>${escapeHtml(row.use)}</td></tr>`)
            .join("")}</tbody>
        </table>
      </div>
      <p class="form-note reveal">${escapeHtml(getBrand()?.incotermsPublicNote ?? "")}</p>
      <p class="form-note reveal">Final responsibilities follow the named place, current Incoterms rules, and the signed commercial documents. This page is not legal advice.</p>
    </section>
    <section class="section wrap section-tint">
      <p class="section-label reveal">Shipping from Jaipur</p>
      <h2 class="section-title reveal">Match the method to the shipment</h2>
      ${stepsHtml([
        { title: "Samples", body: "Courier or express service depending on product and destination." },
        { title: "Small shipment", body: "Courier or air freight can be discussed." },
        { title: "Commercial shipment", body: "Air freight or less than container load can be considered." },
        { title: "Larger shipment", body: "Sea freight planning depends on volume, destination, and terms." },
      ])}
    </section>
    <section class="section wrap">
      <p class="section-label reveal">Landed economics</p>
      <h2 class="section-title reveal">Look beyond the product price</h2>
      <p class="section-lead reveal">A buyer may need to consider product cost, packing, inland transport, freight, insurance, duty, tax, and destination charges. Share the destination, quantity, and shipping preference so the known cost components can be discussed. Jaat Global does not present an automatic landed cost estimate before the required data is verified.</p>
    </section>
    <section class="section wrap">
      <p class="section-label reveal">Export documentation</p>
      <h2 class="section-title reveal">Documents depend on product and destination</h2>
      ${listHtml(data.documentsHandicraft ?? [], "doc-list reveal")}
      <p class="detail-note reveal">${escapeHtml(data.complianceDecorative ?? "")}</p>
    </section>
    ${ctaHtml(
      "Need a FOB or CIF discussion?",
      "Share destination, quantity, product, and timing so the quote basis can be reviewed.",
      "Request a shipping quote",
      "#/contact"
    )}`;
}

export function qualityView() {
  const data = getSiteContent()?.quality ?? {};
  return `${pageHeroHtml("Quality", data.title ?? "Quality before shipment", data.lead ?? "")}
    <section class="section wrap" style="padding-top: 0">
      <div class="quality-grid">
        <article class="info-card reveal"><h2>Product</h2>${listHtml(data.productChecks)}</article>
        <article class="info-card reveal"><h2>Packing</h2>${listHtml(data.packingChecks)}</article>
        <article class="info-card reveal"><h2>Documents</h2>${listHtml(data.documentChecks)}</article>
      </div>
    </section>
    <section class="section wrap section-tint">
      <p class="section-label reveal">Repeatability</p>
      <h2 class="section-title reveal">${escapeHtml(data.variationTitle ?? "")}</h2>
      <p class="section-lead reveal">${escapeHtml(data.variationBody ?? "")}</p>
      <div class="quality-grid">
        <article class="info-card reveal"><h3>Acceptable handmade variation</h3>${listHtml(data.variations)}</article>
        <article class="info-card reveal"><h3>Quality defect examples</h3>${listHtml(data.defects)}</article>
      </div>
    </section>
    ${ctaHtml(
      "Start with a sample",
      "Evaluate the product and agree the commercial reference before a larger order.",
      "Request sample discussion",
      "#/contact?sample=Yes"
    )}`;
}

export function packagingView() {
  const data = getSiteContent()?.packing ?? {};
  const exportData = getSiteContent()?.export ?? {};
  return `${pageHeroHtml("Packaging", data.title ?? "Designed for the journey", data.lead ?? "")}
    <section class="section wrap" style="padding-top: 0">
      ${stepsHtml(data.sequence)}
      <p class="detail-note reveal">${escapeHtml(data.note ?? "")}</p>
    </section>
    <section class="section wrap section-tint">
      <p class="section-label reveal">Planning approach</p>
      <h2 class="section-title reveal">Packing follows the product</h2>
      ${listHtml(exportData.packingSummary ?? [], "doc-list reveal")}
      <p class="section-lead reveal">Carton dimensions, quantity per carton, and gross weight will be published only after physical measurement and packing validation.</p>
    </section>
    ${ctaHtml(
      "Discuss a fragile product",
      "Send the product, approximate quantity, destination, and shipping method so packing requirements can be reviewed.",
      "Request packing discussion",
      "#/contact"
    )}`;
}

export function aboutView() {
  const brand = getBrand();
  const place = brand?.location
    ? `${brand.location.city}, ${brand.location.state}, ${brand.location.country}`
    : "Jaipur, Rajasthan, India";
  return `${pageHeroHtml(
    "Jaat Global",
    "A direct sourcing team in Jaipur",
    "Jaat Global is being built to help international importers source decorative products with clearer specifications, communication, packing, and shipment planning."
  )}
    <section class="section wrap" style="padding-top: 0">
      <div class="statement-panel reveal">
        <p class="section-label">Current stage</p>
        <h2>Prelaunch and research</h2>
        <p>The company is not yet operating commercially. Product data, registrations, maker relationships, packing procedures, and buyer workflows are being verified before launch.</p>
        <p>Location: ${escapeHtml(place)}.</p>
      </div>
    </section>
    ${certGridHtml()}
    <section class="section wrap">
      <p class="section-label reveal">Working philosophy</p>
      <h2 class="section-title reveal">You manage your market. We coordinate the sourcing side in Jaipur.</h2>
      <p class="section-lead reveal">The goal is to become easy to work with through direct communication, stable references, and honest commercial information.</p>
    </section>`;
}

export function futureView() {
  const data = getSiteContent()?.future ?? {};
  const groups = data.groups ?? [];
  return `${pageHeroHtml(
    "Roadmap",
    data.title ?? "Planned for the future",
    data.lead ?? "These capabilities are not available today."
  )}
    <section class="section wrap" style="padding-top: 0">
      <div class="info-grid">
        ${groups
          .map(
            (group) => `<article class="info-card reveal">
              <p class="future-label">Future</p>
              <h2>${escapeHtml(group.title)}</h2>
              ${listHtml(group.items)}
            </article>`
          )
          .join("")}
      </div>
    </section>
    ${ctaHtml(
      "Need something from the roadmap?",
      "Share the requirement. We will state clearly whether it can be supported now, needs verification, or remains a future capability.",
      "Discuss your requirement",
      "#/contact"
    )}`;
}
