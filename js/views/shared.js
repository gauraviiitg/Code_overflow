import { escapeHtml } from "../content.js";
import { assetUrl } from "../paths.js";

export function mediaSrc(path) {
  return path ? escapeHtml(assetUrl(path)) : "";
}

export function cardsHtml(items = [], className = "info-grid") {
  if (!items.length) return "";
  return `<div class="${className}">
    ${items
      .map(
        (item) => `<article class="info-card reveal">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          ${item.href ? `<a class="text-link" href="${escapeHtml(item.href)}">Explore</a>` : ""}
        </article>`
      )
      .join("")}
  </div>`;
}

export function stepsHtml(items = [], className = "process-grid") {
  if (!items.length) return "";
  return `<div class="${className}">
    ${items
      .map((item, index) => {
        const title = typeof item === "string" ? item : item.title;
        const body = typeof item === "string" ? "" : item.body;
        return `<article class="process-step reveal">
          <span class="process-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(title)}</h3>
          ${body ? `<p>${escapeHtml(body)}</p>` : ""}
        </article>`;
      })
      .join("")}
  </div>`;
}

export function listHtml(items = [], className = "check-list") {
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function pageHeroHtml(label, title, lead, actions = "") {
  return `<section class="page-hero wrap">
    <p class="section-label reveal">${escapeHtml(label)}</p>
    <h1 class="section-title reveal">${escapeHtml(title)}</h1>
    ${lead ? `<p class="section-lead reveal">${escapeHtml(lead)}</p>` : ""}
    ${actions}
  </section>`;
}

export function ctaHtml(title, body, primaryLabel, primaryHref, secondaryLabel = "", secondaryHref = "") {
  return `<section class="section wrap">
    <div class="cta-panel reveal">
      <div>
        <p class="section-label">Next step</p>
        <h2 class="section-title">${escapeHtml(title)}</h2>
        <p class="section-lead">${escapeHtml(body)}</p>
      </div>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${escapeHtml(primaryHref)}">${escapeHtml(primaryLabel)}</a>
        ${
          secondaryLabel
            ? `<a class="btn btn-ghost" href="${escapeHtml(secondaryHref)}">${escapeHtml(secondaryLabel)}</a>`
            : ""
        }
      </div>
    </div>
  </section>`;
}
