/** Site root URL. Works on localhost and GitHub Pages project sites (e.g. /Code_overflow/). */
export const siteRoot = new URL("../", import.meta.url);

/** Bump on every deploy. Keep in sync with index.html meta[name="jaat-site-version"]. */
export const SITE_VERSION = "20261020-5";

/** @deprecated Use SITE_VERSION */
export const DATA_VERSION = SITE_VERSION;

export function companyUrl(relativePath) {
  const url = new URL(relativePath.replace(/^\//, ""), siteRoot);
  if (/\.json$/i.test(relativePath)) {
    url.searchParams.set("v", DATA_VERSION);
  }
  return url.href;
}

/** Absolute URL for images and static files (safe with hash routing). */
export function assetUrl(relativePath) {
  if (!relativePath) return "";
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  return new URL(relativePath.replace(/^\//, ""), siteRoot).href;
}
