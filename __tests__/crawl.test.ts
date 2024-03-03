import { getURLsFromHTML, normalizeURL } from "../src/crawl";

interface NormalizeURLParams {
  field: string;
  value: string;
  expectedMessage: string;
}
describe("Crawl", () => {
  describe("Normalizing URLs", () => {
    it.each<NormalizeURLParams>([
      {
        field: "url",
        value: "http://example.com/",
        expectedMessage: "http://example.com",
      },
      {
        field: "url",
        value: "http://example.com/path/",
        expectedMessage: "http://example.com/path",
      },

      {
        field: "url",
        value: "http://example.com/path",
        expectedMessage: "http://example.com/path",
      },

      {
        field: "url",
        value: "https://example.com/path/",
        expectedMessage: "https://example.com/path",
      },
    ])(
      "returns $expectedMessage when $field is $value",
      ({ field, value, expectedMessage }) => {
        const base = "http://example.com";
        const result = normalizeURL(base, value);
        expect(result).toBe(expectedMessage);
      },
    );
  });
  describe("Getting URLs from HTML", () => {
    it("should return an array of URLs", () => {
      const html = `
        <html>
          <body>
            <a href="http://example.com">Example</a>
            <a href="http://example.com/path">Example</a>
          </body>
        </html>
      `;

      const base = "http://example.com";
      const result = getURLsFromHTML(base, html);
      expect(result).toEqual(["http://example.com", "http://example.com/path"]);
    });
  });
});
