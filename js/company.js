import { categories as fbCat, products as fbProd, markets as fbMarkets, incoterms as fbIncoterms } from "./data.js";
import { companyUrl } from "./paths.js";

const state = {
  brand: null,
  categories: fbCat,
  products: fbProd,
  markets: fbMarkets,
  incoterms: fbIncoterms,
  loadedFromCompany: false,
};

export async function initCompany() {
  try {
    const [catalogueRes, brandRes] = await Promise.all([
      fetch(companyUrl("product-data/catalogue.json")),
      fetch(companyUrl("brand/company.json")),
    ]);
    if (!catalogueRes.ok || !brandRes.ok) throw new Error("company fetch failed");
    const catalogue = await catalogueRes.json();
    const brand = await brandRes.json();
    state.categories = catalogue.categories;
    state.products = catalogue.products;
    state.markets = catalogue.markets;
    state.incoterms = catalogue.incoterms;
    state.brand = brand;
    state.loadedFromCompany = true;
  } catch {
    state.loadedFromCompany = false;
  }
}

export function getBrand() {
  return state.brand;
}

export function getCategories() {
  return state.categories;
}

export function getProducts() {
  return state.products;
}

export function getFeaturedProducts() {
  return state.products.filter((p) => p.featured);
}

export function getFlagshipHandicraft() {
  const lines = state.brand?.flagshipHandicraft;
  if (!lines?.length) return getFeaturedProducts();
  return lines.map((line) => ({
    ...line,
    product: state.products.find((p) => p.id === line.productId),
  }));
}

export function getMarkets() {
  return state.markets;
}

export function getIncoterms() {
  return state.incoterms;
}

export function categoryAsset(categoryId) {
  const cat = state.categories.find((c) => c.id === categoryId);
  return cat?.asset ?? null;
}

export function isCompanyDataLive() {
  return state.loadedFromCompany;
}
