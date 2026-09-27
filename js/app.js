import { initCompany, getBrand, getProducts } from "./company.js";
import { initSiteContent } from "./content.js";
import {
  homeView,
  productsView,
  aboutView,
  contactView,
  importersView,
  exportView,
  productDetailView,
  renderProductGrid,
  routeMeta,
} from "./views.js";

const outlet = document.querySelector("[data-outlet]");
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const toastEl = document.querySelector("[data-toast]");

let productFilter = "handicraft";

function parseRoute() {
  const hash = window.location.hash.slice(1) || "/";
  const [pathPart, queryPart] = hash.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const params = new URLSearchParams(queryPart || "");

  if (segments[0] === "products" && segments[1]) {
    return { path: "/products/detail", productId: segments[1], params };
  }

  const path = segments.length ? `/${segments[0]}` : "/";
  return { path, productId: null, params };
}

function setActiveNav(path) {
  const navPath = path === "/products/detail" ? "/products" : path;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const target = link.getAttribute("data-nav");
    link.classList.toggle("is-active", target === navPath);
  });
}

function closeMobileNav() {
  navPanel?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

document.addEventListener(
  "click",
  (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    if (e.target.closest(".site-nav") || e.target.closest("[data-nav-toggle]")) return;
    closeMobileNav();
  },
  { passive: true }
);

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("is-show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toastEl.classList.remove("is-show"), 3200);
}

function observeReveals() {
  const items = outlet.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function bindProductFilters() {
  const toolbar = outlet.querySelector("[data-filters]");
  const grid = outlet.querySelector("[data-product-grid]");
  if (!toolbar || !grid) return;

  toolbar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    productFilter = btn.getAttribute("data-filter");
    toolbar.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip === btn);
    });
    grid.innerHTML = renderProductGrid(productFilter);
    observeReveals();
  });
}

function buildMailtoBody(data) {
  const lines = [
    `Name: ${data.name}`,
    `Company: ${data.company || ""}`,
    `Email: ${data.email}`,
    `Market: ${data.market || ""}`,
    `Incoterm: ${data.incoterm || ""}`,
    `Product line: ${data.productLine || data.product || ""}`,
    `MOQ band: ${data.moqBand || ""}`,
    "",
    data.message,
  ];
  return lines.join("\n");
}

function bindContactForm() {
  const form = outlet.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const inquiries = JSON.parse(localStorage.getItem("jaat_inquiries") || "[]");
    inquiries.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem("jaat_inquiries", JSON.stringify(inquiries));

    const email = getBrand()?.contact?.email ?? "trade@jaatglobal.com";
    const subject = encodeURIComponent(`Jaat Global inquiry: ${data.productLine || data.product || "general"}`);
    const body = encodeURIComponent(buildMailtoBody(data));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    form.reset();
    showToast("Saved locally. Email draft opened in your mail app.");
  });
}

function applyMeta(path, productId) {
  const brandName = getBrand()?.name ?? "Jaat Global";
  let meta = routeMeta[path] ?? routeMeta["/"];

  if (path === "/products/detail" && productId) {
    const p = getProducts().find((x) => x.id === productId);
    meta = {
      title: `${brandName} | ${p?.name ?? productId}`,
      description: p?.description ?? routeMeta["/products"].description,
    };
  }

  document.title = meta.title;
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && meta.description) descEl.setAttribute("content", meta.description);
}

function render() {
  const { path, productId, params } = parseRoute();
  setActiveNav(path);
  closeMobileNav();

  if (path === "/products/detail") {
    outlet.innerHTML = productDetailView(productId);
  } else if (path === "/products") {
    outlet.innerHTML = productsView();
  } else if (path === "/importers") {
    outlet.innerHTML = importersView();
  } else if (path === "/export") {
    outlet.innerHTML = exportView();
  } else if (path === "/about") {
    outlet.innerHTML = aboutView();
  } else if (path === "/contact") {
    outlet.innerHTML = contactView({
      productId: params.get("product") || "",
    });
  } else {
    outlet.innerHTML = homeView();
  }

  applyMeta(path, productId);
  observeReveals();
  bindProductFilters();
  bindContactForm();
  window.scrollTo({ top: 0, behavior: path === "/" ? "auto" : "smooth" });
}

navToggle?.addEventListener("click", () => {
  const open = navPanel.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
});

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

window.addEventListener("hashchange", render);

let lastScroll = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (!header || document.body.classList.contains("nav-open")) return;
    header.style.transform = y > lastScroll && y > 80 ? "translateY(-100%)" : "translateY(0)";
    lastScroll = y;
  },
  { passive: true }
);

async function start() {
  await Promise.all([initCompany(), initSiteContent()]);
  if (!window.location.hash) {
    window.location.hash = "#/";
  }
  render();
}

start();
