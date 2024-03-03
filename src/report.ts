export function printReport(pages: Record<string, number>): void {
  console.log("Report starting...");
  const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1]);
  for (const [url, count] of sortedPages) {
    console.log(`Found ${count} internal links to ${url}`);
  }
}
