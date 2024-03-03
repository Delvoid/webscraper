import JSDOM from "jsdom";

export function normalizeURL(baseURL: string, url: string): string {
  const urlObject = new URL(url, baseURL);
  let fullPath = `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}`;
  if (fullPath.endsWith("/")) {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

export function getURLsFromHTML(baseURL: string, html: string): string[] {
  const dom = new JSDOM.JSDOM(html);
  const links = Array.from(dom.window.document.querySelectorAll("a"));
  return links.map((link) => normalizeURL(baseURL, link.href));
}

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: Record<string, number>,
): Promise<Record<string, number>> {
  if (new URL(currentURL, baseURL).origin !== new URL(baseURL).origin) {
    return pages;
  }

  const normalizedCurrURL = normalizeURL(baseURL, currentURL);

  if (pages.hasOwnProperty(normalizedCurrURL)) {
    pages[normalizedCurrURL]++;
    return pages;
  }

  pages[normalizedCurrURL] = pages[normalizedCurrURL] =
    normalizedCurrURL === normalizeURL(baseURL, baseURL) ? 0 : 1;

  try {
    console.log(`Crawling ${currentURL}...`);
    const response = await fetch(currentURL);
    if (response.status >= 400) {
      console.error(`Error: Received HTTP status code ${response.status}`);
      return pages;
    }

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.includes("text/html")) {
      console.error("Error: The content type of the response is not text/html");
      return pages;
    }

    const htmlBody = await response.text();

    const urls = getURLsFromHTML(baseURL, htmlBody);

    for (const url of urls) {
      if (new URL(url, baseURL).origin === new URL(baseURL).origin) {
        await crawlPage(baseURL, url, pages); // Recursive call
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }

  return pages;
}
