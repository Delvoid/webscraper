import { main } from "../src/index";

jest.mock("../src/crawl", () => ({
  crawlPage: jest.fn(),
}));

describe("main function", () => {
  let originalArgv: string[];
  let originalLog: typeof console.log;
  let originalError: typeof console.error;
  let originalExit: typeof process.exit;

  beforeEach(() => {
    // Store original process.argv
    originalArgv = process.argv;
    originalLog = console.log;
    originalError = console.error;
    originalExit = process.exit;

    // Mock
    console.log = jest.fn();
    console.error = jest.fn();
    process.exit = jest.fn() as unknown as typeof process.exit;
  });

  afterEach(() => {
    // Restore original process.argv and other globals
    process.argv = originalArgv;
    console.log = originalLog;
    console.error = originalError;
    process.exit = originalExit;
  });

  test("logs the correct message when a URL is provided", async () => {
    process.argv = ["node", "src/index.ts", "http://example.com"];
    await main();
    expect(console.log).toHaveBeenCalledWith("Crawling http://example.com...");
  });

  test("exits with error when no arguments are provided", async () => {
    process.argv = ["node", "src/index.ts"];
    await main();
    expect(console.error).toHaveBeenCalledWith(
      "Usage: ts-node src/index.ts <url>",
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test("exits with error when more than one argument is provided", async () => {
    process.argv = [
      "node",
      "src/index.ts",
      "http://example.com",
      "extraArgument",
    ];
    await main();
    expect(console.error).toHaveBeenCalledWith(
      "Usage: ts-node src/index.ts <url>",
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
