import {
  getBrand,
  getCategories,
  getProducts,
  getMarkets,
  getIncoterms,
  getCertifications,
  getFlagshipHandicraft,
  categoryAsset,
} from "./company.js";

const jaaliSvg = `
<svg class="jaali" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <pattern id="j" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="currentColor" stroke-width="0.6"/>
    <circle cx="10" cy="10" r="2" fill="currentColor"/>
  </pattern>
  <rect width="200" height="200" fill="url(#j)"/>
</svg>`;

function certificationsSectionHtml() {
  const cert = getCertifications();
  if (!cert?.badges?.length) return "";

  return `
    <section class="section wrap cert-section">
      <p class="section-label reveal">Registrations</p>
      <h2 class="section-title reveal" style="font-size: clamp(1.5rem, 3vw, 2rem)">Verified on inquiry — redacted on the public site.</h2>
      <p class="section-lead reveal">${cert.displayPolicy}</p>
      <div class="cert-grid">
        ${cert.badges
          .map(
            (b, i) => `
          <article class="cert-card reveal" style="transition-delay: ${i * 0.06}s">
            <div class="cert-seal" aria-hidden="true">${b.label}</div>
            <h3>${b.title}</h3>
            <p class="cert-status">${b.status}</p>
            <p class="cert-note">${b.publicNote}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>`;
}

function flagshipHandicraftHtml() {
  const lines = getFlagshipHandicraft();
  if (!lines.length) return "";

  return `
    <section class="section wrap flagship-section">
      <p class="section-label reveal">Flagship lines</p>
      <h2 class="section-title reveal">Two crafts, one desk — <em>equal</em> focus.</h2>
      <p class="section-lead reveal">Brass &amp; copper and blue pottery share the same QC, documentation, and Western buyer team.</p>
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
                line.product
                  ? `<p class="flagship-meta">${line.product.moq} · ${line.product.lead}</p>`
                  : ""
              }
              <a class="btn btn-primary" href="#/contact?product=${encodeURIComponent(line.productId)}">Inquire on this line</a>
            </div>
          </article>`
          )
          .join("")}
      </div>
      <p class="flagship-mix reveal">Many Western buyers run <strong>mixed handicraft containers</strong> — brass and pottery in one programme, one invoice pack.</p>
    </section>`;
}

function brandStatsHtml() {
  const stats = getBrand()?.stats ?? [
    { value: "18+", label: "Years collective trade experience" },
    { value: "40+", label: "Artisan & factory partners" },
    { value: "12", label: "Export markets served" },
    { value: "96%", label: "On-time dispatch (12 mo.)" },
  ];
  return stats
    .map(
      (s) => `
    <div>
      <div class="stat-value" data-count="${s.value.replace(/[^0-9.]/g, "") || ""}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`
    )
    .join("");
}

