export { homeView } from "./home.js";
export { productsView, productDetailView, renderProductGrid } from "./products.js";
export { importersView, sourcingView } from "./buyers.js";
export { exportView, qualityView, packagingView, aboutView, futureView } from "./operations.js";
export { contactView } from "./contact.js";

export const routeMeta = {
  "/": {
    title: "Jaat Global | Jaipur sourcing partner",
    description: "Importer focused sourcing for decorative blue pottery and brass décor from Jaipur.",
  },
  "/products": {
    title: "Jaat Global | Wholesale products",
    description: "Explore Jaipur product lines with SKU, planning MOQ, sample status, intended use, and sourcing support.",
  },
  "/importers": {
    title: "Jaat Global | For importers",
    description: "A direct Jaipur sourcing process from brief and sample to packing and shipment planning.",
  },
  "/sourcing": {
    title: "Jaat Global | Sourcing Desk",
    description: "Send a reference product or collection brief to the Jaat Sourcing Desk in Jaipur.",
  },
  "/export": {
    title: "Jaat Global | Export support",
    description: "Understand quote bases, shipping options, documentation, and destination specific responsibilities.",
  },
  "/quality": {
    title: "Jaat Global | Quality and repeatability",
    description: "How approved samples, written specifications, and agreed checks support handmade commercial orders.",
  },
  "/packaging": {
    title: "Jaat Global | Export packaging",
    description: "Packing planning for fragile decorative products sourced from Jaipur.",
  },
  "/about": {
    title: "Jaat Global | About",
    description: "Meet the prelaunch Jaipur sourcing company being built for international importers.",
  },
  "/future": {
    title: "Jaat Global | Future plans",
    description: "See which product data, buyer tools, proof, and connected services are planned for later.",
  },
  "/contact": {
    title: "Jaat Global | Request wholesale quote",
    description: "Send product, quantity, destination, timing, and quote basis for a structured trade enquiry.",
  },
};
