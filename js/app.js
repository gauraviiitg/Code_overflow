import { initCompany, getBrand } from "./company.js";
import {
  homeView,
  productsView,
  aboutView,
  contactView,
  renderProductGrid,
} from "./views.js";

const outlet = document.querySelector("[data-outlet]");
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const toastEl = document.querySelector("[data-toast]");

let productFilter = "all";

function parseRoute() {
  const hash = window.location.hash.slice(1) || "/";
  const [pathPart, queryPart] = hash.split("?");
  const path = pathPart || "/";
  const params = new URLSearchParams(queryPart || "");
  return { path, params };
}

function setActiveNav(path) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const target = link.getAttribute("data-nav");
    link.classList.toggle("is-active", target === path);
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

function bindContactForm() {
  const form = outlet.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const inquiries = JSON.parse(localStorage.getItem("jaat_inquiries") || "[]");
    inquiries.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem("jaat_inquiries", JSON.stringify(inquiries));
    form.reset();
    showToast("Thanks. Saved locally. We’ll respond when the trade desk is live.");
  });
}

function render() {
  const { path, params } = parseRoute();
  setActiveNav(path);
  closeMobileNav();

  if (path === "/products") {
    outlet.innerHTML = productsView(productFilter);
  } else if (path === "/about") {
    outlet.innerHTML = aboutView();
  } else if (path === "/contact") {
    outlet.innerHTML = contactView({
      productId: params.get("product") || "",
    });
  } else {
    outlet.innerHTML = homeView();
  }

  const brandName = getBrand()?.name ?? "Jaat Global";
  document.title =
    path === "/"
      ? `${brandName} | Jaipur craft for EU gift importers, prelaunch`
      : `${brandName} | ${path.slice(1).charAt(0).toUpperCase()}${path.slice(2)}`;

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
  await initCompany();
  if (!window.location.hash) {
    window.location.hash = "#/";
  }
  render();
}

start();
