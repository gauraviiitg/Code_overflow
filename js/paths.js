/** Site root URL — works on localhost and GitHub Pages project sites (e.g. /Code_overflow/). */
export const siteRoot = new URL("../", import.meta.url);

export function companyUrl(relativePath) {
  return new URL(relativePath.replace(/^\//, ""), siteRoot).href;
}