export function homeView() {
  const brand = getBrand();
  const ports = brand?.ports?.commonCIF?.join(" · ") ?? "Felixstowe · Rotterdam · NY/NJ · LA/LB";

  return `
    <section class="hero wrap">
      <div class="hero-grid hero-grid--visual">
        <div class="reveal">
          <p class="hero-eyebrow">Export partner · Rajasthan · Western markets</p>
          <h1>Jaipur <em>brass</em> and <em>blue pottery</em> — equally — for Western importers.</h1>
          <p class="section-lead">
            Our core export desk runs two flagship handicraft lines side by side: metal décor and Jaipur blue pottery.
            Same sampling rhythm, same document standards, same account manager — plus textiles, agro, and stone when you need a mixed container.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/contact">Request quote</a>
            <a class="btn btn-ghost" href="#/buyers">How we work with importers</a>
          </div>
        </div>
        <figure class="hero-figure reveal" style="transition-delay: 0.1s">
          <img class="hero-map" src="assets/hero-corridor.svg" width="560" height="420" alt="Stylised trade route from Jaipur via Mundra to Europe and North America" />
          <figcaption class="hero-caption">FOB Mundra default · CIF to ${ports}</figcaption>
        </figure>
      </div>
    </section>

    <div class="port-ticker band" aria-hidden="true">
      <div class="port-ticker-track">
        <span>FOB Mundra</span><span>Felixstowe</span><span>Rotterdam</span><span>New York / NJ</span><span>Los Angeles / LB</span><span>Vancouver</span><span>USD / EUR quotes</span><span>Pre-shipment inspection OK</span>
        <span>FOB Mundra</span><span>Felixstowe</span><span>Rotterdam</span><span>New York / NJ</span><span>Los Angeles / LB</span><span>Vancouver</span><span>USD / EUR quotes</span><span>Pre-shipment inspection OK</span>
      </div>
    </div>

    ${flagshipHandicraftHtml()}

    <section class="section wrap">
      <div class="hero-grid" style="align-items: start">
        <aside class="hero-panel reveal">
          ${jaaliSvg}
          <p class="section-label" style="color: var(--gold); margin-bottom: 0.5rem">Western buyer desk</p>
          <p style="margin: 0; font-size: 1.05rem; color: var(--cream)">
            Overlap calls with UK/EU mornings and US East Coast — one account manager, English-first paperwork.
          </p>
          <div class="hero-stats">${brandStatsHtml()}</div>
          <p class="hero-note">
            ${(brand?.trustSignals ?? ["IEC & GST registered", "Third-party inspection welcome"]).slice(0, 3).join(" · ")}
          </p>
        </aside>
        <div class="reveal" style="transition-delay: 0.08s">
          <p class="section-label">Why importers stay</p>
          <h2 class="section-title" style="font-size: clamp(1.75rem, 3vw, 2.35rem)">Proof over promises.</h2>
          <ul class="proof-list">
            <li><img src="assets/icons/document.svg" width="28" height="28" alt="" /> Proforma aligned to your broker’s HS wording before production</li>
            <li><img src="assets/icons/shield.svg" width="28" height="28" alt="" /> AQL agreed upfront — defects sorted in Jaipur, not in your DC</li>
            <li><img src="assets/icons/ship.svg" width="28" height="28" alt="" /> Carton marks, pallet photos, and BL copies same day as dispatch</li>
            <li><img src="assets/icons/globe.svg" width="28" height="28" alt="" /> Sample couriers with commercial invoice for US/EU customs</li>
          </ul>
        </div>
      </div>
    </section>

    ${certificationsSectionHtml()}

    <section class="section wrap" style="padding-top: 0">
      <p class="section-label reveal">What we export</p>
      <h2 class="section-title reveal">Handicraft first — four pillars for Western channels.</h2>
      <div class="card-grid">
        ${[
          ["Handicraft", "Dual flagship: brass & blue pottery (equal focus) — mixed-container friendly for US/EU gift & hospitality.", "01"],
          ["Textiles & home", "Block prints, quilts, cushions — OEKO-TEX® narratives for EU/US shelves.", "02"],
          ["Spices & agro", "COA-led lots, steam treatment — prior-notice questions answered early for the US.", "03"],
          ["Marble & stone", "Crating diagrams for 40' HC — garden and hospitality programmes.", "04"],
        ]
          .map(
            ([title, text, icon], i) => `
          <article class="card reveal" style="transition-delay: ${i * 0.06}s">
            <div class="card-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`
          )
          .join("")}
      </div>
    </section>

    <section class="section voices wrap">
      <p class="section-label reveal">Buyer voice</p>
      <h2 class="section-title reveal">What Western partners say they need — we built the desk around it.</h2>
      <div class="voice-grid">
        ${[
          ["UK homeware importer", "“We needed one PDF pack that matches what customs sees — not WhatsApp photos on arrival.”"],
          ["US ingredients distributor", "“Tell us steam treatment and COA batch numbers on the proforma — saves our compliance team a week.”"],
          ["EU garden buyer", "“Show crate photos before we book CIF — stone weight surprises kill margin.”"],
        ]
          .map(
            ([role, quote], i) => `
          <blockquote class="voice-card reveal" style="transition-delay: ${i * 0.07}s">
            <p>${quote}</p>
            <footer>— ${role}</footer>
          </blockquote>`
          )
          .join("")}
      </div>
      <p class="voice-disclaimer reveal">Representative feedback from onboarding themes — replace with named testimonials when approved.</p>
    </section>

    <section class="section wrap" style="padding-top: 0">
      <p class="section-label reveal">How we work</p>
      <h2 class="section-title reveal">Five steps, zero ambiguity.</h2>
      <div class="process-steps">
        ${[
          ["Brief & specs", "Market, certifications, incoterms — in writing."],
          ["Sample & quote", "Strike-offs + USD/EUR options, landed where needed."],
          ["Production", "PO lock, milestone photos, optional SGS/BV."],
          ["Documentation", "Invoice, packing list, COO — broker-ready."],
          ["Dispatch", "FOB Mundra or CIF — tracking same day."],
        ]
          .map(
            ([h, p]) => `
          <div class="process-step reveal">
            <h4>${h}</h4>
            <p>${p}</p>
          </div>`
          )
          .join("")}
      </div>
    </section>

    <section class="section wrap cta-panel reveal">
      <div class="cta-panel-inner">
        <div>
          <p class="section-label" style="color: var(--gold)">Next step</p>
          <h2 class="section-title" style="margin-bottom: 0.5rem">Send specs — get a written reply within one business day.</h2>
          <p class="section-lead" style="margin: 0">Importers in the UK, EU, US, and Canada welcome.</p>
        </div>
        <a class="btn btn-primary" href="#/contact">Start inquiry</a>
      </div>
    </section>
  `;
}

export function buyersView() {
  const brand = getBrand();
  const markets = brand?.westernMarkets ?? [];

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">For importers</p>
      <h1 class="section-title reveal">Built for Western buying teams — not tourist trade.</h1>
      <p class="section-lead reveal">
        If you import from India already, you know the gap is rarely the product — it’s documentation, sampling discipline, and timezone silence.
        This page mirrors our internal onboarding playbook (see <code>export/</code> in the project).
      </p>
    </section>

    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Call overlap (IST)</h2>
      <div class="overlap-table reveal">
        <table>
          <thead>
            <tr><th>Market</th><th>Best window</th></tr>
          </thead>
          <tbody>
            ${markets
              .map((m) => `<tr><td>${m.name}</td><td>${m.overlap}</td></tr>`)
              .join("")}
          </tbody>
        </table>
      </div>
    </section>

    <section class="section wrap" style="padding-top: 0">
      <h2 class="section-title reveal" style="font-size: 1.75rem">Resources</h2>
      <div class="resource-grid">
        <a class="resource-card reveal" href="export/western-importer-onboarding.md" target="_blank" rel="noopener">
          <span class="resource-type">Playbook</span>
          <strong>Western importer onboarding</strong>
          <span>Sample → PO → docs → after delivery</span>
        </a>
        <a class="resource-card reveal" href="export/documentation-matrix.md" target="_blank" rel="noopener">
          <span class="resource-type">Matrix</span>
          <strong>Documentation by product type</strong>
          <span>HS chapters & extra certs buyers ask for</span>
        </a>
        <a class="resource-card reveal" href="brand/voice-western-buyers.md" target="_blank" rel="noopener">
          <span class="resource-type">Internal</span>
          <strong>Voice & vocabulary</strong>
          <span>How we write to UK/EU/US buyers</span>
        </a>
      </div>
      <p class="reveal resource-note">On go-live, export these as branded PDFs — content already lives at the repo root.</p>
    </section>

    <section class="section wrap cta-panel reveal">
      <div class="cta-panel-inner">
        <p class="section-lead" style="margin: 0">Ready to run the checklist with us?</p>
        <a class="btn btn-primary" href="#/contact">Request quote</a>
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
      <h1 class="section-title reveal">Lines we ship to the West today.</h1>
      <p class="section-lead reveal">
        Flagship handicraft — brass and blue pottery — listed first. Each programme includes MOQ, lead time, and Western buyer notes.
        Prices on inquiry — proforma in USD or EUR.
      </p>
      ${flagshipHandicraftHtml()}
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
        ${p.westNote ? `<p class="product-west">${p.westNote}</p>` : ""}
        <p class="product-moq" style="margin-bottom: 0.75rem">Lead: ${p.lead}${p.hsHint ? ` · ${p.hsHint}` : ""}</p>
        <div class="product-actions">
          <a class="btn btn-ghost" href="#/contact?product=${encodeURIComponent(p.id)}">Inquire</a>
          <button type="button" class="btn btn-primary" data-inquire="${p.id}">Quick quote</button>
        </div>
      </div>
    </article>
  `;
}

