# Bharat Connect — company knowledge plan

This repo is the **single source of truth** for brand, catalogue, and export operations. The public website reads from the root (`brand/company.json`, `product-data/catalogue.json`). When you change facts here, the site should reflect them after refresh.

## Live site (GitHub Pages)

- **Repo:** https://github.com/gauraviiitg/Code_overflow
- **Public URL:** https://gauraviiitg.github.io/Code_overflow/ (after push to `main` and deploy)
- **Deploy:** `.github/workflows/pages.yml` on every push to `main`

## Folder map

| Path | Purpose | Audience |
|------|---------|----------|
| `brand/company.json` | Legal name, contacts, stats, Western markets, ports | Website + all decks |
| `brand/voice-western-buyers.md` | Tone, vocabulary, what to avoid with EU/UK/US buyers | Sales, website copy |
| `product-data/catalogue.json` | SKU lines, MOQ, lead times, HS hints | Website + quotes |
| `export/western-importer-onboarding.md` | First-shipment checklist for importers | Buyers (share as PDF later) |
| `export/documentation-matrix.md` | Which docs apply by product type | Internal + customs brokers |
| `sales/buyer-personas-west.md` | Who we sell to in the West | Marketing prioritisation |
| `legal/registrations-PLACEHOLDER.md` | Where IEC/GST certs live (never commit secrets) | Internal only |
| `improvements/backlog.md` | Living list of upgrades | You + anyone editing the site |

## Improvement loop (repeat weekly)

1. **Capture** — Add buyer questions, port delays, or certification gaps to `improvements/backlog.md`.
2. **Decide** — Pick one website change + one doc change per week (small batches).
3. **Update source data** — Edit JSON/markdown here first, not hard-coded copy in `js/`.
4. **Verify** — Run local server; click Products, For importers, Contact.
5. **Ship narrative** — Western buyers trust consistency: same MOQ on site, PDF, and email.

## Western-market priorities (default until you confirm)

- **Primary**: UK, Germany, Netherlands, USA, Canada.
- **Quote currency**: USD and EUR on request; document in proforma.
- **Ports**: FOB Mundra; CIF to Felixstowe, Rotterdam, NY/NJ, LA/LB.
- **Proof points**: Sample-led deals, third-party inspection, English documentation, timezone overlap.

## What not to store in git

- Bank details, full IEC/GST certificate scans with numbers, buyer contracts, pricing sheets with margins.
- Use `legal/` for filenames and checklists only; keep scans in a private drive.

## Next upgrades (suggested)

- [ ] Real product photography → `assets/photos/` + reference in `catalogue.json`
- [ ] One-page PDF “Importer brief” exported from `export/western-importer-onboarding.md`
- [ ] Case study PDF (anonymous buyer) in `sales/case-studies/`
- [ ] Live form → email/CRM (Formspree, HubSpot, Zoho)
