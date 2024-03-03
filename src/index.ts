import { crawlPage } from "./crawl";
import { printReport } from "./report";

export async function main() {
  /// get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error("Usage: ts-node src/index.ts <url>");
    process.exit(1);
  }
  const url = args[0];
  console.log(`Crawling ${url}...`);

  const pages = await crawlPage(url, url, {});
  printReport(pages);
}

main();
