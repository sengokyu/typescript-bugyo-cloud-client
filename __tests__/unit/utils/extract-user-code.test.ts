import { extractUserCode } from "../../../src/utils/url-utils";
describe("extractUserCode", () => {
  it("URLからUserCodeを取り出します", () => {
    // Given
    const url = "https://example.com/foo/bar/baz";

    // When
    const actual = extractUserCode(url);

    // Then
    expect(actual).toBe("bar");
  });

  it("パスが短い時は例外スローします", () => {
    // Given
    const url = "https://example.com/foo";

    // Then
    expect(() => extractUserCode(url)).toThrow();
  });
});