export function aboutView() {
  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">About Bharat Connect</p>
      <h1 class="section-title reveal">Jaipur on the ground. Western discipline on the paperwork.</h1>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="split-about">
        <div class="reveal">
          <blockquote class="about-quote">
            Western buyers don’t lack suppliers — they lack suppliers who put the same version of the truth in the sample room, the factory, and the invoice.
          </blockquote>
          <p class="section-lead" style="margin-top: 1.5rem">
            We operate from Jaipur with corridors into Bagru, Sanganer, Jodhpur, and partner mills across North India.
            Most of our volume ships to the UK, Germany, Benelux, and North America — importers who measure us on OTIF, defect rate, and document accuracy.
          </p>
          <p class="section-lead">
            Company facts and catalogue data live in <strong>brand/</strong> and <strong>product-data/</strong> — update once, website follows.
          </p>
        </div>
        <div class="reveal" style="transition-delay: 0.1s">
          <div class="timeline">
            <div class="timeline-item">
              <strong>Quality</strong>
              Pre-shipment inspection, AQL tables, defect sorting at source.
            </div>
            <div class="timeline-item">
              <strong>Compliance</strong>
              HS support, food COAs, textile composition labels for EU/UK retail.
            </div>
            <div class="timeline-item">
              <strong>Communication</strong>
              Single desk, weekly PO updates, overlap hours for US/EU calls.
            </div>
            <div class="timeline-item">
              <strong>Sustainability</strong>
              Artisan programmes, reduced-plastic packing options, consolidated freight.
            </div>
          </div>
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
    (product
      ? `I'm interested in: ${product.name} (${product.moq}). Please share sampling options and FOB/CIF pricing in USD or EUR. Destination: `
      : "");

  return `
    <section class="page-hero wrap">
      <p class="section-label reveal">Contact</p>
      <h1 class="section-title reveal">Tell us what you import — we reply in writing.</h1>
      <p class="section-lead reveal">
        Western importers: include destination port, incoterm, and any certification (FDA prior notice, OEKO-TEX, food contact, etc.).
      </p>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="contact-layout">
        <aside class="contact-aside reveal">
          <p><strong>Trade desk</strong></p>
          <ul>
            <li>Video factory walks during Jaipur hours</li>
            <li>DHL/FedEx samples with commercial invoice</li>
            <li>USD / EUR proforma; L/C for qualified accounts</li>
            <li>Third-party inspection coordinated before ETD</li>
          </ul>
          <p style="margin-top: 1.5rem">
            <strong>Office</strong><br />
            ${getBrand()?.location?.addressLine ?? "MI Road, Jaipur"}, ${getBrand()?.location?.state ?? "Rajasthan"} ${getBrand()?.location?.postal ?? "302001"}<br />
            ${getBrand()?.location?.airport ?? "JAI · by appointment"}
          </p>
        </aside>
        <form class="contact-form reveal" data-contact-form style="transition-delay: 0.08s">
          <div class="form-row">
            <div class="field">
              <label for="name">Full name</label>
              <input id="name" name="name" required autocomplete="name" />
            </div>
            <div class="field">
              <label for="company">Company</label>
              <input id="company" name="company" required autocomplete="organization" />
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" name="email" type="email" required autocomplete="email" />
            </div>
            <div class="field">
              <label for="market">Primary market</label>
              <select id="market" name="market" required>
                <option value="">Select country/region</option>
                ${importMarketsOptions()}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="field">
              <label for="incoterm">Preferred incoterm</label>
              <select id="incoterm" name="incoterm">
                <option value="">Not sure yet</option>
                ${importIncotermsOptions()}
              </select>
            </div>
            <div class="field">
              <label for="product">Product interest</label>
              <select id="product" name="product">
                <option value="">General inquiry</option>
                ${products.map((p) => `<option value="${p.id}" ${p.id === productId ? "selected" : ""}>${p.name}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="field">
            <label for="message">Requirements</label>
            <textarea id="message" name="message" required placeholder="MOQ, specs, certifications, timeline…">${escapeHtml(defaultMessage)}</textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%">Send inquiry</button>
          <p style="font-size: 0.78rem; color: var(--ink-soft); margin: 1rem 0 0">
            Demo: saves to browser storage. Wire to ${getBrand()?.contact?.email ?? "trade@bharatconnect.in"} when live.
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

function importIncotermsOptions() {
  return getIncoterms()
    .map((t) => `<option value="${t}">${t}</option>`)
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
