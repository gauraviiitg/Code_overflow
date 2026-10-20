/** Site root URL. Works on localhost and GitHub Pages project sites (e.g. /Code_overflow/). */
export const siteRoot = new URL("../", import.meta.url);

/** Bump when catalogue or site JSON changes so browsers refetch data. */
export const DATA_VERSION = "20261020-3";

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
