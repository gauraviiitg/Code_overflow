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
      <p class="section-lead reveal">Brass &amp; copper and blue pottery are the anchors we’re building QC, documentation, and buyer workflows around.</p>
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
      <p class="flagship-mix reveal">We’re designing for <strong>mixed handicraft containers</strong> — brass and pottery in one programme when buyers want it.</p>
    </section>`;
}

function brandStatsHtml() {
  const brand = getBrand();
  const stats = brand?.focusAreas ?? brand?.stats ?? [
    { value: "2", label: "Flagship crafts (brass & blue pottery)" },
    { value: "4", label: "Product pillars on the roadmap" },
    { value: "UK · EU · US", label: "Buyer regions we’re studying" },
    { value: "FOB Mundra", label: "Planned default load port" },
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
          <p class="hero-eyebrow">Pre-launch · Jaipur · Western markets</p>
          <h1>Building a Jaipur desk for <em>brass</em> and <em>blue pottery</em> — equally — for Western importers.</h1>
          <p class="section-lead">
            Jaat Global isn’t trading yet. We’re in research and setup: validating makers, compliance steps, and how we’ll run sampling and paperwork for the UK, EU, and North America.
            This site shows where we’re headed — flagship metal décor and blue pottery first, plus textiles, agro, and stone on the roadmap.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/contact">Introduce yourself</a>
            <a class="btn btn-ghost" href="#/buyers">How we plan to work</a>
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
          <p class="section-label" style="color: var(--gold); margin-bottom: 0.5rem">Western buyer desk (planned)</p>
          <p style="margin: 0; font-size: 1.05rem; color: var(--cream)">
            Timezone overlap with UK/EU mornings and US East Coast — one account manager, English-first paperwork at launch.
          </p>
          <div class="hero-stats">${brandStatsHtml()}</div>
          <p class="hero-note">
            ${(brand?.trustSignals ?? ["IEC & GST registered", "Third-party inspection welcome"]).slice(0, 3).join(" · ")}
          </p>
        </aside>
        <div class="reveal" style="transition-delay: 0.08s">
          <p class="section-label">Why importers stay</p>
          <h2 class="section-title" style="font-size: clamp(1.75rem, 3vw, 2.35rem)">What we’re building toward.</h2>
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
      <p class="section-label reveal">Research themes</p>
      <h2 class="section-title reveal">What Western importers keep asking for — our checklist while we set up.</h2>
      <div class="voice-grid">
        ${[
          ["Documentation", "One PDF pack that matches what customs sees — not ad-hoc photos on arrival."],
          ["Compliance", "Steam treatment, COA batch numbers, and HS wording on the proforma from day one."],
          ["Logistics", "Crate and weight clarity before CIF bookings — especially on stone programmes."],
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
      <p class="voice-disclaimer reveal">Themes from market research — not client testimonials.</p>
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
          <h2 class="section-title" style="margin-bottom: 0.5rem">Early conversations welcome — we reply when we can during setup.</h2>
          <p class="section-lead" style="margin: 0">Importers in the UK, EU, US, and Canada: say hello before we go live.</p>
        </div>
        <a class="btn btn-primary" href="#/contact">Get in touch</a>
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
        Below is the workflow we’re putting in place before first shipments.
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
      <h2 class="section-title reveal" style="font-size: 1.75rem">At launch, you can expect</h2>
      <div class="resource-grid">
        <div class="resource-card reveal">
          <span class="resource-type">Onboarding</span>
          <strong>Sample → PO → docs → after delivery</strong>
          <span>Written milestones — no surprise gaps at the port</span>
        </div>
        <div class="resource-card reveal">
          <span class="resource-type">Documentation</span>
          <strong>Product-type checklist</strong>
          <span>HS chapters and extra certs by category</span>
        </div>
        <div class="resource-card reveal">
          <span class="resource-type">Communication</span>
          <strong>English-first trade desk</strong>
          <span>Plain language for UK, EU, and US buyers</span>
        </div>
      </div>
      <p class="reveal resource-note">Detailed PDF packs will be available once trading begins — ask us during early conversations if you want a preview outline.</p>
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
      <h1 class="section-title reveal">Draft catalogue — lines we’re preparing.</h1>
      <p class="section-lead reveal">
        Flagship handicraft — brass and blue pottery — listed first. MOQ, lead time, and buyer notes are indicative while we validate with makers.
        Pricing will be on inquiry at launch — USD or EUR proforma planned.
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
      <p class="section-label reveal">About Jaat Global</p>
      <h1 class="section-title reveal">Jaipur on the ground. Western discipline on the paperwork — when we launch.</h1>
    </section>
    <section class="section wrap" style="padding-top: 0">
      <div class="split-about">
        <div class="reveal">
          <blockquote class="about-quote">
            Western buyers don’t lack suppliers — they lack suppliers who put the same version of the truth in the sample room, the factory, and the invoice. That’s the desk we’re building.
          </blockquote>
          <p class="section-lead" style="margin-top: 1.5rem">
            We’re based in Jaipur with research into Bagru, Sanganer, Jodhpur, and partner mills across North India.
            Our first corridors are the UK, Germany, Benelux, and North America — importers who care about OTIF, defect rate, and document accuracy.
          </p>
          <p class="section-lead">
            The company is not live yet. This website is our public-facing draft; catalogue JSON here powers what you see on GitHub Pages.
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
      <h1 class="section-title reveal">Say hello while we’re in setup.</h1>
      <p class="section-lead reveal">
        Western importers: share what you buy today and where you ship. Include destination port, incoterm, and any certification (FDA prior notice, OEKO-TEX, food contact, etc.) if you can.
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
            Pre-launch: saves to browser storage only. We’ll connect this form to ${getBrand()?.contact?.email ?? "trade@jaatglobal.com"} when the trade desk is live.
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
