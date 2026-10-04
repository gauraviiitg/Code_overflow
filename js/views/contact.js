import { getBrand, getMarkets, getProducts } from "../company.js";
import { escapeHtml, getSiteContent } from "../content.js";
import { pageHeroHtml } from "./shared.js";

function optionsHtml(items = [], selected = "") {
  return items
    .map(
      (item) =>
        `<option value="${escapeHtml(item)}" ${item === selected ? "selected" : ""}>${escapeHtml(item)}</option>`
    )
    .join("");
}

export function contactView(prefill = {}) {
  const brand = getBrand();
  const content = getSiteContent()?.contact ?? {};
  const products = getProducts().filter((product) => product.launchScope === "v1");
  const selectedProduct = products.find((product) => product.id === prefill.productId)?.id ?? "";
  const sourcing = prefill.type === "sourcing";
  const savedRfq = prefill.rfq ?? [];

  return `${pageHeroHtml(
    sourcing ? "Jaat Sourcing Desk" : "Wholesale quote",
    sourcing ? "Send a sourcing request" : "Build your commercial enquiry",
    "Share enough detail for a useful response. The form opens an email draft because the live inbox and server form are not connected yet."
  )}
    <section class="section wrap" style="padding-top: 0">
      <form class="contact-form contact-form--wide reveal" data-contact-form>
        <input type="hidden" name="requestType" value="${sourcing ? "Sourcing request" : "Wholesale quote"}" />
        <div class="form-row">
          <div class="field"><label for="name">Name</label><input id="name" name="name" required autocomplete="name" /></div>
          <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="company">Company</label><input id="company" name="company" required autocomplete="organization" /></div>
          <div class="field"><label for="phone">WhatsApp or phone</label><input id="phone" name="phone" autocomplete="tel" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="market">Country or market</label><select id="market" name="market" required><option value="">Select</option>${optionsHtml(
            getMarkets()
          )}</select></div>
          <div class="field"><label for="destination">Destination city or port</label><input id="destination" name="destination" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="productLine">Product line</label><select id="productLine" name="productLine"><option value="">Select or describe below</option>${products
            .map(
              (product) =>
                `<option value="${escapeHtml(product.id)}" ${product.id === selectedProduct ? "selected" : ""}>${escapeHtml(
                  `${product.sku ?? product.id} | ${product.name}`
                )}</option>`
            )
            .join("")}</select></div>
          <div class="field"><label for="quantity">Approximate quantity</label><input id="quantity" name="quantity" placeholder="Example: 300 pieces" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="deliveryDate">Required delivery date</label><input id="deliveryDate" name="deliveryDate" type="date" /></div>
          <div class="field"><label for="incoterm">Quote basis</label><select id="incoterm" name="incoterm"><option value="">Select</option>${optionsHtml(
            content.shippingBases
          )}</select></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="sample">Sample required?</label><select id="sample" name="sample"><option value="">Select</option>${optionsHtml(
            content.sampleOptions,
            prefill.sample
          )}</select></div>
          <div class="field"><label for="customization">Customization</label><select id="customization" name="customization"><option value="">Select</option>${optionsHtml(
            content.customOptions
          )}</select></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="targetPrice">Target price and currency</label><input id="targetPrice" name="targetPrice" /></div>
          <div class="field"><label for="intendedUse">Intended use</label><input id="intendedUse" name="intendedUse" placeholder="Decorative retail, hospitality, gifting" /></div>
        </div>
        <div class="field"><label for="rfqItems">RFQ items</label><textarea id="rfqItems" name="rfqItems" placeholder="Add products from the catalogue or list SKU and quantity here">${escapeHtml(
          savedRfq.map((item) => `${item.sku} | ${item.name} | ${item.quantity} pieces`).join("\n")
        )}</textarea></div>
        <div class="field"><label for="message">Product brief</label><textarea id="message" name="message" required placeholder="Material, dimensions, finish, packing, compliance needs, or reference description">${escapeHtml(
          prefill.message ?? ""
        )}</textarea></div>
        <button class="btn btn-primary" type="submit">Open email draft</button>
        <p class="form-note">Attach reference images, PDF files, or drawings in your email app before sending. The current address ${escapeHtml(
          brand?.contact?.email ?? "trade@jaatglobal.com"
        )} is a prelaunch placeholder.</p>
      </form>
    </section>`;
}
